import { type NextRequest, NextResponse } from "next/server";
import { getUser, getSessionCookieName, getSessionCookieValue } from "@/lib/auth";

const protectedPathPrefixes = ["/dashboard", "/teacher", "/admin", "/onboarding"];
const authPathPrefixes = ["/login", "/signup", "/forgot-password"];

function isPrefixedPath(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
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

  return NextResponse.next({ request });
}
