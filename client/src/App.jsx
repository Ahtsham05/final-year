import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from './store/userSlice.js';
import getCurrentUser from './utils/getUser.js'
import { useEffect } from 'react';
import Axios from './utils/Axios.js';
import summery from './common/summery.js';
import { setCategories,setLoadingState,setSubCategories } from './store/productSlice.js';
import { GlobalProvider } from './provider/GlobalProvider.jsx'
import MobileCartButton from './components/MobileCartButton.jsx';

function App() {
  const dispatch = useDispatch()

  const getUser = async()=>{
    const currentUser = await getCurrentUser()
    if(currentUser){
      dispatch(setUserDetails(currentUser.data))
    }
  }

  const getCategoriesAndSetStore = async ()=>{
    try {
      const response = await Axios({
        ...summery.getCategories,
        method: 'get'
      })
      
      const {data : responseDate} = response
      if(responseDate.success){
        dispatch(setCategories(responseDate?.data))
      }
    } catch (error) {
      console.error(error)
    } finally {
     dispatch(setLoadingState(false))
    }
  } 

  const getSubCategoriesAndSetStore = async ()=>{
    try {
      const response = await Axios({
        ...summery.getSubCategory,
      })
      const { data : responseData } = response
      if(responseData?.success){
        dispatch(setSubCategories(responseData.data))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      if(error?.response?.status === 500){
        toast.error(error?.response?.data)
      }
    }
  }

  useEffect(()=>{
    getUser()
    getCategoriesAndSetStore()
    getSubCategoriesAndSetStore()
  },[])
  return (
  <GlobalProvider>
    <Header/>
    <main className='min-h-[calc(100vh-180px)] container mx-auto px-4 lg:px-0'>
      <Outlet/>
    </main>
    <Footer/>
    <MobileCartButton/>
    <ToastContainer/>
  </GlobalProvider>
  )
}

export default App
