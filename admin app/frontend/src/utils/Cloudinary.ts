import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param localFilePath - The path to the local file to upload
 * @returns Promise resolving to UploadApiResponse or null if upload fails
 */
const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      // Explicitly setting these 3 because the cloudinary.config() is not working properly
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY, // Explicitly set api_key
      api_secret: process.env.CLOUDINARY_API_SECRET,
      resource_type: "auto",
    });

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the uploading failed
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL
 * @param url - The Cloudinary URL to extract the public ID from
 * @returns The extracted public ID or null if not found
 */
const extractPublicIdFromUrl = (url: string): string | null => {
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1]; // This is the public ID
  } else {
    console.error("Public ID not found in the URL");
    return null;
  }
};

/**
 * Deletes an image from Cloudinary using its URL
 * @param url - The Cloudinary URL of the image to delete
 * @returns Promise that resolves when deletion is complete
 */
const deleteImagefromCloudinary = async (url: string): Promise<void> => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.log("Error deleting image:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export { uploadOnCloudinary, deleteImagefromCloudinary };
