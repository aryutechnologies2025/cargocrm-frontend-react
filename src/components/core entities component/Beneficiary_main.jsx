import React from 'react'
import Sidebar from '../Sidebar'
import Beneficiary_detail from './Beneficiary_detail'

const Beneficiary_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Beneficiary_detail />
    </div>
  )
}

export default Beneficiary_main
