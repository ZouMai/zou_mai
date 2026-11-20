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
  Repérer:"Touche l’image modèle pour écouter. Puis choisis une image où tu entends le même son.",
  Assembler:"Touche les lettres. Écoute comment elles se collent, puis redis la syllabe.",
  Lire:"Essaie de lire. Puis touche le mot pour écouter et vérifier.",
  Écrire:"Écoute la dictée. Touche les lettres dans l’ordre.",
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
let selected = [];
let mistake = 0;
let activityPassed = false;
let tinyChoice = false;
let hasAudioGesture = false;
let lastAudioRequest = 0;
let audioContext;
let clipSource;
const audioBuffers = new Map();
let run = null;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {}
}
function stop() {
  lastAudioRequest++;
  if (clipSource) {
    clipSource.onended = null;
    clipSource.stop();
    clipSource = null;
  }
  window.speechSynthesis?.cancel();
}
function audioNotice(message = "") {
  const node = document.querySelector("#audio-notice");
  if (node) node.textContent = message;
}
function unlockAudio() {
  hasAudioGesture = true;
  if (!audioContext) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (Context) audioContext = new Context();
  }
  if (audioContext?.state === "suspended") audioContext.resume().catch(() => {});
}
function loadBuffer(filename) {
  if (!audioBuffers.has(filename)) {
    const buffer = fetch(filename).then(response => {
      if (!response.ok) throw Error("Audio indisponible");
      return response.arrayBuffer();
    }).then(bytes => audioContext.decodeAudioData(bytes)).catch(error => {
      audioBuffers.delete(filename);
      throw error;
    });
    audioBuffers.set(filename, buffer);
  }
  return audioBuffers.get(filename);
}
async function playClip(key) {
  unlockAudio();
  stop();
  audioNotice();
  const clip = window.CODE_GAME_AUDIO?.[key] || window.CODE_AUDIO?.[key];
  if (!clip || !audioContext) return false;
  const request = lastAudioRequest;
  try {
    const [file, offset, duration] = clip;
    const buffer = await loadBuffer(file);
    if (request !== lastAudioRequest) return true;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => { if (clipSource === source) clipSource = null; };
    clipSource = source;
    source.start(0, offset, duration);
    return true;
  } catch {
    return request !== lastAudioRequest;
  }
}
async function say(message, rate = .93) {
  if (await playClip(message)) return;
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    audioNotice("🔇 Son indisponible. Tu peux continuer avec les images ou les lettres.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  const voice = window.speechSynthesis.getVoices().find(item => item.lang === "fr-FR" && item.localService);
  if (voice) utterance.voice = voice;
  utterance.onerror = event => {
    if (!["canceled","interrupted"].includes(event.error)) audioNotice("🔇 Son indisponible. Tu peux continuer avec les images ou les lettres.");
  };
  window.speechSynthesis.speak(utterance);
}
async function saySyllable(syllable, fallback) {
  if (await playClip("@syllabe:" + syllable)) return;
  if (fallback) fallback();
}
async function modelSound(lesson) {
  if (await playClip("@son:" + lesson.ipa)) return;
  say(lesson.word);
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
  const button = actionButton("", () => { unlockAudio(); openLesson(lesson, soundEntry ? 1 : 0); }, "lesson", parent);
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
    <p id="audio-notice" class="note" role="status"></p><div class="entries" aria-label="Entrées du manuel"></div>
    <section class="section" id="library"></section>
    <details class="section adult"><summary>Espace enseignant</summary>
      <p>Les cinq périodes suivent une entrée graphémique. L’entrée par l’oral regroupe les graphies qui peuvent coder le même son. Pour un élève débutant, sélectionner d’abord la leçon correspondant aux graphies déjà vues.</p>
      <p>Sur papier, refaire la fusion avec deux jetons qui se rapprochent, puis dicter une nouvelle syllabe. En accompagnement, écouter les réalisations de l’élève pendant la lecture à voix haute.</p>
      <p><label>Filtrer les leçons <input id="filter" type="search" placeholder="Graphème, son ou mot repère"></label></p>
      <div id="matches" class="grid"></div>
      <p><label><input type="checkbox" id="fewer"> Deux images au choix dans les leçons</label></p>
      <p><a href="https://codeo.mdi-editions.com/9782223114207">Codéo CP</a> · <a href="https://www.leslettresbleues.fr/IMG/pdf/gp_cp_l1-l7-5.pdf">Je lis, j’écris</a> · <a href="https://www.education.gouv.fr/bo/2024/Hebdo41/MENE2415135A">Programme de français du cycle 2</a></p>
      <p>Le parcours enfant dispose de clips audio intégrés. Voix de synthèse <a href="https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD">Piper SIWIS</a>. Illustrations <a href="https://github.com/jdecked/twemoji">Twemoji</a> © Twitter, Inc. et contributeurs, sous <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    </details>`;
  document.querySelector("#intro").onclick = () => {
    hasAudioGesture = true;
    say("Choisis les lettres, les images, ou un atelier. Tu peux aussi reprendre ta leçon.");
  };
  const resume = lessons.find(lesson => lesson.id === progress.id);
  const next = document.querySelector("#continue");
  next.textContent = resume ? "Reprendre" : "Commencer";
  next.onclick = () => { unlockAudio(); openLesson(resume || lessons[0], resume ? progress.stage : 0); };
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
  const play = actionButton("🐾 Le jeu des syllabes", () => openSyllableGame(), "entry syllable-entry");
  document.querySelector(".entries").append(play);
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
    actionButton("🐾 Le jeu des syllabes", () => openSyllableGame(), "primary", choices);
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
function spokenWriting(lesson) {
  return lesson.syllables.includes(lesson.writing) || lesson.writing.length === 1;
}
function currentPrompt() {
  if (stage === 1 && isVisual()) return "Touche les mêmes lettres que dans le modèle.";
  if (stage === 2) return "Touche un bloc pour écouter son son. Puis assemble les blocs pour entendre la syllabe.";
  return playCopy[steps[stage]];
}
function isVisual() {
  return ["br","tr","pl","h muet","gu","ge devant a, o","g devant e, i","c devant e, i"].includes(current.graph);
}
function renderLesson() {
  app.innerHTML = `
    <div class="toolbar"><div>
      <button id="listen" type="button">🔊 Consigne</button></div></div>
    <div class="steps" aria-label="Progression de la leçon"></div>
    <section class="work"><p id="context"></p><h1></h1><p class="prompt"></p><div id="task"></div>
      <p id="feedback" class="feedback" aria-live="polite"></p><p id="audio-notice" class="note" role="status"></p><div class="actions"></div></section>
`;
  document.querySelector("#listen").onclick = () => { hasAudioGesture = true; say(currentPrompt()); };
  for (const [index, label] of steps.entries()) {
    if (run) break;
    const marker = document.createElement("span");
    marker.className = "step-dot";
    marker.dataset.state = index === stage ? "current" : index < stage ? "past" : "next";
    marker.title = label;
    if (index === stage) marker.setAttribute("aria-current", "step");
    marker.textContent = ["👀","👂","🧩","📖","✍️","★"][index];
    app.querySelector(".steps").append(marker);
  }
  app.querySelector("h1").textContent = steps[stage] + (stage === 1 && !isVisual() ? "" : " · " + current.graph);
  app.querySelector("#context").textContent = run
    ? run.title + " · " + (run.index + 1) + "/" + run.from.length
    : "Période " + (current.period + 1) + " · " + (stage + 1) + "/" + steps.length;
  app.querySelector(".prompt").textContent = currentPrompt();
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
      finishLesson(upcoming);
    } else {
      setStage(stage + 1);
    }
  }, "primary", actions);
  if ([1,4,5].includes(stage)) next.disabled = true;
  if (stage === 0) discover(task);
  if (stage === 1) isVisual() ? visual(task, next) : matchSound(task, next);
  if (stage === 2) fusion(task, next);
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
function finishLesson(upcoming) {
  stop();
  app.innerHTML = '<section class="work finish"><img src="../images/loup-bleu-original.png" alt=""><h1>Bravo !</h1><p>Tu as terminé ta leçon.</p><div class="choices"></div></section>';
  const choices = app.querySelector(".choices");
  if (upcoming) actionButton("▶ Leçon suivante", () => openLesson(upcoming), "primary", choices);
  actionButton("Sommaire", () => { renderHome(); headingFocus(); }, "", choices);
  headingFocus();
  say("Bravo ! Tu as terminé ta leçon.");
}
function picture(button, icon) {
  const sprite = window.CODE_PICTURES?.[icon];
  if (sprite) {
    const [columns, rows, x, y] = sprite;
    const image = document.createElement("span");
    image.className = "art-image";
    image.setAttribute("aria-hidden", "true");
    image.style.backgroundSize = (columns * 100) + "% " + (rows * 100) + "%";
    image.style.backgroundPosition = x + "% " + y + "%";
    button.append(image);
  } else button.textContent = icon;
}
function modelCard(parent, word, icon, label = "Écouter le mot modèle") {
  const button = actionButton("", () => say(word), "model-card", parent);
  button.setAttribute("aria-label", label + " : " + word);
  const art = document.createElement("span");
  art.className = "model-art";
  picture(art, icon);
  const volume = document.createElement("span");
  volume.textContent = "🔊 " + label;
  button.append(art, volume);
  return button;
}
function discover(task) {
  focusCard(task, current.glyph + "   " + current.glyph.toLocaleUpperCase("fr"));
  const choices = document.createElement("div");
  choices.className = "choices";
  task.append(choices);
  modelCard(choices, current.word, current.icon, "Écouter le mot repère");
  if (current.ipa !== "∅") actionButton("🔊 Le son", () => modelSound(current), "", choices);
}
function pictureChoices(parent, words, icons, onChoose) {
  const choices = document.createElement("div");
  choices.className = "choices";
  parent.append(choices);
  for (const word of words) {
    const pair = document.createElement("div");
    pair.className = "pair";
    const pick = actionButton("", () => onChoose(word, pick), "picture", pair);
    picture(pick, icons[word] || "🖼️");
    pick.setAttribute("aria-label", "Choisir : " + word);
    const hear = actionButton("🔊", () => say(word), "hear", pair);
    hear.setAttribute("aria-label", "Écouter : " + word);
    choices.append(pair);
  }
}
function pass(next, button, message) {
  activityPassed = true;
  if (button) button.setAttribute("aria-pressed", "true");
  inform(message, true);
  next.disabled = false;
  next.classList.add("ready");
  next.focus({preventScroll:true});
  say("Bravo !");
}
function guidedAnswer(task, answer) {
  if (mistake < 2) return;
  const target = [...task.querySelectorAll(".choice,.picture")].find(button =>
    button.textContent === answer || button.getAttribute("aria-label") === "Choisir : " + answer);
  if (target) target.classList.add("hinted");
  say("Essaie la case qui brille.");
}
function matchSound(task, next) {
  const model = oralModels[current.graph] || current.word;
  modelCard(task, model, modelPictures[model] || current.icon);
  trial = shuffle([current.word, ...current.distractors.slice(0, tinyChoice ? 1 : 2)]);
  pictureChoices(task, trial, {...oralPictures, [current.word]:current.icon}, (word, button) => {
    if (activityPassed) return;
    if (word === current.word) {
      pass(next, button, "✓ Tu as retrouvé le son.");
      return;
    }
    mistake++;
    button.disabled = true;
    inform(mistake > 1 ? "Essaie la case qui brille." : "Réécoute le mot modèle.", false);
    if (mistake > 1) guidedAnswer(task, current.word);
    else say(model);
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
      else {
        mistake++;
        button.disabled = true;
        inform("Compare les lettres avec le modèle.", false);
        if (mistake > 1) guidedAnswer(task, current.glyph);
        else say("Compare les lettres avec le modèle.");
      }
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

function fusion(task, next) {
  const pack = current.syllables;
  let index = 0;
  const board = document.createElement("div");
  board.className = "sound-board";
  task.append(board);
  const track = document.createElement("div");
  track.className = "sound-track";
  board.append(track);
  const controls = document.createElement("div");
  controls.className = "choices sound-controls";
  board.append(controls);
  const label = document.createElement("div");
  label.className = "sound-example";
  label.setAttribute("aria-live", "polite");
  board.append(label);
  next.disabled = true;
  function update() {
    track.replaceChildren();
    track.classList.remove("join");
    label.textContent = "";
    for (const [position, block] of soundBlocks(pack[index], current.graph).entries()) {
      const syllable = pack[index];
      const tile = actionButton(block.token, async () => {
        track.querySelectorAll(".sound-block").forEach(item => item.classList.remove("sounding"));
        tile.classList.add("sounding");
        if (block.sound && !(await playClip("@son:" + block.sound))) saySyllable(syllable, () => say(syllable));
      }, "sound-block", track);
      tile.style.setProperty("--piece", position % 3);
      if (!block.sound) tile.classList.add("quiet");
      tile.setAttribute("aria-label", block.sound ? "Écouter le bloc " + block.token : block.token + " est muet");
      tile.disabled = !block.sound;
    }
  }
  actionButton("▶ Assembler et écouter", () => {
    track.querySelectorAll(".sounding").forEach(tile => tile.classList.remove("sounding"));
    track.classList.add("join");
    label.textContent = pack[index];
    saySyllable(pack[index], () => say(pack[index]));
    next.disabled = false;
    next.classList.add("ready");
  }, "primary", controls);
  actionButton("↻ Autre syllabe", () => {
    stop();
    index = (index + 1) % pack.length;
    update();
  }, "", controls).disabled = pack.length < 2;
  update();
}

const syllableDirections = "Écoute le mot. Pose une patte pour chaque syllabe, puis vérifie.";
function openSyllableGame() {
  unlockAudio();
  const cards = [...shuffle(syllableCards.filter(card => card[2].length === 2)).slice(0, 3),
    ...syllableCards.filter(card => card[2].length === 3)];
  let round = 0;
  function render() {
    stop();
    const [word, icon, parts] = cards[round];
    let count = 0;
    let activeDemo = 0;
    app.innerHTML = `<section class="work paw-game">
      <div class="game-heading"><img src="../images/loup-bleu-original.png" alt=""><div>
      <p id="context"></p><h1>Le jeu des syllabes</h1></div></div>
      <p class="prompt"></p><div class="game-model"></div>
      <div class="paw-track" aria-label="Pattes posées"></div>
      <div class="paw-tools"></div><p class="feedback" id="feedback" aria-live="polite"></p>
      <p class="note" id="audio-notice" role="status"></p><div class="actions"></div></section>`;
    app.querySelector("#context").textContent = (round + 1) + " / " + cards.length;
    app.querySelector(".prompt").textContent = syllableDirections;
    const model = app.querySelector(".game-model");
    const listen = modelCard(model, word, icon, "Écouter le mot");

    const trail = app.querySelector(".paw-track");
    const tools = app.querySelector(".paw-tools");
    const box = app.querySelector(".paw-game");
    function paint(highlight = 0, reveal = false) {
      trail.replaceChildren();
      trail.setAttribute("aria-label", count + " pattes posées");
      for (let i = 0; i < 4; i++) {
        const stone = document.createElement("span");
        stone.className = "paw-stone";
        stone.classList.toggle("planted", i < count);
        stone.classList.toggle("beat", i + 1 === highlight);
        stone.setAttribute("aria-hidden", "true");
        stone.textContent = i < count ? (reveal ? "🐾 " + (i + 1) : "🐾") : "·";
        trail.append(stone);
      }
    }
    const add = actionButton("🐾 Poser une patte", () => {
      activeDemo++;
      stop();
      count++;
      paint();
      add.disabled = count === 4;
      reset.disabled = false;
      check.disabled = false;
    }, "primary", tools);
    const reset = actionButton("↻ Refaire", () => {
      activeDemo++;
      stop();
      count = 0;
      paint();
      add.disabled = false;
      check.disabled = true;
      reset.disabled = true;
    }, "", tools);
    reset.disabled = true;
    async function showBeats() {
      const token = ++activeDemo;
      count = parts.length;
      paint();
      add.disabled = true;
      reset.disabled = true;
      check.disabled = true;
      listen.disabled = true;
      for (let i = 0; i < parts.length; i++) {
        if (!box.isConnected || token !== activeDemo) return;
        paint(i + 1, true);
        const key = "@galet:" + word + ":" + i;
        await playClip(key);
        const seconds = window.CODE_GAME_AUDIO?.[key]?.[2] || .4;
        await new Promise(resolve => setTimeout(resolve, seconds * 1000 + 250));
      }
      if (box.isConnected && token === activeDemo) {
        paint(0, true);
        listen.disabled = false;
      }
    }
    actionButton("💡 Voir les syllabes", async () => {
      await showBeats();
      if (!box.isConnected) return;
      add.disabled = true;
      check.disabled = true;
      next.disabled = false;
      inform(parts.length + " syllabes dans « " + word + " ».", true);
    }, "", tools);
    const check = actionButton("✓ Vérifier", () => {
      if (count !== parts.length) {
        inform("Réécoute le mot et pose une patte pour chaque syllabe.", false);
        say(word);
        return;
      }
      next.disabled = false;
      inform("✓ " + parts.length + " syllabes !", true);
      showBeats();
    }, "", tools);
    check.disabled = true;
    const next = actionButton(round + 1 < cards.length ? "▶ Mot suivant" : "★ Terminer", () => {
      if (++round < cards.length) render();
      else finishLesson();
    }, "primary", app.querySelector(".actions"));
    next.disabled = true;
    paint();
    headingFocus();
    say(syllableDirections);
  }
  render();
}

function reading(task) {
  const panel = document.createElement("div");
  panel.className = "reading";
  task.append(panel);
  for (const item of current.syllables) {
    actionButton(item, () => saySyllable(item, () => say(item)), "read-word", panel);
  }
  for (const item of current.words) actionButton(item, () => say(item), "read-word", panel);
  if (current.sentence) {
    focusCard(task, current.sentence);
    actionButton("🔊 Écouter la phrase", () => say(current.sentence), "", task);
  }
}
function writing(task, next) {
  const answer = units(current.writing);
  const heading = document.createElement("div");
  heading.className = "dictation";
  task.append(heading);
  const replay = () => spokenWriting(current)
    ? saySyllable(current.writing, () => say(current.writing)) : say(current.writing);
  actionButton("🔊 Écouter la dictée", replay, "primary", heading);
  actionButton("💡 Aide", () => {
    inform("Regarde le modèle « " + current.writing + " », puis reconstruis-le.", false);
    replay();
  }, "", heading);
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
      inform(mistake > 1 ? "Regarde le modèle « " + current.writing + " », puis reconstruis-le." : "Réécoute et reprends les lettres dans l’ordre.", false);
      replay();
      selected = [];
      refresh();
    }
  }, "", task);
  refresh();
}

function openWorkshop(workshop) {
  unlockAudio();
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
      readingOrder ? "Écoute la syllabe. Puis touche les lettres que tu entends." :
        "Regarde le modèle et retrouve les mêmes lettres.";
    app.innerHTML = `<section class="work"><p></p><h1></h1><button id="work-audio" type="button">🔊 Consigne</button>
      <p class="prompt"></p><div id="task"></div><p id="feedback" aria-live="polite" class="feedback"></p>
      <p id="audio-notice" class="note" role="status"></p><div class="actions"></div></section>`;
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
    mistake = 0;
    const model = {p:"pirate",b:"bébé",f:"farine",v:"valise",ch:"chou",j:"jardin"}[graph];
    function choose(value, button) {
      if (activityPassed) return;
      if (value === answer) pass(next, button, "C’est la bonne réponse.");
      else {
        mistake++;
        button.disabled = true;
        inform("Essaie l’autre case.", false);
        guidedAnswer(task, answer);
        if (mistake === 1) say("Essaie l’autre case.");
      }
    }
    if (listening) {
      modelCard(task, model, modelPictures[model]);
      pictureChoices(task, shuffle([answer,wrong]), oralPictures, choose);
    } else {
      if (readingOrder) {
        actionButton("🔊 Écouter la syllabe", () => saySyllable(answer, () => say(answer)), "primary", task);
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
