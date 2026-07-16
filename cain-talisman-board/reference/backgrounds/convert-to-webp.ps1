param(
    [string]$Path = ".",
    [int]$Quality = 75
)

$targetDir = Resolve-Path -LiteralPath $Path
$extensions = @("*.png", "*.jpg", "*.jpeg", "*.bmp", "*.tiff", "*.tif")

Get-ChildItem -LiteralPath $targetDir -File | Where-Object { $extensions -contains ("*" + $_.Extension) } | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = [System.IO.Path]::ChangeExtension($inputFile, ".webp")
    $inSize = $_.Length

    Write-Host ("Converting: " + $_.Name + " -> " + [System.IO.Path]::GetFileName($outputFile))

    & ffmpeg -y -i $inputFile -c:v libwebp -quality $Quality -preset picture $outputFile 2>&1 | Out-Null

    if (Test-Path -LiteralPath $outputFile) {
        $outSize = (Get-Item -LiteralPath $outputFile).Length
        if ($outSize -ge $inSize) {
            $inKB = [Math]::Round($inSize / 1KB)
            $outKB = [Math]::Round($outSize / 1KB)
            Write-Host ("  WebP maior que original (" + $outKB + "KB vs " + $inKB + "KB) - removido")
            Remove-Item -LiteralPath $outputFile -Force
        }
    }
}

Write-Host "Done!"
