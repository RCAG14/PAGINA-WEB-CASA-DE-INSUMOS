const numberFormatter = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return `Bs ${numberFormatter.format(value)}`;
}

export function formatSku(value: string) {
  return value.toUpperCase();
}
