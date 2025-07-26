import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const uploadImage = async (req,res)=>{
    try {
        const file = req.file.path
        if(!file) return res.status(404).json(
            new apiResponse(404,"File not found")
        )
        const uploadImageData = await uploadOnCloudinary(file)
        if(!uploadImageData) return res.status(400).json(
            new apiResponse(400,"File upload failed")
        )

        // console.log(uploadImageData)
        return res.status(200).json(
            new apiResponse(200,"File uploaded successfully",uploadImageData)
        )
    } catch (error) {
        return new apiResponse(500,"Internal Server Error Uploading File",error)
    }
}

export {uploadImage}