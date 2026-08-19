-- AlterTable
ALTER TABLE "cajas" ALTER COLUMN "manifiesto" DROP NOT NULL,
ALTER COLUMN "origen" DROP NOT NULL,
ALTER COLUMN "centro_retorno" DROP NOT NULL,
ALTER COLUMN "certificacion_aduanera" DROP NOT NULL,
ALTER COLUMN "grado_liquidacion" DROP NOT NULL,
ALTER COLUMN "peso_bruto" DROP NOT NULL,
ALTER COLUMN "dimensiones" DROP NOT NULL;

-- CreateTable
CREATE TABLE "imagenes_referencia_caja" (
    "id" TEXT NOT NULL,
    "caja_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "imagenes_referencia_caja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "imagenes_referencia_caja_caja_id_idx" ON "imagenes_referencia_caja"("caja_id");

-- AddForeignKey
ALTER TABLE "imagenes_referencia_caja" ADD CONSTRAINT "imagenes_referencia_caja_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
