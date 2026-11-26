/* Statistiques anonymes de fréquentation, indépendantes de la connexion élève. */
(() => {
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

/* Enregistre les visites des élèves connectés ; aucun appel sans session élève. */
(() => {
  const token = sessionStorage.getItem('zoumai-site-session');
  if (!token) return;
  const endpoint = 'https://loibjnlffyjrwttvntup.supabase.co/functions/v1/site-suivi';
  const path = location.pathname.replace(/^\/zou_mai(?=\/)/i, '').replace(/\/$/, '/index.html') || '/index.html';
  async function record(type, activity, score, maxScore, extra={}) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', session: token, type, path, activity, score, maxScore, ...extra })
      });
      if (response.status === 401) sessionStorage.removeItem('zoumai-site-session');
      return response.ok;
    } catch { return false; }
  }
  record('visit');
  window.zoumaiTrackResult = (activity, score, maxScore, extra={}) => record('result', activity, score, maxScore, extra);
  window.zoumaiTrackPerfect = (activity, maxScore=1, durationMs=null) => record('result', activity, maxScore, maxScore, {errors:0,durationMs});
})();

/* Design néon global : charge la feuille commune et illumine les cartes activées. */
(() => {
  if (document.body?.hasAttribute('data-zm-no-neon')) return;
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
