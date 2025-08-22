"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Define types
interface UserProfile {
  id: string;
  business_name: string;
  role: "super-admin" | "restaurant-owner";
  status: "pending" | "approved" | "rejected";
  first_login: boolean;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshSession: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseClient();

  // Initial session and profile check
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Failed to get session");
          return;
        }

        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setError(null);
          return;
        }

        setUser(session.user);

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          setError("Failed to get user profile");
          return;
        }

        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error("Auth check error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profileError) {
          setProfile(profileData);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Clean server-side logout
  const signOut = async () => {
    try {
      // Call server-side logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error("Server logout failed");
      }

      // Clear local state
      setUser(null);
      setProfile(null);
      setError(null);

      // The server has already cleared cookies, now redirect
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);

      // Even if server logout fails, clear local state and redirect
      setUser(null);
      setProfile(null);
      router.push("/login");

      throw err; // Re-throw so UI can handle error
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (data.session) {
        setUser(data.session.user);
      }
    } catch (err) {
      console.error("Refresh session error:", err);
      setError("Failed to refresh session");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
