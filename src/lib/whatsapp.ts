export type ServicioWhatsApp = "cajas" | "webdev";

// El mensaje llega al negocio, por eso va siempre en español sin importar el
// idioma que esté viendo el visitante. Vive fuera de los componentes "use client"
// para poder usarse también desde componentes de servidor.
export const MENSAJES_WHATSAPP: Record<ServicioWhatsApp, string> = {
  cajas:
    "Hola, vengo de la página de Casa de Insumos y quisiera más información sobre las cajas de devoluciones de Amazon.",
  webdev:
    "Hola, vengo de la página de Casa de Insumos y quisiera más información sobre el servicio de desarrollo web.",
};
