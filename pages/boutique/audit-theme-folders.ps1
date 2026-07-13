# ══════════════════════════════════════════════════════════════════
# audit-theme-folders.ps1
#
# À lancer depuis le dossier pages/boutique/ de ton projet Nuxt.
# Vérifie que chaque dossier de thème contient bien les fichiers
# attendus (mêmes pages que theme-epure, le thème de référence).
#
# Usage :
#   cd pages/boutique
#   powershell -ExecutionPolicy Bypass -File audit-theme-folders.ps1
# ══════════════════════════════════════════════════════════════════

$referenceTheme = "theme-epure"
$expectedFiles = @(
    "index.vue",
    "produit.vue",
    "produits.vue",
    "panier.vue",
    "a-propos.vue",
    "cgu.vue",
    "cgv.vue"
)

Write-Host "Audit des dossiers de themes" -ForegroundColor Cyan
Write-Host "Reference : $referenceTheme" -ForegroundColor Gray
Write-Host ""

$themeFolders = Get-ChildItem -Directory | Where-Object { $_.Name -like "theme-*" }

if ($themeFolders.Count -eq 0) {
    Write-Host "Aucun dossier theme-* trouve dans le repertoire courant." -ForegroundColor Red
    Write-Host "Assure-toi d'etre dans pages/boutique/" -ForegroundColor Yellow
    exit 1
}

$results = @()

foreach ($folder in $themeFolders) {
    $folderName = $folder.Name
    $missingFiles = @()
    $extraFiles = @()

    foreach ($expected in $expectedFiles) {
        $filePath = Join-Path $folder.FullName $expected
        if (-not (Test-Path $filePath)) {
            $missingFiles += $expected
        }
    }

    # Fichiers presents mais pas dans la liste attendue (ex: fichiers de backup "- Copie", "hold", etc.)
    $actualFiles = Get-ChildItem -Path $folder.FullName -Filter "*.vue" -File | Select-Object -ExpandProperty Name
    foreach ($actual in $actualFiles) {
        if ($expectedFiles -notcontains $actual) {
            $extraFiles += $actual
        }
    }

    $status = if ($missingFiles.Count -eq 0) { "OK" } else { "INCOMPLET" }

    $results += [PSCustomObject]@{
        Theme         = $folderName
        Statut        = $status
        FichiersManquants = if ($missingFiles.Count -gt 0) { $missingFiles -join ", " } else { "-" }
        FichiersSuspects  = if ($extraFiles.Count -gt 0) { $extraFiles -join ", " } else { "-" }
    }
}

$results | Format-Table -AutoSize -Wrap

Write-Host ""
Write-Host "Slugs a comparer manuellement avec la table 'themes' en base :" -ForegroundColor Cyan
foreach ($folder in $themeFolders) {
    Write-Host "  - $($folder.Name)"
}

Write-Host ""
Write-Host "Astuce : les fichiers 'FichiersSuspects' sont probablement des" -ForegroundColor Yellow
Write-Host "brouillons/backups (- Copie, hold...) a nettoyer ou ignorer." -ForegroundColor Yellow