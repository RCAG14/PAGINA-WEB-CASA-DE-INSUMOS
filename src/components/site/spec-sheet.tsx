import type { BoxSpecs } from "@/lib/types";

const ROWS: { key: keyof BoxSpecs; label: string }[] = [
  { key: "skuCaja", label: "SKU de caja" },
  { key: "manifiesto", label: "N.º de manifiesto de lote" },
  { key: "origen", label: "Origen de la mercancía" },
  { key: "centroRetorno", label: "Centro de retorno" },
  { key: "certificacionAduanera", label: "Certificación de seguridad aduanera" },
  { key: "gradoLiquidacion", label: "Grado de liquidación" },
  { key: "pesoBruto", label: "Peso bruto" },
  { key: "dimensiones", label: "Dimensiones (L x A x H)" },
];

export function SpecSheet({ specs }: { specs: BoxSpecs }) {
  return (
    <div className="border border-border">
      <div className="border-b border-border bg-primary px-3 py-2">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-primary-foreground">
          Ficha técnica y de logística internacional
        </p>
      </div>
      <dl>
        {ROWS.map((row, i) => (
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
