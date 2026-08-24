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

  /* ── Postępy: ile pudełek tematu jest ukończonych ──
   * Ukończenie sesji Znajdź słowo albo Tablicy na bieżącym pudełku
   * otwiera następne. Powtarzanie ukończonych pudełek niczego nie psuje —
   * powtórka to w Montessori cel, nie strata czasu. */
  const Progress = (() => {
    const KEY = 'lingaroo.progress';
    let cur = {};
    try { cur = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {} };
    return {
      done: id => cur[id] | 0,
      /* Zalicza pudełko `level`; zwraca true, gdy właśnie otworzyło kolejne. */
      complete(id, level) {
        if (level === (cur[id] | 0)) { cur[id] = level + 1; save(); return true; }
        return false;
      },
      reset() { cur = {}; save(); },
    };
  })();
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

  function topbar(title, { parentBtn = false } = {}) {
    return `
      <header class="topbar">
        <button class="woodbtn" data-go="home" aria-label="Powrót do menu"><div>${ROO_HEAD_SVG}</div></button>
        <div class="title">${title}</div>
        ${parentBtn
          ? `<button class="woodbtn subtle" data-go="gate" aria-label="Strefa Rodzica"><div>${UI.gear}</div></button>`
          : `<div style="width:56px"></div>`}
      </header>`;
  }

  function trackHtml(activeIdx, total = 5) {
    let html = '<div class="track">';
    for (let i = 0; i < total; i++) {
      const state = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'upcoming';
      const color = state === 'upcoming' ? 'var(--dim-txt)' : '#FDFBF7';
      html += `<div class="step">
        <div class="peg ${state}">
          ${state === 'active' ? `<div class="roo">${ROO_SVG}</div>` : ''}
          <div class="ico">${TRACK_ICONS[i % TRACK_ICONS.length](color)}</div>
        </div>
        ${i < total - 1 ? `<div class="link ${i < activeIdx ? 'done' : ''}"></div>` : ''}
      </div>`;
    }
    return html + '</div>';
  }

  function wire() {
    app.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => goto(b.dataset.go));
    });
  }

  /* ── Ekran główny ── */
  function renderHome() {
    app.innerHTML = `
      <div class="screen">
        ${topbar('LingaRoo', { parentBtn: true })}
        <div class="hero">
          <div class="roo">${TEACHER_SVG}</div>
          <div class="bubble">Hello!<small>Pobawimy się razem?</small></div>
        </div>
        <div class="modes">
          <button class="modetile" data-go="themes/cards">
            <div class="icon">${UI.cards}</div>
            <div class="label">Słówka<small>oglądam i słucham</small></div>
          </button>
          <button class="modetile" data-go="pairs">
            <div class="icon">${UI.pairs}</div>
            <div class="label">Pary<small>co do czego pasuje?</small></div>
          </button>
          <button class="modetile" data-go="themes/say">
            <div class="icon">${UI.board}</div>
            <div class="label">Tablica<small>mówię z LingaRoo</small></div>
          </button>
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
  const leafSvg = c => `<svg viewBox="0 0 24 24"><path d="M12 3c5 3 7 7 7 11a7 7 0 1 1-14 0c0-4 2-8 7-11Z" fill="${c}"/></svg>`;
  function themeLeaves(t) {
    const done = Progress.done(t.id);
    return `<div class="boxleaves">${themeBoxes(t).map((_, i) =>
      `<div class="leaf">${leafSvg(i < done ? 'var(--sage)' : 'var(--line)')}</div>`).join('')}</div>`;
  }
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
        <p class="hint">Wybierz pudełko</p>
        <div class="themes list">
          ${boxes.map((box, i) => {
            const state = i < done ? 'done' : i === done ? 'open' : 'locked';
            return `
            <button class="modetile ${state === 'locked' ? 'locked' : ''}" ${state === 'locked' ? '' : `data-go="${mode}/${theme.id}/${i}"`}>
              <div class="icon">${box[0].svg}</div>
              <div class="label">Pudełko ${i + 1}
                <small>${state === 'done' ? 'ukończone — możesz powtarzać' : state === 'open' ? box.length + ' słów' : 'najpierw poprzednie pudełko'}</small>
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
          <button class="softbtn" data-go="quiz/${theme.id}/${level}">Znajdź słowo</button>
        </div>
      </div>`;
    wire();
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
   * Błędny wybór tylko lekko kołysze kartą — dziecko poprawia się samo. */
  let quiz = null;
  function newQuiz(themeId, level) {
    const theme = themeById(themeId);
    const words = themeBoxes(theme)[level] || theme.words.slice(0, BOX_SIZE);
    return { theme, level, words, round: 0, total: 5, order: shuffle(words), locked: false };
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
      renderEnd(`quiz/${themeId}/${level}`, { themeId, level, backTo: `boxes/cards/${themeId}` });
      return;
    }
    const { target, options } = quizRoundData();
    quiz.current = target;
    quiz.locked = false;
    app.innerHTML = `
      <div class="screen">
        ${topbar(quiz.theme.pl)}
        <div class="stage">
          <div class="prompt">
            <button class="speaker" id="replay" aria-label="Posłuchaj jeszcze raz">${UI.speaker}</button>
            <span>${target.en}</span>
          </div>
          <div class="choices">
            ${options.map(o => `
              <button class="wordcard" data-word="${o.en}" aria-label="${o.en}">
                <div class="art">${o.svg}</div>
              </button>`).join('')}
          </div>
          <div class="teacher"><div class="fig" id="fig">${TEACHER_SVG}</div></div>
        </div>
        ${trackHtml(quiz.round)}
      </div>`;
    wire();
    const ask = () => Sound.speak(`Where is the ${target.en}?`);
    later(ask, 350);
    document.getElementById('replay').addEventListener('click', ask);
    app.querySelectorAll('[data-word]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (quiz.locked) return;
        if (btn.dataset.word === target.en) {
          quiz.locked = true;
          Sound.chime();
          Sound.speak(target.en);
          btn.classList.add('matched');
          document.getElementById('fig').classList.add('hop');
          later(() => { quiz.round++; renderQuiz(themeId, level); }, 1400);
        } else {
          btn.classList.remove('wrong');
          void btn.offsetWidth; /* restart animacji */
          btn.classList.add('wrong');
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
            ${pairs.tiles.map((t, i) => `
              <button class="wordcard ${pairs.matched.has(t.pair) ? 'gone' : ''}" data-i="${i}" aria-label="${t.en}">
                <div class="art">${t.svg}</div>
                <div class="cap">${t.en}</div>
              </button>`).join('')}
          </div>
          <div class="teacher"><div class="fig" id="fig">${TEACHER_SVG}</div></div>
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
          /* Trafiona para znika z ekranu; puste miejsca zostają,
           * żeby reszta kart nie skakała. */
          firstBtn.classList.add('gone');
          btn.classList.add('gone');
          Sound.chime();
          document.getElementById('fig').classList.add('hop');
          later(() => document.getElementById('fig') && document.getElementById('fig').classList.remove('hop'), 700);
          if (pairs.matched.size === 4) later(() => renderEnd('pairs'), 900);
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
      renderEnd(`say/${themeId}/${level}`, { themeId, level, backTo: `boxes/say/${themeId}` });
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
            <div class="fig ${figAnim}" id="fig">${TEACHER_SVG}</div>
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

  /* ── Koniec sesji — spokojna pochwała, bez punktów ──
   * Jedyny punkt zaliczania pudełek: każda ukończona sesja przechodzi
   * tędy, więc postęp nie ma bocznych ścieżek. */
  function renderEnd(againRoute, completion) {
    Sound.speak('Well done!');
    let unlockedMsg = '';
    let nextBtn = '';
    if (completion) {
      const theme = themeById(completion.themeId);
      const total = themeBoxes(theme).length;
      const opened = Progress.complete(theme.id, completion.level);
      if (opened) {
        if (completion.level + 1 < total) {
          unlockedMsg = 'Otworzyło się nowe pudełko!';
          const act = againRoute.split('/')[0];
          nextBtn = `<button class="softbtn" data-go="${act}/${completion.themeId}/${completion.level + 1}">Następne pudełko</button>`;
        } else {
          unlockedMsg = `Wszystkie pudełka z tematu „${theme.pl}" ukończone!`;
        }
      }
    }
    app.innerHTML = `
      <div class="screen">
        ${topbar('')}
        <div class="stage">
          <div class="endpanel">
            <div class="fig">${TEACHER_SVG}</div>
            <h2>Well done!</h2>
            <p>${unlockedMsg || 'Brawo, to była dobra zabawa.'}</p>
            <div class="endrow">
              <button class="softbtn wood" data-go="${completion ? completion.backTo : 'home'}">${completion ? 'Półka' : 'Menu'}</button>
              ${nextBtn || '<button class="softbtn" id="again">Jeszcze raz</button>'}
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
          <div class="setrow">
            <div class="txt">Postępy<small>Ukończone pudełka: ${THEMES.reduce((n, t) => n + Math.min(Progress.done(t.id), themeBoxes(t).length), 0)} z ${THEMES.reduce((n, t) => n + themeBoxes(t).length, 0)}. Wyzerowanie zamyka wszystkie pudełka poza pierwszymi.</small></div>
            <button class="softbtn mini wood" id="resetProg">Wyzeruj</button>
          </div>
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
    /* Wyzerowanie postępów wymaga drugiego dotknięcia — bez okien dialogowych. */
    const resetBtn = document.getElementById('resetProg');
    resetBtn.addEventListener('click', () => {
      if (resetBtn.dataset.armed) { Progress.reset(); renderParent(); return; }
      resetBtn.dataset.armed = '1';
      resetBtn.textContent = 'Na pewno?';
      later(() => { if (document.body.contains(resetBtn)) { delete resetBtn.dataset.armed; resetBtn.textContent = 'Wyzeruj'; } }, 3500);
    });
  }

  /* ── Render główny ── */
  function render() {
    clearTimers();
    if (activeRecognition) { try { activeRecognition.abort(); } catch (e) {} activeRecognition = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const r = route();
    const lvl = parseInt(r.arg2 || '0', 10) || 0;
    switch (r.name) {
      case 'themes': renderThemes(r.arg); break;
      case 'boxes':  renderBoxes(r.arg === 'say' ? 'say' : 'cards', r.arg2); break;
      case 'cards':  renderCards(r.arg, lvl); break;
      case 'quiz':   renderQuiz(r.arg, lvl, true); break;
      case 'pairs':  renderPairs(true); break;
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
      quiz: quiz && { round: quiz.round, level: quiz.level, current: quiz.current && quiz.current.en },
      say: say && { round: say.round, level: say.level, phase: say.phase, word: say.words[say.round] && say.words[say.round].en },
      pairs: pairs && { matched: [...pairs.matched], picked: pairs.picked, tiles: pairs.tiles.map(t => t.pair) },
      progress: THEMES.reduce((o, t) => (o[t.id] = Progress.done(t.id), o), {}),
      settings: ['sound', 'rate', 'plHints', 'checkSpeech'].reduce((o, k) => (o[k] = Settings.get(k), o), {}),
    });
  }

  render();
})();
