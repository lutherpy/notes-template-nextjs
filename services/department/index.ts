const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("Variável de ambiente NEXT_PUBLIC_BASE_URL não definida.");
}

// GET: Buscar todos os departamentos
export async function getDepartments() {
  const res = await fetch(`${BASE_URL}/api/department`, {
    method: "GET",
    cache: "default", // Use "force-cache" para evitar revalidação desnecessária
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar departamentos");
  }

  return res.json();
}

// POST: Criar novo departamento
export async function createDepartment(dept: {
  name: string;
  description?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dept),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar departamento");
  }

  return res.json();
}

// PUT: Atualizar departamento
export async function updateDepartment(dept: {
  id: string;
  name: string;
  description?: string | null;
}) {
  const res = await fetch(`${BASE_URL}/api/department`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...dept,
      updatedAt: new Date().toISOString(), // ✅ Adiciona timestamp atualizado
    }),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar departamento");
  }

  return res.json();
}

// DELETE: Excluir departamento
export async function deleteDepartment(id: string) {
  const res = await fetch(`${BASE_URL}/api/department`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar departamento");
  }

  return res.json();
}
