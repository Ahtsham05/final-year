import axios from 'axios'
import summery from '../common/summery'

const baseUrl = import.meta.env.VITE_BACKEND_URL

const Axios = axios.create({
    baseURL : baseUrl,
    withCredentials: true,
    // timeout:30000
})

const getAccessToken = ()=> localStorage.getItem("accessToken")
const getRefreshToken = ()=> localStorage.getItem("refreshToken")

// save Tokens in localStorage
const saveTokens = (accessToken,refreshToken)=>{
    localStorage.setItem("accessToken",accessToken);
    localStorage.setItem("refreshToken",refreshToken);
}

// remove tokens
const removeTokens = ()=>{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

// refresh tokens
const refreshTokens =async ()=>{
    try {
        const refreshtoken = getRefreshToken()
        if(!refreshtoken){
            throw new Error("No refresh token available")
        }
        const response = await Axios({
            ...summery.relogin,
            headers:{
                Authorization: `Bearer ${refreshtoken}`
            }
        })

        const {accessToken,refreshToken} = response.data.data;
        saveTokens(accessToken,refreshToken);
        return accessToken
    } catch (error) {
        console.error("error refreshing tokens",error)
        removeTokens()
        throw error;
    }
}

Axios.interceptors.request.use(
    (config)=>{
        const accessToken = getAccessToken()
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=> Promise.reject(error)
)

Axios.interceptors.request.use(
    response => response,
    async (error)=>{
        const originRequest = error.config

        if(error.response?.status === 401 && !originRequest._retry){
            originRequest._retry = true
            try {
                const newAccessToken = await refreshTokens()
                originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return Axios(originRequest)
            } catch (refreshError) {
                console.error("Session Expired. ")
                navigate("/login")
                Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
export default Axios;