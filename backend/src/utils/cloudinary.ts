import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary';

const PET_IMAGE_FOLDER = 'petmatch-ai/pets';

export interface UploadedImage {
  url: string;
  publicId: string;
}

function streamUpload(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: PET_IMAGE_FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed with no result'));
          return;
        }
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadImageToCloudinary(buffer: Buffer): Promise<UploadedImage> {
  const result = await streamUpload(buffer);
  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadImagesToCloudinary(buffers: Buffer[]): Promise<UploadedImage[]> {
  return Promise.all(buffers.map((buffer) => uploadImageToCloudinary(buffer)));
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
