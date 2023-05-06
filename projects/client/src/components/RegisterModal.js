import React from 'react'
import { Link } from 'react-router-dom'
import { 
    Button, 
    Modal, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    useDisclosure 
} from '@chakra-ui/react'

const RegisterModal = ({ handleSidebar }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div>
            <Button
                bg="#53a8b6;" 
                color="white"
                _hover={{ bg: "#53a8b6", color: "white" }}
                onClick={onOpen}
            >
                Register
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Chose Register Type
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter className='flex flex-col gap-2'>
                        <Link to="/users/register" className='w-full'>
                            <Button 
                                colorScheme='blue'
                                width='100%'
                                onClick={() => {
                                    onClose()
                                    if (handleSidebar)
                                        handleSidebar()
                                }}
                            >
                                Register as User
                            </Button>
                        </Link>

                        <Link to="/tenant/register" className='w-full'>
                            <Button 
                                colorScheme='blue'
                                width='100%'
                                onClick={() => {
                                    onClose()
                                    if (handleSidebar)
                                        handleSidebar()
                                }}
                            >
                                Register as Tenant
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default RegisterModal