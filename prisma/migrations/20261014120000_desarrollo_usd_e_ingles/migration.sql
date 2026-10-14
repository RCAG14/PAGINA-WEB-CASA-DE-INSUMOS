-- Desarrollo web pasa a ser un servicio global: precios en dólares (USD) y
-- traducción al inglés del contenido administrable. Las cajas siguen en Bs.

-- AlterTable
ALTER TABLE "paquetes_desarrollo" ADD COLUMN     "nombre_en" TEXT,
ADD COLUMN     "tagline_en" TEXT,
ADD COLUMN     "features_en" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "extras_desarrollo" ADD COLUMN     "nombre_en" TEXT,
ADD COLUMN     "motivo_en" TEXT,
ADD COLUMN     "unidad_en" TEXT;

-- AlterTable
ALTER TABLE "trabajos_realizados" ADD COLUMN     "titulo_en" TEXT,
ADD COLUMN     "categoria_en" TEXT,
ADD COLUMN     "descripcion_en" TEXT;

-- CreateTable
CREATE TABLE "ajustes" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ajustes_pkey" PRIMARY KEY ("clave")
);

-- Tipo de cambio oficial de referencia; se edita desde /admin/desarrollo-web.
INSERT INTO "ajustes" ("clave", "valor", "actualizado_en")
VALUES ('tipo_cambio_usd_bob', '6.96', CURRENT_TIMESTAMP);

-- Conversión de los montos existentes de Bs a USD (Bs / 6.96, a dólares
-- enteros). Si el desglose de un paquete sumaba exactamente su precio, el
-- precio nuevo es la suma de los conceptos ya convertidos, para que el
-- "Total" del detalle siga cuadrando pese al redondeo.
UPDATE "paquetes_desarrollo" p
SET
  "precio" = CASE
    WHEN jsonb_array_length(p."desglose") > 0
      AND (
        SELECT COALESCE(SUM((e->>'monto')::numeric), 0)
        FROM jsonb_array_elements(p."desglose") e
        WHERE jsonb_typeof(e->'monto') = 'number'
      ) = p."precio"
    THEN (
      SELECT COALESCE(SUM(ROUND((e->>'monto')::numeric / 6.96)), 0)
      FROM jsonb_array_elements(p."desglose") e
      WHERE jsonb_typeof(e->'monto') = 'number'
    )
    ELSE ROUND(p."precio" / 6.96)
  END,
  "mantenimiento_mensual" = ROUND(p."mantenimiento_mensual" / 6.96),
  "desglose" = COALESCE(
    (
      SELECT jsonb_agg(
        CASE
          WHEN jsonb_typeof(e->'monto') = 'number'
          THEN jsonb_set(e, '{monto}', to_jsonb(ROUND((e->>'monto')::numeric / 6.96)))
          ELSE e
        END
        ORDER BY ord
      )
      FROM jsonb_array_elements(p."desglose") WITH ORDINALITY AS t(e, ord)
    ),
    '[]'::jsonb
  );

UPDATE "extras_desarrollo" SET "precio" = ROUND("precio" / 6.96);
