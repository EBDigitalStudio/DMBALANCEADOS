/**
 * ==========================================================================
 * DMBALANCEADOS - Scripts Generales (js/general.js)
 * Manejo global: Año en footer, sombra en navbar y cierre automático del menú
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Año dinámico en el footer
  const currentYearElem = document.getElementById('currentYear');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // 2. Efecto de elevación/sombra en el Navbar al hacer scroll
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Cierre automático del menú desplegable en móviles al pulsar un enlace
  const navbarCollapse = document.getElementById('dmNavbarCollapse');
  if (navbarCollapse) {
    // Seleccionar todos los enlaces de navegación y botones dentro del menú móvil
    const menuLinks = navbarCollapse.querySelectorAll('.nav-link, .btn');

    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Verificar si el menú móvil está actualmente desplegado
        if (navbarCollapse.classList.contains('show')) {
          // Utilizar la API nativa de Bootstrap 5 para cerrar el colapso
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) 
            || new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }
});
