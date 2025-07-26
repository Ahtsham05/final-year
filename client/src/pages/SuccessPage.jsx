import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location?.state?.text
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