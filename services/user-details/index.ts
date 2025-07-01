const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("Variável de ambiente NEXT_PUBLIC_BASE_URL não definida.");
}

type UserDetailsPayload = {
  address: string;
  identificationNumber: string;
  country: string;
  province: string;
  departmentId: string; // ✅ incluído
};

export async function createUserDetails(details: UserDetailsPayload) {
  const res = await fetch(`${BASE_URL}/api/user-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details), // ✅ já inclui o departmentId
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao salvar detalhes do usuário");
  }

  return res.json(); // { success: true }
}
