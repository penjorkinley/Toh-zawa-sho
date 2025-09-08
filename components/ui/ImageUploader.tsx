"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

interface ImageUploaderProps {
  coverPhoto: File | null;
  logo: File | null;
  existingCoverUrl?: string | null;
  existingLogoUrl?: string | null;
  onCoverPhotoChange: (file: File) => void;
  onLogoChange: (file: File) => void;
  uploading?: boolean;
  businessName?: string;
}

export default function ImageUploader({
  coverPhoto,
  logo,
  existingCoverUrl,
  existingLogoUrl,
  onCoverPhotoChange,
  onLogoChange,
  uploading = false,
  businessName,
}: ImageUploaderProps) {
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Track locally created URLs to clean them up
  const locallyCreatedUrls = useRef({ cover: false, logo: false });

  useEffect(() => {
    // Set existing images as preview URLs
    if (existingCoverUrl && !coverPhoto) {
      setCoverPreviewUrl(existingCoverUrl);
      locallyCreatedUrls.current.cover = false;
    }
    if (existingLogoUrl && !logo) {
      setLogoPreviewUrl(existingLogoUrl);
      locallyCreatedUrls.current.logo = false;
    }
  }, [existingCoverUrl, existingLogoUrl, coverPhoto, logo]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewUrl && locallyCreatedUrls.current.cover) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      if (logoPreviewUrl && locallyCreatedUrls.current.logo) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, []);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Revoke previous URL if it was created locally
      if (coverPreviewUrl && locallyCreatedUrls.current.cover) {
        URL.revokeObjectURL(coverPreviewUrl);
      }

      const imageUrl = URL.createObjectURL(file);
      setCoverPreviewUrl(imageUrl);
      locallyCreatedUrls.current.cover = true;
      onCoverPhotoChange(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 2MB for logo)
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo file size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Revoke previous URL if it was created locally
      if (logoPreviewUrl && locallyCreatedUrls.current.logo) {
        URL.revokeObjectURL(logoPreviewUrl);
      }

      const imageUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(imageUrl);
      locallyCreatedUrls.current.logo = true;
      onLogoChange(file);
    }
  };

  const triggerCoverPhotoInput = () => {
    coverPhotoInputRef.current?.click();
  };

  const triggerLogoInput = () => {
    logoInputRef.current?.click();
  };

  const removeCoverPhoto = () => {
    if (coverPreviewUrl && locallyCreatedUrls.current.cover) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(null);
    locallyCreatedUrls.current.cover = false;
    if (coverPhotoInputRef.current) {
      coverPhotoInputRef.current.value = "";
    }
  };

  const removeLogo = () => {
    if (logoPreviewUrl && locallyCreatedUrls.current.logo) {
      URL.revokeObjectURL(logoPreviewUrl);
    }
    setLogoPreviewUrl(null);
    locallyCreatedUrls.current.logo = false;
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={coverPhotoInputRef}
        onChange={handleCoverPhotoChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cover Photo */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-gray-100 rounded-md md:rounded-lg overflow-hidden shadow-sm group">
        {coverPreviewUrl ? (
          <>
            <Image
              src={coverPreviewUrl}
              alt="Cover photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Cover photo overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={triggerCoverPhotoInput}
                  disabled={uploading}
                  className="bg-white/90 hover:bg-white text-gray-900"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Change
                </Button>
                {(coverPhoto || existingCoverUrl) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={removeCoverPhoto}
                    disabled={uploading}
                    className="bg-white/90 hover:bg-white text-gray-900"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={triggerCoverPhotoInput}
            className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm text-center px-4">
              Click to upload cover photo
              <br />
              <span className="text-xs text-gray-400">(Max 5MB, JPG/PNG)</span>
            </p>
          </div>
        )}

        {/* Upload progress indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-gray-700">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Logo - Centered and Larger */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-full shadow-lg overflow-hidden border-4 border-white group">
        {logoPreviewUrl ? (
          <>
            <Image
              src={logoPreviewUrl}
              alt="Business logo"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
            />
            {/* Logo overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={triggerLogoInput}
                  disabled={uploading}
                  className="p-2 h-auto bg-white/90 hover:bg-white text-gray-900"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={triggerLogoInput}
            className="flex items-center justify-center h-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
        )}
      </div>

      {/* NEW: Business Name Display - Below Logo */}
      {businessName && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
            {businessName}
          </h2>
        </div>
      )}
    </div>
  );
}
