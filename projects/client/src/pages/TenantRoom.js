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
    TableContainer
} from '@chakra-ui/react'

const TenantRoom = () => {
    const { propertyID } = useParams()
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [roomData, setRoomData] = useState([])
    const [tenantToken, setTenantToken] = useState("")

    const onGetData = async () => {
        try {
            // get tenant token in local storage
            let token = localStorage.getItem('tenantToken')
            if (!token) throw { message: 'Token is missing' }

            // get room data
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/get-data/${propertyID}?page=${page}`, {
                headers: { 'Authorization': token }
            })

            // set room data and token
            setTenantToken(token)
            setRoomData(response.data.data)
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

            // set new room data
            setRoomData(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        onGetData()
    }, [])
    
    return (
        <div
            className='flex flex-col
            py-10 px-3'
        >
            <Toaster />
            <div className='mb-5'>
                <Link 
                    to={`/tenant/room/${propertyID}/create`}
                >
                    <Button colorScheme="green">
                        Create new room
                    </Button>
                </Link>
            </div>

            <TableContainer className='rounded-lg border border-slate-500'>
                <Table variant="striped" colorScheme="gray">
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
                                <Td>{(page - 1) * 10 + idx + 1}</Td>
                                <Td>{val?.name}</Td>
                                <Td>{val?.price}</Td>
                                <Td>{val?.description.substring(0, 20) + "..."}</Td>
                                <Td>{val?.rules.substring(0, 20) + "..."}</Td>
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
        </div>
    )
}

export default TenantRoom