import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/', '/sign-in', '/sign-up', '/rentals', '/contact']

export default clerkMiddleware((auth, request) => {
  const isPublic = publicRoutes.some(route => request.url.includes(route))
  
  // Allow public routes
  if (isPublic) {
    return NextResponse.next()
  }

  // Check for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const metadata = auth.session?.user?.publicMetadata
    const isAdmin = metadata?.role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // For non-public routes, require authentication
  if (!auth.session) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
} 