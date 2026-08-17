-- CreateTable
CREATE TABLE "clasificaciones" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "icono" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clasificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio_referencial" DECIMAL(10,2) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku_lote" TEXT NOT NULL,
    "clasificacion_id" TEXT NOT NULL,
    "tipo_venta" TEXT NOT NULL,
    "descripcion_corta" TEXT NOT NULL,
    "descripcion_tecnica" TEXT NOT NULL,
    "manifiesto" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "centro_retorno" TEXT NOT NULL,
    "certificacion_aduanera" TEXT NOT NULL,
    "grado_liquidacion" TEXT NOT NULL,
    "peso_bruto" TEXT NOT NULL,
    "dimensiones" TEXT NOT NULL,
    "costo_total" DECIMAL(10,2) NOT NULL,
    "precio_venta_caja" DECIMAL(10,2) NOT NULL,
    "stock_disponible" INTEGER NOT NULL DEFAULT 0,
    "cantidad_estimada_min" INTEGER,
    "cantidad_estimada_max" INTEGER,
    "valor_estimado_min" DECIMAL(10,2),
    "valor_estimado_max" DECIMAL(10,2),
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "num_resenas" INTEGER NOT NULL DEFAULT 0,
    "imagen_url" TEXT,
    "imagen_path" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_caja" (
    "id" TEXT NOT NULL,
    "caja_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "condicion" TEXT NOT NULL,
    "costo_asignado" DECIMAL(10,2) NOT NULL,
    "precio_venta_sugerido" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_visita" (
    "id" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metricas_visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "codigo_pedido" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "total_estimado" DECIMAL(10,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion_reserva" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_detalle" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "caja_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedido_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" TEXT NOT NULL,
    "tipo_entidad" TEXT NOT NULL,
    "entidad_id" TEXT NOT NULL,
    "cantidad_cambio" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redes_sociales" (
    "id" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "numeros_contacto" (
    "id" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "numeros_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenido_landing" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "enlace_cta" TEXT,
    "texto_cta" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contenido_landing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clasificaciones_slug_key" ON "clasificaciones"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cajas_slug_key" ON "cajas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cajas_sku_lote_key" ON "cajas"("sku_lote");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_codigo_pedido_key" ON "pedidos"("codigo_pedido");

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_clasificacion_id_fkey" FOREIGN KEY ("clasificacion_id") REFERENCES "clasificaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_caja" ADD CONSTRAINT "detalle_caja_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_caja" ADD CONSTRAINT "detalle_caja_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_detalle" ADD CONSTRAINT "pedido_detalle_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_detalle" ADD CONSTRAINT "pedido_detalle_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
