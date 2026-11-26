(() => {
  if (!matchMedia('(display-mode: standalone)').matches && navigator.standalone !== true) return;
  if (performance.getEntriesByType('navigation')[0]?.type !== 'navigate') return;

  const splash = new Image();
  splash.alt = '';
  splash.setAttribute('aria-hidden', 'true');
  splash.style.cssText = [
    'position:fixed', 'inset:0', 'width:100%', 'height:100%',
    'object-fit:contain', 'background:#070e22', 'z-index:2147483647',
    'pointer-events:none'
  ].join(';');

  const deadline = performance.now() + 800;
  splash.src = 'assets/zoumai-dojo.webp';
  splash.decode().then(() => {
    if (performance.now() > deadline || document.hidden) return;
    document.body.append(splash);
    window.setTimeout(() => splash.remove(), 1200);
    window.addEventListener('pagehide', () => splash.remove(), { once: true });
  }).catch(() => {});
})();
