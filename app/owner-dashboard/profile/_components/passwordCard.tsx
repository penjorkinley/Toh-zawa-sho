"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/shadcn-button";
import { changePassword } from "@/lib/actions/profile/actions";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordCard() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        toast.success("Password updated successfully!");
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
        });
      } else {
        toast.error(result.error || "Failed to update password");
        if (result.error === "Current password is incorrect") {
          setErrors({ currentPassword: result.error });
        }
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  // Custom Password Input Component
  const PasswordInput = ({
    label,
    name,
    placeholder,
    value,
    error,
    showPassword,
    onToggle,
  }: {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    error?: string;
    showPassword: boolean;
    onToggle: () => void;
  }) => (
    <div className="mb-5">
      <label className="text-text font-normal block mb-2 sm:mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 pr-12 rounded-lg border bg-white
            ${error ? "border-red-500" : "border-text/40"}
            focus:outline-none focus:border-primary text-text font-normal`}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onToggle}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-primary border-2 p-6 rounded-lg"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Password</h3>
        <p className="text-sm text-gray-600">
          Change your password here. Make sure it's at least 8 characters long.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          placeholder="Enter current password"
          value={formData.currentPassword}
          error={errors.currentPassword}
          showPassword={showPasswords.current}
          onToggle={() => togglePasswordVisibility("current")}
        />

        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          error={errors.newPassword}
          showPassword={showPasswords.new}
          onToggle={() => togglePasswordVisibility("new")}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          showPassword={showPasswords.confirm}
          onToggle={() => togglePasswordVisibility("confirm")}
        />

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Password"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
