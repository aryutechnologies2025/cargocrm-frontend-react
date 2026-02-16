import React from 'react'
import Sidebar from '../Sidebar'
import Parcel_detail from '../core entities component/Parcel_detail'

const Parcel_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Parcel_detail />
    </div>
  )
}

export default Parcel_main
