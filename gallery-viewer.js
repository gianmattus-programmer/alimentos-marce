(function () {
  'use strict';

  const ITEMS = [
    { src: 'galeria/galeria-01.avif', caption: 'Un menú servido con equilibrio, sabor y una presentación cuidada para cada jornada.' },
    { src: 'galeria/galeria-02.avif', caption: 'Coordinamos cada plato para que el servicio sea ordenado, uniforme y listo a tiempo.' },
    { src: 'galeria/galeria-03.avif', caption: 'Un toque dulce para cerrar el servicio y acompañar celebraciones especiales.' },
    { src: 'galeria/galeria-04.avif', caption: 'Montajes pensados para compartir, conversar y disfrutar en equipo.' },
    { src: 'galeria/galeria-06.avif', caption: 'Menús completos que combinan variedad, porción y una presentación práctica.' },
    { src: 'galeria/galeria-07.avif', caption: 'Opciones frescas y coloridas que suman variedad a la propuesta gastronómica.' },
    { src: 'galeria/galeria-08.avif', caption: 'Bocaditos preparados para reuniones donde cada detalle suma.' },
    { src: 'galeria/galeria-09.avif', caption: 'Variedad de sabores y texturas para compartir en pausas, reuniones y celebraciones.' },
    { src: 'galeria/galeria-11.avif', caption: 'Presentaciones que se adaptan al estilo y la ocasión de cada evento.' },
    { src: 'galeria/galeria-14.avif', caption: 'Preparación cuidadosa y ordenada en cada etapa antes de llegar a la mesa.' },
    { src: 'galeria/galeria-15.avif', caption: 'Sabores caseros y porciones completas para una alimentación reconfortante.' },
    { src: 'galeria/galeria-16.avif', caption: 'También acompañamos fechas especiales con detalles preparados para celebrar.' },
    { src: 'galeria/galeria-17.avif', caption: 'Variedad de postres para terminar cada servicio con un toque dulce.' },
    { src: 'galeria/galeria-18.avif', caption: 'Sabores peruanos presentados con dedicación y personalidad.' },
    { src: 'galeria/galeria-19.avif', caption: 'Bebidas y acompañamientos listos para recibir a tus invitados.' },
    { src: 'galeria/galeria-20.avif', caption: 'Preparaciones abundantes y sabrosas para almuerzos que reúnen al equipo.' },
    { src: 'galeria/galeria-21.avif', caption: 'Platos servidos con equilibrio entre sabor, presentación y variedad.' },
    { src: 'galeria/galeria-22.avif', caption: 'Estaciones de bebidas prácticas y ordenadas para reuniones corporativas.' },
    { src: 'galeria/galeria-23.avif', caption: 'Bocaditos frescos y variados para compartir de forma práctica.' },
    { src: 'galeria/galeria-24.avif', caption: 'Nuestro equipo prepara cada ración con cuidado y atención al detalle.' },
    { src: 'galeria/galeria-25.avif', caption: 'Bocaditos listos para servir, preparados con orden y dedicación.' },
    { src: 'galeria/galeria-27.avif', caption: 'La organización previa permite que cada servicio fluya de forma eficiente.' },
    { src: 'galeria/galeria-28.avif', caption: 'Menús porcionados y listos para una entrega práctica y organizada.' },
    { src: 'galeria/galeria-29.avif', caption: 'Una propuesta completa que combina frescura, sabor y variedad.' },
    { src: 'galeria/galeria-30.avif', caption: 'Mesas dulces que aportan un detalle especial a encuentros y celebraciones.' },
    { src: 'galeria/galeria-31.avif', caption: 'Atención cercana y una presentación preparada para recibir a cada invitado.' }
  ];

  const PREVIEW = [
    { src: 'galeria/galeria-01.avif', label: 'Menú Ejecutivo' },
    { src: 'galeria/galeria-07.avif', label: 'Línea Saludable' },
    { src: 'galeria/galeria-11.avif', label: 'Coffee Break' },
    { src: 'galeria/galeria-30.avif', label: 'Eventos Especiales y Almuerzos de Confraternidad' }
  ];

  const normalize = (value) => String(value || '').split('?')[0].replace(/^.*?(galeria\/)/, '$1');

  function init() {
    const gallerySection = document.getElementById('galeria');
    const galleryModal = document.getElementById('galleryModal');
    if (!gallerySection || !galleryModal) return;

    installStyles();
    const viewer = buildViewer();
    const viewerImage = viewer.querySelector('[data-viewer-image]');
    const viewerCaption = viewer.querySelector('[data-viewer-caption]');
    const viewerCounter = viewer.querySelector('[data-viewer-counter]');
    const viewerMedia = viewer.querySelector('[data-viewer-media]');
    let currentIndex = 0;
    let lastTrigger = null;
    let touchStartX = null;

    function render(index) {
      currentIndex = (index + ITEMS.length) % ITEMS.length;
      const item = ITEMS[currentIndex];
      viewer.classList.add('is-loading');
      viewerImage.alt = item.caption;
      viewerCaption.textContent = item.caption;
      viewerCounter.textContent = `${currentIndex + 1} / ${ITEMS.length}`;
      viewerImage.onload = () => viewer.classList.remove('is-loading');
      viewerImage.onerror = () => viewer.classList.remove('is-loading');
      viewerImage.src = item.src;

      const next = new Image();
      next.src = ITEMS[(currentIndex + 1) % ITEMS.length].src;
      const prev = new Image();
      prev.src = ITEMS[(currentIndex - 1 + ITEMS.length) % ITEMS.length].src;
    }

    function openViewer(src, trigger) {
      const index = ITEMS.findIndex((item) => normalize(item.src) === normalize(src));
      if (index < 0) return;
      lastTrigger = trigger || document.activeElement;
      render(index);
      viewer.hidden = false;
      requestAnimationFrame(() => viewer.classList.add('is-open'));
      document.body.classList.add('marce-viewer-open');
      viewer.querySelector('[data-viewer-close]').focus({ preventScroll: true });
    }

    function closeViewer() {
      viewer.classList.remove('is-open');
      setTimeout(() => {
        viewer.hidden = true;
        viewerImage.removeAttribute('src');
        if (galleryModal.classList.contains('hidden')) document.body.classList.remove('marce-viewer-open');
        if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus({ preventScroll: true });
      }, 180);
    }

    viewer.querySelector('[data-viewer-prev]').addEventListener('click', (event) => {
      event.stopPropagation();
      render(currentIndex - 1);
    });
    viewer.querySelector('[data-viewer-next]').addEventListener('click', (event) => {
      event.stopPropagation();
      render(currentIndex + 1);
    });
    viewer.querySelector('[data-viewer-close]').addEventListener('click', closeViewer);
    viewer.querySelector('[data-viewer-backdrop]').addEventListener('click', closeViewer);
    viewer.querySelector('.marce-viewer-dialog').addEventListener('click', (event) => event.stopPropagation());

    viewerMedia.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0] ? event.changedTouches[0].clientX : null;
    }, { passive: true });
    viewerMedia.addEventListener('touchend', (event) => {
      if (touchStartX === null || !event.changedTouches[0]) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) < 45) return;
      render(delta < 0 ? currentIndex + 1 : currentIndex - 1);
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (viewer.hidden) return;
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') render(currentIndex - 1);
      if (event.key === 'ArrowRight') render(currentIndex + 1);
    });

    rebuildModalGrid(galleryModal, openViewer);
    updatePreview(gallerySection, openViewer);
    updateCount(gallerySection, galleryModal);
  }

  function rebuildModalGrid(modal, openViewer) {
    const grid = modal.querySelector('.grid.grid-cols-2, .grid[class*="grid-cols-2"]');
    if (!grid) return;
    grid.innerHTML = '';

    ITEMS.forEach((item, index) => {
      const figure = document.createElement('figure');
      figure.className = 'marce-gallery-thumb group overflow-hidden rounded-2xl bg-white shadow-sm';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'block w-full h-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-marce-orange/40 rounded-2xl';
      button.setAttribute('aria-label', `Abrir imagen ${index + 1} de ${ITEMS.length}: ${item.caption}`);
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption;
      img.className = 'aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105';
      img.loading = 'lazy';
      img.decoding = 'async';
      button.appendChild(img);
      figure.appendChild(button);
      grid.appendChild(figure);
      button.addEventListener('click', () => openViewer(item.src, button));
    });
  }

  function updatePreview(section, openViewer) {
    const previewGrid = section.querySelector('[aria-label*="Vista previa"]');
    if (!previewGrid) return;
    const children = Array.from(previewGrid.children);
    const visualCards = children.filter((child) => child.id !== 'openGallery' && child.querySelector('img')).slice(0, 4);

    visualCards.forEach((card, index) => {
      const item = PREVIEW[index];
      if (!item) return;
      const img = card.querySelector('img');
      const label = card.querySelector('span.text-white');
      img.src = item.src;
      img.alt = item.label + ' - Alimentos Marce';
      if (label) label.textContent = item.label;
      card.classList.add('marce-preview-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver ${item.label} en grande`);
      const launch = () => openViewer(item.src, card);
      card.addEventListener('click', launch);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          launch();
        }
      });
    });

    const openAll = document.getElementById('openGallery');
    if (openAll) {
      const bg = openAll.querySelector('img');
      if (bg) bg.src = 'galeria/galeria-08.avif';
      openAll.setAttribute('aria-label', `Abrir galería completa de ${ITEMS.length} imágenes`);
    }
  }

  function updateCount(section, modal) {
    [section, modal].forEach((root) => {
      if (!root) return;
      root.querySelectorAll('span, p, button').forEach((node) => {
        if (/^\s*\d+\s+imágenes\s*$/i.test(node.textContent || '')) node.textContent = `${ITEMS.length} imágenes`;
      });
    });
  }

  function buildViewer() {
    let viewer = document.getElementById('marceImageViewer');
    if (viewer) return viewer;
    viewer = document.createElement('div');
    viewer.id = 'marceImageViewer';
    viewer.className = 'marce-viewer';
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Visor de imágenes de Alimentos Marce');
    viewer.innerHTML = `
      <div class="marce-viewer-backdrop" data-viewer-backdrop></div>
      <div class="marce-viewer-dialog">
        <button type="button" class="marce-viewer-close" data-viewer-close aria-label="Cerrar imagen"><i class="fas fa-times" aria-hidden="true"></i></button>
        <button type="button" class="marce-viewer-nav marce-viewer-prev" data-viewer-prev aria-label="Imagen anterior"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
        <div class="marce-viewer-stage" data-viewer-media>
          <img data-viewer-image alt="">
        </div>
        <button type="button" class="marce-viewer-nav marce-viewer-next" data-viewer-next aria-label="Imagen siguiente"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
        <div class="marce-viewer-copy">
          <p data-viewer-caption></p>
          <span data-viewer-counter></span>
        </div>
      </div>`;
    document.body.appendChild(viewer);
    return viewer;
  }

  function installStyles() {
    if (document.getElementById('marce-gallery-viewer-styles')) return;
    const style = document.createElement('style');
    style.id = 'marce-gallery-viewer-styles';
    style.textContent = `
      .marce-preview-clickable { cursor: zoom-in; }
      .marce-gallery-thumb button { cursor: zoom-in; }
      .marce-viewer[hidden] { display: none !important; }
      .marce-viewer { position: fixed; inset: 0; z-index: 140; display: grid; place-items: center; padding: 18px; opacity: 0; transition: opacity .18s ease; }
      .marce-viewer.is-open { opacity: 1; }
      .marce-viewer-backdrop { position: absolute; inset: 0; background: rgba(12, 6, 2, .94); backdrop-filter: blur(8px); }
      .marce-viewer-dialog { position: relative; z-index: 1; width: min(94vw, 1500px); max-height: 94dvh; display: grid; grid-template-columns: 64px minmax(0, 1fr) 64px; grid-template-rows: minmax(0, 1fr) auto; align-items: center; gap: 0; }
      .marce-viewer-stage { grid-column: 2; grid-row: 1; min-height: 0; height: min(76dvh, 920px); display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 18px 18px 0 0; background: #0b0907; }
      .marce-viewer-stage img { display: block; width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; image-rendering: auto; transition: opacity .15s ease, transform .2s ease; }
      .marce-viewer.is-loading .marce-viewer-stage img { opacity: .35; transform: scale(.995); }
      .marce-viewer-copy { grid-column: 2; grid-row: 2; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 72px; padding: 16px 20px; border-radius: 0 0 18px 18px; background: #fff; color: #3E1C00; box-shadow: 0 16px 45px rgba(0,0,0,.28); }
      .marce-viewer-copy p { margin: 0; font-size: clamp(.92rem, 1.3vw, 1.08rem); line-height: 1.45; font-weight: 500; }
      .marce-viewer-copy span { flex: 0 0 auto; color: #EF6C00; font-weight: 800; font-size: .86rem; letter-spacing: .06em; }
      .marce-viewer-nav, .marce-viewer-close { border: 0; color: #fff; background: rgba(255,255,255,.12); backdrop-filter: blur(8px); cursor: pointer; transition: background .2s ease, transform .2s ease; }
      .marce-viewer-nav:hover, .marce-viewer-close:hover { background: #EF6C00; }
      .marce-viewer-nav { width: 52px; height: 52px; border-radius: 999px; display: grid; place-items: center; font-size: 1.05rem; justify-self: center; }
      .marce-viewer-prev { grid-column: 1; grid-row: 1; }
      .marce-viewer-next { grid-column: 3; grid-row: 1; }
      .marce-viewer-close { position: absolute; top: -10px; right: 52px; z-index: 3; width: 44px; height: 44px; border-radius: 999px; display: grid; place-items: center; font-size: 1.1rem; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
      body.marce-viewer-open { overflow: hidden !important; }
      @media (max-width: 767px) {
        .marce-viewer { padding: 10px; }
        .marce-viewer-dialog { width: 100%; max-height: 96dvh; grid-template-columns: 46px minmax(0,1fr) 46px; }
        .marce-viewer-stage { height: 68dvh; border-radius: 14px 14px 0 0; }
        .marce-viewer-copy { min-height: 82px; padding: 13px 14px; gap: 12px; border-radius: 0 0 14px 14px; align-items: flex-start; }
        .marce-viewer-copy p { font-size: .84rem; line-height: 1.4; }
        .marce-viewer-copy span { font-size: .72rem; padding-top: 2px; }
        .marce-viewer-nav { width: 40px; height: 40px; background: rgba(255,255,255,.18); }
        .marce-viewer-close { top: 8px; right: 8px; width: 40px; height: 40px; background: rgba(0,0,0,.55); }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
