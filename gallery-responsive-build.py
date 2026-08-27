from pathlib import Path
import re

p = Path('gallery-viewer.js')
s = p.read_text(encoding='utf-8')

s, item_count = re.subn(
    r"\{ src: 'galeria/galeria-(\d{2})\.avif', caption:",
    r"{ mobile: 'galeria/mobile/galeria-\1.avif', desktop: 'galeria/desktop/galeria-\1.avif', caption:",
    s,
)
s, preview_count = re.subn(
    r"\{ src: 'galeria/galeria-(\d{2})\.avif', label:",
    r"{ mobile: 'galeria/mobile/galeria-\1.avif', desktop: 'galeria/desktop/galeria-\1.avif', label:",
    s,
)
if item_count != 26 or preview_count != 4:
    raise SystemExit(f'Conteo inesperado al convertir fuentes: items={item_count}, preview={preview_count}')

responsive = """  const desktopMedia = window.matchMedia('(min-width: 768px)');
  const sourceFor = (item) => desktopMedia.matches ? item.desktop : item.mobile;

  function applyResponsiveSource(img, item) {
    if (!img || !item) return;
    img.dataset.marceMobile = item.mobile;
    img.dataset.marceDesktop = item.desktop;
    img.src = sourceFor(item);
  }

  function refreshResponsiveImages() {
    document.querySelectorAll('img[data-marce-mobile][data-marce-desktop]').forEach((img) => {
      img.src = desktopMedia.matches ? img.dataset.marceDesktop : img.dataset.marceMobile;
    });
  }"""

s, normalize_count = re.subn(
    r"  const normalize = \(value\) => String\(value \|\| ''\)\.split\('\?'\)\[0\]\.replace\(/\^\.\*\?\(galeria\\/\)/, '\$1'\);",
    responsive,
    s,
    count=1,
)
if normalize_count != 1:
    raise SystemExit('No se pudo reemplazar normalize por el selector responsive')

replacements = [
    ('viewerImage.src = item.src;', 'viewerImage.src = sourceFor(item);'),
    ('next.src = ITEMS[(currentIndex + 1) % ITEMS.length].src;', 'next.src = sourceFor(ITEMS[(currentIndex + 1) % ITEMS.length]);'),
    ('prev.src = ITEMS[(currentIndex - 1 + ITEMS.length) % ITEMS.length].src;', 'prev.src = sourceFor(ITEMS[(currentIndex - 1 + ITEMS.length) % ITEMS.length]);'),
    ('button.addEventListener(\'click\', () => openViewer(item.src, button));', 'button.addEventListener(\'click\', () => openViewer(index, button));'),
    ('const launch = () => openViewer(item.src, card);', "const galleryIndex = ITEMS.findIndex((galleryItem) => galleryItem.mobile === item.mobile);\n      const launch = () => openViewer(galleryIndex, card);"),
    ("if (bg) bg.src = 'galeria/galeria-08.avif';", "if (bg) applyResponsiveSource(bg, { mobile: 'galeria/mobile/galeria-08.avif', desktop: 'galeria/desktop/galeria-08.avif' });"),
    ('width: min(94vw, 1500px);', 'width: min(94vw, 1152px);'),
]
for old, new in replacements:
    if old not in s:
        raise SystemExit('No se encontró reemplazo esperado: ' + old[:90])
    s = s.replace(old, new, 1)

if s.count('img.src = item.src;') != 2:
    raise SystemExit(f'Se esperaban 2 asignaciones de miniaturas; encontradas: {s.count("img.src = item.src;")}')
s = s.replace('img.src = item.src;', 'applyResponsiveSource(img, item);')

open_pattern = re.compile(
    r"    function openViewer\(src, trigger\) \{\n"
    r"      const index = ITEMS\.findIndex\(\(item\) => normalize\(item\.src\) === normalize\(src\)\);\n"
    r"      if \(index < 0\) return;"
)
s, open_count = open_pattern.subn(
    "    function openViewer(index, trigger) {\n      if (!Number.isInteger(index) || index < 0 || index >= ITEMS.length) return;",
    s,
    count=1,
)
if open_count != 1:
    raise SystemExit('No se pudo convertir openViewer a navegación por índice')

keyboard_marker = """    document.addEventListener('keydown', (event) => {
      if (viewer.hidden) return;
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') render(currentIndex - 1);
      if (event.key === 'ArrowRight') render(currentIndex + 1);
    });"""
keyboard_replacement = keyboard_marker + """

    const handleSourceChange = () => {
      refreshResponsiveImages();
      if (!viewer.hidden) render(currentIndex);
    };
    if (desktopMedia.addEventListener) desktopMedia.addEventListener('change', handleSourceChange);
    else if (desktopMedia.addListener) desktopMedia.addListener(handleSourceChange);"""
if keyboard_marker not in s:
    raise SystemExit('No se encontró el listener de teclado para insertar el cambio responsive')
s = s.replace(keyboard_marker, keyboard_replacement, 1)

if 'item.src' in s:
    raise SystemExit('Todavía quedan referencias item.src en gallery-viewer.js')
if 'galeria/galeria-' in s:
    lines = [line.strip() for line in s.splitlines() if 'galeria/galeria-' in line]
    raise SystemExit('Todavía quedan rutas antiguas: ' + ' | '.join(lines[:5]))

p.write_text(s, encoding='utf-8')
print('gallery-viewer.js actualizado a fuentes desktop/mobile')
