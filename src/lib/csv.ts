import type { AttendanceConfirmation } from "@/lib/api";

const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

/** Descarga el listado como CSV (se abre en Excel o Google Sheets). */
export function downloadGuestsCsv(confirmations: AttendanceConfirmation[], totalAttendees: number) {
  const rows = [
    ["Nombre", "Personas", "Confirmó el"],
    ...confirmations.map((c) => [c.name, c.attendees, new Date(c.createdAt).toLocaleString("es-CO")]),
    ["Total", totalAttendees, ""],
  ];
  // BOM para que Excel reconozca las tildes; ";" es el separador que Excel usa en español
  const csv = "﻿" + rows.map((r) => r.map(escape).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "invitados.csv" });
  link.click();
  URL.revokeObjectURL(url);
}
