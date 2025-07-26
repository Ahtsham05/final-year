import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";


const MobileUserMenu = () => {
  return (
    <section className='bg-white py-5'>
        <div className='px-3' onClick={()=> window.history.back()}><IoClose size={25} className='block ml-auto'/></div>
        <div className='p-3'>
            <UserMenu/>
        </div>
    </section>
  )
}

export default MobileUserMenu