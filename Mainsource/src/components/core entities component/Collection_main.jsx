import React from 'react'
import Sidebar from '../Sidebar'
import Collection_detail from './Collection_detail'

const Collection_main = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>
      <Collection_detail />
    </div>
  )
}

export default Collection_main
