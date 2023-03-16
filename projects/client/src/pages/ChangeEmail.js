import {useState, useEffect} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, FormLabel, Input, FormErrorMessage, VStack, Alert, AlertTitle, AlertIcon, AlertDescription } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const ChangeEmail = () => {

    const navigate = useNavigate()

    const [userID, setUserID] = useState("")
    const [provider, setProvider] = useState("")

    useEffect(() => {
        getUserDetail()
    }, [])

    const onSubmit = async (values) => {
        try {
            console.log(values)
            await axios.patch(`${process.env.REACT_APP_SERVER_URL}/users/change-email/${userID}`, {
                email : values.email
            })
            toast.success("Email successfully changed, Please verify your account")
            localStorage.clear()
            setTimeout(() => {
                navigate('/users/verify')
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    }

    const getUserDetail = async () => {
        let token = localStorage.getItem('myToken'.replace(/"/g, ""))
        let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/getuser`, null,
            { headers: { authorization: token } })
        console.log(response.data.data[0])
        setProvider(response.data.data[0].provider)
        setUserID(response.data.data[0].id)
    }

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email("Invalid email address").required("Please fill in your email")
        }),
        onSubmit: (values) => {
            onSubmit(values)
        }

    })

  return (
      <>
          {provider !== "website" ? (
           <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
              <Alert
              status='error'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='200px'
            >
              <AlertIcon boxSize='40px' mr={0} />
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                          You are logged in using {provider}
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                This feature is disabled for users who are logged in using {provider}
              </AlertDescription>
                  </Alert>
            </div>
          ) : (
           <div className='mx-2 my-4 flex flex-col text-center align-middle p-4 border rounded-lg border-gray-300 drop-shadow-lg'>
            <Toaster position='top-center'/>
            <div className="flex flex-col text-center align-middle p-4">
                <VStack>
                    <FormControl>
                        <FormLabel htmlFor='email'>Input your new email</FormLabel>
                            <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            {...formik.getFieldProps('email')}
                            />
                        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                    </FormControl>
                      
                    <Button mt="6 !important" width='71%' colorScheme="blue" type="submit" onClick={formik.handleSubmit}>
                    Submit
                    </Button>
                </VStack>
            </div>
        </div>   
        )}
        
      </>
  )
}

export default ChangeEmail