# event-rsvp

Página para que los invitados confirmen su asistencia a un evento (boda, cumpleaños,
celebración), y para que los organizadores vean quién confirmó, con cuántas personas y
el total. El backend es
[event-rsvp-api](https://github.com/yosan-aly/event-rsvp-api).

## Stack

- **React 18 + TypeScript** · **Vite 5** · **Tailwind CSS v4** (tema en `src/index.css`)
- Íconos: lucide-react · Fuentes: Great Vibes, Cormorant Garamond y Nunito
- Colores de la boda: verde `#6B7D48` y rosa `#D37675` (en `src/index.css`)

## Funcionalidades

| Pestaña | Acceso | Qué hace |
|---|---|---|
| **Confirmar asistencia** (`/`) | pública | Nombre y cuántas personas asisten (1 a 7, incluyéndose). El navegador recuerda la confirmación para poder modificarla después |
| **Invitados** (`/#/invitados`) | código de acceso | Total de confirmaciones y de personas, listado con buscador, eliminar duplicados y descarga en CSV (Excel) |

El código de acceso es el `ADMIN_TOKEN` del backend. Los organizadores pueden entrar directo con
el enlace `…/#/invitados`; el código queda guardado en su navegador hasta que pulsen *Salir*.

## Estructura

```
src/
├── App.tsx                    # Pestañas y estado (confirmación propia, código de acceso)
├── data/event.ts              # Contenido del evento: título, fecha, horarios, versículo, textos
├── assets/                    # Ilustración: parte superior (título) y flores del final
├── lib/
│   ├── api.ts                 # Cliente del backend
│   ├── attendance.ts          # Validación y guardar (crear o actualizar)
│   └── csv.ts                 # Exportar el listado
├── hooks/
│   ├── useHashTab.ts          # Pestaña activa en la URL
│   └── useStoredState.ts      # Estado recordado en localStorage
└── components/
    ├── Header.tsx             # Invitación y fecha (los nombres vienen en la ilustración)
    ├── EventDetails.tsx       # Misa / reunión, versículo y lluvia de sobres
    ├── Tabs.tsx
    ├── ConfirmForm.tsx        # Formulario de confirmación
    ├── AccessCodeForm.tsx     # Pide el código de los organizadores
    ├── GuestList.tsx          # Totales y listado
    └── StepButton.tsx         # Botón − / +
```

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173 (usa VITE_API_URL de .env.development)
npm run build
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend. En Vercel: la URL de Cloud Run, sin `/` final |
