import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cookiedan tokenni olish
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Agar foydalanuvchi login qilmagan bo'lsa va login sahifasida bo'lmasa
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Agar foydalanuvchi login qilgan bo'lsa va login sahifasiga kirmoqchi bo'lsa
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Barcha sahifalarni himoya qilish (api va static fayllardan tashqari)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};