import React, { useEffect, useRef, useState } from 'react'
import { Button, PinInput, PinInputField, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UserVerify = () => {
    const inputOtp = useRef()
    const navigate = useNavigate()

    const [otp, setOtp] = useState("");
    const [userToken, setUserToken] = useState("")
    const [userEmail, setUserEmail] = useState("")

    const onVerify = async () => {
        try {
            // validate token
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/verify-otp`, {
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
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/send-otp`, {
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
            let token = localStorage.getItem('userToken')

            if (!token) throw { message: 'Token is missing' }

            // get users data
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/user-data`, {
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
                await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/send-otp`, {
                    headers: {
                        'Authorization': token
                    }
                })
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response?.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }

            navigate('/users/login')

            console.log(error.response.data.message)
        }
    }

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    useEffect(() => {
        onGetUserData()
    }, [])

    return (
        <div className='flex flex-col min-h-screen overflow-hidden'>
            <div className='relative z-10 border shadow-md'>
                <Navbar />
            </div>

            <div className='flex-1'>
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
                            <HStack className='flex justify-center py-2'>
                                <PinInput onChange={handleOtpChange}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>

                            <Button
                                type='submit'
                                colorScheme='blue'
                                width='100%'
                                className='my-5'
                                onClick={() => onVerify()}
                                isDisabled={otp.length < 6}
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
            </div>

            <div className='flex-shrink'>
                <Footer />
            </div>
        </div>
    )
}

export default UserVerify