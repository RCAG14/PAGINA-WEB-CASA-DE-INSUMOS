import { Boxes, Cpu, Gamepad2, Gem, Home, Shirt, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import type { ClassificationIcon } from "@/lib/types";

// Módulo neutral (sin "use client") — se importa tanto desde componentes
// server como client, así que no puede vivir en un archivo con directiva.
export const CLASSIFICATION_ICON_MAP: Record<ClassificationIcon, LucideIcon> = {
  electronica: Cpu,
  joyeria: Gem,
  hogar: Home,
  moda: Shirt,
  herramientas: Wrench,
  belleza: Sparkles,
  juguetes: Gamepad2,
  mixto: Boxes,
};

export const CLASSIFICATION_ICON_OPTIONS: { value: ClassificationIcon; label: string }[] = [
  { value: "electronica", label: "Electrónica (chip)" },
  { value: "joyeria", label: "Joyería (gema)" },
  { value: "hogar", label: "Hogar (casa)" },
  { value: "moda", label: "Moda (prenda)" },
  { value: "herramientas", label: "Herramientas (llave)" },
  { value: "belleza", label: "Belleza (destellos)" },
  { value: "juguetes", label: "Juguetería (control)" },
  { value: "mixto", label: "Mixto (cajas)" },
];
