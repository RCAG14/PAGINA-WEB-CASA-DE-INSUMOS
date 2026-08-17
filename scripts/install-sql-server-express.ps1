#Requires -RunAsAdministrator
<#
  Instala SQL Server 2022 Express como instancia por defecto (puerto 1433 fijo),
  con autenticacion mixta. Pide la contrasena de "sa" de forma interactiva (nunca
  se guarda en este archivo) - debe coincidir con la que pongas en tu .env local.
  Debe ejecutarse en una consola de PowerShell ABIERTA COMO ADMINISTRADOR.
#>

$ErrorActionPreference = "Stop"

$saSecure = Read-Host -Prompt "Contrasena para el usuario 'sa' (la misma que pondras en tu .env)" -AsSecureString
$saPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($saSecure)
)
$workDir = Join-Path $env:TEMP "casa-insumos-sql-setup"
New-Item -ItemType Directory -Force -Path $workDir | Out-Null

$bootstrap = Join-Path $workDir "SQL2022-SSEI-Expr.exe"
$media = Join-Path $workDir "media"
$expectedSha256 = "36E0EC2AC3DD60F496C99CE44722C629209EA7302A2CE9CBFD1E42A73510D7B6"

$selfExtractor = Get-ChildItem -Path $media -Filter "SQLEXPR*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($selfExtractor) {
    Write-Host "1-2/5 Medios ya descargados previamente, se reutilizan: $($selfExtractor.Name)" -ForegroundColor Green
} else {
    Write-Host "1/5 Descargando instalador oficial de SQL Server 2022 Express..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://download.microsoft.com/download/5/1/4/5145fe04-4d30-4b85-b0d1-39533663a2f1/SQL2022-SSEI-Expr.exe" -OutFile $bootstrap

    $actualSha256 = (Get-FileHash -Path $bootstrap -Algorithm SHA256).Hash
    if ($actualSha256 -ne $expectedSha256) {
        throw "El SHA256 del instalador no coincide con el esperado. Descarga abortada por seguridad."
    }
    Write-Host "    Checksum verificado." -ForegroundColor Green

    Write-Host "2/5 Descargando medios completos de instalacion (puede tardar varios minutos)..." -ForegroundColor Cyan
    $download = Start-Process -FilePath $bootstrap -ArgumentList "/ACTION=Download", "/MEDIATYPE=Core", "/MEDIAPATH=$media", "/QUIET" -Wait -PassThru
    if ($download.ExitCode -ne 0) {
        throw "La descarga de medios fallo con codigo $($download.ExitCode)."
    }

    $selfExtractor = Get-ChildItem -Path $media -Filter "SQLEXPR*.exe" | Select-Object -First 1
    if (-not $selfExtractor) {
        throw "No se encontro el paquete autoextraible SQLEXPR*.exe dentro de $media"
    }
}

Write-Host "3/5 Extrayendo el paquete de instalacion..." -ForegroundColor Cyan
$extractPath = Join-Path $workDir "extracted"
$extract = Start-Process -FilePath $selfExtractor.FullName -ArgumentList "/X:$extractPath", "/Q" -Wait -PassThru
if ($extract.ExitCode -ne 0) {
    throw "La extraccion del paquete fallo con codigo $($extract.ExitCode)."
}

$setupExe = Get-ChildItem -Path $extractPath -Filter "setup.exe" -Recurse | Select-Object -First 1
if (-not $setupExe) {
    throw "No se encontro setup.exe dentro de $extractPath"
}

Write-Host "4/5 Instalando el motor de base de datos (instancia MSSQLSERVER, TCP 1433, modo mixto)..." -ForegroundColor Cyan
$currentUser = "$env:USERDOMAIN\$env:USERNAME"

$installArgs = @(
    "/Q",
    "/ACTION=Install",
    "/FEATURES=SQLEngine",
    "/INSTANCENAME=MSSQLSERVER",
    "/SECURITYMODE=SQL",
    "/SAPWD=$saPassword",
    "/SQLSYSADMINACCOUNTS=`"$currentUser`" `"BUILTIN\Administrators`"",
    "/TCPENABLED=1",
    "/IACCEPTSQLSERVERLICENSETERMS",
    "/UPDATEENABLED=0"
)

$install = Start-Process -FilePath $setupExe.FullName -ArgumentList $installArgs -Wait -PassThru
if ($install.ExitCode -ne 0) {
    Write-Host "La instalacion fallo con codigo $($install.ExitCode)." -ForegroundColor Red
    Write-Host "Revisa el log mas reciente en: C:\Program Files\Microsoft SQL Server\160\Setup Bootstrap\Log" -ForegroundColor Yellow
    throw "Instalacion de SQL Server fallida."
}

Write-Host "5/5 Verificando puerto TCP fijo y reiniciando el servicio..." -ForegroundColor Cyan
$tcpKey = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQLServer\SuperSocketNetLib\Tcp\IPAll"
if (Test-Path $tcpKey) {
    Set-ItemProperty -Path $tcpKey -Name "TcpPort" -Value "1433"
    Set-ItemProperty -Path $tcpKey -Name "TcpDynamicPorts" -Value ""
}

Restart-Service -Name "MSSQLSERVER" -Force
Start-Sleep -Seconds 5

$listening = Test-NetConnection -ComputerName localhost -Port 1433 -WarningAction SilentlyContinue
if ($listening.TcpTestSucceeded) {
    Write-Host ""
    Write-Host "Listo: SQL Server 2022 Express esta corriendo en localhost:1433" -ForegroundColor Green
    Write-Host "Usuario: sa"
    Write-Host "Usa la contrasena que ingresaste para completar DATABASE_URL en tu .env."
} else {
    Write-Host "El servicio se instalo pero el puerto 1433 no responde todavia. Reinicia la maquina y vuelve a intentar la conexion." -ForegroundColor Yellow
}
