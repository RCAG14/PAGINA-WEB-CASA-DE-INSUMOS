const numberFormatter = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return `Bs ${numberFormatter.format(value)}`;
}

// Montos de desarrollo web (servicio global, en dólares): sin decimales cuando
// el monto es entero, para que "US$ 187" no se lea como "US$ 187.00".
const usdFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatUsd(value: number) {
  return `US$ ${usdFormatter.format(value)}`;
}

export function formatSku(value: string) {
  return value.toUpperCase();
}
