// app/api/note/route.ts
import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { NextResponse } from "next/server";
import { noteSchema } from "@/app/api/note/noteSchema";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ✅ GET: listar todas as notas do usuário autenticado
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const userNotes = await db
      .select()
      .from(note)
      .where(eq(note.userId, userId))
      .orderBy(desc(note.id));

    console.log("✅ [API] Notes:", userNotes);
    return NextResponse.json(userNotes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar notas." },
      { status: 500 },
    );
  }
}

// ✅ POST: criar nova nota
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    // valida com zod
    noteSchema.parse(body);

    const newNote = await db
      .insert(note)
      .values({
        id: crypto.randomUUID(),
        title: body.title,
        content: body.content,
        userId,
      })
      .returning();

    return NextResponse.json(newNote[0]);
  } catch (err: unknown) {
    console.error(err);

    let detail = "Erro ao criar nota.";
    if (err && typeof err === "object" && "detail" in err) {
      detail = err.detail as string;
    }

    return NextResponse.json(
      { error: "Erro ao criar nota.", detail },
      { status: 500 },
    );
  }
}
