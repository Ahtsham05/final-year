import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  return (
    <section className='bg-white min-h-[78vh]'>
        <div className='container mx-auto grid grid-cols-1 lg:grid-cols-[200px,auto] mt-2'>
            <div className='py-5 px-2 sticky top-0 border-r hidden lg:block h-[77vh]'><UserMenu/></div>
            <div className='py-5 px-2'><Outlet/></div>
        </div>
    </section>
  )
}

export default Dashboard