"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "super-admin" | "restaurant-owner";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, profile, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push("/login");
        return;
      }

      // No profile
      if (!profile) {
        router.push("/login");
        return;
      }

      // Not approved
      if (profile.status !== "approved") {
        router.push("/login");
        return;
      }

      // First login - redirect to setup
      if (profile.first_login && pathname !== "/information-setup") {
        router.push("/information-setup");
        return;
      }

      // Check role requirements
      if (requiredRole && profile.role !== requiredRole) {
        if (profile.role === "super-admin") {
          router.push("/super-admin-dashboard/dashboard");
        } else if (profile.role === "restaurant-owner") {
          router.push("/owner-dashboard/menu-setup");
        } else {
          router.push("/login");
        }
        return;
      }
    }
  }, [loading, user, profile, router, requiredRole, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Authentication, role and status are valid, render children
  return <>{children}</>;
}
