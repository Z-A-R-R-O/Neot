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
  const user = await getUser();
  const { pathname } = request.nextUrl;
  const isProtectedPath = isPrefixedPath(pathname, protectedPathPrefixes);
  const isAuthPath = isPrefixedPath(pathname, authPathPrefixes);

  if (!user && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user.onboardingCompleted ? "/dashboard" : "/onboarding";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  const requiredRole = getRequiredRole(pathname);
  if (user && requiredRole && user.role !== requiredRole) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user.onboardingCompleted ? "/dashboard" : "/onboarding";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({ request });
}
