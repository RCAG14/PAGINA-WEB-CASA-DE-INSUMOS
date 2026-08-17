BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[clasificaciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000) NOT NULL,
    [icono] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [clasificaciones_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [clasificaciones_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [clasificaciones_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[productos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [precio_referencial] DECIMAL(10,2) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [productos_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [productos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[cajas] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [sku_lote] NVARCHAR(1000) NOT NULL,
    [clasificacion_id] NVARCHAR(1000) NOT NULL,
    [tipo_venta] NVARCHAR(1000) NOT NULL,
    [descripcion_corta] NVARCHAR(1000) NOT NULL,
    [descripcion_tecnica] NVARCHAR(1000) NOT NULL,
    [manifiesto] NVARCHAR(1000) NOT NULL,
    [origen] NVARCHAR(1000) NOT NULL,
    [centro_retorno] NVARCHAR(1000) NOT NULL,
    [certificacion_aduanera] NVARCHAR(1000) NOT NULL,
    [grado_liquidacion] NVARCHAR(1000) NOT NULL,
    [peso_bruto] NVARCHAR(1000) NOT NULL,
    [dimensiones] NVARCHAR(1000) NOT NULL,
    [costo_total] DECIMAL(10,2) NOT NULL,
    [precio_venta_caja] DECIMAL(10,2) NOT NULL,
    [stock_disponible] INT NOT NULL CONSTRAINT [cajas_stock_disponible_df] DEFAULT 0,
    [destacada] BIT NOT NULL CONSTRAINT [cajas_destacada_df] DEFAULT 0,
    [rating] DECIMAL(2,1) NOT NULL CONSTRAINT [cajas_rating_df] DEFAULT 0,
    [num_resenas] INT NOT NULL CONSTRAINT [cajas_num_resenas_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [cajas_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [actualizado_en] DATETIME2 NOT NULL,
    CONSTRAINT [cajas_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [cajas_slug_key] UNIQUE NONCLUSTERED ([slug]),
    CONSTRAINT [cajas_sku_lote_key] UNIQUE NONCLUSTERED ([sku_lote])
);

-- CreateTable
CREATE TABLE [dbo].[detalle_caja] (
    [id] NVARCHAR(1000) NOT NULL,
    [caja_id] NVARCHAR(1000) NOT NULL,
    [producto_id] NVARCHAR(1000) NOT NULL,
    [cantidad] INT NOT NULL,
    [condicion] NVARCHAR(1000) NOT NULL,
    [costo_asignado] DECIMAL(10,2) NOT NULL,
    [precio_venta_sugerido] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [detalle_caja_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[clientes] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000) NOT NULL,
    [direccion] NVARCHAR(1000),
    [ciudad] NVARCHAR(1000),
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [clientes_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [clientes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[pedidos] (
    [id] NVARCHAR(1000) NOT NULL,
    [codigo_pedido] NVARCHAR(1000) NOT NULL,
    [cliente_id] NVARCHAR(1000) NOT NULL,
    [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [pedidos_estado_df] DEFAULT 'Pendiente',
    [total_estimado] DECIMAL(10,2) NOT NULL,
    [fecha_creacion] DATETIME2 NOT NULL CONSTRAINT [pedidos_fecha_creacion_df] DEFAULT CURRENT_TIMESTAMP,
    [fecha_expiracion_reserva] DATETIME2 NOT NULL,
    CONSTRAINT [pedidos_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [pedidos_codigo_pedido_key] UNIQUE NONCLUSTERED ([codigo_pedido])
);

-- CreateTable
CREATE TABLE [dbo].[pedido_detalle] (
    [id] NVARCHAR(1000) NOT NULL,
    [pedido_id] NVARCHAR(1000) NOT NULL,
    [caja_id] NVARCHAR(1000) NOT NULL,
    [cantidad] INT NOT NULL,
    [precio_unitario] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [pedido_detalle_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[movimientos_inventario] (
    [id] NVARCHAR(1000) NOT NULL,
    [tipo_entidad] NVARCHAR(1000) NOT NULL,
    [entidad_id] NVARCHAR(1000) NOT NULL,
    [cantidad_cambio] INT NOT NULL,
    [motivo] NVARCHAR(1000) NOT NULL,
    [fecha] DATETIME2 NOT NULL CONSTRAINT [movimientos_inventario_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [movimientos_inventario_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[cajas] ADD CONSTRAINT [cajas_clasificacion_id_fkey] FOREIGN KEY ([clasificacion_id]) REFERENCES [dbo].[clasificaciones]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[detalle_caja] ADD CONSTRAINT [detalle_caja_caja_id_fkey] FOREIGN KEY ([caja_id]) REFERENCES [dbo].[cajas]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[detalle_caja] ADD CONSTRAINT [detalle_caja_producto_id_fkey] FOREIGN KEY ([producto_id]) REFERENCES [dbo].[productos]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pedidos] ADD CONSTRAINT [pedidos_cliente_id_fkey] FOREIGN KEY ([cliente_id]) REFERENCES [dbo].[clientes]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pedido_detalle] ADD CONSTRAINT [pedido_detalle_pedido_id_fkey] FOREIGN KEY ([pedido_id]) REFERENCES [dbo].[pedidos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[pedido_detalle] ADD CONSTRAINT [pedido_detalle_caja_id_fkey] FOREIGN KEY ([caja_id]) REFERENCES [dbo].[cajas]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
