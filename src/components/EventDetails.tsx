import { Church, Heart, Mail, PartyPopper, type LucideIcon } from "lucide-react";
import { eventInfo } from "@/data/event";

const icons: Record<(typeof eventInfo.schedule)[number]["icon"], LucideIcon> = {
  church: Church,
  party: PartyPopper,
};

/** Horarios y lugares (misa, reunión) y el versículo de la invitación. */
export function EventDetails() {
  return (
    <section className="rounded-3xl border bg-card/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="grid grid-cols-2 divide-x divide-rose/30">
        {eventInfo.schedule.map(({ title, time, place, icon }) => {
          const Icon = icons[icon];
          return (
            <div key={title} className="px-2 text-center">
              <p className="font-script text-3xl text-primary">{title}</p>
              <Icon className="mx-auto mt-1 h-7 w-7 text-rose" aria-hidden />
              <p className="mt-2 font-display text-2xl font-semibold text-rose-dark">{time}</p>
              <p className="text-xs font-bold uppercase tracking-wide">{place}</p>
            </div>
          );
        })}
      </div>

      <figure className="mt-6 border-t border-rose/20 pt-5 text-center">
        <Heart className="mx-auto h-4 w-4 fill-rose/30 text-rose" aria-hidden />
        <blockquote className="mt-2 font-display text-lg italic leading-snug">“{eventInfo.verse.text}”</blockquote>
        <figcaption className="mt-1 font-display text-primary">{eventInfo.verse.reference}</figcaption>
      </figure>
    </section>
  );
}

/** Nota de "lluvia de sobres" (cómo hacer un obsequio). */
export function GiftNote() {
  return (
    <section className="rounded-3xl border border-dashed border-rose/40 bg-accent/70 p-6 text-center backdrop-blur-sm">
      <Mail className="mx-auto h-6 w-6 text-rose" aria-hidden />
      <h2 className="mt-1 font-display text-xl font-semibold uppercase tracking-wider text-rose-dark">
        {eventInfo.giftNote.title}
      </h2>
      <p className="mt-1 text-sm">{eventInfo.giftNote.text}</p>
    </section>
  );
}
