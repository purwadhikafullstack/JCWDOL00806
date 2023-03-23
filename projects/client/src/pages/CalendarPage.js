import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const CalendarPage = () => {

  const [unavailable, setUnavailable] = useState([])

  const {roomID} = useParams()


  useEffect(() => {
    getData()
    }, [])
    
  const getData = async () => {
    let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/tenant/room-calendar/${roomID}`)
    console.log(response)
    let mapped = await response.data.data.map((e) => ({
      title: e.status,
      start: e.start_date,
      end: e.end_date,
      display: "background",
      backgroundColor: e.status === "Booked" ? "green" : "grey",
    }))
    setUnavailable(mapped)
  }
  const getRoomData = async () => {
    
  }
  
    return (
      <>
        {!unavailable.length ? (
         <div className='w-3/4 my-10 mx-auto'>
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        
        />
         </div>
        ): (
        <div className='w-3/4 my-10 mx-auto'>
        <FullCalendar
        plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={unavailable}
        />
        </div>
        )}
      </>
  )
}

export default CalendarPage