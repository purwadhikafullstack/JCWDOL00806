import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { Button, Flex } from '@chakra-ui/react'
import TenantNavbar from '../components/TenantNavbar'

const CalendarPage = () => {

  const [unavailable, setUnavailable] = useState([])
  const [propertyData, setPropertyData] = useState({})

  const {propertyID} = useParams()


  useEffect(() => {
    getPropertyDetail()
    getData()
    }, [])
    
  const getData = async () => {
    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tenant/room-calendar/${propertyID}`)
    console.log(response)
    let mapped = await response.data.data.map((e) => {
      if (e.status === "unavailable") {
        return {
          title: e.room_name,
          start: e.start_date,
          end: e.end_date,
          backgroundColor: "#818287",
        }
      } else {
        return {
          title: e.room_name,
          start: e.start_date,
          end: e.end_date,
          backgroundColor: "##1A93E0"
        }
      }
    })
    setUnavailable(mapped)
  }

  const getPropertyDetail = async () => {
    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/property/propertyDetail/${propertyID}`)
    setPropertyData(response.data.data)
  }
    return (
      <>
        {!unavailable.length ? (
          <>
          <Flex flexDir='row' >
          <TenantNavbar />
            <Flex flexDir='column' className="ml-16 w-3/4">
            <div className='flex w-4/5 mx-auto'>
              <span className='inline-flex'>
                <p className='font-medium'>Property Name : </p>
                <p className='mx-2 italic'>{propertyData.name}</p>
              </span>
            </div>
            <div className='w-4/5 h-4/5 mt-5 mb-10 mx-auto border p-3 rounded-md'>
              <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              />
            </div>
              </Flex>
            </Flex>
            
          </>
        ) : (
            <>
              <Flex flexDir='row' >
          <TenantNavbar />
                <Flex flexDir='column' className="w-full">
                    <div className='flex w-11/12 mx-auto mt-5 mb-0'>
                  <span className='inline-flex text-3xl'>
                    <p className='font-medium'>Property Name : </p>
                    <p className='mx-2 italic'>{propertyData.name}</p>
                  </span>
                </div>
                <div className='mb-10 w-11/12 h-[87%] mx-16 border p-3 rounded-md'>
                  <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                      events={unavailable}
                      height={"80vh"}
                  />
                <Link to={`/tenant/room/${propertyID}`}>
                  <Button className='my-3' colorScheme="blue">Back</Button>
                </Link>
                </div>
                </Flex>
                </Flex>
              
            </>
        )}
      </>
  )
}

export default CalendarPage