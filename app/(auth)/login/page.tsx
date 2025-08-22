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
          setError("No account found with this phone number");
          setLoading(false);
          return;
        }

        // For phone login, we'd need to get the email from a server-side admin call
        // For now, ask users to use email
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
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
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
        setError("Failed to fetch user profile");
        setLoading(false);
        return;
      }

      // Check if user is approved
      if (profile.status !== "approved") {
        await supabase.auth.signOut();
        setError("Your account is still pending approval");
        setLoading(false);
        return;
      }

      // Determine redirect based on role and first login
      let redirectUrl = "/";

      if (profile.first_login) {
        redirectUrl = "/information-setup";
      } else if (profile.role === "super-admin") {
        redirectUrl = "/super-admin-dashboard/dashboard";
      } else if (profile.role === "restaurant-owner") {
        redirectUrl = "/owner-dashboard/menu-setup";
      }

      // Use router.push for client-side navigation
      router.push(redirectUrl);
    } catch (err) {
      console.error("Login error:", err);
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
            {loading ? "Logging in..." : "Login"}
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
