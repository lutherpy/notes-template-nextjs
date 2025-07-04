import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, asc, eq, ilike, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getListHandler } from "@/lib/handlers/getListHandler";

// GET /api/note
// ✅ Handler GET reutilizável
export const GET = getListHandler(note, {
  title: note.title,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

// POST /api/note
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    await db.insert(note).values({
      title,
      content,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar nota" }, { status: 500 });
  }
}

// PUT /api/note
export async function PUT(req: NextRequest) {
  try {
    const { id, title, content, userId } = await req.json();

    if (!id || !title || !content || !userId) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    await db
      .update(note)
      .set({ title, content, userId })
      .where(eq(note.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar nota" },
      { status: 500 }
    );
  }
}

// DELETE /api/note
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID da nota é obrigatório" },
        { status: 400 }
      );
    }

    await db.delete(note).where(eq(note.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar nota" },
      { status: 500 }
    );
  }
}
