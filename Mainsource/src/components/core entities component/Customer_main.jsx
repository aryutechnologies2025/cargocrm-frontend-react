import React from 'react'
import Sidebar from '../Sidebar'
import Customer_detail from './Customer_detail'

const Customer_main = () => {
  return (
    <div className="flex">
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Customer_detail />
    </div>
  )
}

export default Customer_main
