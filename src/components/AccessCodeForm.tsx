import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { eventInfo } from "@/data/event";

interface Props {
  /** Mensaje cuando el código guardado ya no funciona */
  error?: string | null;
  onSubmit: (code: string) => void;
}

/** Pide el código de acceso de los organizadores para ver el listado. */
export function AccessCodeForm({ error, onSubmit }: Props) {
  const [code, setCode] = useState("");
  const [visible, setVisible] = useState(false);

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
      <div className="relative mt-5">
        <input
          id="access-code"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de acceso"
          className="w-full rounded-xl border bg-background px-12 py-3 text-center text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar código" : "Mostrar código"}
          aria-pressed={visible}
          title={visible ? "Ocultar código" : "Mostrar código"}
          className="absolute top-1/2 right-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary"
        >
          {visible ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
        </button>
      </div>

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
