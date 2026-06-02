import { auth } from "@repo/contract/auth";
import { db } from "@repo/contract/drizzle";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PAGES } from "@/constants/page";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({ headers: request.headers });

  // 1. Non authentifié → /sign-in
  if (!session) {
    return NextResponse.redirect(new URL(PAGES.SIGN_IN, request.url));
  }

  const config = await db.query.serverConfig.findFirst();
  const setupCompleted = config?.setupCompletedAt != null;
  const isAdmin = session.user.role === "admin";

  if (!setupCompleted) {
    // 2. Admin → forcé sur /setup ; 3. Non-admin → écran d'attente /setup-pending
    const target = isAdmin ? PAGES.SETUP : PAGES.SETUP_PENDING;
    if (pathname !== target) {
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // 4. Setup terminé → on ne reste pas sur /setup ou /setup-pending
  if (pathname === PAGES.SETUP || pathname === PAGES.SETUP_PENDING) {
    return NextResponse.redirect(new URL(PAGES.HUB, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Scope explicite aux routes gardées ; n'inclut pas /, /sign-in, /sign-up (évite les boucles).
  // ⚠️ Ajouter ici toute nouvelle route du groupe (app) — les route groups sont transparents en URL.
  matcher: ["/hub/:path*", "/setup/:path*", "/setup-pending/:path*"],
};
