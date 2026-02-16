import React from 'react'
import Sidebar from '../Sidebar'
import SystemSetting_detail from './SystemSetting_detail'

const SystemSetting_Main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <SystemSetting_detail />
    </div>
  )
}

export default SystemSetting_Main
