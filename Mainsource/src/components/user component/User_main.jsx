import React from 'react'
import Sidebar from '../Sidebar'
import User_detail from './User_detail'

const User_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <User_detail />
    </div>
  )
}

export default User_main
