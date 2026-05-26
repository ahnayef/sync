import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const isAuth = !!req.nextauth.token;
    const role = req.nextauth.token?.role as string | undefined;
    const hasSelectedCourses = req.nextauth.token?.hasSelectedCourses as boolean | undefined;
    const isStudent = role !== "admin" && role !== "moderator";

    // Redirect from login/signup if logged in
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      if (isAuth) {
        return NextResponse.redirect(
          new URL(
            role === "admin" || role === "moderator" ? "/dashboard" : "/routine",
            req.url
          )
        );
      }
    }

    // Redirect from index page if logged in
    if (pathname === "/") {
      if (isAuth) {
        return NextResponse.redirect(
          new URL(
            role === "admin" || role === "moderator" ? "/dashboard" : "/routine",
            req.url
          )
        );
      }
    }

    // Protect Dashboard (Admins and Moderators only)
    if (pathname.startsWith("/dashboard")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (role !== "admin" && role !== "moderator") {
        return NextResponse.redirect(new URL("/routine", req.url));
      }
      // Only admin can access manage-moderators
      if (pathname.startsWith("/dashboard/manage-moderators") && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Protect User routes (/profile, /routine, /courses)
    if (
      pathname.startsWith("/profile") ||
      pathname.startsWith("/routine") ||
      pathname.startsWith("/courses")
    ) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // Mods and admins should not access routine or courses
      if (
        (pathname.startsWith("/routine") || pathname.startsWith("/courses")) &&
        (role === "admin" || role === "moderator")
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Students without any selected courses must pick courses first,
      // unless they are already on the /courses page
      if (isStudent && !pathname.startsWith("/courses") && hasSelectedCourses === false) {
        return NextResponse.redirect(new URL("/courses", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the proxy function handle all routing logic
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/routine/:path*",
    "/courses/:path*",
    "/login",
    "/signup",
    "/",
  ],
};
