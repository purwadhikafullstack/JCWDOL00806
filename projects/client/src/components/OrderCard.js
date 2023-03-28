import React from 'react'
import {Divider, Flex, Text, Image} from '@chakra-ui/react'
const OrderCard = ({id, start, end, status, name}) => {
  return (
      <>
        <Flex className='p-2 mx-auto w-full mb-3 mt-1 border rounded-md' flexDir='column'>
            <Flex flexDir='row' className=''>
                  <Text fontSize='xs'>Order # {id}</Text>
                  <Divider orientation='vertical' className='mx-5' />
                  <Text fontSize='xs'>Room name : {name}</Text>
              </Flex>
              <Divider className='mt-2' />
            <Flex flexDir='row'>
                <Flex flexDir='column' className='w-40'>
                    <Text fontSize='sm'>Status : </Text>
                    <Text fontSize='sm'>{status}</Text>
                </Flex>
                <Flex className='ml-3'>
                    <Image /> Payment proof
                </Flex>
                <Flex flexDir='column' className='ml-5'>
                    <Text fontSize='sm'>Start Date : {start}</Text>
                    <Text fontSize='sm'>End Date : {end} </Text>
                </Flex>
            </Flex>  
        </Flex>
      </>
  )
}

export default OrderCard