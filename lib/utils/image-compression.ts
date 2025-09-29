// lib/utils/image-compression.ts
"use client";

interface CompressionOptions {
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "webp" | "png";
}

/**
 * Compresses an image file to reduce its size while maintaining good quality
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeKB = 900, // Target size under 900KB to stay well below 1MB limit
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    format = "jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress the image
        ctx!.drawImage(img, 0, 0, width, height);

        // Start with the specified quality
        let currentQuality = quality;
        let attempts = 0;
        const maxAttempts = 10;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              const compressedSizeKB = blob.size / 1024;

              // If size is acceptable or we've tried too many times, use current result
              if (compressedSizeKB <= maxSizeKB || attempts >= maxAttempts) {
                const compressedFile = new File(
                  [blob],
                  getCompressedFileName(file.name, format),
                  {
                    type: `image/${format}`,
                    lastModified: Date.now(),
                  }
                );

                console.log(
                  `Image compressed: ${(file.size / 1024).toFixed(
                    1
                  )}KB → ${compressedSizeKB.toFixed(1)}KB`
                );
                resolve(compressedFile);
                return;
              }

              // If still too large, reduce quality and try again
              attempts++;
              currentQuality = Math.max(0.1, currentQuality - 0.1);

              // If quality is getting too low, also reduce dimensions
              if (currentQuality <= 0.3) {
                width = Math.floor(width * 0.9);
                height = Math.floor(height * 0.9);
                canvas.width = width;
                canvas.height = height;
                ctx!.clearRect(0, 0, width, height);
                ctx!.drawImage(img, 0, 0, width, height);
              }

              tryCompress();
            },
            `image/${format}`,
            currentQuality
          );
        };

        tryCompress();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  // Calculate scaling factor
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scalingFactor = Math.min(widthRatio, heightRatio, 1);

  width = Math.floor(width * scalingFactor);
  height = Math.floor(height * scalingFactor);

  return { width, height };
}

/**
 * Generate a compressed file name
 */
function getCompressedFileName(originalName: string, format: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExt}_compressed.${format}`;
}

/**
 * Check if a file needs compression based on size
 */
export function needsCompression(file: File, maxSizeKB: number = 900): boolean {
  return file.size / 1024 > maxSizeKB;
}

/**
 * Automatically compress image if it's too large, otherwise return original
 */
export async function autoCompressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // Check if file needs compression
  if (!needsCompression(file, options.maxSizeKB)) {
    console.log(
      `Image size OK: ${(file.size / 1024).toFixed(1)}KB, no compression needed`
    );
    return file;
  }

  // Only compress if it's an image
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  return compressImage(file, options);
}
