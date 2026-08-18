import { formatPrice } from "@/lib/format";
import type { DatosCotizacionPedido } from "@/lib/email/datos-cotizacion";

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

export async function construirPdfCotizacion(data: DatosCotizacionPedido): Promise<Buffer> {
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
  doc.setTextColor(27, 58, 43);
  doc.text("CASA DE INSUMOS", margenIzq, 18);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Cotización Nº ${data.codigoPedido} · ${data.fecha}`, margenIzq, 24);

  doc.setFontSize(9);
  doc.setTextColor(166, 91, 52);
  doc.text("COTIZACIÓN — ESTE DOCUMENTO NO ES UN COMPROBANTE DE PAGO", 14, 34);
  doc.setTextColor(0);

  doc.setFontSize(11);
  doc.text(`Cliente: ${data.clienteNombre}`, 14, 44);
  doc.text(`Lugar de entrega: ${data.lugarEntrega}`, 14, 50);

  autoTable(doc, {
    startY: 58,
    head: [["Producto", "Cant.", "Precio unit.", "Subtotal"]],
    body: data.lineas.map((linea) => [
      linea.nombre,
      String(linea.cantidad),
      formatPrice(linea.precioUnitario),
      formatPrice(linea.subtotal),
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [27, 58, 43] },
  });

  const { lastAutoTable } = doc as unknown as { lastAutoTable?: { finalY: number } };
  const finalY = lastAutoTable?.finalY ?? 66;

  doc.setFontSize(13);
  doc.setTextColor(166, 91, 52);
  doc.text(`Total: ${formatPrice(data.total)}`, 14, finalY + 12);
  doc.setTextColor(0);

  if (data.whatsapp) {
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      `Para confirmar el pedido, envía el comprobante de pago por WhatsApp al ${data.whatsapp}.`,
      14,
      finalY + 22
    );
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
