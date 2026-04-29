(function () {
  var html = document.documentElement;

  /* Synchronise data-theme avec la classe dark de Blowfish */
  function syncDataTheme() {
    if (html.classList.contains('dark')) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
  }

  /* Sync au chargement (Blowfish a déjà initialisé avant ce script) */
  syncDataTheme();

  /* Observer les futurs changements de classe (au cas où Blowfish les modifie) */
  new MutationObserver(syncDataTheme).observe(html, { attributes: true, attributeFilter: ['class'] });

  /* Toggle thème */
  document.getElementById('themeToggle')?.addEventListener('click', function () {
    var dark = html.classList.toggle('dark');
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('appearance', dark ? 'dark' : 'light');
  });

  /* Switcher de langue dynamique */
  // Détecte si on est sur une page EN (URL commence par /en/)
  var path = window.location.pathname;
  var isEn = path.startsWith('/en/') || path === '/en';
  var langLink  = document.getElementById('langSwitch');
  var langLinkM = document.getElementById('langSwitchMobile');
  var langLabel  = document.getElementById('langLabel');
  var langLabelM = document.getElementById('langLabelMobile');

  function getLangTarget() {
    if (isEn) {
      // EN -> FR : supprimer le préfixe /en
      return path.replace(/^\/en/, '') || '/';
    } else {
      // FR -> EN : ajouter le préfixe /en
      return '/en' + (path === '/' ? '/' : path);
    }
  }

  if (langLink) langLink.href = getLangTarget();
  if (langLinkM) langLinkM.href = getLangTarget();

  /* ─── Burger mobile ─── */
  var burger    = document.getElementById('burgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  burger?.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    mobileNav.classList.toggle('ed-mobile-nav--open');
    mobileNav.setAttribute('aria-hidden', String(open));
  });
})();
