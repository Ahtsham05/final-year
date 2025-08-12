import React, { useEffect, useRef, useState } from 'react'
import desktopBanner from '../assets/banner-image1.png'
import mobileBanner from '../assets/banner-image.png'
import { useDispatch, useSelector } from 'react-redux'
import { UrlFormater } from '../utils/UrlFormater'
import { useNavigate } from 'react-router-dom'
import { setLoadingState } from '../store/productSlice'
import LoadingCategoriesCard from '../components/LoadingCategoriesCard'
import FetchProductByCategory from '../components/FetchProductByCategory'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import Axios from '../utils/Axios'
import summery from '../common/summery'

const Home = () => {
  const navigate = useNavigate()
  const allStoreCatgeories = useSelector(state => state.product.allCategories)
  const allStoreSubCategory = useSelector(state => state.product.allSubCategories)
  const loading = useSelector(state => state.product.loadingState)
  
  // State to store categories that have products
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([])
  const [checkingProducts, setCheckingProducts] = useState(true)

  // Check which categories have products
  const checkCategoriesWithProducts = async () => {
    if (!allStoreCatgeories || allStoreCatgeories.length === 0) return;
    
    setCheckingProducts(true)
    const categoriesWithProductsData = []
    
    try {
      // Check each category for products
      for (const category of allStoreCatgeories) {
        try {
          const response = await Axios({
            ...summery.getProductByCategory,
            data: {
              categoryId: category._id
            }
          })
          
          const { data: responseData } = response
          
          // If category has products, add it to the list
          if (responseData.success && responseData?.data?.data && responseData.data.data.length > 0) {
            categoriesWithProductsData.push(category)
          }
        } catch (error) {
          console.error(`Error checking products for category ${category.name}:`, error)
        }
      }
      
      setCategoriesWithProducts(categoriesWithProductsData)
    } catch (error) {
      console.error('Error checking categories with products:', error)
    } finally {
      setCheckingProducts(false)
    }
  }

  useEffect(() => {
    if (allStoreCatgeories && allStoreCatgeories.length > 0) {
      checkCategoriesWithProducts()
    }
  }, [allStoreCatgeories])

  // redirect to category page
  const redirectToSubCategoryPage = (categoryId,name)=>{
    const filterSubCategory = allStoreSubCategory.filter(c => {
      return c.category.some(el => el._id === categoryId)
    })[0];
    const url = `/${UrlFormater(name)}-${categoryId}/${UrlFormater(filterSubCategory.name)}-${filterSubCategory._id}`
    navigate(url || "")
  }
  return (
    <section className='py-2'>
      <div className='container mx-auto'>
        {/* Product Banner */}
        <div className={`w-full h-48 rounded-xl bg-blue-50 ${!desktopBanner || !mobileBanner ? "animate-pulse":""}`}>
            <img src={desktopBanner} alt="Banner image" className='w-full h-full hidden md:block' />
            <img src={mobileBanner} alt="Banner image" className='w-full h-full block md:hidden' />
        </div>
        {/* Product Categories */}
        <div className='grid grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-1 md:gap-2 rounded p-2'>
          {
            (loading || checkingProducts) ? (
                <>
                  {
                  Array(20).fill(null).map((_,i)=>(
                    <LoadingCategoriesCard key={i} />
                  ))
                }
                </>
            ) :
            allStoreCatgeories.map((category,index)=>(
              <div onClick={()=>redirectToSubCategoryPage(category._id,category.name)} key={category._id+"categoryId"} className='h-12 md:h-40 rounded overflow-hidden shadow-md border cursor-pointer'>
                <img src={category.image} alt={category.name} className='h-full w-full object-scale-down scale-110 md:scale-100'/>
              </div>
            ))
          }
          {
            !loading && !checkingProducts && allStoreCatgeories.length === 0 && (
              <div className='col-span-full text-center py-8 text-gray-500'>
                No categories with products available
              </div>
            )
          }
        </div>
        {/* get Product Category wise */}
        <div className='grid gap-2'>
          {
            categoriesWithProducts.map((category,index)=>(
              <div key={category._id+"categorywiseProduct"} className='overflow-hidden'>
                <div className='flex justify-between p-2'>
                  <h1 className='font-semibold text-md md:text-lg'>{category.name}</h1>
                  <div onClick={()=>redirectToSubCategoryPage(category._id,category.name)} className='text-green-600 hover:text-green-500 cursor-pointer'>See All</div>
                </div>
                {/* Category Wise Product fetch */}
                <div className='px-2'>
                  <FetchProductByCategory dataId={category._id}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default Home