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
      <div className="border-b border-border/60 bg-secondary px-4 py-3">
        <p className="font-heading text-base font-semibold text-primary">
          {dict.boxContentList.title} — {items.length}{" "}
          {items.length === 1 ? dict.boxContentList.itemSuffix : dict.boxContentList.itemsSuffix}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold">
              {dict.boxContentList.headerItem}
            </TableHead>
            <TableHead className="text-xs font-semibold">
              {dict.boxContentList.headerCondition}
            </TableHead>
            <TableHead className="text-right text-xs font-semibold">
              {dict.boxContentList.headerQty}
            </TableHead>
            <TableHead className="text-right text-xs font-semibold">
              {dict.boxContentList.headerPrice}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.productoId}>
              <TableCell className="text-sm">{item.nombre}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.condicion}</TableCell>
              <TableCell className="text-right text-sm font-medium">
                {item.cantidad}
              </TableCell>
              <TableCell className="text-right text-sm font-semibold text-primary">
                {formatPrice(item.precioVentaSugerido)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
