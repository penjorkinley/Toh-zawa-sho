// lib/utils/menu-images.ts
"use server";

import { uploadMenuItemImage } from "@/lib/actions/menu/actions";

export async function processMenuItemImage(
  imageUrl: string | undefined,
  itemName: string
): Promise<string> {
  // If no image or using default image, return default
  if (!imageUrl || imageUrl === "/default-food-img.png") {
    return "/default-food-img.png";
  }

  try {
    // If it's already a GitHub URL, return as is
    if (imageUrl.startsWith("https://raw.githubusercontent.com/")) {
      return imageUrl;
    }

    // Convert blob URL or other image to File for upload
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `${itemName}-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    // Upload to GitHub
    const result = await uploadMenuItemImage(file);
    if (result.success && result.url) {
      return result.url;
    }

    // If upload fails, use default image
    console.error("Failed to upload image:", result.error);
    return "/default-food-img.png";
  } catch (error) {
    console.error("Error processing menu item image:", error);
    return "/default-food-img.png";
  }
}
