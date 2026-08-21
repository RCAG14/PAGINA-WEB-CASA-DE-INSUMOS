import { Resend } from "resend";
import { obtenerDatosDocumentoPedido } from "@/lib/email/datos-documento-pedido";
import { construirHtmlDocumento, type TipoDocumentoPedido } from "@/lib/email/plantilla-documento-pedido";
import { construirPdfDocumento } from "@/lib/email/pdf-documento-pedido";

export type { TipoDocumentoPedido };

const DEFAULT_FROM = "Casa Insumos <onboarding@resend.dev>";

const ASUNTO: Record<TipoDocumentoPedido, string> = {
  cotizacion: "Cotización de tu pedido",
  recibo: "Recibo de compra — Pedido",
};

const NOMBRE_ARCHIVO: Record<TipoDocumentoPedido, string> = {
  cotizacion: "cotizacion",
  recibo: "recibo",
};

/**
 * Envía la cotización o el recibo de compra del pedido, exclusivamente al
 * correo del cliente (sin copia interna). Nunca lanza: los correos son
 * best-effort y no deben romper el checkout ni el cambio de estado del
 * pedido si el proveedor falla o no está configurado.
 */
export async function enviarDocumentoPedido(
  pedidoId: string,
  tipo: TipoDocumentoPedido
): Promise<void> {
  try {
    const datos = await obtenerDatosDocumentoPedido(pedidoId);
    if (!datos) return;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        `[email] RESEND_API_KEY no configurada: se omite el correo de ${tipo} del pedido ${datos.codigoPedido}`
      );
      return;
    }

    const [html, pdf] = await Promise.all([
      construirHtmlDocumento(datos, tipo),
      construirPdfDocumento(datos, tipo),
    ]);

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      to: datos.clienteEmail,
      subject: `${ASUNTO[tipo]} Nº ${datos.codigoPedido} — Casa Insumos`,
      html,
      attachments: [
        {
          filename: `${NOMBRE_ARCHIVO[tipo]}-${datos.codigoPedido}.pdf`,
          content: pdf,
        },
      ],
    });

    if (error) {
      console.error(
        `[email] Resend rechazó el envío de ${tipo} del pedido ${datos.codigoPedido}:`,
        error
      );
    }
  } catch (error) {
    console.error(`[email] Error enviando ${tipo} del pedido ${pedidoId}:`, error);
  }
}
