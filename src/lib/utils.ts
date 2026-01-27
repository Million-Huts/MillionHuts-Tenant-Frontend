import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toNumber = (value: FormDataEntryValue | null) => {
  if (value === null || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};