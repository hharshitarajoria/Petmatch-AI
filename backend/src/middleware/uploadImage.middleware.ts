import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/httpError';
import { uploadImagesToCloudinary } from '../utils/cloudinary';

// Memory storage: files stay as in-memory Buffers (req.files[i].buffer) rather than
// being written to disk — this is what utils/cloudinary.ts will stream to Cloudinary.
const storage = multer.memoryStorage();

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file
const MAX_FILES = 5; // e.g. pet gallery limit

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(new BadRequestError('Only JPEG, PNG, WEBP, or AVIF image files are allowed'));
    return;
  }
  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES,
  },
});

// Usage in a route: upload.array('images', MAX_FILES)
export const uploadPetImages = upload.array('images', MAX_FILES);

/**
 * Runs after uploadPetImages. Uploads whatever files multer parsed onto req.files
 * to Cloudinary, then merges the resulting secure URLs into req.body.imageUrls —
 * so the create/update Zod schemas validate them as plain strings, same as any
 * other field. If no files were sent, req.body.imageUrls is left untouched
 * (undefined on create -> defaults to [] in the service; absent on update ->
 * existing images are preserved instead of being wiped out).
 */
export async function attachUploadedImageUrls(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  if (files.length === 0) {
    next();
    return;
  }

  const uploaded = await uploadImagesToCloudinary(files.map((file) => file.buffer));
  req.body.imageUrls = uploaded.map((image) => image.url);

  next();
}
