// hooks/useDepartments.ts
import { useEffect, useState } from "react";
import { getDepartments } from "@/services/department";
import { toast } from "sonner";

export function useDepartments() {
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch {
        toast.error("Erro ao carregar departamentos");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { departments, loading };
}
