import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  coverPhoto: File | null;
  logo: File | null;
  onCoverPhotoChange: (file: File) => void;
  onLogoChange: (file: File) => void;
  coverPhotoPreview?: string | null;
  logoPreview?: string | null;
}

export default function ImageUploader({
  coverPhoto,
  logo,
  onCoverPhotoChange,
  onLogoChange,
  coverPhotoPreview = null,
  logoPreview = null,
}: ImageUploaderProps) {
  // Track if URLs were created locally to manage cleanup correctly
  const locallyCreatedUrls = useRef<{
    cover: boolean;
    logo: boolean;
  }>({
    cover: false,
    logo: false,
  });

  // Memoize the preview URLs to prevent unnecessary recreations
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    coverPhotoPreview
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    logoPreview
  );

  // Generate URLs only when needed (file exists but URL doesn't)
  useEffect(() => {
    // Handle cover photo URL
    if (coverPhoto && !coverPreviewUrl) {
      const imageUrl = URL.createObjectURL(coverPhoto);
      setCoverPreviewUrl(imageUrl);
      locallyCreatedUrls.current.cover = true;
    }

    // Handle logo URL
    if (logo && !logoPreviewUrl) {
      const imageUrl = URL.createObjectURL(logo);
      setLogoPreviewUrl(imageUrl);
      locallyCreatedUrls.current.logo = true;
    }

    // Cleanup function
    return () => {
      // Only revoke URLs we created locally (not ones passed as props)
      if (coverPreviewUrl && locallyCreatedUrls.current.cover) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      if (logoPreviewUrl && locallyCreatedUrls.current.logo) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [coverPhoto, logo, coverPreviewUrl, logoPreviewUrl]);

  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

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

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-gray-100 rounded-md md:rounded-lg overflow-hidden shadow-sm">
        {coverPreviewUrl ? (
          <Image
            src={coverPreviewUrl}
            alt="Cover Photo"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <button
              type="button"
              onClick={triggerCoverPhotoInput}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-image-plus"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" x2="22" y1="5" y2="5" />
                <line x1="19" x2="19" y1="2" y2="8" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Add cover photo
            </button>
          </div>
        )}
        <input
          ref={coverPhotoInputRef}
          type="file"
          name="coverPhoto"
          accept="image/*"
          className="hidden"
          onChange={handleCoverPhotoChange}
        />
        {coverPreviewUrl && (
          <button
            type="button"
            onClick={triggerCoverPhotoInput}
            className="absolute top-2 right-2 bg-white p-1 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pencil"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        )}
      </div>

      {/* Logo - Overlapping the cover photo */}
      <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 transform -translate-x-1/2">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-md">
          {logoPreviewUrl ? (
            <Image
              src={logoPreviewUrl}
              alt="Logo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-package sm:w-7 sm:h-7 md:w-8 md:h-8"
              >
                <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="m3.29 7 8.5 4.5L21 8M12 22V12" />
              </svg>
              <span className="text-gray-400 text-sm mt-1">Logo</span>
            </div>
          )}
          <input
            ref={logoInputRef}
            type="file"
            name="logo"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />

          {/* Enhanced Edit Button for Logo - Hover Overlay Only */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full">
            <button
              type="button"
              onClick={triggerLogoInput}
              className="bg-primary text-white px-3 py-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
