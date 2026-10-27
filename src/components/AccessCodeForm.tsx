import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { eventInfo } from "@/data/event";

interface Props {
  /** Mensaje cuando el código guardado ya no funciona */
  error?: string | null;
  onSubmit: (code: string) => void;
}

/** Pide el código de acceso de los organizadores para ver el listado. */
export function AccessCodeForm({ error, onSubmit }: Props) {
  const [code, setCode] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (code.trim()) onSubmit(code.trim());
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border bg-card/90 p-6 backdrop-blur-sm text-center shadow-soft">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose/10 text-rose">
        <Lock className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-3 font-script text-5xl text-rose">Lista de invitados</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Solo para {eventInfo.organizers}. Ingresa el código de acceso.
      </p>

      <label htmlFor="access-code" className="sr-only">
        Código de acceso
      </label>
      <input
        id="access-code"
        type="password"
        autoComplete="current-password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Código de acceso"
        className="mt-5 w-full rounded-xl border bg-background px-4 py-3 text-center text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
      />

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!code.trim()}
        className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        Ver invitados
      </button>
    </form>
  );
}
