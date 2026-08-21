"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { ProductoMasVendido } from "@/lib/data/metricas";

export interface ReporteSocioData {
  totalVentas: number;
  cantidadPedidos: number;
  usuariosRegistrados: number;
  visitasTotal: number;
  visitas30Dias: number;
  productos: ProductoMasVendido[];
}

export function DescargarReportePdfButton({ data }: { data: ReporteSocioData }) {
  const [pending, setPending] = useState(false);

  async function handleDownload() {
    setPending(true);
    try {
      const [{ default: JsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new JsPDF();

      doc.setFontSize(16);
      doc.text("Casa Insumos — Reporte de Socio", 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Generado: ${new Date().toLocaleString("es-BO")}`, 14, 24);
      doc.setTextColor(0);

      autoTable(doc, {
        startY: 30,
        head: [["Métrica", "Valor"]],
        body: [
          ["Ventas totales (Bs)", formatPrice(data.totalVentas)],
          ["Pedidos registrados", String(data.cantidadPedidos)],
          ["Usuarios registrados (clientes)", String(data.usuariosRegistrados)],
          ["Visitas totales estimadas", String(data.visitasTotal)],
          ["Visitas últimos 30 días", String(data.visitas30Dias)],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [27, 67, 50] },
      });

      const { lastAutoTable } = doc as unknown as { lastAutoTable?: { finalY: number } };
      const finalY = lastAutoTable?.finalY ?? 40;

      doc.setFontSize(12);
      doc.text("Cajas más compradas", 14, finalY + 12);

      autoTable(doc, {
        startY: finalY + 16,
        head: [["Caja", "SKU", "Unidades vendidas", "Ingreso (Bs)"]],
        body:
          data.productos.length > 0
            ? data.productos.map((p) => [
                p.nombre,
                p.skuLote,
                String(p.unidadesVendidas),
                formatPrice(p.ingresoGenerado),
              ])
            : [["Sin ventas registradas todavía", "—", "—", "—"]],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [27, 67, 50] },
      });

      doc.save(`reporte-casa-de-insumos-${Date.now()}.pdf`);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button onClick={handleDownload} disabled={pending}>
      <FileDown className="size-4" />
      {pending ? "Generando..." : "Descargar Reporte PDF"}
    </Button>
  );
}
