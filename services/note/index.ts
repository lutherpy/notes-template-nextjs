import { mutate } from "swr";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("Variável de ambiente NEXT_PUBLIC_BASE_URL não definida.");
}

export async function getNotes() {
  const res = await fetch(`${BASE_URL}/api/note`, {
    method: "GET",
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar notas");
  }

  return res.json();
}

export async function createNote(note: { title: string; content: string }) {
  const res = await fetch(`${BASE_URL}/api/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar nota");
  }

  return res.json();
}

export async function updateNote(note: {
  id: string;
  userId: string;
  title: string;
  content: string;
}) {
  const res = await fetch(`${BASE_URL}/api/note`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...note,
      updatedAt: new Date().toISOString(), // ✅ adiciona timestamp atualizado
    }),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar nota");
  }

  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`${BASE_URL}/api/note`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar nota");
  }

  return res.json();
}
