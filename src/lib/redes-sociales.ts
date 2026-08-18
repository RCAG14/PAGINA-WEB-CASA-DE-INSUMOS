import {
  AtSign,
  Camera,
  Link2,
  Mail,
  Music2,
  ThumbsUp,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface PlataformaRedSocial {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const PLATAFORMAS_REDES_SOCIALES: PlataformaRedSocial[] = [
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "facebook", label: "Facebook", icon: ThumbsUp },
  { value: "tiktok", label: "TikTok", icon: Music2 },
  { value: "youtube", label: "YouTube", icon: Video },
  { value: "x", label: "X / Twitter", icon: AtSign },
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
