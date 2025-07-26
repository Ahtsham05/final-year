import { useEffect, useState } from "react"

const useMobile = (breakPoint = 1024)=>{
    const [isMobile,setIsMobile] = useState(false)

    const handleResize = () => {
        setIsMobile(window.innerWidth <= breakPoint)
    }

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    },[])

    return [isMobile]

}
export default useMobile