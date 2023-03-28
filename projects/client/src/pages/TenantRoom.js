import React, { useEffect, useState } from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex
} from '@chakra-ui/react'
import ReactPaginate from 'react-paginate'
import TenantNavbar from '../components/TenantNavbar'

const TenantRoom = () => {
    const { propertyID } = useParams()
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState()
    const [roomData, setRoomData] = useState([])
    const [tenantToken, setTenantToken] = useState("")

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });

    const formatText = (val) => {
        if (val?.length > 20) val = val.substring(0, 20) + "..."
        
        return val
    }

    const onGetData = async () => {
        try {
            // get tenant token in local storage
            let token = localStorage.getItem('tenantToken')
            if (!token) throw { message: 'Token is missing' }

            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/get-data/${propertyID}?page=${page}`, {
                headers: { 'Authorization': token }
            })

            // set room data, token and page
            setTenantToken(token)
            setRoomData(response.data.data.room_data)
            setPageCount(response.data.data.total_pages)
        } catch (error) {
            // navigate to login page if token is expired
            if (error.response?.data.message === 'jwt expired') {
                toast("Your session is expired, please login")
                setTimeout(() => {
                    navigate('/tenant/login')
                }, 2000)
            }
            // navigate to 401 page if not belongs to user
            else if (error.response?.data.message === 'Property ID Not Belongs To User') {
                navigate('/401')
            } 
            else {
                navigate('/tenant/login')
            }

            console.log(error.response?.data.message)
        }
    }

    const onDeleteRoom = async (roomID) => {
        try {
            // delete room data
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/room/delete/${roomID}`, {
                headers: { 'Authorization': tenantToken }
            })

            toast.success("Delete room success")

            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/get-data/${propertyID}?page=${page}`, {
                headers: { 'Authorization': tenantToken }
            })

            // set new room data and page
            setRoomData(response.data.data.room_data)
            setPageCount(response.data.data.total_pages)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = async (selected_page) => {
        try {
            let current_page = selected_page.selected + 1
            
            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/get-data/${propertyID}?page=${current_page}`, {
                headers: { 'Authorization': tenantToken }
            })

            // set new room data and page
            setPage(current_page)
            setRoomData(response.data.data.room_data)
            setPageCount(response.data.data.total_pages)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        onGetData()
    }, [])
    
    return (
        <>
        <Flex flexDir='row' >
        <TenantNavbar />
                <Flex flexDir='column' className="ml-16 w-4/5">
                    
        <div
            className='flex flex-col
            py-10 px-3'
        >
            <Toaster />
            <div className='mb-5 flex sm:flex-row flex-col gap-2'>
                <Link 
                    to={`/tenant/room/${propertyID}/create`}
                >
                    <Button colorScheme="green">
                        Create new room
                    </Button>
                </Link>
                <Link to={`/tenant/calendar-view/${propertyID}`}>
                    <Button colorScheme="blue">
                        See Calendar View
                    </Button>
                </Link>
            </div>

            <TableContainer className='rounded-lg border border-slate-500'>
                <Table className='table-tiny' variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>No.</Th>
                            <Th>Name</Th>
                            <Th>Price</Th>
                            <Th>Description</Th>
                            <Th>Rules</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {roomData?.map((val, idx) => (
                            <Tr key={val.id}>
                                <Td>{(page - 1) * roomData?.length + idx + 1}</Td>
                                <Td>{val?.name}</Td>
                                <Td>{formatter.format(val?.price)}</Td>
                                <Td>{formatText(val?.description)}</Td>
                                <Td>{formatText(val?.rules)}</Td>
                                <Td className='flex gap-2'>
                                    <Link to={`/tenant/room/${propertyID}/edit/${val?.id}`}>
                                        <Button colorScheme="yellow">Edit</Button>
                                    </Link>
                                    
                                    <Button 
                                        colorScheme="red"
                                        onClick={() => onDeleteRoom(val?.id)}
                                    >
                                        Delete
                                    </Button>
                                    
                                    <Link to={`/tenant/room/${propertyID}/unavailable/${val?.id}`}>
                                        <Button colorScheme="blue">Set Unavailable</Button>
                                    </Link>
                                    
                                    <Link to={`/tenant/room/${propertyID}/special-price/${val?.id}`}>
                                        <Button colorScheme="blue">Set Special Price</Button>
                                    </Link>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <div className='overflow-x-auto'>
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
                />
            </div>
        </div>
                </Flex>
        </Flex>
        </>
    )
}

export default TenantRoom