import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cookiedan tokenni olish (Faqat shu usul ishlaydi!)
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Statik fayllarni (favicon, rasmlar va h.k.) tekshirmaslik uchun
  // Bu qator xatolikni oldini oladi
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. Agar token bo'lmasa va login sahifasida bo'lmasa -> Loginga yuborish
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Agar token bo'lsa va login sahifasiga kirmoqchi bo'lsa -> Dashboardga yuborish
  if (token && pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Matcher qismini ham mana bunday aniq yozing
export const config = {
  matcher: [
    /*
     * Barcha sahifalarni tekshirish, lekin quyidagilarni o'tkazib yuborish:
     * - api yo'llari
     * - _next/static (static fayllar)
     * - _next/image (rasmlar)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};