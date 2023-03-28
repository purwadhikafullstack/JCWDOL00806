import React from 'react'
import {Flex, Heading} from '@chakra-ui/react'
import toast, {Toaster} from 'react-hot-toast'
import TenantNavbar from '../components/TenantNavbar'

const SalesReport = () => {
  return (
    <>
                <Toaster />
                <Flex flexDir="row">
                <TenantNavbar />
                    <Flex flexDir='column' className="ml-16 mt-3">
                        <Heading>Your Sales Report</Heading>
                        <Flex flexDir="column" className='border rounded-md p-3'>
                            <Flex flexDir="column">
  
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>  
              </>
  )
}

export default SalesReport