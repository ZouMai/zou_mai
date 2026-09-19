(() => {
  const id = Number(document.body.dataset.dictee),
    d = window.DICTEES.find((x) => x.id === id),
    art = window.DICTEE_ART?.[id],
    app = document.querySelector("#app");
  if (!d) {
    app.innerHTML = "<p>Dictée introuvable.</p>";
    return;
  }
  const key = "zm-d" + id,
    colors = ["yellow", "green", "violet"],
    levelLabels = ["jaune", "vert", "violet"];
  let lvl = 0,
    mode = "study",
    queue = [],
    index = 0,
    points = 0,
    answer = "",
    acceptedAnswers = [],
    reviewAnswer = "",
    timer;
  const itemCounts = [6, 9, 12];
  const baseWord = (w) =>
      w
        .replace(
          /^(?:une|un|les|le|la|des|cette|cet|ces|ce|mes|mon|ma|tes|ton|ta|ses|son|sa)\b\s+|^l[’']/i,
          "",
        )
        .replace(/\s/g, ""),
    reverse = (w) => [...baseWord(w)].reverse().join("");
  const withoutDeterminer = (w) =>
    w
      .replace(
        /^(?:une|un|les|le|la|des|cette|cet|ces|ce|mes|mon|ma|tes|ton|ta|ses|son|sa)\b\s+|^l[’']/i,
        "",
      )
      .trim();
  const clean = (s) => s.trim().replace(/[’']/g, "'").normalize("NFC"),
    norm = (s) => clean(s).toLowerCase();
  const same = (value, expected) =>
    /[A-ZÀ-ÖØ-Þ]/.test(expected)
      ? clean(value) === clean(expected)
      : norm(value) === norm(expected);
  const pool = () => d.levels.slice(0, lvl + 1).flat(),
    pick = (a, n) =>
      [...a].sort(() => Math.random() - 0.5).slice(0, Math.min(n, a.length));
  const difficultyScore = (word) => {
    const w = withoutDeterminer(word);
    return (
      w.length +
      (w.match(/[àâäçéèêëîïôöùûüÿœ]/gi)?.length || 0) * 3 +
      (w.match(/(.)\1/gi)?.length || 0) * 3 +
      (w.match(/tion|eau|aux|ph|qu|gn|ill|oin|ail|eil/gi)?.length || 0) * 4 +
      (w.match(/[dtsxzp]$/i) ? 3 : 0) +
      (w.includes("’") || w.includes("'") ? 2 : 0)
    );
  };
  const flashQueue = (count) => {
    const lists = d.levels.slice(0, lvl + 1),
      quota = Math.floor(count / lists.length),
      extra = count % lists.length,
      selected = [];
    lists.forEach((list, n) => {
      const take = quota + (n >= lists.length - extra ? 1 : 0);
      selected.push(
        ...[...list]
          .sort((a, b) => difficultyScore(b) - difficultyScore(a))
          .slice(0, take),
      );
    });
    return selected.slice(0, count);
  };
  const repair = (a) => {
    const m = new Map(d.levels.flat().map((w) => [reverse(w), baseWord(w)]));
    return [...new Set(a.map((w) => m.get(w) || w))];
  };
  const hard = (w) => {
    const a = repair(JSON.parse(localStorage.getItem(key) || "[]"));
    if (!a.includes(w)) a.push(w);
    localStorage.setItem(key, JSON.stringify(a));
  };
  let voiceCache = [];
  const loadVoices = () => {
    if ("speechSynthesis" in window)
      voiceCache = window.speechSynthesis.getVoices() || [];
  };
  loadVoices();
  if ("speechSynthesis" in window)
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
  const speechText = (w) => {
    const exceptions = { "un an": "un… en.", "une ère": "une… air." };
    return exceptions[norm(w)] || w.replace(/\b([ldjtmnsc])’/gi, "$1'");
  };
  const speak = (w) => {
    const feedback = document.querySelector("#feed");
    if (
      !("speechSynthesis" in window) ||
      typeof SpeechSynthesisUtterance === "undefined"
    ) {
      if (feedback) {
        feedback.className = "feedback bad";
        feedback.textContent = "Le son n’est pas disponible sur cet appareil.";
      }
      return;
    }
    const synth = window.speechSynthesis,
      say = () => {
        synth.cancel();
        synth.resume();
        const u = new SpeechSynthesisUtterance(speechText(w));
        u.lang = "fr-FR";
        u.rate = 0.72;
        u.pitch = 1;
        u.volume = 1;
        loadVoices();
        const fr =
          voiceCache.find((v) => /^fr-FR$/i.test(v.lang)) ||
          voiceCache.find((v) => /^fr/i.test(v.lang));
        if (fr) u.voice = fr;
        u.onerror = () => {
          if (feedback) {
            feedback.className = "feedback bad";
            feedback.textContent =
              "Le son a été bloqué. Appuie encore une fois sur ÉCOUTER.";
          }
        };
        synth.speak(u);
        setTimeout(() => {
          if (synth.paused) synth.resume();
        }, 120);
      };
    if (voiceCache.length) say();
    else {
      loadVoices();
      setTimeout(say, 180);
    }
  };
  const isNoun = (w) => /^(?:(?:un|une|le|la|les|des)\s|l[’'])/i.test(w);
  const verbLexicon = new Set(
    `décorer|représenter|s’abîmer|se dresser|s’aligner|penser|attirer|protéger|permettre|compter|communiquer|transmettre|réussir|connaitre|exprimer|attendre|écrire|habiter|combattre|fabriquer|travailler|aimer|enseigner|diriger|conseiller|respecter|appeler|construire|adopter|obliger|conserver|posséder|se protéger|se composer|placer|chauffer|éclairer|appartenir|payer|souffrir|se dérouler|sculpter|émerveiller|illustrer|illuminer|demander|succéder|donner|apprendre|apercevoir|traverser|jouer|voyager|accompagner|passer|découvrir|améliorer|apporter|changer|agrandir|gagner|souhaiter|répandre|s’élargir|terminer|organiser|se propager|s’interroger|s’inspirer|inventer|peindre|avoir|dénoncer|secouer|incarner|tenir|gouverner|choisir|sembler|apparaitre|se présenter|se méfier|rassembler|surveiller|profiter|se révolter|attaquer|libérer|abolir|rédiger|débuter|dresser|maitriser|conquérir|paraitre|civiliser|juger|imposer|lutter|commencer|s’organiser|supprimer|accéder|obtenir|divorcer|plonger|fouiller|mitrailler|brûler|veiller|arriver|exposer|interdire|accuser|envahir|partager|collaborer|se lever|augmenter|acheter|quitter|rester|compacter|atterrir|rapporter|rejoindre`.split(
      "|",
    ),
  );
  const isVerb = (w) => verbLexicon.has(w);
  const thirdSubjects = [
    ["Il", "Elle", "L’enfant", "La classe"],
    ["Ils", "Elles", "Cette artiste", "Nos ancêtres"],
    [
      "Le jeune historien",
      "Les visiteurs du musée",
      "Toute la famille",
      "Les passants",
    ],
  ];
  const regularSubjects = [
    ["Il", "Elle", "On", "L’enfant", "La classe", "Mon voisin"],
    [
      "Je",
      "Tu",
      "Il",
      "Elle",
      "On",
      "Nous",
      "Vous",
      "Ils",
      "Elles",
      "Cécile et moi",
      "Les élèves",
    ],
    [
      "Je",
      "Tu",
      "Il",
      "Elle",
      "On",
      "Nous",
      "Vous",
      "Ils",
      "Elles",
      "Le jeune historien",
      "Les visiteurs du musée",
      "Toute la famille",
      "Les passants",
      "Notre classe",
      "Mes camarades et moi",
    ],
  ];
  const pluralDeterminers = ["les", "des", "ces", "ses"];
  const rarelyPlural = /^(la préhistoire|l[’']est|l[’']ouest|le nord|le sud)$/i;
  const canPluralize = (phrase) =>
    isNoun(phrase) &&
    !rarelyPlural.test(clean(phrase)) &&
    !/^[A-ZÀ-ÖØ-Þ]/.test(withoutDeterminer(phrase));
  // Ne jamais laisser une marque de pluriel seule entre le déterminant et le nom.
  const cleanNounPhrase = (phrase) =>
    phrase.trim().replace(/\s+/g, " ").replace(/^(\S+)\s+s\s+(?=\S)/i, "$1 ");
  const toPlural = (phrase, determiner = "des") => {
    let noun = withoutDeterminer(cleanNounPhrase(phrase));
    if (!/[sxz]$/i.test(noun))
      noun = /al$/i.test(noun)
        ? noun.replace(/al$/i, "aux")
        : /eau$/i.test(noun)
          ? noun + "x"
          : noun + "s";
    return determiner + " " + noun;
  };
  const personOf = (s) =>
    /^(Je\b|J[’'])/i.test(s)
      ? "1s"
      : /^Tu\b/i.test(s)
        ? "2s"
        : /^Nous\b/i.test(s) || /et moi\b/i.test(s)
          ? "1p"
          : /^Vous\b/i.test(s)
            ? "2p"
            : /^(Ils|Elles|Les|Nos|Des|Ces|Mes|Tes|Ses)\b/i.test(s)
              ? "3p"
              : "3s";
  const joinSubject = (subject, form) =>
    subject === "J’" || subject === "J'"
      ? subject + form
      : subject + " " + form;
  const present = (inf, subject) => {
    let raw = inf.replace("’", "'"),
      pro = /^(se |s')/.test(raw),
      v = raw.replace(/^(se |s')/, "");
    const person = personOf(subject),
      pos = { "1s": 0, "2s": 1, "3s": 2, "1p": 3, "2p": 4, "3p": 5 }[person];
    let form;
    const irregular3 = {
      être: ["est", "sont"],
      avoir: ["a", "ont"],
      aller: ["va", "vont"],
      faire: ["fait", "font"],
      dire: ["dit", "disent"],
      écrire: ["écrit", "écrivent"],
      lire: ["lit", "lisent"],
      voir: ["voit", "voient"],
      pouvoir: ["peut", "peuvent"],
      vouloir: ["veut", "veulent"],
      devoir: ["doit", "doivent"],
      venir: ["vient", "viennent"],
      tenir: ["tient", "tiennent"],
      prendre: ["prend", "prennent"],
      apprendre: ["apprend", "apprennent"],
      comprendre: ["comprend", "comprennent"],
      permettre: ["permet", "permettent"],
      attendre: ["attend", "attendent"],
      connaitre: ["connait", "connaissent"],
      connaître: ["connaît", "connaissent"],
      apparaitre: ["apparait", "apparaissent"],
      apparaître: ["apparaît", "apparaissent"],
      apercevoir: ["aperçoit", "aperçoivent"],
      conquérir: ["conquiert", "conquièrent"],
      souffrir: ["souffre", "souffrent"],
      obtenir: ["obtient", "obtiennent"],
      réussir: ["réussit", "réussissent"],
      combattre: ["combat", "combattent"],
      construire: ["construit", "construisent"],
      appartenir: ["appartient", "appartiennent"],
      répandre: ["répand", "répandent"],
      peindre: ["peint", "peignent"],
      paraitre: ["parait", "paraissent"],
      interdire: ["interdit", "interdisent"],
      rejoindre: ["rejoint", "rejoignent"],
      appeler: ["appelle", "appellent"],
      acheter: ["achète", "achètent"],
      lever: ["lève", "lèvent"],
      protéger: ["protège", "protègent"],
      posséder: ["possède", "possèdent"],
    };
    if (irregular3[v] && (person === "3s" || person === "3p"))
      form = irregular3[v][person === "3p" ? 1 : 0];
    else if (/er$/i.test(v)) {
      let stem = v.slice(0, -2);
      const endings = ["e", "es", "e", "ons", "ez", "ent"];
      if (/ger$/i.test(v) && person === "1p") stem += "e";
      if (/cer$/i.test(v) && person === "1p") stem = stem.replace(/c$/, "ç");
      form = stem + endings[pos];
    } else if (/ir$/i.test(v))
      form =
        v.slice(0, -2) + ["is", "is", "it", "issons", "issez", "issent"][pos];
    else if (/re$/i.test(v))
      form = v.slice(0, -2) + ["s", "s", "", "ons", "ez", "ent"][pos];
    else form = v;
    if (pro) {
      const pronouns = {
        "1s": "me ",
        "2s": "te ",
        "3s": "se ",
        "1p": "nous ",
        "2p": "vous ",
        "3p": "se ",
      };
      form = pronouns[person] + form;
      form = form.replace(/^(me|te|se) ([aeiouyh])/i, "$1'$2");
    }
    return joinSubject(subject, form);
  };
  const simpleTense = (inf, subject, tense) => {
    const person = personOf(subject),
      pos = { "1s": 0, "2s": 1, "3s": 2, "1p": 3, "2p": 4, "3p": 5 }[person],
      raw = inf.replace("’", "'"),
      pronominal = /^(se |s')/.test(raw),
      verb = raw.replace(/^(se |s')/, "");
    let form;
    if (tense === "imparfait") {
      let stem = verb.slice(0, -2);
      if (/ger$/i.test(verb) && ![3, 4].includes(pos)) stem += "e";
      if (/cer$/i.test(verb) && ![3, 4].includes(pos))
        stem = stem.replace(/c$/i, "ç");
      form = stem + ["ais", "ais", "ait", "ions", "iez", "aient"][pos];
    } else {
      const stem = /re$/i.test(verb) ? verb.slice(0, -1) : verb;
      form = stem + ["ai", "as", "a", "ons", "ez", "ont"][pos];
    }
    if (pronominal) {
      const pronouns = {
        "1s": "me ",
        "2s": "te ",
        "3s": "se ",
        "1p": "nous ",
        "2p": "vous ",
        "3p": "se ",
      };
      form = (pronouns[person] + form).replace(
        /^(me|te|se) ([aeiouyh])/i,
        "$1'$2",
      );
    }
    return joinSubject(subject, form);
  };
  const adjectiveForms = (masculine, feminine) => ({
    ms: masculine,
    fs: feminine,
    mp: /[sx]$/i.test(masculine)
      ? masculine
      : /al$/i.test(masculine)
        ? masculine.replace(/al$/i, "aux")
        : /eau$/i.test(masculine)
          ? masculine + "x"
          : masculine + "s",
    fp: /[sx]$/i.test(feminine) ? feminine : feminine + "s",
  });
  const agreementFrames = {
    ms: ["un élément", "ce personnage"],
    fs: ["une œuvre", "cette scène"],
    mp: ["des éléments", "ces personnages"],
    fp: ["des œuvres", "ces scènes"],
  };
  const grammarTasks = () => {
    const words = pool(),
      tasks = [],
      verbs = words.filter(isVerb);
    words.filter(canPluralize).forEach((w) => {
      const determiner =
          pluralDeterminers[tasks.length % pluralDeterminers.length],
        full = toPlural(w, determiner);
      tasks.push({
        kind: "noun",
        prompt: `Écris ce groupe nominal au pluriel : « ${w} ». Utilise le déterminant « ${determiner} » :`,
        answer: full,
        accept: [withoutDeterminer(full)],
        review: w,
        source: w,
      });
    });
    d.transforms
      .filter((x) => x[2] <= lvl)
      .forEach((x) => {
        const instruction = x[0],
          target = x[1],
          source = instruction.split(":").pop().trim();
        if (/^Mets au pluriel/i.test(instruction)) {
          if (!canPluralize(source)) return;
          const determiner =
              pluralDeterminers[tasks.length % pluralDeterminers.length],
            pluralTarget = toPlural(source, determiner);
          tasks.push({
            kind: "noun",
            prompt: `Mets au pluriel : « ${source} ». Utilise le déterminant « ${determiner} » :`,
            answer: pluralTarget,
            accept: [withoutDeterminer(pluralTarget)],
            review: pluralTarget,
            source,
          });
        } else if (
          /^Accorde/i.test(instruction) &&
          /^(un|une|le|la|l[’'])/i.test(source)
        ) {
          tasks.push({
            kind: "gender",
            prompt: `Écris au féminin : « ${source} » :`,
            answer: target,
            accept: [baseWord(target)],
            review: target,
          });
        } else if (/^Accorde/i.test(instruction)) {
          const forms = adjectiveForms(source, target);
          Object.keys(forms).forEach((k) => {
            const frame =
                agreementFrames[k][(id + source.length + k.length) % 2],
              full = `${frame} ${forms[k]}`;
            tasks.push({
              kind: "adjective",
              agreement: k,
              prompt: `Accorde correctement l’adjectif « ${source} » : ${frame} …`,
              answer: full,
              accept: [forms[k]],
              review: forms[k],
              forms,
              frame,
            });
          });
        }
      });
    verbs.forEach((v) => {
      const subjects = /er$/i.test(v)
        ? regularSubjects[Math.min(lvl, 2)]
        : thirdSubjects[Math.min(lvl, 2)];
      subjects.forEach((rawSubject) => {
        const subject =
          rawSubject === "Je" &&
          /^[aeiouyh]/i.test(v.replace(/^(se |s[’'])/i, ""))
            ? "J’"
            : rawSubject;
        const ans = present(v, subject),
          form = ans.slice(subject.length).trim();
        tasks.push({
          kind: "verb",
          prompt: `Conjugue « ${v} » au présent avec le sujet « ${subject} » :`,
          answer: ans,
          accept: [form],
          review: v,
          subject,
          verb: v,
        });
      });
    });
    return tasks;
  };
  const choiceTasks = () =>
    grammarTasks()
      .filter(
        (t) =>
          t.kind !== "verb" ||
          (/er$/i.test(t.verb) &&
            !/^(appeler|acheter|se lever)$/i.test(t.verb)),
      )
      .map((t) => {
        let options;
        if (t.kind === "adjective") {
          options = Object.values(t.forms).map((form) => `${t.frame} ${form}`);
        } else if (t.kind === "verb") {
          const correct = t.answer,
            imperfect = simpleTense(t.verb, t.subject, "imparfait"),
            future = simpleTense(t.verb, t.subject, "futur"),
            otherPresent = present(t.verb, "Nous").replace(/^Nous\s+/, "");
          options = [
            correct,
            imperfect,
            future,
            joinSubject(t.subject, otherPresent),
          ];
        } else if (t.kind === "noun") {
          const answer = cleanNounPhrase(t.answer);
          const pluralNoun = withoutDeterminer(answer);
          const singularPhrase = cleanNounPhrase(t.source);
          const singularNoun = withoutDeterminer(singularPhrase);
          const requestedDet = answer.split(" ")[0].toLowerCase();
          // Trois difficultés ciblées : nom non accordé, groupe resté au
          // singulier, confusion entre deux déterminants proches.
          const otherDet = {
            ces: "ses", ses: "ces", les: "des", des: "les",
          }[requestedDet];
          const candidates = [
            answer,
            `${requestedDet} ${singularNoun}`,
            singularPhrase,
            `${otherDet} ${pluralNoun}`,
            // Substituts uniquement si le nom est invariable au pluriel.
            `${otherDet} ${singularNoun}`,
            `${requestedDet === "ces" ? "des" : "ces"} ${pluralNoun}`,
            `${requestedDet === "ces" ? "ce" : "un"} ${singularNoun}`,
          ];
          options = [...new Set(candidates.map(cleanNounPhrase))]
            .filter((candidate) => candidate !== answer || candidate === candidates[0])
            .slice(0, 4);
        } else {
          const noun = withoutDeterminer(t.answer);
          options = [t.answer, t.prompt.match(/« ([^»]+) »/)?.[1], `l’${noun}`];
        }
        return {
          ...t,
          options: [...new Set(options)].filter(Boolean).slice(0, 4),
        };
      });

  app.innerHTML = `<header class="dict-hero"><div><span class="tag">DICTÉE ${id} · CM2</span><h1>${d.title}</h1><p>Cinq missions courtes pour observer, mémoriser, transformer et écrire.</p></div><div class="dict-nav"><a ${id > 1 ? `href="${fileFor(id - 1)}"` : ""}>←</a><span>${id} / 25</span><a ${id < 25 ? `href="${fileFor(id + 1)}"` : ""}>→</a></div></header>
<section class="method-box" aria-label="Méthode utilisée pour les dictées"><img src="https://www.editions-retz.com/sites/default/files/visuels/9782725647791.jpg" alt="Couverture du cahier Dictées et histoire des arts CM — Voyage dans le temps" loading="lazy"><div><h2>Notre méthode de dictée</h2><p>Ces entraînements accompagnent <strong>Dictées et histoire des arts – Voyage dans le temps, cycle 3</strong>, de <strong>Mélanie Pouëssel</strong> (Éditions Retz). On découvre une œuvre, puis on mémorise des mots, on travaille les accords et on s’entraîne à écrire avant la dictée en classe.</p><small>Complément numérique élaboré pour les élèves de notre classe : utilisation dans le cadre de la classe et de ses devoirs, sans redistribution des supports originaux. <a href="https://www.editions-retz.com/ecole-elementaire/cm1/francais/dictees-et-histoire-des-arts-cm-voyage-dans-le-temps-ressources-numeriques-9782725647517.html" target="_blank" rel="noopener noreferrer">Présentation de l’ouvrage ↗</a></small></div></section>
<section class="dict-wrap"><figure class="artwork"><div class="art-frame ${art?.images.length > 1 ? "art-gallery" : ""}">${art ? art.images.map((src, n) => `<img src="${src}" alt="${art.title}${art.images.length > 1 ? " - vue " + (n + 1) : ""}">`).join("") : "<span>ŒUVRE<br>À OBSERVER</span>"}</div><figcaption><span class="art-label">ŒUVRE ASSOCIÉE</span><h2>${art?.title || d.title}</h2><p>${art?.why || "Observe les détails qui sont liés au thème de la dictée."}</p><small>Source : ${art?.source || "document pédagogique"}</small></figcaption></figure>
<section class="levels">${colors.map((c, n) => `<button class="level ${c} ${n === 0 ? "active" : ""}" data-l="${n}">${levelLabels[n].toUpperCase()}</button>`).join("")}</section>
<div class="status"><span class="pill" id="levelName">Niveau jaune</span><span class="pill" id="score">0 réussite</span><div class="progress"><span id="progressFill"></span></div></div>
<section class="missions"><button class="study-tab active" id="study">📚<b>Revoir les mots</b><span>Mémoriser et zoomer</span></button><button class="mission" data-m="flash">👁️<b>Mot éclair</b><span>Observer puis écrire</span></button><button class="mission" data-m="transform">🔄<b>Je transforme</b><span>Pluriels, accords, présent</span></button><button class="mission" data-m="choice">🎯<b>Je choisis</b><span>Groupes et terminaisons</span></button><button class="mission" data-m="dictation">🎧<b>Mots dictés</b><span>Écouter puis écrire</span></button><button class="mission" data-m="reverse">↩️<b>Bonus à l’envers</b><span>De la fin au début</span></button><button class="study-tab" id="review">⭐<b>Mes mots à revoir</b><span>Mes erreurs</span></button></section>
<section class="game" id="game"></section></section>`;

  if (!document.querySelector('link[href="zoumai-brand.css"]')) {
    const css=document.createElement('link');css.rel='stylesheet';css.href='zoumai-brand.css';document.head.append(css);
  }
  if (!document.querySelector('.zm-corner-logo')) {
    const badge=document.createElement('a');badge.className='zm-corner-logo';badge.href='index.html';badge.setAttribute('aria-label','Accueil Zou Maï');
    const pic=document.createElement('img');pic.src='images/logo-zou-mai-sensei.png';pic.alt='Logo Sensei Zou_Maï';badge.append(pic);document.body.append(badge);
  }
  const game = document.querySelector("#game");
  function fileFor(n) {
    const names = [
      "grottes",
      "megalithes",
      "ecriture",
      "artisanat-gaulois",
      "monuments-gallo-romains",
      "seigneurs",
      "paysans",
      "eglises",
      "guillaume-conquerant",
      "alienor-aquitaine",
      "inventions",
      "exploration",
      "renaissance",
      "guerres-religion",
      "monarchie-absolue",
      "revolution-francaise",
      "napoleon",
      "revolution-industrielle",
      "expansion-coloniale",
      "progres-sociaux",
      "premiere-guerre",
      "seconde-guerre",
      "resistance",
      "societe-consommation",
      "futur",
    ];
    return `dictee-${String(n).padStart(2, "0")}-${names[n - 1]}.html`;
  }
  function updateStatus() {
    document.querySelector("#score").textContent =
      points + " réussite" + (points > 1 ? "s" : "");
    document.querySelector("#progressFill").style.width =
      (queue.length ? Math.min(100, (index / queue.length) * 100) : 0) + "%";
  }
  function inputForm(
    title,
    prompt,
    expected,
    audio = false,
    review = expected,
    alternatives = [],
  ) {
    answer = expected;
    acceptedAnswers = [expected, ...alternatives];
    reviewAnswer = review;
    game.innerHTML = `<h2>${title}</h2><p class="prompt">${prompt}</p>${audio ? '<button class="action audio" id="hear">🔊 ÉCOUTER LE MOT</button>' : ""}<label class="write-label" for="inp">✏️ CLIQUE ICI ET ÉCRIS TA RÉPONSE</label><textarea class="answer-input" id="inp" rows="1" inputmode="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Écris ta réponse ici…"></textarea><button class="action" id="check">VALIDER</button><div class="feedback" id="feed"></div>`;
    if (audio) document.querySelector("#hear").onclick = () => speak(expected);
    const inp = document.querySelector("#inp");
    document.querySelector("#check").onclick = check;
    inp.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        check();
      }
    };
    inp.focus();
  }
  function check() {
    const inp = document.querySelector("#inp"),
      f = document.querySelector("#feed");
    if (acceptedAnswers.some((expected) => same(inp.value, expected))) {
      points++;
      f.className = "feedback ok";
      f.textContent = "✓ Bravo !";
    } else {
      hard(reviewAnswer || answer);
      f.className = "feedback bad";
      f.textContent = "La réponse complète était : " + answer;
    }
    updateStatus();
    setTimeout(next, 950);
  }
  function start() {
    clearTimeout(timer);
    index = points = 0;
    const count = itemCounts[lvl];
    if (mode === "transform") queue = pick(grammarTasks(), count);
    else if (mode === "choice") queue = pick(choiceTasks(), count);
    else if (mode === "flash") queue = flashQueue(count);
    else if (mode === "dictation") {
      // Tirage aléatoire pondéré : favorise difficultés et erreurs passées,
      // sans ordre fixe ni doublon dans la série.
      const missed = new Set(repair(JSON.parse(localStorage.getItem(key) || "[]")));
      const bag = [...new Set(pool())].map(w => ({
        word: w,
        priority: Math.max(1, difficultyScore(w)) + (missed.has(w) ? 22 : 0),
        roll: -Math.log(Math.max(0.000001, Math.random()))
      }));
      bag.sort((a,b) => a.roll/a.priority - b.roll/b.priority);
      queue = bag.slice(0, Math.min(count, bag.length)).map(x => x.word);
    }
    else if (mode === "reverse") queue = pick([...new Set(pool())], 3);
    else queue = pick(pool(), count);
    updateStatus();
    next();
  }
  function next() {
    if (index >= queue.length) return finish();
    updateStatus();
    if (mode === "flash") {
      const w = queue[index++],
        alternatives = isNoun(w) ? [baseWord(w)] : [];
      game.innerHTML = `<h2>MOT ÉCLAIR · ${index}/${queue.length}</h2><p class="flash-word">${w}</p><p class="hint">Observe le déterminant, les lettres difficiles et la fin du mot.</p>`;
      timer = setTimeout(
        () =>
          inputForm(
            `MOT ÉCLAIR · ${index}/${queue.length}`,
            "Le mot a disparu.",
            w,
            false,
            w,
            alternatives,
          ),
        3600,
      );
      return;
    }
    if (mode === "transform") {
      const x = queue[index++];
      inputForm(
        `JE TRANSFORME · ${index}/${queue.length}`,
        x.prompt,
        x.answer,
        false,
        x.review,
        x.accept || [],
      );
      return;
    }
    if (mode === "dictation") {
      const w = queue[index++];
      inputForm(
        `MOTS DICTÉS · ${index}/${queue.length}`,
        "Écoute attentivement. Le nom est dicté avec son déterminant.",
        w,
        true,
      );
      return;
    }
    if (mode === "reverse") {
      const w = queue[index++],
        original = baseWord(w),
        fullReverse = [...clean(w)].reverse().join(""),
        reverseWithDeterminer =
          reverse(w) +
          " " +
          clean(w)
            .match(/^(un|une|le|la|les|des|l[’'])/i)?.[0]
            .split("")
            .reverse()
            .join("");
      inputForm(
        `BONUS À L’ENVERS · ${index}/${queue.length}`,
        "Écoute le mot puis écris-le de la dernière lettre à la première.",
        reverse(w),
        false,
        original,
        [fullReverse, reverseWithDeterminer, original, clean(w)].filter(
          Boolean,
        ),
      );
      game
        .querySelector(".prompt")
        .insertAdjacentHTML(
          "afterend",
          '<button class="action audio" id="hear">🔊 ÉCOUTER LE MOT</button><p class="hint">Le mot peut être écrit avec ou sans son déterminant.</p>',
        );
      document.querySelector("#hear").onclick = () => speak(w);
      return;
    }
    const x = queue[index++],
      opts = [...x.options].sort(() => Math.random() - 0.5);
    game.innerHTML = `<h2>JE CHOISIS · ${index}/${queue.length}</h2><p class="prompt">${x.prompt}</p><div class="choices">${opts.map((o) => `<button>${o}</button>`).join("")}</div>`;
    game.querySelectorAll(".choices button").forEach(
      (b) =>
        (b.onclick = () => {
          if (same(b.textContent, x.answer)) points++;
          else hard(x.review || x.answer);
          updateStatus();
          setTimeout(next, 600);
        }),
    );
  }
  function finish() {
    updateStatus();
    document.querySelector("#progressFill").style.width = "100%";
    game.innerHTML = `<h2>MISSION TERMINÉE</h2><p class="result">${points} / ${queue.length}</p><p>${points === queue.length ? "Mission parfaite !" : "Les erreurs sont conservées dans « Mes mots à revoir »."}</p><button class="action" id="again">REJOUER</button>`;
    document.querySelector("#again").onclick = start;
  }
  function difficultyMarkup(word) {
    const chars = [...word],
      marks = chars.map(() => ""),
      paint = (regex, type) => {
        for (const match of word.matchAll(regex))
          for (let i = match.index; i < match.index + match[0].length; i++)
            if (!marks[i]) marks[i] = type;
      };
    paint(/[A-ZÀ-ÖØ-Þ]/g, "capital");
    paint(/ent\b|[dtsxzp]\b/gi, "silent");
    paint(/(.)\1/gi, "double");
    paint(
      /tion|eau|aux|ph|qu|gn|ch|ill|oin|ai|ei|ou|an|en|on|in/gi,
      "grapheme",
    );
    paint(/[àâäçéèêëîïôöùûüÿœ]/gi, "accent");
    return chars
      .map((c, i) => {
        const safe = c
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return marks[i] ? `<span class="hl-${marks[i]}">${safe}</span>` : safe;
      })
      .join("");
  }
  function wordsMarkup(words) {
    return words
      .map(
        (w, n) =>
          `<button class="word" data-word="${w.replace(/"/g, "&quot;")}">${w}${n < 7 ? '<span aria-hidden="true">🔎</span>' : ""}</button>`,
      )
      .join("");
  }
  function showWords() {
    clearTimeout(timer);
    deactivate();
    document.querySelector("#study").classList.add("active");
    game.innerHTML = `<h2>REVOIR LES MOTS · ${levelLabels[lvl].toUpperCase()}</h2><p class="prompt study-instruction">Essaye de mémoriser l’orthographe des mots suivants.</p><p class="hint">Clique sur un mot pour zoomer sur ses difficultés.</p><div class="spelling-legend"><span class="legend-capital">A</span> majuscule <span class="legend-silent">lettre</span> muette <span class="legend-accent">é</span> accent <span class="legend-double">ll</span> lettre double <span class="legend-grapheme">eau</span> groupe de lettres</div><div class="word-zoom" id="wordZoom" aria-live="polite">Choisis un mot marqué d’une loupe.</div><div class="words">${wordsMarkup(pool())}</div>`;
    game.querySelectorAll(".word").forEach(
      (b) =>
        (b.onclick = () => {
          document.querySelector("#wordZoom").innerHTML =
            `<button class="zoom-audio" aria-label="Écouter ${b.dataset.word}">🔊</button><strong>${difficultyMarkup(b.dataset.word)}</strong>`;
          document.querySelector(".zoom-audio").onclick = () =>
            speak(b.dataset.word);
        }),
    );
  }
  function showReview() {
    clearTimeout(timer);
    deactivate();
    document.querySelector("#review").classList.add("active");
    const a = repair(JSON.parse(localStorage.getItem(key) || "[]"));
    localStorage.setItem(key, JSON.stringify(a));
    if (!a.length) {
      game.innerHTML =
        '<h2>MES MOTS À REVOIR</h2><p class="prompt">Aucun mot difficile enregistré.</p><p class="hint">Les erreurs apparaîtront ici automatiquement.</p>';
      return;
    }
    game.innerHTML = `<h2>MES MOTS À REVOIR</h2><p class="hint">Tous les mots sont présentés à l’endroit.</p><div class="words">${wordsMarkup(a)}</div><button class="action" id="practice">M’ENTRAÎNER SUR CES MOTS</button>`;
    document.querySelector("#practice").onclick = () => {
      deactivate();
      mode = "dictation";
      queue = a;
      index = points = 0;
      next();
    };
  }
  function deactivate() {
    document
      .querySelectorAll(".mission,.study-tab")
      .forEach((x) => x.classList.remove("active"));
  }
  document.querySelectorAll(".level").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll(".level")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        lvl = Number(b.dataset.l);
        document.querySelector("#levelName").textContent =
          "Niveau " + levelLabels[lvl] + " · " + (mode === "reverse" ? 3 : itemCounts[lvl]) + " items";
        document.querySelector("#study").classList.contains("active")
          ? showWords()
          : document.querySelector("#review").classList.contains("active")
            ? showReview()
            : start();
      }),
  );
  document.querySelectorAll(".mission").forEach(
    (b) =>
      (b.onclick = () => {
        deactivate();
        b.classList.add("active");
        mode = b.dataset.m;
        start();
      }),
  );
  document.querySelector("#study").onclick = showWords;
  document.querySelector("#review").onclick = showReview;
  showWords();
})();
