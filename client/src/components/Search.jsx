import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { useNavigate,useLocation, Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import useMobile from '../hooks/useMobile';
import { FaArrowLeft } from "react-icons/fa6";

const Search = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const [isSearchPage,setIsSearchPage] =useState(false)
    const [search , setSearch] = useState("")
    const [isMobile] = useMobile()
    
    useEffect(()=>{
        const page = location.pathname === "/search"
        setIsSearchPage(page)
        setSearch(location.search.slice(3).replaceAll("%20"," "))
    },[location])

    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const searchChangeHandler = (e)=>{
        const value = e.target.value
        setSearch(value)
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='h-11 lg:12 min-w-[300px] lg:min-w-[420px] rounded-lg flex items-center text-neutral-500 border bg-slate-50 group focus-within:border-primary100 p-1'>
        <div className='px-1 mr-1 h-full flex items-center text-xl group-focus-within:text-primary100'>
            {
                // isMobile && isSearchPage
                 isSearchPage ? (<button onClick={()=> navigate("/")} className='bg-white rounded-full p-2 shadow-lg'><FaArrowLeft/></button>):(<Link to={"/search"}><FiSearch/></Link>)
            }
        </div>
        <div className='h-full w-full'>
            {
                isSearchPage ? (
                    <input 
                        type="text" 
                        autoFocus 
                        className='h-full w-full outline-none bg-blue-50' 
                        placeholder='Search For atta , dal and more' 
                        onChange={searchChangeHandler}
                        value={search}
                    />
                ): (
                    <button className='h-full w-full text-left' onClick={redirectToSearchPage}>
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Search "milk"',
                                1000, // wait 1s before replacing "Mice" with "Hamsters"
                                'Search "bread"',
                                1000,
                                'Search "sugar"',
                                1000,
                                'Search "panner"',
                                1000,
                                'Search "chocolate"',
                                1000,
                                'Search "curd"',
                                1000,
                                'Search "rice"',
                                1000,
                                'Search "egg"',
                                1000,
                                'Search "chips"',
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </button>
                )
            }
        </div>
    </div>
  )
}

export default Search