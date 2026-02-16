import React from 'react'
import Sidebar from '../Sidebar'
import Event_detail from './Event_detail'

const Event_main = () => {
  return (
    <div className="flex">
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Event_detail />
    </div>
  )
}

export default Event_main
