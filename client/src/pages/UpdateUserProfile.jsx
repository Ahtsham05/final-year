import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import summery from '../common/summery';
import UpdateUserAvatar from '../components/UpdateUserAvatar';
import Axios from '../utils/Axios';
import { setUpdateUserDetails } from '../store/userSlice';



const UpdateUserProfile = () => {
    const [openUpdateAvatar, setOpenUpdateAvatar] = useState(false)
    const user = useSelector(state => state.user);
    const dispatch = useDispatch()
    const [data,setData] = useState({
        name: user?.name,
        mobile: user?.mobile
    })

    useEffect(()=>{
        setData({
            name: user?.name,
            mobile: user?.mobile
        })
    },[user])

    const validateFields = Object.values(data).every(val=>val)

    const onChangeHandler = (e)=>{
        const {name,value} = e.target
        setData(prev =>{
            return {...prev,[name]:value}
        })
    }

    const submitHandler = async (e)=>{
        e.preventDefault()
        if(!validateFields){
            toast.error("All fields are required!")
            return
        }

        try {
            const response = await Axios({
                ...summery.updateUserDetails,
                data: data
            })
            if(response?.data?.success){
                // console.log(response)
                dispatch(setUpdateUserDetails(response?.data?.data))
                toast.success(response?.data?.message)
            }else{
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error("Server Error :" + error?.response?.status)
            }
        }

    }
  return (
    <section>
        <div>
            <div>
                <div className='text-xl font-semibold'>Update User Profile</div>
                <div className='mt-5'>
                    <div className=' h-20 w-20 rounded-full flex items-center justify-center relative overflow-hidden'>
                        {
                            user.avatar ? (
                                <img src={user?.avatar} alt={user?.name}  className='h-full w-full object-cover'/>
                            ):(
                                <FaRegUserCircle size={80} className='font-medium'/>
                            )
                        }    
                    </div>
                    <button onClick={()=>setOpenUpdateAvatar(true)} className='border-primary200 border py-1 px-3 hover:bg-primary200 hover:text-white mt-2 ml-2 text-sm capitalize'>Edit</button>
                    {
                        openUpdateAvatar && (
                                <UpdateUserAvatar close={()=> setOpenUpdateAvatar(false)}/>
                        )
                    }
                </div>
                <div className='grid gap-2 mt-5'>
                    <form className='grid gap-3' onSubmit={submitHandler}>
                        <div className='grid gap-1'>
                            <label htmlFor='name'>Name</label>
                            <input type="text" name='name' onChange={onChangeHandler} value={data.name} required className='bg-blue-50 outline-none border p-2 rounded'/>
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='mobile'>Mobile</label>
                            <input type="text" name='mobile' onChange={onChangeHandler} value={data.mobile} required className='bg-blue-50 outline-none border p-2 rounded'/>
                        </div>
                        <button className='border-primary200 border py-2 font-semibold hover:bg-primary200 hover:text-white rounded' disabled={!validateFields}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default UpdateUserProfile