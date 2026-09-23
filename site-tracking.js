/* Enregistre les visites des élèves connectés ; aucun appel sans session élève. */
(() => {
  const token = sessionStorage.getItem('zoumai-site-session');
  if (!token) return;
  const endpoint = 'https://loibjnlffyjrwttvntup.supabase.co/functions/v1/site-suivi';
  const path = location.pathname.replace(/^\/zou_mai(?=\/)/i, '').replace(/\/$/, '/index.html') || '/index.html';
  async function record(type, activity, score, maxScore) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', session: token, type, path, activity, score, maxScore })
      });
      if (response.status === 401) sessionStorage.removeItem('zoumai-site-session');
      return response.ok;
    } catch { return false; }
  }
  record('visit');
  window.zoumaiTrackResult = (activity, score, maxScore) => record('result', activity, score, maxScore);
})();
