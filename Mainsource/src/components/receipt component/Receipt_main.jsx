import React from 'react'
import Sidebar from '../Sidebar'
import Receipt_detail from './Receipt_detail'

const Receipt_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Receipt_detail />
    </div>
  )
}

export default Receipt_main
