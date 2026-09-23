(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const weights = {'+':1, '−':2, '×':1, '÷':3};
  const operations = ['+', '−', '×', '÷'];
  const allowed = [['+'],['+','−'],['+','×'],['+','×'],['+','×','÷'],['+','−','×'],operations,operations,operations];
  const TOTAL_SECONDS = 240;
  const levels = [
    {name:'Premiers pas',aim:'Une addition suffit.',steps:1,maxCard:6,low:3,high:12},
    {name:'J’ajoute et je retire',aim:'Trouve une soustraction.',steps:1,maxCard:8,low:3,high:16},
    {name:'Je découvre les produits',aim:'Trouve une multiplication.',steps:1,maxCard:10,low:6,high:30},
    {name:'Deux calculs',aim:'Enchaîne deux calculs simples.',steps:2,maxCard:10,low:8,high:40},
    {name:'Division exacte',aim:'Deux calculs, dont une division exacte.',steps:2,maxCard:11,low:9,high:50},
    {name:'Trois calculs',aim:'Relie quatre cartes avec trois calculs.',steps:3,maxCard:11,low:12,high:60},
    {name:'Je combine les opérations',aim:'Trois calculs avec une division exacte.',steps:3,maxCard:12,low:14,high:75},
    {name:'Cinq cartes',aim:'Utilise les cinq cartes en quatre calculs.',steps:4,maxCard:12,low:18,high:85},
    {name:'Coup Mathador',aim:'Utilise les cinq cartes et les quatre opérations.',steps:4,maxCard:15,low:20,high:99}
  ];
  let draw = null, tokens = [], steps = [], undoStack = [];
  const STORAGE = 'zoumai-mathador-parcours-v1';
  let profiles = loadProfiles(), player = null, currentLevel = 0;
  let chosen = null, operation = null, nextId = 5, seconds = TOTAL_SECONDS;
  let timer = null, active = false, hintUsed = false, best = 0, bestExpression = '';

  function random(max) { return Math.floor(Math.random() * max); }
  function shuffled(values) {
    let list = [...values];
    for (let i = list.length - 1; i > 0; i--) {
      let j = random(i + 1);
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  function say(message, kind = '') {
    $('feedback').textContent = message;
    $('feedback').className = 'feedback' + (kind ? ' ' + kind : '');
  }
  function loadProfiles() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (error) { return {}; }
  }
  function persist() {
    try { localStorage.setItem(STORAGE, JSON.stringify(profiles)); } catch (error) {}
  }
  function cleanName(value) {
    return value.trim().replace(/\s+/g,' ').slice(0,18);
  }
  function profileKey(name) { return name.toLocaleLowerCase('fr'); }
  function showLevel() {
    if (!player) {
      $('level-info').textContent = 'Entre ton prénom ou un pseudo pour découvrir ton premier défi.';
      $('journey').replaceChildren();
      return;
    }
    let index = Math.min(player.completed, levels.length - 1), profile = levels[index];
    $('level-info').textContent = player.name + ' · ' + player.completed + '/9 défis réussis · ' +
      player.points.reduce((sum,value) => sum + value,0) + ' points · Prochain défi : ' + profile.name + '. ' + profile.aim;
    const journey = $('journey'); journey.replaceChildren();
    levels.forEach((stage,i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'stage' + (i < player.completed ? ' done' : i === index ? ' current' : '');
      button.textContent = (i < player.completed ? '✓ ' : i > player.completed ? '🔒 ' : '▶ ') +
        (i + 1) + '. ' + stage.name + (player.points[i] ? ' · ' + player.points[i] + ' pts' : '');
      button.disabled = i > player.completed || active;
      button.addEventListener('click',() => start(i));
      journey.appendChild(button);
    });
  }
  function showRankings() {
    const list = $('rankings'); list.replaceChildren();
    const ranking = Object.values(profiles).filter(p => p && typeof p.name === 'string' &&
      Number.isInteger(p.completed) && Array.isArray(p.points))
      .map(p => ({name:p.name,completed:p.completed,points:p.points.reduce((sum,n) => sum + (Number(n)||0),0)}))
      .sort((a,b) => b.completed-a.completed || b.points-a.points || a.name.localeCompare(b.name,'fr')).slice(0,10);
    if (!ranking.length) { const item = document.createElement('li'); item.textContent = 'Aucun parcours commencé.'; list.appendChild(item); }
    ranking.forEach(p => {
      const item = document.createElement('li');
      item.textContent = p.name + ' · ' + p.completed + '/9 défis';
      const points = document.createElement('strong'); points.textContent = p.points + ' pts';
      item.appendChild(points); list.appendChild(item);
    });
  }
  function findWitness(cards,profile,level) {
    let found = [];
    const valid = x => Number.isInteger(x) && x > 0;
    function add(target, lines) {
      if (valid(target) && target >= profile.low && target <= profile.high &&
          !cards.includes(target) && lines.length === profile.steps) {
        found.push({target, lines});
      }
    }
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      if (j === i) continue;
      let a = cards[i],b = cards[j];
      if (level <= 2) {
        if (level !== 2 || a+b >= profile.low) add(a+b,[a+' + '+b+' = '+(a+b)]);
        if (level === 1 && a > b) add(a-b,[a+' − '+b+' = '+(a-b)]);
        if (level === 2) add(a*b,[a+' × '+b+' = '+(a*b)]);
        continue;
      }
      for (let k = 0; k < 5; k++) {
        if (k === i || k === j) continue;
        let c = cards[k],x,y,z;
        if (level === 3 || level === 4) {
          x = a+b; y = x*c;
          add(y,[a+' + '+b+' = '+x,x+' × '+c+' = '+y]);
          x = a*b; y = x+c;
          add(y,[a+' × '+b+' = '+x,x+' + '+c+' = '+y]);
          if (level === 4) {
            x = a*b;
            y = x/c;
            if (valid(y)) add(y,[a+' × '+b+' = '+x,x+' ÷ '+c+' = '+y]);
          }
          continue;
        }
        for (let l = 0; l < 5; l++) {
          if (l === i || l === j || l === k) continue;
          let d = cards[l];
          if (level === 5 || level === 6) {
            if (level === 5) {
              x = a+b;y = x*c;z = y-d;
              if (valid(z)) add(z,[a+' + '+b+' = '+x,x+' × '+c+' = '+y,y+' − '+d+' = '+z]);
              x = a*b;y = x+c;z = y-d;
              if (valid(z)) add(z,[a+' × '+b+' = '+x,x+' + '+c+' = '+y,y+' − '+d+' = '+z]);
            } else {
              x = a*b;y = x/c;z = y+d;
              if (valid(y)) add(z,[a+' × '+b+' = '+x,x+' ÷ '+c+' = '+y,y+' + '+d+' = '+z]);
              x = a+b;y = x*c;z = y/d;
              if (valid(z)) add(z,[a+' + '+b+' = '+x,x+' × '+c+' = '+y,y+' ÷ '+d+' = '+z]);
            }
            continue;
          }
          let e = [0,1,2,3,4].find(x => ![i,j,k,l].includes(x));
          let f = cards[e];
          x = a / b; y = c * d; z = x + y;
          if (valid(x) && valid(z) && valid(z - f)) {
            add(z - f, [a+' ÷ '+b+' = '+x,c+' × '+d+' = '+y,x+' + '+y+' = '+z,z+' − '+f+' = '+(z-f)]);
          }
          x = a + b; y = x * c; z = y / d;
          if (valid(z) && valid(z - f)) {
            add(z - f, [a+' + '+b+' = '+x,x+' × '+c+' = '+y,y+' ÷ '+d+' = '+z,z+' − '+f+' = '+(z-f)]);
          }
          x = a * b; y = x - c; z = y / d;
          if (valid(y) && valid(z)) {
            add(z + f, [a+' × '+b+' = '+x,x+' − '+c+' = '+y,y+' ÷ '+d+' = '+z,z+' + '+f+' = '+(z+f)]);
          }
          x = a - b; y = x * c; z = y / d;
          if (valid(x) && valid(z)) {
            add(z + f, [a+' − '+b+' = '+x,x+' × '+c+' = '+y,y+' ÷ '+d+' = '+z,z+' + '+f+' = '+(z+f)]);
          }
        }
      }
    }
    let newOperation = level === 1 ? '−' : level === 2 ? '×' : level === 4 || level === 6 ? '÷' : null;
    if (newOperation && found.length) {
      let practice = found.filter(item => item.lines.some(line => line.includes(' '+newOperation+' ')));
      found = practice;
    }
    return found.length ? found[random(found.length)] : null;
  }
  const fallbacks = [
    {cards:[1,2,3,4,5],target:6,witness:['2 + 4 = 6']},
    {cards:[1,2,4,5,8],target:7,witness:['8 − 1 = 7']},
    {cards:[2,3,4,5,6],target:20,witness:['4 × 5 = 20']},
    {cards:[2,3,4,5,6],target:20,witness:['2 + 3 = 5','5 × 4 = 20']},
    {cards:[2,3,4,5,6],target:9,witness:['3 × 6 = 18','18 ÷ 2 = 9']},
    {cards:[2,3,4,5,6],target:14,witness:['2 + 3 = 5','5 × 4 = 20','20 − 6 = 14']},
    {cards:[2,3,4,5,6],target:15,witness:['4 × 6 = 24','24 ÷ 2 = 12','12 + 3 = 15']},
    {cards:[2,4,6,7,9],target:32,witness:['6 ÷ 2 = 3','4 × 9 = 36','3 + 36 = 39','39 − 7 = 32']},
    {cards:[2,4,6,7,9],target:32,witness:['6 ÷ 2 = 3','4 × 9 = 36','3 + 36 = 39','39 − 7 = 32']}
  ];
  function newDraw(level) {
    let profile = levels[level];
    let pool = Array.from({length:profile.maxCard},(_,i)=>i+1);
    let standard = Array.from({length:Math.min(profile.maxCard,12)},(_,i)=>i+1);
    if (level === 8) standard.push(15);
    for (let attempt = 0; attempt < 180; attempt++) {
      let cards = shuffled([
        pool[random(pool.length)],pool[random(pool.length)],
        ...Array.from({length:3}, () => standard[random(standard.length)])
      ]);
      if (new Set(cards).size < 3) continue;
      let witness = findWitness(cards,profile,level);
      if (witness) return {cards,target:witness.target,witness:witness.lines,level};
    }
    return {...fallbacks[level],level};
  }
  function initialTokens() {
    return draw.cards.map((value, id) => ({id, value, used:[id], ops:[], expr:String(value)}));
  }
  function resetMoves() {
    tokens = initialTokens();
    steps = [];
    undoStack = [];
    chosen = null;
    operation = null;
    nextId = 5;
    render();
  }
  function start(requestedLevel) {
    const name = cleanName($('player-name').value);
    if (!name || !/^[\p{L}][\p{L}\p{M}\p{N} _'-]*$/u.test(name)) {
      $('level-info').textContent = 'Écris un prénom ou un pseudo de 1 à 18 caractères, sans nom de famille.';
      $('player-name').focus(); return;
    }
    const key = profileKey(name);
    if (!profiles[key] || !Array.isArray(profiles[key].points)) {
      profiles[key] = {name,completed:0,points:Array(levels.length).fill(0)};
    }
    player = profiles[key];
    player.name = name;
    currentLevel = Number.isInteger(requestedLevel) && requestedLevel >= 0 && requestedLevel <= player.completed ?
      requestedLevel : Math.min(player.completed,levels.length-1);
    clearInterval(timer);
    draw = newDraw(currentLevel);
    seconds = TOTAL_SECONDS;
    hintUsed = false;
    best = 0;
    bestExpression = '';
    active = true;
    $('player-name').disabled = true;
    $('next').hidden = true;
    $('game').hidden = false;
    $('solution').hidden = true;
    $('series-label').textContent = player.name + ' · Défi ' + (currentLevel + 1) + '/9';
    $('challenge-goal').textContent = 'Étape '+(draw.level+1)+'/9 · '+levels[draw.level].aim;
    resetMoves();
    showLevel(); showRankings(); persist();
    say('Choisis un nombre, une opération, puis un autre nombre.');
    timer = setInterval(() => {
      seconds--;
      renderClock();
      if (seconds <= 0) finish('Temps écoulé.');
    }, 1000);
    $('game').scrollIntoView({behavior:'smooth', block:'start'});
  }
  function renderClock() {
    let minutes = String(Math.floor(seconds / 60)).padStart(2,'0');
    let rest = String(seconds % 60).padStart(2,'0');
    $('clock').textContent = minutes + ':' + rest;
  }
  function selectToken(id) {
    if (!active) return;
    if (chosen === null) { chosen = id; render(); return; }
    if (chosen === id) { chosen = null; operation = null; render(); return; }
    if (!operation) { say('Choisis une opération avant le deuxième nombre.', 'error'); return; }
    let first = tokens.find(x => x.id === chosen), second = tokens.find(x => x.id === id);
    if (!first || !second) return;
    let value = operation === '+' ? first.value + second.value :
      operation === '−' ? first.value - second.value :
      operation === '×' ? first.value * second.value : first.value / second.value;
    if (!Number.isSafeInteger(value) || value <= 0) {
      say('Ce calcul doit donner un entier positif. Pour une division, il faut un quotient entier.', 'error');
      return;
    }
    undoStack.push({tokens:structuredClone(tokens), steps:[...steps], nextId});
    let result = {
      id:nextId++, value,
      used:[...first.used,...second.used],
      ops:[...first.ops,...second.ops,operation],
      expr:'(' + first.expr + ' ' + operation + ' ' + second.expr + ')'
    };
    steps.push(first.value + ' ' + operation + ' ' + second.value + ' = ' + value);
    tokens = tokens.filter(x => x.id !== first.id && x.id !== second.id);
    tokens.push(result);
    chosen = null;
    operation = null;
    render();
    say(value === draw.target ? 'Cible atteinte ! Valide ton calcul, ou cherche un meilleur score.' : 'Bien joué. Continue avec les cartes restantes.');
  }
  function score(token) {
    let mathador = token.used.length === 5 &&
      operations.every(op => token.ops.includes(op)) && token.ops.length === 4;
    let raw = mathador ? 18 : 5 + token.ops.reduce((sum, op) => sum + weights[op],0);
    return Math.max(0, raw - (hintUsed ? 2 : 0));
  }
  function validate() {
    if (!active) return;
    let matches = tokens.filter(x => x.value === draw.target && x.ops.length === levels[currentLevel].steps);
    const required = currentLevel === 0 ? '+' : currentLevel === 1 ? '−' :
      currentLevel === 2 ? '×' : currentLevel === 4 || currentLevel === 6 ? '÷' : null;
    if (required) matches = matches.filter(x => x.ops.includes(required));
    if (currentLevel >= 7) matches = matches.filter(x => x.used.length === 5);
    if (currentLevel === 8) matches = matches.filter(x => operations.every(op => x.ops.includes(op)));
    if (!matches.length) {
      say('Atteins la cible en ' + levels[currentLevel].steps + ' calcul' +
        (levels[currentLevel].steps > 1 ? 's' : '') +
        (required ? ' avec ' + ({'+':'une addition','−':'une soustraction','×':'une multiplication','÷':'une division'})[required] + '.' :
          currentLevel >= 7 ? ' avec les cinq cartes.' : '.') , 'error');
      return;
    }
    let token = matches.sort((a,b) => score(b) - score(a))[0];
    best = score(token);
    bestExpression = token.expr;
    player.points[currentLevel] = Math.max(player.points[currentLevel] || 0,best);
    player.completed = Math.max(player.completed,currentLevel + 1);
    persist(); showRankings();
    finish(best === 18 ? 'Coup Mathador !' : 'Défi réussi ! ' + best + ' points.');
    $('next').hidden = player.completed >= levels.length;
    showLevel();
  }
  function finish(message) {
    if (!active) return;
    active = false;
    clearInterval(timer); timer = null;
    $('player-name').disabled = false;
    $('series-label').textContent = player.name + ' · Défi ' + (currentLevel + 1) + '/9 terminé';
    render();
    say(message + (best ? ' Ton parcours est enregistré sur cet appareil.' : ' Réessaie pour avancer.'), best ? 'success' : '');
    let solution = $('solution'); solution.replaceChildren();
    let title = document.createElement('strong');
    title.textContent = 'Une solution possible en ' + draw.witness.length + ' calcul' +
      (draw.witness.length > 1 ? 's' : '') + ' :';
    solution.appendChild(title);
    let list = document.createElement('ol');
    draw.witness.forEach(line => {
      let item = document.createElement('li'); item.textContent = line; list.appendChild(item);
    });
    solution.appendChild(list);
    if (bestExpression) {
      let personal = document.createElement('p');
      personal.textContent = 'Ton calcul : ' + bestExpression;
      solution.appendChild(personal);
    }
    solution.hidden = false;
    showLevel();
  }
  function render() {
    $('target').textContent = draw.target;
    renderClock();
    $('best').textContent = 'Ce défi : ' + best + ' point' + (best > 1 ? 's' : '');
    let box = $('tokens');
    box.replaceChildren();
    tokens.forEach(token => {
      let button = document.createElement('button');
      button.type = 'button';
      button.className = 'token' + (chosen === token.id ? ' selected' : '') + (token.id >= 5 ? ' result' : '');
      button.textContent = token.value;
      button.title = token.expr;
      button.setAttribute('aria-label','Nombre ' + token.value + (token.id >= 5 ? ', résultat de ' + token.expr : ''));
      button.disabled = !active;
      button.addEventListener('click',() => selectToken(token.id));
      box.appendChild(button);
    });
    let ops = $('operations');
    ops.replaceChildren();
    operations.forEach(op => {
      let button = document.createElement('button');
      button.type = 'button';
      button.className = 'op' + (operation === op ? ' selected' : '');
      button.textContent = op;
      button.title = (op === '+' ? 'Addition' : op === '−' ? 'Soustraction' : op === '×' ? 'Multiplication' : 'Division') + ' · ' + weights[op] + ' point' + (weights[op] > 1 ? 's' : '');
      button.disabled = !active || !allowed[currentLevel].includes(op);
      button.addEventListener('click',() => {
        if (chosen === null) { say('Choisis d’abord une carte.', 'error'); return; }
        operation = op;
        render();
      });
      ops.appendChild(button);
    });
    let list = $('steps');
    list.replaceChildren();
    steps.forEach(line => {
      let item = document.createElement('li');
      item.textContent = line;
      list.appendChild(item);
    });
    $('validate').disabled = !active || !tokens.some(x => x.value === draw.target);
    $('undo').disabled = !active || !undoStack.length;
    $('reset').disabled = !active || !steps.length;
    $('hint').disabled = !active || hintUsed;
    $('give-up').disabled = !active;
    $('instructions').textContent = chosen === null ? 'Choisis un nombre, une opération, puis un autre nombre.' :
      operation === null ? 'Choisis une opération.' : 'Choisis le deuxième nombre.';
    $('launch').disabled = active;
    $('launch').textContent = player && !active ? 'Rejouer ou continuer →' : 'Commencer mon parcours →';
  }
  try {
    const last = localStorage.getItem('zoumai-mathador-last-name');
    if (last) $('player-name').value = last;
  } catch (error) {}
  showLevel(); showRankings();
  $('player-name').addEventListener('change', () => {
    const name = cleanName($('player-name').value);
    player = profiles[profileKey(name)] || null;
    showLevel();
  });
  $('launch').addEventListener('click', () => {
    try { localStorage.setItem('zoumai-mathador-last-name',cleanName($('player-name').value)); } catch (error) {}
    start();
  });
  $('next').addEventListener('click', () => start(Math.min(player.completed,levels.length-1)));
  $('validate').addEventListener('click', validate);
  $('undo').addEventListener('click', () => {
    if (!active || !undoStack.length) return;
    let snapshot = undoStack.pop();
    tokens = snapshot.tokens;
    steps = snapshot.steps;
    nextId = snapshot.nextId;
    chosen = null;
    operation = null;
    render();
    say('Dernier calcul annulé.');
  });
  $('reset').addEventListener('click', () => { if (active) { resetMoves(); say('Reprends le même tirage. Le chrono continue.'); } });
  $('hint').addEventListener('click', () => {
    if (!active || hintUsed) return;
    hintUsed = true;
    render();
    say('Indice : essaie de commencer par « ' + draw.witness[0] + ' ». Ce tirage vaudra 2 points de moins.');
  });
  $('give-up').addEventListener('click', () => finish('Une solution est affichée ci-dessous.'));

})();
