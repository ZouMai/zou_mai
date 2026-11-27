const arcadeModes = {flash:'Éclair', race:'Course', survival:'Survie', champion:'Champion'};
const arcadeFrames = [
  {threshold:15, name:'Cadre électrique', style:'electric'},
  {threshold:30, name:'Cadre étoilé', style:'stellar'}
];

function battleLabel(result) {
  const exercise = result.exercise === 'missing' ? 'Facteur mystère' : 'Multiplication';
  return arcadeModes[result.mode]+' · '+exercise+' · '+result.seconds+' s · Tables '+result.tables.join(', ') +
    ' · Adversaire '+result.opponentTables.join(', ');
}

function addArcadeLine(list, content) {
  const item = document.createElement('li');
  item.textContent = content;
  list.append(item);
}

async function loadArcade(token) {
  const balance = $('#arcadeBalance');
  const details = $('#arcadeDetails');
  const history = $('#arcadeHistory');
  const status = $('#arcadeStatus');
  const hero = $('#pupilHero');
  const replay = $('#arcadeReplay');
  const isCurrent = () => sessionStorage.getItem('zoumai-site-session') === token;

  balance.hidden = details.hidden = history.hidden = true;
  delete hero.dataset.arcadeFrame;
  replay.href = 'tables-battle-duo.html';
  replay.textContent = 'Jouer à Tables Battle Duo →';
  status.textContent = 'Chargement de ton arcade…';

  try {
    const data = await request('arcadeSummary', {session:token});
    if (!isCurrent()) return;
    balance.textContent = data.points+' '+(data.points === 1 ? 'point' : 'points')+' d’arcade';
    balance.hidden = false;
    status.textContent = data.played
      ? 'Ton premier duel rapporte des points. Ensuite, améliore ton score avec les mêmes réglages.'
      : 'Termine ton premier duel pour gagner tes premiers points.';
    const records = $('#arcadeRecords');
    records.replaceChildren();
    if (data.records.length) {
      for (const {result, performance} of data.records) {
        const record = document.createElement('p');
        const title = document.createElement('strong');
        const score = document.createElement('small');
        title.textContent = battleLabel(result);
        score.textContent = result.correct+' bonnes réponses · '+result.errors+' erreurs · '+performance+'/10';
        record.append(title, score);
        records.append(record);
      }
    } else {
      records.textContent = 'Ton premier record apparaîtra ici.';
    }
    const mistakes = $('#arcadeMistakes');
    mistakes.replaceChildren();
    const latest = data.recent[0]?.result;
    $('#arcadePractice').textContent = latest?.mistakes.length
      ? 'Tables Battle Duo · Calculs à revoir après ton dernier duel'
      : latest ? 'Tables Battle Duo · Rejoue pour améliorer ton record.' : 'Ton prochain défi : Tables Battle Duo.';
    if (latest) {
      const params = new URLSearchParams({
        mode:latest.mode, exercise:latest.exercise, seconds:latest.seconds,
        tables:latest.tables.join(','), opponent:latest.opponentTables.join(',')
      });
      replay.href = 'tables-battle-duo.html?'+params;
      replay.textContent = 'Rejouer mon dernier défi →';
      for (const fact of latest.mistakes) addArcadeLine(mistakes,fact);
    }
    const prizes = $('#arcadePrizes');
    prizes.replaceChildren();
    for (const frame of arcadeFrames) {
      const earned = data.points >= frame.threshold;
      addArcadeLine(prizes, frame.name+' · '+(earned ? 'Débloqué' : frame.threshold+' points'));
      if (earned) hero.dataset.arcadeFrame = frame.style;
    }
    const rounds = $('#arcadeRounds');
    rounds.replaceChildren();
    for (const {result, points, played_at} of data.recent) {
      addArcadeLine(rounds, lessonDate.format(new Date(played_at))+' · '+arcadeModes[result.mode]+' · '+
        result.correct+' bonnes réponses, '+result.errors+' erreurs · +'+points+' point(s)');
    }
    history.hidden = !data.recent.length;
    details.hidden = false;
  } catch {
    if (isCurrent()) status.textContent = 'Ton arcade est momentanément indisponible.';
  }
}
