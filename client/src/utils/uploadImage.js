import summery from "../common/summery.js"
import Axios from "./Axios.js"

const uploadImage = async (image)=>{
    try {
        const formData = new FormData();
        formData.append('image',image)

        const response = await Axios({
            ...summery.uploadImage,
            data: formData
        })
        return response
    } catch (error) {
        return error
    }
}

export default uploadImage