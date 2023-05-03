import React, { useRef, useState } from 'react'
import { Divider, Flex, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Box } from '@chakra-ui/react'
import ConfirmAlert from './ConfirmAlert'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

const OrderCard = ({ id, invoice, start, end, status, name, tenantToken, image, onClose, notes,property, price, users_id, rules, refresh, screen }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

  const handleCancel = async (orderID, notes) => {

    await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/tenant-order-status/${id}?status=cancel`, {
      notes
    }, { headers: { authorization: tenantToken } })
    toast.success("Order Cancelled")
    refresh()

  }

  const handleReject = async (orderID, notes) => {
    
    await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/tenant-order-status/${id}?status=reject`, null , { headers: { authorization: tenantToken } })
    toast.success("Order Rejected")
    refresh()
  }

  const handleAccept = async (orderID, notes) => {
    await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/tenant-accept/${id}?users_id=${users_id}`, {
      invoice,
      property,
      room : name,
      start,
      end,
      price,
      rules
    } , { headers: { authorization: tenantToken } })
    toast.success("Order Accepted")
    refresh()
  }

  return (
    <>
        <Toaster />
      {screen ? (
        // smaller screen
        <>
        <Flex className='py-2 px-1 mx-auto w-full mb-1 mt-1 border rounded-md' flexDir='column'>
            <Flex flexDir='row' className=''>
                  <Text className='w-full font-bold italic' ml={2} fontSize='xs'> {invoice} </Text>
            </Flex>
            <Divider className='my-2' />
            <Flex className='flex-col sm:flex-row' ml={2} alignItems='left' justifyContent="space-between">
              <Flex flexDir='column' className='w-full'>
                <Flex flexDir='column' className='mb-3'>
                  <Flex className='mt-1' flexDir="row">
                    <Text as="b" fontSize='sm'>Start Date</Text>
                    <Text className='ml-11'>: {start}</Text>
                  </Flex>
                  <Flex flexDir="row">
                    <Text as="b" fontSize='sm' className='mr-1'>End Date</Text>
                    <Text className='ml-12'>: {end}</Text>
                  </Flex>
                </Flex>
                <Flex className=' mt-[2px]'  flexDir='row'>
                  <Text as="b" className='mr-3' fontSize='sm'>Property name</Text>
                  <Text fontSize='sm'>: {property}</Text>
                </Flex>
                <Flex className=' mt-[2px]' flexDir='row'>
                  <Text as="b" className='mr-8' fontSize='sm'>Room name</Text>
                  <Text fontSize='sm'>: {name}</Text>
                </Flex>
                <Flex className='border-b-2 pb-2 mt-[2px]'  flexDir='row'>
                  <Text as="b" className='mr-16' fontSize='sm'>Status</Text>
                  <Text className='ml-1' fontSize='sm'>: {status} </Text>
                </Flex>
                <Flex flexDir='row' className='mt-1'>
                  <Text as="b" className='mr-10' fontSize='sm'>Total Price</Text>
                  <Text className='font-bold' fontSize='sm'>: {formatter.format(price)}</Text>
                </Flex>
              </Flex>
              <Flex className='w-full mt-3 sm:ml-16' flexDir='row' alignItems='center'>
                <Image
                  boxSize='48px'
                  objectFit='cover'
                  src={image}
                  alt='payment-proof'
                  className='border rounded-md mb-2'
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
            ) : status === 'Waiting for Payment' ? (
                <>
            <Flex flexDir='row' justifyContent='space-between' >
              <Flex justifyContent='flex-start'>
                <ConfirmAlert action='Cancel' id={id} handleButton={handleCancel}/>
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
                              <Text as="b" >Status : </Text>
                              <Text className='ml-2 italic font-bold' >{status }</Text>
                            </Flex>
                            <Flex flexDir='row'>
                              <Text as="b" >Start date : </Text>
                              <Text className='ml-2' >{start}</Text>
                            </Flex>
                            <Flex flexDir='row'>
                              <Text as="b" >End date : </Text>
                              <Text className='ml-2' >{end}</Text>
                            </Flex> 
                            <Box className='mb-2 mt-2 px-3 py-2 h-28' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                              <Text as="b" className='' color='gray'>Notes : </Text>
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
      ) : (
          // desktop screen
          <>
            <Flex className='py-2 px-3 mx-auto w-full mb-1 mt-1 border rounded-md' flexDir='column'>
            <Flex flexDir='row' className=''>
                  <Text className='w-2/5 font-bold italic' ml={2} fontSize='xs'> {invoice} </Text>
              </Flex>
              <Divider className='my-2' />
            <Flex flexDir='row' alignItems='center'>
          <Flex flexDir='column' className='w-[37%]'>
            <Flex className=' mt-[2px]'  flexDir='row'>
              <Text as="b"  className='mr-3' fontSize='sm'>Property name</Text>
              <Text fontSize='sm'>: {property}</Text>
            </Flex>
            <Flex className=' mt-[2px]' flexDir='row'>
              <Text as="b"  className='mr-[30px]' fontSize='sm'>Room name</Text>
              <Text fontSize='sm'>: {name}</Text>
            </Flex>
            <Flex className='border-b-2 pb-2 mt-[2px]'  flexDir='row'>
              <Text as="b"  className='mr-16' fontSize='sm'>Status</Text>
              <Text className="ml-1" fontSize='sm'>: {status} </Text>
            </Flex>
            <Flex flexDir='row' className='mt-1'>
              <Text as="b"  className='mr-9' fontSize='sm'>Total Price</Text>
              <Text className='font-bold' fontSize='sm'>: {formatter.format(price)}</Text>
            </Flex>
                </Flex>
                <Flex className='mx-12 w-1/4' flexDir='row' alignItems='center'>
                      <Image
                        boxSize='32px'
                        objectFit='cover'
                        src={image}
                        alt='payment-proof'
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
                <Flex flexDir='column' className='mb-3'>
                  <Flex className='mt-1' flexDir="row">
                    <Text as="b" fontSize='sm'>Start Date</Text>
                    <Text className='ml-4'>: {start}</Text>
                  </Flex>
                  <Flex flexDir="row">
                    <Text as="b" fontSize='sm' className='mr-1'>End Date</Text>
                    <Text className='ml-5'>: {end}</Text>
                  </Flex>
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
        ) : status === 'Waiting for Payment' ? (
          <>
      <Flex flexDir='row' justifyContent='space-between' >
        <Flex justifyContent='flex-start'>
          <ConfirmAlert action='Cancel' id={id} handleButton={handleCancel}/>
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
      )}
      
      </>
  )
}

export default OrderCard