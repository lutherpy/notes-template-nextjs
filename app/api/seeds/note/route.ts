import { db } from "@/db/drizzle";
import { note, user } from "@/db/schema"; // importa também o user
import { faker } from "@faker-js/faker"; // npm install @faker-js/faker

async function seedNotes() {
  // Buscar os usuários existentes (userId é obrigatório no note)
  const users = await db.select().from(user);

  if (users.length === 0) {
    throw new Error("Nenhum usuário encontrado para associar as notas.");
  }

  const userIds = users.map((u) => u.id);

  const notes = Array.from({ length: 10000 }, (_, i) => ({
    title: `Nota ${i + 1}`,
    content: faker.lorem.paragraphs(2),
    userId: userIds[Math.floor(Math.random() * userIds.length)], // associa a um usuário aleatório
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(note).values(notes);

  console.log("Notas inseridas com sucesso.");
}

seedNotes().catch(console.error);
