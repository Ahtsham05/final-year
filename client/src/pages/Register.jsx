import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Axios from '../utils/Axios';
import summery from '../common/summery';
import { toast } from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [showPassword , setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(false)
  const [data,setData] = useState(
    {
      name:'',
      email:'',
      password:'',
      confirmPassword:'',
    }
  )

  const handleChange = (e)=>{
    const {name,value }= e.target
   setData({...data,[name]:value})
  }

  const validateCheckEmptyValues = Object.values(data).every(value => value)

  const submitHandler = async (e) =>{
    e.preventDefault()
    if(!validateCheckEmptyValues){
      alert('All fields are required!')
      return
    }
    if(data.password!==data.confirmPassword){
      toast.error("Password & Confirm Password Must Be Same !")
      return
    }
    try {
      const response = await Axios({
        ...summery.register,
        data:data
      })
      if(response?.data?.success){
        toast.success(response?.data?.message)
      }
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }  
  }
  return (
    <section className='container mx-auto min-h-[80vh] w-full flex justify-center mt-8 items-center'>
      <div className='bg-white h-auto shadow-md w-[100%] lg:w-[50%] rounded-lg  text-neutral-800'>
        <form action="" onSubmit={submitHandler} className='grid gap-4 p-2 py-10 lg:p-10'>
            <h1 className='text-2xl font-semibold text-center pb-2'>Register</h1>
            <div className='grid gap-1'>
              <label 
                htmlFor="name" 
                className='text-sm font-medium'
              >
                Name : 
              </label>
              <div className='grid'>
                <input type="text" placeholder='Enter Your Name' name='name' onChange={handleChange} id='name' className='p-2 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm'/>
              </div>
            </div>
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
            <div className='grid gap-1'>
              <label 
                htmlFor="password" 
                className='text-sm font-medium'
              >
                Password : 
              </label>
              <div className='grid relative'>
                <input type={showPassword?"text":"password"} onChange={handleChange} placeholder='Enter Your Password' name='password' id='password' className='p-2 pr-10 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm cursor-pointer'/>
                <span className='text-xl absolute right-2 top-2' onClick={()=> setShowPassword((prev)=> !prev)}>
                      {
                        showPassword?(<LuEye/>):(<LuEyeClosed/>)
                      }
                </span>
              </div>
            </div>
            <div className='grid gap-1'>
              <label 
                htmlFor="confirmPassword" 
                className='text-sm font-medium'
              >
                Confirm Password : 
              </label>
              <div className='grid relative'>
                <input type={confirmPassword?"text":"password"} onChange={handleChange} placeholder='Enter Your Confirm Password' name='confirmPassword' id='confirmPassword' className='p-2 pr-10 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm'/>
                <span className='text-xl absolute right-2 top-2 cursor-pointer' onClick={()=> setConfirmPassword((prev)=> !prev)}>
                      {
                        confirmPassword?(<LuEye/>):(<LuEyeClosed/>)
                      }
                </span>
              </div>
            </div>
            <button disabled={!validateCheckEmptyValues} className={`${validateCheckEmptyValues?"bg-green-700 hover:bg-green-800":"bg-gray-500"} cursor-pointer p-2 rounded-md mt-5 text-white tracking-wide`}>Register</button>
            <p className='text-[16px]'>Already have an account? <Link to={"/login"} className='text-green-800 font-semibold'>Login</Link></p>
        </form>
      </div>
    </section>
  )
}

export default Register