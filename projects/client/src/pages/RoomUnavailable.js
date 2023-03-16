import {useState} from 'react'
import axios from 'axios'
import { Card, CardHeader, Input, Alert, AlertIcon, Avatar, Button, Stack, StackDivider, Box, Heading, CardBody, Divider, Center, Select } from '@chakra-ui/react'
import toast, {Toaster} from 'react-hot-toast'
import DatePicker from 'react-datepicker'

const RoomUnavailable = () => {

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [room, setRoom] = useState('')

    const handleAdd = () => {
        if (!room) throw toast.error('Please pick your room')
        else if (!dateRange || dateRange[0] === null || dateRange[1] === null) throw toast.error('Please pick a date range')
        const newStartDate = startDate.toLocaleDateString('id-ID')
        const [startDay, startMonth, startYear] = newStartDate.split('/')
        const formattedStartDate = `${startYear}-${startMonth}-${startDay}`
        
        const newEndDate = endDate.toLocaleDateString('id-ID')
        const [endDay, endMonth, endYear] = newEndDate.split('/')
        const formattedEndDate = `${endYear}-${endMonth}-${endDay}`
        
        console.log(formattedStartDate, 'start')
        console.log(formattedEndDate, 'end')

    }
  return (
      <>
          <Toaster position='top-center'/>
        <Card margin={4}>
            <CardHeader>
                <Heading size='md'>Add your unavailble room</Heading>
            </CardHeader>
                <Center>
                <Divider width='90%' />
                </Center>
              <CardBody>
                <Stack spacing='4'>
                      <Box>
                        <Heading size='xs'>Select your room</Heading>
                          <Select onChange={(e) => setRoom(e.target.value)}>
                              <option value=''>Pick your room</option>
                              <option value="test1">test1</option>
                              <option value="test2">test2</option>
                        </Select>
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
  )
}

export default RoomUnavailable