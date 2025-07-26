import FormContainer from "@/components/auth/FormContainer";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import ClientBackButton from "@/components/ui/ClientBackButton";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="font-poppins relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-6xl px-6">
        <ClientBackButton />

        <div className="flex flex-col items-center justify-center gap-12 lg:gap-20 pt-16 lg:pt-0">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/reset-password-img.svg"
              alt="Reset Password"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full max-w-md"
              priority
            />
          </div>

          <FormContainer
            title="Reset Password"
            subtitle="Please enter your new password below."
          >
            <ResetPasswordForm />
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
