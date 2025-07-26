import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.png"
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";
import UserMenu from './UserMenu';
import { currencyConverter } from '../utils/currencyConverter';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartProduct from './DisplayCartProduct';

const Header = () => {
  const cartItem = useSelector(state => state?.cart?.cartItems)
  const location = useLocation();
  const [isMobile] = useMobile();
  const [isSearchPage,setIsSearchPage] = useState(false)
  const [openCartProduct,setOpenCartProduct] = useState(false)
  const [openMenu ,setOpenMenu] = useState(false)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const { totalQty ,totalPrice} = useGlobalContext()

  const changeIcon = () => {
    setOpenMenu((prev) => !prev)
  }
  const mobileBtnHandler = ()=>{
    if(!user?._id){
      navigate("/login")
      return
    }
    if(location.pathname === "/user"){
      window.history.back()
      return
    }
    navigate("/user")
  }
  useEffect(()=>{
    setIsSearchPage(location.pathname === "/search")
  },[location])

  return (
    <header className='h-26 lg:h-20 shadow-md p-2 bg-white sticky top-0 z-50'>
      <div className='container mx-auto h-full flex flex-col gap-2'>
        {
          !(isSearchPage && isMobile) && (
            <div className='lg:h-full flex items-center justify-between'>
                {/* logo */}
                <Link to={"/"}>
                  <img 
                    src={logo}
                    className='w-[120px] lg:w-[170px]'
                    alt="Blinkeyit" 
                  />
                </Link>

                {/* search */}
                <div className='hidden lg:block'>
                  <Search/>
                </div>

                {/* login & cart button */}
                <div>
                    <div className='hidden lg:flex items-center gap-10 relative'>
                        {
                          user._id ? (
                            <>
                            <button className='flex items-center gap-2' onClick={changeIcon}>Account {openMenu? (<TiArrowSortedUp/>):(<TiArrowSortedDown/>)}</button>
                            {
                              openMenu && (
                                <div className='absolute top-12 bg-white p-5 shadow-md rounded z-50'><UserMenu close={changeIcon}/></div>
                              )
                            }
                            </>  
                          ):(
                            <Link to={"/login"}>Login</Link>
                          )
                        }
                        <button onClick={()=>setOpenCartProduct(true)} className={`flex items-center gap-2 bg-green-700 hover:bg-green-800  ${cartItem[0]?'py-2':'py-3'} px-3 rounded-lg text-white font-medium`}>
                            <div className='text-2xl animate-bounce'><BsCart4/></div>
                            {
                              cartItem[0] ? (
                                <div className='text-sm'>
                                  <div>{totalQty} Items</div>
                                  <div>{currencyConverter(totalPrice)}</div>
                                </div>
                              ):(
                                "My Cart"
                              )
                            }
                            
                        </button>
                    </div>
                    <div className='lg:hidden text-[22px]' onClick={mobileBtnHandler}><FaRegCircleUser/></div>
                </div>
            </div>
          )
        }
        {/* search */}
        <div className='lg:hidden'>
            <Search/>
        </div>
        {
          openCartProduct && (
            <DisplayCartProduct close={()=>setOpenCartProduct(false)}/>
          )
        }
      </div>
    </header>
  )
}

export default Header