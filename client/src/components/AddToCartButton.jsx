import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import {toast} from 'react-toastify'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../provider/GlobalProvider.jsx'
import { FaPlus,FaMinus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

const AddToCartButton = ({product}) => {
    const cartItem = useSelector(state => state.cart.cartItems)
    const [isItemCart,setIsItemCart] = useState(false)
    const [productDetails,setProductDetails] = useState()
    const [qty,setQty] =useState(0)
    const { fetchCartItems,updateCartHandler,deleteCartItem } = useGlobalContext()
    const navigate = useNavigate()

    const addToCartHandler = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        try {
            const response = await Axios({
                ...summery.addToCart,
                data:{
                    productId: product._id,
                    quantity: 1,
                }
            })
            const {data : responseData} = response
            if(responseData?.success){
                fetchCartItems()
                toast.success(responseData?.message)
            }
        } catch (error) {

            if(error?.response?.status === 401){
                navigate("/login")
                toast.error("Please Login!")
            }else{
                toast.error(error?.response?.data?.message)
            }
            if(error?.response?.status === 500){
                toast.error(error?.response?.message)
            }
        }
    }

    const addItems = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        const response = await updateCartHandler(productDetails?._id,qty+1)
        if(response?.success){
            toast.success("Item added")
        }
    }

    const removeItems = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            const response = await deleteCartItem(productDetails?._id)
            if(response?.success){
                toast.error("Item removed")
            }
        }else{
            const response = await updateCartHandler(productDetails?._id,qty-1)
            if(response?.success){
                toast.error("Item removed")
            }
        }
    }

    useEffect(()=>{
        setIsItemCart(cartItem.some(item => item?.productId?._id === product._id))
        const getProduct = cartItem.find(item => item?.productId?._id === product._id)
        setProductDetails(getProduct)
        setQty(getProduct?.quantity || 0)
    },[cartItem,product])

  return (
    <>
        {
            isItemCart ? (
               <div className='flex gap-2 items-center'>
                    <button className='bg-green-700 hover:bg-green-800 text-white p-1 rounded' onClick={removeItems}><FaMinus size={18}/></button>
                    <p className='font-semibold'>{qty}</p>
                    <button className='bg-green-700 hover:bg-green-800 text-white p-1 rounded' onClick={addItems}><FaPlus size={18}/></button>
               </div>
            ):(
                <button onClick={addToCartHandler} className='py-1 px-4 text-xs lg:text-sm bg-green-700 hover:bg-green-800 text-white rounded'>Add</button>
            )
        }
    </>
    
  )
}

export default AddToCartButton