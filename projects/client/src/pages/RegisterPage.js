import {useState} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, FormLabel, Input, FormErrorMessage, VStack } from '@chakra-ui/react'
import axios from 'axios'
import {FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebook, faGoogle} from '@fortawesome/free-brands-svg-icons'


const RegisterPage = () => {

  // const [data, setData] = useState({})
  const navigate = useNavigate()
  const onSubmit = async (values) => {
    try {
      //check database if username/email is already used

      let checkUsername = await axios.get(`${process.env.REACT_APP_SERVER_URL}users/checkusername?username=${values.username}`)
      let checkEmail = await axios.get(`${process.env.REACT_APP_SERVER_URL}users/checkemail?email=${values.email}`)
      
      if(checkUsername.data) throw toast.error('Username is taken')
      else if(checkEmail.data) throw toast.error('Email is already registered')
      else {
        let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/register`, {
          username: values.username,
          email: values.email,
          phone_number: values.phone_number,
          password: values.password,
          provider: 'website'
        })

        localStorage.setItem('myToken', response.data.data.token)

        toast.success('Register Successfull')
        setTimeout(() => {
          navigate('/users/verify')
        }, 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().min(3, 'Username must be at least 3 characters').required('Please fill in your username'),
      email: Yup.string().email("Invalid email address").required("please fill in your email"),
      phone_number: Yup.string()
      .matches(/^[0-9]+$/, "phone number must be all digits")
        .required('Please fill in your phone number'),
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

// spread operator (...formik.getFieldProps('fieldName')) is used to make the code easier to read, it's the same as defining the value, onChange, and onBlur method manually

  return (
    <>
      <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
        <div className="flex flex-col text-center align-middle p-4">
          <h1 className='text-xl font-bold'>Welcome to <span className='text-2xl text-cyan-500'>D'sewa</span></h1>
          <hr className='my-4'></hr>
          <Toaster position='top-center' />
          <VStack spacing={1} mt={2}>
            <FormControl isInvalid={formik.touched.username && formik.errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                  {...formik.getFieldProps('username')}
              />
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.touched.email && formik.errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps('email')}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.touched.phone_number && formik.errors.phone_number}>
              <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="Enter your phone number"
                {...formik.getFieldProps('phone_number')}
              />
              <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.touched.password && formik.errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
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
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
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
              Register
            </Button>
          </VStack>
          <div>
            <span className="form-divider"> Or </span>
            <br></br>
          </div>
        </div>
        <div className='flex justify-center flex-col align-middle text-center'>

          <Link>
            <Button className='mb-4' width='70%' colorScheme='red'>
              <FontAwesomeIcon className='mx-2' icon={faGoogle} />Continue using Google
            </Button>
          </Link>

          <Link to='http://localhost:8000/auth/facebook/callback'>
            <Button className='mb-4' width='70%' colorScheme='facebook'>
              <FontAwesomeIcon className='mx-2' icon={faFacebook} />Continue using Facebook
            </Button>
          </Link>
          </div>
        </div>
      </>
  )
}

export default RegisterPage