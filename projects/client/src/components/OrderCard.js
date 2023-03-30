import React, { useRef, useState } from 'react'
import { Divider, Flex, Text, Image, Button, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Box } from '@chakra-ui/react'
import ConfirmAlert from './ConfirmAlert'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

const OrderCard = ({ id, invoice, start, end, status, name, tenantToken, image, onClose, notes }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = async (orderID, notes) => {
    console.log(`cancel ${orderID}`)
    console.log(`notes : ${notes}`)

    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/transaction/tenant-order-status/${id}?status=cancel`, {
      notes
    }, { headers: { authorization: tenantToken } })
    toast.success("Order Cancelled")
    setTimeout(() => {
      window.location.reload()
    }, 1500);

  }

  const handleReject = async (orderID, notes) => {
    console.log(`reject ${orderID}`)
    console.log(`notes : ${notes}`)
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/transaction/tenant-order-status/${id}?status=reject`, {
      notes
    }, { headers: { authorization: tenantToken } })
    toast.success("Order Rejected")
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  }

  const handleAccept = async (orderID, notes) => {
    console.log(`accept ${orderID}`)
    console.log(`notes : ${notes}`)
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/transaction/tenant-order-status/${id}?status=complete`, null , { headers: { authorization: tenantToken } })
    toast.success("Order Accepted")
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  }

  return (
    <>
      <Toaster />
        <Flex className='p-2 mx-auto w-full mb-1 mt-1 border rounded-md' flexDir='column'>
            <Flex flexDir='row' className=''>
                  <Text className='w-2/5' color='gray' fontSize='xs'> {invoice} </Text>
                  <Divider orientation='vertical' className='mx-5' />
                  <Text fontSize='xs'>Room name : {name}</Text>
              </Flex>
              <Divider className='my-2' />
            <Flex flexDir='row' alignItems='center'>
                <Flex flexDir='column' className='w-2/6'>
                    <Text fontSize='sm'>Status : </Text>
                    <Text fontSize='sm'>{status}</Text>
                </Flex>
                <Flex className='mx-12 w-1/4' flexDir='row' alignItems='center'>
                      <Image
                        boxSize='32px'
                        objectFit='cover'
                        src=''
                        alt=''
                        className='border rounded-md'
                      />
            <Button onClick={handleOpenModal} colorScheme='blue' className='mx-4' size='xs'>view image</Button>
            <Modal isOpen={isModalOpen} onClose={onClose}>
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>Payment Proof</ModalHeader>
                  <ModalCloseButton onClick={() => setIsModalOpen(false)} />
                  <ModalBody>
                    <Image boxSize='full' objectFit='cover' src={image} />
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
                </Flex>
                <Flex flexDir='column' className=''>
                    <Text fontSize='sm'>Start Date : {start}</Text>
                    <Text fontSize='sm'>End Date : {end} </Text>
                  </Flex>
            </Flex>  
        <Divider className='mt-2' />
        {status === 'Waiting for Confirmation' ? (
          <>
          <Flex flexDir='row' justifyContent='space-between' >
                  <Flex justifyContent='flex-start'>
                    <ConfirmAlert action='Cancel' id={id} handleButton={handleCancel}/>
                  </Flex>
                  <Flex justifyContent='flex-end'>
                    <ConfirmAlert action='Reject' id={id} handleButton={handleReject}/>
                    <ConfirmAlert action='Accept' id={id} handleButton={handleAccept}/>
                  </Flex>
              </Flex>
          </>
        ) : (
            <>
              <Flex flexDir='row' className='mt-2' justifyContent='flex-end' >
                <Button onClick={() => setDetailModal(true)} colorScheme='gray' className='mx-4' size='xs'>See Detail</Button>
                <Modal isOpen={detailModal} onClose={onClose}>
                  <ModalOverlay>
                    <ModalContent>
                      <ModalHeader className='italic' color='gray'>{invoice}</ModalHeader>
                      <Divider />
                      <ModalCloseButton onClick={() => setDetailModal(false)} />
                        <ModalBody>
                          <Flex flexDir='column' gap={1}>
                            <Flex flexDir='row'>
                              <Text>Status : </Text>
                              <Text className='ml-2 italic font-bold' >{status }</Text>
                            </Flex>
                            <Flex flexDir='row'>
                              <Text>Start date : </Text>
                              <Text className='ml-2' >{start}</Text>
                            </Flex>
                            <Flex flexDir='row'>
                              <Text>End date : </Text>
                              <Text className='ml-2' >{end}</Text>
                            </Flex> 
                            <Box className='mb-2 mt-2 px-3 py-2 h-28' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                              <Text className='' color='gray'>Notes : </Text>
                              {notes}
                            </Box>
                          </Flex>
                        </ModalBody>
                    </ModalContent>
                  </ModalOverlay>
                </Modal>
             </Flex>
            </>
         )}
        </Flex>
      </>
  )
}

export default OrderCard