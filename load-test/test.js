import http from "k6/http";
import { check, sleep } from "k6";

// Configurações do teste
export const options = {
  stages: [
    { duration: "30s", target: 100 }, // sobe para 100
    { duration: "30s", target: 500 },
    { duration: "30s", target: 1000 }, // teste realista
  ],
};

export default function () {
  const res = http.get("http://localhost:3000"); // 🔁 Substitua pela URL real

  // Verificações
  check(res, {
    "status é 200": (r) => r.status === 200,
    "tempo de resposta < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1); // simula tempo de "pensamento" do usuário
}
