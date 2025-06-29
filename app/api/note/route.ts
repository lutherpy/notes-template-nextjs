import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/note
export async function GET() {
  try {
    const allNotes = await db.select().from(note);
    return NextResponse.json(allNotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar notas" },
      { status: 500 }
    );
  }
}

// POST /api/note
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { title, content } = await req.json();

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
    const body = await req.json();
    const { id, title, content, userId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da nota é obrigatório" },
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
