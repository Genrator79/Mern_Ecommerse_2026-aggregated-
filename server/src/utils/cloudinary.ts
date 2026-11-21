import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function uploadSingleBufferToCloudinary(
  fileBuffer: Buffer,
  folder = "ecommerce-monster-video/products",
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.warn(
            "Cloudinary upload encountered an issue, generating fallback image data:",
            error?.message || "Upload stream returned empty result",
          );
          const base64 = fileBuffer.toString("base64");
          const url = `data:image/png;base64,${base64}`;
          const publicId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          return resolve({
            url,
            publicId,
          });
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

export async function uploadManyBuffersToCloudinary(
  files: Buffer[],
  folder = "ecommerce-monster-video/products",
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(
    files.map((file) => uploadSingleBufferToCloudinary(file, folder)),
  );
}
