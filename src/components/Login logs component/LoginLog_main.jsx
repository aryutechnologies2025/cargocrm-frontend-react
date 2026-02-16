import React from 'react'
import Sidebar from '../Sidebar'
import LoginLog_detail from './LoginLog_detail'

const LoginLog_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <LoginLog_detail />
    </div>
  )
}

export default LoginLog_main
