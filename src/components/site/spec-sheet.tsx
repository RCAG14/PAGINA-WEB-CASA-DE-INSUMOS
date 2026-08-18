import { getDictionary } from "@/lib/i18n/locale";
import type { BoxSpecs } from "@/lib/types";

const ROW_KEYS: (keyof BoxSpecs)[] = [
  "skuCaja",
  "manifiesto",
  "origen",
  "centroRetorno",
  "certificacionAduanera",
  "gradoLiquidacion",
  "pesoBruto",
  "dimensiones",
];

export async function SpecSheet({ specs }: { specs: BoxSpecs }) {
  const { dict } = await getDictionary();
  const rows = ROW_KEYS.map((key) => ({ key, label: dict.specSheet.rows[key] }));

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-primary px-3 py-2">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
          {dict.specSheet.title}
        </p>
      </div>
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={`flex items-center justify-between gap-4 px-3 py-2.5 ${
              i % 2 === 1 ? "bg-muted/50" : ""
            }`}
          >
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-mono-technical text-xs font-medium text-foreground">
              {specs[row.key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
