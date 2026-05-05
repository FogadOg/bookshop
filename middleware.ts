import { auth } from "./auth";

// wraps protected admin routes and redirects unauthenticated users to the login page
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // If the user is trying to access an admin route and is not authenticated, redirect to the login page
  if (isAdminRoute && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
