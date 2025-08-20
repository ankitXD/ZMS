import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

// Configuration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safeUnlink = (path) => {
    if (!path) return;
    try {
        if (fs.existsSync(path)) fs.unlinkSync(path);
    } catch (_) {
        // intentionally ignore unlink errors (e.g., already deleted)
    }
};

const uploadOnCloudinary = async (filePath) => {
    let response;
    try {
        if (!filePath) throw new Error("No file path provided to upload");
        // Log the file path to ensure it exists
        console.log("Uploading file to Cloudinary:", filePath);

        response = await cloudinary.uploader.upload(filePath, {
            folder: "user_avatars", // You can specify a folder name
        });

        if (!response || !response.url) {
            throw new Error("Cloudinary upload did not return a URL");
        }

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);
        throw new Error("Failed to upload file to Cloudinary");
    } finally {
        // Always attempt to clean up local temp file, but don't throw if missing
        safeUnlink(filePath);
    }
};

export default uploadOnCloudinary;
