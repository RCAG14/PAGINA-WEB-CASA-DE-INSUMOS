-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modulos_clave_key" ON "modulos"("clave");
