import React from 'react'
import { Outlet } from 'react-router-dom'

function Overview() {
  
  return (
    <div className='overview-wrapper text-black'>
        <Outlet/>
    </div>
  )
}

export default Overview