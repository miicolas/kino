import { auth } from "@repo/contract/auth";
import { db, serverConfig } from "@repo/contract/drizzle";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PAGES, ROLES } from "@/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL(PAGES.SIGN_IN, request.url));
  }

  const [config] = await db
    .select({ setupCompletedAt: serverConfig.setupCompletedAt })
    .from(serverConfig)
    .limit(1);
  const setupCompleted = config?.setupCompletedAt != null;
  const isAdmin = session.user.role === ROLES.ADMIN;

  if (!setupCompleted) {
    const target = isAdmin ? PAGES.SETUP : PAGES.SETUP_PENDING;
    if (pathname !== target) {
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === PAGES.SETUP || pathname === PAGES.SETUP_PENDING) {
    return NextResponse.redirect(new URL(PAGES.HUB, request.url));
  }

  // Les réglages serveur sont réservés aux admins.
  if (pathname.startsWith(PAGES.SETTINGS) && !isAdmin) {
    return NextResponse.redirect(new URL(PAGES.HUB, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Scope explicite aux routes gardées ; n'inclut pas /, /sign-in, /sign-up (évite les boucles).
  // ⚠️ Ajouter ici toute nouvelle route du groupe (app) — les route groups sont transparents en URL.
  matcher: [
    "/hub/:path*",
    "/setup/:path*",
    "/setup-pending/:path*",
    "/settings/:path*",
  ],
};
