import React from 'react'
import Sidebar from '../Sidebar'
import Run_detail from './Run_detail'

const Run_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Run_detail />
    </div>
  )
}

export default Run_main
