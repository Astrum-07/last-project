import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Edge Runtime-da ishlayotganini qat'iy belgilaymiz.
 * Bu __dirname yoki boshqa Node.js xatolarini oldini olishga yordam beradi.
 */
export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Cookiedan tokenni olish
  // Eslatma: Middleware-da faqat 'request.cookies' ishlatish shart!
  const token = request.cookies.get('token')?.value;

  // 2. Statik fayllarni va API yo'llarini filtrdan o'tkazish
  // Bu qator rasmlar (.png, .jpg), shriftlar va favicon uchun 500/404 xatolarini oldini oladi
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // Barcha fayl kengaytmali yo'llar (.png, .svg, .ico)
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 3. Login bo'lmagan foydalanuvchini login sahifasiga yo'naltirish
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    // Xavfsizlik uchun: Redirect qilinganda login sahifasiga borganini aniq bilish
    return NextResponse.redirect(loginUrl);
  }

  // 4. Login bo'lgan foydalanuvchini login sahifasiga kiritmaslik
  if (token && pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

/**
 * Matcher - middleware qaysi yo'llarda ishlashi kerakligini belgilaydi.
 * Bu yerda barcha ichki Next.js fayllari va rasmlar chiqarib tashlangan.
 */
export const config = {
  matcher: [
    /*
     * Quyidagilar bilan boshlanmaydigan barcha yo'llarni tekshirish:
     * - api (API routes)
     * - _next/static (statik fayllar)
     * - _next/image (rasm optimizatsiyasi)
     * - favicon.ico (sayt ikonkasi)
     * - hamma rasm va statik fayllar (.png, .jpg va h.k.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};