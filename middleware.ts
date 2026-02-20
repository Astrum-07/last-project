import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Runtime-ni qat'iy belgilaymiz.
 * Bu Node.js modullari (fs, path, __dirname) bilan bog'liq xatolarni oldini oladi.
 */
export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Cookiedan tokenni olish
  const token = request.cookies.get('token')?.value;

  // 2. Statik fayllarni va API yo'llarini filtrdan o'tkazish
  // Bu qator rasmlar, shriftlar va favicon middleware orqali o'tib ketishini ta'minlaydi.
  // Shunda loglardagi 500/404 xatoliklar to'xtaydi.
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || 
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png'
  ) {
    return NextResponse.next();
  }

  // 3. Login bo'lmagan foydalanuvchini himoya qilish
  // Agar token bo'lmasa va foydalanuvchi login sahifasida bo'lmasa -> login'ga yuborish
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Login bo'lgan foydalanuvchini login sahifasiga kiritmaslik
  // Agar token bo'lsa va foydalanuvchi login'ga kirmoqchi bo'lsa -> asosiy sahifaga yuborish
  if (token && pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

/**
 * Matcher sozlamasi:
 * Middleware qaysi yo'llarda ishga tushishini belgilaydi.
 */
export const config = {
  matcher: [
    /*
     * Quyidagi yo'llardan boshqa hamma joyda ishla:
     * - api (API yo'llari)
     * - _next/static (statik fayllar)
     * - _next/image (rasmlar)
     * - favicon.ico (sayt belgisi)
     * - barcha nuqtali fayllar (.png, .jpg, .svg va h.k.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};