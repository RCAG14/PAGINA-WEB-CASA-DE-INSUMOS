import { prisma } from "@/lib/prisma";
import { TIPO_CAMBIO_POR_DEFECTO } from "@/lib/moneda/constants";

const CLAVE_TIPO_CAMBIO = "tipo_cambio_usd_bob";

/** Bolivianos por dólar con que se convierten los precios de desarrollo web. */
export async function getTipoCambioUsdBob(): Promise<number> {
  const ajuste = await prisma.ajuste.findUnique({ where: { clave: CLAVE_TIPO_CAMBIO } });
  const valor = Number(ajuste?.valor);
  return Number.isFinite(valor) && valor > 0 ? valor : TIPO_CAMBIO_POR_DEFECTO;
}

export async function actualizarTipoCambioUsdBob(valor: number) {
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error("El tipo de cambio debe ser un número mayor a 0.");
  }
  await prisma.ajuste.upsert({
    where: { clave: CLAVE_TIPO_CAMBIO },
    update: { valor: String(valor) },
    create: { clave: CLAVE_TIPO_CAMBIO, valor: String(valor) },
  });
}
