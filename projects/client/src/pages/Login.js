import React, { useEffect } from 'react'
import axios from'axios'
import * as Yup from 'yup'
import toast, { Toaster } from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom';
import {FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle} from '@fortawesome/free-brands-svg-icons'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Login = ({ functions }) => {
    const navigate = useNavigate()

    const onLogin = async (value) => {
        try {
            let encodedMail = encodeURIComponent(value.emailOrPhoneNumber)
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/login?emailOrPhoneNumber=${encodedMail}&password=${value.password}`)

            toast("login success")
            localStorage.setItem('userToken', response.data.data.token)
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } catch (error) {
            toast(error.response.data.message)
        }
    }

    const loginSchema = Yup.object().shape({
        emailOrPhoneNumber: Yup.string()
            .required("Email or Phone Number is required"),
        password: Yup.string()
            .required("Password is required")
    })

    const loginViaGoogle = () => {
        window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/google`, "_self")
    }

    const loginViaFacebook = () => {
        window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/facebook`, "_self")
    }

    const loginForm = () => {
        return (
            <Formik
                initialValues={{ emailOrPhoneNumber: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={(values) => onLogin(values)}
            >
                <Form
                    className='flex flex-col items-start 
                    gap-5'
                >
                    <div className='flex flex-col gap-2 w-full'>
                        <Field 
                            type="text"
                            name="emailOrPhoneNumber"
                            placeholder="Email Address or Phone Number"
                            className="py-2 bg-white 
                            border-b-2 border-slate-500
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="emailOrPhoneNumber"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <Field 
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="py-2 bg-white 
                            border-b-2 border-slate-500
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="password"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex justify-end w-full'>
                        <Link to="/reset-password">Forgot Password?</Link>
                    </div>

                    <div className='flex justify-end items-end w-full mt-5'>
                        <Button
                            type='submit'
                            colorScheme='blue'
                            width='100%'
                        >
                            Sign In
                        </Button>
                    </div>
                </Form>
            </Formik>
        )
    }

    useEffect(() => {
        functions()
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
                        px-10 py-10 shadow-lg border-2 border-slate-200'
                    >
                        <h1 className='text-2xl font-semibold mb-5'>
                            Login
                        </h1>
                        
                        { loginForm() }
                        
                        <div className='mt-10 flex flex-col gap-5'>
                            <div className='w-full flex justify-between items-center'>
                                <hr className='w-[40%]' />
                                <span>OR</span>
                                <hr className='w-[40%]' />
                            </div>

                            <div className='flex flex-col gap-3'>
                                <Button
                                    type='submit'
                                    colorScheme='red'
                                    width='100%'
                                    onClick={() => loginViaGoogle()}
                                    className='flex gap-2 items-center'
                                >
                                    <FontAwesomeIcon icon={faGoogle} />
                                    <div>Continue using Google</div>
                                </Button>
                                <Button
                                    type='submit'
                                    colorScheme='facebook'
                                    width='100%'
                                    onClick={() => loginViaFacebook()}
                                    className='flex gap-2 items-center'
                                >
                                    <FontAwesomeIcon icon={faFacebook} />
                                    <div>Continue using Facebook</div>
                                </Button>
                            </div>
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

export default Login