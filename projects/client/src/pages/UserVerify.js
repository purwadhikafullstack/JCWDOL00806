import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const UserVerify = () => {
    const inputOtp = useRef()
    const navigate = useNavigate()

    const [userToken, setUserToken] = useState("")
    const [userEmail, setUserEmail] = useState("")

    const onVerify = async () => {
        try {
            // get otp value
            let otp = inputOtp.current.value
            
            // validate token
            await axios.post(`http://localhost:8000/users/verify-otp`, {
                otp_number: otp
            }, {
                headers: {
                    'Authorization': userToken
                }
            })

            // navigate to landing page if verified
            toast.success("Your account is verified")
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }

            toast.error('Wrong or expired OTP. Please try again.')
            console.log(error.response.data.message)
        }
    }

    const onResendOtp = async () => {
        try {
            // resend otp to users email
            await axios.get(`http://localhost:8000/users/send-otp`, {
                headers: {
                    'Authorization': userToken
                }
            })

            // send notif if resend otp is success
            toast.success("Resend OTP successful")
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }
            
            if (error.response.data.message === "Resend OTP has reached the maximum limit")
                toast.error("Sorry, you have reached the maximum limit for resend OTP for today. Please try again later.")

            console.log(error.response.data.message)
        }
    }

    const onGetUserData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem('myToken')

            // get users data
            let response = await axios.get(`http://localhost:8000/users/verify-data`, {
                headers: {
                    'Authorization': token
                }
            })

            // if user is already verified, redirect to landing page
            if (response.data.data.is_verified)
                navigate('/')

            // set user token and email
            setUserToken(token)
            setUserEmail(response.data.data.email)

            // send first otp after register new user
            if (response.data.data.otp_count === 0)
                await axios.get(`http://localhost:8000/users/send-otp`, {
                    headers: {
                        'Authorization': token
                    }
                })
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }

            
            navigate('/users/login')

            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        onGetUserData()
    }, [])

    return (
        <div
            className='flex flex-col justify-center
            items-center py-10 px-3'
        >
            <Toaster />
            <div
                className='sm:w-[500px] w-full rounded-lg
                p-10 shadow-lg border-2 border-slate-200
                flex flex-col items-center'
            >
                <h1 className='font-bold text-[24px] mb-3'>
                    Account Verification
                </h1>
                <div 
                    className='bg-slate-100 
                    px-3 py-5 text-center rounded-lg
                    mb-5'
                >
                    We've sent a OTP to your email - {userEmail}
                </div>

                <div className='w-full'>
                    <input 
                        type="text"
                        ref={inputOtp}
                        placeholder='Enter OTP code'
                        className="py-2 px-2 bg-white w-full
                        border border-slate-500 rounded-lg
                        placeholder-slate-500 focus:outline-none"
                    />
                    <Button
                        type='submit'
                        colorScheme='blue'
                        width='100%'
                        className='my-5'
                        onClick={() => onVerify()}
                    >
                        Submit
                    </Button>
                </div>

                <div>
                    <span>Didn't get the code? {" "}</span>
                    <span 
                        className='cursor-pointer text-blue-800'
                        onClick={() => onResendOtp()}
                    >
                        Resend OTP
                    </span>
                </div>
            </div>
        </div>
    )
}

export default UserVerify