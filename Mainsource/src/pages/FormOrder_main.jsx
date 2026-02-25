import React from 'react'
import Sidebar from '../components/Sidebar'
import FormOrder from '../components/order form component/FormOrder'

const FormOrder_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100'>
        <Sidebar />
      </div>
      <FormOrder />
    </div>
  )
}

export default FormOrder_main
