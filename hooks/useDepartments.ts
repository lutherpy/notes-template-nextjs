// hooks/useDepartments.ts
import useSWR from "swr";
import { getDepartments } from "@/services/department";

export function useDepartments() {
  const { data, error, isLoading } = useSWR("/api/department", getDepartments, {
    refreshInterval: 5000,
  });

  const departments = Array.isArray(data)
    ? data // caso API retorne um array direto
    : Array.isArray(data?.data)
    ? data.data // caso API retorne { data: [...] }
    : []; // fallback seguro

  return {
    departments,
    isLoading,
    isError: error,
  };
}
