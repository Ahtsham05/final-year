import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { toast } from 'react-toastify'

const SuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location?.state?.text
  const { fetchCartItems } = useGlobalContext()
  const hasVerified = useRef(false) // Prevent multiple verification calls

  useEffect(() => {
    // Get session ID from URL parameters for Stripe payments
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    const handlePaymentVerification = async () => {
      // Only verify if we have a session ID and haven't already verified
      if (sessionId && !hasVerified.current) {
        hasVerified.current = true; // Mark as verified to prevent duplicate calls
        
        try {
          console.log('Verifying payment for session:', sessionId);
          
          // Call the verification endpoint as fallback
          const response = await Axios({
            method: 'POST',
            url: '/api/v1/order/verify-payment',
            data: { sessionId },
          });
          
          if (response.data.success) {
            console.log('Payment verified and order updated');
            toast.success('Order confirmed successfully!');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          // Only show error if it's not already processed
          if (error.response?.status !== 200) {
            console.log('Verification failed, but this might be normal if webhook already processed');
          }
        }
      }
      
      // Refresh cart items regardless (but only once)
      if (fetchCartItems && !hasVerified.current) {
        fetchCartItems();
      }
    };
    
    // Add a small delay to ensure webhook has time to process first
    const timer = setTimeout(handlePaymentVerification, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array to run only once

  return (
    <section className="min-h-[79vh] p-4">
      <div className='flex items-center justify-center'>
        <div className="bg-green-200 p-5 flex items-center justify-center flex-col gap-4 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-green-900">{order === "Order"? "Order Placed" : "Payment"} Successfully</h1>
          <button onClick={()=>navigate("/")} className='border border-green-900 p-2 px-4 text-green-900 hover:bg-green-900 hover:text-white'>Go To Home</button>
        </div>
      </div>
    </section>
  )
}

export default SuccessPage