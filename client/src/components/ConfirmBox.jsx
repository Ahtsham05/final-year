import React from 'react'
import { IoClose } from "react-icons/io5";


const ConfirmBox = ({close,confirm}) => {
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-700 bg-opacity-60 flex items-center justify-center p-4 z-[100]'>
        <div className='w-full max-w-md bg-white p-2 grid gap-8'>
            <div className='flex justify-between'>
                <h1 className='font-semibold text-xl'>Are you sure?</h1>
                <div className='cursor-pointer' onClick={close}><IoClose size={30}/></div>
            </div>
            <p>You will not able to recover this record !</p>
            <div className='flex justify-end gap-2'>
                <button className=' py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-200' onClick={close}>Cancel</button>
                <button className=' py-2 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-200' onClick={confirm}>Delete</button>
            </div>
        </div>
    </section>
  )
}

export default ConfirmBox