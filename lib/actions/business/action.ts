"use server";

import { businessSetupSchema } from "../../validations/business/setup";

export async function setupBusinessAction(prevState: any, formData: FormData) {
  try {
    // Extract basic form data
    const businessName = formData.get("businessName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const businessType = formData.get("businessType") as string;
    const location = formData.get("location") as string;
    const openingDays = formData.getAll("openingDays") as string[];
    const openingTime = formData.get("openingTime") as string;
    const closingTime = formData.get("closingTime") as string;
    const description = formData.get("description") as string;

    // Extract file data
    const logo = formData.get("logo") as File;
    const coverPhoto = formData.get("coverPhoto") as File;

    // Create data object for validation
    const setupData = {
      businessName,
      email,
      phoneNumber,
      businessType,
      location,
      openingDays,
      openingTime,
      closingTime,
      description,
      logo: logo && logo.size > 0 ? logo : null,
      coverPhoto: coverPhoto && coverPhoto.size > 0 ? coverPhoto : null,
    };

    // Validate the data
    const validationResult = businessSetupSchema.safeParse(setupData);

    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      return { success: false, errors: fieldErrors };
    }

    // Here you would:
    // 1. Upload the files to a storage service
    // 2. Save the business data to your database
    // 3. Create any necessary relations

    console.log("Business setup data:", setupData);

    // Return success and redirect to the dashboard
    return {
      success: true,
      redirect: "/dashboard",
      message: "Business setup completed successfully!",
    };
  } catch (error) {
    console.error("Business setup error:", error);
    return {
      success: false,
      errors: {
        _form: ["Failed to complete business setup. Please try again."],
      },
    };
  }
}
