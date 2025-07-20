import { getOptimizedImageUrl } from "../services/cloudinaryService";

export const getThumbnailUrl = (
  imageUrl: string,
  size: number = 200
): string => {
  return getOptimizedImageUrl(imageUrl, {
    width: size,
    height: size,
    quality: 80,
    format: "auto",
  });
};

export const getPreviewUrl = (
  imageUrl: string,
  width: number = 400,
  height: number = 300
): string => {
  return getOptimizedImageUrl(imageUrl, {
    width,
    height,
    quality: 85,
    format: "auto",
  });
};

export const getFullSizeUrl = (
  imageUrl: string,
  quality: number = 90
): string => {
  return getOptimizedImageUrl(imageUrl, {
    quality,
    format: "auto",
  });
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
