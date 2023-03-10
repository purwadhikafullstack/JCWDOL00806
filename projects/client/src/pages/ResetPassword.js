import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, FormLabel, Input, FormErrorMessage, VStack} from '@chakra-ui/react'
import axios from 'axios'

const ResetPassword = () => {
    const [confirmed, setConfirmed] = useState(false)
    const onSubmit = async (values) => {
        try {
            let checkEmail = await axios.get(`${process.env.REACT_APP_SERVER_URL}users/userdetail?email=${values.email}`)
            console.log(checkEmail)
            if (checkEmail.data.data[0].provider !== 'website') {
                throw toast.error(`This email is registered via ${checkEmail.data.data[0].provider}. Reset password is prohibited`)
            } else if (checkEmail.data.data[0].is_verified !== true) {
                throw toast.error('Please proceed to verify your account before using reset password feature')
            } else {
                await axios.get(`${process.env.REACT_APP_SERVER_URL}users/reset-confirm?email=${values.email}&id=${checkEmail.data.data[0].id}`)
                setConfirmed(true)
            }
        } catch (error) {
            // console.log(error)
        }
    }

    const formik = useFormik({
        initialValues: {
            email : ''
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid email address').required("Please fill in your email")
        }),
        onSubmit: (values) => {
            onSubmit(values)
        }
    })

    return (
        <>
            {confirmed ? (
                <>
                <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
                    Please check your email to reset your password
                </div>
                </>
            ) : (
                <>
                <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
                    <Toaster position='top-center'/>
                    <VStack spacing={1} mt={2}>
                        <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                            <FormLabel htmlFor='email'>Please input your email to reset your password</FormLabel>
                            <Input
                                id='email'
                                email='email'
                                placeholder='Enter your email'
                                {...formik.getFieldProps('email')}
                            />
                            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                        </FormControl>
                        <Button mt="6 !important" width='71%' colorScheme="blue" type="submit" onClick={formik.handleSubmit}>
                            Confirm your email
                        </Button>
                    </VStack>
                </div>
                </>
            )}
        </>
  )
    
}

export default ResetPassword