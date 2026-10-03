-- AlterTable
ALTER TABLE "paquetes_desarrollo" ADD COLUMN     "desglose" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "extras_desarrollo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT,
    "precio_desde" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extras_desarrollo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "extras_desarrollo_nombre_key" ON "extras_desarrollo"("nombre");
