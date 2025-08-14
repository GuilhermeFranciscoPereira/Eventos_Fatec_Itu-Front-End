import { NextResponse } from 'next/server';
import type { MiddlewareConfig, NextRequest } from 'next/server';

const REFRESH_COOKIE = process.env.NEXT_PUBLIC_REFRESH_COOKIE || '';
const AUTHENTICATEDREDIRECTPATH: string = process.env.NEXT_PUBLIC_AUTHENTICATED_ROUTE || '';
const UNAUNTHENTICATEDREDIRECTPATH: string = process.env.NEXT_PUBLIC_NOT_AUTHENTICATED_ROUTE || '';

type publicRoutesProps = {
    path: string;
    type: 'exact' | 'dynamic';
    whenAuthenticated: 'redirect' | 'next';
};

// Here it´s only to the routes publics, if a route it´s not here it´s not public
const publicRoutes: Array<publicRoutesProps> = [
    { path: '/', type: 'exact', whenAuthenticated: 'next' },
    { path: '/Login', type: 'exact', whenAuthenticated: 'redirect' },
    { path: '/Login/TwoFactor', type: 'exact', whenAuthenticated: 'redirect' },
    { path: '/Login/ResetPassword', type: 'exact', whenAuthenticated: 'redirect' },
    { path: '/EventDetail', type: 'dynamic', whenAuthenticated: 'next' },
] as const;

export function middleware(request: NextRequest) {
    const publicRoute: publicRoutesProps | undefined = publicRoutes.find(route => route.type === 'exact' ? request.nextUrl.pathname === route.path : request.nextUrl.pathname.startsWith(`${route.path}/`));

    // User not authenticated ( without token JWT ) 
    if (!request.cookies.get(REFRESH_COOKIE)?.value) {
        // User not authenticated + Public route => Allow access
        if (publicRoute) return NextResponse.next();

        // Route protected + user not authenticated => Redirect to a public route
        return NextResponse.redirect(new URL(UNAUNTHENTICATEDREDIRECTPATH, request.url));
    }

    // User authenticated + Protected route => Allow access
    if (!publicRoute) { return NextResponse.next() };

    // User authenticated + Public route but the user authenticated don´t need access (Example: Login, Register) => Redirect to a private page
    if (publicRoute.whenAuthenticated === 'redirect') { return NextResponse.redirect(new URL(AUTHENTICATEDREDIRECTPATH, request.url)) };

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)',
    ],
};
