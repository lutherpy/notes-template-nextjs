import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 }, // aquecimento
    { duration: "30s", target: 300 }, // aumento de carga
    { duration: "30s", target: 600 }, // carga estável
    { duration: "30s", target: 1000 }, // pico de carga
    { duration: "30s", target: 0 }, // rampa de descida
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% das requisições abaixo de 800ms
    http_req_failed: ["rate<0.01"], // menos de 1% de falhas
  },
};

const BASE_URL = "http://localhost:3000"; // URL base do seu aplicativo

export default function () {
  group("Página Inicial", () => {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      "🏠 status é 200": (r) => r.status === 200,
      "🏠 tempo < 500ms": (r) => r.timings.duration < 500,
    });
  });

  group("Página de Departamento", () => {
    const res = http.get(`${BASE_URL}/dashboard/department`);
    check(res, {
      "🏠 status é 200": (r) => r.status === 200,
      "🏠 tempo < 500ms": (r) => r.timings.duration < 500,
    });
  });

  group("Página de Notas", () => {
    const res = http.get(`${BASE_URL}/dashboard/note`);
    check(res, {
      "🗂 status é 200": (r) => r.status === 200,
      "🗂 tempo < 800ms": (r) => r.timings.duration < 800,
    });
  });

  group("API de Notas", () => {
    const res = http.get(`${BASE_URL}/api/note`);
    check(res, {
      "📡 status é 200": (r) => r.status === 200,
      "📡 tempo < 500ms": (r) => r.timings.duration < 500,
    });
  });

  sleep(1);
}
