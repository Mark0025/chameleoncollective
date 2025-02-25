import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define route matchers for our route groups
const isPublicRoute = createRouteMatcher([
  '/',
  '/(public)(.*)',
  '/book(.*)',
  '/contact(.*)',
  '/rentals(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/seed'
])

const isAdminRoute = createRouteMatcher(['/(auth)/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // Protect admin routes with role check
  if (isAdminRoute(req)) {
    await auth.protect((has) => {
      // TODO: Replace with actual admin role check once set up in Clerk
      return has({ role: 'admin' })
    })
  }

  // Protect all other routes (dashboard, etc)
  await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[^?]*$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
