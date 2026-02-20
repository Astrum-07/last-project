import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Cookiedan tokenni olish (Next.js-ning o'z funksiyasi)
  const token = request.cookies.get('token')?.value;

  // 2. Statik fayllarni va API yo'llarini tekshirmaslik
  // Bu qator rasmlar yoki CSS yuklanganda Middleware crash bo'lishini oldini oladi
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 3. Login bo'lmagan foydalanuvchini himoya qilish
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Login bo'lgan foydalanuvchini login sahifasiga kiritmaslik
  if (token && pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Matcher sozlamasi
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};