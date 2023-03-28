import React from 'react'
import {Divider, Flex, Text, Image, Button} from '@chakra-ui/react'
const OrderCard = ({id, start, end, status, name}) => {
  return (
      <>
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
                <Flex className='mx-16' flexDir='column' alignItems='center'>
                <Image
                boxSize='32px'
                objectFit='cover'
                src=''
                          alt=''
                          className='border rounded-md'
                      />
                      <Button colorScheme='blue' className='mt-2' size='xs'>view image</Button>
                </Flex>
                <Flex flexDir='column' className=''>
                    <Text fontSize='sm'>Start Date : {start}</Text>
                    <Text fontSize='sm'>End Date : {end} </Text>
                  </Flex>
            </Flex>  
              <Divider className='mt-2' />
              <Flex flexDir='row' justifyContent='space-between' >
                  <Flex justifyContent='flex-start'>
                      <Button colorScheme='red' className='mt-2 mx-1' size='xs'>Cancel</Button>
                  </Flex>
                  <Flex justifyContent='flex-end'>
                      <Button colorScheme='yellow' className='mt-2 mx-1' size='xs'>Reject</Button>
                    <Button colorScheme='green' className='mt-2 mx-1' size='xs'>Accept</Button>
                  </Flex>
                
                
              </Flex>
        </Flex>
      </>
  )
}

export default OrderCard