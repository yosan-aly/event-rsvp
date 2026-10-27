import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, LogOut, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { ApiError, deleteConfirmation, getConfirmationSummary, type ConfirmationSummary } from "@/lib/api";
import { peopleLabel } from "@/lib/attendance";
import { downloadGuestsCsv } from "@/lib/csv";

interface Props {
  token: string;
  /** El código dejó de ser válido o se cerró sesión */
  onLogout: (reason?: string) => void;
}

const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function GuestList({ token, onLogout }: Props) {
  const [summary, setSummary] = useState<ConfirmationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        onLogout("El código de acceso no es correcto.");
        return;
      }
      setError(err instanceof ApiError ? err.message : "No pudimos cargar la lista.");
    },
    [onLogout],
  );

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        setSummary(await getConfirmationSummary(token, signal));
      } catch (err) {
        if (!signal?.aborted) handleError(err);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [token, handleError],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function remove(id: string, name: string) {
    if (!window.confirm(`¿Eliminar la confirmación de ${name}?`)) return;
    try {
      await deleteConfirmation(token, id);
      await load();
    } catch (err) {
      handleError(err);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("es");
    const list = summary?.confirmations ?? [];
    return q ? list.filter((c) => c.name.toLocaleLowerCase("es").includes(q)) : list;
  }, [summary, query]);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Confirmaciones" value={summary?.totalConfirmations} />
        <Stat label="Personas en total" value={summary?.totalAttendees} highlight />
      </div>

      <div className="rounded-3xl border bg-card/90 p-4 shadow-soft backdrop-blur-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre"
              aria-label="Buscar por nombre"
              className="w-full rounded-full border bg-background py-2 pr-4 pl-9 text-sm outline-none focus:border-primary"
            />
          </div>
          <IconButton label="Actualizar" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
          </IconButton>
          <IconButton
            label="Descargar CSV"
            disabled={!summary?.confirmations.length}
            onClick={() => summary && downloadGuestsCsv(summary.confirmations, summary.totalAttendees)}
          >
            <Download className="h-4 w-4" aria-hidden />
          </IconButton>
          <IconButton label="Salir" onClick={() => onLogout()}>
            <LogOut className="h-4 w-4" aria-hidden />
          </IconButton>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
            {error}
          </p>
        )}

        {summary && summary.confirmations.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            <Users className="mx-auto h-8 w-8 opacity-60" aria-hidden />
            <p className="mt-2 text-sm">Todavía no hay confirmaciones.</p>
          </div>
        )}

        {summary && summary.confirmations.length > 0 && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Nadie coincide con “{query}”.</p>
        )}

        <ul className="mt-4 divide-y">
          {filtered.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{dateFormat.format(new Date(c.createdAt))}</p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-sm font-bold text-primary">
                {peopleLabel(c.attendees)}
              </span>
              <button
                type="button"
                onClick={() => remove(c.id, c.name)}
                aria-label={`Eliminar la confirmación de ${c.name}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value?: number; highlight?: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 text-center shadow-soft ${highlight ? "bg-primary text-primary-foreground" : "bg-card/90 backdrop-blur-sm"}`}>
      <p className="font-display text-4xl font-semibold">{value ?? "–"}</p>
      <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-card text-primary hover:bg-muted disabled:opacity-40"
    >
      {children}
    </button>
  );
}
