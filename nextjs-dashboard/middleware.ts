import { clerkMiddleware } from '@clerk/nextjs/server';

// Export the Clerk middleware
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};
