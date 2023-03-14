import {useState, useEffect} from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, FormLabel, Input, FormErrorMessage, VStack } from '@chakra-ui/react'
import axios from 'axios'


const ChangeEmail = () => {

    const [userID, setUserID] = useState("")

    useEffect(() => {
        getUserDetail()
    }, [])

    const onSubmit = async (values) => {
        try {
            console.log(values)
            await axios.patch(`${process.env.REACT_APP_SERVER_URL}users/change-email/${userID}`, {
                email : values.email
            })
            toast.success("Email successfully changed")
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    }

    const getUserDetail = async () => {
        let token = localStorage.getItem('myToken'.replace(/"/g, ""))
        let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/getuser`, null,
            { headers: { authorization: token } })

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
                    Register
                    </Button>
                </VStack>
            </div>
        </div>
      </>
  )
}

export default ChangeEmail