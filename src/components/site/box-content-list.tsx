import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import type { BoxItemSpec } from "@/lib/types";

export function BoxContentList({ items }: { items: BoxItemSpec[] }) {
  return (
    <div className="border border-border">
      <div className="border-b border-border bg-primary px-3 py-2">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
          Manifiesto técnico de contenido — {items.length} artículo
          {items.length === 1 ? "" : "s"}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              Artículo
            </TableHead>
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              Condición reportada
            </TableHead>
            <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
              Cantidad
            </TableHead>
            <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
              Precio sugerido
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productoId}>
              <TableCell className="text-sm">{item.nombre}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{item.condicion}</TableCell>
              <TableCell className="text-right font-mono-technical text-xs font-medium">
                {item.cantidad}
              </TableCell>
              <TableCell className="text-right font-mono-technical text-xs font-medium text-primary">
                {formatPrice(item.precioVentaSugerido)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
