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

        // Check if file exists
        if (!fs.existsSync(localfilepath)) {
            console.log("File does not exist:", localfilepath);
            return null;
        }

        // Upload to cloudinary with await
        const uploaded = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        });

        // Delete the local file after successful upload
        fs.unlink(localfilepath, (err) => {
            if (err) {
                console.log("Error deleting file:", err);
            } else {
                console.log("File deleted successfully:", localfilepath);
            }
        });

        return uploaded;
    } catch (error) {
        console.log("Uploading Failed On Cloudinary", error);
        
        // Try to delete the file if upload failed
        if (fs.existsSync(localfilepath)) {
            fs.unlink(localfilepath, (err) => {
                if (err) console.log("Error deleting file after failed upload:", err);
            });
        }
        
        return null;
    }
}

export { uploadOnCloudinary }