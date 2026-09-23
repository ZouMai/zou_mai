(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let deck = [], index = 0, points = 0, misses = [], answered = false;
  function shuffle(array) {
    let list = [...array];
    for (let i = list.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [list[i],list[j]] = [list[j],list[i]];
    }
    return list;
  }
  function fraction(n,d) {
    return '<span class="fraction" aria-label="' + n + ' sur ' + d + '"><span>' + n + '</span><span>' + d + '</span></span>';
  }
  function fractionChoices(n,d) {
    let chosen = [{key:n+'/'+d,label:fraction(n,d),top:n,bottom:d}];
    let candidates = [];
    for (let top = 1; top <= 7; top++) {
      for (let bottom = 2; bottom <= 8; bottom++) {
        if (top <= bottom && top * d !== n * bottom) {
          candidates.push({key:top+'/'+bottom,label:fraction(top,bottom),top,bottom});
        }
      }
    }
    candidates.sort((a,b) => {
      let score = x => (x.bottom === d ? 0 : x.top === n ? 1 : 2) * 100 +
        Math.abs(x.top - n) * 10 + Math.abs(x.bottom - d);
      return score(a) - score(b);
    });
    for (let c of candidates) {
      if (chosen.length === 4) break;
      if (chosen.some(x => x.top * c.bottom === c.top * x.bottom)) continue;
      chosen.push(c);
    }
    return shuffle(chosen.map(x => ({key:x.key,label:x.label})));
  }
  function numberChoices(correct,near) {
    let nums = [correct,...near,correct+1,correct-1,correct+2,correct+3,1,2,3,4,5,6,7,8]
      .filter(x => x > 0);
    let distinct = [...new Set(nums)].slice(0,4);
    return shuffle(distinct.map(x => ({key:String(x),label:String(x)})));
  }
  function reading(n,d) {
    return {
      n,d,prompt:'Quelle fraction de l’unité est colorée ?',correct:n+'/'+d,
      options:fractionChoices(n,d),
      explanation:'L’unité est partagée en '+d+' parts égales ; '+n+' sont colorées. La fraction est '+n+'/'+d+'.',
      review:'Lire '+n+'/'+d+' dans une unité partagée en '+d+' parts.'
    };
  }
  function counting(n,d,what) {
    let isParts = what === 'parts',correct = isParts ? d : n;
    return {
      n,d,
      prompt:isParts ? 'En combien de parts égales cette unité est-elle partagée ?' :
        'Combien de parts de cette unité sont colorées ?',
      correct:String(correct),
      options:numberChoices(correct,isParts?[n,d-1,d+1]:[d,n-1,n+1]),
      explanation:isParts ?
        'Compte toutes les parts de l’unité, colorées ou non : il y en a '+d+'. C’est le dénominateur.' :
        'Compte seulement les parts colorées : il y en a '+n+'. C’est le numérateur.',
      review:isParts?'Compter les '+d+' parts égales de l’unité.':'Compter les '+n+' parts colorées.'
    };
  }
  function meaning(n,d,word) {
    let numerator = word === 'numérateur';
    let correct = numerator ? n+' parts colorées' : d+' parts égales dans l’unité';
    let wrong = numerator ?
      [d+' parts égales dans l’unité',n+' unités entières','La taille de chaque part'] :
      [d+' parts colorées',n+' parts égales dans l’unité','Le nombre d’unités entières'];
    return {
      n,d,prompt:'Dans '+n+'/'+d+', que désigne le '+(numerator?n:d)+' ?',
      correct,options:shuffle([correct,...wrong].map(x => ({key:x,label:x}))),
      explanation:numerator ?
        'Le nombre du haut est le numérateur : '+n+' parts sont colorées.' :
        'Le nombre du bas est le dénominateur : l’unité est partagée en '+d+' parts égales.',
      review:'Distinguer le numérateur et le dénominateur dans '+n+'/'+d+'.'
    };
  }
  function build() {
    let reads = shuffle([[1,2],[2,3],[3,4],[2,5],[5,6],[3,8]]).map(x => reading(...x));
    let counts = shuffle([
      counting(1,3,'parts'),counting(3,5,'parts'),
      counting(2,4,'color'),counting(4,6,'color')
    ]);
    let tasks = [...reads,...counts,meaning(3,4,'dénominateur'),meaning(2,5,'numérateur')];
    for (let q of tasks) {
      let keys = q.options.map(x => x.key);
      if (keys.length !== 4 || new Set(keys).size !== 4 ||
          keys.filter(x => x === q.correct).length !== 1) {
        throw new Error('Réponses incohérentes pour '+q.prompt+' ('+q.n+'/'+q.d+')');
      }
    }
    return tasks;
  }
  function drawUnit(n,d) {
    let box = $('visual');
    box.replaceChildren();
    let label = document.createElement('span');
    label.className = 'unit-label';
    label.textContent = '1 UNITÉ';
    box.appendChild(label);
    let bar = document.createElement('div');
    bar.className = 'unit-bar';
    bar.style.gridTemplateColumns = 'repeat('+d+', minmax(0, 1fr))';
    bar.setAttribute('role','img');
    bar.setAttribute('aria-label','Une unité partagée en '+d+' parts égales, dont '+n+' colorées');
    for (let i = 0; i < d; i++) {
      let part = document.createElement('span');
      part.className = 'unit-part'+(i < n?' filled':'');
      bar.appendChild(part);
    }
    box.appendChild(bar);
    let caption = document.createElement('div');
    caption.className = 'unit-caption';
    caption.textContent = 'Tout le rectangle entouré en doré représente une unité.';
    box.appendChild(caption);
  }
  function show() {
    answered = false;
    let q = deck[index];
    $('counter').textContent = 'Défi '+(index+1)+' sur '+deck.length;
    $('score').textContent = '★ '+points+' point'+(points > 1?'s':'');
    $('barProgress').style.width = index/deck.length*100+'%';
    $('question').textContent = q.prompt;
    drawUnit(q.n,q.d);
    let choices = $('choices');
    choices.replaceChildren();
    q.options.forEach(option => {
      let button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.innerHTML = option.label;
      button.dataset.answer = option.key;
      button.addEventListener('click',() => answer(button,option.key));
      choices.appendChild(button);
    });
    $('feedback').className = 'feedback hidden';
    $('next').classList.add('hidden');
    $('next').textContent = index === deck.length-1?'Voir mon résultat →':'Défi suivant →';
  }
  function answer(button,value) {
    if (answered) return;
    answered = true;
    let q = deck[index],ok = value === q.correct;
    if (ok) points++; else misses.push(q.review);
    [...$('choices').children].forEach(choice => {
      choice.disabled = true;
      if (choice.dataset.answer === q.correct) choice.classList.add('correct');
    });
    if (!ok) button.classList.add('wrong');
    $('feedback').className = 'feedback '+(ok?'good':'bad');
    $('feedback').textContent = (ok?'Bravo ! ':'Regarde bien l’unité. ')+q.explanation;
    $('score').textContent = '★ '+points+' point'+(points > 1?'s':'');
    $('next').classList.remove('hidden');
  }
  function finish() {
    $('game').classList.add('hidden');
    $('end').classList.remove('hidden');
    $('endTitle').textContent = points+' bonnes réponses sur '+deck.length;
    $('endText').textContent = points >= 10 ?
      'Bravo ! Tu sais repérer l’unité et lire les premières fractions.' :
      'Reprends les défis à revoir : commence toujours par repérer une unité entière.';
    let review = $('review');
    review.replaceChildren();
    review.classList.toggle('hidden',!misses.length);
    if (misses.length) {
      let title = document.createElement('strong'),list = document.createElement('ul');
      title.textContent = 'À revoir :';
      review.appendChild(title);
      misses.forEach(text => {
        let item = document.createElement('li');
        item.textContent = text;
        list.appendChild(item);
      });
      review.appendChild(list);
    }
  }
  function start() {
    deck = build();
    index = 0;points = 0;misses = [];
    $('intro').classList.add('hidden');
    $('end').classList.add('hidden');
    $('game').classList.remove('hidden');
    show();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $('start').addEventListener('click',start);
  $('retry').addEventListener('click',start);
  $('next').addEventListener('click',() => {
    if (!answered) return;
    index++;
    if (index >= deck.length) finish(); else show();
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();
