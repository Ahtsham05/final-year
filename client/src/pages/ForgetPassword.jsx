
import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Axios from '../utils/Axios';
import summery from '../common/summery';
import { toast } from 'react-toastify';
import {Link, useLocation, useNavigate} from 'react-router-dom'

const ForgetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [data,setData] = useState({
    email:'',
  })
  const handleChange = (e)=>{
    const {name,value} = e.target
    setData({...data,[name]:value})
  }
  const validateCheckEmptyValues = Object.values(data).every(val => val)

  const submitHandler =async(e)=>{
    e.preventDefault()
    if(!validateCheckEmptyValues){
      toast.error("All Fields are required!")
      return false
    }
    try {
      const response = await Axios({
        ...summery.forgetPassword,
        data:data
      })
      toast.success(response?.data?.message)
      navigate("/verify-otp",{
        state:data
      })
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error("Server error: " + error.response.status)
      }
    }
  }

  return (
    <section className='container mx-auto w-full flex justify-center mt-8'>
      <div className='bg-white shadow-md w-[100%] lg:w-[50%] rounded-lg  text-neutral-800'>
        <form action="" onSubmit={submitHandler} className='grid gap-4 p-2 py-10 lg:p-10'>
            <h1 className='text-2xl font-semibold text-center pb-2'>Forget Password</h1>
            <div className='grid gap-1'>
              <label 
                htmlFor="email" 
                className='text-sm font-medium'
              >
                Email : 
              </label>
              <div className='grid'>
                <input type="email" placeholder='Enter Your Email' onChange={handleChange} name='email' id='email' className='p-2 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm'/>
              </div>
            </div>
            <button disabled={!validateCheckEmptyValues} className={`${validateCheckEmptyValues?"bg-green-700 hover:bg-green-800":"bg-gray-500"} cursor-pointer p-2 rounded-md mt-5 text-white tracking-wide`}>Send Otp</button>
            <p className='text-[16px]'>Already have an account? <Link to={"/login"} className='text-green-800 font-semibold'>Login</Link></p>
        </form>
      </div>
    </section>
  )
}

export default ForgetPassword