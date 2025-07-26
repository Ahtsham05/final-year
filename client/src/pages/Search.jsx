import React, { useEffect, useState } from 'react'
import LoadingProductCard from '../components/LoadingProductCard'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import {toast} from 'react-toastify'
import ProductCard from '../components/ProductCard'
import { useLocation, useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component';
const Search = () => {
  const [products,setProducts] = useState([])
  const [loading,setLoading] = useState(true)
  const [page,setPage] = useState(1)
  const [limit,setLimit] = useState(10)
  const [totalCount,setTotalCount] = useState(0)
  const [totalPages,setTotalPages] = useState(0)
  const params = useLocation()
  const sr = params?.search?.slice(3)
  
  const fetchProducts = async ()=>{
    try {
      setLoading(true)
      const response = await Axios({
        ...summery.searchProduct,
        data : {
          search : sr,
          page : page,
          limit : limit
        }
      })
      const {data : responseDate} = response
      if(responseDate.success){
        if(responseDate?.data?.page === 1){
          setProducts(responseDate?.data?.data)
        }else{
          setProducts(prev => {
            return [...prev,...responseDate?.data?.data]
          })
        }
        setTotalCount(responseDate?.data?.totalCount)
        setTotalPages(responseDate?.data?.totalPages)
        setLoading(false)
      }
    } catch (error) {
        toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error(error?.response?.message)
      }
    }
  }

  useEffect(()=>{
    fetchProducts()
  },[params,page])

  return (
    <InfiniteScroll 
    dataLength={products.length}
    next={()=>setPage(prev=>prev+1)}
    hasMore={totalPages > page}
    >
      <section className='min-h-[79vh] container mx-auto'>
        <h1 className='text-gray-700 font-semibold p-2 mt-2'>Search Results : {totalCount}</h1>
        <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2'>
        {
            products[0] && !loading && (
              <>
                {
                  products.map((product,index)=>(
                    <div key={product._id+"SearchProducts"}>
                      <ProductCard product={product}/>
                    </div>
                  ))
                }
              </>
            )
          }
          {
            loading && Array(10).fill(null).map((_,index)=>(
              <LoadingProductCard key={"searchProduct"+index}/>
            ))
          }

        </div>
      </section>
    </InfiniteScroll>
  )
}

export default Search