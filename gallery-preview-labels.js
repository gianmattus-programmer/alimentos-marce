document.addEventListener('DOMContentLoaded', function () {
  const section = document.getElementById('galeria');
  if (!section) return;
  requestAnimationFrame(function () {
    const grid = section.querySelector('[aria-label*="Vista previa"]');
    if (!grid) return;
    const cards = Array.from(grid.children).filter(function (card) { return card.id !== 'openGallery' && card.querySelector('img'); }).slice(0, 4);
    const data = [
      ['galeria/galeria-02.avif', 'Servicio de Alimentación'],
      ['galeria/galeria-28.avif', 'Almuerzo Corporativo'],
      ['galeria/galeria-22.avif', 'Coffee Break'],
      ['galeria/galeria-18.avif', 'Menús Especiales']
    ];
    cards.forEach(function (card, index) {
      if (!data[index]) return;
      const img = card.querySelector('img');
      const label = card.querySelector('span.text-white');
      img.src = data[index][0];
      img.alt = data[index][1] + ' - Alimentos Marce';
      if (label) label.textContent = data[index][1];
    });
  });
});
