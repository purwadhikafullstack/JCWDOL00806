import React, { useRef } from 'react'
import { Divider, Flex, Text, Image, Button, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, useDisclosure } from '@chakra-ui/react'
import ConfirmAlert from './ConfirmAlert'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

const OrderCard = ({ id, start, end, status, name, tenantToken }) => {
  
  // const {isOpen, onOpen, onClose} = useDisclosure()
  // const actionRef = useRef()

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
                  <Text fontSize='xs'>Order # {id}</Text>
                  <Divider orientation='vertical' className='mx-5' />
                  <Text fontSize='xs'>Room name : {name}</Text>
              </Flex>
              <Divider className='my-2' />
            <Flex flexDir='row' alignItems='center'>
                <Flex flexDir='column' className='w-40'>
                    <Text fontSize='sm'>Status : </Text>
                    <Text fontSize='sm'>{status}</Text>
                </Flex>
                <Flex className='mx-12' flexDir='row' alignItems='center'>
                <Image
                boxSize='32px'
                objectFit='cover'
                src=''
                          alt=''
                          className='border rounded-md'
                      />
                      <Button colorScheme='blue' className='mx-4' size='xs'>view image</Button>
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
              <Button colorScheme='gray' className='mx-4' size='xs'>See Detail</Button>
             </Flex>
            </>
         )}
        </Flex>
      </>
  )
}

export default OrderCard