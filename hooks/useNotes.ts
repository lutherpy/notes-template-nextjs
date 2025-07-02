// hooks/useNotes.ts
import useSWR from "swr";
import { getNotes } from "@/services/note";

export function useNotes() {
  const { data, error, isLoading } = useSWR("/api/note", getNotes, {
    refreshInterval: 10000, // Revalida automaticamente a cada 10s (opcional)
  });

  return {
    notes: data,
    isLoading,
    isError: error,
  };
}
