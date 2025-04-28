"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountInfo from "./_components/accountInfo";
import ImageUploader from "@/components/ui/ImageUploader";
import { useState } from "react";
import PasswordCard from "./_components/passwordCard";

export default function ProfilePage() {
  // Add state for form data
  const [formData, setFormData] = useState({
    coverPhoto: null,
    logo: null,
  });

  // Add handleFileChange function
  const handleFileChange = (type: "coverPhoto" | "logo", file: File) => {
    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleCoverPhotoChange = (file: File) => {
    if (file && handleFileChange) {
      handleFileChange("coverPhoto", file);
    }
  };

  const handleLogoChange = (file: File) => {
    if (file && handleFileChange) {
      handleFileChange("logo", file);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 p-4 space-x-2">
      <div className="">
        <div className="md:sticky md:top-8">
          <ImageUploader
            coverPhoto={formData.coverPhoto}
            logo={formData.logo}
            onCoverPhotoChange={handleCoverPhotoChange}
            onLogoChange={handleLogoChange}
          />

          {/* Adding spacing to balance the layout */}
          <div className="mt-24 md:mt-20"></div>
        </div>
      </div>
      <Tabs defaultValue="account" className="relative">
        <TabsList className="grid w-full grid-cols-2 border-2 bg-primary/40 my-auto sticky">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          {/* <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card> */}

          <AccountInfo />
        </TabsContent>
        <TabsContent value="password">
          <PasswordCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
