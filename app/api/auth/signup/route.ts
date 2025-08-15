// app/api/auth/signup/route.ts
import { signupRestaurantOwner } from "@/lib/auth/helpers";
import {
  generateFileName,
  uploadFileToGitHub,
  validateBusinessLicenseFile,
} from "@/lib/github/storage";
import { signupSchema } from "@/lib/validations/auth/signup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const businessName = formData.get("businessName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const licenseFile = formData.get("licenseFile") as File;

    // Validate form data
    const validationResult = signupSchema.safeParse({
      businessName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      licenseFile,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Validate license file
    if (licenseFile && licenseFile.size > 0) {
      const fileValidation = validateBusinessLicenseFile(licenseFile);
      if (!fileValidation.valid) {
        return NextResponse.json(
          { success: false, error: fileValidation.error },
          { status: 400 }
        );
      }

      // Upload file to GitHub
      const fileName = generateFileName(licenseFile.name, businessName);
      const uploadResult = await uploadFileToGitHub(licenseFile, fileName);

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: "Failed to upload license file" },
          { status: 500 }
        );
      }

      // Create user with license URL
      const signupResult = await signupRestaurantOwner({
        businessName,
        email,
        phoneNumber,
        password,
        businessLicenseUrl: uploadResult.url,
      });

      if (!signupResult.success) {
        return NextResponse.json(
          { success: false, error: signupResult.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "Registration successful! Your request is pending admin approval.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Business license file is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
