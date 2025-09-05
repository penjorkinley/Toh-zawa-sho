// middleware.ts - FIXED VERSION
import { createServerClient } from "@supabase/ssr";
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
  "/menu",
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

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // CRITICAL FIX: Early return for ALL static assets and images
  if (
    path.startsWith("/_next/") || // Next.js static files
    path.startsWith("/images/") || // Images folder
    path.startsWith("/icons/") || // Icons folder
    path.startsWith("/static/") || // Static files
    path.startsWith("/public/") || // Public folder
    path.includes("/favicon") || // Favicon files
    path.endsWith(".svg") || // SVG files
    path.endsWith(".png") || // PNG files
    path.endsWith(".jpg") || // JPG files
    path.endsWith(".jpeg") || // JPEG files
    path.endsWith(".gif") || // GIF files
    path.endsWith(".webp") || // WebP files
    path.endsWith(".ico") || // Icon files
    path.endsWith(".css") || // CSS files
    path.endsWith(".js") || // JavaScript files
    path.endsWith(".woff") || // Font files
    path.endsWith(".woff2") || // Font files
    path.endsWith(".ttf") || // Font files
    path.endsWith(".eot") || // Font files
    path.endsWith(".json") || // JSON files
    path.endsWith(".xml") || // XML files
    path.endsWith(".txt") || // Text files
    path.endsWith(".pdf") || // PDF files
    // Specific files from your app
    path === "/restaurant-illustration.svg" || // Landing page illustration
    path === "/auth-bg-img.svg" // Auth background
  ) {
    return response;
  }

  // 🔥 CRITICAL FIX: Check if it's a public route - MUST include /menu routes
  if (
    publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  ) {
    return response;
  }

  // Get authenticated user (more secure than getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user and trying to access protected route, redirect to login
  if (!user) {
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
    .eq("id", user.id)
    .single();

  // Allow information-setup access for all users with first_login=true
  if (path === "/information-setup") {
    if (profile?.first_login === true) {
      return response;
    }
  }

  // If user is not approved, sign them out and redirect to login
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

// FIXED CONFIG: Properly exclude all static assets from middleware processing
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And exclude all common static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|json|xml|txt|pdf)$).*)",
  ],
};
