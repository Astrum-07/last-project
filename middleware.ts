import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// MUHIM: Bu qator __dirname xatosini oldini oladi
export const runtime = 'edge'; 

export function middleware(request: NextRequest) {
  // Cookie'dan tokenni olish
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Statik fayllar va rasmlarni tekshirmaslik (muhim!)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Agar token bo'lmasa va foydalanuvchi login'da bo'lmasa -> Login'ga yuborish
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Agar token bo'lsa va foydalanuvchi login sahifasiga kirmoqchi bo'lsa -> Home'ga yuborish
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Qaysi sahifalarda middleware ishlashini belgilash
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};