import React, { useEffect, useState } from 'react'
import AddNewCategory from '../components/AddNewCategory';
import Axios from '../utils/Axios';
import summery from '../common/summery';
import Loading from '../components/Loading'
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { setCategories } from '../store/productSlice'

const Category = () => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.product.allCategories)
  const [ openNewCategory , setOpenNewCategory] = useState(false)
  const [loading,setLoading] = useState(true)
  // const [categories , setCategories] = useState([])
  const [openEditCategory,setOpenEditCategory] = useState(false)
  const [editCategory,setEditCategory] = useState({
    _id:'',
    name:'',
    image:''
  })
  const [deleteId,setDeleteId] = useState('')

  const fetchCategory = async ()=>{
    try {
      setLoading(true)
      const response = await Axios({
        ...summery.getCategories
      })
      const {data : responseData} = response
      if(responseData.success){
        dispatch(setCategories(responseData.data))
      }else{
        toast.error(responseData?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error('Internal Server Error' + error?.response?.message)
      }
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchCategory()
  },[])

  const handleDeleteCategory = async ()=>{
    if(!deleteId) return toast.error("All Fields are Required")

    try {
      const response = await Axios({
        ...summery.deleteCategory,
        data:{_id:deleteId}
      })
      const {data : responseData} = response
      if(responseData.success){
        toast.success(response?.data?.message)
        fetchCategory()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error('Server Error :' + error?.response?.message)
      }
    } finally {
      setDeleteId('')
    }
  }

  return (
    <section>
        <div className='flex items-center justify-between px-4 py-2 shadow-md'>
            <div className='font-semibold'>Category</div>
            <div onClick={()=> setOpenNewCategory(true)} className='border px-4 py-2 text-sm border-primary200 rounded hover:bg-primary200 hover:text-white cursor-pointer select-none'>Add Category</div>
        </div>
          {
            openNewCategory && (
              <AddNewCategory fetch={()=>fetchCategory()} close={()=>setOpenNewCategory(false)}/>
            )
          }
          {
            loading && (
              <Loading/>
            )
          }
          {
            !loading && categories && (
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 py-5 gap-2'>
                {
                  categories.map((cate,index)=>(
                    <div key={index} className='h-60 w-36 shadow-md flex gap-1 items-center justify-center flex-col'>
                      <div className=''>
                        <img
                          src={cate.image}
                          alt={cate.name}
                          className='w-36 h-48 object-scale-down'
                        />
                      </div>
                      <div className='flex gap-2'>
                        <button className='border border-blue-500 text-blue-500 hover:bg-blue-200 cursor-pointer  py-1 px-2 rounded' onClick={()=>{
                          setOpenEditCategory(true)
                          setEditCategory(cate)
                        }}>Edit</button>
                        <button className='border border-red-500 text-red-500 hover:bg-red-200 cursor-pointer  py-1 px-2 rounded' onClick={()=>setDeleteId(cate._id)}>Delete</button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            openEditCategory && (
              <EditCategory data={editCategory} close={()=>setOpenEditCategory(false)} fetch={fetchCategory}/>
            )
          }
          {
            deleteId && (
              <ConfirmBox confirm={handleDeleteCategory} close={()=>setDeleteId("")}/>
            )
          }
    </section>
  )
}

export default Category