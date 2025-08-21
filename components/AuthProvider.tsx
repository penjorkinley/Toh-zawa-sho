"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  const supabase = createClientComponentClient();

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
          throw sessionError;
        }

        if (!session) {
          setUser(null);
          setProfile(null);
          return;
        }

        setUser(session.user);

        // Get user profile
        const { data: userProfile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(userProfile as UserProfile);
      } catch (err) {
        console.error("Auth check error:", err);
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session) {
          setUser(session.user);

          try {
            const { data: userProfile, error: profileError } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) throw profileError;

            setProfile(userProfile as UserProfile);
          } catch (err) {
            console.error("Profile fetch error:", err);
          }
        }
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        router.push("/login");
      }
    });

    // Check session on component mount
    checkSession();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.refreshSession();

      if (error) throw error;

      if (data.session) {
        setUser(data.session.user);

        // Refresh profile data too
        const { data: userProfile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(userProfile as UserProfile);
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setError("Failed to refresh session");
    } finally {
      setLoading(false);
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

// Custom hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}
