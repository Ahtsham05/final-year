import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const uploadImage = async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('File info:', req.file);

        if (!req.file) {
            return res.status(400).json(
                new apiResponse(400, "No file uploaded")
            );
        }

        const file = req.file.path;
        console.log('File path:', file);

        if (!file) {
            return res.status(404).json(
                new apiResponse(404, "File path not found")
            );
        }

        console.log('Uploading to Cloudinary...');
        const uploadImageData = await uploadOnCloudinary(file);
        
        if (!uploadImageData) {
            return res.status(400).json(
                new apiResponse(400, "File upload failed - Cloudinary error")
            );
        }

        console.log('Upload successful:', uploadImageData.secure_url);
        return res.status(200).json(
            new apiResponse(200, "File uploaded successfully", {
                url: uploadImageData.secure_url,
                public_id: uploadImageData.public_id
            })
        );
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json(
            new apiResponse(500, "Internal Server Error Uploading File", error.message)
        );
    }
}

export {uploadImage}