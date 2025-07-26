import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return(
    <div className="font-poppins relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-6xl px-6">
        <SignupForm />
      </div>
    </div>
  );
}
