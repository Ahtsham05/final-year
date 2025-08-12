import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/userSlice'
import Divider from './Divider'
import summery from '../common/summery'
import {toast} from 'react-toastify'
import Axios from '../utils/Axios'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LuExternalLink } from "react-icons/lu";
import IsAdmin from '../components/IsAdmin'

const UserMenu = ({close}) => {
    const user = useSelector(state=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutBtn = async() =>{
        try {
            const response = await Axios({
              ...summery.logoutUser
            })
            // console.log(response)
            if(response?.data?.success){
              if(close){
                close()
              }
              toast.success(response?.data?.message)
              dispatch(logout())
              localStorage.clear()
              navigate("/login")

            }else {
                toast.error(response?.data?.message)
              }
        } catch (error) {
            toast.error(error?.response?.data?.message)
              if(error?.response?.status === 500){
                toast.error("Server error: " + error.response.status)
              }
          // console.log(error)
        }
    }

  return (
    <div className='grid gap-1'>
        <h2 className='px-2'>My Account</h2>
        <Divider/>
        <p className='mt-2 px-2 py-2 capitalize flex items-center gap-2'><span>{user.name || user.mobile}</span><span className='text-sm text-red-500'>{IsAdmin(user.role) && ("(Admin)")}</span><Link to={"/dashboard/profile"}><LuExternalLink size={18} className='hover:text-primary200'/></Link></p>
        
        {/* Admin Dashboard - Available for admins */}
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Dashboard</NavLink>
          )
        }
        
        {/* Customer Orders - Available for all users */}
        <NavLink to={"/dashboard/myorders"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>My Orders</NavLink>
        
        {/* Admin Only Links */}
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard/category"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Category</NavLink>
          )
        }
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard/subcategory"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Sub Category</NavLink>
          )
        }
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard/product"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Upload Product</NavLink>
          )
        }
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard/adminproduct"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Product</NavLink>
          )
        }
        {
          IsAdmin(user.role) && (
            <NavLink to={"/dashboard/orders"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Orders</NavLink>
          )
        }
        <NavLink to={"/dashboard/address"} className={({isActive}) => `px-2 py-2 capitalize flex items-center gap-2 hover:bg-primary200 hover:text-white cursor-pointer ${isActive?"bg-primary200 text-white":""}`}>Address</NavLink>
        <NavLink className='mt-2 px-4 py-2 capitalize flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white cursor-pointer bg-red-500 rounded text-gray-50' onClick={logoutBtn}>Logout</NavLink>
      {/* Add other menu items here */}
    </div>
  )
}

export default UserMenu