import { Resend } from "resend";
import { obtenerDatosCotizacionPedido } from "@/lib/email/datos-cotizacion";
import { construirHtmlCotizacion } from "@/lib/email/plantilla-cotizacion";
import { construirPdfCotizacion } from "@/lib/email/pdf-cotizacion";

const DEFAULT_FROM = "Casa de Insumos <onboarding@resend.dev>";
const DEFAULT_ADMIN_EMAIL = "guzrobert593@gmail.com";

/**
 * Envía la cotización del pedido al cliente (con el admin en copia). Nunca
 * lanza: los correos son best-effort y no deben romper el checkout ni el
 * cambio de estado del pedido si el proveedor falla o no está configurado.
 */
export async function enviarCotizacionPedido(pedidoId: string): Promise<void> {
  try {
    const datos = await obtenerDatosCotizacionPedido(pedidoId);
    if (!datos) return;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        `[email] RESEND_API_KEY no configurada: se omite el correo de cotización del pedido ${datos.codigoPedido}`
      );
      return;
    }

    const [html, pdf] = await Promise.all([
      construirHtmlCotizacion(datos),
      construirPdfCotizacion(datos),
    ]);

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      to: datos.clienteEmail,
      cc: process.env.PEDIDOS_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
      subject: `Cotización de tu pedido Nº ${datos.codigoPedido} — Casa de Insumos`,
      html,
      attachments: [
        {
          filename: `cotizacion-${datos.codigoPedido}.pdf`,
          content: pdf,
        },
      ],
    });

    if (error) {
      console.error(`[email] Resend rechazó el envío del pedido ${datos.codigoPedido}:`, error);
    }
  } catch (error) {
    console.error(`[email] Error enviando la cotización del pedido ${pedidoId}:`, error);
  }
}
