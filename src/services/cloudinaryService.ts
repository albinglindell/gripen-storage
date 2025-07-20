export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadImage = async (
  file: File,
  folder: string = "gripen-storage"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gripen_storage");

    fetch(`https://api.cloudinary.com/v1_1/dpvhydr7l/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/cloudinary/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
  } = {}
): string => {
  if (!url.includes("cloudinary.com")) {
    return url;
  }

  const { width, height, quality = 80, format = "auto" } = options;
  let optimizedUrl = url;

  if (width || height) {
    const transform = `w_${width || "auto"},h_${height || "auto"},c_fill`;
    optimizedUrl = optimizedUrl.replace("/upload/", `/upload/${transform}/`);
  }

  if (quality !== 80) {
    const qualityTransform = `q_${quality}`;
    optimizedUrl = optimizedUrl.replace(
      "/upload/",
      `/upload/${qualityTransform}/`
    );
  }

  if (format !== "auto") {
    const formatTransform = `f_${format}`;
    optimizedUrl = optimizedUrl.replace(
      "/upload/",
      `/upload/${formatTransform}/`
    );
  }

  return optimizedUrl;
};
