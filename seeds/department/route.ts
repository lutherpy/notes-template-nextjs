// import { db } from "@/db/drizzle";
// import { department } from "@/db/schema";
// import { faker } from "@faker-js/faker"; // instale com `npm install @faker-js/faker`

// async function seedDepartments() {
//   const departments = Array.from({ length: 100 }, (_, i) => ({
//     name: `Departamento ${i + 1}`,
//     description: faker.company.catchPhrase(), // texto aleatório
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }));

//   await db.insert(department).values(departments);

//   console.log("departamentos inseridos com sucesso.");
// }

// seedDepartments().catch(console.error);
