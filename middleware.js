import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log('TOKEN:', token, 'PATH:', pathname);

  const protectedRoutes = ['/', '/profile', '/badges'];

  // If not logged in and trying to access protected page
  if (!token && protectedRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access login page
  if (token && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/profile', '/badges'],
};