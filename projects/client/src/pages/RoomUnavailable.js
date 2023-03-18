import {useState, useEffect} from 'react'
import axios from 'axios'
import { Card, CardHeader, Input, Alert, AlertIcon, Avatar, Button, Stack, StackDivider, Box, Heading, CardBody, Divider, Center, AlertTitle } from '@chakra-ui/react'
import toast, {Toaster} from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useParams, useNavigate } from 'react-router-dom'

const RoomUnavailable = () => {
    const navigate = useNavigate()
    const { propertyID, roomID } = useParams()
  
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [roomData, setRoomData] = useState(null)
  
    useEffect(() => {
      onOpen()
    }, [])
  
    const onOpen = async () => {
      try {
        let token = localStorage.getItem("tenantToken".replace(/"/g, ""));

        let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/room-data/${roomID}`, {
          headers: {authorization : token}
        })
        setRoomData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
  
  
  
    const handleAdd = async () => {
        if (!dateRange || dateRange[0] === null || dateRange[1] === null) throw toast.error('Please pick a date range')
        const newStartDate = startDate.toLocaleDateString('id-ID')
        const [startDay, startMonth, startYear] = newStartDate.split('/')
        const formattedStartDate = `${startYear}-${startMonth}-${startDay}`
        
        const newEndDate = endDate.toLocaleDateString('id-ID')
        const [endDay, endMonth, endYear] = newEndDate.split('/')
        const formattedEndDate = `${endYear}-${endMonth}-${endDay}`
      
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/room/unavailable`, {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        room_id: roomData.id
      })
      toast.success("Unavailable room created successfully")
      setTimeout(() => {
          navigate(`/tenant/room/${propertyID}`)
      }, 2000)
    }
  return (
    <>
      {!roomData ? (
        <>
          <Card margin={4}>
          <Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
            rounded={4}
          >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
              This property / room does not belong to user !!
            </AlertTitle>
          </Alert>
          </Card>
        </>
      ) : (
        <>
          <Toaster position='top-center'/>
        <Card margin={4}>
            <CardHeader>
                <Heading size='md'>Set your unavailable room date</Heading>
            </CardHeader>
                <Center>
                <Divider width='90%' />
                </Center>
              <CardBody>
                <Stack spacing='4'>
                      <Box>
                        <Heading size='xs'>Room name</Heading>
                        <Input marginTop={2} disabled value={roomData?.name}/>
                      </Box>
                      <Box>
                          <Heading size='xs'>Enter your date range</Heading>
                          <DatePicker
                            className='border rounded-md w-52 px-3'
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                              isClearable={true}
                              dateFormat='yyyy-MM-dd'>
                               <div style={{ color: "red" }}>Click the date twice if only one day !</div>
                              </DatePicker>
                      </Box>
                    <Button onClick={handleAdd} colorScheme='blue' type="submit">Add</Button>

                </Stack>
              </CardBody>  
        </Card>
          </>
      )}
      </>
  )
}

export default RoomUnavailable