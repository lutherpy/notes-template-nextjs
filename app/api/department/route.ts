import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { department } from "@/db/schema";
import { desc, asc, eq, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search")?.trim() || "";
  const orderBy = searchParams.get("orderBy") || "createdAt";
  const orderDir = searchParams.get("orderDir") || "desc"; // "asc" ou "desc"

  // Mapeamento manual de colunas permitidas
  const orderColumns = {
    name: department.name,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };

  // Campo de ordenação seguro
  const orderField =
    orderColumns[orderBy as keyof typeof orderColumns] || department.createdAt;

  const offset = (page - 1) * limit;

  try {
    const query = db
      .select()
      .from(department)
      .where(ilike(department.name, `%${search}%`))
      .orderBy(orderDir === "asc" ? asc(orderField) : desc(orderField))
      .limit(limit)
      .offset(offset);

    const departments = await query;

    const total = (
      await db
        .select()
        .from(department)
        .where(ilike(department.name, `%${search}%`))
    ).length;

    return NextResponse.json({
      data: departments,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar departamentos" },
      { status: 500 }
    );
  }
}

// POST /api/department
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome do departamento é obrigatório" },
        { status: 400 }
      );
    }

    await db.insert(department).values({
      name,
      description,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar departamento" },
      { status: 500 }
    );
  }
}

// PUT /api/department
export async function PUT(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID e nome do departamento são obrigatórios" },
        { status: 400 }
      );
    }

    await db
      .update(department)
      .set({ name, description })
      .where(eq(department.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar departamento" },
      { status: 500 }
    );
  }
}

// DELETE /api/department
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do departamento é obrigatório" },
        { status: 400 }
      );
    }

    await db.delete(department).where(eq(department.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar departamento" },
      { status: 500 }
    );
  }
}
