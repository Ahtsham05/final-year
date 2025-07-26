import React, { useEffect, useState } from 'react'
import { LuEye, LuEyeClosed } from 'react-icons/lu'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Axios from '../utils/Axios'
import summery from '../common/summery'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showNewPassword,setShowNewPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const [data,setData] = useState({
        email:'',
        newPassword:'',
        confirmPassword:''
    })

    const validateCheckEmptyValues = Object.values(data).every(el => el)

    const handleChange = (e)=>{
        const {name,value} = e.target
        setData((prev)=> {return { ...prev,[name]:value}})
    }
    useEffect(()=>{
        if(!(location?.state?.email && location.state?.otp?.success)){
          navigate("/")
        }
        setData((prev)=> {return {...prev,email:location?.state?.email}})
      },[])
    // console.log(data)
    const submitHandler = async(e)=>{
        e.preventDefault()
        if(data.newPassword !== data.confirmPassword){
          toast.error("New password & confirm password must be same!");
        }

        try {
          const response = await Axios({
            ...summery.resetPassword,
            data: data
          })
          if(!response.data.success){
            toast.error("Change Password Failed!");
          }
          toast.success("Password changed successfully!");
          navigate('/login')
        } catch (error) {
          toast.error(error?.response?.data?.message)
          if(error.response.status === 500){
              toast.error("Server Error : " + error.response.status)
            }
        }
    }
  return (
    <section className='container mx-auto w-full flex justify-center mt-8'>
      <div className='bg-white shadow-md w-[100%] lg:w-[50%] rounded-lg  text-neutral-800'>
        <form action="" onSubmit={submitHandler} className='grid gap-4 p-2 py-10 lg:p-10'>
            <h1 className='text-2xl font-semibold text-center pb-2'>Reset Password</h1>
            <div className='grid gap-1'>
              <label 
                htmlFor="newPassword" 
                className='text-sm font-medium'
              >
                New Password : 
              </label>
              <div className='grid relative'>
                <input type={showNewPassword?"text":"password"} onChange={handleChange} placeholder='Enter New Password' name='newPassword' id='newPassword' className='p-2 pr-10 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm cursor-pointer'/>
                <span className='text-xl absolute right-2 top-2' onClick={()=> setShowNewPassword((prev)=> !prev)}>
                      {
                        showNewPassword?(<LuEye/>):(<LuEyeClosed/>)
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
                <input type={showConfirmPassword?"text":"password"} onChange={handleChange} placeholder='Enter Your Confirm Password' name='confirmPassword' id='confirmPassword' className='p-2 pr-10 border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-sm'/>
                <span className='text-xl absolute right-2 top-2 cursor-pointer' onClick={()=> setShowConfirmPassword((prev)=> !prev)}>
                      {
                        showConfirmPassword?(<LuEye/>):(<LuEyeClosed/>)
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

export default ResetPassword