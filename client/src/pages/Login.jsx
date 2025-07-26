import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Axios from '../utils/Axios';
import summery from '../common/summery';
import { toast } from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom'
import getCurrentUser from '../utils/getUser';
import {setUserDetails} from '../store/userSlice'
import {useDispatch} from 'react-redux'
const Login = () => {
  const dispatch = useDispatch()
  const [showPassword,setShowPassword] = useState(false)
  const navigate = useNavigate()

  const [data,setData] = useState({
    email:'',
    password:''
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
        ...summery.login,
        data:data
      })
      if(response.data.success){
        toast.success(response?.data?.message)
        localStorage.setItem("accessToken",response?.data?.data?.accessToken)
        localStorage.setItem("refreshToken",response?.data?.data?.refreshToken)
        const user = await getCurrentUser()
        dispatch(setUserDetails(user.data))
        navigate("/")
      } else {
        toast.error(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error("Server error: " + error.response.status)
      }
    }
  }

  return (
    <section className='container mx-auto min-h-[80vh] w-full flex justify-center items-center mt-8 '>
      <div className='bg-white shadow-md w-[100%] lg:w-[50%] rounded-lg  text-neutral-800'>
        <form action="" onSubmit={submitHandler} className='grid gap-4 p-2 py-10 lg:p-10'>
            <h1 className='text-2xl font-semibold text-center pb-2'>Login</h1>
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
              <Link to={"/forget-password"}>
                <p className='text-right text-sm font-medium text-green-900 cursor-pointer'>Forget Password?</p>
              </Link>
            </div>
            <button disabled={!validateCheckEmptyValues} className={`${validateCheckEmptyValues?"bg-green-700 hover:bg-green-800":"bg-gray-500"} cursor-pointer p-2 rounded-md mt-5 text-white tracking-wide`}>Login</button>
            <p className='text-[16px]'>Don't have an account? <Link to={"/register"} className='text-green-800 font-semibold'>Register</Link></p>
        </form>
      </div>
    </section>
  )
}

export default Login