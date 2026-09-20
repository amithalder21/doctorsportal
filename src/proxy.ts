import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If logged in and trying to access /admin/login, redirect to /admin
  if (pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 2. Protect Admin API Routes (except OTP/Login)
  if (pathname.startsWith('/api/admin') && !pathname.includes('/otp/')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 3. Protect all /patient routes except /patient/login
  if (pathname.startsWith('/patient') && !pathname.startsWith('/patient/login')) {
    const patientSession = request.cookies.get('patient_session');
    
    if (!patientSession || !patientSession.value) {
      const loginUrl = new URL('/patient/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If logged in and trying to access /patient/login, redirect to /patient
  if (pathname.startsWith('/patient/login')) {
    const patientSession = request.cookies.get('patient_session');
    if (patientSession && patientSession.value) {
      return NextResponse.redirect(new URL('/patient', request.url));
    }
  }

  // 4. Protect Patient API Routes (except OTP/Login)
  if (pathname.startsWith('/api/patient') && !pathname.includes('/otp/')) {
    const patientSession = request.cookies.get('patient_session');
    
    if (!patientSession || !patientSession.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)',
  ],
};
