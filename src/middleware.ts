import { NextResponse } from 'next/server';
import type { MiddlewareConfig, NextRequest } from 'next/server';

const authenticatedRedirectPath: string = process.env.NEXT_PUBLIC_AUTHENTICATED_ROUTE || '';
const unauthenticatedRedirectPath: string = process.env.NEXT_PUBLIC_NOT_AUTHENTICATED_ROUTE || '';
const cookieName: string = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || '';

if (authenticatedRedirectPath === '' || unauthenticatedRedirectPath === '' || cookieName === '') { throw new Error('Uma ou mais variáveis de ambiente não estão definidas corretamente!') };

type jwtPayloadProps = {
    sub: number;
    name: string
    email: string;
    exp: number;
    iat: number;
}

type publicRoutesProps = {
    path: string;
    whenAuthenticated: 'redirect' | 'next';
};

// Here it´s only to the routes publics, if a route it´s not here it´s not public
const publicRoutes: Array<publicRoutesProps> = [
    { path: '/', whenAuthenticated: 'next' },
    { path: '/Login', whenAuthenticated: 'redirect' },
    { path: '/Login/TwoFactor', whenAuthenticated: 'redirect' },
    { path: '/Login/ResetPassword', whenAuthenticated: 'redirect' },
] as const;

function isJwtExpired(token: string): 'Expired' | 'Not expired' {
    try {
        const [, payloadBase64] = token.split('.');
        const payloadJson = atob(payloadBase64);
        const jwtPayload: jwtPayloadProps = JSON.parse(payloadJson);
        return jwtPayload.exp * 1000 > Date.now() ? 'Not expired' : 'Expired';
    } catch {
        return 'Expired';
    }
}

export function middleware(request: NextRequest) {
    const publicRoute: publicRoutesProps | undefined = publicRoutes.find(route => route.path === request.nextUrl.pathname);
    const authToken: string | undefined = request.cookies.get(cookieName)?.value;

    // User not authenticated ( without token JWT )
    if (!authToken) {
        // User not authenticated + Public route => Allow access
        if (publicRoute) { return NextResponse.next() };

        // Route protected + user not authenticated => Redirect to a public route
        return NextResponse.redirect(new URL(unauthenticatedRedirectPath, request.url));
    }

    // Discover if the user it´s with the token expired or not
    const isTokenExpired = isJwtExpired(authToken);
    if (isTokenExpired === 'Expired') {
        const response = publicRoute ? NextResponse.next() : NextResponse.redirect(new URL(unauthenticatedRedirectPath, request.url));
        response.cookies.delete(cookieName);
        return response;
    }

    // User authenticated + Protected route => Allow access
    if (!publicRoute) { return NextResponse.next() };

    // User authenticated + Public route but the user authenticated don´t need access (Example: Login, Register) => Redirect to a private page
    if (publicRoute.whenAuthenticated === 'redirect') { return NextResponse.redirect(new URL(authenticatedRedirectPath, request.url)) };

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
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};