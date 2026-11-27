/* Statistiques anonymes de fréquentation, indépendantes de la connexion élève. */
(() => {
  if (document.currentScript?.hasAttribute('data-zm-student-only')) return;
  try {
    const key = 'zoumai-anonymous-visit-id';
    let visitId = sessionStorage.getItem(key);
    if (!visitId) { visitId = crypto.randomUUID(); sessionStorage.setItem(key, visitId); }
    const path = location.pathname.replace(/^\/zou_mai(?=\/)/i, '').replace(/\/$/, '/index.html') || '/index.html';
    if (!/^\/[a-zA-Z0-9_./%-]{1,179}$/.test(path) || path.includes('..')) return;
    fetch('https://loibjnlffyjrwttvntup.supabase.co/functions/v1/zoumai-visites', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({path, visitId}), keepalive: true
    }).catch(() => {});
  } catch (_) {}
})();

/* Session élève, navigation et résultats sur Zou Maï. */
(() => {
  const key = 'zoumai-site-session';
  const endpoint = 'https://loibjnlffyjrwttvntup.supabase.co/functions/v1/site-suivi';
  const path = location.pathname.replace(/^\/zou_mai(?=\/)/i, '').replace(/\/$/, '/index.html') || '/index.html';
  if (/(?:enseignant|statistiques)\.html$/i.test(path)) return;
  const profileUrl = new URL('espace-eleve.html', document.currentScript.src);
  const isProfile = path === '/espace-eleve.html';
  let badge;

  function currentSession() {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }

  async function request(action, session, fields = {}) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({...fields, action, session}),
        keepalive: true
      });
      if (response.status === 401 && currentSession() === session) {
        sessionStorage.removeItem(key);
        badge?.remove();
      }
      return response.ok ? await response.json() : null;
    } catch { return null; }
  }

  function record(type, activity, score, maxScore, extra = {}) {
    const session = currentSession();
    if (!session) return Promise.resolve(false);
    return request('record', session, {...extra, type, path, activity, score, maxScore}).then(Boolean);
  }

  function showBadge(nickname) {
    if (!badge) {
      badge = document.createElement('div');
      const shadow = badge.attachShadow({mode:'open'});
      const style = document.createElement('style');
      style.textContent = `
        :host{position:fixed;bottom:max(8px,env(safe-area-inset-bottom));left:max(8px,env(safe-area-inset-left));z-index:1000;max-width:calc(100vw - 16px)}
        a{display:flex;gap:7px;align-items:center;padding:6px 10px;border:1px solid #58dff0;border-radius:999px;background:#10233a;color:#f5fbff;text-decoration:none;font:700 12px/1.35 system-ui,sans-serif;box-shadow:0 2px 8px #0006}
        a:focus-visible{outline:2px solid #ffdc82;outline-offset:2px}
        b{color:#92f2bd;font-size:14px}
      `;
      const link = document.createElement('a');
      link.href = profileUrl.href;
      const light = document.createElement('b');
      light.textContent = '●';
      light.setAttribute('aria-hidden','true');
      const label = document.createElement('span');
      link.append(light,label);
      shadow.append(style,link);
    }
    const link = badge.shadowRoot.querySelector('a');
    link.setAttribute('aria-label', nickname+' · Compte connecté · Ouvrir Mon espace');
    badge.shadowRoot.querySelector('span').textContent = nickname+' · Connecté';
    if (!badge.isConnected) document.body.append(badge);
  }

  async function trackPage() {
    const session = currentSession();
    if (!session) { badge?.remove(); return; }
    const lessonLevel = path === '/jeu-maths-cm2.html' ? new URLSearchParams(location.search).get('m') : null;
    const activity = /^(?:[7-9]|[12][0-9]|3[0-5])$/.test(lessonLevel ?? '') ? 'Leçon M' + lessonLevel : document.title.replace(/[^\p{L}\p{N} _-]/gu,' ').replace(/\s+/g,' ').trim().slice(0,80);
    if (isProfile) { record('visit', activity); return; }
    const [profile] = await Promise.all([request('me',session), record('visit',activity)]);
    if (window.top === window && profile?.nickname && currentSession() === session) showBadge(profile.nickname);
  }

  window.zoumaiTrackResult = (activity, score, maxScore, extra={}) => record('result', activity, score, maxScore, extra);
  window.zoumaiTrackPerfect = (activity, maxScore=1, durationMs=null) => record('result', activity, maxScore, maxScore, {errors:0,durationMs});
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || !currentSession()) return;
    const link = event.target.closest?.('a[target="_blank"]:not([download])');
    if (!link) return;
    const url = new URL(link.href);
    if (url.origin !== profileUrl.origin || !url.pathname.startsWith(new URL('.',profileUrl).pathname) ||
        !/(?:\.html|\/)$/i.test(url.pathname)) return;
    event.preventDefault();
    location.assign(url.href);
  });
  trackPage();
  window.addEventListener('pageshow', event => { if (event.persisted) trackPage(); });
  window.addEventListener('zoumai-student-login', trackPage);
})();

/* Design néon global : charge la feuille commune et illumine les cartes activées. */
(() => {
  if (document.currentScript?.hasAttribute('data-zm-student-only') || document.body?.hasAttribute('data-zm-no-neon')) return;
  if (!document.querySelector('link[data-zm-neon]')) {
    const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('zoumai-neon.css',document.currentScript?.src || location.href).href;link.dataset.zmNeon='1';document.head.append(link);
  }
  const selector='a.subject,a.subfolder,a.weekly-card,a.card,a.tile,a.atelier,a.game-card,button.tab,button.choice,.item a,[role="button"].card';
  document.addEventListener('click',event=>{
    const target=event.target.closest?.(selector);
    if(!target || target.matches(':disabled,[aria-disabled="true"]'))return;
    target.classList.add('zm-neon-lit');
    setTimeout(()=>target.classList.remove('zm-neon-lit'),700);
  });
})();
