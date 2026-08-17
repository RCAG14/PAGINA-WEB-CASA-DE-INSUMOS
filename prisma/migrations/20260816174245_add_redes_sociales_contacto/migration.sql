BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[redes_sociales] (
    [id] NVARCHAR(1000) NOT NULL,
    [plataforma] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [redes_sociales_activo_df] DEFAULT 1,
    [orden] INT NOT NULL CONSTRAINT [redes_sociales_orden_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [redes_sociales_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [redes_sociales_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[numeros_contacto] (
    [id] NVARCHAR(1000) NOT NULL,
    [etiqueta] NVARCHAR(1000) NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [numeros_contacto_activo_df] DEFAULT 1,
    [orden] INT NOT NULL CONSTRAINT [numeros_contacto_orden_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [numeros_contacto_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [numeros_contacto_pkey] PRIMARY KEY CLUSTERED ([id])
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
