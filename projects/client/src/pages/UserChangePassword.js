import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import toast, { Toaster } from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UserChangePassword = () => {
    const navigate = useNavigate()
    const [userToken, setUserToken] = useState("")

    const onChangePassword = async (value) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/change-new-password`, {
                old_password: value.oldPassword,
                new_password: value.newPassword,
                confirm_password: value.confirmPassword
            }, {
                headers: {
                    'Authorization': userToken
                }
            })

            toast.success("Change password successful")
            setTimeout(() => {
                navigate('/users/my-profile')
            }, 2000)
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }

            // if current password not match
            if (error.response.data.message === 'Old Password Not Match')
                toast.error("Sorry, your current password is not match")

            console.log(error.response.data.message)
        }
    }
    
    const changePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required("Please fill your old password"),
        newPassword: Yup.string()
            .required("Please fill your new password"),
        confirmPassword: Yup.string()
            .required("Please re-enter your new password")
            .oneOf([Yup.ref('newPassword'), null], "Password must match")
    })
    
    const changePasswordForm = () => {
        return (
            <Formik
                initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
                validationSchema={changePasswordSchema}
                onSubmit={(values) => onChangePassword(values)}
            >
                <Form
                    className='flex flex-col 
                    items-start gap-5'
                >
                    <div className='flex flex-col w-full'>
                        <span>Current Password</span>
                        <Field 
                            type="password"
                            name="oldPassword"
                            placeholder="Your current passaword"
                            className="py-2 bg-white
                            border-b-2 border-slate-300
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="oldPassword"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col w-full'>
                        <span>New Password</span>
                        <Field 
                            type="password"
                            name="newPassword"
                            placeholder="Your new passaword"
                            className="py-2 bg-white
                            border-b-2 border-slate-300
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="newPassword"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col w-full'>
                        <span>Confirm New Password</span>
                        <Field 
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your new password"
                            className="py-2 bg-white
                            border-b-2 border-slate-300
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="confirmPassword"
                            className="text-red-500"
                        />
                    </div>

                    <div className='w-full mt-5'>
                        <Button
                            type='submit'
                            colorScheme='blue'
                            width='100%'
                        >
                            Update Password
                        </Button>
                    </div>
                </Form>
            </Formik>
        )
    }

    const onGetUserData = async () => {
        try {
            // get user token in local storage
            let token = localStorage.getItem('userToken')

            if (!token) throw { message: 'Token is missing' }

            // get users data
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/user-data`, {
                headers: {
                    'Authorization': token
                }
            })

            // set user token
            setUserToken(token)
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/users/login')
                }, 2000)
            }

            navigate('/users/login')
            console.log(error)
        }
    }

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
                        p-10 shadow-lg border-2 border-slate-200'
                    >
                        <h1 className='text-2xl font-semibold mb-10'>
                            Change New Password
                        </h1>

                        { changePasswordForm() }
                    </div>
                </div>
            </div>

            <div className='flex-shrink'>
                <Footer />
            </div>
        </div>
    )
}

export default UserChangePassword