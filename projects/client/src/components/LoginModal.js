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

const LoginModal = ({ handleSidebar }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div>
            <Button
                bg="transparent" 
                color="black" 
                border="1px solid #53a8b6"
                _hover={{ bg: "#53a8b6", color: "white" }}
                onClick={onOpen}
            >
                Login
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Chose Login Type
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter className='flex flex-col gap-2'>
                        <Link to="/users/login" className='w-full'>
                            <Button 
                                colorScheme='blue'
                                width='100%'
                                onClick={() => {
                                    onClose()
                                    if (handleSidebar)
                                        handleSidebar()
                                }}
                            >
                                Login as User
                            </Button>
                        </Link>

                        <Link to="/tenant/login" className='w-full'>
                            <Button 
                                colorScheme='blue'
                                width='100%'
                                onClick={() => {
                                    onClose()
                                    if (handleSidebar)
                                        handleSidebar()
                                }}
                            >
                                Login as Tenant
                            </Button>
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default LoginModal