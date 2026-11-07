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
