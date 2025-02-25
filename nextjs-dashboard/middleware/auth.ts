import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthObject } from "@clerk/nextjs/server";
// List of routes that don't require authentication
const publicRoutes = ["/", "/book", "/contact", "/rentals"];

// List of routes that require admin access
const adminRoutes = ["/admin", "/admin/events", "/admin/products", "/admin/settings"];

export default authMiddleware({
  publicRoutes,
  async afterAuth(auth, req) {
    // Handle public routes
    if (publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // If the user isn't authenticated and tries to access a protected route
    if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, check if user has admin role
    if (adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      try {
        // Get user role from your database
        const response = await fetch(`${req.nextUrl.origin}/api/user-role?userId=${auth.userId}`);
        const { role } = await response.json();

        if (role !== 'admin') {
          // Redirect non-admin users to dashboard
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // On error, redirect to dashboard for safety
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Allow the request to proceed
    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
