import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { IoSearchOutline } from "react-icons/io5";
import ConfirmBox from '../components/ConfirmBox';
import EditProduct from '../components/EditProduct';


const AdminProduct = () => {
  const [page,setPage] = useState(1)
  const [limit,setLimit] = useState(12)
  const [search, setSearch] = useState("")
  const [allproducts, setAllProducts] = useState([])
  const [totalRecord, setTotalRecord] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [openConfirmBox, setOpenConfirmBox] = useState(false)
  const [openEditBox, setOpenEditBox] = useState(false)
  const [update, setUpdate] = useState({
    _id:"",
    name:"",
    image:[],
    categoryId:[],
    subCategoryId:[],
    unit:"",
    stock:"",
    price:"",
    discount:"",
    description:"",
    moreDetails:{},
  })
  const [deleteId, setDeleteId] = useState("")

  const fetchProduct = async()=>{
    try {
      const response = await Axios({
        ...summery.getProducts,
        data:{
          page,
          limit,
          search
        }
      })
      const { data : responseData } = response
      
      if(responseData?.success){

        setAllProducts(responseData?.data?.data)
        setTotalRecord(responseData?.data?.totalCount)
        setTotalPages(responseData?.data?.totalPages)
      }
    } catch (error) {
      // toast.error(error?.response?.data?.message)
    }
  }

  useEffect(()=>{
    fetchProduct()
  },[page])

  useEffect(()=>{
    const interval = setTimeout(()=>{
      fetchProduct()
    },300)
    return ()=>{
      clearTimeout(interval)
    }
  },[search])

  const deleteHandler = async()=>{
    try {
      const response = await Axios({
        ...summery.deleteProduct,
        data:{
          _id:deleteId
        }
      })
      const { data : responseData } = response
      
      if(responseData?.success){
        toast.success(responseData?.message)
        fetchProduct()
        setOpenConfirmBox(false)
        setDeleteId("")
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error(error?.response?.message)
      }
    }
  }

  return (
    <section className='p-4 h-full flex flex-col justify-between'>
        <div className='p-2 shadow-sm flex flex-col gap-2 md:gap-0 md:flex-row justify-between md:items-center'>
          <h1 className='font-semibold'>Admin Product</h1>
          <div className='border group focus-within:border-primary200 rounded max-w-sm flex items-center cursor-pointer'>
            <div className='p-2'>
            <IoSearchOutline className='text-2xl text-neutral-600 font-light group-focus-within:text-primary200' />
            </div>
            <input
              type='text'
              placeholder='Search Product...'
              className='rounded w-full p-2 outline-none'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
        </div>
        {
          allproducts.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 py-4'>
            {
              allproducts.map((product,index)=>(
                <div key={product._id+"product"} className='rounded flex flex-col justify-between max-w-40 shadow-md border p-2'>
                  <div className='h-28 md:h-32'>
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className='w-full h-full'
                    />
                  </div>
                  <p className='text-center text-sm py-1'>{product.name}</p>
                  <div className='p-1 flex gap-2'>
                    <button className='border py-1 px-1 rounded border-blue-500 text-blue-500' onClick={()=>{
                      setOpenEditBox(true)
                      setUpdate(product)
                    }}>Edit</button>
                    <button className='border py-1 px-1 rounded border-red-500 text-red-500' onClick={()=>{
                      setOpenConfirmBox(true)
                      setDeleteId(product._id)
                      }}>Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
          )
        } 
        {
          totalPages > 1 && (
            <div className='flex justify-between'>
              <button className='border rounded border-primary200 py-2 px-4 hover:bg-primary200 text-sm hover:text-gray-100' onClick={()=>{
                if(page > 1){
                  setPage(prev => prev-1)
                }
              }}>Previous</button>
              <p>{ page } / {totalPages}</p>
              <button className='border rounded border-primary200 py-2 px-4 hover:bg-primary200 text-sm hover:text-gray-100' onClick={()=> {
                if(page < totalPages){
                  setPage(prev => prev+1)
                }
              }}>Next</button>
            </div>
          )
        }     
        
        {
          openConfirmBox && (
            <ConfirmBox close={()=>setOpenConfirmBox(false)} confirm={deleteHandler} />
          )
        }
        {
          openEditBox && (
            <EditProduct product={update} fetchProduct={fetchProduct} setProduct={setUpdate} close={()=>setOpenEditBox(false)}/>
          )
        }
    </section>
  )
}

export default AdminProduct