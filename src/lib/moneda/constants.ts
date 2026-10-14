// Moneda en que el visitante ve los precios de desarrollo web: siempre se
// cargan en dólares, y "BOB" los convierte con el tipo de cambio del panel.
export type Moneda = "USD" | "BOB";

export const MONEDA_COOKIE = "moneda";
export const TIPO_CAMBIO_POR_DEFECTO = 6.96;
