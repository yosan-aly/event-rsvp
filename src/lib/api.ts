const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** Error del API con el código estable que define el backend. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Confirmación de asistencia guardada en el backend. */
export interface AttendanceConfirmation {
  id: string;
  name: string;
  /** Total de personas que asistirán, incluyendo a quien confirma */
  attendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmationSummary {
  confirmations: AttendanceConfirmation[];
  totalConfirmations: number;
  totalAttendees: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/v1${path}`, init);
  } catch (err) {
    if (init?.signal?.aborted) throw err;
    throw new ApiError(0, "NETWORK_ERROR", "No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.");
  }

  // 204 No Content no trae cuerpo
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? "Ocurrió un error inesperado. Inténtalo de nuevo en un momento.",
    );
  }
  return body as T;
}

const json = { "Content-Type": "application/json" };
const admin = (token: string) => ({ "X-Admin-Token": token });

export function createConfirmation(name: string, attendees: number): Promise<AttendanceConfirmation> {
  return request("/attendance-confirmations", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ name, attendees }),
  });
}

export function updateConfirmation(id: string, name: string, attendees: number): Promise<AttendanceConfirmation> {
  return request(`/attendance-confirmations/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: json,
    body: JSON.stringify({ name, attendees }),
  });
}

/** Listado con totales. Requiere el código de acceso de los organizadores. */
export function getConfirmationSummary(token: string, signal?: AbortSignal): Promise<ConfirmationSummary> {
  return request("/admin/attendance-confirmations", { headers: admin(token), signal });
}

export function deleteConfirmation(token: string, id: string): Promise<null> {
  return request(`/admin/attendance-confirmations/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: admin(token),
  });
}
