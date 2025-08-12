'use server';

import { cloudinary } from '@/config/cloudinary';

export const extractPublicId = async (url: string) => {
  const match = url.match(/upload\/\w+\/(.*?).\w+$/);
  if (!match) {
    return null;
  }
  return match[1];
};

export const uploadFile = async (
  file: File,
  options?: {
    folder?: string;
  },
) => {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  return cloudinary.uploader.upload(dataUri, {
    resource_type: 'auto',
    format: 'webp',
    folder: options?.folder || 'baity',
    transformation: {
      fetch_format: 'auto',
      quality: 'auto',
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    },
  });
};

export const deleteFile = async (url: string) => {
  const publicId = await extractPublicId(url);
  if (!publicId) {
    throw new Error('Invalid URL');
  }

  return cloudinary.uploader.destroy(publicId);
};
