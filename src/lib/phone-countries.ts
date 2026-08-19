export type PhoneCountry = {
  iso2: string;
  dial: string;
  nameEs: string;
  nameEn: string;
  /** Cantidad de dígitos válidos del número local (sin el prefijo). */
  digits: number[];
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso2: "BO", dial: "591", nameEs: "Bolivia", nameEn: "Bolivia", digits: [8] },
  { iso2: "AR", dial: "54", nameEs: "Argentina", nameEn: "Argentina", digits: [10, 11] },
  { iso2: "BR", dial: "55", nameEs: "Brasil", nameEn: "Brazil", digits: [10, 11] },
  { iso2: "CL", dial: "56", nameEs: "Chile", nameEn: "Chile", digits: [9] },
  { iso2: "CO", dial: "57", nameEs: "Colombia", nameEn: "Colombia", digits: [10] },
  { iso2: "EC", dial: "593", nameEs: "Ecuador", nameEn: "Ecuador", digits: [9] },
  { iso2: "MX", dial: "52", nameEs: "México", nameEn: "Mexico", digits: [10] },
  { iso2: "PY", dial: "595", nameEs: "Paraguay", nameEn: "Paraguay", digits: [9] },
  { iso2: "PE", dial: "51", nameEs: "Perú", nameEn: "Peru", digits: [9] },
  { iso2: "UY", dial: "598", nameEs: "Uruguay", nameEn: "Uruguay", digits: [8, 9] },
  { iso2: "VE", dial: "58", nameEs: "Venezuela", nameEn: "Venezuela", digits: [10] },
  { iso2: "US", dial: "1", nameEs: "Estados Unidos", nameEn: "United States", digits: [10] },
  { iso2: "ES", dial: "34", nameEs: "España", nameEn: "Spain", digits: [9] },
];

export const DEFAULT_PHONE_COUNTRY = "BO";

export function findPhoneCountry(iso2: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.iso2 === iso2) ?? PHONE_COUNTRIES[0];
}

/** Acepta solo dígitos en el número local (ya sin el prefijo del país). */
export function isValidLocalPhone(iso2: string, localNumber: string): boolean {
  if (!/^\d+$/.test(localNumber)) return false;
  const country = findPhoneCountry(iso2);
  return country.digits.includes(localNumber.length);
}

export function buildFullPhone(iso2: string, localNumber: string): string {
  const country = findPhoneCountry(iso2);
  return `+${country.dial} ${localNumber}`;
}
