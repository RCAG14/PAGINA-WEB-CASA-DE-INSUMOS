BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cajas] ADD [cantidad_estimada_max] INT,
[cantidad_estimada_min] INT,
[valor_estimado_max] DECIMAL(10,2),
[valor_estimado_min] DECIMAL(10,2);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
