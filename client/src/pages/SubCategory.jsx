import React, { useEffect, useState } from 'react'
import AddSubCategory from '../components/AddSubCategory'
import { createColumnHelper } from '@tanstack/react-table'
import DisplayTable from '../components/DisplayTable'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";
import ViewImage from '../components/ViewImage'
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { setSubCategories } from '../store/productSlice'
import { toast } from 'react-toastify'
import ConfirmBox from '../components/ConfirmBox'

const SubCategory = () => {
  const dispatch = useDispatch()
  const subCategoryDetails = useSelector(state => state.product.allSubCategories)
  const [openAddSubCategory, setOpenSubCategory] = useState(false)
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false)
  const [viewImage,setViewImage] = useState("")
  const [editData,setEditData] = useState({
    _id:'',
    name:'',
    image:'',
    category:[]
  })
  const [deleteItem,setDeleteItem] = useState("")

  const FetchSubCategories = async ()=>{
    try {
      const response = await Axios({
        ...summery.getSubCategory,
      })
      const { data : responseData} = response
      if(responseData.success){
        dispatch(setSubCategories(responseData.data))
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    FetchSubCategories()
  },[])

  const columnHelper = createColumnHelper()
  const columns = [
    columnHelper.accessor("name",{
      header:"Name"
    }),
    columnHelper.accessor("image",{
      header:"Image",
      cell: ({row})=>{
        return (
          <div className='flex items-center justify-center py-1 cursor-pointer' onClick={()=>setViewImage(row.original.image)}>
            <img src={row.original.image} alt={row.original.name} className='h-8 w-8' />
          </div>
        )
      }
    }),
    columnHelper.accessor("category",{
      header: "Category",
      cell: ({row})=>{
        return (
            <div className='flex flex-wrap gap-1'>
              {
                row.original.category.map((value,index)=>(
                  <span key={value._id+"category"} className='bg-white shadow-md p-1'>{value.name}</span>
                ))
              }
            </div>
        )
      }
    }),
    columnHelper.accessor("_id",{
      header:"Action",
      cell: ({row})=>{
        return (
          <div className='flex justify-center items-center gap-2 p-1'>
            <button className='border border-blue-500 p-1 rounded text-blue-500 hover:bg-blue-500 hover:text-white' onClick={()=>{
              setEditData(row.original)
              setOpenEditSubCategory(true)
              }}><MdEdit size={22}/></button>
            <button className='border border-red-500 p-1 rounded text-red-500 hover:bg-red-500 hover:text-white' onClick={()=>setDeleteItem(row.original._id)}><MdDelete size={22}/></button>
          </div>
        )
      }
    })
  ]

  const deleteHandler = async()=>{
    if(!deleteItem){
      toast.error("Sub Category Id does not exist")
    }
    try {
      const response = await Axios({
        ...summery.deleteSubCategory,
        data:{_id:deleteItem}
      })
      const { data : responseData} = response
      if(responseData.success){
        toast.success(responseData?.message)
        FetchSubCategories()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error(error?.response?.message)
      }
    } finally {
      setDeleteItem("")
    }
  }

  return (
    <section className='p-2'>
      <div className='flex items-center justify-between shadow-md py-2 px-3'>
        <div className='font-semibold'>Sub Category</div>
        <button className='border border-primary200 py-2 px-3 rounded text-sm hover:bg-primary200 hover:text-white' onClick={()=>setOpenSubCategory(true)}>Add Sub Category</button>
      </div>
      <div>
        <div>
          <DisplayTable columns={columns} data={subCategoryDetails}/>
        </div>
      </div>
      {
        openAddSubCategory && (
          <AddSubCategory fetchSubCategories={FetchSubCategories} close={()=> setOpenSubCategory(false)}/>
        )
      }
      {
        viewImage && (
          <ViewImage url={viewImage} close={()=>setViewImage("")}/>
        )
      }
      {
        openEditSubCategory && (
          <EditSubCategory close={()=>setOpenEditSubCategory(false)} fetchSubCategories={FetchSubCategories} editData={editData}/>
        )
      }
      {
        deleteItem && (
          <ConfirmBox close={()=>setDeleteItem("")} confirm={deleteHandler} />
        )
      }
    </section>
  )
}

export default SubCategory