import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import { currencyConverter } from "../utils/currencyConverter";
import AddAddress from "../components/AddAddress";
import { toast } from "react-toastify";
import Axios from "../utils/Axios";
import summery from "../common/summery";
import { useNavigate } from "react-router";
import {loadStripe} from '@stripe/stripe-js';

const CheckoutPage = () => {
  const addressStore = useSelector(state => state?.address?.addresses)
  const cartStore = useSelector(state => state?.cart?.cartItems)
  const { totalPrice, totalQty, notDicountedPrice, fetchCartItems } = useGlobalContext();
  const [openAddressPage, setOpenAddressPage] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...summery.createOrder,
        data:{
          listItems : cartStore,
          totalAmount : totalPrice,
          deliveryAddress : addressStore[selectedAddress]._id,
          subTotalAmount : notDicountedPrice
        }
      })

      const {data : responseData} = response
      if(responseData?.success){
        fetchCartItems()
        navigate("/success",{
          state:{
            text : "Order"
          }
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || error?.response?.message || "Something went wrong");
    }
  }

  const handlePaymentOrder = async ()=>{
    try {
      toast.loading("Creating order...")
      const publishKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripe = await loadStripe(publishKey);

      const response = await Axios({
        ...summery.createPaymentOrder,
        data:{
          listItems : cartStore,
          totalAmount : totalPrice,
          deliveryAddress : addressStore[selectedAddress]?._id,
          subTotalAmount : notDicountedPrice
        }
      })

      const {data : responseData} = response
      
      if(responseData?.id) {
        // Order created successfully, clear cart immediately
        toast.dismiss()
        toast.success("Order created! Redirecting to payment...")
        
        if(fetchCartItems){
          fetchCartItems()
        }
        
        // Redirect to Stripe checkout
        stripe.redirectToCheckout({sessionId:responseData.id})
      }
      
    } catch (error) {
      toast.dismiss()
      toast.error(error?.response?.data?.message || error?.message || error?.response?.message || "Something went wrong");
    }
  }

  return (
    <section className="min-h-[79vh] p-4 bg-blue-50">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h1 className="font-semibold">Choose your address</h1>
          <div className="bg-white p-2 grid gap-2">
            {
              addressStore?.map((address,index)=>(
                <label key={"addressCheckouPage"+index} htmlFor={'confirmBox'+index} className="border py-2 px-4 text-sm">
                  <div className="flex items-start">        
                    {
                      selectedAddress === index ? (
                        <input type="radio" id={'confirmBox'+index} name="confirmAddress" onChange={()=>setSelectedAddress(index)}  defaultChecked />
                      ) : (
                        <input type="radio" id={'confirmBox'+index} name="confirmAddress" className="" onChange={()=>setSelectedAddress(index)} />
                      )
                    }
                    <div  className="w-full px-2">
                      <h1>{address?.addressLine}</h1>
                      <p>{address?.city} - {address?.pincode}</p>
                      <p>{address?.state}</p>
                      <p>{address?.country}</p>
                      <p>{address?.mobile}</p>
                    </div>
                  </div>
                </label>
              ))
            }
            <div className="border-dashed border-2 p-4 flex items-center justify-center min-h-24 bg-blue-50 cursor-pointer" onClick={()=>setOpenAddressPage(true)}>
              <p>Add address</p>
            </div>
          </div>
        </div>
        <div className="p-2 lg:p-4 bg-white">
          <h1 className="font-semibold">Summary</h1>
          <div className="text-sm my-2 p-4">
            <div className="font-semibold">Bill details</div>
            <div className="p-2">
              <div className="flex justify-between items-center">
                <p>Items total</p>
                <p className="flex gap-2">
                  <span className="text-neutral-400 line-through">
                    {currencyConverter(notDicountedPrice)}
                  </span>
                  <span>{currencyConverter(totalPrice)}</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p>Quantity total</p>
                <p>{totalQty} Items</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Delivery Charge</p>
                <p>free</p>
              </div>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <p>Grand total</p>
              <p>{currencyConverter(totalPrice)}</p>
            </div>
          </div>
          <div className="grid gap-3">
            <button className="p-2 border border-green-700 bg-green-700 text-white rounded hover:bg-green-800" onClick={handlePaymentOrder}>
              Make Payment Online
            </button>
            <button className="p-2 border border-green-700 rounded hover:bg-green-700 hover:text-white" onClick={handleCashOnDelivery}>
              Cash On Delivery
            </button>
          </div>
        </div>
      </div>
      {openAddressPage && <AddAddress close={() => setOpenAddressPage(false)} />}
    </section>
  );
};

export default CheckoutPage;
