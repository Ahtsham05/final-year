import React from 'react'

const LoadingCategoriesCard = () => {
  return (
        <div className='grid gap-1 rounded overflow-hidden animate-pulse shadow-md border p-1 md:p-2'>
            <div className='bg-blue-50 h-10 md:h-20 lg:h-32'></div>
            <div className='bg-blue-50 h-2 md:h-6 lg:h-8'></div>
        </div>
  )
}

export default LoadingCategoriesCard