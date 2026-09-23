(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const weights = {'+':1, '−':2, '×':1, '÷':3};
  const operations = ['+', '−', '×', '÷'];
  const TOTAL_SECONDS = 240;
  let data = [], draw = null, tokens = [], steps = [], undoStack = [];
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
  function smallNumbers(series) {
    let questions = (data[series] || []).flatMap(fiche => fiche.questions || []);
    let pool = [];
    questions.forEach(item => {
      let match = item.q.match(/^Calcule : (\d+)\s*[×+−÷]\s*(\d+)\s*= \?$/);
      if (match) [match[1],match[2]].forEach(n => {
        n = Number(n);
        if (n >= 1 && n <= 12) pool.push(n);
      });
    });
    return pool.length >= 5 ? pool : [2,3,4,5,6,7,8,9,10,11,12];
  }
  function findWitness(cards) {
    let found = [];
    const valid = x => Number.isInteger(x) && x > 0;
    function add(target, lines) {
      if (valid(target) && target >= 20 && target <= 99 && !cards.includes(target)) {
        found.push({target, lines});
      }
    }
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      if (j === i) continue;
      for (let k = 0; k < 5; k++) {
        if (k === i || k === j) continue;
        for (let l = 0; l < 5; l++) {
          if (l === i || l === j || l === k) continue;
          let e = [0,1,2,3,4].find(x => ![i,j,k,l].includes(x));
          let [a,b,c,d,f] = [cards[i],cards[j],cards[k],cards[l],cards[e]];
          let x = a / b, y = c * d, z = x + y;
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
    return found.length ? found[random(found.length)] : null;
  }
  function newDraw(series) {
    let pool = smallNumbers(series);
    for (let attempt = 0; attempt < 180; attempt++) {
      let cards = Array.from({length:5}, () => pool[random(pool.length)]);
      if (new Set(cards).size < 3) continue;
      let witness = findWitness(cards);
      if (witness) return {cards, target:witness.target, witness:witness.lines};
    }
    return {cards:[2,4,6,7,9],target:32,witness:['6 ÷ 2 = 3','4 × 9 = 36','3 + 36 = 39','39 − 7 = 32']};
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
  function start() {
    clearInterval(timer);
    let series = Number($('serie').value);
    draw = newDraw(series);
    seconds = TOTAL_SECONDS;
    hintUsed = false;
    best = 0;
    bestExpression = '';
    active = true;
    $('serie').disabled = true;
    $('game').hidden = false;
    $('solution').hidden = true;
    $('series-label').textContent = 'Série ' + (series + 1) + ' · Tirage en cours';
    resetMoves();
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
    let matches = tokens.filter(x => x.value === draw.target);
    if (!matches.length) { say('Atteins d’abord la cible avec les cartes.', 'error'); return; }
    let token = matches.sort((a,b) => score(b) - score(a))[0];
    let points = score(token);
    if (points > best) {
      best = points;
      bestExpression = token.expr;
      try {
        let key = 'zoumai-mathador-serie-' + $('serie').value;
        localStorage.setItem(key,String(Math.max(points,Number(localStorage.getItem(key) || 0))));
      } catch (error) {}
    }
    if (points === 18) { finish('Coup Mathador ! Les cinq nombres et les quatre opérations : 18 points.'); return; }
    resetMoves();
    say('Solution validée : ' + points + ' points. Recommence ce tirage pour essayer de faire mieux !', 'success');
  }
  function finish(message) {
    if (!active) return;
    active = false;
    clearInterval(timer);
    timer = null;
    $('serie').disabled = false;
    $('series-label').textContent = 'Série ' + (Number($('serie').value) + 1) + ' · Tirage terminé';
    render();
    say(message + ' Meilleur score : ' + best + ' point' + (best > 1 ? 's' : '') + '.', best ? 'success' : '');
    let solution = $('solution');
    solution.replaceChildren();
    let title = document.createElement('strong');
    title.textContent = 'Une solution possible avec les cinq nombres et les quatre opérations :';
    solution.appendChild(title);
    let list = document.createElement('ol');
    draw.witness.forEach(line => {
      let item = document.createElement('li');
      item.textContent = line;
      list.appendChild(item);
    });
    solution.appendChild(list);
    if (bestExpression) {
      let personal = document.createElement('p');
      personal.textContent = 'Ta meilleure expression : ' + bestExpression;
      solution.appendChild(personal);
    }
    solution.hidden = false;
  }
  function render() {
    $('target').textContent = draw.target;
    renderClock();
    $('best').textContent = 'Meilleur : ' + best + ' point' + (best > 1 ? 's' : '');
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
      button.disabled = !active;
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
    $('launch').textContent = active ? 'Autre tirage →' : 'Lancer un tirage →';
  }
  for (let i = 1; i <= 35; i++) $('serie').add(new Option('Série ' + i,i-1));
  let requested = Number(new URLSearchParams(location.search).get('serie'));
  if (requested >= 1 && requested <= 35) $('serie').value = requested - 1;
  $('launch').addEventListener('click', start);
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
  fetch('calcul-mental-jeux.json').then(response => {
    if (!response.ok) throw Error('Données indisponibles');
    return response.json();
  }).then(json => { if (Array.isArray(json) && json.length === 35) data = json; }).catch(() => {});
})();
