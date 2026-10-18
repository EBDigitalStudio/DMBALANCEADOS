/**
 * ==========================================================================
 * DMBALANCEADOS - Interactividad de Productos (js/productos.js)
 * Manejo de tarjetas dinámicas con selector de variantes y validación de WhatsApp
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  const WHATSAPP_PHONE = '595984088637';

  /**
   * Genera el enlace de WhatsApp con el mensaje estructurado
   * @param {string} productName - Nombre del producto o variante
   * @param {string} price - Precio formateado (ej: ₲90.000)
   * @returns {string} Enlace codificado para WhatsApp
   */
  function createWhatsAppLink(productName, price) {
    const message = `Hola, me interesa el producto ${productName} de ${price}.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Manejo y Validación de Tarjetas Dinámicas (Aves y Peces)
   */
  const dynamicCards = document.querySelectorAll('[data-dynamic-card="true"]');

  dynamicCards.forEach(function (card) {
    const selectElem = card.querySelector('.dm-variant-select');
    const priceDisplay = card.querySelector('.dm-price-value');
    const whatsappBtn = card.querySelector('.btn-whatsapp-order');

    if (!selectElem || !priceDisplay || !whatsappBtn) return;

    // Escuchar cambios en el selector de tipo/variante
    selectElem.addEventListener('change', function () {
      if (!this.value) return;

      const selectedOption = this.options[this.selectedIndex];
      const variantName = selectedOption.getAttribute('data-name') || selectedOption.text;
      const variantPrice = selectedOption.getAttribute('data-price') || '';

      // Actualizar visualmente el precio con micro-transición
      priceDisplay.style.opacity = '0';
      setTimeout(function () {
        priceDisplay.textContent = variantPrice;
        priceDisplay.classList.remove('is-empty');
        priceDisplay.style.opacity = '1';
      }, 150);

      // Actualizar el enlace del botón de WhatsApp
      whatsappBtn.href = createWhatsAppLink(variantName, variantPrice);
      whatsappBtn.setAttribute('aria-label', `Pedir por WhatsApp ${variantName}`);
      whatsappBtn.setAttribute('target', '_blank');
      whatsappBtn.setAttribute('rel', 'noopener noreferrer');

      // Remover cualquier resaltado de advertencia
      selectElem.style.borderColor = '';
      selectElem.style.boxShadow = '';
    });

    // Validación al hacer clic en "Pedir por WhatsApp"
    whatsappBtn.addEventListener('click', function (e) {
      if (!selectElem.value || selectElem.value === '') {
        e.preventDefault();
        
        // Alerta al usuario
        alert('Por favor, seleccione primero el tipo de producto antes de pedir por WhatsApp');
        
        // Enfocar y resaltar el selector para guiar al usuario
        selectElem.focus();
        selectElem.style.borderColor = '#DC2626';
        selectElem.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.25)';
        
        setTimeout(function () {
          selectElem.style.borderColor = '';
          selectElem.style.boxShadow = '';
        }, 3000);
      }
    });
  });

  /**
   * Sistema de Filtro Rápido por Categorías
   */
  const filterButtons = document.querySelectorAll('.dm-filter-btn');
  const productCards = document.querySelectorAll('[data-category]');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const selectedCategory = this.getAttribute('data-filter');

      productCards.forEach(function (cardWrapper) {
        const itemCategory = cardWrapper.getAttribute('data-category');
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          cardWrapper.style.display = '';
        } else {
          cardWrapper.style.display = 'none';
        }
      });
    });
  });
});
