# ============================================================================
# run-edge-vk-test.ps1
# Запуск Microsoft Edge с чистым профилем для тестирования расширения VK
# (DOM-диагностика, см. test/vk_dom_diagnostic.js и test/REGLAMENT.md).
#
# Окружение: PowerShell 7.6.4, Windows 10.
#
# Что делает:
#   - находит msedge.exe (оба стандартных пути установки);
#   - создаёт/использует ЧИСТЫЙ профиль в папке пользователя (без чужих
#     расширений и синхронизации);
#   - при необходимости загружает ТОЛЬКО целевое распакованное расширение;
#   - запускает Edge в отдельном процессе (не блокируя терминал).
#
# Как запускать (из любой папки, где лежит скрипт):
#   cd <папка-со--скриптом>
#   .\run-edge-vk-test.ps1
# ============================================================================

# --- Параметры (можно менять под себя) ---
# Корень репозитория, где лежит manifest.json.
# Если пусто (''), расширение НЕ подхватывается автоматически — его нужно
# загрузить вручную через edge://extensions.
$ExtPath = ''

# Папка чистого профиля. Кладём в каталог пользователя — там есть права на запись.
$ProfileDir = Join-Path $HOME 'edge-vk-test'

# --- Поиск msedge.exe ---
$edgeCandidates = @(
    "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) {
    Write-Error 'Edge не найден по стандартным путям установки.'
    exit 1
}

# --- Сборка аргументов ---
$args = @(
    "--user-data-dir=$ProfileDir",
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-component-update',
    '--start-maximized'
)

if ($ExtPath -and (Test-Path $ExtPath)) {
    $args += "--load-extension=$ExtPath"
}

Write-Host "Edge:     $edge" -ForegroundColor Cyan
Write-Host "Профиль:  $ProfileDir" -ForegroundColor Cyan
if ($ExtPath -and (Test-Path $ExtPath)) {
    Write-Host "Расширение автозагрузки: $ExtPath" -ForegroundColor Cyan
}

# --- Запуск (окно браузера остаётся открытым, терминал не блокируется) ---
Start-Process -FilePath $edge -ArgumentList $args

Write-Host ''
Write-Host 'Edge запущен с чистым профилем.' -ForegroundColor Green
if (-not $ExtPath) {
    Write-Host 'Загрузите расширение вручную: edge://extensions -> Режим разработчика -> Загрузить распакованное.'
}