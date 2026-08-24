import { prisma } from "@/lib/prisma";

// Config estática de cada módulo de negocio: título, descripción y href no
// cambian en runtime, así que viven en código. Solo `activo` se persiste en
// la tabla Modulo (ver prisma/schema.prisma) para poder prenderlo/apagarlo
// desde /admin/configuracion/modulos sin tocar código.
export const MODULOS_CONFIG = [
  {
    clave: "cajas",
    titulo: "Gestión de Cajas Amazon y Retornos",
    descripcion:
      "Dashboard, inventario de cajas, manifiesto de contenido y pedidos del negocio de retornos de liquidación.",
    href: "/admin/cajas",
  },
  {
    clave: "cotizaciones",
    titulo: "Servicio de Cotizaciones e Importaciones",
    descripcion: "Gestión de solicitudes de cotización y seguimiento de procesos de importación.",
    href: null,
  },
  {
    clave: "desarrollo-web",
    titulo: "Desarrollo de Software y Páginas Web",
    descripcion: "Seguimiento de proyectos de desarrollo a medida para clientes externos.",
    href: "/admin/desarrollo-web",
  },
  {
    clave: "rrhh",
    titulo: "Administración de Personal y RRHH",
    descripcion: "Gestión de personal, turnos y operaciones internas de recursos humanos.",
    href: null,
  },
] as const;

export type ModuloClave = (typeof MODULOS_CONFIG)[number]["clave"];

export async function getModulosConEstado() {
  const filas = await prisma.modulo.findMany();
  const estadoPorClave = new Map(filas.map((f) => [f.clave, f.activo]));

  return MODULOS_CONFIG.map((mod) => ({
    ...mod,
    // Si el módulo todavía no tiene fila en BD (antes del primer seed),
    // se asume activo para no romper el comportamiento actual.
    activo: estadoPorClave.get(mod.clave) ?? true,
  }));
}

export async function getModuloActivo(clave: ModuloClave) {
  const fila = await prisma.modulo.findUnique({ where: { clave } });
  return fila?.activo ?? true;
}

export async function alternarModulo(clave: ModuloClave, activo: boolean) {
  await prisma.modulo.upsert({
    where: { clave },
    update: { activo },
    create: { clave, activo },
  });
}
