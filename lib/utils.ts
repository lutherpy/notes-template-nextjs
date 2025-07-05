import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return "—";

  const date = typeof value === "string" ? new Date(value) : value;

  return date.toLocaleString("pt-PT", {
    timeZone: "Africa/Luanda",
    hour12: false,
    ...options,
  });
}
