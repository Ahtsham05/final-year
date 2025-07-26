import summery from '../common/summery'
import Axios from './Axios'

const getCurrentUser = async ()=>{
    try {
        const response = await Axios({
            ...summery.getCurrentUser
        })
        return response.data
    } catch (error) {
        // console.error(error)        
    }
}

export default getCurrentUser