/**
 * ==========================================================================
 * DMBALANCEADOS - Scripts de la Galería (js/galeria.js)
 * Filtrado dinámico por categoría y visualizador Lightbox interactivo
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------------------------------------------
  // 1. Elementos del DOM
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.dm-filter-btn');
  const galleryItems = document.querySelectorAll('.dm-gallery-item');

  const lightbox = document.getElementById('dmLightbox');
  const lightboxImg = document.getElementById('dmLightboxImg');
  const lightboxCaption = document.getElementById('dmLightboxCaption');
  const lightboxClose = document.getElementById('dmLightboxClose');

  // ------------------------------------------------------------------------
  // 2. Lógica de Filtrado por Categoría
  // ------------------------------------------------------------------------
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Remover clase 'active' de todos los botones y asignarla al clickeado
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');

        const filterValue = this.getAttribute('data-filter');

        // Filtrar elementos de la cuadrícula
        galleryItems.forEach(function (item) {
          const itemCategory = item.getAttribute('data-categoria');

          if (filterValue === 'todos' || itemCategory === filterValue) {
            item.classList.remove('is-hidden');
            // Animación suave de reaparición
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Lógica del Lightbox y Navegación por Teclado
  // ------------------------------------------------------------------------
  let currentVisibleIndex = -1;

  // Obtener únicamente las imágenes que están visibles según el filtro activo
  function getVisibleGalleryItems() {
    return Array.from(document.querySelectorAll('.dm-gallery-item')).filter(function (item) {
      return !item.classList.contains('is-hidden') && item.offsetParent !== null;
    });
  }

  // Actualizar imagen y pie de foto en el Lightbox
  function updateLightboxContent(item) {
    if (!item) return;
    const img = item.querySelector('.dm-gallery-img');
    if (!img) return;

    const imgSrc = img.getAttribute('src');
    const imgAlt = img.getAttribute('alt') || 'Fotografía de la galería';
    const itemCaption = item.querySelector('.dm-gallery-caption');
    const captionText = itemCaption ? itemCaption.textContent.trim() : imgAlt;

    // Transición visual sutil al cambiar de imagen
    lightboxImg.style.opacity = '0.6';
    lightboxImg.setAttribute('src', imgSrc);
    lightboxImg.setAttribute('alt', imgAlt);

    if (lightboxCaption) {
      lightboxCaption.textContent = captionText;
    }

    setTimeout(function () {
      lightboxImg.style.opacity = '1';
    }, 40);
  }

  // Avanzar a la siguiente imagen visible (cíclico)
  function showNextImage() {
    const visibleItems = getVisibleGalleryItems();
    if (visibleItems.length === 0) return;
    currentVisibleIndex = (currentVisibleIndex + 1) % visibleItems.length;
    updateLightboxContent(visibleItems[currentVisibleIndex]);
  }

  // Retroceder a la imagen visible anterior (cíclico)
  function showPrevImage() {
    const visibleItems = getVisibleGalleryItems();
    if (visibleItems.length === 0) return;
    currentVisibleIndex = (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent(visibleItems[currentVisibleIndex]);
  }

  // Abrir imagen ampliada al hacer clic en cualquier tarjeta
  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const visibleItems = getVisibleGalleryItems();
        currentVisibleIndex = visibleItems.indexOf(this);
        if (currentVisibleIndex === -1) currentVisibleIndex = 0;

        updateLightboxContent(this);

        // Mostrar lightbox y bloquear scroll de la página
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Lógica de Cierre del Lightbox
  // ------------------------------------------------------------------------
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentVisibleIndex = -1;

    // Limpiar src tras la animación de salida para liberar memoria
    setTimeout(function () {
      if (!lightbox.classList.contains('active') && lightboxImg) {
        lightboxImg.setAttribute('src', '');
      }
    }, 300);
  }

  // Cierre mediante botón "X"
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Cierre haciendo clic fuera de la imagen (en el fondo oscuro)
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      // Si el clic no fue dentro de la imagen ni de su título, cerrar
      if (e.target === lightbox || e.target.classList.contains('dm-lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Navegación por Teclado (Flechas y Escape)
  // ------------------------------------------------------------------------
  document.addEventListener('keydown', function (e) {
    // Solo responder si el Lightbox está actualmente abierto
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showPrevImage();
    }
  });
});
