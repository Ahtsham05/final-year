import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({url,close}) => {
  return (
    <section className='fixed h-full w-full top-0 left-0 bottom-0 right-0 bg-neutral-700 bg-opacity-60 p-4 flex items-center justify-center z-[100]'>
        <div className='bg-white w-full max-w-lg p-2 h-[80%] relative'>
          <button className='block ml-auto cursor-pointer' onClick={close}><IoClose size={25}/></button>
            <img src={url} alt="View Image" className='h-full w-full object-scale-down'/>
        </div>
    </section>
  )
}

export default ViewImage