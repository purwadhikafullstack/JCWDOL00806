import React from 'react'
import {Flex, Heading} from '@chakra-ui/react'
import TenantNavbar from '../components/TenantNavbar'

const TenantOrders = () => {
  return (
      <>
        <Flex flexDir="row">
        <TenantNavbar />
            <Flex flexDir='column' className="ml-16 mt-3">
                <Heading>Your orders</Heading>
                <Flex flexDir="column" className='border rounded-md'>
                      <Flex flexDir="column">
                          
                      </Flex>
                </Flex>
            </Flex>
        </Flex>
      </>
  )
}

export default TenantOrders