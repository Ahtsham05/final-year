import React, { useEffect, useRef, useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Axios from '../utils/Axios';
import summery from '../common/summery';
import { toast } from 'react-toastify';
import {Link, useLocation, useNavigate} from 'react-router-dom'

const VerifyOtp = () => {
  const [data,setData] = useState(["","","","","",""])
  const inputRef = useRef([])
  const location = useLocation()
  const navigate = useNavigate()
  
  const validateAllFieldIsRequired = data.every(el => el)
  
  useEffect(()=>{
    if(!location?.state?.email){
      navigate("/")
    }
  },[])

  const submitHandler = async (e)=>{
    e.preventDefault()
    if(!validateAllFieldIsRequired){
      toast.error("All fields are required")
      return 0;
    }
    if(!location.state && !location.state?.email){
      toast.error("UnAuthorized Access!")
      navigate("/forget-password")
      return 0;
    }
    // Combine all otp inputs into one string
    const otp = data.join("")
    try {
      const response = await Axios({
        ...summery.verifyOtp,
        data:{
          email:location?.state?.email,
          otp: otp
        }
      })
      toast.success(response.data.message)
      navigate("/reset-password",{
        state:{
          email: location?.state?.email,
          otp:response?.data
        }
      })
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
            <h1 className='text-[20px] font-semibold pb-2'>Enter OTP :</h1>
            <div className='grid gap-1'>
              <div className='flex gap-2 justify-center lg:justify-between p-2'>
                {
                  data.map((value,index)=>(
                    <input
                      key={'otp' + index} 
                      type="text"
                      name={'otp'+index} 
                      id={`otp${index}`} 
                      ref={(ref)=>{
                        inputRef.current[index]=ref
                        return ref
                      }}
                      maxLength={1}
                      value={data[index]}
                      onChange={(e)=>{
                        const value = e.target.value;
                        const newData = [...data]
                        newData[index] = value
                        setData(newData)

                        if(value && index < 5){
                          inputRef.current[index+1].focus()
                        }
                      }} 
                      className='p-3 py-4 max-w-[50px] lg:max-w-[70px] text-center border rounded-md outline-none focus-within:border-primary200 bg-slate-50 text-xl font-semibold'
                    />
                  ))
                }
              </div>
            </div>
            <button disabled={!validateAllFieldIsRequired} className={`${validateAllFieldIsRequired?"bg-green-700 hover:bg-green-800":"bg-gray-500"} cursor-pointer p-2 rounded-md mt-5 text-white tracking-wide`}>Verify Otp</button>
            <p className='text-[16px]'>Already have an account? <Link to={"/login"} className='text-green-800 font-semibold'>Login</Link></p>
        </form>
      </div>
    </section>
  )
}

export default VerifyOtp