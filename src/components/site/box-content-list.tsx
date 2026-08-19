import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/locale";
import type { BoxItemSpec } from "@/lib/types";

export async function BoxContentList({ items }: { items: BoxItemSpec[] }) {
  const { dict } = await getDictionary();

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 shadow-elevation-sm">
      <div className="border-b border-border bg-sidebar px-3 py-2">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-sidebar-foreground">
          {dict.boxContentList.title} — {items.length}{" "}
          {items.length === 1 ? dict.boxContentList.itemSuffix : dict.boxContentList.itemsSuffix}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              {dict.boxContentList.headerItem}
            </TableHead>
            <TableHead className="font-mono-technical text-[10px] uppercase tracking-wider">
              {dict.boxContentList.headerCondition}
            </TableHead>
            <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
              {dict.boxContentList.headerQty}
            </TableHead>
            <TableHead className="text-right font-mono-technical text-[10px] uppercase tracking-wider">
              {dict.boxContentList.headerPrice}
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
