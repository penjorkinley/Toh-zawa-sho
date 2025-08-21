// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define protected routes
  const protectedRoutes = [
    "/information-setup",
    "/owner-dashboard",
    "/super-admin-dashboard",
    "/restaurant",
  ];

  // Define auth routes (shouldn't be accessible when logged in)
  const authRoutes = ["/login", "/signup", "/forgot-password"];

  const path = req.nextUrl.pathname;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // If trying to access protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying to access auth routes, redirect to appropriate dashboard
  if (isAuthRoute && session) {
    // Get user profile to determine redirect
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role, first_login")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      let redirectUrl = "/";

      if (profile.first_login) {
        redirectUrl = "/information-setup";
      } else if (profile.role === "super-admin") {
        redirectUrl = "/super-admin-dashboard/dashboard";
      } else if (profile.role === "restaurant-owner") {
        redirectUrl = "/owner-dashboard/menu-setup";
      }

      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
