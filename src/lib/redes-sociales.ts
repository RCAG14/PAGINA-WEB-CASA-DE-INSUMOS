import { Link2, Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "react-icons/si";
import type { IconType } from "react-icons";

export interface PlataformaRedSocial {
  value: string;
  label: string;
  icon: IconType;
}

// Íconos de marca reales (react-icons/si), no aproximaciones genéricas de
// Lucide — Mail y Link2 quedan en Lucide porque no representan una marca.
export const PLATAFORMAS_REDES_SOCIALES: PlataformaRedSocial[] = [
  { value: "instagram", label: "Instagram", icon: SiInstagram },
  { value: "facebook", label: "Facebook", icon: SiFacebook },
  { value: "tiktok", label: "TikTok", icon: SiTiktok },
  { value: "youtube", label: "YouTube", icon: SiYoutube },
  { value: "x", label: "X / Twitter", icon: SiX },
  { value: "email", label: "Gmail / Correo Electrónico", icon: Mail },
  { value: "otro", label: "Otro", icon: Link2 },
];

const PLATAFORMA_POR_VALOR = new Map(PLATAFORMAS_REDES_SOCIALES.map((p) => [p.value, p]));

export function getPlataformaRedSocial(plataforma: string): PlataformaRedSocial | undefined {
  return PLATAFORMA_POR_VALOR.get(plataforma);
}

/** Resuelve el href correcto según la plataforma: `mailto:` para correo, URL tal cual para el resto. */
export function getRedSocialHref(plataforma: string, valor: string) {
  return plataforma === "email" ? `mailto:${valor}` : valor;
}
