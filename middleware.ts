import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/route',
  '/dashboard/stations', 
  '/dashboard/vehicles',
  '/dashboard/profile'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // If it's a protected route, we'll let the client-side auth context handle the redirect
  // This middleware just ensures the route structure is correct
  if (isProtectedRoute) {
    // Let the client-side auth context handle authentication checks
    return NextResponse.next()
  }
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For any other routes, allow access (they'll be handled by Next.js routing)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
