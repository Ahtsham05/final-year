import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import Axios from "../utils/Axios.js"
import summery from '../common/summery.js';
import uploadImage from "../utils/uploadImage.js"
import { toast} from "react-toastify"

const AddNewCategory = ({close,fetch}) => {
    
    const [loading ,setLoading] = useState(false)
    const [data,setData] = useState({
        name: '',
        image: ''
    })

    const ValidateFields = Object.values(data).every(val => val)

    const handleChange = (e)=>{
        const {name,value} = e.target
        setData(prev => {
            return {...prev, [name]: value}
        })
    }

    const handleFileChange = async(e)=>{
        const image = e.target.files[0]
        if(!image) return

        setLoading(true)
        const {data : responseData} = await uploadImage(image)
        setLoading(false)
        // console.log(responseData)
        if(!responseData.success){
            toast.error("Couldn't upload image, try again!")
        }
        setData(prev=>{
            return {...prev,image:responseData?.data?.url}
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(!ValidateFields){
            toast.error("All fields are required!")
            return
        }

        try {
            const response = await Axios({
                ...summery.addCategory,
                data:data
            })
            const {data : responseData} = response
            if(responseData?.success){
                toast.success(responseData?.message)
                close()
                fetch()
            }else{
                toast.error(responseData?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error("Server error: " + error)
            }
        }
    }
    
  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-900 text-neutral-700 bg-opacity-60 p-4 flex items-center justify-center">
            <div className='bg-white max-w-lg w-full p-2'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-semibold'>Add New Category</h1>
                    <div className='cursor-pointer' onClick={close}><IoClose size={25}/></div>
                </div>
                <form onSubmit={handleSubmit} className='grid gap-4 mt-5'>
                    <div className='grid gap-1'>
                        <label htmlFor="category" className='text-sm font-semibold'>Name</label>
                        <input type="text" name='name' onChange={handleChange} placeholder='Enter Category Name'  className='border bg-blue-50 outline-none p-2 focus-within:border-primary200 rounded'/>
                    </div>
                    <div className='flex items-center gap-5'>
                        <div className='bg-blue-50 border h-36 w-36 flex items-center justify-center'>
                            {
                                data.image ? (
                                    <img
                                        src={data.image}
                                        alt={data.name}
                                        className='h-36 w-36 rounded object-scale-down'
                                    />
                                ):(
                                    "No Image"
                                )
                            }</div>
                        <label htmlFor="categoryImageBtn" className={`text-sm font-semibold border border-primary200 py-2 px-5 rounded hover:bg-primary200 hover:text-white cursor-pointer select-none ${!data.name && "border-none hover:bg-gray-400 hover:text-neutral-700 bg-gray-400"}`}>
                            {loading?(
                                        <span className='flex gap-2 items-center justify-center'>
                                            <div className={`border-gray-400 h-4 w-4 animate-spin rounded-full border-2 border-t-white`} />
                                            <span>Loading...</span>
                                        </span>
                                    ):"Upload"}
                        </label>
                        <input disabled={!data.name} name='image' onChange={handleFileChange} type="file" id='categoryImageBtn' className='hidden'/>
                    </div>
                    <div className='grid'>
                        <button disabled={!ValidateFields} className={`py-2 border border-primary200 rounded hover:bg-primary200 hover:text-white ${!ValidateFields && "bg-gray-400 border-none hover:bg-gray-400 hover:text-neutral-700"}`}>Add Category</button>
                    </div>
                </form>
            </div>
    </section>
  )
}

export default AddNewCategory