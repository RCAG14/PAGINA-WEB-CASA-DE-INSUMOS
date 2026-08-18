-- CreateTable
CREATE TABLE "paquetes_desarrollo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "features" TEXT[],
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paquetes_desarrollo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajos_realizados" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen_url" TEXT,
    "imagen_path" TEXT,
    "enlace" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trabajos_realizados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paquetes_desarrollo_nombre_key" ON "paquetes_desarrollo"("nombre");
