import React from 'react'
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import summery from '../common/summery';
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';

const EditAddress = ({close,address}) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            _id: address?._id,
            addressLine: address?.addressLine,
            city: address?.city,
            state: address?.state,
            pincode: address?.pincode,
            country: address?.country,
            mobile: address?.mobile
          }
    });
    const {fetchAddress} = useGlobalContext()

    const submitHandler = async(data)=>{
        try {
            const response = await Axios({
                ...summery.updateAddress,
                data: data
            })
            const { data : responseData } = response
            if(responseData?.success){
                toast.success('Address Updated successfully')
                fetchAddress()
                close()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error(error?.response?.message)
            }
        }
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-700 z-[100] bg-opacity-60 flex justify-center items-center'>
        <div className='max-w-md w-full bg-white p-2'>
            <div className='flex justify-between p-2 shadow'>
                <h1 className='font-semibold'>Edit address</h1>
                <div onClick={close}><IoClose size={25}/></div>
            </div>
            <div className='my-2 text-sm p-2'>
                <form onSubmit={handleSubmit(submitHandler)} className='grid gap-2'>
                    <div className='grid gap-1'>
                        <label htmlFor="addressLine" className='font-medium'>Address Line</label>
                        <input type="text" id='addressLine' placeholder='Enter Address' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("addressLine")}/>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="city" className='font-medium'>City</label>
                        <input type="text" id='city' placeholder='Enter City' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("city")}/>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="state" className='font-medium'>State</label>
                        <input type="text" id='state' placeholder='Enter state' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("state")}/>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="pincode" className='font-medium'>Pincode</label>
                        <input type="text" id='pincode' placeholder='Enter Pincode' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("pincode")}/>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="country" className='font-medium'>Country</label>
                        <input type="text" id='country' placeholder='Enter Country' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("country")}/>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="mobile" className='font-medium'>Mobile</label>
                        <input type="text" id='mobile' placeholder='Enter Mobile' className='p-2 outline-none border bg-blue-50 rounded focus-within:border-primary200' {...register("mobile")}/>
                    </div>
                    <button className='border border-primary200 p-2 rounded my-2 hover:bg-primary200 hover:text-white'>Submit</button>
                </form>
            </div>
        </div>
    </section>
  )
}

export default EditAddress