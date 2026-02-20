// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Cookiedan tokenni olish (Next.js-ning o'z funksiyasi)
  // Hech qanday 'js-cookie' yoki boshqa kutubxona ishlatmang!
  const token = request.cookies.get('token')?.value;

  // 2. Statik fayllarni tekshiruvdan o'tkazib yuborish
  // Favicon, rasmlar, css va js fayllar middleware'ni crash qilmasligi uchun
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 3. Login bo'lmagan foydalanuvchini himoya qilish
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Login bo'lgan foydalanuvchini login sahifasiga kiritmaslik
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Matcher sozlamasi
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};