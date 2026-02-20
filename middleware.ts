import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// MUHIM: Bu qator Next.js-ga Node.js-dan foydalanmaslikni buyuradi
export const runtime = 'edge'; 

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Statik fayllarni o'tkazib yuborish (Xatolarni oldini oladi)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Himoya mantiqi
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Faqat kerakli sahifalarni filtrlaymiz
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};