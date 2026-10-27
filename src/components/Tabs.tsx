import { CalendarCheck, Users } from "lucide-react";
import type { Tab } from "@/hooks/useHashTab";

const tabs: { id: Tab; label: string; Icon: typeof Users }[] = [
  { id: "confirmar", label: "Confirmar asistencia", Icon: CalendarCheck },
  { id: "invitados", label: "Invitados", Icon: Users },
];

export function Tabs({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav role="tablist" aria-label="Secciones" className="grid grid-cols-2 gap-1 rounded-full border bg-card/90 p-1 shadow-soft backdrop-blur-sm">
      {tabs.map(({ id, label, Icon }) => {
        const selected = id === active;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold transition ${
              selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
