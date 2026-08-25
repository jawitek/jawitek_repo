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
        return { seen: !!l.seen, quiz: !!l.quiz, say: !!l.say, trip: !!l.trip };
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
  /* Powrót do apki z pamięci przeglądarki (bfcache) przywraca stary DOM —
   * renderujemy od nowa, żeby ekran zawsze odpowiadał bieżącemu stanowi. */
  window.addEventListener('pageshow', e => { if (e.persisted) render(); });

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
    const srcs = { hero: 'assets/roo-hero.png?v=1', pack: 'assets/roo-pack.png?v=1' };
    const ready = {};
    Object.entries(srcs).forEach(([k, src]) => {
      const im = new Image();
      im.onload = () => { ready[k] = im.src; upgradeRoos(); };
      im.src = src;
    });
    return { get: k => ready[k] || null };
  })();
  function upgradeRoos() {
    app.querySelectorAll('[data-roo]').forEach(el => {
      const src = RooArt.get(el.dataset.roo);
      if (src && !el.querySelector('img')) el.innerHTML = `<img src="${src}" alt="">`;
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
          <div class="roo" data-roo="hero">${TEACHER_SVG}</div>
          <div class="bubble">Hello${act ? ', ' + esc(act.name) : ''}!<small>Pobawimy się razem?</small></div>
        </div>
        <div class="modes">
          ${(() => { const c = nextStep(); return `
          <button class="modetile continue" data-go="${c.route}">
            <div class="icon">${UI.play}</div>
            <div class="label">Kontynuuj naukę<small>${c.label}</small></div>
          </button>`; })()}
          <button class="modetile" data-go="themes">
            <div class="icon">${UI.cards}</div>
            <div class="label">Nauka<small>tematy i lekcje</small></div>
            <div class="countpill">${lessonsDone()}/${lessonsTotal()}</div>
          </button>
          <button class="modetile" data-go="pairs">
            <div class="icon">${UI.pairs}</div>
            <div class="label">Pary<small>co do czego pasuje?</small></div>
          </button>
          ${reviewPool().length >= 6 ? `
          <button class="modetile" data-go="review">
            <div class="icon">${UI.repeat}</div>
            <div class="label">Powtórka<small>słowa, które już znam</small></div>
          </button>` : ''}
        </div>
        <div id="ttsNote"></div>
        ${Survey.done() ? '' : `
        <button class="surveycard" data-go="survey">
          <span class="ico">${UI.form}</span>
          <span>Ankieta dla rodzica<small>2 minuty — pomóż ulepszyć grę</small></span>
        </button>`}
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

  /* Ostatnio ćwiczona lekcja (per profil) — „Kontynuuj naukę" wraca tam. */
  const lastKey = () => { const p = Profiles.active(); return 'lingaroo.last' + (p ? '.' + p.id : ''); };
  function rememberLesson(themeId, level) {
    try { localStorage.setItem(lastKey(), JSON.stringify({ theme: themeId, level })); } catch (e) {}
  }
  /* Co dalej? Najpierw ostatnio ćwiczony temat, potem kolejne — pierwsza
   * nieukończona lekcja i jej pierwszy brakujący krok. */
  function nextStep() {
    let last = null;
    try { last = JSON.parse(localStorage.getItem(lastKey()) || 'null'); } catch (e) {}
    const order = [];
    if (last) order.push(themeById(last.theme));
    THEMES.forEach(t => { if (!order.includes(t)) order.push(t); });
    for (const t of order) {
      const lvl = Progress.done(t.id);
      if (lvl >= themeBoxes(t).length) continue;
      const f = Progress.flags(t.id, lvl);
      const act = !f.seen ? ['cards', 'Słówka'] : !f.quiz ? ['quiz', 'Znajdź słowo'] : ['say', 'Tablica'];
      return { route: `${act[0]}/${t.id}/${lvl}`, label: `${t.pl} · Lekcja ${lvl + 1} · ${act[1]}` };
    }
    return { route: 'review', label: 'Wszystko ukończone — czas na Powtórkę!' };
  }
  function renderThemes() {
    app.innerHTML = `
      <div class="screen">
        ${topbar('Nauka')}
        <p class="hint">Co dziś ćwiczymy?</p>
        <div class="themes">
          ${THEMES.map(t => `
            <button class="themetile" data-go="boxes/${t.id}">
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
  function renderBoxes(themeId) {
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
            <button class="modetile ${state === 'locked' ? 'locked' : ''}" ${state === 'locked' ? '' : `data-go="lesson/${theme.id}/${i}"`}>
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

  /* Strażnik lekcji: do zamkniętego poziomu prowadzi tylko półka. */
  function guardLevel(themeId, level) {
    if (level > Progress.done(themeId)) { goto(`boxes/${themeId}`); return false; }
    return true;
  }

  /* ── Lekcja: trzy kroki z ptaszkami, następny podświetlony ── */
  /* Czwarty kafelek lekcji: zabawa utrwalająca dobrana do tematu.
   * Wszystkie zapisują się pod tą samą flagą 'trip' — lekcja ma jedną
   * zabawę, więc odhaczenie jest jednoznaczne. */
  function funStep(themeId) {
    if (themeId === 'body') return ['touch', UI.hand, 'Dotknij!', 'pokaż, gdzie to jest'];
    if (themeId === 'opposites' || themeId === 'colors') return ['sort', SVG_BASKET, 'Koszyki', 'posortuj do koszyków'];
    if (themeId === 'weather' || themeId === 'clothes') return ['dress', SVG_UMBRELLA, 'Ubierz LingaRoo', 'na dzisiejszą pogodę'];
    if (themeId === 'home') return ['clean', SVG_WARDROBE, 'Sprzątanie', 'odłóż na swoje miejsce'];
    if (TRIP_THEMES.includes(themeId)) return ['trip', BACKPACK_SVG, 'Wyprawa', 'spakuj plecak LingaRoo'];
    return null;
  }

  function renderLesson(themeId, level) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    const f = Progress.flags(theme.id, level);
    const next = !f.seen ? 'cards' : !f.quiz ? 'quiz' : !f.say ? 'say' : null;
    const steps = [
      ['cards', UI.cards, 'Słówka', 'obejrzyj i posłuchaj', f.seen],
      ['quiz', UI.find, 'Znajdź słowo', 'wskaż, co słyszysz', f.quiz],
      ['say', UI.board, 'Tablica', 'powiedz na głos', f.say],
    ];
    const fun = funStep(theme.id);
    if (fun) steps.push([...fun, f.trip]);
    app.innerHTML = `
      <div class="screen">
        ${topbar(theme.pl)}
        <p class="hint">Lekcja ${level + 1}${next ? '' : ' — ukończona, możesz powtarzać'}</p>
        <div class="themes list">
          ${steps.map(([act, icon, name, sub, done]) => `
            <button class="modetile ${act === next ? 'nextstep' : ''}" data-go="${act}/${theme.id}/${level}">
              <div class="icon">${icon}</div>
              <div class="label">${name}<small>${sub}</small></div>
              ${done ? `<div class="donebadge">${UI.check}</div>` : ''}
            </button>`).join('')}
        </div>
      </div>`;
    wire();
  }

  /* ── Słówka: karty do oglądania ── */
  let cardIdx = 0;
  let cardTheme = '';
  function renderCards(themeId, level) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
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
    /* Rundy z napisami tylko przy powtórce lekcji i tylko gdy rodzic
     * włączył ćwiczenie czytania — gra celuje w dzieci przedczytające. */
    const replay = Progress.flags(theme.id, level).quiz && Settings.get('reading');
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
    if (!guardLevel(themeId, level)) return;
    rememberLesson(themeId, level);
    if (fresh || !quiz || quiz.theme.id !== themeId || quiz.level !== level) quiz = newQuiz(themeId, level);
    if (quiz.round >= quiz.total) {
      renderEnd(`quiz/${themeId}/${level}`, { themeId, level, activity: 'quiz', backTo: `lesson/${themeId}/${level}` });
      return;
    }
    const { target, options } = quizRoundData();
    const variant = quiz.variants[quiz.round];
    quiz.current = target;
    quiz.variant = variant;
    quiz.locked = false;
    const promptHtml = variant === 'pic2word'
      ? `<div class="prompt">
           <button class="speaker" id="replay" aria-label="Posłuchaj polecenia">${UI.speaker}</button>
           <div class="minicard">${target.svg}</div>
         </div>`
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
        </div>
        ${trackHtml(quiz.round)}
      </div>`;
    wire();
    const ask = () => Sound.speak(`Where is the ${target.en}?`);
    /* Warianty czytane obywają się bez lektora — to jest ich sens. */
    if (variant === 'listen') later(ask, 350);
    const replayBtn = document.getElementById('replay');
    if (replayBtn) replayBtn.addEventListener('click', () => {
      if (variant === 'listen') ask();
      else if (variant === 'word2pic') Sound.speak(target.en);
      else Sound.speak('Find the word!');
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
          later(() => { quiz.round++; renderQuiz(themeId, level); }, 1400);
        } else {
          /* Zły wybór dostaje wyraźny, ale spokojny sygnał: czerwonawa
           * ramka, kołysanie i krótki komunikat. */
          btn.classList.remove('wrong');
          void btn.offsetWidth; /* restart animacji */
          btn.classList.add('wrong');
          const msg = document.getElementById('quizMsg');
          msg.textContent = `Let's try that again`;
          later(() => {
            btn.classList.remove('wrong');
            if (msg.textContent === `Let's try that again`) msg.textContent = '';
          }, 1600);
        }
      });
    });
  }

  /* ── Ankieta dla rodzica-testera ──
   * Jedyne miejsce, z którego cokolwiek opuszcza urządzenie — wyłącznie
   * po świadomym naciśnięciu „Wyślij", bez żadnych danych dziecka. */
  const SURVEY = [
    { id: 'age',    q: 'Ile lat ma dziecko, które grało?', opts: ['2–3', '4–5', '6–7', '8+'] },
    { id: 'eng',    q: 'Kontakt dziecka z angielskim przed grą?', opts: ['prawie żaden', 'trochę (bajki, przedszkole)', 'regularne zajęcia'] },
    { id: 'time',   q: 'Jak długo grało za pierwszym razem?', opts: ['poniżej 5 min', '5–15 min', '15–30 min', 'nie chciało skończyć'] },
    { id: 'return', q: 'Czy wracało do gry samo z siebie?', opts: ['tak, prosiło o nią', 'tak, gdy przypomniałem(-am)', 'nie wracało'] },
    { id: 'mode',   q: 'Który tryb podobał się najbardziej?', opts: ['Słówka', 'Znajdź słowo', 'Pary', 'Tablica (mówienie)', 'Powtórka'] },
    { id: 'words',  q: 'Czy dziecko użyło potem angielskiego słowa samo z siebie?', opts: ['tak, kilku', 'tak, jednego–dwóch', 'jeszcze nie'] },
    { id: 'level',  q: 'Poziom trudności był…', opts: ['za łatwy', 'w sam raz', 'za trudny', 'różnie w różnych trybach'] },
    { id: 'voice',  q: 'Oceń lektora (głos czytający słowa)', stars: 5, extra: 'dźwięk w ogóle nie działał' },
    { id: 'calm',   q: 'Spokojna, stonowana forma gry (bez punktów i fanfar)…', opts: ['to duży plus', 'jest OK', 'dziecku czegoś brakowało'] },
    { id: 'open',   q: 'Czego zabrakło albo co przeszkadzało?', text: true },
    { id: 'store',  q: 'Czy zainstalował(a)byś taką grę ze sklepu?', opts: ['tak, nawet płatną', 'tak, darmową', 'raczej nie'] },
  ];
  const Survey = (() => {
    const KEY = 'lingaroo.survey';
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
    const write = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };
    return {
      done: () => !!read().done,
      draft: () => read().draft || {},
      saveDraft(d) { const o = read(); o.draft = d; write(o); },
      markDone() { write({ done: true }); },
    };
  })();

  function renderSurvey() {
    if (Survey.done()) { renderSurveyThanks(); return; }
    const a = Survey.draft();
    app.innerHTML = `
      <div class="screen">
        ${topbar('Ankieta')}
        <p class="hint">Dla rodzica — dwie minuty. Wysyłamy tylko to, co tu zaznaczysz.</p>
        <div class="survey">
          ${SURVEY.map(s => `
            <div class="qblock" data-q="${s.id}">
              <div class="qtxt">${s.q}</div>
              ${s.opts ? `<div class="chips">${s.opts.map((o, i) =>
                `<button class="chip ${a[s.id] === i ? 'sel' : ''}" data-opt="${i}">${o}</button>`).join('')}</div>` : ''}
              ${s.stars ? `
                <div class="stars">${Array.from({ length: s.stars }, (_, i) =>
                  `<button class="star ${a[s.id] > i ? 'on' : ''}" data-star="${i + 1}" aria-label="${i + 1} z 5">★</button>`).join('')}
                </div>
                <button class="chip small ${a[s.id + '_off'] ? 'sel' : ''}" data-extra="1">${s.extra}</button>` : ''}
              ${s.text ? `<textarea class="freetext" maxlength="600" placeholder="Twoje uwagi…">${esc(a[s.id] || '')}</textarea>` : ''}
            </div>`).join('')}
          <div class="quizmsg" id="surveyMsg"></div>
          <button class="softbtn" id="surveySend">Wyślij</button>
        </div>
      </div>`;
    wire();
    const answers = { ...a };
    const persist = () => Survey.saveDraft(answers);
    app.querySelectorAll('.qblock').forEach(block => {
      const id = block.dataset.q;
      block.querySelectorAll('[data-opt]').forEach(chip => chip.addEventListener('click', () => {
        answers[id] = +chip.dataset.opt;
        block.querySelectorAll('[data-opt]').forEach(c => c.classList.toggle('sel', c === chip));
        persist();
      }));
      block.querySelectorAll('[data-star]').forEach(st => st.addEventListener('click', () => {
        answers[id] = +st.dataset.star;
        block.querySelectorAll('[data-star]').forEach(x => x.classList.toggle('on', +x.dataset.star <= answers[id]));
        persist();
      }));
      const extra = block.querySelector('[data-extra]');
      if (extra) extra.addEventListener('click', () => {
        answers[id + '_off'] = !answers[id + '_off'];
        extra.classList.toggle('sel', answers[id + '_off']);
        persist();
      });
      const ta = block.querySelector('textarea');
      if (ta) ta.addEventListener('input', () => { answers[id] = ta.value.slice(0, 600); persist(); });
    });
    document.getElementById('surveySend').addEventListener('click', async () => {
      const msg = document.getElementById('surveyMsg');
      msg.textContent = 'Wysyłanie…';
      try {
        const res = await fetch('api/feedback', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ v: 1, answers }),
        });
        if (!res.ok) throw new Error('http ' + res.status);
        Survey.markDone();
        renderSurveyThanks();
      } catch (e) {
        msg.textContent = 'Nie udało się wysłać — odpowiedzi są zapamiętane, spróbuj później przy internecie.';
      }
    });
  }

  function renderSurveyThanks() {
    app.innerHTML = `
      <div class="screen">
        ${topbar('Ankieta')}
        <div class="stage">
          <div class="endpanel">
            <div class="fig" data-roo="hero">${TEACHER_SVG}</div>
            <h2>Dziękujemy!</h2>
            <p>Twoje uwagi naprawdę kształtują tę grę.</p>
            <div class="endrow"><button class="softbtn wood" data-go="home">Menu</button></div>
          </div>
        </div>
      </div>`;
    wire();
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
    const variant = (Settings.get('reading') && review.round % 2) ? 'pic2word' : 'listen';
    const others = shuffle(review.pool.filter(w => w.en !== target.en))
      .filter((w, i, arr) => arr.findIndex(x => x.en === w.en) === i)
      .slice(0, 2);
    const options = shuffle([target, ...others]);
    review.current = target;
    review.variant = variant;
    review.locked = false;
    const promptHtml = variant === 'pic2word'
      ? `<div class="prompt">
           <button class="speaker" id="replay" aria-label="Posłuchaj polecenia">${UI.speaker}</button>
           <div class="minicard">${target.svg}</div>
         </div>`
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

  /* ── Wyprawa: utrwalenie lekcji — spakuj plecak LingaRoo ──
   * Lektor prosi („Pack all the apples!"), dziecko przeciąga albo stuka
   * właściwe rzeczy; plecak łagodnie oddaje złe. Trudność rośnie:
   * rzeczowniki → kolor+rzeczownik (gdy lekcja ma przebarwialny przedmiot)
   * → rozmiar. Nie odblokowuje lekcji — utrwala słowa (dojrzewanie łezek). */

  /* Wspólny silnik przeciągania dla zabaw [data-i] → strefa.
   * Element można przeciągnąć (o trafieniu decyduje przecięcie prostokątów)
   * albo stuknąć: przy jednej strefie stuknięcie posyła go tam samo,
   * przy wielu — onTap decyduje (np. tylko wypowiada nazwę). */
  function wireDrag({ items, zones, onDrop, onTap, onPick, isBusy }) {
    let lastPointer = 0;
    const hitZone = el => {
      const er = el.getBoundingClientRect();
      const found = zones.find(z => {
        const r = z.el().getBoundingClientRect();
        return !(er.right < r.left || er.left > r.right || er.bottom < r.top || er.top > r.bottom);
      });
      return found || null;
    };
    function flyTo(el, it, zone) {
      const er = el.getBoundingClientRect();
      const zr = zone.el().getBoundingClientRect();
      const dx = (zr.left + zr.width / 2) - (er.left + er.width / 2);
      const dy = (zr.top + zr.height / 2) - (er.top + er.height / 2);
      el.style.transition = 'transform 0.45s ease';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.35)`;
      later(() => onDrop(el, it, zone), 460);
    }
    app.querySelectorAll('[data-i]').forEach(el => {
      const it = items.find(x => x.id === +el.dataset.i);
      if (!it) return;
      let sx = 0, sy = 0, moved = 0, dragging = false;
      el.addEventListener('pointerdown', e => {
        if (isBusy()) return;
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        sx = e.clientX; sy = e.clientY; moved = 0; dragging = true;
        /* Animacja błędu (wobble) nadpisuje transform — podniesienie
         * elementu musi ją zdjąć, inaczej przeciąganie martwieje. */
        el.classList.remove('wrong');
        el.classList.add('dragging');
        el.style.transition = 'none';
        if (onPick) onPick(it);
      });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        moved = Math.max(moved, Math.hypot(dx, dy));
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      const back = () => {
        el.style.transition = 'transform 0.35s ease';
        el.style.transform = '';
      };
      const tap = () => {
        if (isBusy()) return;
        if (onTap) onTap(el, it, z => flyTo(el, it, z));
        else flyTo(el, it, zones[0]);
      };
      el.addEventListener('pointerup', () => {
        if (!dragging) return;
        dragging = false;
        lastPointer = performance.now();
        el.classList.remove('dragging');
        if (moved < 10) { el.style.transform = ''; tap(); return; }
        const zone = hitZone(el);
        if (zone) onDrop(el, it, zone);
        else back();
      });
      el.addEventListener('pointercancel', () => {
        dragging = false;
        el.classList.remove('dragging');
        back();
      });
      el.addEventListener('click', () => {
        if (performance.now() - lastPointer < 500) return;
        tap();
      });
    });
  }

  let trip = null;
  function tripRound(box, round) {
    const words = shuffle(box);
    const colorable = box.filter(w => TRIP_BASES.some(b => b.en === w.en));
    const mk = defs => shuffle(defs).map((d, i) => ({ ...d, id: i }));
    if (round < 3 || (round === 4 && !colorable.length && box.length < 4)) {
      const target = words[round % words.length];
      const rest = shuffle(box.filter(w => w.en !== target.en)).slice(0, 3);
      return {
        task: `Pack all the ${plural(target.en)}!`,
        credit: [target.en],
        items: mk([
          ...[0, 1, 2].map(() => ({ svg: target.svg, en: target.en, target: true })),
          ...rest.map(w => ({ svg: w.svg, en: w.en, target: false })),
        ]),
      };
    }
    if (colorable.length && round === 3) {
      const baseWord = shuffle(colorable)[0];
      const keys = shuffle(Object.keys(TRIP_COLORS));
      const [col, other, third] = keys;
      const rest = shuffle(box.filter(w => w.en !== baseWord.en)).slice(0, 2);
      return {
        task: `Pack all the ${col} ${plural(baseWord.en)}!`,
        credit: [baseWord.en, col],
        items: mk([
          { svg: tripItemSvg(baseWord.en, col), en: `${col} ${baseWord.en}`, target: true },
          { svg: tripItemSvg(baseWord.en, col), en: `${col} ${baseWord.en}`, target: true },
          { svg: tripItemSvg(baseWord.en, other), en: `${other} ${baseWord.en}`, target: false },
          { svg: tripItemSvg(baseWord.en, third), en: `${third} ${baseWord.en}`, target: false },
          ...rest.map(w => ({ svg: w.svg, en: w.en, target: false })),
        ]),
      };
    }
    /* rozmiar — a przy przebarwialnym przedmiocie: rozmiar + kolor */
    const size = shuffle(['big', 'small'])[0];
    const anti = size === 'big' ? 'small' : 'big';
    if (colorable.length) {
      const baseWord = shuffle(colorable)[0];
      const [col, other] = shuffle(Object.keys(TRIP_COLORS));
      const restW = shuffle(box.filter(w => w.en !== baseWord.en)).slice(0, 1);
      return {
        task: `Pack all the ${size} ${col} ${plural(baseWord.en)}!`,
        credit: [baseWord.en, col, size],
        items: mk([
          { svg: tripItemSvg(baseWord.en, col), en: `${size} ${col} ${baseWord.en}`, target: true, size },
          { svg: tripItemSvg(baseWord.en, col), en: `${size} ${col} ${baseWord.en}`, target: true, size },
          { svg: tripItemSvg(baseWord.en, col), en: `${anti} ${col} ${baseWord.en}`, target: false, size: anti },
          { svg: tripItemSvg(baseWord.en, other), en: `${size} ${other} ${baseWord.en}`, target: false, size },
          { svg: tripItemSvg(baseWord.en, other), en: `${anti} ${other} ${baseWord.en}`, target: false, size: anti },
          ...restW.map(w => ({ svg: w.svg, en: w.en, target: false })),
        ]),
      };
    }
    const target = words[0];
    const rest = shuffle(box.filter(w => w.en !== target.en)).slice(0, 2);
    return {
      task: `Pack all the ${size} ${plural(target.en)}!`,
      credit: [target.en, size],
      items: mk([
        { svg: target.svg, en: `${size} ${target.en}`, target: true, size },
        { svg: target.svg, en: `${size} ${target.en}`, target: true, size },
        { svg: target.svg, en: `${anti} ${target.en}`, target: false, size: anti },
        { svg: target.svg, en: `${anti} ${target.en}`, target: false, size: anti },
        ...rest.map(w => ({ svg: w.svg, en: w.en, target: false, size: shuffle([size, anti])[0] })),
      ]),
    };
  }

  function renderTrip(themeId, level, fresh) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
    if (fresh || !trip || trip.themeId !== theme.id || trip.level !== level) {
      trip = { themeId: theme.id, level, round: 0, total: 5, data: null, packed: new Set(), busy: false, spoken: false };
    }
    if (trip.round >= trip.total) {
      renderEnd(`trip/${theme.id}/${level}`, { themeId: theme.id, level, activity: 'trip', backTo: `lesson/${theme.id}/${level}` });
      return;
    }
    const box = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    if (!trip.data) { trip.data = tripRound(box, trip.round); trip.packed = new Set(); }
    const d = trip.data;
    const slots = [[8, 6], [39, 2], [70, 8], [10, 52], [41, 56], [70, 50]];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Wyprawa')}
        <div class="stage triplayout">
          <div class="prompt tripprompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span>${d.task}</span>
          </div>
          <div class="tripboard" id="board">
            ${d.items.map((it, i) => trip.packed.has(it.id) ? '' : `
              <button class="tripitem ${it.size || ''}" data-i="${it.id}" aria-label="${it.en}"
                style="left:${slots[i % slots.length][0] + ((trip.round * 7 + i * 37) % 11) - 5}%;top:${slots[i % slots.length][1] + ((trip.round * 5 + i * 29) % 9) - 4}%">
                ${it.svg}
              </button>`).join('')}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="packwrap" id="packwrap">
            <div class="packroo" data-roo="pack">${BACKPACK_SVG}</div>
            <div id="packZone"></div>
          </div>
        </div>
        ${trackHtml(trip.round)}
      </div>`;
    wire();
    const speakTask = () => Sound.speak(d.task);
    if (!trip.spoken) { trip.spoken = true; later(speakTask, 400); }
    document.getElementById('replay').addEventListener('click', speakTask);

    const msgEl = () => document.getElementById('quizMsg');
    const packwrap = document.getElementById('packwrap');

    function packBounce() {
      packwrap.classList.remove('bounce');
      void packwrap.offsetWidth;
      packwrap.classList.add('bounce');
    }
    function finishRound() {
      Sound.chime();
      d.credit.forEach(c => Progress.wordCorrect(c));
      trip.busy = true;
      later(() => {
        trip.round++;
        trip.data = null;
        trip.spoken = false;
        trip.busy = false;
        renderTrip(theme.id, level);
      }, 1100);
    }
    function tryPack(el, it) {
      if (it.target) {
        trip.packed.add(it.id);
        Sound.tick();
        packBounce();
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        el.style.opacity = '0';
        later(() => el.remove(), 300);
        const left = d.items.filter(x => x.target && !trip.packed.has(x.id)).length;
        if (!left) finishRound();
      } else {
        msgEl().textContent = `Let's try that again`;
        el.classList.remove('wrong');
        void el.offsetWidth;
        el.classList.add('wrong');
        el.style.transition = 'transform 0.4s ease';
        el.style.transform = '';
        later(() => { el.classList.remove('wrong'); if (msgEl()) msgEl().textContent = ''; }, 1500);
      }
    }
    wireDrag({
      items: d.items,
      zones: [{ id: 'pack', el: () => document.getElementById('packZone') }],
      isBusy: () => trip.busy,
      onDrop: (el, it) => { if (!it.target) el.style.transform = ''; tryPack(el, it); },
    });
  }

  /* ── Dotknij!: utrwalenie lekcji o ciele — pokaż część na postaci ── */
  let touch = null;
  function renderTouch(themeId, level, fresh) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
    if (fresh || !touch || touch.themeId !== theme.id || touch.level !== level) {
      const box = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
      const zoned = box.filter(w => KID_ZONES.some(z => z.parts.split(',').includes(w.en)));
      touch = { themeId: theme.id, level, round: 0, targets: shuffle(zoned).slice(0, 5), busy: false, spoken: false };
    }
    if (!touch.targets.length || touch.round >= touch.targets.length) {
      renderEnd(`touch/${theme.id}/${level}`, { themeId: theme.id, level, activity: 'trip', backTo: `lesson/${theme.id}/${level}` });
      return;
    }
    const w = touch.targets[touch.round];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Dotknij!')}
        <div class="stage triplayout">
          <div class="prompt tripprompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span>Touch the ${w.en}!</span>
          </div>
          <div class="kidwrap">
            ${KID_SVG}
            ${KID_ZONES.map((z, i) => `
              <button class="kidzone" data-z="${i}" aria-label="${z.parts}"
                style="left:${z.l}%;top:${z.t}%;width:${z.w}%;height:${z.h}%"></button>`).join('')}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
        </div>
        ${trackHtml(touch.round, touch.targets.length)}
      </div>`;
    wire();
    const ask = () => Sound.speak(`Touch the ${w.en}!`);
    if (!touch.spoken) { touch.spoken = true; later(ask, 400); }
    document.getElementById('replay').addEventListener('click', ask);
    app.querySelectorAll('[data-z]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (touch.busy) return;
        const z = KID_ZONES[+btn.dataset.z];
        if (z.parts.split(',').includes(w.en)) {
          touch.busy = true;
          btn.classList.add('hit');
          Sound.chime();
          Sound.speak(w.en);
          Progress.wordCorrect(w.en);
          later(() => {
            touch.round++; touch.spoken = false; touch.busy = false;
            renderTouch(theme.id, level);
          }, 1300);
        } else {
          btn.classList.remove('miss');
          void btn.offsetWidth;
          btn.classList.add('miss');
          const msg = document.getElementById('quizMsg');
          msg.textContent = `Let's try that again`;
          later(() => { btn.classList.remove('miss'); if (msg.textContent) msg.textContent = ''; }, 1500);
        }
      });
    });
  }

  /* ── Koszyki: sortowanie do dwóch koszyków ──
   * Przeciwieństwa: duże/małe. Kolory: dwa kolory z lekcji (a gdy lekcja
   * nie ma kolorów przebarwialnych — dwa podstawowe). Tylko przeciąganie;
   * stuknięcie wypowiada nazwę, bo cel nie jest jednoznaczny. */
  let sortg = null;
  function sortRound(themeId, box) {
    if (themeId === 'colors') {
      let cols = shuffle(box.filter(w => TRIP_COLORS[w.en]).map(w => w.en)).slice(0, 2);
      if (cols.length < 2) cols = shuffle(Object.keys(TRIP_COLORS)).slice(0, 2);
      const base = shuffle(TRIP_BASES)[0];
      const items = shuffle([0, 1, 2, 3, 4, 5].map(i => {
        const col = cols[i % 2];
        return { svg: tripItemSvg(base.en, col), en: `${col} ${base.en}`, side: col };
      })).map((d, i) => ({ ...d, id: i }));
      return {
        task: `Sort the ${plural(base.en)}! ${cols[0][0].toUpperCase() + cols[0].slice(1)} on the left, ${cols[1]} on the right!`,
        credit: [cols[0], cols[1], base.en],
        zones: cols.map(c => ({ id: c, head: colorTabletSvg(TRIP_COLORS[c].c[0]) })),
        items,
      };
    }
    const picks = shuffle(SORT_SIZE_POOL).slice(0, 3);
    const items = shuffle(picks.flatMap(p => [
      { svg: p.svg, en: `big ${p.en}`, side: 'big', size: 'big' },
      { svg: p.svg, en: `small ${p.en}`, side: 'small', size: 'small' },
    ])).map((d, i) => ({ ...d, id: i }));
    return {
      task: 'Sort! Big things on the left, small things on the right!',
      credit: ['big', 'small', ...picks.map(p => p.en)],
      zones: [{ id: 'big', head: SVG_BIG }, { id: 'small', head: SVG_SMALL }],
      items,
    };
  }
  function renderSort(themeId, level, fresh) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
    if (fresh || !sortg || sortg.themeId !== theme.id || sortg.level !== level) {
      sortg = { themeId: theme.id, level, round: 0, total: 3, data: null, done: new Set(), busy: false, spoken: false };
    }
    if (sortg.round >= sortg.total) {
      renderEnd(`sort/${theme.id}/${level}`, { themeId: theme.id, level, activity: 'trip', backTo: `lesson/${theme.id}/${level}` });
      return;
    }
    const box = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    if (!sortg.data) { sortg.data = sortRound(theme.id, box); sortg.done = new Set(); }
    const d = sortg.data;
    const slots = [[6, 8], [38, 2], [70, 8], [8, 52], [40, 56], [70, 50]];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Koszyki')}
        <div class="stage triplayout">
          <div class="prompt tripprompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span>${d.task}</span>
          </div>
          <div class="tripboard" id="board">
            ${d.items.map((it, i) => sortg.done.has(it.id) ? '' : `
              <button class="tripitem ${it.size || ''}" data-i="${it.id}" aria-label="${it.en}"
                style="left:${slots[i % slots.length][0] + ((sortg.round * 7 + i * 37) % 11) - 5}%;top:${slots[i % slots.length][1] + ((sortg.round * 5 + i * 29) % 9) - 4}%">
                ${it.svg}
              </button>`).join('')}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="sortrow">
            ${d.zones.map(z => `
              <div class="sortzone" data-zone="${z.id}">
                <div class="zhead">${z.head}</div>
                <div class="zbasket">${SVG_BASKET}</div>
              </div>`).join('')}
          </div>
        </div>
        ${trackHtml(sortg.round, sortg.total)}
      </div>`;
    wire();
    const speakTask = () => Sound.speak(d.task);
    if (!sortg.spoken) { sortg.spoken = true; later(speakTask, 400); }
    document.getElementById('replay').addEventListener('click', speakTask);
    const msgEl = () => document.getElementById('quizMsg');
    wireDrag({
      items: d.items,
      zones: d.zones.map(z => ({ id: z.id, el: () => app.querySelector(`[data-zone="${z.id}"]`) })),
      isBusy: () => sortg.busy,
      /* Chwycenie rzeczy wypowiada jej nazwę („yellow car") — stuknięcie
       * to też chwycenie, więc nie robi nic ponad to. */
      onPick: it => Sound.speak(it.en),
      onTap: () => {},
      onDrop: (el, it, zone) => {
        if (zone.id === it.side) {
          sortg.done.add(it.id);
          Sound.tick();
          const zel = app.querySelector(`[data-zone="${zone.id}"]`);
          zel.classList.remove('bounce');
          void zel.offsetWidth;
          zel.classList.add('bounce');
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          el.style.opacity = '0';
          later(() => el.remove(), 300);
          if (sortg.done.size === d.items.length) {
            Sound.chime();
            d.credit.forEach(c => Progress.wordCorrect(c));
            sortg.busy = true;
            later(() => {
              sortg.round++; sortg.data = null; sortg.spoken = false; sortg.busy = false;
              renderSort(theme.id, level);
            }, 1100);
          }
        } else {
          msgEl().textContent = `Let's try that again`;
          el.classList.remove('wrong');
          void el.offsetWidth;
          el.classList.add('wrong');
          el.style.transition = 'transform 0.4s ease';
          el.style.transform = '';
          later(() => { el.classList.remove('wrong'); if (msgEl()) msgEl().textContent = ''; }, 1500);
        }
      },
    });
  }

  /* ── Ubierz LingaRoo: pogoda/ubrania — podaj mu to, czego potrzebuje ── */
  let dress = null;
  function dressRound(sceneIdx) {
    const scene = DRESS_SCENES[sceneIdx];
    const distract = shuffle(Object.keys(DRESS_ITEMS).filter(k => !scene.need.includes(k))).slice(0, 4);
    const items = shuffle([
      ...scene.need.map(k => ({ svg: DRESS_ITEMS[k], en: k, target: true })),
      ...distract.map(k => ({ svg: DRESS_ITEMS[k], en: k, target: false })),
    ]).map((d, i) => ({ ...d, id: i }));
    return { scene, task: scene.task, credit: [...scene.need, scene.w], items };
  }
  function renderDress(themeId, level, fresh) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
    if (fresh || !dress || dress.themeId !== theme.id || dress.level !== level) {
      dress = { themeId: theme.id, level, round: 0, order: shuffle(DRESS_SCENES.map((_, i) => i)), data: null, given: new Set(), busy: false, spoken: false };
    }
    if (dress.round >= dress.order.length) {
      renderEnd(`dress/${theme.id}/${level}`, { themeId: theme.id, level, activity: 'trip', backTo: `lesson/${theme.id}/${level}` });
      return;
    }
    if (!dress.data) { dress.data = dressRound(dress.order[dress.round]); dress.given = new Set(); }
    const d = dress.data;
    const slots = [[8, 6], [39, 2], [70, 8], [10, 52], [41, 56], [70, 50]];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Ubierz LingaRoo')}
        <div class="stage triplayout">
          <div class="prompt tripprompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span class="wchip">${d.scene.svg}</span>
            <span>${d.task}</span>
          </div>
          <div class="tripboard" id="board">
            ${d.items.map((it, i) => dress.given.has(it.id) ? '' : `
              <button class="tripitem" data-i="${it.id}" aria-label="${it.en}"
                style="left:${slots[i % slots.length][0] + ((dress.round * 7 + i * 37) % 11) - 5}%;top:${slots[i % slots.length][1] + ((dress.round * 5 + i * 29) % 9) - 4}%">
                ${it.svg}
              </button>`).join('')}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="packwrap" id="packwrap">
            <div class="packroo dressroo" data-roo="hero">${TEACHER_SVG}</div>
            <div id="packZone"></div>
          </div>
        </div>
        ${trackHtml(dress.round, dress.order.length)}
      </div>`;
    wire();
    const speakTask = () => Sound.speak(d.task);
    if (!dress.spoken) { dress.spoken = true; later(speakTask, 400); }
    document.getElementById('replay').addEventListener('click', speakTask);
    const msgEl = () => document.getElementById('quizMsg');
    const packwrap = document.getElementById('packwrap');
    wireDrag({
      items: d.items,
      zones: [{ id: 'roo', el: () => document.getElementById('packZone') }],
      isBusy: () => dress.busy,
      onDrop: (el, it) => {
        if (it.target) {
          dress.given.add(it.id);
          Sound.tick();
          Sound.speak(it.en);
          Progress.wordCorrect(it.en);
          packwrap.classList.remove('bounce');
          void packwrap.offsetWidth;
          packwrap.classList.add('bounce');
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          el.style.opacity = '0';
          later(() => el.remove(), 300);
          const left = d.items.filter(x => x.target && !dress.given.has(x.id)).length;
          if (!left) {
            Sound.chime();
            Progress.wordCorrect(d.scene.w);
            dress.busy = true;
            later(() => {
              dress.round++; dress.data = null; dress.spoken = false; dress.busy = false;
              renderDress(theme.id, level);
            }, 1100);
          }
        } else {
          el.style.transform = '';
          msgEl().textContent = `Let's try that again`;
          el.classList.remove('wrong');
          void el.offsetWidth;
          el.classList.add('wrong');
          el.style.transition = 'transform 0.4s ease';
          later(() => { el.classList.remove('wrong'); if (msgEl()) msgEl().textContent = ''; }, 1500);
        }
      },
    });
  }

  /* ── Sprzątanie: dom — odłóż każdą rzecz na swoje miejsce ── */
  let clean = null;
  function cleanRound(idx) {
    const r = CLEAN_ROUNDS[idx];
    const distract = shuffle(CLEAN_ROUNDS.filter((_, i) => i !== idx)
      .flatMap(x => x.items)
      .filter((k, i, a) => a.indexOf(k) === i && !r.items.includes(k))).slice(0, 3);
    const items = shuffle([
      ...r.items.map(k => ({ svg: CLEAN_ITEMS[k], en: k, target: true })),
      ...distract.map(k => ({ svg: CLEAN_ITEMS[k], en: k, target: false })),
    ]).map((d, i) => ({ ...d, id: i }));
    return { task: r.task, spot: r.spot, spotSvg: r.spotSvg, credit: [...r.items, r.spot], items };
  }
  function renderClean(themeId, level, fresh) {
    const theme = themeById(themeId);
    if (!guardLevel(theme.id, level)) return;
    rememberLesson(theme.id, level);
    if (fresh || !clean || clean.themeId !== theme.id || clean.level !== level) {
      clean = { themeId: theme.id, level, round: 0, total: CLEAN_ROUNDS.length, data: null, put: new Set(), busy: false, spoken: false };
    }
    if (clean.round >= clean.total) {
      renderEnd(`clean/${theme.id}/${level}`, { themeId: theme.id, level, activity: 'trip', backTo: `lesson/${theme.id}/${level}` });
      return;
    }
    if (!clean.data) { clean.data = cleanRound(clean.round); clean.put = new Set(); }
    const d = clean.data;
    const slots = [[8, 6], [39, 2], [70, 8], [10, 52], [41, 56], [70, 50]];
    app.innerHTML = `
      <div class="screen">
        ${topbar('Sprzątanie')}
        <div class="stage triplayout">
          <div class="prompt tripprompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span>${d.task}</span>
          </div>
          <div class="tripboard" id="board">
            ${d.items.map((it, i) => clean.put.has(it.id) ? '' : `
              <button class="tripitem" data-i="${it.id}" aria-label="${it.en}"
                style="left:${slots[i % slots.length][0] + ((clean.round * 7 + i * 37) % 11) - 5}%;top:${slots[i % slots.length][1] + ((clean.round * 5 + i * 29) % 9) - 4}%">
                ${it.svg}
              </button>`).join('')}
          </div>
          <div class="quizmsg" id="quizMsg"></div>
          <div class="packwrap" id="packwrap">
            <div class="spotart">${d.spotSvg}</div>
            <div id="packZone"></div>
          </div>
        </div>
        ${trackHtml(clean.round, clean.total)}
      </div>`;
    wire();
    const speakTask = () => Sound.speak(d.task);
    if (!clean.spoken) { clean.spoken = true; later(speakTask, 400); }
    document.getElementById('replay').addEventListener('click', speakTask);
    const msgEl = () => document.getElementById('quizMsg');
    const packwrap = document.getElementById('packwrap');
    wireDrag({
      items: d.items,
      zones: [{ id: 'spot', el: () => document.getElementById('packZone') }],
      isBusy: () => clean.busy,
      onDrop: (el, it) => {
        if (it.target) {
          clean.put.add(it.id);
          Sound.tick();
          Sound.speak(it.en);
          Progress.wordCorrect(it.en);
          packwrap.classList.remove('bounce');
          void packwrap.offsetWidth;
          packwrap.classList.add('bounce');
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          el.style.opacity = '0';
          later(() => el.remove(), 300);
          const left = d.items.filter(x => x.target && !clean.put.has(x.id)).length;
          if (!left) {
            Sound.chime();
            Progress.wordCorrect(d.spot);
            clean.busy = true;
            later(() => {
              clean.round++; clean.data = null; clean.spoken = false; clean.busy = false;
              renderClean(theme.id, level);
            }, 1100);
          }
        } else {
          el.style.transform = '';
          msgEl().textContent = `Let's try that again`;
          el.classList.remove('wrong');
          void el.offsetWidth;
          el.classList.add('wrong');
          el.style.transition = 'transform 0.4s ease';
          later(() => { el.classList.remove('wrong'); if (msgEl()) msgEl().textContent = ''; }, 1500);
        }
      },
    });
  }

  /* ── Pary ── */
  let pairs = null;
  /* Pary z dwóch ostatnich rozgrywek nie wracają — przy 30+ parach
   * losowanie bez tej pamięci nagminnie powtarzało te same. */
  let recentPairs = [];
  function newPairs() {
    let pool = PAIRS.filter(p => !recentPairs.includes(p.id));
    if (pool.length < 4) pool = PAIRS;
    const chosen = shuffle(pool).slice(0, 4);
    recentPairs = [...chosen.map(p => p.id), ...recentPairs].slice(0, 8);
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
    if (!guardLevel(themeId, level)) return;
    rememberLesson(themeId, level);
    if (fresh || !say || say.theme.id !== themeId || say.level !== level) say = newSay(themeId, level);
    if (say.round >= say.words.length) {
      renderEnd(`say/${themeId}/${level}`, { themeId, level, activity: 'say', backTo: `lesson/${themeId}/${level}` });
      return;
    }
    const w = say.words[say.round];
    const ph = say.phase;
    const statusTxt =
      ph === 'listening' ? 'Listening…' :
      ph === 'retry' ? `Let's try that again` :
      ph === 'success' ? '' : 'Say the word out loud';
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
          ${ph === 'success' ? `<div class="teacher"><div class="badge">${UI.check}</div></div>` : ''}
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
              <button class="softbtn wood" data-go="${completion ? completion.backTo : 'home'}">${completion ? 'Lekcja' : 'Menu'}</button>
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
      const lvl = parseInt(p[2] || '0', 10) || 0;
      const rr = { quiz: renderQuiz, say: renderSay, trip: renderTrip, touch: renderTouch, sort: renderSort, dress: renderDress, clean: renderClean };
      if (rr[p[0]]) { rr[p[0]](p[1], lvl, true); }
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
            <div class="txt">Ćwiczenie czytania<small>Powtórki pytają też napisami (napis→obrazek i obrazek→napis). Włącz, gdy dziecko zaczyna czytać — wyłączone: wszystkie rundy głosem i obrazkami.</small></div>
            <button class="toggle ${Settings.get('reading') ? 'on' : ''}" data-set="reading" role="switch" aria-checked="${Settings.get('reading')}" aria-label="Ćwiczenie czytania"></button>
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
        <p class="about">LingaRoo — angielski dla dzieci, spokojnie.<br>
        Bez reklam, bez punktów, bez presji czasu. Gra działa bez internetu,
        a dane dziecka nie opuszczają urządzenia. Jedyny wyjątek: dobrowolna
        ankieta dla rodzica — wysyła wyłącznie zaznaczone w niej odpowiedzi.</p>
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
    if (!Profiles.active() && !['who', 'gate', 'parent', 'survey'].includes(r.name)) {
      renderWho();
      window.scrollTo(0, 0);
      return;
    }
    const lvl = parseInt(r.arg2 || '0', 10) || 0;
    switch (r.name) {
      case 'who':    renderWho(); break;
      case 'themes': renderThemes(); break;
      case 'boxes':  renderBoxes(r.arg === 'cards' || r.arg === 'say' ? r.arg2 : r.arg); break;
      case 'lesson': renderLesson(r.arg, lvl); break;
      case 'cards':  renderCards(r.arg, lvl); break;
      case 'quiz':   renderQuiz(r.arg, lvl, true); break;
      case 'pairs':  renderPairs(true); break;
      case 'review': renderReview(true); break;
      case 'trip':   renderTrip(r.arg, lvl, true); break;
      case 'touch':  renderTouch(r.arg, lvl, true); break;
      case 'sort':   renderSort(r.arg, lvl, true); break;
      case 'dress':  renderDress(r.arg, lvl, true); break;
      case 'clean':  renderClean(r.arg, lvl, true); break;
      case 'survey': renderSurvey(); break;
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
      trip: trip && trip.data && { round: trip.round, task: trip.data.task, left: trip.data.items.filter(x => x.target && !trip.packed.has(x.id)).length, items: trip.data.items.map(x => ({ i: x.id, en: x.en, target: x.target, packed: trip.packed.has(x.id) })) },
      touch: touch && { round: touch.round, total: touch.targets.length, word: touch.targets[touch.round] && touch.targets[touch.round].en },
      sort: sortg && sortg.data && { round: sortg.round, task: sortg.data.task, zones: sortg.data.zones.map(z => z.id), items: sortg.data.items.map(x => ({ i: x.id, en: x.en, side: x.side, done: sortg.done.has(x.id) })) },
      dress: dress && dress.data && { round: dress.round, task: dress.data.task, weather: dress.data.scene.w, items: dress.data.items.map(x => ({ i: x.id, en: x.en, target: x.target, given: dress.given.has(x.id) })) },
      clean: clean && clean.data && { round: clean.round, task: clean.data.task, spot: clean.data.spot, items: clean.data.items.map(x => ({ i: x.id, en: x.en, target: x.target, put: clean.put.has(x.id) })) },
      progress: THEMES.reduce((o, t) => (o[t.id] = Progress.done(t.id), o), {}),
      profiles: { active: (Profiles.active() || {}).name || null, count: Profiles.list().length },
      settings: ['sound', 'rate', 'plHints', 'checkSpeech'].reduce((o, k) => (o[k] = Settings.get(k), o), {}),
    });
  }

  render();
})();
