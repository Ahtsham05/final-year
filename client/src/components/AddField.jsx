import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddField = ({close,add,field,setfield}) => {
  return (
    <section className='fixed bottom-0 top-0 right-0 left-0 p-4 bg-neutral-700 bg-opacity-60 flex items-center justify-center z-[100]'>
        <div className='w-full max-w-md bg-white rounded p-4 grid gap-8'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold'>Add Field</h1>
                <button onClick={close}><IoClose size={25}/></button>
            </div>
            <div className='grid gap-1'>
                <label htmlFor='addField' className='font-semibold text-sm'>Field Name</label>
                <input type="text" name='addField' value={field} onChange={(e)=>{
                    setfield(e.target.value)
                }} id='addField' placeholder='Enter Field Name' className='p-2 border rounded bg-blue-50 outline-none focus-within:border-primary200 text-sm'/>
            </div>
            <button className='p-2 border border-primary200  rounded hover:bg-primary200 cursor-pointer hover:text-white text-sm' onClick={add}>Add Field</button>
        </div>
    </section>
  )
}

export default AddField