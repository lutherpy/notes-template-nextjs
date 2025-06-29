import { db } from "@/db/drizzle";
import { user } from "@/db/schema"; // importa o schema da tabela user
import { NextResponse } from "next/server";

// GET /api/user
export async function GET() {
  try {
    const allUsers = await db.select().from(user);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
