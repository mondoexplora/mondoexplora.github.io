import { NextRequest, NextResponse } from 'next/server';
import { getDefaultLanguage } from '@/lib/i18n';

const SUPPORTED_LANGUAGES = ['en'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }
  
  // Check if the pathname already has a language prefix
  const pathnameHasLanguage = SUPPORTED_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  // If no language prefix, redirect to default language
  if (!pathnameHasLanguage) {
    const defaultLanguage = getDefaultLanguage();
    const newUrl = new URL(`/${defaultLanguage}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
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
}; 