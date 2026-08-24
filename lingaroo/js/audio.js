/* LingaRoo — dźwięk i ustawienia.
 * Lektor: speechSynthesis (bez plików audio). Sygnały: Web Audio (synteza).
 * Kontekst audio i syntezator odblokowują się przy pierwszym geście —
 * wcześniejsza próba kończy się ciszą bez błędu w konsoli. */

const Settings = (() => {
  const KEY = 'lingaroo.settings';
  const defaults = {
    sound: true,        // lektor + sygnały
    rate: 0.85,         // tempo lektora (spokojniejsze niż 1.0)
    plHints: true,      // polskie podpisy pod słowami
    checkSpeech: false, // sprawdzanie wymowy mikrofonem (tylko gdy wspierane)
  };
  let cur = { ...defaults };
  try { cur = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) {}
  return {
    get: k => cur[k],
    set(k, v) {
      cur[k] = v;
      try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {}
    },
  };
})();

const Sound = (() => {
  let ctx = null;
  let unlocked = false;
  let voice = null;
  let voicesReady = false;

  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    voicesReady = true;
    // Preferencja: naturalne głosy en-GB/en-US; unikamy głosów "compact".
    const score = v => {
      let s = 0;
      if (/^en(-|_)?(GB|US)/i.test(v.lang)) s += 4;
      else if (/^en/i.test(v.lang)) s += 2;
      if (/google|natural|neural|samantha|daniel|serena/i.test(v.name)) s += 2;
      if (/compact/i.test(v.name)) s -= 3;
      if (v.localService) s += 1;
      return s;
    };
    voice = voices.slice().sort((a, b) => score(b) - score(a))[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  /* Pierwszy gest użytkownika: tworzymy AudioContext i odblokowujemy TTS. */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC && !ctx) ctx = new AC();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if ('speechSynthesis' in window) {
      try {
        // iOS potrafi trzymać syntezator w stanie "paused" — bez resume()
        // speak() milczy bez żadnego błędu.
        speechSynthesis.resume();
        // Pusta wypowiedź w ramach gestu odblokowuje TTS na iOS.
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
  }
  window.addEventListener('pointerdown', unlock, { capture: true });

  function speak(text, opts = {}) {
    if (!Settings.get('sound')) return Promise.resolve();
    if (!('speechSynthesis' in window)) return Promise.resolve();
    return new Promise(resolve => {
      try { speechSynthesis.cancel(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(text);
      if (!voicesReady) pickVoice();
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-GB';
      u.rate = opts.rate || Settings.get('rate');
      u.pitch = opts.pitch || 1;
      u.onend = resolve;
      u.onerror = resolve;
      /* Chrome gubi utterance wysłane synchronicznie tuż po cancel() —
       * odstęp jednej klatki omija to niezawodnie. resume() jak wyżej. */
      setTimeout(() => {
        try {
          speechSynthesis.resume();
          speechSynthesis.speak(u);
        } catch (e) { resolve(); }
      }, 60);
      // Siatka bezpieczeństwa: onend potrafi nie przyjść (np. cancel).
      setTimeout(resolve, 1200 + text.length * 220);
    });
  }

  /* Diagnostyka lektora dla Strefy Rodzica. */
  function ttsStatus() {
    if (!('speechSynthesis' in window)) return { available: false, en: 0 };
    const vs = speechSynthesis.getVoices();
    return { available: true, en: vs.filter(v => /^en/i.test(v.lang)).length };
  }

  function tone(freq, t0, dur, gainMax, type = 'sine') {
    const g = ctx.createGain();
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gainMax, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  /* Miękki, cichy dzwonek (tercja E5→G5) — potwierdzenie, nie fanfary. */
  function chime() {
    if (!Settings.get('sound') || !ctx) return;
    const t = ctx.currentTime;
    tone(659.25, t, 0.5, 0.05);
    tone(783.99, t + 0.12, 0.6, 0.045);
  }

  /* Drewniany "tyk" przy odsłanianiu liter na tablicy. */
  function tick() {
    if (!Settings.get('sound') || !ctx) return;
    tone(520, ctx.currentTime, 0.07, 0.03, 'triangle');
  }

  return { speak, chime, tick, unlock, ttsStatus };
})();

/* Rozpoznawanie mowy — dostępne nie wszędzie (brak w Safari/iOS).
 * Domyślnie wyłączone; rodzic może włączyć w Strefie Rodzica. */
const Speech = (() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return {
    supported: !!SR,
    /* Słucha raz i woła cb(transcript|null). null = brak wyniku/błąd. */
    listenOnce(cb) {
      if (!SR) { cb(null); return null; }
      const r = new SR();
      r.lang = 'en-US';
      r.interimResults = false;
      r.maxAlternatives = 3;
      let done = false;
      const finish = val => { if (!done) { done = true; cb(val); } };
      r.onresult = e => {
        const said = Array.from(e.results[0]).map(x => x.transcript.toLowerCase()).join(' ');
        finish(said);
      };
      r.onerror = () => finish(null);
      r.onend = () => finish(null);
      try { r.start(); } catch (e) { finish(null); return null; }
      return r;
    },
  };
})();
