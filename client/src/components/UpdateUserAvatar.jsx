import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { toast } from 'react-toastify'
import { setUpdateUserAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";


const UpdateUserAvatar = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading , setLoading] = useState(false)

    const updateUserAvatarHandler = async (e)=>{
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            const response = await Axios({
                ...summery.updateUserAvatar,
                data: formData
            })
            // console.log(response)
            if(response?.data?.success){
                dispatch(setUpdateUserAvatar(response?.data?.data?.avatar))
                toast.success(response?.data?.message)
            }else{
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error("Server error: " + error?.response?.status)
            }
            console.log(error)
        } finally{
            setLoading(false)
        }
    }
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-900 bg-opacity-60 flex items-center justify-center w-full p-4 z-[100]'>
        <div className='bg-white max-w-sm w-full p-4 flex flex-col items-center justify-center'>
            <div className='block ml-auto' onClick={close}><IoClose size={25}/></div>
            <div className=' h-20 w-20 rounded-full flex items-center justify-center relative overflow-hidden'>
                {
                    user.avatar ? (
                        <img src={user?.avatar} alt={user?.name}  className='h-full w-full object-cover'/>
                    ):(
                        <FaRegUserCircle size={80} className='font-medium'/>
                    )
                }    
            </div>
            <form className='mt-3' onSubmit={(e) => e.preventDefault()}>
                <input type="file" id='updateUserAvatar' onChange={updateUserAvatarHandler} className='hidden' />
                <label htmlFor='updateUserAvatar' className='border-primary200 border py-1 px-3 hover:bg-primary200 hover:text-white mt-2 text-sm capitalize'>{
                        loading? "Loading..." : "Upload"
                    }</label>
            </form>
        </div>
    </div>
  )
}

export default UpdateUserAvatar