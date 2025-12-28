# Script para criar icones placeholder para a extensao

Add-Type -AssemblyName System.Drawing

$iconsPath = "c:\lab\extencao_navegador\dreamstime\icons"

function Create-Icon {
    param (
        [int]$size,
        [string]$outputPath
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(102, 126, 234),
        [System.Drawing.Color]::FromArgb(118, 75, 162),
        45
    )
    $graphics.FillRectangle($brush, $rect)
    
    $white = [System.Drawing.Brushes]::White
    
    $baseHeight = [int]($size * 0.4)
    $baseWidth = [int]($size * 0.3)
    $baseX = [int](($size - $baseWidth) / 2)
    $baseY = [int]($size * 0.35)
    $graphics.FillRectangle($white, $baseX, $baseY, $baseWidth, $baseHeight)
    
    $tipHeight = [int]($size * 0.25)
    $points = @(
        (New-Object System.Drawing.Point([int]($size / 2), [int]($size * 0.15))),
        (New-Object System.Drawing.Point($baseX, $baseY)),
        (New-Object System.Drawing.Point(($baseX + $baseWidth), $baseY))
    )
    $graphics.FillPolygon($white, $points)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
}

Write-Host "Criando icones..." -ForegroundColor Cyan
Create-Icon -size 16 -outputPath "$iconsPath\icon16.png"
Write-Host "OK icon16.png criado" -ForegroundColor Green

Create-Icon -size 48 -outputPath "$iconsPath\icon48.png"
Write-Host "OK icon48.png criado" -ForegroundColor Green

Create-Icon -size 128 -outputPath "$iconsPath\icon128.png"
Write-Host "OK icon128.png criado" -ForegroundColor Green

Write-Host ""
Write-Host "Todos os icones foram criados!" -ForegroundColor Green
Write-Host "Instale a extensao no Chrome/Edge agora" -ForegroundColor Yellow
