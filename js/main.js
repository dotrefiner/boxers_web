/**
 * Boxers Punk Rock - Main JavaScript
 * Interacciones nativas sin dependencias: Dark/Light Mode, menú móvil accesible, navegación y scroll
 */

// Inicialización inmediata del tema para evitar parpadeo (FOUC)
(() => {
  const savedTheme = localStorage.getItem('boxers_theme');
  const theme = savedTheme ? savedTheme : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Elementos de navegación y tema
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const themeToggles = document.querySelectorAll('.theme-toggle');

  // Control de Tema (Dark / Light Mode)
  function setTheme(newTheme) {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('boxers_theme', newTheme);

    const isLight = newTheme === 'light';
    themeToggles.forEach((btn) => {
      btn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      btn.setAttribute('title', isLight ? 'Activar modo oscuro' : 'Activar modo claro');
      const textSpan = btn.querySelector('.theme-toggle-text');
      if (textSpan) {
        textSpan.textContent = isLight ? 'OSCURO' : 'CLARO';
      }
    });
  }

  // Configurar botones de tema
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(currentTheme);

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(active);
    });
  });

  // Control del Menú Móvil
  function openMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.add('open');
    navBackdrop.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.remove('open');
    navBackdrop.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Cerrar al clickear cualquier link en móvil
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  // Resaltado de sección activa en la barra de navegación
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
