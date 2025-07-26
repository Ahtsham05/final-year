import React from 'react'

const LoadingProductCard = () => {
  return (
    <div className='grid h-full gap-2 min-w-36 lg:min-w-48 rounded-md overflow-hidden p-2 border shadow'>
      <div className='h-28 lg:h-36 bg-blue-50'></div>
      <div className='h-4 w-16 rounded text-sm p-[0.5px] px-1 bg-blue-50'></div>
      <div className='h-7 bg-blue-50'></div>
      <div className='h-4 bg-blue-50'></div>
      <div className='flex gap-2 items-center justify-between'>
          <div className='h-6 w-full bg-blue-50'></div>
          <div className='h-6 w-full bg-blue-50'></div>
      </div>
    </div>
  )
}

export default LoadingProductCard