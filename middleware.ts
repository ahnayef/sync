import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuth = !!req.nextauth.token;
    const role = req.nextauth.token?.role as string | undefined;

    // Redirect from login/signup if logged in
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      if (isAuth) {
        return NextResponse.redirect(new URL(role === "admin" ? "/dashboard" : "/profile", req.url));
      }
    }

    // Redirect from index page if logged in
    if (pathname === "/") {
      if (isAuth) {
        return NextResponse.redirect(new URL(role === "admin" ? "/dashboard" : "/routine", req.url));
      }
    }

    // Protect Dashboard (Admins only)
    if (pathname.startsWith("/dashboard")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
    }

    // Protect User routes (/profile, /routine, /courses)
    if (pathname.startsWith("/profile") || pathname.startsWith("/routine") || pathname.startsWith("/courses")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle all routing logic
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/routine/:path*", "/courses/:path*", "/login", "/signup", "/"],
};
