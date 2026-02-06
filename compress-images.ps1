param(
    [string]$Source = "H:\Justforfun\skipedityoutubepage_main\frame_output",
    [string]$Destination = "H:\Justforfun\skipedityoutubepage_main\frame_output_webp",
    [int]$Quality = 75
)

if (!(Test-Path $Source)) {
    Write-Error "Source path not found: $Source"
    exit 1
}

if (!(Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

$files = Get-ChildItem -Path $Source -Recurse -File -Include *.png,*.jpg,*.jpeg
$total = $files.Count
$index = 0

foreach ($file in $files) {
    $index++
    $rel = $file.FullName.Substring($Source.Length).TrimStart('\')
    $out = Join-Path $Destination ([IO.Path]::ChangeExtension($rel, ".webp"))
    if (Test-Path $out) {
        continue
    }
    $outDir = Split-Path $out -Parent
    if (!(Test-Path $outDir)) {
        New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    }

    Write-Progress -Activity "Compressing images" -Status "$index / $total" -PercentComplete (($index / $total) * 100)
    & ffmpeg -hide_banner -loglevel error -y -i $file.FullName -c:v libwebp -q:v $Quality -compression_level 6 $out | Out-Null
}

Write-Host "Done. Output: $Destination"
