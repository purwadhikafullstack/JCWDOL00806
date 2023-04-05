import {useState, useEffect} from 'react'
import axios from 'axios'
import { Card, CardHeader, Input, Alert, AlertIcon, Button, Stack, Box, Heading, CardBody, Divider, Center, AlertTitle, Flex } from '@chakra-ui/react'
import toast, {Toaster} from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useParams, useNavigate } from 'react-router-dom'
import TenantNavbar from '../components/TenantNavbar'

const RoomUnavailable = () => {
    const navigate = useNavigate()
    const { propertyID, roomID } = useParams()
  
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [roomData, setRoomData] = useState(null)
    const [unavailable, setUnavailable] = useState()

  const currentDate = new Date().getTime()
  
    useEffect(() => {
      onOpen()
    }, [])
  
    const onOpen = async () => {
      try {
        let token = localStorage.getItem("tenantToken".replace(/"/g, ""));

        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/room/room-data/${roomID}`, {
          headers: {authorization : token}
        })
        setRoomData(response.data.data)
        let room = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/room/unavailable-room/${roomID}`)

        const unavailableDates = []

        if (room.data.data.unavailable.length !== 0) {
          room.data.data.unavailable.forEach(async (val) => {
            const startDate = new Date(val.start_date)
            const endDate = new Date(val.end_date)

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                let newDate = date.toISOString().substring(0, 10)
                unavailableDates.push(newDate);
            }
        })
        }

        if (room.data.data.booked.length !== 0) {
          room.data.data.booked.forEach(async (val) => {
              const startDate = new Date(val.start_date)
              const endDate = new Date(val.end_date)

              for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                  let newDate = date.toISOString().substring(0, 10)
                  unavailableDates.push(newDate);
              }
          })
      }

      setUnavailable(unavailableDates)

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
      
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/room/unavailable`, {
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
      <Flex flexDir='row'>
        <TenantNavbar />
        <Flex flexDir='column' className='ml-16 mt-3'>
          {!roomData ? (
            <>
              <Card className='sm:w-[500px] sm:mx-auto m-4'>
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
            <Card className='sm:w-[500px] mx-auto m-4'>
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
                                className='border p-2 w-[250px]'
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                minDate={currentDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                isClearable={true}
                                dateFormat='yyyy-MM-dd'
                                excludeDates={unavailable?.map((date) => new Date(date))}>
                                  <div style={{ color: "red" }}>Click the date twice if only one day !</div>
                                  </DatePicker>
                          </Box>
                        <Button onClick={handleAdd} colorScheme='blue' type="submit">Add</Button>

                    </Stack>
                  </CardBody>  
            </Card>
              </>
          )}
        </Flex>
      </Flex>
      </>
  )
}

export default RoomUnavailable