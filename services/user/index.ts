const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("Variável de ambiente NEXT_PUBLIC_BASE_URL não definida.");
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return res.json();
}
