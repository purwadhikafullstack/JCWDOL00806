import {useState, useEffect} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {Button, FormControl, FormLabel, Input, FormErrorMessage, VStack} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'


const NewPassword = () => {

    const navigate = useNavigate()

    const [complete, setComplete] =useState(false)
    const [checked, setChecked] = useState(false)
    const [userData, setUserData] = useState()
    const { id } = useParams()
    
    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = async () => {
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-token/${id}`)
        if (response.data.data !== null) {
            setUserData(response.data.data)
            setChecked(true)
        }
    }

    const onSubmit = async (values) => {
        await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/change-password/${userData?.id}`, { password: values.password })
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
              <div className='sm:w-[500px] sm:mx-auto mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
                     <p> Reset password successfull !!</p>
                      <p>Please proceed to login page with your new password</p>
              </div>
              </>
          ) : !checked ? (
                  <>
                    <div className='sm:w-[500px] sm:mx-auto mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
                     <p>The link you've submitted is invalid</p>
                     <p>Please check the link again or resubmit reset password</p>
              </div>
                  </>
              ): (
            <>
            <div className='sm:w-[500px] sm:mx-auto mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
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
            </>          
        
          )}
    </>
  )
}

export default NewPassword