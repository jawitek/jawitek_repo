/* LingaRoo — logika ekranów.
 * Nawigacja po hashu (#home, #cards/animals, …), żeby każdy ekran dało się
 * otworzyć bezpośrednio — także w testach. Jeden punkt renderu na ekran. */

(() => {
  const app = document.getElementById('app');

  /* Timery bieżącego ekranu — sprzątane przy każdej nawigacji, żeby stary
   * ekran nie strzelał setTimeoutem w nowy. */
  let timers = [];
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const everyLetter = (fn, ms) => { const id = setInterval(fn, ms); timers.push(id); return id; };
  function clearTimers() { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; }

  let activeRecognition = null;

  const themeById = id => THEMES.find(t => t.id === id) || THEMES[0];

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── Profile: do 6 dzieci na urządzeniu, bez haseł i bez chmury ── */
  const AVATARS = {
    owl: SVG_OWL, fox: SVG_FOX, bear: SVG_BEAR, rabbit: SVG_RABBIT,
    frog: SVG_FROG, duck: SVG_DUCK, cat: SVG_CAT, dog: SVG_DOG,
  };
  const Profiles = (() => {
    const KEY = 'lingaroo.profiles', ACT = 'lingaroo.activeProfile';
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
    const write = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
    return {
      MAX: 6,
      list: read,
      active() {
        let id = null;
        try { id = localStorage.getItem(ACT); } catch (e) {}
        return read().find(p => p.id === id) || null;
      },
      setActive(id) { try { localStorage.setItem(ACT, id); } catch (e) {} },
      add(name, avatar) {
        const l = read();
        if (l.length >= this.MAX) return null;
        const p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), name, avatar };
        l.push(p);
        write(l);
        /* Migracja: postęp sprzed epoki profili przechodzi na pierwszy profil. */
        try {
          const legacy = localStorage.getItem('lingaroo.progress');
          if (legacy && l.length === 1) {
            localStorage.setItem('lingaroo.progress.' + p.id, legacy);
            localStorage.removeItem('lingaroo.progress');
          }
        } catch (e) {}
        return p;
      },
      remove(id) {
        write(read().filter(p => p.id !== id));
        try {
          localStorage.removeItem('lingaroo.progress.' + id);
          if (localStorage.getItem(ACT) === id) localStorage.removeItem(ACT);
        } catch (e) {}
      },
    };
  })();

  /* ── Postępy aktywnego profilu ──
   * Lekcję otwierającą następną domyka pełny cykl trzech spotkań ze
   * słowami: obejrzenie kart (seen) + Znajdź słowo (quiz) + Tablica (say).
   * Osobno dojrzewa utrwalenie: słowo jest „pewne", gdy padło poprawnie
   * w dwóch różnych dniach — lekcja z samymi pewnymi słowami dostaje
   * pełną łezkę. Powtarzanie niczego nie psuje — powtórka to w Montessori
   * cel, nie strata czasu. */
  const Progress = (() => {
    const key = () => {
      const p = Profiles.active();
      return 'lingaroo.progress' + (p ? '.' + p.id : '');
    };
    const load = () => {
      let o = null;
      try { o = JSON.parse(localStorage.getItem(key()) || 'null'); } catch (e) {}
      if (!o) return { v: 2, themes: {}, words: {} };
      if (!o.v) {
        /* Migracja ze starego kształtu {temat: n}: n pierwszych lekcji
         * dostaje pełny cykl, utrwalenie zaczyna się od zera. */
        const themes = {};
        Object.entries(o).forEach(([tid, n]) => {
          themes[tid] = { lessons: Array.from({ length: n | 0 }, () => ({ seen: 1, quiz: 1, say: 1 })) };
        });
        return { v: 2, themes, words: {} };
      }
      return o;
    };
    const save = o => { try { localStorage.setItem(key(), JSON.stringify(o)); } catch (e) {} };
    const lessonOf = (o, tid, lvl) => {
      const t = o.themes[tid] || (o.themes[tid] = { lessons: [] });
      return t.lessons[lvl] || (t.lessons[lvl] = {});
    };
    const isFull = l => !!(l && l.seen && l.quiz && l.say);
    const today = () => new Date().toISOString().slice(0, 10);
    return {
      done(tid) {
        const o = load();
        const t = o.themes[tid];
        if (!t) return 0;
        let n = 0;
        while (isFull(t.lessons[n])) n++;
        return n;
      },
      flags(tid, lvl) {
        const o = load();
        const l = (o.themes[tid] && o.themes[tid].lessons[lvl]) || {};
        return { seen: !!l.seen, quiz: !!l.quiz, say: !!l.say };
      },
      /* Odhacza aktywność; zwraca true, gdy właśnie domknęła cykl lekcji. */
      mark(tid, lvl, act) {
        const o = load();
        const l = lessonOf(o, tid, lvl);
        const before = isFull(l);
        l[act] = 1;
        save(o);
        return !before && isFull(l);
      },
      /* Utrwalanie: liczy różne dni, w których słowo padło poprawnie. */
      wordCorrect(en) {
        const o = load();
        const w = o.words[en] || (o.words[en] = { d: '', n: 0 });
        const t = today();
        if (w.d !== t) { w.d = t; w.n = Math.min(9, (w.n | 0) + 1); }
        save(o);
      },
      wordDays(en) { const o = load(); return ((o.words[en] || {}).n) | 0; },
      wordLast(en) { const o = load(); return (o.words[en] || {}).d || ''; },
      masteredLesson(tid, lvl) {
        const box = themeBoxes(themeById(tid))[lvl] || [];
        return box.length > 0 && box.every(w => this.wordDays(w.en) >= 2);
      },
      reset() { try { localStorage.removeItem(key()); } catch (e) {} },
    };
  })();

  /* Skorowidz słów (do Powtórki): en → słowo + temat + lekcja. */
  const WORD_INDEX = {};
  THEMES.forEach(t => themeBoxes(t).forEach((box, lvl) => box.forEach(w => {
    if (!WORD_INDEX[w.en]) WORD_INDEX[w.en] = { ...w, theme: t.id, level: lvl };
  })));
  /* Słowa z lekcji o pełnym cyklu — pula Powtórki. */
  function reviewPool() {
    const pool = [];
    THEMES.forEach(t => {
      const n = Progress.done(t.id);
      themeBoxes(t).forEach((box, lvl) => { if (lvl < n) pool.push(...box); });
    });
    return pool;
  }
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ── Nawigacja ──
   * Hash jest źródłem prawdy, ale nie warunkiem działania: w środowiskach,
   * które blokują nawigację (osadzenie w piaskownicy), trzymamy trasę
   * w pamięci i renderujemy wprost. */
  let memRoute = '';
  function goto(r) {
    memRoute = r;
    const want = '#' + r;
    if (location.hash === want) { render(); return; }
    try { location.hash = want; } catch (e) {}
    setTimeout(() => { if (location.hash !== want) render(); }, 0);
  }
  function route() {
    const raw = location.hash.length > 1 ? location.hash.slice(1) : (memRoute || 'home');
    const parts = raw.split('/');
    return { name: parts[0] || 'home', arg: parts[1] || '', arg2: parts[2] || '' };
  }
  window.addEventListener('hashchange', () => { memRoute = location.hash.slice(1); render(); });

  function topbar(title, { parentBtn = false, profile = null } = {}) {
    /* Lewy róg zawsze nosi zwierzaka zalogowanego dziecka: na ekranie
     * głównym prowadzi do zmiany profilu, głębiej — wraca do menu. */
    const act = Profiles.active();
    const avatar = act ? (AVATARS[act.avatar] || ROO_HEAD_SVG) : ROO_HEAD_SVG;
    const left = profile
      ? `<button class="woodbtn" data-go="who" aria-label="Zmień profil"><div>${avatar}</div></button>`
      : `<button class="woodbtn" data-go="home" aria-label="Powrót do menu"><div>${avatar}</div></button>`;
    return `
      <header class="topbar">
        ${left}
        <div class="title">${title}</div>
        ${parentBtn
          ? `<button class="woodbtn subtle" data-go="gate" aria-label="Strefa Rodzica"><div>${UI.gear}</div></button>`
          : `<div style="width:56px"></div>`}
      </header>`;
  }

  /* ── „Kto dziś się bawi?" — wybór profilu ── */
  function renderWho() {
    const list = Profiles.list();
    if (!list.length) { renderNewProfile(); return; }
    const act = Profiles.active();
    app.innerHTML = `
      <div class="screen">
        ${topbar('LingaRoo')}
        <p class="hint">Kto dziś się bawi?</p>
        <div class="themes">
          ${list.map(p => `
            <button class="themetile ${act && act.id === p.id ? 'activeprof' : ''}" data-prof="${p.id}">
              <div class="icon">${AVATARS[p.avatar] || SVG_OWL}</div>
              <div class="label">${esc(p.name)}</div>
            </button>`).join('')}
          ${list.length < Profiles.MAX ? `
            <button class="themetile" id="addProf">
              <div class="icon plus">+</div>
              <div class="label">Nowy profil<small>${list.length} z ${Profiles.MAX}</small></div>
            </button>` : ''}
        </div>
      </div>`;
    wire();
    app.querySelectorAll('[data-prof]').forEach(b => b.addEventListener('click', () => {
      Profiles.setActive(b.dataset.prof);
      goto('home');
    }));
    const add = document.getElementById('addProf');
    if (add) add.addEventListener('click', renderNewProfile);
  }

  function renderNewProfile() {
    const avatars = Object.keys(AVATARS);
    let chosen = avatars[Profiles.list().length % avatars.length];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Nowy profil')}
        <p class="hint">Jak masz na imię?</p>
        <div class="profform">
          <input class="nameinput" id="pname" maxlength="14" autocomplete="off" placeholder="Imię">
          <div class="avatargrid">
            ${avatars.map(a => `<button class="avatar ${a === chosen ? 'sel' : ''}" data-av="${a}" aria-label="${a}">${AVATARS[a]}</button>`).join('')}
          </div>
          <button class="softbtn" id="createProf">Zaczynamy!</button>
        </div>
      </div>`;
    wire();
    app.querySelectorAll('[data-av]').forEach(b => b.addEventListener('click', () => {
      chosen = b.dataset.av;
      app.querySelectorAll('.avatar').forEach(x => x.classList.toggle('sel', x === b));
    }));
    document.getElementById('createProf').addEventListener('click', () => {
      const name = (document.getElementById('pname').value || '').trim().slice(0, 14) || 'Ja';
      const p = Profiles.add(name, chosen);
      if (p) { Profiles.setActive(p.id); goto('home'); }
      else goto('who');
    });
  }

  function trackHtml(activeIdx, total = 5) {
    let html = '<div class="track">';
    for (let i = 0; i < total; i++) {
      const state = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'upcoming';
      const color = state === 'upcoming' ? 'var(--dim-txt)' : '#FDFBF7';
      html += `<div class="step">
        <div class="peg ${state}">
          ${state === 'active' ? `<div class="roo" data-roo="hero">${ROO_SVG}</div>` : ''}
          <div class="ico">${TRACK_ICONS[i % TRACK_ICONS.length](color)}</div>
        </div>
        ${i < total - 1 ? `<div class="link ${i < activeIdx ? 'done' : ''}"></div>` : ''}
      </div>`;
    }
    return html + '</div>';
  }

  /* Ilustrowany LingaRoo: SVG z kodu renderuje się od razu, a gdy plik
   * się wczyta, podmienia figury oznaczone data-roo. Brak pliku kosztuje
   * wygląd, nie działanie. */
  const RooArt = (() => {
    let heroSrc = null;
    const im = new Image();
    im.onload = () => { heroSrc = im.src; upgradeRoos(); };
    im.src = 'assets/roo-hero.png?v=1';
    return { hero: () => heroSrc };
  })();
  function upgradeRoos() {
    const src = RooArt.hero();
    if (!src) return;
    app.querySelectorAll('[data-roo="hero"]').forEach(el => {
      if (!el.querySelector('img')) el.innerHTML = `<img src="${src}" alt="">`;
    });
  }

  function wire() {
    app.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => goto(b.dataset.go));
    });
    upgradeRoos();
  }

  /* ── Ekran główny ── */
  function renderHome() {
    const act = Profiles.active();
    app.innerHTML = `
      <div class="screen">
        ${topbar('LingaRoo', { parentBtn: true, profile: act })}
        <div class="hero">
          <div class="bubble">Hello${act ? ', ' + esc(act.name) : ''}!<small>Pobawimy się razem?</small></div>
          <div class="roo" data-roo="hero">${TEACHER_SVG}</div>
        </div>
        <div class="modes">
          <button class="modetile" data-go="themes/cards">
            <div class="icon">${UI.cards}</div>
            <div class="label">Słówka<small>oglądam i słucham</small></div>
            <div class="countpill">${lessonsDone()}/${lessonsTotal()}</div>
          </button>
          <button class="modetile" data-go="pairs">
            <div class="icon">${UI.pairs}</div>
            <div class="label">Pary<small>co do czego pasuje?</small></div>
          </button>
          <button class="modetile" data-go="themes/say">
            <div class="icon">${UI.board}</div>
            <div class="label">Tablica<small>mówię z LingaRoo</small></div>
            <div class="countpill">${lessonsDone()}/${lessonsTotal()}</div>
          </button>
          ${reviewPool().length >= 6 ? `
          <button class="modetile" data-go="review">
            <div class="icon">${UI.repeat}</div>
            <div class="label">Powtórka<small>słowa, które już znam</small></div>
          </button>` : ''}
        </div>
        <div id="ttsNote"></div>
      </div>`;
    wire();
    /* Lista głosów bywa pusta zaraz po starcie — sprawdzamy po chwili,
     * żeby nie straszyć bez powodu w zwykłym Chrome. */
    later(() => {
      const note = document.getElementById('ttsNote');
      if (note && Sound.ttsLikelyMissing()) {
        note.className = 'ttsnote';
        note.textContent = 'Ta przeglądarka nie ma lektora — otwórz grę w Chrome albo Safari, a LingaRoo będzie mówił.';
      }
    }, 1200);
  }

  /* ── Wybór tematu ── */
  const leafSvg = (fill, stroke) => `<svg viewBox="0 0 24 24"><path d="M12 3c5 3 7 7 7 11a7 7 0 1 1-14 0c0-4 2-8 7-11Z" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.8"` : ''}/></svg>`;
  /* Łezka lekcji: kontur = przed cyklem, jasna = cykl domknięty,
   * pełna szałwia = wszystkie słowa utrwalone w dwóch różnych dniach. */
  function themeLeaves(t) {
    const done = Math.min(Progress.done(t.id), themeBoxes(t).length);
    return `<div class="boxleaves">${themeBoxes(t).map((_, i) => {
      if (i >= done) return `<div class="leaf">${leafSvg('var(--paper)', 'var(--dim-txt)')}</div>`;
      return `<div class="leaf">${Progress.masteredLesson(t.id, i)
        ? leafSvg('var(--sage)')
        : leafSvg('var(--sage-pale)', 'var(--sage)')}</div>`;
    }).join('')}
      <span class="cnt">${done}/${themeBoxes(t).length}</span></div>`;
  }
  const lessonsDone = () => THEMES.reduce((n, t) => n + Math.min(Progress.done(t.id), themeBoxes(t).length), 0);
  const lessonsTotal = () => THEMES.reduce((n, t) => n + themeBoxes(t).length, 0);
  function renderThemes(mode) {
    const target = mode === 'say' ? 'say' : 'cards';
    app.innerHTML = `
      <div class="screen">
        ${topbar(target === 'say' ? 'Tablica' : 'Słówka')}
        <p class="hint">Co dziś ćwiczymy?</p>
        <div class="themes">
          ${THEMES.map(t => `
            <button class="themetile" data-go="boxes/${target}/${t.id}">
              <div class="icon">${t.coverSvg}</div>
              <div class="label">${t.pl}<small>${t.en}</small></div>
              ${themeLeaves(t)}
            </button>`).join('')}
        </div>
      </div>`;
    wire();
  }

  /* ── Półka z pudełkami tematu ──
   * Pudełka otwierają się po kolei: ukończenie sesji na bieżącym
   * odblokowuje następne. Ukończone zawsze można powtarzać. */
  function renderBoxes(mode, themeId) {
    const theme = themeById(themeId);
    const boxes = themeBoxes(theme);
    const done = Progress.done(theme.id);
    app.innerHTML = `
      <div class="screen">
        ${topbar(theme.pl)}
        <p class="hint">Wybierz lekcję</p>
        <div class="themes list">
          ${boxes.map((box, i) => {
            const state = i < done ? 'done' : i === done ? 'open' : 'locked';
            let sub = 'najpierw poprzednia lekcja';
            if (state === 'done') {
              sub = Progress.masteredLesson(theme.id, i)
                ? 'utrwalona — brawo!'
                : 'ukończona — powtórki ją utrwalą';
            } else if (state === 'open') {
              const f = Progress.flags(theme.id, i);
              const left = [];
              if (!f.seen) left.push('słówka');
              if (!f.quiz) left.push('Znajdź słowo');
              if (!f.say) left.push('Tablica');
              sub = left.length === 3 ? box.length + ' słów' : 'zostało: ' + left.join(', ');
            }
            return `
            <button class="modetile ${state === 'locked' ? 'locked' : ''}" ${state === 'locked' ? '' : `data-go="${mode}/${theme.id}/${i}"`}>
              <div class="icon">${box[0].svg}</div>
              <div class="label">Lekcja ${i + 1}
                <small>${sub}</small>
              </div>
              ${state === 'done' ? `<div class="donebadge">${UI.check}</div>` : ''}
            </button>`;
          }).join('')}
        </div>
      </div>`;
    wire();
  }

  /* Strażnik pudełek: do zamkniętego poziomu prowadzi tylko półka. */
  function guardLevel(mode, themeId, level) {
    if (level > Progress.done(themeId)) { goto(`boxes/${mode}/${themeId}`); return false; }
    return true;
  }

  /* ── Słówka: karty do oglądania ── */
  let cardIdx = 0;
  let cardTheme = '';
  function renderCards(themeId, level) {
    const theme = themeById(themeId);
    if (!guardLevel('cards', theme.id, level)) return;
    const words = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    const key = `${theme.id}/${level}`;
    if (cardTheme !== key) { cardTheme = key; cardIdx = 0; }
    const w = words[cardIdx];
    app.innerHTML = `
      <div class="screen">
        ${topbar(theme.pl)}
        <div class="stage">
          <div class="wordcard" id="card" aria-label="${w.en}">
            <div class="art">${w.svg}</div>
            <div class="speaker">${UI.speaker}</div>
          </div>
          <div class="wordlabel">
            <div class="en">${w.en}</div>
            ${Settings.get('plHints') ? `<div class="pl">${w.pl}</div>` : ''}
          </div>
          <div class="cardnav">
            <button class="woodbtn" id="prev" ${cardIdx === 0 ? 'disabled' : ''} aria-label="Poprzednie"><div>${UI.arrowLeft}</div></button>
            <div class="dots">${words.map((_, i) => `<div class="dot ${i === cardIdx ? 'on' : ''}"></div>`).join('')}</div>
            <button class="woodbtn" id="next" ${cardIdx === words.length - 1 ? 'disabled' : ''} aria-label="Następne"><div>${UI.arrowRight}</div></button>
          </div>
          <div class="quizmsg" id="seenNote"></div>
          <button class="softbtn" data-go="quiz/${theme.id}/${level}">Znajdź słowo</button>
        </div>
      </div>`;
    wire();
    /* Dotarcie do ostatniej karty odhacza „obejrzane" w cyklu lekcji. */
    if (cardIdx === words.length - 1) {
      const closed = Progress.mark(theme.id, level, 'seen');
      if (closed) {
        Sound.chime();
        const note = document.getElementById('seenNote');
        note.textContent = 'Otworzyła się nowa lekcja!';
        note.style.color = 'var(--sage)';
      }
    }
    /* Dotknięcie karty zawsze daje widoczną odpowiedź — dźwięk nigdy nie
     * jest jedynym potwierdzeniem, że coś się stało. */
    const card = document.getElementById('card');
    const label = app.querySelector('.wordlabel .en');
    const speakWord = () => {
      card.classList.remove('saying');
      label.classList.remove('saying');
      void card.offsetWidth;
      card.classList.add('saying');
      label.classList.add('saying');
      Sound.speak(w.en);
    };
    card.addEventListener('click', speakWord);
    document.getElementById('prev').addEventListener('click', () => {
      if (cardIdx > 0) { cardIdx--; renderCards(theme.id, level); Sound.speak(words[cardIdx].en); }
    });
    document.getElementById('next').addEventListener('click', () => {
      if (cardIdx < words.length - 1) { cardIdx++; renderCards(theme.id, level); Sound.speak(words[cardIdx].en); }
    });
  }

  /* ── Znajdź słowo: pokaż trzy karty, poproś o jedną ──
   * Błędny wybór tylko lekko kołysze kartą — dziecko poprawia się samo.
   * Pierwsze przejście: słuchanie (lektor pyta). Powtórki tej samej lekcji
   * ćwiczą czytanie: napis→obrazek i obrazek→napis, bez podpowiedzi głosem. */
  let quiz = null;
  function newQuiz(themeId, level) {
    const theme = themeById(themeId);
    const words = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    const replay = Progress.flags(theme.id, level).quiz;
    const total = 5;
    const variants = Array.from({ length: total }, (_, i) => (replay ? (i % 2 ? 'pic2word' : 'word2pic') : 'listen'));
    return { theme, level, words, round: 0, total, variants, order: shuffle(words), locked: false };
  }
  function quizRoundData() {
    const target = quiz.order[quiz.round % quiz.order.length];
    const others = shuffle(quiz.words.filter(w => w.en !== target.en)).slice(0, 2);
    return { target, options: shuffle([target, ...others]) };
  }
  function renderQuiz(themeId, level, fresh) {
    if (!guardLevel('cards', themeId, level)) return;
    if (fresh || !quiz || quiz.theme.id !== themeId || quiz.level !== level) quiz = newQuiz(themeId, level);
    if (quiz.round >= quiz.total) {
      renderEnd(`quiz/${themeId}/${level}`, { themeId, level, activity: 'quiz', backTo: `boxes/cards/${themeId}` });
      return;
    }
    const { target, options } = quizRoundData();
    const variant = quiz.variants[quiz.round];
    quiz.current = target;
    quiz.variant = variant;
    quiz.locked = false;
    const promptHtml = variant === 'pic2word'
      ? `<div class="prompt"><div class="minicard">${target.svg}</div></div>`
      : `<div class="prompt">
           <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
           <span>${target.en}</span>
         </div>`;
    const optionsHtml = variant === 'pic2word'
      ? options.map(o => `<button class="wordcard textcard" data-word="${o.en}" aria-label="${o.en}"><span>${o.en}</span></button>`).join('')
      : options.map(o => `<button class="wordcard" data-word="${o.en}" aria-label="${o.en}"><div class="art">${o.svg}</div></button>`).join('');
    app.innerHTML = `
      <div class="screen">
        ${topbar(quiz.theme.pl)}
        <div class="stage">
          ${promptHtml}
          <div class="choices">
            ${optionsHtml}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="teacher"><div class="fig" id="fig" data-roo="hero">${TEACHER_SVG}</div></div>
        </div>
        ${trackHtml(quiz.round)}
      </div>`;
    wire();
    const ask = () => Sound.speak(`Where is the ${target.en}?`);
    /* Warianty czytane obywają się bez lektora — to jest ich sens. */
    if (variant === 'listen') later(ask, 350);
    const replayBtn = document.getElementById('replay');
    if (replayBtn) replayBtn.addEventListener('click', () => {
      variant === 'listen' ? ask() : Sound.speak(target.en);
    });
    app.querySelectorAll('[data-word]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (quiz.locked) return;
        if (btn.dataset.word === target.en) {
          quiz.locked = true;
          Sound.chime();
          Sound.speak(target.en);
          Progress.wordCorrect(target.en);
          btn.classList.add('matched');
          document.getElementById('fig').classList.add('hop');
          later(() => { quiz.round++; renderQuiz(themeId, level); }, 1400);
        } else {
          /* Zły wybór dostaje wyraźny, ale spokojny sygnał: czerwonawa
           * ramka, kołysanie, kiwnięcie LingaRoo i krótki komunikat. */
          btn.classList.remove('wrong');
          void btn.offsetWidth; /* restart animacji */
          btn.classList.add('wrong');
          const msg = document.getElementById('quizMsg');
          const fig = document.getElementById('fig');
          msg.textContent = `Let's try that again`;
          fig.classList.remove('nod');
          void fig.offsetWidth;
          fig.classList.add('nod');
          later(() => {
            btn.classList.remove('wrong');
            fig.classList.remove('nod');
            if (msg.textContent === `Let's try that again`) msg.textContent = '';
          }, 1600);
        }
      });
    });
  }

  /* ── Powtórka: słowa z ukończonych lekcji, najpierw najsłabiej utrwalone ──
   * Miks form: słuchanie→obrazek i obrazek→napis. Niekończące się źródło
   * powtórek z materiału, który dziecko już zna. */
  let review = null;
  function newReview() {
    const pool = reviewPool();
    if (pool.length < 6) return null;
    const ranked = shuffle(pool).sort((a, b) =>
      (Progress.wordDays(a.en) - Progress.wordDays(b.en)) ||
      (Progress.wordLast(a.en) < Progress.wordLast(b.en) ? -1 : 1));
    return { pool, targets: ranked.slice(0, 5), round: 0, total: 5, locked: false };
  }
  function renderReview(fresh) {
    if (fresh || !review) review = newReview();
    if (!review) { goto('home'); return; }
    if (review.round >= review.total) { renderEnd('review'); return; }
    const target = review.targets[review.round];
    const variant = review.round % 2 ? 'pic2word' : 'listen';
    const others = shuffle(review.pool.filter(w => w.en !== target.en))
      .filter((w, i, arr) => arr.findIndex(x => x.en === w.en) === i)
      .slice(0, 2);
    const options = shuffle([target, ...others]);
    review.current = target;
    review.variant = variant;
    review.locked = false;
    const promptHtml = variant === 'pic2word'
      ? `<div class="prompt"><div class="minicard">${target.svg}</div></div>`
      : `<div class="prompt">
           <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
           <span>${target.en}</span>
         </div>`;
    const optionsHtml = variant === 'pic2word'
      ? options.map(o => `<button class="wordcard textcard" data-word="${o.en}" aria-label="${o.en}"><span>${o.en}</span></button>`).join('')
      : options.map(o => `<button class="wordcard" data-word="${o.en}" aria-label="${o.en}"><div class="art">${o.svg}</div></button>`).join('');
    app.innerHTML = `
      <div class="screen">
        ${topbar('Powtórka')}
        <div class="stage">
          ${promptHtml}
          <div class="choices">${optionsHtml}</div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="teacher"><div class="fig" id="fig" data-roo="hero">${TEACHER_SVG}</div></div>
        </div>
        ${trackHtml(review.round)}
      </div>`;
    wire();
    const ask = () => Sound.speak(`Where is the ${target.en}?`);
    if (variant === 'listen') later(ask, 350);
    const replayBtn = document.getElementById('replay');
    if (replayBtn) replayBtn.addEventListener('click', ask);
    app.querySelectorAll('[data-word]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (review.locked) return;
        if (btn.dataset.word === target.en) {
          review.locked = true;
          Sound.chime();
          Sound.speak(target.en);
          Progress.wordCorrect(target.en);
          btn.classList.add('matched');
          document.getElementById('fig').classList.add('hop');
          later(() => { review.round++; renderReview(); }, 1400);
        } else {
          btn.classList.remove('wrong');
          void btn.offsetWidth;
          btn.classList.add('wrong');
          const msg = document.getElementById('quizMsg');
          msg.textContent = `Let's try that again`;
          later(() => { btn.classList.remove('wrong'); if (msg.textContent) msg.textContent = ''; }, 1600);
        }
      });
    });
  }

  /* ── Pary ── */
  let pairs = null;
  function newPairs() {
    const chosen = shuffle(PAIRS).slice(0, 4);
    const tiles = shuffle(chosen.flatMap(p => [
      { pair: p.id, en: p.a.en, svg: p.a.svg },
      { pair: p.id, en: p.b.en, svg: p.b.svg },
    ]));
    return { tiles, picked: null, matched: new Set(), locked: false };
  }
  function renderPairs(fresh) {
    if (fresh || !pairs) pairs = newPairs();
    if (pairs.matched.size === 4) { renderEnd('pairs'); return; }
    app.innerHTML = `
      <div class="screen">
        ${topbar('Pary')}
        <div class="stage">
          <div class="pairsgrid">
            ${pairs.tiles.map((t, i) => pairs.matched.has(t.pair) ? '' : `
              <button class="wordcard" data-i="${i}" aria-label="${t.en}">
                <div class="art">${t.svg}</div>
                <div class="cap">${t.en}</div>
              </button>`).join('')}
          </div>
          <div class="teacher"><div class="fig" id="fig" data-roo="hero">${TEACHER_SVG}</div></div>
        </div>
      </div>`;
    wire();
    const btns = app.querySelectorAll('[data-i]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        const tile = pairs.tiles[i];
        if (pairs.locked || pairs.matched.has(tile.pair)) return;
        Sound.speak(tile.en);
        if (pairs.picked === null) {
          pairs.picked = i;
          btn.classList.add('picked');
          return;
        }
        if (pairs.picked === i) { btn.classList.remove('picked'); pairs.picked = null; return; }
        const first = pairs.tiles[pairs.picked];
        const firstBtn = app.querySelector(`[data-i="${pairs.picked}"]`);
        if (first.pair === tile.pair) {
          pairs.matched.add(tile.pair);
          pairs.picked = null;
          firstBtn.classList.remove('picked');
          /* Trafiona para znika, a reszta kafelków spokojnie dosuwa się
           * do lewego górnego rogu (FLIP) — bez dziur i bez przeskoków. */
          firstBtn.classList.add('gone');
          btn.classList.add('gone');
          later(() => compactPairs([firstBtn, btn]), 580);
          Sound.chime();
          document.getElementById('fig').classList.add('hop');
          later(() => document.getElementById('fig') && document.getElementById('fig').classList.remove('hop'), 700);
          if (pairs.matched.size === 4) later(() => renderEnd('pairs'), 1300);
        } else {
          pairs.locked = true;
          firstBtn.classList.add('wrong');
          btn.classList.add('wrong');
          later(() => {
            firstBtn.classList.remove('wrong', 'picked');
            btn.classList.remove('wrong');
            pairs.picked = null;
            pairs.locked = false;
          }, 500);
        }
      });
    });
  }

  /* ── Tablica: Tap & Say ──
   * Domyślnie tryb echa: LingaRoo mówi, dziecko powtarza, nikt nie ocenia.
   * Sprawdzanie wymowy włącza się w Strefie Rodzica i działa tylko tam,
   * gdzie przeglądarka ma rozpoznawanie mowy. */
  let say = null;
  function newSay(themeId, level) {
    const theme = themeById(themeId);
    const box = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    return { theme, level, words: shuffle(box).slice(0, 5), round: 0, phase: 'prompt', revealed: 0 };
  }
  function renderSay(themeId, level, fresh) {
    if (!guardLevel('say', themeId, level)) return;
    if (fresh || !say || say.theme.id !== themeId || say.level !== level) say = newSay(themeId, level);
    if (say.round >= say.words.length) {
      renderEnd(`say/${themeId}/${level}`, { themeId, level, activity: 'say', backTo: `boxes/say/${themeId}` });
      return;
    }
    const w = say.words[say.round];
    const ph = say.phase;
    const statusTxt =
      ph === 'listening' ? 'Listening…' :
      ph === 'retry' ? `Let's try that again` :
      ph === 'success' ? '' : 'Say the word out loud';
    const figAnim = ph === 'listening' ? 'tilt' : ph === 'success' ? 'hop' : ph === 'retry' ? 'nod' : '';
    app.innerHTML = `
      <div class="screen">
        ${topbar('Tablica')}
        <div class="stage">
          <div class="boardwrap">
            <div class="board">
              <div class="frame">
                <div class="art">${w.svg}</div>
                <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
              </div>
              ${ph === 'success'
                ? `<div class="chalkword ${w.en.length > 7 ? 'long' : ''}" id="chalk"></div>`
                : `<div class="status">${statusTxt}</div>`}
            </div>
            <div class="microw">
              <div class="micring">
                ${ph === 'listening' ? '<div class="ring"></div><div class="ring r2"></div>' : ''}
                <button class="micbtn ${ph === 'listening' ? 'listening' : ph === 'success' ? 'done' : ''}" id="mic" aria-label="Powiedz słowo">${UI.mic}</button>
              </div>
            </div>
            <div class="miccap">TAP &amp; SAY</div>
          </div>
          <div class="teacher">
            <div class="fig ${figAnim}" id="fig" data-roo="hero">${TEACHER_SVG}</div>
            ${ph === 'success' ? `<div class="badge">${UI.check}</div>` : ''}
          </div>
        </div>
        ${trackHtml(say.round)}
      </div>`;
    wire();
    const sayWord = () => Sound.speak(w.en);
    document.getElementById('replay').addEventListener('click', sayWord);
    if (ph === 'prompt' && !say.spoken) {
      say.spoken = true;
      later(sayWord, 400);
    }
    document.getElementById('mic').addEventListener('click', () => {
      if (say.phase !== 'prompt' && say.phase !== 'retry') return;
      say.phase = 'listening';
      renderSay(themeId, level);
      const finish = ok => {
        if (!say || say.phase !== 'listening') return;
        activeRecognition = null;
        ok ? succeed() : retry();
      };
      if (Settings.get('checkSpeech') && Speech.supported) {
        activeRecognition = Speech.listenOnce(said => {
          finish(said !== null && said.includes(w.en.toLowerCase()));
        });
      } else {
        /* Tryb echa: dajemy chwilę na powtórzenie i cieszymy się razem. */
        later(() => finish(true), 2400);
      }
    });
    function succeed() {
      say.phase = 'success';
      say.revealed = 0;
      renderSay(themeId, level);
      const chalk = document.getElementById('chalk');
      const letters = w.en.toUpperCase().split('');
      const t = everyLetter(() => {
        say.revealed++;
        Sound.tick();
        chalk.textContent = letters.slice(0, say.revealed).join(' ');
        if (say.revealed >= letters.length) {
          clearInterval(t);
          Sound.chime();
          Progress.wordCorrect(w.en);
          /* Po napisaniu słowa kredą LingaRoo czyta je w całości. */
          later(() => Sound.speak(w.en), 350);
          later(() => {
            say.round++;
            say.phase = 'prompt';
            say.spoken = false;
            renderSay(themeId, level);
          }, 2200);
        }
      }, 260);
    }
    function retry() {
      say.phase = 'retry';
      renderSay(themeId, level);
      later(sayWord, 500);
      later(() => {
        if (say && say.phase === 'retry') { say.phase = 'prompt'; renderSay(themeId, level); }
      }, 1900);
    }
  }

  /* Po zniknięciu pary pozostałe kafelki dosuwają się bez dziur:
   * zdejmujemy trafione z siatki i animujemy resztę ze starych pozycji
   * na nowe (FLIP). */
  function compactPairs(goneBtns) {
    const grid = app.querySelector('.pairsgrid');
    if (!grid) return;
    const rest = [...grid.querySelectorAll('[data-i]')]
      .filter(b => b.style.display !== 'none' && !goneBtns.includes(b));
    const before = new Map(rest.map(b => [b, b.getBoundingClientRect()]));
    goneBtns.forEach(b => { b.style.display = 'none'; });
    rest.forEach(b => {
      const a = before.get(b);
      const z = b.getBoundingClientRect();
      const dx = a.left - z.left, dy = a.top - z.top;
      if (!dx && !dy) return;
      b.style.transition = 'none';
      b.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        b.style.transition = 'transform 0.45s ease';
        b.style.transform = '';
      });
      later(() => { b.style.transition = ''; }, 550);
    });
  }

  /* ── Koniec sesji — spokojna pochwała, bez punktów ──
   * Jedyny punkt zaliczania pudełek: każda ukończona sesja przechodzi
   * tędy, więc postęp nie ma bocznych ścieżek. */
  function renderEnd(againRoute, completion) {
    Sound.speak('Well done!');
    let msg = 'Brawo, to była dobra zabawa.';
    let nextBtn = '';
    if (completion) {
      const theme = themeById(completion.themeId);
      const total = themeBoxes(theme).length;
      const closed = Progress.mark(theme.id, completion.level, completion.activity);
      const flags = Progress.flags(theme.id, completion.level);
      const missing = [];
      if (!flags.seen) missing.push(['cards', 'Obejrzyj słówka', 'słówka']);
      if (!flags.quiz) missing.push(['quiz', 'Znajdź słowo', 'Znajdź słowo']);
      if (!flags.say) missing.push(['say', 'Tablica', 'Tablica']);
      if (closed) {
        if (completion.level + 1 < total) {
          msg = 'Otworzyła się nowa lekcja!';
          /* Nowa lekcja zaczyna się od poznania słówek, nie od zgadywania. */
          nextBtn = `<button class="softbtn" data-go="cards/${completion.themeId}/${completion.level + 1}">Następna lekcja</button>`;
        } else {
          msg = `Wszystkie lekcje z tematu „${theme.pl}" ukończone!`;
        }
      } else if (missing.length) {
        const first = missing[0];
        msg = `Do otwarcia następnej lekcji: ${missing.map(m => m[2]).join(' i ')}.`;
        nextBtn = `<button class="softbtn" data-go="${first[0]}/${completion.themeId}/${completion.level}">${first[1]}</button>`;
      }
    }
    app.innerHTML = `
      <div class="screen">
        ${topbar('')}
        <div class="stage">
          <div class="endpanel">
            <div class="fig" data-roo="hero">${TEACHER_SVG}</div>
            <h2>Well done!</h2>
            <p>${msg}</p>
            <div class="endrow">
              <button class="softbtn wood" data-go="${completion ? completion.backTo : 'home'}">${completion ? 'Lekcje' : 'Menu'}</button>
              ${nextBtn || `<button class="softbtn" id="again">${againRoute === 'pairs' ? 'Następne pary' : 'Jeszcze raz'}</button>`}
            </div>
          </div>
        </div>
        ${trackHtml(5)}
      </div>`;
    wire();
    const again = document.getElementById('again');
    if (again) again.addEventListener('click', () => {
      const p = againRoute.split('/');
      if (p[0] === 'quiz') { renderQuiz(p[1], parseInt(p[2] || '0', 10) || 0, true); }
      else if (p[0] === 'say') { renderSay(p[1], parseInt(p[2] || '0', 10) || 0, true); }
      else if (againRoute === 'pairs') { renderPairs(true); }
      else if (againRoute === 'review') { renderReview(true); }
      else goto('home');
    });
  }

  /* ── Strefa Rodzica: bramka przytrzymania (3 s) ── */
  function renderGate() {
    app.innerHTML = `
      <div class="screen">
        ${topbar('Strefa Rodzica')}
        <div class="gate">
          <p>Dla dorosłych: przytrzymaj kółko przez trzy sekundy.</p>
          <button class="holdbtn" id="hold" aria-label="Przytrzymaj 3 sekundy">
            <svg class="dial" width="122" height="122" viewBox="0 0 122 122">
              <circle cx="61" cy="61" r="56" fill="none" stroke="var(--line)" stroke-width="5"/>
              <circle id="dialArc" cx="61" cy="61" r="56" fill="none" stroke="var(--sage)" stroke-width="5"
                stroke-linecap="round" stroke-dasharray="352" stroke-dashoffset="352"/>
            </svg>
            <div class="inner">${UI.gear}</div>
          </button>
        </div>
      </div>`;
    wire();
    const hold = document.getElementById('hold');
    const arc = document.getElementById('dialArc');
    let start = null, raf = null;
    const HOLD_MS = 3000;
    function step(ts) {
      if (start === null) return;
      const p = Math.min(1, (ts - start) / HOLD_MS);
      arc.setAttribute('stroke-dashoffset', String(352 * (1 - p)));
      if (p >= 1) { start = null; goto('parent'); return; }
      raf = requestAnimationFrame(step);
    }
    const begin = e => { e.preventDefault(); start = performance.now(); raf = requestAnimationFrame(step); };
    const cancel = () => { start = null; if (raf) cancelAnimationFrame(raf); arc.setAttribute('stroke-dashoffset', '352'); };
    hold.addEventListener('pointerdown', begin);
    hold.addEventListener('pointerup', cancel);
    hold.addEventListener('pointerleave', cancel);
    hold.addEventListener('contextmenu', e => e.preventDefault());
  }

  function renderParent() {
    const srNote = Speech.supported
      ? 'Gdy wyłączone, LingaRoo prosi o powtórzenie i nie ocenia.'
      : 'Ta przeglądarka nie ma rozpoznawania mowy — LingaRoo prosi o powtórzenie i nie ocenia.';
    app.innerHTML = `
      <div class="screen">
        ${topbar('Strefa Rodzica')}
        <div class="settings">
          <div class="setrow">
            <div class="txt">Dźwięk i lektor<small>Wyciszenie działa też po ponownym uruchomieniu.</small></div>
            <button class="toggle ${Settings.get('sound') ? 'on' : ''}" data-set="sound" role="switch" aria-checked="${Settings.get('sound')}" aria-label="Dźwięk"></button>
          </div>
          <div class="setrow">
            <div class="txt">Tempo lektora<small>Wolniej bywa wyraźniej.</small></div>
            <input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="${Settings.get('rate')}" aria-label="Tempo lektora">
          </div>
          <div class="setrow">
            <div class="txt">Lektor angielski<small>${(() => {
              const s = Sound.ttsStatus();
              if (!s.available) return 'Ta przeglądarka nie ma syntezatora mowy — gra działa, ale bez lektora.';
              if (s.en === 0) return 'Nie widać jeszcze głosu angielskiego. Jeśli test milczy, zainstaluj głos angielski w ustawieniach systemu (Tekst na mowę).';
              return `Głosy angielskie w systemie: ${s.en}. Jeśli test milczy, sprawdź tryb cichy telefonu.`;
            })()}</small></div>
            <button class="softbtn mini" id="ttsTest">Test</button>
          </div>
          <div class="setrow">
            <div class="txt">Polskie podpowiedzi<small>Małe polskie podpisy pod angielskimi słowami.</small></div>
            <button class="toggle ${Settings.get('plHints') ? 'on' : ''}" data-set="plHints" role="switch" aria-checked="${Settings.get('plHints')}" aria-label="Polskie podpowiedzi"></button>
          </div>
          <div class="setrow">
            <div class="txt">Sprawdzanie wymowy<small>${srNote}</small></div>
            <button class="toggle ${Settings.get('checkSpeech') && Speech.supported ? 'on' : ''}" data-set="checkSpeech" ${Speech.supported ? '' : 'disabled'} role="switch" aria-checked="${Settings.get('checkSpeech') && Speech.supported}" aria-label="Sprawdzanie wymowy"></button>
          </div>
          ${(() => {
            const prof = Profiles.active();
            if (!prof) return `
          <div class="setrow">
            <div class="txt">Profile<small>Brak aktywnego profilu — wybierz go na ekranie „Kto dziś się bawi?".</small></div>
            <button class="softbtn mini wood" data-go="who">Wybierz</button>
          </div>`;
            return `
          <div class="setrow">
            <div class="txt">Postępy: ${esc(prof.name)}<small>Ukończone lekcje: ${THEMES.reduce((n, t) => n + Math.min(Progress.done(t.id), themeBoxes(t).length), 0)} z ${THEMES.reduce((n, t) => n + themeBoxes(t).length, 0)}. Wyzerowanie zamyka wszystkie lekcje poza pierwszymi.</small></div>
            <button class="softbtn mini wood" id="resetProg">Wyzeruj</button>
          </div>
          <div class="setrow">
            <div class="txt">Usuń profil „${esc(prof.name)}"<small>Znika profil i jego postępy z tego urządzenia. Profile: ${Profiles.list().length} z ${Profiles.MAX}.</small></div>
            <button class="softbtn mini danger" id="delProf">Usuń</button>
          </div>`;
          })()}
        </div>
        <p class="about">LingaRoo 0.1 — angielski dla dzieci, spokojnie.<br>
        Bez reklam, bez punktów, bez presji czasu. Wszystko działa bez internetu.</p>
      </div>`;
    wire();
    app.querySelectorAll('[data-set]').forEach(t => {
      t.addEventListener('click', () => {
        if (t.hasAttribute('disabled')) return;
        const k = t.dataset.set;
        Settings.set(k, !Settings.get(k));
        renderParent();
      });
    });
    document.getElementById('rate').addEventListener('change', e => {
      Settings.set('rate', parseFloat(e.target.value));
      Sound.speak('Hello, I am LingaRoo.');
    });
    document.getElementById('ttsTest').addEventListener('click', () => {
      Sound.speak('Hello! I am LingaRoo. Nice to meet you.');
    });
    /* Działania niszczące wymagają drugiego dotknięcia — bez okien dialogowych. */
    const arm = (btn, label, fn) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (btn.dataset.armed) { fn(); return; }
        btn.dataset.armed = '1';
        btn.textContent = 'Na pewno?';
        later(() => { if (document.body.contains(btn)) { delete btn.dataset.armed; btn.textContent = label; } }, 3500);
      });
    };
    arm(document.getElementById('resetProg'), 'Wyzeruj', () => { Progress.reset(); renderParent(); });
    arm(document.getElementById('delProf'), 'Usuń', () => {
      const prof = Profiles.active();
      if (prof) Profiles.remove(prof.id);
      goto('who');
    });
  }

  /* ── Render główny ── */
  function render() {
    clearTimers();
    if (activeRecognition) { try { activeRecognition.abort(); } catch (e) {} activeRecognition = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const r = route();
    /* Bez aktywnego profilu wszystko prowadzi do „Kto dziś się bawi?"
     * (poza Strefą Rodzica, która jest ustawieniem urządzenia). */
    if (!Profiles.active() && !['who', 'gate', 'parent'].includes(r.name)) {
      renderWho();
      window.scrollTo(0, 0);
      return;
    }
    const lvl = parseInt(r.arg2 || '0', 10) || 0;
    switch (r.name) {
      case 'who':    renderWho(); break;
      case 'themes': renderThemes(r.arg); break;
      case 'boxes':  renderBoxes(r.arg === 'say' ? 'say' : 'cards', r.arg2); break;
      case 'cards':  renderCards(r.arg, lvl); break;
      case 'quiz':   renderQuiz(r.arg, lvl, true); break;
      case 'pairs':  renderPairs(true); break;
      case 'review': renderReview(true); break;
      case 'say':    renderSay(r.arg, lvl, true); break;
      case 'gate':   renderGate(); break;
      case 'parent': renderParent(); break;
      default:       renderHome();
    }
    window.scrollTo(0, 0);
  }

  /* Rejestracja service workera — offline po pierwszej wizycie. */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  /* Stan diagnostyczny tylko za flagą ?debug. */
  if (new URLSearchParams(location.search).has('debug')) {
    window.lingaDebug = () => ({
      route: route(),
      quiz: quiz && { round: quiz.round, level: quiz.level, variant: quiz.variant, current: quiz.current && quiz.current.en },
      review: review && { round: review.round, variant: review.variant, current: review.current && review.current.en, poolSize: review.pool.length },
      lessonFlags: (t, l) => Progress.flags(t, l),
      wordDays: en => Progress.wordDays(en),
      say: say && { round: say.round, level: say.level, phase: say.phase, word: say.words[say.round] && say.words[say.round].en },
      pairs: pairs && { matched: [...pairs.matched], picked: pairs.picked, tiles: pairs.tiles.map(t => t.pair) },
      progress: THEMES.reduce((o, t) => (o[t.id] = Progress.done(t.id), o), {}),
      profiles: { active: (Profiles.active() || {}).name || null, count: Profiles.list().length },
      settings: ['sound', 'rate', 'plHints', 'checkSpeech'].reduce((o, k) => (o[k] = Settings.get(k), o), {}),
    });
  }

  render();
})();
