"use client";

import { useState } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import FormContainer from "../../../components/auth/FormContainer";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="font-poppins">
      <AuthLayout>
        <FormContainer
          title="Kuzu Zangpo La!"
          subtitle="Log in to continue using Toh Zawa Sho."
        >
          <InputField
            type="text"
            placeholder="Enter Email or Phone no."
            label="Email / Phone No."
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
          />
          <InputField
            type="password"
            placeholder="Enter Password"
            label="Password"
            name="password" // Add the name prop
            value={formData.password}
            onChange={handleChange}
          />
          <Link
            href="/forgot-password"
            className="text-right text-sm text-primary block mb-4 "
          >
            Forgot Password?
          </Link>
          <Button onClick={handleLogin}>Login</Button>
          <p className="text-center text-sm mt-4 text-text ">
            Want to use Toh Zawa Sho?{" "}
            <Link href="/signup" className="text-primary">
              Sign Up
            </Link>
          </p>
        </FormContainer>
      </AuthLayout>
    </div>
  );
}
