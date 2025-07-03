import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const hasDetailsCookie = request.cookies.get("hasDetails");

  // Se estiver a acessar / (login ou home) e já tiver sessão:
  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se tentar acessar /dashboard ou qualquer rota dentro, mas sem sessão:
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Se já tem detalhes e está tentando ir para /user-details, redireciona para /dashboard

  // ✅ Se está em /dashboard e ainda não tem detalhes, redireciona para /user-details
  // Mas só faz a chamada se não tiver o cookie `hasDetails`

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/user-details"],
};
