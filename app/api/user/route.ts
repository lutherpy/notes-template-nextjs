import { user } from "@/db/schema"; // importa o schema da tabela user
import { getListHandler } from "@/lib/handlers/getListHandler";

// GET /api/user
export const GET = getListHandler(user, {
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
