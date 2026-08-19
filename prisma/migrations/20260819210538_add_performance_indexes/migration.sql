-- CreateIndex
CREATE INDEX IF NOT EXISTS "cajas_clasificacion_id_idx" ON "cajas"("clasificacion_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "cajas_stock_disponible_idx" ON "cajas"("stock_disponible");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "cajas_creado_en_idx" ON "cajas"("creado_en");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "detalle_caja_caja_id_idx" ON "detalle_caja"("caja_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "detalle_caja_producto_id_idx" ON "detalle_caja"("producto_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "clientes_creado_en_idx" ON "clientes"("creado_en");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "metricas_visita_creado_en_idx" ON "metricas_visita"("creado_en");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedidos_cliente_id_idx" ON "pedidos"("cliente_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedidos_fecha_creacion_idx" ON "pedidos"("fecha_creacion");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedido_detalle_pedido_id_idx" ON "pedido_detalle"("pedido_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedido_detalle_caja_id_idx" ON "pedido_detalle"("caja_id");
