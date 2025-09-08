"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "./_components/accountInfo";
import ImageUploader from "@/components/ui/ImageUploader";
import { useState, useEffect } from "react";
import PasswordCard from "./_components/passwordCard";
import {
  getProfileData,
  updateProfileData,
} from "@/lib/actions/profile/actions";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    coverPhoto: null as File | null,
    logo: null as File | null,
  });

  const [existingImages, setExistingImages] = useState({
    coverPhotoUrl: null as string | null,
    logoUrl: null as string | null,
  });

  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load existing profile images
  useEffect(() => {
    async function loadProfileImages() {
      try {
        setLoading(true);
        const result = await getProfileData();

        if (result.success && result.data) {
          setExistingImages({
            coverPhotoUrl: result.data.cover_photo_url,
            logoUrl: result.data.logo_url,
          });
        }
      } catch (error) {
        console.error("Error loading profile images:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileImages();
  }, []);

  const handleCoverPhotoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      coverPhoto: file,
    }));
  };

  const handleLogoChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));
  };

  const handleImageUpload = async () => {
    if (!formData.coverPhoto && !formData.logo) {
      return;
    }

    try {
      setUploadingImages(true);

      const updateData = {
        coverPhoto: formData.coverPhoto,
        logo: formData.logo,
      };

      const result = await updateProfileData(updateData);

      if (result.success) {
        toast.success("Images updated successfully!");

        // Reload images to get updated URLs
        const refreshResult = await getProfileData();
        if (refreshResult.success && refreshResult.data) {
          setExistingImages({
            coverPhotoUrl: refreshResult.data.cover_photo_url,
            logoUrl: refreshResult.data.logo_url,
          });
        }

        // Clear form data
        setFormData({
          coverPhoto: null,
          logo: null,
        });
      } else {
        toast.error(result.error || "Failed to update images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setUploadingImages(false);
    }
  };

  // Auto-upload when files are selected
  useEffect(() => {
    if (formData.coverPhoto || formData.logo) {
      handleImageUpload();
    }
  }, [formData.coverPhoto, formData.logo]);

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white">
          {/* Image Uploader for Mobile */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ImageUploader
                coverPhoto={formData.coverPhoto}
                logo={formData.logo}
                existingCoverUrl={existingImages.coverPhotoUrl}
                existingLogoUrl={existingImages.logoUrl}
                onCoverPhotoChange={handleCoverPhotoChange}
                onLogoChange={handleLogoChange}
                uploading={uploadingImages}
              />
            )}
          </div>

          {/* Tabs for Mobile */}
          <Tabs defaultValue="account" className="w-full px-4 mt-8">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-primary/80">
              <TabsTrigger value="account">Account Info</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <div className="pb-4">
              <TabsContent value="account" className="mt-0">
                <AccountInfo />
              </TabsContent>
              <TabsContent value="password" className="mt-0">
                <PasswordCard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto">
          {/* Left Column - Image Uploader */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ImageUploader
                coverPhoto={formData.coverPhoto}
                logo={formData.logo}
                existingCoverUrl={existingImages.coverPhotoUrl}
                existingLogoUrl={existingImages.logoUrl}
                onCoverPhotoChange={handleCoverPhotoChange}
                onLogoChange={handleLogoChange}
                uploading={uploadingImages}
              />
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-primary/80 mb-6">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-white"
                >
                  Account Info
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-white"
                >
                  Change Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-0">
                <AccountInfo />
              </TabsContent>
              <TabsContent value="password" className="mt-0">
                <PasswordCard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
