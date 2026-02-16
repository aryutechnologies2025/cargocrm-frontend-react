import React from 'react'
import Sidebar from '../Sidebar'
import ContactUs_detail from './ContactUs_detail'

const ContactUs_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <ContactUs_detail />
    </div>
  )
}

export default ContactUs_main

