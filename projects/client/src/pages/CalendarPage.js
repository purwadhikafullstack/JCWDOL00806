import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const CalendarPage = () => {

  const [unavailable, setUnavailable] = useState([])
  const [propertyData, setPropertyData] = useState({})

  const {propertyID} = useParams()


  useEffect(() => {
    getPropertyDetail()
    getData()
    }, [])
    
  const getData = async () => {
    let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/tenant/room-calendar/${propertyID}`)

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
    let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/property/propertyDetail/${propertyID}`)
    setPropertyData(response.data.data)
  }
    return (
      <>
        {!unavailable.length ? (
          <>
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
          </>
        ) : (
            <>
              <div className='flex w-4/5 mx-auto mt-5 mb-0'>
                <span className='inline-flex text-3xl'>
                  <p className='font-medium'>Property Name : </p>
                  <p className='mx-2 italic'>{propertyData.name}</p>
                </span>
              </div>
              <div className='w-4/5 h-4/5 mt-5 mb-10 mx-auto border p-3 rounded-md'>
                <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={unavailable}
                />
              <Link to={`/tenant/room/${propertyID}`}>
                <Button className='my-5' colorScheme="blue">Back</Button>
              </Link>
              </div>
            </>
        )}
      </>
  )
}

export default CalendarPage