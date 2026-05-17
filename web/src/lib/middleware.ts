import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/teacher": ["teacher"],
  "/dashboard": ["student"],
  "/parent": ["parent"],
};

const protectedPathPrefixes = ["/dashboard", "/teacher", "/admin", "/onboarding", "/parent"];
const authPathPrefixes = ["/login", "/signup", "/forgot-password"];
const apiPathPrefix = "/api";

function isPrefixedPath(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getRequiredRole(pathname: string): string | null {
  for (const [prefix, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return roles[0];
    }
  }
  return null;
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = isPrefixedPath(pathname, protectedPathPrefixes);
  const isAuthPath = isPrefixedPath(pathname, authPathPrefixes);

  // Skip user lookup for API routes and public paths to avoid unnecessary DB calls
  if (pathname.startsWith(apiPathPrefix) || (!isProtectedPath && !isAuthPath)) {
    return NextResponse.next({ request });
  }

  const isRSCRequest = request.headers.get("RSC") === "1";

  const user = await getUser();

  // Block suspended users from accessing protected routes
  if (user && user.status === "suspended" && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("suspended", "true");
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Skip redirect for RSC navigations — RSC streaming cannot handle 307 responses
  if (user && isAuthPath && !isRSCRequest) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user.onboardingCompleted ? "/dashboard" : "/onboarding";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  const requiredRole = getRequiredRole(pathname);
  if (user && requiredRole && user.role !== requiredRole && !isRSCRequest) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user.onboardingCompleted ? "/dashboard" : "/onboarding";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({ request });
}
