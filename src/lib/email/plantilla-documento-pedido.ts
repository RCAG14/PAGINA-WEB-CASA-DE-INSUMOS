import { formatPrice } from "@/lib/format";
import type { DatosDocumentoPedido } from "@/lib/email/datos-documento-pedido";

export type TipoDocumentoPedido = "cotizacion" | "recibo";

const EMPRESA_DIRECCION = "Calle Calatayud, La Paz, Bolivia";
const EMPRESA_TELEFONO = "64047012";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textoIntro(tipo: TipoDocumentoPedido, codigoPedido: string) {
  return tipo === "cotizacion"
    ? `Aquí tienes la cotización de tu pedido Nº <strong>${escapeHtml(codigoPedido)}</strong>. Adjuntamos el detalle en PDF.`
    : `Tu pedido Nº <strong>${escapeHtml(codigoPedido)}</strong> ha sido completado y entregado. Adjuntamos tu recibo oficial en PDF.`;
}

function textoCierre(tipo: TipoDocumentoPedido) {
  return tipo === "cotizacion"
    ? `Para confirmar tu pedido, envíanos el comprobante de pago por WhatsApp al ${EMPRESA_TELEFONO} indicando tu número de pedido. ¡Gracias por confiar en nosotros!`
    : `¡Gracias por tu compra y por confiar en CASA INSUMOS! Si tienes alguna consulta, puedes escribirnos al WhatsApp ${EMPRESA_TELEFONO}.`;
}

export function construirHtmlDocumento(
  data: DatosDocumentoPedido,
  tipo: TipoDocumentoPedido
): string {
  const filas = data.lineas
    .map(
      (linea) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e0d5;color:#2b2b2b;font-size:14px;">${escapeHtml(linea.nombre)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e0d5;color:#2b2b2b;font-size:14px;text-align:center;">${linea.cantidad}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e0d5;color:#2b2b2b;font-size:14px;text-align:right;">${formatPrice(linea.subtotal)}</td>
        </tr>`
    )
    .join("");

  const logoHtml = data.logoUrl
    ? `<img src="${escapeHtml(data.logoUrl)}" alt="Casa Insumos" width="48" height="48" style="display:block;margin:0 auto;border-radius:50%;object-fit:contain;" />`
    : "";

  return `
<div style="background-color:#F6F3EB;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="text-align:center;margin-bottom:24px;">
      ${logoHtml}
      <h1 style="margin:12px 0 4px;color:#1E3A2F;font-size:22px;letter-spacing:1px;">CASA INSUMOS</h1>
      <p style="margin:0;color:#8C6D46;font-size:12px;">${EMPRESA_DIRECCION} · Tel: ${EMPRESA_TELEFONO}</p>
    </div>

    <p style="font-size:15px;color:#2b2b2b;margin:0 0 12px;">Hola <strong>${escapeHtml(data.clienteNombre)}</strong>,</p>
    <p style="font-size:15px;color:#2b2b2b;margin:0 0 20px;">${textoIntro(tipo, data.codigoPedido)}</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead>
        <tr style="background:#1E3A2F;">
          <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
          <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Cant.</th>
          <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <p style="text-align:right;font-size:18px;color:#8C6D46;margin:0 0 20px;">
      Total: <strong>${formatPrice(data.total)}</strong>
    </p>

    <p style="margin:0 0 16px;font-size:14px;color:#2b2b2b;">
      Lugar de entrega: <strong>${escapeHtml(data.lugarEntrega)}</strong>
    </p>

    <p style="font-size:14px;color:#2b2b2b;margin:0;">${textoCierre(tipo)}</p>
  </div>

  <p style="text-align:center;color:#8a8a8a;font-size:11px;margin-top:20px;">
    CASA INSUMOS · La Paz, Bolivia
  </p>
</div>`;
}
