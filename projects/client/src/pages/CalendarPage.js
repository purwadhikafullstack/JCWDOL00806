import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const CalendarPage = () => {
    return (
      <>
      <div>CalendarPage</div>
        <FullCalendar
        plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={[
                    { title: 'event 1', date: '2023-03-23' },
                    { title: 'event 2', date: '2019-04-02' }
                  ]}
        />
      </>
  )
}

export default CalendarPage