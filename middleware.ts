import { auth } from "./auth";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/logg-inn";

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/logg-inn", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
