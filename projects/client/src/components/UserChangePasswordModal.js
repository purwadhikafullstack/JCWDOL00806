import React from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import toast, { Toaster } from 'react-hot-toast'
import { 
    Button, 
    Modal, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    useDisclosure,
    ModalBody,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const UserChangePasswordModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const onChangePassword = async (value) => {
        try {
            let userToken = localStorage.getItem("userToken")

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
            onClose()
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
            <ModalBody pb={6}>
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

                        <div className='mt-5 flex justify-end w-full'>
                            <Button colorScheme='blue' mr={3} type="submit">
                                Change Password
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </div>
                    </Form>
                </Formik>
            </ModalBody>
            
        )
    }

    return (
        <>
            <Toaster />
            <Button 
                marginTop={2}
                w="100%"
                onClick={onOpen}
                colorScheme="messenger"
            >
                Change your password
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change New Password</ModalHeader>
                    <ModalCloseButton />
                    {
                        changePasswordForm()
                    }
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserChangePasswordModal