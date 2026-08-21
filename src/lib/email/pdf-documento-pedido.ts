import { formatPrice } from "@/lib/format";
import type { DatosDocumentoPedido } from "@/lib/email/datos-documento-pedido";
import type { TipoDocumentoPedido } from "@/lib/email/plantilla-documento-pedido";

const EMPRESA_DIRECCION = "Calle Calatayud, La Paz, Bolivia";
const EMPRESA_TELEFONO = "64047012";

const VERDE_MARCA: [number, number, number] = [30, 58, 47]; // #1E3A2F
const DORADO_MARCA: [number, number, number] = [140, 109, 70]; // #8C6D46

const TITULO: Record<TipoDocumentoPedido, string> = {
  cotizacion: "COTIZACIÓN",
  recibo: "RECIBO DE COMPRA",
};

const NOTA_LEGAL: Record<TipoDocumentoPedido, string> = {
  cotizacion:
    "Nota: Este documento es únicamente una cotización informativa y no constituye un recibo ni comprobante oficial de pago.",
  recibo: "Comprobante de compra entregada y pagada con éxito. ¡Gracias por su preferencia!",
};

async function obtenerLogoParaPdf(
  logoUrl: string | null
): Promise<{ dataUrl: string; formato: "PNG" | "JPEG" } | null> {
  if (!logoUrl) return null;
  try {
    const res = await fetch(logoUrl);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    const formato = contentType.includes("png")
      ? "PNG"
      : contentType.includes("jpeg") || contentType.includes("jpg")
        ? "JPEG"
        : null;
    if (!formato) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return { dataUrl: `data:${contentType};base64,${buffer.toString("base64")}`, formato };
  } catch {
    return null;
  }
}

export async function construirPdfDocumento(
  data: DatosDocumentoPedido,
  tipo: TipoDocumentoPedido
): Promise<Buffer> {
  const [{ jsPDF }, { default: autoTable }, logo] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    obtenerLogoParaPdf(data.logoUrl),
  ]);

  const doc = new jsPDF();
  const margenIzq = logo ? 36 : 14;

  if (logo) {
    doc.addImage(logo.dataUrl, logo.formato, 14, 10, 18, 18);
  }

  doc.setFontSize(16);
  doc.setTextColor(...VERDE_MARCA);
  doc.text("CASA INSUMOS", margenIzq, 18);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`${EMPRESA_DIRECCION} · Tel: ${EMPRESA_TELEFONO}`, margenIzq, 24);

  doc.setFontSize(13);
  doc.setTextColor(...DORADO_MARCA);
  doc.text(TITULO[tipo], 14, 36);
  doc.setTextColor(0);

  doc.setFontSize(10);
  doc.text(`Nº Pedido: ${data.codigoPedido}`, 14, 46);
  doc.text(`Cliente: ${data.clienteNombre}`, 14, 52);
  doc.text(`Correo: ${data.clienteEmail}`, 14, 58);
  doc.text(`Dirección de entrega: ${data.lugarEntrega}`, 14, 64);
  doc.text(`Fecha: ${data.fecha}`, 14, 70);

  autoTable(doc, {
    startY: 78,
    head: [["Nº", "Descripción", "Cantidad", "Precio unit.", "Subtotal"]],
    body: data.lineas.map((linea, i) => [
      String(i + 1),
      linea.nombre,
      String(linea.cantidad),
      formatPrice(linea.precioUnitario),
      formatPrice(linea.subtotal),
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: VERDE_MARCA },
  });

  const { lastAutoTable } = doc as unknown as { lastAutoTable?: { finalY: number } };
  const finalY = lastAutoTable?.finalY ?? 86;

  doc.setFontSize(13);
  doc.setTextColor(...DORADO_MARCA);
  doc.text(`Total: ${formatPrice(data.total)}`, 14, finalY + 12);
  doc.setTextColor(0);

  doc.setFontSize(9);
  doc.setTextColor(120);
  const notaLineas = doc.splitTextToSize(NOTA_LEGAL[tipo], 180);
  doc.text(notaLineas, 14, finalY + 22);

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
