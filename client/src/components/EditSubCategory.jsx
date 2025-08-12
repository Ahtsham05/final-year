import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/uploadImage"
import {toast} from "react-toastify"
import Loading from './Loading';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import summery from '../common/summery';


const EditSubCategory = ({close,editData,fetchSubCategories}) => {
    const storeCategories = useSelector(state => state.product.allCategories)
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState({
        _id:editData._id,
        name:editData.name,
        image:editData.image,
        category:editData.category
    })
    const validateFields = Object.values(data).every((val,index) => {
        if(index === 2){
            return val.length > 0
        }
        return val
    })

    const handleInputChange = (e)=>{
        const {name,value} = e.target
        setData((prev)=>{
            return {...prev,[name]:value}
        })
    }

    const handleSelectBox = (e)=>{
        const categoryId = e.target.value
        const categoryDetails = storeCategories.find(val => val._id == categoryId)

        // console.log(categoryDetails)

        setData((prev)=>{
            return {
                ...prev,
                category: [...prev.category,categoryDetails]
            }
        })
    }
// console.log(data)
    const handleFileChange = async (e)=>{
        const file = e.target.files[0]
        if(!file) return

        try{
            setLoading(true)
            const response = await uploadImage(file)
            const {data : responseData} = response
            if(responseData?.success){
                setData((prev)=>{
                    return {...prev, image:responseData?.data?.url}
                })
            }
        }catch(error){
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error(error?.response?.message)
            }
        }finally{
            setLoading(false)
        }
    }

    const removeCategory = (value)=>{
        const indexId = data.category.findIndex((val) => val._id === value)
        data.category.splice(indexId,1)
        setData((prev)=>{
            return {...prev}
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!validateFields){
            toast.error("All Fields Are Required!")
            return
        }

        try {
            const response = await Axios({
                ...summery.updateSubCategory,
                data:data
            })
            const {data : responseData} = response
            // console.log(responseData)
            if(responseData?.success){
                toast.success(responseData?.message)
                if(close){
                    close()
                }
                if(fetchSubCategories){
                    fetchSubCategories()
                }
            }else{
                toast.error(responseData?.data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
            if(error?.response?.status === 500){
                toast.error(error?.response?.message)
            }
        }
    }

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-700 bg-opacity-60 p-4 flex items-center justify-center z-[100]'>
        <div className='w-full max-w-lg bg-white px-2 py-4 grid gap-3'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold'>Edit Sub Category</h1>
                <div onClick={close} className='cursor-pointer'><IoClose size={25}/></div>
            </div>
            <div className='grid'>
                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="name" className='font-medium text-sm'>Name</label>
                        <input type="text" name='name' value={data.name} id='name' className='outline-none bg-blue-50 p-2 border focus-within:border-primary200 rounded text-sm' onChange={handleInputChange} placeholder='Enter Sub Category'/>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="image" className='text-sm font-medium'>Sub Category Image</label>
                        <div className='flex items-center flex-col lg:flex-row gap-5'>
                            <div className='bg-blue-50 h-36 lg:w-36 w-full border text-neutral-600 text-sm flex items-center justify-center'>
                                {
                                    data.image ? (
                                        <img
                                            src={data.image}
                                            alt={data.name}
                                            className='h-full w-full object-scale-down'
                                        />
                                    ):"No Image"
                                }
                            </div>
                            <label htmlFor="image" className={`text-sm border select-none ${data.name ? 'border-primary200 hover:bg-primary200':'border-gray-500 hover:bg-gray-500'}  py-2 px-4 rounded  hover:text-white cursor-pointer group`}> 
                            {
                                loading ?(
                                    <span className='flex gap-2 items-center justify-center'>
                                        <div className={`border-gray-400 h-4 w-4 animate-spin rounded-full border-2 border-t-white`} />
                                        <span>Loading...</span>
                                    </span>
                                ): "Upload"
                            } </label>
                            <input type="file" disabled={!data.name} onChange={handleFileChange} id='image' name='image' className='hidden' />
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="category" className='font-medium text-sm'>Select Category</label>
                        <select onChange={handleSelectBox} name="category" id="category" className='text-sm border outline-none bg-blue-50 p-2 rounded focus-within:border-primary200'>
                            <option value="">Select Category</option>
                            {
                                storeCategories.map((mainCategory)=>(
                                    <option key={mainCategory._id} value={mainCategory._id}>{mainCategory.name}</option>
                                ))
                            }
                        </select>
                        <div className='mt-2 flex flex-wrap gap-3 items-center'>
                            {
                                data.category.length > 0 ? 
                                    data.category.map((value,index)=>(
                                        <div key={value._id} className='py-2 px-4 border bg-blue-50 text-sm rounded flex gap-2 items-center'>
                                            <span className=''>{value.name}</span>
                                            <span className='cursor-pointer' onClick={()=>removeCategory(value.name)}><IoClose size={18}/></span>
                                        </div>
                                    ))
                                :""
                            }
                            
                        </div>
                    </div>
                    <button className={`text-sm border p-2 rounded ${validateFields ? 'border-primary200 hover:bg-primary200':'border-gray-500 hover:bg-gray-500'} hover:text-white`}>Update Sub Category</button>
                </form>
            </div>
        </div>
    </section>
  )
}

export default EditSubCategory