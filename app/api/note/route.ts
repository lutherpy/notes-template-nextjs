import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, asc, eq, ilike, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/note

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")?.trim() || "";
  const orderBy = searchParams.get("orderBy") || "createdAt";
  const orderDir = searchParams.get("orderDir") || "desc";

  const orderColumns = {
    title: note.title,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };

  const orderField =
    orderColumns[orderBy as keyof typeof orderColumns] || note.createdAt;

  const offset = (page - 1) * limit;

  // Pesquisa segura convertendo todos os campos para texto
  const conditions = Object.values(note).map((field) =>
    ilike(sql`${field}::text`, `%${search}%`)
  );

  try {
    const notes = await db
      .select()
      .from(note)
      .where(or(...conditions))
      .orderBy(orderDir === "asc" ? asc(orderField) : desc(orderField))
      .limit(limit)
      .offset(offset);

    const total = (
      await db
        .select()
        .from(note)
        .where(or(...conditions))
    ).length;

    return NextResponse.json({
      data: notes,
      total,
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
