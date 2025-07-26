import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { useGlobalContext } from '../provider/GlobalProvider'
import { MdEdit,MdDelete } from "react-icons/md";
import AddAddress from '../components/AddAddress';
import EditAddress from '../components/EditAddress';
import ConfirmBox from '../components/ConfirmBox';
import Axios from '../utils/Axios';
import { toast } from 'react-toastify';
import summery from '../common/summery';

const Address = () => {
  const addressStore = useSelector(state => state?.address?.addresses)
  const { fetchAddress } = useGlobalContext()
  const [openAddressModal, setOpenAddressModal] = useState(false)
  const [openEditAddressModal, setOpenEditAddressModal] = useState(false)
  const [editAddress, setEditAddress] = useState(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(()=>{
    fetchAddress()
  },[])

  const deleteHandler = async()=>{
    try {
      const response = await Axios({
        ...summery.disableAddress,
        data: { _id: deleteId }
      })
      const { data: responseData } = response
      if (responseData?.success) {
        toast.success('Address Deleted successfully')
        fetchAddress()
        setOpenDeleteModal(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if (error?.response?.status === 500) {
        toast.error(error?.response?.message)
      }
    }
  }

  return (
    <section className='p-2'>
      <div className='shadow p-2 flex justify-between items-center'>
        <h1 className="font-semibold">Address</h1>
        <button onClick={()=>setOpenAddressModal(true)} className='border border-primary200 p-2 hover:bg-primary200 hover:text-white rounded'>Add Address</button>
      </div>
      <div className='p-2 text-sm grid gap-2'>
          {
            addressStore?.map((address, index) => (
              <div key={index} className='border p-2 flex justify-between'>
                <div>
                  <h3>{address.addressLine}</h3>
                  <p>{address.city}</p>
                  <p>{address.country}</p>
                  <p>{address.state}</p>
                  <p>{address.pincode}</p>
                  <p>{address.mobile}</p>
                </div>
                <div className='flex gap-1 items-start'>
                  <button className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded' onClick={()=>{
                    setEditAddress(address)
                    setOpenEditAddressModal(true)
                  }}><MdEdit size={18}/></button>
                  <button className='bg-red-500 hover:bg-red-600 text-white p-2 rounded' onClick={()=>{
                    setDeleteId(address?._id)
                    setOpenDeleteModal(true)
                  }}><MdDelete size={18}/></button>
                </div>
              </div>
            ))
          }
      </div>
      {
        openAddressModal && (
          <AddAddress close={()=>setOpenAddressModal(false)}/>
        )
      }
      {
        openEditAddressModal && (
          <EditAddress close={()=>setOpenEditAddressModal(false)} address={editAddress}/>
        )
      }
      {
        openDeleteModal && (
          <ConfirmBox close={()=>setOpenDeleteModal(false)} confirm={()=>deleteHandler()}/>
        )
      }
    </section>
  )
}

export default Address