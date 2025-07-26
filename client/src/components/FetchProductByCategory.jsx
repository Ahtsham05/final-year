import React, { useEffect, useRef, useState } from 'react'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import LoadingProductCard from './LoadingProductCard'
import ProductCard from './ProductCard'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { UrlFormater } from '../utils/UrlFormater'

const FetchProductByCategory = ({dataId,productcheck}) => {
    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingIterate = new Array(10).fill(null)
    const containerRef = useRef()
    
    const fetchProductByCategory = async()=>{
        try {
            const response = await Axios({
                ...summery.getProductByCategory,
                data:{
                    categoryId:dataId
                }
            })
            const {data : responseData} = response

            if(responseData.success){
                setProducts(responseData?.data?.data)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchProductByCategory()
    },[dataId])

    const handleScrollRight = ()=>{
        containerRef.current.scrollLeft +=200
    }
    const handleScrollLeft = ()=>{
        containerRef.current.scrollLeft -=200
    }

  return (
    <section className='relative '>
        {/* <LoadingProductCard/> */}
        <div className='relative flex gap-2 py-2 z-10 container mx-auto w-full overflow-hidden overflow-x-scroll scroll-hidden scroll-smooth' ref={containerRef}>
            {
                loading && loadingIterate.map((_,index)=>(
                    <LoadingProductCard key={index}/>
                ))
            }
            {
                products.map((product)=>(
                    <Link to={`/product/${UrlFormater(product.name)}-${product._id}`} key={product._id} className=''>
                        <ProductCard product={product}/>
                    </Link>
                ))
            }
            
        </div>
        <div className='absolute h-full w-full hidden lg:flex justify-between items-center left-0 right-0 top-0 '>
                <button className=' text-neutral-600 bg-white p-2 shadow-lg rounded-full hover:bg-gray-100 absolute left-3 z-10' onClick={handleScrollLeft}><FaAngleLeft/></button>
                <button className=' text-neutral-600 bg-white p-2 shadow-lg rounded-full hover:bg-gray-100 absolute right-3 z-10' onClick={handleScrollRight}><FaAngleRight/></button>
        </div>
    </section>
  )
}

export default FetchProductByCategory