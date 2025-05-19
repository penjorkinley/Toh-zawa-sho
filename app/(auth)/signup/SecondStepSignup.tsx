import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as z from "zod";
import { secondStepSchema } from "@/lib/validations/auth/signup";
import type { SignupFormData } from "@/lib/validations/auth/signup";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

interface SecondStepSignupProps {
  formData: SignupFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleSubmit: () => void;
  direction: number;
  slideVariants: undefined;
  slideTransition: undefined;
}

export default function SecondStepSignup({
  formData,
  handleChange,
  handleBack,
  handleSubmit,
  direction,
  slideVariants,
  slideTransition,
}: SecondStepSignupProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
    handleChange(e);
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Reset the file input - with proper type casting
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((element) => {
      const input = element as HTMLInputElement;
      input.value = "";
    });

    // Update the formData
    const event = {
      target: {
        name: "licenseFile",
        value: null,
        type: "file",
        files: null,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  const validateAndSubmit = async () => {
    try {
      // Validate the file upload
      await secondStepSchema.parseAsync({
        licenseFile: formData.licenseFile,
      });

      await handleSubmit();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || "Invalid file";
        setError(errorMessage);
      } else {
        setError("Failed to submit form. Please try again.");
      }
    }
  };

  // Empty upload state UI
  const EmptyUploadState = ({ inputId }: { inputId: string }) => (
    <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15V3M12 3L7 8M12 3L17 8"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 15V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V15"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-sm text-center">
        Drag and drop files to here to upload.
      </p>
      <input
        type="file"
        id={inputId}
        name="licenseFile"
        onChange={handleFileChange}
        className="hidden"
      />
      <label htmlFor={inputId} className="absolute inset-0 cursor-pointer">
        {/* Transparent clickable area */}
      </label>
    </div>
  );

  // File uploaded state UI
  const FileUploadedState = ({ file }: { file: File }) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66667 13.3333L10 10M10 10L13.3333 13.3333M10 10V17.5M16.6667 13.9524C17.6168 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2184 3.73736 10.2393 2.5 8 2.5C4.77833 2.5 2.16667 5.11167 2.16667 8.33333C2.16667 10.4133 3.22083 12.2475 4.82833 13.3333"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
              {file.name}
            </p>
            <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="text-gray-500 hover:text-red-500 transition-colors p-2"
          aria-label="Remove file"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3333 5.83333L6.66667 12.5M6.66667 5.83333L13.3333 12.5"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  // Mobile view
  const MobileView = () => (
    <div className="w-full min-h-screen bg-white lg:hidden">
      {/* Mobile header with back arrow */}
      <div className="flex items-center border-b border-gray-200 py-3 px-4 relative z-10">
        <button onClick={handleBack} className="mr-4 relative z-20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="font-medium">
          License Registration Copy <span className="text-red-500">*</span>
        </h1>
      </div>

      {/* File upload area */}
      <div className="p-4">
        {selectedFile ? (
          <FileUploadedState file={selectedFile} />
        ) : (
          <EmptyUploadState inputId="mobile-license-file" />
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button onClick={validateAndSubmit} className="w-full py-3 mt-8">
          Submit
        </Button>

        <p className="text-center text-sm mt-4 mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );

  // Desktop view
  const DesktopView = () => (
    <AuthLayout>
      {/* Back button for desktop view - positioned above form */}
      <div className="w-full mb-6">
        <BackButton onClick={handleBack} title="Back to Personal Details" />
      </div>

      <FormContainer
        title="License Registration"
        subtitle="Please upload your business license to complete registration."
      >
        <div className="w-full">
          <div className="mb-6 lg:mb-8">
            <label className="block text-text font-medium mb-2">
              Upload License Registration File
            </label>

            {/* File upload area with conditional rendering based on file selection */}
            {selectedFile ? (
              <FileUploadedState file={selectedFile} />
            ) : (
              <EmptyUploadState inputId="desktop-license-file" />
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <Button
            onClick={validateAndSubmit}
            className="w-full py-3 lg:py-4 text-base font-medium transition-all duration-300 hover:shadow-lg"
          >
            Submit
          </Button>

          <p className="text-center text-sm lg:text-base mt-6 lg:mt-8 mb-4 lg:mb-6 text-text">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline transition-colors duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </FormContainer>
    </AuthLayout>
  );

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="w-full"
    >
      {/* Render different views based on screen size */}
      <div className="lg:hidden">
        <MobileView />
      </div>
      <div className="hidden lg:block">
        <DesktopView />
      </div>
    </motion.div>
  );
}
