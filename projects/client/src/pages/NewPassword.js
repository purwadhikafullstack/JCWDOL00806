import {useState} from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {Button, FormControl, FormLabel, Input, FormErrorMessage, VStack} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'


const NewPassword = () => {

    const navigate = useNavigate()

    const [complete, setComplete] =useState(false)

    const {id} = useParams()
    const onSubmit = async (values) => {
        await axios.patch(`${process.env.REACT_APP_SERVER_URL}/users/change-password/${id}`, { password: values.password })
        setComplete(true)
        setTimeout(() => {
            navigate('/users/login')
          }, 2000)
    }

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
            .required("please fill in your password")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must have at least 8 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
            confirmPassword: Yup.string()
            .required("Please re-enter your password")
            .oneOf([Yup.ref('password'), null], "Passwords must match")
        }),
        onSubmit: (values) => {
            onSubmit(values)
        }
    })
  return (
      <>
          {complete ? (
              <>
              <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
                     <p> Reset password successfull !!</p>
                      <p>Please proceed to login page with your new password</p>
              </div>
              </>
          ): (       
        <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
            <Toaster position='top-center'/>
            <VStack spacing={1} mt={2}>
                <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                    <FormLabel htmlFor="password">Enter your new password</FormLabel>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            {...formik.getFieldProps('password')}
                        />
                        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl
                    isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                >
                    <FormLabel htmlFor="confirmPassword">Confirm your new password</FormLabel>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...formik.getFieldProps('confirmPassword')}
                    />
                    <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                <Button mt="6 !important" width='71%' colorScheme="blue" type="submit" onClick={formik.handleSubmit}>
                    Reset Password
                </Button>
            </VStack>
        </div>
          )}
    </>
  )
}

export default NewPassword