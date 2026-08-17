BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cajas] ADD [imagen_public_id] NVARCHAR(1000),
[imagen_url] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[contenido_landing] (
    [id] NVARCHAR(1000) NOT NULL,
    [tipo] NVARCHAR(1000) NOT NULL,
    [formato] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [cloudinary_public_id] NVARCHAR(1000) NOT NULL,
    [titulo] NVARCHAR(1000),
    [subtitulo] NVARCHAR(1000),
    [enlace_cta] NVARCHAR(1000),
    [texto_cta] NVARCHAR(1000),
    [activo] BIT NOT NULL CONSTRAINT [contenido_landing_activo_df] DEFAULT 1,
    [orden] INT NOT NULL CONSTRAINT [contenido_landing_orden_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [contenido_landing_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [actualizado_en] DATETIME2 NOT NULL,
    CONSTRAINT [contenido_landing_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
