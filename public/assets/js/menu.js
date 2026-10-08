/* Menu hamburger (HP & tablet): buka/tutup panel sidebar */
(function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (!sidebar || !toggle) return;

  const closeBtn = sidebar.querySelector('.sidebar-close');
  const mobileQuery = window.matchMedia('(max-width: 900px)');

  function isOpen() {
    return sidebar.classList.contains('is-open');
  }

  function setOpen(open) {
    if (open === isOpen()) return;
    sidebar.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    // Fokus ikut berpindah supaya bisa dipakai lewat keyboard
    (open ? closeBtn : toggle)?.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Tombol X dan latar gelap menutup panel
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-menu-close]')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  // Kalau layar dilebarkan (atau HP diputar) ke ukuran desktop, tutup panel
  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false);
  });

  // Tombol Back di browser bisa memulihkan halaman dalam keadaan menu terbuka
  window.addEventListener('pageshow', () => setOpen(false));
})();
