import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import FormContainer from "@/components/auth/FormContainer";
import ClientBackButton from "@/components/ui/ClientBackButton";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="font-poppins relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-6xl px-6">
        <ClientBackButton />

        <div className="flex flex-col items-center justify-center gap-12 lg:gap-20 pt-16 lg:pt-0">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/forgot-password-img.svg"
              alt="Forgot Password"
              width={400}
              height={400}
              className="object-contain w-72 sm:w-80 md:w-96 lg:w-full max-w-md"
              priority
            />
          </div>

          <FormContainer
            title="Forgot Password?"
            subtitle="Don't worry! It happens. Please enter the email address linked with your account."
          >
            <ForgotPasswordForm />
            <p className="text-center text-sm text-text mt-6 lg:mt-8">
              Remember your password?{" "}
              <Link href="/login" className="text-primary">
                Log In
              </Link>
            </p>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}
