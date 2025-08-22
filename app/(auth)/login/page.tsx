// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/shadcn-button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToast = toast.loading("Signing you in...");

    try {
      // Determine if input is email or phone
      const isEmail = formData.emailOrPhone.includes("@");
      let email = formData.emailOrPhone;

      // If it's a phone number, we need to find the associated email
      if (!isEmail) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("phone_number", formData.emailOrPhone)
          .single();

        if (!profile) {
          toast.dismiss(loadingToast);
          toast.error("No account found with this phone number");
          setError("No account found with this phone number");
          setLoading(false);
          return;
        }

        // For phone login, we'd need to get the email from a server-side admin call
        // For now, ask users to use email
        toast.dismiss(loadingToast);
        toast.error("Please login with your email address");
        setError("Please login with your email address");
        setLoading(false);
        return;
      }

      // Sign in with Supabase Auth (client-side)
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password: formData.password,
        }
      );

      if (authError) {
        toast.dismiss(loadingToast);
        toast.error(authError.message || "Invalid credentials");
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        toast.dismiss(loadingToast);
        toast.error("Login failed. Please try again.");
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Get user profile to check status and determine redirect
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast.dismiss(loadingToast);
        toast.error("Failed to fetch user profile");
        setError("Failed to fetch user profile");
        setLoading(false);
        return;
      }

      // Check if user is approved
      if (profile.status !== "approved") {
        await supabase.auth.signOut();
        toast.dismiss(loadingToast);
        toast.error("Your account is still pending approval");
        setError("Your account is still pending approval");
        setLoading(false);
        return;
      }

      // Success! Show success toast
      toast.dismiss(loadingToast);
      toast.success("Welcome back! Redirecting...");

      // Determine redirect based on role and first login
      let redirectUrl = "/";

      if (profile.first_login) {
        redirectUrl = "/information-setup";
      } else if (profile.role === "super-admin") {
        redirectUrl = "/super-admin-dashboard/dashboard";
      } else if (profile.role === "restaurant-owner") {
        redirectUrl = "/owner-dashboard/menu-setup";
      }

      // Small delay to show success message, then redirect
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred. Please try again.");
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormContainer
        title="Login to Your Account"
        subtitle="Welcome back! Please enter your details"
      >
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Email or Phone Number"
            label="Email or Phone Number"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            error={
              error && formData.emailOrPhone === ""
                ? "This field is required"
                : undefined
            }
          />

          <InputField
            type="password"
            placeholder="Enter Password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={
              error && formData.password === ""
                ? "This field is required"
                : undefined
            }
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <Link
            href="/forgot-password"
            className="block text-right text-primary mb-4 text-sm hover:underline"
          >
            Forgot password?
          </Link>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </FormContainer>
    </AuthLayout>
  );
}
