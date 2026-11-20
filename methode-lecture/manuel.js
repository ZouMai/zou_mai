"use strict";

const app = document.querySelector("#app");
const steps = ["Découvrir", "Repérer", "Assembler", "Lire", "Écrire", "Retenir"];
const values = {
  "é":"e","e":"schwa","è":"e_open","ê":"e_open","ai":"e_open","ei":"e_open",
  "au":"o","eau":"o","c":"k","qu":"k","k":"k","g devant e, i":"j",
  "c devant e, i":"s","ç":"s","ss":"s","s entre voyelles":"z","gu":"g",
  "ge devant a, o":"j","en":"an","ain":"in","ein":"in","eu":"eu_closed",
  "œu":"eu_open","ill":"y","y":"y","ph":"f"
};
const extraValues = {"oi":"wa","oin":"wɛ̃","ui":"ɥi","br":"bʁ","tr":"tʁ","pl":"pl","h muet":"∅"};
const writtenRules = {
  "c devant e, i":"c","g devant e, i":"g","s entre voyelles":"s","ge devant a, o":"ge","h muet":"h"
};
const notes = {
  "s":"Ici, le s se lit comme dans salade. En fin de certains mots, il ne se prononce pas.",
  "o":"On prend le o final de robot comme modèle. Dans sol, le o est plus ouvert.",
  "e":"On prend le e de la première syllabe de melon comme modèle. Montre le rôle du e final dans lune.",
  "c":"On travaille le c qui se prononce comme au début de carotte.",
  "g":"On travaille le g qui se prononce comme au début de gomme.",
  "h muet":"Le h initial de hibou ne correspond à aucun son. On l’identifie à l’écrit.",
  "br":"b et r se prononcent successivement.","tr":"t et r se prononcent successivement.",
  "pl":"p et l se prononcent successivement.",
  "oi":"Fais entendre la transition entre /w/ et /a/.",
  "s entre voyelles":"Dans rose et valise, le s placé entre deux voyelles se lit /z/.",
  "œu":"Dans cœur, œu a une valeur ouverte. Dans nœud, sa valeur est fermée.",
  "ill":"Dans fille et bille, ill note /j/. Cette correspondance dépend du mot.",
  "y":"Ici, y se lit /j/ en début de yaourt. Il a d’autres valeurs dans d’autres mots."
};
const lessons = periods.flatMap(([title, rows], period) => rows.map((row, index) => {
  const [graph, word, icon, distractors, reading, writing, sentence] = row;
  const [syllables, words] = reading.split(" / ");
  const value = values[graph] || graph;
  return {
    id: period + "-" + index, period, graph, word, icon, distractors: distractors.split(","),
    syllables: syllables.split(" "), words: words ? words.split(" ") : [], writing, sentence,
    value, glyph: writtenRules[graph] || graph,
    ipa: window.RASED_PHONEME_BY_ID[value]?.ipa || extraValues[graph]
  };
}));

const workshops = [
  {id:"pb", title:"Écouter p et b", mode:"listen", items:[["panda","ballon","p"],["ballon","panda","b"],["bol","poule","b"],["poule","bol","p"]]},
  {id:"fv", title:"Écouter f et v", mode:"listen", items:[["vélo","fusée","v"],["fusée","vélo","f"],["fraise","vélo","f"],["vélo","fraise","v"]]},
  {id:"chj", title:"Écouter ch et j", mode:"listen", items:[["chat","jupe","ch"],["jupe","chat","j"],["chat","girafe","ch"],["girafe","chat","j"]]},
  {id:"bd", title:"Distinguer b et d", mode:"look", items:[["b","d"],["d","b"],["ba","da"],["di","bi"]]},
  {id:"ordre", title:"Lire la et al", mode:"read", items:[["la","al"],["il","li"],["fi","if"],["as","sa"]]},
  {id:"fusion", title:"Assembler deux sons", mode:"revision", from:["0-2","0-4","0-6","0-7"]},
  {id:"encodage", title:"Écrire avec les lettres mobiles", mode:"revision", from:["0-6","0-7","1-1","1-3","2-1","2-5"], writing:true}
];

const playCopy = {
  Découvrir:"Regarde les lettres. Touche le haut-parleur pour écouter le mot repère.",
  Repérer:"Écoute le mot modèle. Puis touche l’image où tu entends le même son.",
  Assembler:"Regarde les deux parties. Rapproche-les et lis la syllabe d’un seul élan.",
  Lire:"Lis à voix haute. Si tu lis une phrase, imagine la scène et raconte-la.",
  Écrire:"Écoute le mot ou la syllabe. Choisis les lettres dans l’ordre.",
  Retenir:"Retrouve les mêmes lettres que dans le modèle."
};

const storageKey = "zoumai.manuel-code.v1";
let progress;
try { progress = JSON.parse(localStorage.getItem(storageKey)) || {done:[]}; }
catch { progress = {done:[]}; }
if (!Array.isArray(progress.done)) progress.done = [];
let tab = "graph";
let current = null;
let stage = 0;
let trial = [];
let audio = null;
let selected = [];
let mistake = 0;
let activityPassed = false;
let tinyChoice = false;
let hasAudioGesture = false;
let run = null;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {}
}
function stop() {
  audio?.pause();
  audio = null;
  window.speechSynthesis?.cancel();
}
function say(message, rate = .93) {
  stop();
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    inform("L’adulte peut lire la consigne ou dire le modèle.", false);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  const voice = window.speechSynthesis.getVoices().find(item => item.lang === "fr-FR" && item.localService);
  if (voice) utterance.voice = voice;
  utterance.onerror = event => {
    if (!["canceled","interrupted"].includes(event.error)) inform("L’adulte peut dire le modèle.", false);
  };
  window.speechSynthesis.speak(utterance);
}

function modelSound(lesson) {
  stop();
  const source = window.RASED_PHONEME_BY_ID[lesson.value]?.audioUrl;
  if (!source) {
    say(lesson.word, .87);
    inform("Écoute le mot repère. L’adulte peut isoler le son.", false);
    return;
  }
  const clip = new Audio(source);
  audio = clip;
  clip.play().catch(() => {
    if (audio === clip) {
      say(lesson.word, .87);
      inform("Écoute le mot repère. L’adulte peut isoler le son.", false);
    }
  });
}

function inform(message, correct) {
  const node = document.querySelector("#feedback");
  if (node) {
    node.textContent = message;
    node.className = "feedback " + (correct ? "ok" : "note");
  }
}
function shuffle(values) {
  const items = [...values];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
function actionButton(label, fn, css = "", parent = null) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = css;
  button.textContent = label;
  button.addEventListener("click", fn);
  parent?.append(button);
  return button;
}
function headingFocus() {
  const h = app.querySelector("h1");
  h.tabIndex = -1;
  h.focus();
}
function lessonButton(lesson, parent, soundEntry = false) {
  const button = actionButton("", () => openLesson(lesson, soundEntry ? 1 : 0), "lesson", parent);
  const graph = document.createElement("b");
  graph.textContent = soundEntry ? lesson.icon + " " + lesson.word : lesson.graph;
  button.append(graph);
  if (progress.done.includes(lesson.id)) {
    const done = document.createElement("span");
    done.className = "done";
    done.textContent = "✓";
    done.setAttribute("aria-label", "Séance terminée");
    button.append(done);
  }
}

function renderHome() {
  stop();
  current = null;
  run = null;
  app.innerHTML = `
    <section class="hero">
      <div><p class="kicker">CP · Ressources Rased</p><h1>Méthode de lecture</h1>
      <p>Avec le loup bleu, écoute les sons, assemble les lettres et lis tes premiers mots.</p>
      <button type="button" id="intro">🔊 Écouter</button> <button class="primary" type="button" id="continue"></button></div>
      <img src="../images/loup-bleu-original.png" alt="Le loup bleu Zou Maï">
    </section>
    <div class="entries" aria-label="Entrées du manuel"></div>
    <section class="section" id="library"></section>
    <details class="section adult"><summary>Espace enseignant</summary>
      <p>Les cinq périodes suivent une entrée graphémique. L’entrée par l’oral regroupe les graphies qui peuvent coder le même son. Pour un élève débutant, sélectionner d’abord la leçon correspondant aux graphies déjà vues.</p>
      <p>Sur papier, refaire la fusion avec deux jetons qui se rapprochent, puis dicter une nouvelle syllabe. Prendre en charge les modèles marqués « avec l’adulte ». Écouter les réalisations de l’élève pendant la lecture à voix haute.</p>
      <p><label>Filtrer les leçons <input id="filter" type="search" placeholder="Graphème, son ou mot repère"></label></p>
      <div id="matches" class="grid"></div>
      <p><label><input type="checkbox" id="fewer"> Deux images au choix dans les leçons</label></p>
      <p><a href="https://codeo.mdi-editions.com/9782223114207">Codéo CP</a> · <a href="https://www.leslettresbleues.fr/IMG/pdf/gp_cp_l1-l7-5.pdf">Je lis, j’écris</a> · <a href="https://www.education.gouv.fr/bo/2024/Hebdo41/MENE2415135A">Programme de français du cycle 2</a></p>
      <p>Les consignes et mots modèles utilisent la voix française de l’appareil. Les sons isolés disponibles proviennent de <a href="https://commons.wikimedia.org/wiki/Category:IPA_pronunciation">Wikimedia Commons</a>. Les fusions et dictées de syllabes isolées sont guidées par l’adulte.</p>
    </details>`;
  document.querySelector("#intro").onclick = () => {
    hasAudioGesture = true;
    say("Choisis les lettres, les images, ou un atelier. Tu peux aussi reprendre ta leçon.");
  };
  const resume = lessons.find(lesson => lesson.id === progress.id);
  const next = document.querySelector("#continue");
  next.textContent = resume ? "Reprendre" : "Commencer";
  next.onclick = () => openLesson(resume || lessons[0], resume ? progress.stage : 0);
  const modes = [["graph","🔤","Je vois les lettres"],["sound","👂","J’entends un son"],["work","🧩","Je m’entraîne"]];
  for (const [key, icon, label] of modes) {
    const button = actionButton("", () => {tab = key; renderLibrary();}, "entry", document.querySelector(".entries"));
    button.dataset.tab = key;
    button.innerHTML = `<span aria-hidden="true">${icon}</span>${label}`;
  }
  document.querySelector("#filter").oninput = event => {
    const value = event.target.value.trim().toLocaleLowerCase("fr");
    const matches = document.querySelector("#matches");
    matches.replaceChildren();
    if (!value) return;
    const found = lessons.filter(item => [item.graph,item.ipa,item.word].some(text => text?.includes(value)));
    for (const lesson of found) lessonButton(lesson, matches);
    if (!found.length) matches.textContent = "Aucune leçon trouvée.";
  };
  const fewer = document.querySelector("#fewer");
  fewer.checked = tinyChoice;
  fewer.onchange = () => { tinyChoice = fewer.checked; };
  renderLibrary();
}
function renderLibrary() {
  document.querySelectorAll(".entry").forEach(item => item.setAttribute("aria-pressed", item.dataset.tab === tab));
  const library = document.querySelector("#library");
  library.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = {graph:"Le manuel",sound:"L’imagier des sons",work:"Les ateliers"}[tab];
  library.append(title);
  if (tab === "work") {
    const choices = document.createElement("div");
    choices.className = "grid";
    for (const workshop of workshops) actionButton(workshop.title, () => openWorkshop(workshop), "", choices);
    library.append(choices);
    return;
  }
  if (tab === "sound") {
    const groups = new Map();
    for (const lesson of lessons.filter(item => item.ipa && item.ipa !== "∅")) {
      const group = groups.get(lesson.ipa) || [];
      group.push(lesson);
      groups.set(lesson.ipa, group);
    }
    for (const [ipa, group] of groups) {
      const row = document.createElement("div");
      row.className = "period grid";
      actionButton("🔊 " + group[0].icon, () => modelSound(group[0]), "", row)
        .setAttribute("aria-label", "Écouter le modèle " + group[0].word);
      for (const lesson of group) lessonButton(lesson, row, true);
      row.setAttribute("aria-label", "Son " + ipa);
      library.append(row);
    }
    return;
  }
  periods.forEach(([name], period) => {
    const details = document.createElement("details");
    details.className = "period";
    details.open = period === (lessons.find(item => item.id === progress.id)?.period ?? 0);
    const summary = document.createElement("summary");
    summary.textContent = "Période " + (period + 1) + " · " + name;
    details.append(summary);
    const row = document.createElement("div");
    row.className = "grid";
    const group = lessons.filter(item => item.period === period);
    for (const lesson of group) lessonButton(lesson, row);
    actionButton("Révision cumulative", () => {
      const known = lessons.filter(item => item.period <= period);
      const picks = [...shuffle(known.filter(item => item.period < period)).slice(0, 3), ...shuffle(group).slice(0, 4)];
      openWorkshop({title:"Révision · période " + (period + 1), mode:"revision", from:picks.map(item => item.id)});
    }, "", row);
    details.append(row);
    library.append(details);
  });
}

function openLesson(lesson, index = 0) {
  current = lesson;
  run = null;
  setStage(Number.isInteger(index) && index >= 0 && index < steps.length ? index : 0);
}
function setStage(index) {
  stop();
  stage = index;
  selected = [];
  trial = [];
  mistake = 0;
  activityPassed = false;
  if (!run) {
    progress.id = current.id;
    progress.stage = stage;
    save();
  }
  renderLesson();
  headingFocus();
  if (hasAudioGesture) say(currentPrompt());
}
function adultWriting() {
  return !lessons.some(item => item.words.includes(current.writing)) &&
    !["a","i"].includes(current.writing);
}
function currentPrompt() {
  if (stage === 1 && isVisual()) return "Touche les mêmes lettres que dans le modèle.";
  if (stage === 4 && adultWriting()) return "Écoute la syllabe dictée par l’adulte. Choisis les lettres dans l’ordre.";
  return playCopy[steps[stage]];
}
function isVisual() {
  return ["br","tr","pl","h muet","gu","ge devant a, o","g devant e, i","c devant e, i"].includes(current.graph);
}
function renderLesson() {
  app.innerHTML = `
    <div class="toolbar"><div><button id="back" type="button">Sommaire</button></div><div>
      <button id="listen" type="button">🔊 Consigne</button></div></div>
    <nav class="steps" aria-label="Étapes de la leçon"></nav>
    <section class="work"><p id="context"></p><h1></h1><p class="prompt"></p><div id="task"></div>
      <p id="feedback" class="feedback" aria-live="polite"></p><div class="actions"></div></section>
    <details class="section adult"><summary>Repères pour l’adulte</summary><p id="guide"></p><p id="adult-model"></p></details>`;
  document.querySelector("#back").onclick = () => { renderHome(); headingFocus(); };
  document.querySelector("#listen").onclick = () => { hasAudioGesture = true; say(currentPrompt()); };
  for (const [index, label] of steps.entries()) {
    if (run) break;
    const button = actionButton(label, () => setStage(index), "", app.querySelector(".steps"));
    button.setAttribute("aria-pressed", index === stage);
  }
  app.querySelector("h1").textContent = steps[stage] + (stage === 1 && !isVisual() ? "" : " · " + current.graph);
  app.querySelector("#context").textContent = run
    ? run.title + " · " + (run.index + 1) + "/" + run.from.length
    : "Période " + (current.period + 1) + " · " + (stage + 1) + "/" + steps.length;
  app.querySelector(".prompt").textContent = currentPrompt();
  app.querySelector("#guide").textContent = (notes[current.graph] || "Fais entendre le son dans « " + current.word + " », puis montre les lettres correspondantes.") +
    " Demande une lecture à voix haute et un essai sur ardoise.";
  if (stage === 4 && adultWriting()) {
    app.querySelector("#adult-model").textContent = "Modèle à dicter en gardant l’écran tourné vers l’adulte ou en lisant ce repère à l’avance : " + current.writing + ".";
  }
  const task = document.querySelector("#task");
  const actions = document.querySelector(".actions");
  const next = actionButton(stage === 5 ? "Terminer" : "Continuer", () => {
    if (run) {
      nextRevision();
    } else if (stage === 5) {
      if (!progress.done.includes(current.id)) progress.done.push(current.id);
      const upcoming = lessons[lessons.indexOf(current) + 1];
      progress.id = upcoming?.id || current.id;
      progress.stage = 0;
      save();
      renderHome();
      headingFocus();
    } else {
      setStage(stage + 1);
    }
  }, "primary", actions);
  if ([1,4,5].includes(stage)) next.disabled = true;
  if (stage === 0) discover(task);
  if (stage === 1) isVisual() ? visual(task, next) : matchSound(task, next);
  if (stage === 2) fusion(task);
  if (stage === 3) reading(task);
  if (stage === 4) writing(task, next);
  if (stage === 5) visual(task, next);
}

function focusCard(parent, text) {
  const node = document.createElement("div");
  node.className = "focus";
  node.textContent = text;
  parent.append(node);
  return node;
}
function discover(task) {
  focusCard(task, current.glyph + "   " + current.glyph.toLocaleUpperCase("fr"));
  const choices = document.createElement("div");
  choices.className = "choices";
  task.append(choices);
  actionButton(current.icon + "  🔊 " + current.word, () => say(current.word, .87), "choice", choices);
  if (current.ipa !== "∅") actionButton("🔊 Le son", () => modelSound(current), "", choices);
}
function pictureChoices(parent, words, icons, onChoose) {
  const choices = document.createElement("div");
  choices.className = "choices";
  parent.append(choices);
  for (const word of words) {
    const pair = document.createElement("div");
    pair.className = "pair";
    const pick = actionButton(icons[word] || "🖼️", () => onChoose(word, pick), "picture", pair);
    pick.setAttribute("aria-label", "Choisir : " + word);
    const hear = actionButton("🔊", () => say(word), "", pair);
    hear.setAttribute("aria-label", "Écouter : " + word);
    choices.append(pair);
  }
}
function pass(next, button, message) {
  activityPassed = true;
  if (button) button.setAttribute("aria-pressed", "true");
  inform(message, true);
  next.disabled = false;
}
function matchSound(task, next) {
  actionButton("🔊 Mot modèle", () => say(oralModels[current.graph] || current.word, .87), "", task);
  trial = shuffle([current.word, ...current.distractors.slice(0, tinyChoice ? 1 : 2)]);
  pictureChoices(task, trial, {...oralPictures, [current.word]:current.icon}, (word, button) => {
    if (activityPassed) return;
    if (word === current.word) {
      pass(next, button, "Tu as retrouvé le son dans « " + current.word + " ». Il s’écrit ici « " + current.glyph + " ».");
      say(current.word + ". Tu as retrouvé le son.");
      return;
    }
    mistake++;
    say("Écoute encore : " + (oralModels[current.graph] || current.word));
    inform(mistake > 1 ? "Réécoute le modèle, puis compare avec les autres images." : "Réécoute le mot modèle.", false);
  });
}
function visual(task, next) {
  focusCard(task, current.glyph);
  const choices = document.createElement("div");
  choices.className = "choices";
  task.append(choices);
  const similar = {b:"d",d:"b",p:"q",q:"p",m:"n",n:"m",u:"n",an:"na",en:"ne",on:"no",ai:"ia",ou:"uo"};
  const wrong = [...new Set([similar[current.glyph], ...lessons.filter(item => item.period <= current.period && item.glyph.length === current.glyph.length).map(item => item.glyph), "é","l"])].filter(item => item && item !== current.glyph);
  for (const choice of shuffle([current.glyph, ...wrong.slice(0,2)])) {
    const button = actionButton(choice, () => {
      if (activityPassed) return;
      if (choice === current.glyph) pass(next, button, "Tu as retrouvé « " + current.glyph + " ».");
      else inform("Compare la forme et l’ordre des lettres avec le modèle.", false);
    }, "choice", choices);
  }
}
function units(word) {
  const multigraphs = ["eau","oin","ain","ein","ill","ch","ou","on","an","en","in","oi","gn","ai","ei","au","ss","qu","gu","eu","œu","ui","ph"];
  const result = [];
  for (let i = 0; i < word.length;) {
    const part = multigraphs.find(item => word.startsWith(item, i)) || word[i];
    result.push(part);
    i += part.length;
  }
  return result;
}

function splitSyllable(syllable) {
  if (["c devant e, i","g devant e, i","h muet","ill"].includes(current.graph)) {
    const boundary = current.graph === "ill" ? syllable.indexOf("ill") : 0;
    if (current.graph === "ill" && boundary === 0) return [syllable];
    if (current.graph === "ill" && boundary > 0) return [syllable.slice(0,boundary), syllable.slice(boundary)];
  }
  const start = syllable.indexOf(current.glyph);
  if (start > 0) return [syllable.slice(0,start), syllable.slice(start)];
  if (start === 0 && syllable !== current.glyph) return [current.glyph, syllable.slice(current.glyph.length)];
  return [syllable];
}
function fusion(task) {
  const display = focusCard(task, "");
  display.classList.add("fusion");
  let index = 0;
  function update() {
    display.replaceChildren();
    display.classList.remove("join");
    for (const part of splitSyllable(current.syllables[index])) {
      const span = document.createElement("span");
      span.textContent = part;
      display.append(span);
    }
  }
  update();
  const choices = document.createElement("div");
  choices.className = "choices";
  task.append(choices);
  actionButton("Assembler", () => {
    display.classList.add("join");
    inform("Lis d’un seul élan. Avec l’adulte, écoute son modèle puis essaie à ton tour.", false);
  }, "primary", choices);
  actionButton("Autre assemblage", () => {index = (index + 1) % current.syllables.length; update(); inform("", false);}, "", choices)
    .disabled = current.syllables.length < 2;
}
function reading(task) {
  const panel = document.createElement("div");
  panel.className = "reading";
  task.append(panel);
  for (const item of [...current.syllables, ...current.words]) {
    const card = document.createElement("span");
    card.textContent = item;
    panel.append(card);
  }
  if (current.sentence) {
    focusCard(task, current.sentence);
    actionButton("🔊 Vérifier la phrase", () => say(current.sentence), "", task);
    const prompt = document.createElement("p");
    prompt.textContent = "Après ta lecture, raconte ce que tu as compris.";
    task.append(prompt);
  }
}
function writing(task, next) {
  const answer = units(current.writing);
  const useAdult = adultWriting();
  if (!useAdult) actionButton("🔊 Écouter la dictée", () => say(current.writing === "i" ? "i" : current.writing, .86), "", task);
  else {
    const helper = document.createElement("p");
    helper.textContent = "🎙️ Avec l’adulte. Il trouve le modèle à dicter dans les repères de la leçon.";
    task.append(helper);
  }
  const slots = document.createElement("div");
  slots.className = "tiles";
  slots.setAttribute("aria-label", "Lettres posées");
  task.append(slots);
  const bank = document.createElement("div");
  bank.className = "choices";
  task.append(bank);
  const pool = ["a","i","l","m","r","o","é","n","ch","ou","on"];
  const known = lessons.slice(0, lessons.indexOf(current) + 1).map(item => item.glyph);
  trial = shuffle([...answer, ...shuffle(pool.filter(item => known.includes(item) && !answer.includes(item))).slice(0,2)]);
  function refresh() {
    slots.replaceChildren();
    bank.replaceChildren();
    for (const index of selected) {
      actionButton(trial[index], () => {
        if (!activityPassed) { selected = selected.filter(item => item !== index); refresh(); }
      }, "", slots).setAttribute("aria-label", "Retirer " + trial[index]);
    }
    for (const [index, tile] of trial.entries()) {
      const button = actionButton(tile, () => {
        selected.push(index);
        refresh();
        if (!verify.disabled) verify.focus();
        else bank.querySelector("button:not([disabled])")?.focus();
      }, "choice", bank);
      button.disabled = selected.includes(index) || selected.length >= answer.length || activityPassed;
    }
    verify.disabled = selected.length !== answer.length || activityPassed;
  }
  const verify = actionButton("Vérifier", () => {
    if (selected.map(index => trial[index]).join("") === current.writing) {
      pass(next, null, "Tu as écrit « " + current.writing + " ».");
      refresh();
    } else {
      mistake++;
      inform(mistake > 1 ? "Compare avec le modèle « " + current.writing + " », puis reconstruis-le." : "Réécoute et reprends les lettres dans l’ordre.", false);
      selected = [];
      refresh();
    }
  }, "", task);
  refresh();
}

function openWorkshop(workshop) {
  if (workshop.mode === "revision") {
    run = {...workshop, index:0};
    nextRevision(true);
    return;
  }
  stop();
  current = null;
  let index = 0;
  function render() {
    const [answer, wrong, graph] = workshop.items[index];
    const listening = workshop.mode === "listen";
    const readingOrder = workshop.mode === "read";
    const prompt = listening ? "Écoute le mot modèle, puis retrouve le même premier son." :
      readingOrder ? "Lis les deux syllabes. Avec l’adulte, touche celle qu’il prononce." :
        "Regarde le modèle et retrouve les mêmes lettres.";
    app.innerHTML = `<section class="work"><p></p><h1></h1><button id="work-audio" type="button">🔊 Consigne</button>
      <p class="prompt"></p><div id="task"></div><p id="feedback" aria-live="polite" class="feedback"></p>
      <div class="actions"></div></section>`;
    app.querySelector("h1").textContent = workshop.title;
    app.querySelector(".work > p").textContent = (index + 1) + "/" + workshop.items.length;
    app.querySelector(".prompt").textContent = prompt;
    app.querySelector("#work-audio").onclick = () => {hasAudioGesture = true; say(prompt);};
    const task = document.querySelector("#task");
    const actions = app.querySelector(".actions");
    actionButton("Sommaire", () => {renderHome(); headingFocus();}, "", actions);
    const next = actionButton(index === workshop.items.length - 1 ? "Terminer" : "Continuer", () => {
      stop();
      if (++index === workshop.items.length) {renderHome(); headingFocus();}
      else render();
    }, "primary", actions);
    next.disabled = true;
    activityPassed = false;
    const model = {p:"pirate",b:"bébé",f:"farine",v:"valise",ch:"chou",j:"jardin"}[graph];
    function choose(value, button) {
      if (activityPassed) return;
      if (value === answer) pass(next, button, "C’est la bonne réponse.");
      else inform(listening ? "Écoute le début des deux mots." : "Reprends les lettres dans l’ordre.", false);
    }
    if (listening) {
      actionButton("🔊 Mot modèle", () => say(model), "", task);
      pictureChoices(task, shuffle([answer,wrong]), oralPictures, choose);
    } else {
      if (readingOrder) {
        const adult = document.createElement("details");
        adult.innerHTML = "<summary>Modèle à dicter par l’adulte</summary>";
        const model = document.createElement("p");
        model.textContent = answer;
        adult.append(model);
        task.append(adult);
      } else focusCard(task, answer);
      const choices = document.createElement("div");
      choices.className = "choices";
      task.append(choices);
      for (const value of shuffle([answer,wrong])) {
        const button = actionButton(value, () => choose(value, button), "choice", choices);
      }
    }
    headingFocus();
    if (hasAudioGesture) say(prompt);
  }
  render();
}
function nextRevision(initial = false) {
  if (!initial) run.index++;
  if (run.index === run.from.length) {
    renderHome();
    headingFocus();
    return;
  }
  current = lessons.find(item => item.id === run.from[run.index]);
  const exercise = run.writing ? 4 : run.title.startsWith("Assembler") ? 2 : [3,4,5][run.index % 3];
  setStage(exercise);
}
document.querySelector("#accueil").onclick = () => {renderHome(); headingFocus();};
window.addEventListener("pagehide", stop);
renderHome();
