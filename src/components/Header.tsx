import { eventInfo } from "@/data/event";

/**
 * Encabezado sobre la ilustración: los nombres ya vienen dibujados en ella,
 * así que el título es solo para lectores de pantalla y buscadores.
 * El padding superior (en % del ancho) deja ver el título de la imagen.
 */
export function Header() {
  return (
    <header className="px-6 pt-[78%] pb-6 text-center">
      <h1 className="sr-only">{eventInfo.title}</h1>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
        {eventInfo.invitation}
      </p>
      <p className="font-script text-4xl text-primary">{eventInfo.occasion}</p>
      <p className="mx-auto mt-4 w-fit rounded-full border border-rose/30 bg-card/80 px-5 py-1.5 font-display text-xl font-semibold text-rose-dark">
        {eventInfo.dateLabel}
      </p>
    </header>
  );
}
