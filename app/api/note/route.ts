import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, asc, eq, ilike, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/note
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")?.trim() || "";
  const orderBy = searchParams.get("orderBy") || "title";

  // Mapeamento manual de colunas permitidas
  const orderColumns = {
    title: note.title,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };

  // Valida se a coluna enviada é válida
  const orderField =
    orderColumns[orderBy as keyof typeof orderColumns] || note.title;

  const offset = (page - 1) * limit;

  try {
    const query = db
      .select()
      .from(note)
      .where(ilike(note.title, `%${search}%`))
      .orderBy(desc(note.createdAt))
      .limit(limit)
      .offset(offset);

    const notes = await query;

    const total = (
      await db
        .select()
        .from(note)
        .where(ilike(note.title, `%${search}%`))
    ).length;

    //return NextResponse.json(allNotes);

    console.log("termo", search);
    console.log("notes", notes);
    console.log("page", page);

    return NextResponse.json({
      data: notes,
      total: total,
      page,
      limit,
    });
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
