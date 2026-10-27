import { useState } from "react";
import { eventInfo } from "@/data/event";
import type { AttendanceConfirmation } from "@/lib/api";
import { useHashTab } from "@/hooks/useHashTab";
import { useStoredState } from "@/hooks/useStoredState";
import { Header } from "@/components/Header";
import { Tabs } from "@/components/Tabs";
import { ConfirmForm } from "@/components/ConfirmForm";
import { AccessCodeForm } from "@/components/AccessCodeForm";
import { GuestList } from "@/components/GuestList";
import { EventDetails, GiftNote } from "@/components/EventDetails";

export default function App() {
  const [tab, setTab] = useHashTab();
  // Confirmación de este navegador: su id permite modificarla después
  const [confirmation, setConfirmation] = useStoredState<AttendanceConfirmation>("event-rsvp:mi-confirmacion");
  // Código de acceso de los organizadores para ver el listado
  const [accessCode, setAccessCode] = useStoredState<string>("event-rsvp:codigo-acceso");
  const [accessError, setAccessError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Columna con la ilustración: arriba el título (de fondo) y al final las
          flores, que siempre cierran la página sin importar el largo del contenido. */}
      <div
        className="mx-auto max-w-xl bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${eventInfo.backgroundTop})`, backgroundSize: "100% auto" }}
      >
        <Header />
        <main className="relative z-10 space-y-6 px-4">
          <Tabs active={tab} onChange={setTab} />

          {tab === "confirmar" && (
            <>
              <EventDetails />
              <ConfirmForm current={confirmation} onSaved={setConfirmation} />
              <GiftNote />
            </>
          )}

          {tab === "invitados" &&
            (accessCode ? (
              <GuestList
                token={accessCode}
                onLogout={(reason) => {
                  setAccessCode(null);
                  setAccessError(reason ?? null);
                }}
              />
            ) : (
              <AccessCodeForm
                error={accessError}
                onSubmit={(code) => {
                  setAccessError(null);
                  setAccessCode(code);
                }}
              />
            ))}
        </main>
        <img src={eventInfo.backgroundBottom} alt="" aria-hidden className="pointer-events-none -mt-[28%] block w-full" />
      </div>
    </div>
  );
}
