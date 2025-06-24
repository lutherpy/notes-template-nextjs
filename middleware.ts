import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Se estiver a acessar / (login ou home) e já tiver sessão:
  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se tentar acessar /dashboard ou qualquer rota dentro, mas sem sessão:
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Caso contrário, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
