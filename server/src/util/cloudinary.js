import {v2 as Cloudinary} from 'cloudinary';
import fs from 'fs';

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const result = await Cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'});    

        fs.unlinkSync(localFilePath);

        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFileFromCloudinary = async (publicId, resourceType) => {
    try {
        if(!publicId) return null;

        const result = await Cloudinary.uploader.destroy(publicId, {resource_type: resourceType});

        return result;
    } catch (error) {
        console.log(error);
        
        return null;
    }
}

export {uploadOnCloudinary, deleteFileFromCloudinary};