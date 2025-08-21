// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

// Routes that require super-admin role
const superAdminRoutes = ["/super-admin-dashboard", "/api/admin"];

// Routes that require restaurant-owner role
const restaurantOwnerRoutes = [
  "/owner-dashboard",
  "/restaurant-dashboard",
  "/api/restaurant",
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Check if it's a public route - if so, allow access
  if (
    publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  ) {
    return response;
  }

  // Refresh session if available
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and trying to access protected route, redirect to login
  if (!session) {
    // Allow api routes to return their own unauthorized responses
    if (path.startsWith("/api/")) {
      return response;
    }

    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Get user profile for role-based authorization
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, status, first_login")
    .eq("id", session.user.id)
    .single();

  // Allow information-setup access for all users with first_login=true
  if (path === "/information-setup") {
    if (profile?.first_login === true) {
      return response;
    }
  }

  // If user is not approved, sign them out and redirect to login
  // (But don't redirect API routes, let them return their own unauthorized responses)
  if (profile?.status !== "approved" && !path.startsWith("/api/")) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if first login and trying to access any page other than information-setup
  if (
    profile?.first_login &&
    path !== "/information-setup" &&
    !path.startsWith("/api/")
  ) {
    const redirectUrl = new URL("/information-setup", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if super-admin routes and not API routes
  if (
    superAdminRoutes.some((route) => path.startsWith(route)) &&
    profile?.role !== "super-admin" &&
    !path.startsWith("/api/")
  ) {
    if (profile?.role === "restaurant-owner") {
      return NextResponse.redirect(
        new URL("/owner-dashboard/menu-setup", request.url)
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if restaurant-owner routes and not API routes
  if (
    restaurantOwnerRoutes.some((route) => path.startsWith(route)) &&
    profile?.role !== "restaurant-owner" &&
    !path.startsWith("/api/")
  ) {
    if (profile?.role === "super-admin") {
      return NextResponse.redirect(
        new URL("/super-admin-dashboard/dashboard", request.url)
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // User can access the requested page
  return response;
}

// Only run middleware on matching paths, but exclude static files and images
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth-bg-img.svg (your auth background image)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|auth-bg-img.svg).*)",
  ],
};
