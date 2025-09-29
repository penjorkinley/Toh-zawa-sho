// lib/utils/upload-with-compression.ts
"use client";

import { autoCompressImage } from "./image-compression";

/**
 * Upload image with automatic compression if needed
 * This is a client-side utility that handles compression before calling server actions
 */
export async function uploadImageWithCompression(
  file: File,
  uploadFunction: (
    file: File
  ) => Promise<{ success: boolean; url?: string; error?: string }>
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Auto-compress if needed (will return original if no compression needed)
    const processedFile = await autoCompressImage(file);

    // Call the upload function with the processed file
    return await uploadFunction(processedFile);
  } catch (error) {
    console.error("Error processing image for upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process image",
    };
  }
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please select an image file" };
  }

  // Check file size (before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB max before compression
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image is too large (max 10MB before compression)",
    };
  }

  return { valid: true };
}
