import React from 'react'
import { useNavigate } from 'react-router-dom'

const CancelPage = () => {
  const navigate = useNavigate()
  return (
    <section className="min-h-[79vh] p-4">
      <div className='flex items-center justify-center'>
        <div className="bg-red-200 p-5 flex items-center justify-center flex-col gap-4 w-full max-w-sm">
          <h1 className="text-lg font-semibold text-red-900"> Order Cancel !</h1>
          <button onClick={()=>navigate("/")} className='border border-red-900 p-2 px-4 text-red-900 hover:bg-red-900 hover:text-white'>Go To Home</button>
        </div>
      </div>
    </section>
  )
}

export default CancelPage