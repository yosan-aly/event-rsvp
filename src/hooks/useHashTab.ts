import { useCallback, useEffect, useState } from "react";

export type Tab = "confirmar" | "invitados";

const fromHash = (): Tab => (window.location.hash === "#/invitados" ? "invitados" : "confirmar");

/**
 * Pestaña activa guardada en la URL (#/invitados), para que los organizadores
 * puedan entrar directo al listado con un enlace.
 */
export function useHashTab() {
  const [tab, setTab] = useState<Tab>(fromHash);

  useEffect(() => {
    const onChange = () => setTab(fromHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const go = useCallback((next: Tab) => {
    window.location.hash = next === "invitados" ? "/invitados" : "/";
  }, []);

  return [tab, go] as const;
}
