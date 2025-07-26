import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../provider/GlobalProvider'
import { currencyConverter } from '../utils/currencyConverter'
import { Link, useLocation } from 'react-router-dom'
import { IoMdArrowDropright } from "react-icons/io";


const MobileCartButton = () => {
  const cartItem = useSelector(state => state.cart.cartItems)
  const { totalPrice, totalQty } = useGlobalContext()
  const [show,setShow] =useState(false)
  const location = useLocation()

  useEffect(()=>{
    setShow(location.pathname === '/cart' || location.pathname === '/checkout')
    },[location.pathname]) 
  return (
    <>
    {
      cartItem[0] && !show && (
      <section className='sticky bottom-1 z-50 p-2 lg:hidden'>
          <div className='bg-green-700 hover:bg-green-800 rounded p-3 flex items-center justify-between text-white'>
              <div className='flex gap-3'>
                <div>{totalQty} Items</div>
                <div>{currencyConverter(totalPrice)}</div>
              </div>
              <Link to='/cart' className='flex gap-0'>
                <span>View Cart</span>
                <IoMdArrowDropright size={24} />
              </Link>
          </div>
          
        </section>
      )
    }
    </>
  )
}

export default MobileCartButton