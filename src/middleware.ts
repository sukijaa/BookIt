import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)',     // Protect the checkout page
  '/my-bookings(.*)', // Protect the "My Bookings" page
]);

export default clerkMiddleware(async (auth, req) => {
  // If the user tries to access a protected route and is NOT logged in...
  if (isProtectedRoute(req) && !(await auth()).userId) {
    
    // We get the sign-in URL from the auth() helper
    const signInUrl = new URL('/sign-in', req.url);
    // And we use a standard NextResponse to redirect.
    return NextResponse.redirect(signInUrl);
  }
  
  // If the route is not protected, or the user is logged in,
  // continue as normal.
  return NextResponse.next();
});

export const config = {
  // This matcher is correct
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};