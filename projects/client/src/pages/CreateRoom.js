import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { Button } from '@chakra-ui/react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const CreateRoom = () => {
    const { propertyID } = useParams()
    const navigate = useNavigate()

    const [tenantToken, setTenantToken] = useState("")

    const onCreateRoom = async (value) => {
        try {
            // create new room
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/room/create/${propertyID}`, {
                name: value.name,
                price: value.price,
                description: value.description,
                rules: value.rules
            }, {
                headers: { 'Authorization': tenantToken }
            })

            // navigate to tenant room
            toast.success("Create room success")
            setTimeout(() => {
                navigate(`/tenant/room/${propertyID}`)
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const roomSchema = Yup.object().shape({
        name: Yup.string()
            .required("Room name is required"),
        price: Yup.number()
            .positive("Price must be a positive number")
            .integer()
            .required("Room price is required or price must be a number"),
        description: Yup.string()
            .required("Room description is required."),
        rules: Yup.string()
            .required("Room rules is required")
    })

    const roomForm = () => {
        return (
            <Formik
                initialValues={{ name: "", price: "", description: "", rules: "" }}
                validationSchema={roomSchema}
                onSubmit={(values) => onCreateRoom(values)}
            >
                <Form
                    className='flex flex-col 
                    items-start gap-5'
                >
                    <div className='flex flex-col gap-2 w-full'>
                        <span>Name</span>
                        <Field 
                            type="text"
                            name="name"
                            placeholder="Room name"
                            className="py-2 px-2 bg-white w-full
                            border border-slate-500 rounded-lg
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="name"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <span>Price</span>
                        <Field 
                            type="number"
                            name="price"
                            placeholder="Room price"
                            className="py-2 px-2 bg-white w-full
                            border border-slate-500 rounded-lg
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="price"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <span>Description</span>
                        <Field 
                            as="textarea"
                            name="description"
                            placeholder="Room Description"
                            className="py-2 px-2 bg-white w-full
                            border border-slate-500 rounded-lg
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="description"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <span>Rules</span>
                        <Field 
                            as="textarea"
                            name="rules"
                            placeholder="Room Description"
                            className="py-2 px-2 bg-white w-full
                            border border-slate-500 rounded-lg
                            placeholder-slate-500 focus:outline-none"
                        />
                        <ErrorMessage 
                            component="div"
                            name="rules"
                            className="text-red-500"
                        />
                    </div>

                    <div className='flex justify-end items-end w-full mt-5'>
                        <Button
                            type='submit'
                            colorScheme='green'
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </Formik>
        )
    }

    const onGetUserData = async () => {
        try {
            // get tenant token in local storage
            let token = localStorage.getItem('tenantToken')
            if (!token) throw { message: 'Token is missing' }

            // check if property id belong to tenant or not
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/get-data/${propertyID}?page=1`, {
                headers: { 'Authorization': token }
            })

            // set room data and token
            setTenantToken(token)
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response?.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/tenant/login')
                }, 2000)
            }
            // navigate to 401 page if not belongs to user
            else if (error.response?.data.message === 'Property ID Not Belongs To User') {
                navigate('/401')
            } 
            else {
                navigate('/tenant/login')
            }
        }
    }

    useEffect(() => {
        onGetUserData()
    }, [])

    return (
        <div
            className='flex flex-col justify-center
            items-center py-10 px-3'
        >
            <Toaster />
            <div
                className='sm:w-[500px] w-full rounded-lg
                p-10 shadow-lg border-2 border-slate-200'
            >
                <h1 className='text-2xl font-semibold mb-5'>
                    Create Room
                </h1>

                { roomForm() }
            </div>
        </div>
    )
}

export default CreateRoom