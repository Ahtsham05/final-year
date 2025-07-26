import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
});

cloudinary.config({ 
    cloud_name: String(process.env.CLOUDINARY_NAME), 
    api_key: String(process.env.CLOUDINARY_API), 
    api_secret: String(process.env.CLOUDINARY_SECRET) // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async function(localfilepath){
    try {

        if(!localfilepath) return null;

        const uploaded = cloudinary.uploader.upload(localfilepath,{
            resource_type:'auto'
        });

        // fs.unlink(localfilepath,()=>{
        //     console.log("File deleted successfully");  // Delete the local file after uploading to Cloudinary
        // }) 

        return uploaded;
    } catch (error) {
        fs.unlink(localfilepath)
        console.log("Uploading Failed On Cloudinary",error)
    }
}

export { uploadOnCloudinary }