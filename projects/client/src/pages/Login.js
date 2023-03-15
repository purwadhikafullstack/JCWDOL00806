import React from 'react'
import axios from'axios'
import * as Yup from 'yup'
import toast, { Toaster } from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()

    const onLogin = async (value) => {
        try {
            console.log(value.email)
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/login?email=${value.email}&password=${value.password}`)

            toast("login success")
            localStorage.setItem('myToken', response.data.data.token)
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } catch (error) {
            toast(error.response.data.message)
        }
    }

    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
    })

    const loginViaGoogle = () => {
        window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self")
    }

    const loginViaFacebook = () => {
        window.open(`${process.env.REACT_APP_SERVER_URL}/auth/facebook`, "_self")
    }

    const loginForm = () => {
        return (
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={(values) => onLogin(values)}
            >
                <Form
                    className='flex flex-col items-start 
                    gap-5'
                >
                    <div className='flex flex-col gap-2 w-full'>
                        <Field 
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="py-2 bg-white 
                            border-b-2 border-slate-500
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="email"
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
                        <Link to="/password/reset">Forgot Password?</Link>
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

    return (
        <section
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
                        >
                            LOGIN WITH GOOGLE
                        </Button>
                        <Button
                            type='submit'
                            colorScheme='facebook'
                            width='100%'
                            onClick={() => loginViaFacebook()}
                        >
                            LOGIN WITH FACEBOOK
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login