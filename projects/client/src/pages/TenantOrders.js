import { useState, useEffect } from 'react'
import {useSearchParams, useNavigate} from 'react-router-dom'
import {Flex, Heading, Button, Text, Divider, Skeleton} from '@chakra-ui/react'
import TenantNavbar from '../components/TenantNavbar'
import OrderCard from '../components/OrderCard'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'

const TenantOrders = () => {
    
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [statusFilter, setStatusFilter] = useState("")
    const [orderList, setOrderList] = useState([])
    const [noTransaction, setNoTransaction] = useState(false)
    const [tenantToken, setTenantToken] = useState("")
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState()


    useEffect(() => {
        setStatusFilter(searchParams.get('status'))
        getOrderList()
    }, [statusFilter])


    const handleFilterClick = (event) => {
        setStatusFilter(event.target.name)
        setPage(1)
        navigate(`/tenant/orders?status=${event.target.name}`)
    }

    const getOrderList = async () => {
        try {
            let token = localStorage.getItem('tenantToken'.replace(/"/g, ""))
        setTenantToken(token)

        let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/transaction/order-list?status=${searchParams.get('status')}&page=1`,
            { headers: { authorization: token } })
        
        if (!response.data.data.length) setNoTransaction(true)
        else setNoTransaction(false)
        console.log(response)    
            setOrderList(response.data.data)
            setPageCount(response.data.total_pages)
            
        } catch (error) {
            console.log(error)
        }

    }

    const OrderList = () => {
        console.log(orderList)
       return orderList.map((order, idx) => {
            return (
                <OrderCard
                    key={idx}
                    id={order.id}
                    start={order.start_date}
                    end={order.end_date}
                    status={order.status}
                    name={order.name}
                    tenantToken={tenantToken}
                />
            )
        })
    }

    const handlePageChange = async (selected_page) => {
        try {
            let current_page = selected_page.selected + 1

            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/transaction/order-list?status=${searchParams.get('status')}&page=${current_page}`,
                { headers: { authorization: tenantToken } })
            
            setPage(current_page)
            setOrderList(response.data.data)
            setPageCount(response.data.total_pages)
            
        } catch (error) {
            
        }
    }

  return (
      <>
          {noTransaction ? (
              <>
                <Toaster />
                <Flex flexDir="row">
                <TenantNavbar />
                    <Flex flexDir='column' className="ml-16 mt-3">
                        <Heading>Your orders</Heading>
                        <Flex flexDir="column" className='border rounded-md p-3 mt-2'>
                            <Flex flexDir="column">
                                <Flex flexDir='row' gap={1.5} alignItems='center'>
                                    <Text as='b' className='mr-2' >Status :</Text>
                                    <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                    <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                    <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                    <Button colorScheme={statusFilter === "complete" ? "green" : null} onClick={handleFilterClick} name="complete" size='sm' variant='outline' >Complete</Button>
                                    <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>
                                </Flex>
                                <Divider className='my-2' />
                                <Flex className='justify-center align-middle h-44 text-center m-auto p-10 mb-10 mt-10 border rounded-md' flexDir='column'>
                                    <Text>You don't have transaction in this category yet</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>  
              </>
          ) : !orderList.length ? (
            <>
            <Toaster />
            <Flex flexDir="row">
            <TenantNavbar />
                <Flex flexDir='column' className="ml-16 mt-3">
                    <Heading>Your orders</Heading>
                    <Flex flexDir="column" className='border rounded-md p-3 mt-2'>
                        <Flex flexDir="column">
                            <Flex flexDir='row' gap={1.5} alignItems='center'>
                                <Text as='b' className='mr-2' >Status :</Text>
                                <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                <Button colorScheme={statusFilter === "complete" ? "green" : null} onClick={handleFilterClick} name="complete" size='sm' variant='outline' >Complete</Button>
                                <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>
                            </Flex>
                            <Divider className='my-2' />
                              <Skeleton>
                                  test
                            </Skeleton>
                                  </Flex>
                    </Flex>
                </Flex>
            </Flex>  
          </>
          ) : (
        <>
         <Toaster />
         <Flex flexDir="row" className='mb-2'>
            <TenantNavbar />
                <Flex flexDir='column' className="ml-16 mt-3">
                    <Heading>Your orders</Heading>
                    <Flex flexDir="column" className='border rounded-md p-3 w-[39em] mt-2'>
                        <Flex flexDir="column">
                            <Flex flexDir='row' gap={1.5} alignItems='center'>
                                <Text as='b' className='mr-2' >Status :</Text>
                                <Button colorScheme={statusFilter === "all" ? "green" : null} onClick={handleFilterClick} name="all" size='sm' variant='outline' >All</Button>
                                <Button colorScheme={statusFilter === "in progress" ? "green" : null} onClick={handleFilterClick} name="in progress" size='sm' variant='outline' >In Progress</Button>
                                <Button colorScheme={statusFilter === "rejected" ? "green" : null} onClick={handleFilterClick} name="rejected" size='sm' variant='outline' >Rejected</Button>
                                <Button colorScheme={statusFilter === "complete" ? "green" : null} onClick={handleFilterClick} name="complete" size='sm' variant='outline' >Complete</Button>
                                <Button colorScheme={statusFilter === "cancelled" ? "green" : null} onClick={handleFilterClick} name="cancelled" size='sm' variant='outline' >Cancelled</Button>
                            </Flex>
                            <Divider className='my-2' />
                            <OrderList />
                        </Flex>
                    </Flex>
                        <ReactPaginate 
                            breakLabel="..."
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageRangeDisplayed={1}
                            pageCount={pageCount}
                            containerClassName="flex justify-end items-center mt-4"
                            pageClassName="px-4 py-2 cursor-pointer border"
                            previousClassName='border px-4 py-2'
                            nextClassName='border px-4 py-2'
                            activeClassName="bg-blue-500 text-white"
                            marginPagesDisplayed={1}
                            breakClassName="border px-4 py-2"
                            onPageChange={handlePageChange}
                            disabledClassName="text-slate-400"
                            forcePage={page - 1}
                        />
                </Flex>
            </Flex>  
        </>
          )}
        
      </>
  )
}

export default TenantOrders