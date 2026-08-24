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
    return { name: parts[0] || 'home', arg: parts[1] || '' };
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
  function renderThemes(mode) {
    const target = mode === 'say' ? 'say' : 'cards';
    app.innerHTML = `
      <div class="screen">
        ${topbar(target === 'say' ? 'Tablica' : 'Słówka')}
        <p class="hint">Wybierz pudełko</p>
        <div class="themes">
          ${THEMES.map(t => `
            <button class="modetile" data-go="${target}/${t.id}">
              <div class="icon">${t.coverSvg}</div>
              <div class="label">${t.pl}<small>${t.en}</small></div>
            </button>`).join('')}
        </div>
      </div>`;
    wire();
  }

  /* ── Słówka: karty do oglądania ── */
  let cardIdx = 0;
  let cardTheme = '';
  function renderCards(themeId) {
    const theme = themeById(themeId);
    if (cardTheme !== theme.id) { cardTheme = theme.id; cardIdx = 0; }
    const w = theme.words[cardIdx];
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
            <div class="dots">${theme.words.map((_, i) => `<div class="dot ${i === cardIdx ? 'on' : ''}"></div>`).join('')}</div>
            <button class="woodbtn" id="next" ${cardIdx === theme.words.length - 1 ? 'disabled' : ''} aria-label="Następne"><div>${UI.arrowRight}</div></button>
          </div>
          <button class="softbtn" data-go="quiz/${theme.id}">Znajdź słowo</button>
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
      if (cardIdx > 0) { cardIdx--; renderCards(theme.id); Sound.speak(theme.words[cardIdx].en); }
    });
    document.getElementById('next').addEventListener('click', () => {
      if (cardIdx < theme.words.length - 1) { cardIdx++; renderCards(theme.id); Sound.speak(theme.words[cardIdx].en); }
    });
  }

  /* ── Znajdź słowo: pokaż trzy karty, poproś o jedną ──
   * Błędny wybór tylko lekko kołysze kartą — dziecko poprawia się samo. */
  let quiz = null;
  function newQuiz(themeId) {
    const theme = themeById(themeId);
    return { theme, round: 0, total: 5, order: shuffle(theme.words), locked: false };
  }
  function quizRoundData() {
    const target = quiz.order[quiz.round % quiz.order.length];
    const others = shuffle(quiz.theme.words.filter(w => w.en !== target.en)).slice(0, 2);
    return { target, options: shuffle([target, ...others]) };
  }
  function renderQuiz(themeId, fresh) {
    if (fresh || !quiz || quiz.theme.id !== themeId) quiz = newQuiz(themeId);
    if (quiz.round >= quiz.total) { renderEnd(`quiz/${themeId}`); return; }
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
          later(() => { quiz.round++; renderQuiz(themeId); }, 1400);
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
              <button class="wordcard ${pairs.matched.has(t.pair) ? 'matched' : ''}" data-i="${i}" aria-label="${t.en}">
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
          firstBtn.classList.add('matched');
          btn.classList.add('matched');
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
  function newSay(themeId) {
    const theme = themeById(themeId);
    return { theme, words: shuffle(theme.words).slice(0, 5), round: 0, phase: 'prompt', revealed: 0 };
  }
  function renderSay(themeId, fresh) {
    if (fresh || !say || say.theme.id !== themeId) say = newSay(themeId);
    if (say.round >= say.words.length) { renderEnd(`say/${themeId}`); return; }
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
      renderSay(themeId);
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
      renderSay(themeId);
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
            renderSay(themeId);
          }, 2200);
        }
      }, 260);
    }
    function retry() {
      say.phase = 'retry';
      renderSay(themeId);
      later(sayWord, 500);
      later(() => {
        if (say && say.phase === 'retry') { say.phase = 'prompt'; renderSay(themeId); }
      }, 1900);
    }
  }

  /* ── Koniec sesji — spokojna pochwała, bez punktów ── */
  function renderEnd(againRoute) {
    Sound.speak('Well done!');
    const home = `<button class="softbtn wood" data-go="home">Menu</button>`;
    app.innerHTML = `
      <div class="screen">
        ${topbar('')}
        <div class="stage">
          <div class="endpanel">
            <div class="fig">${TEACHER_SVG}</div>
            <h2>Well done!</h2>
            <p>Brawo, to była dobra zabawa.</p>
            <div class="endrow">
              ${home}
              <button class="softbtn" id="again">Jeszcze raz</button>
            </div>
          </div>
        </div>
        ${trackHtml(5)}
      </div>`;
    wire();
    document.getElementById('again').addEventListener('click', () => {
      if (againRoute.startsWith('quiz/')) { renderQuiz(againRoute.split('/')[1], true); }
      else if (againRoute.startsWith('say/')) { renderSay(againRoute.split('/')[1], true); }
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
  }

  /* ── Render główny ── */
  function render() {
    clearTimers();
    if (activeRecognition) { try { activeRecognition.abort(); } catch (e) {} activeRecognition = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const r = route();
    switch (r.name) {
      case 'themes': renderThemes(r.arg); break;
      case 'cards':  renderCards(r.arg); break;
      case 'quiz':   renderQuiz(r.arg, true); break;
      case 'pairs':  renderPairs(true); break;
      case 'say':    renderSay(r.arg, true); break;
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
      quiz: quiz && { round: quiz.round, current: quiz.current && quiz.current.en },
      say: say && { round: say.round, phase: say.phase, word: say.words[say.round] && say.words[say.round].en },
      pairs: pairs && { matched: [...pairs.matched], picked: pairs.picked },
      settings: ['sound', 'rate', 'plHints', 'checkSpeech'].reduce((o, k) => (o[k] = Settings.get(k), o), {}),
    });
  }

  render();
})();
