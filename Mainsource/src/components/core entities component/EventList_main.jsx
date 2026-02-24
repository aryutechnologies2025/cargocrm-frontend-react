import React from 'react'
import Sidebar from '../Sidebar'
import EventList_details from './EventList_details'

const EventList_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <EventList_details />
    </div>
  )
}

export default EventList_main
