import { Storage } from "@google-cloud/storage";
import fs from "fs";

const storage = new Storage({
    keyFilename: "credentials.json"
})

const bucketName = process.env.GOOGLE_BUCKET_NAME

const uploadOnGoogleCloud = async (localFilePath, destinationFileName) => {
    try {
        if (!localFilePath) return null;

        const result = await storage.bucket(bucketName).upload(localFilePath, {
            destination: destinationFileName
        })

        fs.unlinkSync(localFilePath)

        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromGoogleCloud = async (fileName) => {
    try {
        const result = await storage.bucket(bucketName).file(fileName).delete()

        return result
    } catch (error) {
        return null;
    }
}

export {uploadOnGoogleCloud, deleteFromGoogleCloud};