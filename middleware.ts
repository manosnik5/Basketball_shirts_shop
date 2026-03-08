import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/admin/dashboard", "/admin/jerseys"];

export async function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const sessionCookie = getSessionCookie(request);

    const response = NextResponse.next();

    const isLoggedIn = !!sessionCookie; 
    const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
    const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

    if (isOnProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (isOnAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}