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
import { getSidebarData } from "@/lib/actions/user/actions"; // NEW: Import getSidebarData
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

  const [businessName, setBusinessName] = useState<string>(""); // NEW: State for business name
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load existing profile images and business name
  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);

        // Fetch profile images
        const profileResult = await getProfileData();
        if (profileResult.success && profileResult.data) {
          setExistingImages({
            coverPhotoUrl: profileResult.data.cover_photo_url,
            logoUrl: profileResult.data.logo_url,
          });
        }

        // NEW: Fetch business name from sidebar data
        const sidebarResult = await getSidebarData();
        if (sidebarResult.success && sidebarResult.data) {
          setBusinessName(sidebarResult.data.businessName);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
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
          <div className="p-4 pb-24">
            {" "}
            {/* NEW: Added extra bottom padding for business name */}
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
                businessName={businessName}
              />
            )}
          </div>

          {/* Tabs for Mobile */}
          <Tabs defaultValue="account" className="w-full px-4 mt-1">
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
            <div className="pb-24">
              {" "}
              {/* NEW: Added extra bottom padding for business name */}
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
                  businessName={businessName} // NEW: Pass business name
                />
              )}
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary/80">
                <TabsTrigger value="account">Account Info</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
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
