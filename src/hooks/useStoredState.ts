import { useCallback, useState } from "react";

/**
 * Estado que se recuerda en este navegador (localStorage). Si el
 * almacenamiento está bloqueado (modo privado), funciona solo en memoria.
 */
export function useStoredState<T>(key: string) {
  const [value, setValue] = useState<T | null>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  });

  const save = useCallback(
    (next: T | null) => {
      setValue(next);
      try {
        if (next === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Almacenamiento bloqueado: solo se pierde el recordatorio.
      }
    },
    [key],
  );

  return [value, save] as const;
}
