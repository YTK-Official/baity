import { type NextRequest, NextResponse } from 'next/server';

import { authClient } from './lib/auth/client';
import { getLocale } from './services/locale';

const PUBLIC_ROUTES = ['/profile', '/contact'];

export default async function middleware(req: NextRequest) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: req.headers,
    },
  });

  const {
    url,
    nextUrl: { pathname },
  } = req;

  // set current locale
  const locale = await getLocale();
  req.headers.set('x-next-locale', locale);

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!session) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', url));
  }

  const { user } = session;

  if (!isPublicRoute) {
    if (user.role === 'chef' && !pathname.startsWith('/chef')) {
      return NextResponse.redirect(new URL('/chef', url));
    }

    if (user.role === 'admin' && !pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|public).*)',
  ],
};
