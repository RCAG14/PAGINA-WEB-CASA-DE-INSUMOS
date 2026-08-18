import { formatPrice } from "@/lib/format";
import type { DatosCotizacionPedido } from "@/lib/email/datos-cotizacion";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function construirHtmlCotizacion(data: DatosCotizacionPedido): string {
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

  const whatsappTexto = data.whatsapp
    ? `Para confirmar tu pedido, envíanos el comprobante de pago por WhatsApp al ${escapeHtml(
        data.whatsapp
      )} indicando tu número de pedido. ¡Gracias por confiar en nosotros!`
    : "Para confirmar tu pedido, contactanos por WhatsApp indicando tu número de pedido. ¡Gracias por confiar en nosotros!";

  const logoHtml = data.logoUrl
    ? `<img src="${escapeHtml(data.logoUrl)}" alt="Casa de Insumos" width="48" height="48" style="display:block;border-radius:50%;object-fit:contain;" />`
    : "";

  return `
<div style="background-color:#f4efe3;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:20px;">
      ${logoHtml}
      <h1 style="margin:12px 0 4px;color:#1b3a2b;font-size:24px;letter-spacing:1px;">CASA DE INSUMOS</h1>
      ${
        data.whatsapp
          ? `<p style="margin:0;color:#a65b34;font-size:12px;">Tel: ${escapeHtml(data.whatsapp)}</p>`
          : ""
      }
    </div>

    <div style="background:#ffffff;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <p style="display:inline-block;background:#1b3a2b;color:#ffffff;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin:0 0 16px;">
        Cotización — no es un comprobante de pago
      </p>

      <p style="font-size:15px;color:#2b2b2b;margin:0 0 12px;">Hola <strong>${escapeHtml(data.clienteNombre)}</strong>,</p>
      <p style="font-size:15px;color:#2b2b2b;margin:0 0 16px;">
        Aquí tienes la <strong>cotización</strong> de tu pedido Nº <strong>${escapeHtml(data.codigoPedido)}</strong>
        (${escapeHtml(data.fecha)}). Adjuntamos el detalle en PDF.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#1b3a2b;">
            <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
            <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Cant.</th>
            <th style="padding:10px 12px;color:#ffffff;font-size:12px;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>

      <p style="text-align:right;font-size:18px;color:#a65b34;margin:0 0 16px;">
        Total: <strong>${formatPrice(data.total)}</strong>
      </p>

      <p style="margin:0 0 16px;">
        <span style="background:#dbe9ff;color:#1b3a5c;font-size:13px;padding:4px 8px;border-radius:4px;">
          Lugar de entrega: <strong>${escapeHtml(data.lugarEntrega)}</strong>
        </span>
      </p>

      <p style="font-size:14px;color:#2b2b2b;margin:0;">${whatsappTexto}</p>
    </div>

    <p style="text-align:center;color:#8a8a8a;font-size:11px;margin-top:20px;">
      CASA DE INSUMOS · Este correo es una cotización informativa, no constituye un comprobante de pago.
    </p>
  </div>
</div>`;
}
