import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { userDetails } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const {
      address,
      identificationNumber,
      country,
      province,
      departmentId, // ✅ novo campo
    } = await req.json();

    // Validação básica (opcional, mas recomendado)
    if (!departmentId) {
      return NextResponse.json(
        { error: "Departamento é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se já existe um registro de user_details
    const existing = await db
      .select()
      .from(userDetails)
      .where(eq(userDetails.userId, userId));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Detalhes já cadastrados." },
        { status: 400 }
      );
    }

    await db.insert(userDetails).values({
      userId,
      address,
      identificationNumber,
      country,
      province,
      departmentId, // ✅ incluído na inserção
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inserir user_details:", error);
    return NextResponse.json(
      { error: "Erro ao inserir detalhes do usuário" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ hasDetails: false }, { status: 401 });
    }

    const result = await db
      .select()
      .from(userDetails)
      .where(eq(userDetails.userId, userId));

    const hasDetails = result.length > 0;

    return NextResponse.json({ hasDetails });
  } catch (error) {
    console.error("Erro ao verificar userDetails:", error);
    return NextResponse.json({ hasDetails: false }, { status: 500 });
  }
}
