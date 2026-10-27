import backgroundTop from "@/assets/wedding-top.webp";
import backgroundBottom from "@/assets/wedding-bottom.webp";

/**
 * Contenido del evento. Es lo único que cambia de un evento a otro (boda,
 * cumpleaños…); el resto del código no conoce los datos de la boda.
 */
export const eventInfo = {
  /** Título principal. En esta boda ya está dibujado en la ilustración */
  title: "Ludibia y Gildardo",
  /** Parte superior de la ilustración (trae el título) y flores del final */
  backgroundTop,
  backgroundBottom,
  invitation: "Con mucha alegría te invitamos a celebrar",
  occasion: "nuestro matrimonio",
  dateLabel: "Sábado 5 de diciembre de 2026",
  schedule: [
    { title: "Misa", time: "6:00 PM", place: "Iglesia La Santa Cruz", icon: "church" },
    { title: "Reunión", time: "8:00 PM", place: "JAC Santa Cruz", icon: "party" },
  ] as const,
  verse: {
    text: "Así que ya no son dos, sino una sola carne. Por tanto, lo que Dios ha unido, que no lo separe el hombre.",
    reference: "Mateo 19:6",
  },
  giftNote: {
    title: "Lluvia de sobres",
    text: "Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio, agradecemos sea en sobre.",
  },
  intro: "Por favor confírmanos tu asistencia para preparar todo con mucho cariño.",
  // Solo informativa: se aceptan confirmaciones después de esta fecha
  confirmationDeadline: "25 de noviembre",
  /** Quién ve el listado de invitados */
  organizers: "los novios",
};
