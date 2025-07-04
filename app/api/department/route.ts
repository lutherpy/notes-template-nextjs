import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { department } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getListHandler } from "@/lib/handlers/getListHandler";

export const GET = getListHandler(department, {
  title: department.name,
  description: department.description,
  createdAt: department.createdAt,
  updatedAt: department.updatedAt,
});

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
