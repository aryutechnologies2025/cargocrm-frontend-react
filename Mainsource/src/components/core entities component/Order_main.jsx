import React from 'react'
import Sidebar from '../Sidebar'
import Order_detail from './Order_detail'

const Order_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Order_detail />
    </div>
  )
}

export default Order_main
