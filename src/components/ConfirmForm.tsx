import { useState, type FormEvent } from "react";
import { CalendarCheck, Check, Heart, Minus, Pencil, Plus } from "lucide-react";
import { ApiError, type AttendanceConfirmation } from "@/lib/api";
import { MAX_ATTENDEES, MAX_NAME_LENGTH, peopleLabel, saveAttendance, validateAttendance } from "@/lib/attendance";
import { eventInfo } from "@/data/event";
import { StepButton } from "./StepButton";

interface Props {
  /** Confirmación guardada en este navegador, si la hay */
  current: AttendanceConfirmation | null;
  onSaved: (confirmation: AttendanceConfirmation) => void;
}

export function ConfirmForm({ current, onSaved }: Props) {
  // Si ya confirmó, se muestra el resumen; el formulario solo al editar.
  const [editing, setEditing] = useState(!current);
  const [name, setName] = useState(current?.name ?? "");
  const [attendees, setAttendees] = useState(current?.attendees ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const invalid = validateAttendance(name, attendees);
    if (invalid) {
      setError(invalid);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      onSaved(await saveAttendance(name, attendees, current?.id));
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos registrar tu confirmación. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (current && !editing) {
    return (
      <section className="rounded-3xl border bg-card/90 p-6 backdrop-blur-sm text-center shadow-soft">
        <Heart className="mx-auto h-8 w-8 fill-rose/20 text-rose" aria-hidden />
        <h2 className="mt-3 font-script text-5xl text-rose">¡Gracias por confirmar!</h2>
        <p className="mt-2 text-muted-foreground">Será muy especial compartir este día contigo.</p>
        <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-semibold">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          {current.name} · {peopleLabel(current.attendees)}
        </p>
        <button
          type="button"
          onClick={() => {
            setName(current.name);
            setAttendees(current.attendees);
            setEditing(true);
          }}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-bold text-primary hover:bg-muted"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Modificar mi confirmación
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border bg-card/90 p-6 backdrop-blur-sm shadow-soft">
      <h2 className="text-center font-script text-5xl text-rose">
        {current ? "Modificar confirmación" : "Confirma tu asistencia"}
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">{eventInfo.intro}</p>
      <p className="mx-auto mt-4 w-fit rounded-full bg-rose/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-rose-dark">
        Confirma antes del {eventInfo.confirmationDeadline}
      </p>

      <label htmlFor="guest-name" className="mt-6 block text-sm font-semibold">
        Tu nombre
      </label>
      <input
        id="guest-name"
        type="text"
        autoComplete="name"
        maxLength={MAX_NAME_LENGTH}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={saving}
        placeholder="Ej. Sanly Ortiz"
        className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
      />

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-sm font-semibold">¿Cuántas personas asistirán?</span>
          <p className="text-xs text-muted-foreground">Incluyéndote a ti</p>
        </div>
        <div className="flex items-center gap-3">
          <StepButton label="Menos" disabled={attendees <= 1 || saving} onClick={() => setAttendees((n) => n - 1)}>
            <Minus className="h-4 w-4" aria-hidden />
          </StepButton>
          <span className="w-6 text-center text-xl font-bold text-primary" aria-live="polite">
            {attendees}
          </span>
          <StepButton label="Más" disabled={attendees >= MAX_ATTENDEES || saving} onClick={() => setAttendees((n) => n + 1)}>
            <Plus className="h-4 w-4" aria-hidden />
          </StepButton>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
        {current && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={saving}
            className="w-full rounded-full border py-3 text-sm font-bold text-primary disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden />
          {saving ? "Guardando…" : current ? "Guardar cambios" : "Confirmar asistencia"}
        </button>
      </div>
    </form>
  );
}
