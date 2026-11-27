(() => {
  const api = 'https://loibjnlffyjrwttvntup.supabase.co/functions/v1/site-suivi';
  const labels = ['Zoum', 'Maï'];
  const status = $('duelGuestStatus');
  const form = $('duelGuestForm');
  const resultBox = $('duelArcadeResults');
  let primary = null;
  let guest = null;
  let currentRound = null;

  async function request(action, fields) {
    const response = await fetch(api, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action, ...fields}),
      keepalive: action === 'arcadeBattleRecord'
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Service indisponible.');
    return result;
  }

  function renderGuest() {
    status.textContent = guest ? 'Deuxième compte connecté : ' + guest.nickname : 'Le deuxième joueur peut se connecter ou jouer en invité.';
    form.hidden = Boolean(guest);
    $('removeDuelGuest').hidden = !guest;
  }

  const replay = new URLSearchParams(location.search);
  const readTables = key => {
    const value = replay.get(key);
    if (!value || !/^(?:[2-9]|1[0-2])(?:,(?:[2-9]|1[0-2])){0,10}$/.test(value)) return null;
    return new Set(value.split(',').map(Number));
  };
  const replayOwn = readTables('tables');
  const replayOpponent = readTables('opponent');

  function applyReplayTables() {
    if (!replayOwn || !replayOpponent) return;
    const side = Number($('duelSide').value);
    tables[side] = new Set(replayOwn);
    tables[1-side] = new Set(replayOpponent);
    options();
    if (wizardStep === 3) showWizard(3);
  }

  if (replayOwn && replayOpponent) {
    if (modes.some(option => option[0] === replay.get('mode'))) mode = replay.get('mode');
    if (['classic','missing'].includes(replay.get('exercise'))) exerciseType = replay.get('exercise');
    if ([60,90,120].includes(Number(replay.get('seconds')))) duration = Number(replay.get('seconds'));
    applyReplayTables();
  }

  async function initialize() {
    const session = sessionStorage.getItem('zoumai-site-session');
    if (session) {
      try {
        const profile = await request('me', {session});
        if (session === sessionStorage.getItem('zoumai-site-session')) primary = {...profile, session};
      } catch {}
    }
    const description = $('duelPrimary');
    if (!primary) {
      const link = document.createElement('a');
      link.href = 'espace-eleve.html';
      link.textContent = 'Connecte-toi à Mon espace pour gagner des points d’arcade.';
      description.replaceChildren(link);
      return;
    }
    $('duelAccounts').open = true;
    description.textContent = primary.nickname + ' · choisis ton côté.';
    $('duelSideField').hidden = false;
    if (replayOwn && replayOpponent) {
      $('duelSide').addEventListener('change', () => {
        [tables[0], tables[1]] = [tables[1], tables[0]];
        options();
        showWizard(3);
      });
    }
    $('duelGuest').hidden = false;
    renderGuest();
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(form));
    $('start').disabled = true;
    form.querySelector('button').disabled = true;
    status.textContent = 'Connexion…';
    try {
      const login = await request('arcadeGuestLogin', credentials);
      if (login.id === primary.id) throw Error('Choisissez un autre compte élève.');
      guest = {nickname:login.nickname, session:login.token};
      form.reset();
      renderGuest();
    } catch (error) {
      form.elements.pin.value = '';
      form.elements.classCode.value = '';
      status.textContent = error.message;
    } finally {
      $('start').disabled = false;
      form.querySelector('button').disabled = false;
    }
  });

  $('removeDuelGuest').onclick = () => { guest = null; renderGuest(); };

  function begin() {
    const side = Number($('duelSide').value);
    const entries = [];
    if (primary?.session === sessionStorage.getItem('zoumai-site-session')) {
      entries.push({profile:primary, side});
      if (guest) entries.push({profile:guest, side:1-side});
    }
    currentRound = entries.length ? {entries, match:crypto.randomUUID()} : null;
    resultBox.hidden = true;
    resultBox.replaceChildren();
  }

  function showPoints(round, entry) {
    const report = document.createElement('p');
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Réessayer l’enregistrement';
    retry.hidden = true;
    const name = entry.profile.nickname + ' (' + labels[entry.side] + ')';
    const own = players[entry.side];
    if (own.correct + own.errors === 0) {
      report.textContent = name + ' · aucune réponse dans ce duel.';
      resultBox.append(report);
      return;
    }
    const payload = {
      session:entry.profile.session, match:round.match, mode, exercise:exerciseType, seconds:duration,
      tables:[...tables[entry.side]], opponentTables:[...tables[1-entry.side]], correct:own.correct,
      errors:own.errors, mistakes:[...own.mistakes].sort((a,b)=>b[1]-a[1]).map(([fact])=>fact).slice(0,6)
    };
    const save = async () => {
      retry.hidden = true;
      report.textContent = name + ' · enregistrement…';
      try {
        const {points} = await request('arcadeBattleRecord', payload);
        report.textContent = name + (points > 0 ? ' · +' + points + ' points d’arcade' : ' · partie enregistrée');
      } catch {
        report.textContent = name + ' · enregistrement indisponible.';
        retry.hidden = false;
      }
    };
    retry.onclick = save;
    resultBox.append(report, retry);
    void save();
  }

  function finish(completed) {
    if (!currentRound?.entries.length) return;
    const round = currentRound;
    currentRound = null;
    resultBox.hidden = false;
    if (!completed) {
      resultBox.textContent = 'Termine le prochain duel pour enregistrer tes résultats d’arcade.';
      return;
    }
    for (const entry of round.entries) showPoints(round, entry);
    const link = document.createElement('a');
    link.href = 'espace-eleve.html#arcade';
    link.textContent = 'Voir Mon arcade →';
    resultBox.append(link);
  }

  window.battleArcade = {begin, finish};
  void initialize();
})();
