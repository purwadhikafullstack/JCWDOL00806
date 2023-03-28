import { useState, useEffect } from 'react'
import {useSearchParams, useNavigate} from 'react-router-dom'
import {Flex, Heading, Button, Text, Divider, Skeleton} from '@chakra-ui/react'
import TenantNavbar from '../components/TenantNavbar'
import OrderCard from '../components/OrderCard'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const TenantOrders = () => {
    
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [statusFilter, setStatusFilter] = useState("")
    const [orderList, setOrderList] = useState([])

    useEffect(() => {
        setStatusFilter(searchParams.get('status'))
        getOrderList()
    }, [statusFilter])


    const handleFilterClick = (event) => {
        setStatusFilter(event.target.name)
        navigate(`/tenant/orders?status=${event.target.name}`)
    }

    const getOrderList = async () => {
        let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/transaction/order-list?status=${searchParams.get('status')}`)
        setOrderList(response.data.data)
    }

    const OrderList = () => {
        console.log(orderList)
       return orderList.map((order, idx) => {
            return (
                    <OrderCard key={idx} id={order.id} start={order.start_date} end={order.end_date} status={order.status} name={order.name} />
            )
        })
        
    }

  return (
      <>
          {!orderList.length ? (
              <>
                <Toaster />
                <Flex flexDir="row">
                <TenantNavbar />
                    <Flex flexDir='column' className="ml-16 mt-3">
                        <Heading>Your orders</Heading>
                        <Flex flexDir="column" className='border rounded-md p-3'>
                            <Flex flexDir="column">
                                <Flex flexDir='row' gap={1.5} alignItems='center'>
                                    <Text as='b' className='mr-2' >Status :</Text>
                                    <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                    <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                    <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                    <Button colorScheme={statusFilter === "complete" ? "green" : null} onClick={handleFilterClick} name="complete" size='sm' variant='outline' >Complete</Button>
                                </Flex>
                                <Divider className='my-3' />
                                  <Skeleton>
                                      test
                                </Skeleton>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>  
              </>
          ): (
        <>
         <Toaster />
         <Flex flexDir="row">
            <TenantNavbar />
                <Flex flexDir='column' className="ml-16 mt-3">
                    <Heading>Your orders</Heading>
                    <Flex flexDir="column" className='border rounded-md p-3 w-[34em]'>
                        <Flex flexDir="column">
                            <Flex flexDir='row' gap={1.5} alignItems='center'>
                                <Text as='b' className='mr-2' >Status :</Text>
                                <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                <Button colorScheme={statusFilter === "complete" ? "green" : null} onClick={handleFilterClick} name="complete" size='sm' variant='outline' >Complete</Button>
                            </Flex>
                            <Divider className='my-3' />
                            <OrderList />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>  
        </>
          )}
        
      </>
  )
}

export default TenantOrders