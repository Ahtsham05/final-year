import React from 'react'
import {currencyConverter} from '../utils/currencyConverter'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import AddToCartButton from './AddToCartButton';


const ProductCard = ({product}) => {
  return (
    <div className='h-full w-full'>
        <div className='grid h-full gap-2 min-w-36 lg:min-w-48 rounded-md overflow-hidden p-2 border shadow'>
            <div className='h-28 lg:h-36'>
                <img className='w-full h-full object-scale-down' src={product.image[0]} alt={product.name} />
            </div>
            <div className='bg-green-100 w-fit rounded text-sm p-[0.5px] px-1 text-green-600'> 10min</div>
            <div className='text-xs lg:text-sm line-clamp-2'>{product.name}</div>
            <div className='text-xs lg:text-sm'>{product.unit}</div>
            <div className='flex gap-2 items-center justify-between'>
                <div className='w-full text-xs lg:text-sm font-semibold'>
                    {currencyConverter(product.price)}
                </div>
                <div className=''>
                    <AddToCartButton product={product}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductCard