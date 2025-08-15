// lib/github/storage.ts

interface GitHubFileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFileToGitHub(
  file: File,
  fileName: string,
  folder: string = "business-licenses"
): Promise<GitHubFileUploadResult> {
  try {
    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Content = Buffer.from(buffer).toString("base64");

    const path = `${folder}/${fileName}`;

    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${fileName}`,
          content: base64Content,
          branch: process.env.GITHUB_BRANCH || "main",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload file");
    }

    const data = await response.json();

    // Return the raw GitHub URL
    return {
      success: true,
      url: data.content.download_url,
    };
  } catch (error) {
    console.error("GitHub upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Generate unique filename
export function generateFileName(
  originalName: string,
  businessName: string
): string {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, "_");
  return `${cleanBusinessName}_${timestamp}.${extension}`;
}

// Validate file type and size
export function validateBusinessLicenseFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a PDF, JPG, or PNG file",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    };
  }

  return { valid: true };
}
