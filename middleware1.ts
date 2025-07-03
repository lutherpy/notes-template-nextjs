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

  // Se tentar acessar /user-details sem sessão:
  if (pathname === "/user-details" && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Se já tem detalhes e está tentando ir para /user-details, redireciona para /dashboard
  if (pathname === "/user-details" && sessionCookie) {
    const res = await fetch(`${request.nextUrl.origin}/api/user-details`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.hasDetails) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      console.warn("Erro ao verificar userDetails via API:", res.status);
    }
  }

  // ✅ Se está em /dashboard e ainda não tem detalhes, redireciona para /user-details
  // Mas só faz a chamada se não tiver o cookie `hasDetails`
  if (
    pathname.startsWith("/dashboard") &&
    sessionCookie &&
    pathname !== "/user-details" &&
    hasDetailsCookie?.value !== "true"
  ) {
    const res = await fetch(`${request.nextUrl.origin}/api/user-details`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.hasDetails) {
        return NextResponse.redirect(new URL("/user-details", request.url));
      } else {
        // ✅ Define o cookie "hasDetails" para evitar nova verificação
        const response = NextResponse.next();
        response.cookies.set("hasDetails", "true", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60, // 1 hora
        });
        return response;
      }
    } else {
      console.warn("Erro ao verificar userDetails via API:", res.status);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/user-details"],
};
