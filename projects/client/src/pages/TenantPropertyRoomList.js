import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer
} from '@chakra-ui/react'
import ReactPaginate from 'react-paginate'

const TenantPropertyRoomList = () => {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState()
    const [tenantToken, setTenantToken] = useState("")
    const [propertyRoomData, setPropertyRoomData] = useState()

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });

    const onGetPropertyRoomList = async () => {
        try {
            // get tenant token in local storage
            let token = localStorage.getItem('tenantToken')
            if (!token) throw { message: 'Token is missing' }

            // get property and room list
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/property/allPropertyRoomList?page=${page}`, {
                headers: { 'Authorization': token }
            })

            // set property and room data
            setTenantToken(token)
            setPropertyRoomData(response.data.data.property_room_list)
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

            console.log(error.message)
        }
    }

    const handlePageChange = async (selected_page) => {
        try {
            let current_page = selected_page.selected + 1
            
            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/property/allPropertyRoomList?page=${current_page}`, {
                headers: { 'Authorization': tenantToken }
            })

            // set new property room data and page
            setPage(current_page)
            setPropertyRoomData(response.data.data.property_room_list)
            setPageCount(response.data.data.total_pages)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        onGetPropertyRoomList()
    }, [])

    return (
        <div
            className='flex flex-col
            py-10 px-3'
        >
            <Toaster />
            
            <TableContainer className='rounded-lg border border-slate-500' >
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>No.</Th>
                            <Th>Property Name</Th>
                            <Th>Room Name</Th>
                            <Th>Price</Th>
                            <Th>City</Th>
                            <Th>Address</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {propertyRoomData?.map((val, idx) => (
                            <Tr key={val?.id}>
                                <Td>{(page - 1) * propertyRoomData?.length + idx + 1}</Td>
                                <Td>{val?.property_name}</Td>
                                <Td>{val?.room_name}</Td>
                                <Td>{formatter.format(val?.price)}</Td>
                                <Td>{val?.city}</Td>
                                <Td>{val?.address}</Td>
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
    )
}

export default TenantPropertyRoomList