// Direction A — Editorial / Wabi
// Quiet, type-led. White / off-white with red & orange used sparingly.
// Real content from kanno.pl

// Photo URLs — Unsplash (real ramen, noodles, dough imagery)
const PHOTOS_A = {
  hero1: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=900&q=80&auto=format&fit=crop', // ramen close-up
  hero2: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=1200&q=80&auto=format&fit=crop', // noodle bowl hero
  hero3: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&q=80&auto=format&fit=crop', // hands / production
  founder: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80&auto=format&fit=crop', // dough/portrait stand-in
  step1: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop', // wheat / flour
  step2: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80&auto=format&fit=crop', // mixing
  step3: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80&auto=format&fit=crop', // production line
  step4: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80&auto=format&fit=crop', // cut noodles
  portfolio: 'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?w=1400&q=80&auto=format&fit=crop' // noodle range
};

// Hook: fade/slide in once when element enters viewport
const useReveal = () => {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
};

const Reveal = ({ children, delay = 0, as: Tag = 'div', className = '', style = {}, ...rest }) => {
  const [ref, shown] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >{children}</Tag>
  );
};

const DirectionA = () => {
  const [lang, setLang] = React.useState('EN');
  const heroRef = React.useRef(null);

  // Subtle parallax on hero figures
  React.useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const t = Math.max(-300, Math.min(300, -rect.top * 0.08));
      el.style.setProperty('--p', `${t}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copy = {
    EN: {
      nav: ['About', 'Portfolio', 'Quality', 'Production', 'Contact'],
      heroEyebrow: 'Tokyo · 1949 — Warsaw · today',
      heroTitle: ['The art of', 'Asian', 'noodles.'],
      heroSub: 'Kanno Noodle is a joint venture between the Kanno family — producing Japanese noodles in Tokyo since 1949 — and a Polish family business. We bring authentic ramen, udon and soba to European kitchens.',
      heroCta: 'Request a sample',
      heroCta2: 'About the company',
      sectionStory: 'About us',
      storyTitle: 'Three generations of noodle-making, brought to Europe.',
      storyBody1: 'Kanno Noodle was founded as a joint venture between Mr. Yoshio Kanno, head of a Tokyo family business producing Japanese noodles since 1949, and a Polish family enterprise. The mission is simple: bring genuine Japanese noodle craft to the European market.',
      storyBody2: 'Our recipes, technique and quality discipline come directly from Tokyo. Our production, logistics and people are based in Poland — close to our customers, on EU soil, ready to ship across the continent.',
      storyMeta: [['Since', '1949'], ['Founded', '2018 PL'], ['Heritage', 'Japanese'], ['Standard', 'IFS Food']],
      sectionProcess: 'Quality',
      processTitle: 'Authentic recipes, modern discipline.',
      processSub: 'Every batch is produced under the supervision of qualified food technologists, to standards certified to IFS. The recipe is Japanese; the consistency, traceability and food-safety regime is European.',
      steps: [
        { n: '01', title: 'Recipe', body: 'Authentic Japanese formulations from the Kanno family, refined over three generations of noodle production in Tokyo.' },
        { n: '02', title: 'Ingredients', body: 'Carefully selected wheat flours and ingredients. Every component traceable, every delivery checked.' },
        { n: '03', title: 'Production', body: 'Modern production facility in central Poland, supervised by qualified food technologists at every stage.' },
        { n: '04', title: 'Standard', body: 'Certified to IFS Food. Documented procedures, regular audits, full chain-of-custody on every shipment.' }
      ],
      sectionBiz: 'Portfolio',
      bizTitle: 'Ramen, udon, soba — and what your kitchen needs next.',
      bizSub: 'Our portfolio covers the core Japanese noodle range, with the flexibility to develop bespoke products for restaurants, distributors and food-service partners across Europe.',
      bizPoints: [
        ['Ramen', 'Fresh and dried ramen noodles in multiple gauges. The heart of the Kanno range.'],
        ['Udon', 'Thick wheat noodles with a soft bite, true to the Japanese tradition.'],
        ['Soba', 'Buckwheat noodles, both pure and blended, for cold and hot service.'],
        ['Bespoke', 'Custom recipes, gauges and packaging for B2B partners with specific kitchen needs.']
      ],
      contactTitle: 'Talk to us.',
      contactSub: 'Distributors, restaurants, food-service operators — we answer every inquiry. Tell us what you need and where you cook.',
      contactCta: 'Send an inquiry',
      addr: ['Kanno Noodle Sp. z o.o.', 'al. Niepodległości 112', '02-577 Warszawa, Poland'],
      production: 'Production · central Poland',
      stepImg: ['Mill', 'Mix', 'Rest', 'Cut']
    },
    PL: {
      nav: ['O nas', 'Portfolio', 'Jakość', 'Produkcja', 'Kontakt'],
      heroEyebrow: 'Tokio · 1949 — Warszawa · dziś',
      heroTitle: ['Sztuka', 'azjatyckiego', 'makaronu.'],
      heroSub: 'Kanno Noodle to wspólne przedsięwzięcie rodziny Kanno — produkującej japoński makaron w Tokio od 1949 roku — oraz polskiej firmy rodzinnej. Dostarczamy autentyczny ramen, udon i sobę do kuchni w całej Europie.',
      heroCta: 'Zamów próbkę',
      heroCta2: 'O firmie',
      sectionStory: 'O nas',
      storyTitle: 'Trzy pokolenia makaronu — teraz w Europie.',
      storyBody1: 'Kanno Noodle powstało jako wspólne przedsięwzięcie pana Yoshio Kanno, głowy tokijskiej firmy rodzinnej produkującej japoński makaron od 1949 roku, oraz polskiego biznesu rodzinnego. Misja jest prosta: dostarczać autentyczne japońskie rzemiosło makaronowe na rynek europejski.',
      storyBody2: 'Receptury, technika i dyscyplina jakości pochodzą prosto z Tokio. Produkcja, logistyka i ludzie — z Polski. Blisko naszych klientów, na terenie UE, gotowi do wysyłki w całej Europie.',
      storyMeta: [['Od', '1949'], ['Założono', '2018 PL'], ['Dziedzictwo', 'Japońskie'], ['Standard', 'IFS Food']],
      sectionProcess: 'Jakość',
      processTitle: 'Autentyczne receptury, nowoczesna dyscyplina.',
      processSub: 'Każda partia powstaje pod nadzorem wykwalifikowanych technologów żywności, zgodnie ze standardami certyfikowanymi w systemie IFS. Receptura jest japońska — system bezpieczeństwa żywności europejski.',
      steps: [
        { n: '01', title: 'Receptura', body: 'Autentyczne japońskie receptury rodziny Kanno, doskonalone przez trzy pokolenia produkcji w Tokio.' },
        { n: '02', title: 'Surowce', body: 'Starannie dobrane mąki i składniki. Każdy element identyfikowalny, każda dostawa sprawdzona.' },
        { n: '03', title: 'Produkcja', body: 'Nowoczesny zakład w centralnej Polsce, nadzorowany na każdym etapie przez wykwalifikowanych technologów żywności.' },
        { n: '04', title: 'Standard', body: 'Certyfikat IFS Food. Udokumentowane procedury, regularne audyty, pełna identyfikowalność każdej wysyłki.' }
      ],
      sectionBiz: 'Portfolio',
      bizTitle: 'Ramen, udon, soba — i to, czego potrzebuje Twoja kuchnia.',
      bizSub: 'Nasze portfolio obejmuje podstawową gamę japońskich makaronów, z elastycznością tworzenia produktów na zamówienie dla restauracji, dystrybutorów i partnerów food-service w całej Europie.',
      bizPoints: [
        ['Ramen', 'Świeży i suszony ramen w wielu grubościach. Serce oferty Kanno.'],
        ['Udon', 'Grube makarony pszenne o miękkim gryzie, wierne japońskiej tradycji.'],
        ['Soba', 'Makarony gryczane, czyste i mieszane, do dań ciepłych i zimnych.'],
        ['Na zamówienie', 'Receptury, grubości i opakowania szyte pod wymagania partnerów B2B.']
      ],
      contactTitle: 'Porozmawiajmy.',
      contactSub: 'Dystrybutorzy, restauracje, food-service — odpowiadamy na każde zapytanie. Powiedz, czego potrzebujesz i gdzie gotujesz.',
      contactCta: 'Wyślij zapytanie',
      addr: ['Kanno Noodle Sp. z o.o.', 'al. Niepodległości 112', '02-577 Warszawa, Polska'],
      production: 'Produkcja · centralna Polska',
      stepImg: ['Mielenie', 'Mieszanie', 'Leżakowanie', 'Cięcie']
    },
    JP: {
      nav: ['会社概要', '製品', '品質', '工場', 'お問合せ'],
      heroEyebrow: '東京 · 1949 — ワルシャワ · 現在',
      heroTitle: ['アジア麺', 'の', '技。'],
      heroSub: '株式会社Kanno Noodleは、1949年から東京で日本の麺を製造する菅野家と、ポーランドの家族企業によるジョイント・ベンチャーです。本格的なラーメン、うどん、蕎麦をヨーロッパの厨房へお届けします。',
      heroCta: 'サンプル依頼',
      heroCta2: '会社案内',
      sectionStory: '会社概要',
      storyTitle: '三代続く麺づくりを、ヨーロッパへ。',
      storyBody1: 'Kanno Noodleは、1949年から日本の麺を製造する東京の菅野家を率いる菅野義雄氏と、ポーランドの家族経営の企業によるジョイント・ベンチャーとして設立されました。使命は明快——本物の日本の麺づくりをヨーロッパ市場へ届けること。',
      storyBody2: 'レシピ、技術、品質規律は東京から直接受け継いでいます。生産、物流、人材はポーランドに。お客様の近くで、EU圏内で、欧州全域への発送に備えています。',
      storyMeta: [['創業', '1949'], ['ポーランド', '2018'], ['伝統', '日本'], ['基準', 'IFS Food']],
      sectionProcess: '品質',
      processTitle: '本物のレシピ、現代の規律。',
      processSub: 'すべてのバッチは、有資格の食品技術者の監督のもと、IFS認証基準で生産されます。レシピは日本式、食品安全体制はヨーロッパ式。',
      steps: [
        { n: '01', title: 'レシピ', body: '東京で三代続く菅野家による、本物の日本の製麺レシピ。' },
        { n: '02', title: '原料', body: '厳選された小麦粉と原材料。すべて追跡可能、すべての納品を検査。' },
        { n: '03', title: '生産', body: 'ポーランド中部の近代的な工場。各工程で有資格の食品技術者が監督。' },
        { n: '04', title: '基準', body: 'IFS Food認証取得。文書化された手順、定期監査、全出荷の完全な追跡。' }
      ],
      sectionBiz: '製品',
      bizTitle: 'ラーメン、うどん、蕎麦——そして厨房の次の一手。',
      bizSub: '日本の麺の主要レンジを揃え、欧州全域のレストラン、卸、業務用パートナー向けに特注品の開発にも柔軟に対応します。',
      bizPoints: [
        ['ラーメン', '生・乾燥ラーメンを複数の太さで。Kannoの中核。'],
        ['うどん', '日本の伝統に忠実な、コシのある太麺。'],
        ['蕎麦', '純粋・ブレンド両方の蕎麦。冷温両方のサービスに。'],
        ['特注', '業務用パートナーの厨房に合わせた、レシピ・太さ・包装のカスタム対応。']
      ],
      contactTitle: 'ご相談ください。',
      contactSub: '卸、レストラン、業務用事業者——すべてのお問い合わせにお答えします。必要なもの、調理される場所をお知らせください。',
      contactCta: '問合せを送る',
      addr: ['Kanno Noodle Sp. z o.o.', 'al. Niepodległości 112', '02-577 ワルシャワ、ポーランド'],
      production: '生産 · ポーランド中部',
      stepImg: ['製粉', '混合', '熟成', '切り出し']
    }
  };
  const t = copy[lang];

  // Cinematic intro state
  const [introDone, setIntroDone] = React.useState(false);
  React.useEffect(() => {
    const skip = sessionStorage.getItem('kannoIntroSeen') === '1';
    if (skip) { setIntroDone(true); return; }
    const timer = setTimeout(() => {
      sessionStorage.setItem('kannoIntroSeen', '1');
      setIntroDone(true);
    }, 4800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`dirA ${introDone ? 'intro-done' : 'intro-on'}`}>
      <style>{`
        .dirA { --bg:#fbfaf7; --bg-2:#f3efe8; --ink:#1a1714; --ink-2:#3a3328; --red:#E2231A; --orange:#F39200; --line:rgba(26,23,20,0.14); font-family: 'Cormorant Garamond', 'Times New Roman', serif; color: var(--ink); background: var(--bg); min-height:100%; }
        .dirA *, .dirA *::before, .dirA *::after { box-sizing: border-box; }
        .dirA .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.04em; text-transform: uppercase; font-size: 11px; }
        .dirA .sans { font-family: 'Inter', 'Helvetica Neue', sans-serif; }

        .dirA .nav { position: sticky; top:0; z-index:50; background: var(--bg); border-bottom: 1px solid var(--line); }
        .dirA .nav-inner { display:flex; align-items:center; justify-content:space-between; padding: 18px 56px; gap: 24px; }
        .dirA .logo { height: 40px; display:block; }
        .dirA .logo img { height: 100%; width: auto; display:block; }
        .dirA .nav-links { display:flex; gap: 32px; }
        .dirA .nav-links a { color: var(--ink); text-decoration:none; font-family: 'Inter', sans-serif; font-size: 13px; letter-spacing: 0.02em; }
        .dirA .nav-links a:hover { color: var(--red); }
        .dirA .lang { display:flex; gap:0; border:1px solid var(--line); border-radius: 999px; overflow:hidden; }
        .dirA .lang button { background: transparent; border:0; padding: 8px 14px; font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.18em; color: var(--ink); cursor:pointer; }
        .dirA .lang button.on { background: var(--ink); color: var(--bg); }

        .dirA section { padding: 0 56px; }

        .dirA .hero { padding-top: 80px; padding-bottom: 96px; }
        .dirA .hero-grid { display:grid; grid-template-columns: 1.2fr 1fr; gap: 56px; align-items: end; }
        .dirA .hero h1 { font-size: clamp(72px, 10vw, 184px); font-weight: 400; line-height: 0.9; letter-spacing: -0.025em; margin: 28px 0 0; }
        .dirA .hero h1 .it { font-style: italic; font-weight: 300; color: var(--red); }
        .dirA .hero h1 .or { font-style: italic; font-weight: 300; color: var(--orange); }
        .dirA .hero-eyebrow { display:flex; align-items:center; gap: 14px; }
        .dirA .hero-eyebrow .line { flex:0 0 60px; height:1px; background: var(--ink); }
        .dirA .hero-meta { display:flex; flex-direction:column; gap: 28px; align-self: end; padding-bottom: 14px; }
        .dirA .hero-meta p { font-size: 19px; line-height: 1.5; max-width: 40ch; margin:0; color: var(--ink-2); font-family:'Inter', sans-serif; font-weight: 300; }
        .dirA .ctas { display:flex; gap: 12px; }
        .dirA .btn { font-family:'Inter', sans-serif; font-size: 13px; padding: 14px 22px; border-radius: 999px; border: 1px solid var(--ink); background: var(--ink); color: var(--bg); text-decoration:none; cursor:pointer; letter-spacing: 0.02em; }
        .dirA .btn.ghost { background: transparent; color: var(--ink); }
        .dirA .btn:hover { background: var(--red); border-color: var(--red); color: #fff; }

        .dirA .hero-figure { margin-top: 64px; display:grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 16px; align-items: stretch; }
        .dirA .placeholder { background:
          repeating-linear-gradient(135deg, rgba(26,23,20,0.06) 0 1px, transparent 1px 12px),
          var(--bg-2);
          border: 1px solid var(--line);
          color: var(--ink-2);
          font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          display:flex; align-items:flex-end; padding: 14px;
          position:relative; overflow:hidden;
        }
        .dirA .placeholder.tall { aspect-ratio: 3/4; }
        .dirA .placeholder.wide { aspect-ratio: 4/3; }
        .dirA .placeholder.hero-img { aspect-ratio: 1/1.15; }
        .dirA .placeholder .tag { background: var(--ink); color: var(--bg); padding: 4px 8px; }

        .dirA .marquee { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 16px 0; overflow:hidden; }
        .dirA .marquee-track { display:flex; gap: 40px; white-space:nowrap; animation: dirAmarquee 50s linear infinite; }
        .dirA .marquee-track span { font-family:'Cormorant Garamond', serif; font-size: 28px; font-style: italic; opacity: .65; }
        .dirA .marquee-track span:nth-child(3n) { color: var(--red); opacity: .85; }
        .dirA .marquee-track span:nth-child(5n) { color: var(--orange); opacity: .85; }
        .dirA .marquee-track span::after { content:'·'; margin-left: 40px; opacity:.35; }
        @keyframes dirAmarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .dirA .story { padding-top: 96px; padding-bottom: 96px; }
        .dirA .section-head { display:grid; grid-template-columns: 220px 1fr; gap: 56px; align-items: baseline; margin-bottom: 56px; }
        .dirA .section-head .lbl { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; }
        .dirA .section-head h2 { font-size: clamp(40px, 5vw, 80px); font-weight: 400; line-height: 1; letter-spacing: -0.02em; margin: 0; max-width: 18ch; }
        .dirA .story-grid { display:grid; grid-template-columns: 220px 1fr 1fr; gap: 56px; }
        .dirA .story-grid .body { font-family:'Inter', sans-serif; font-weight: 300; font-size: 17px; line-height: 1.65; color: var(--ink-2); margin: 0; }
        .dirA .story-grid .body + .body { margin-top: 16px; }
        .dirA .story-meta { display:flex; flex-direction:column; gap: 0; }
        .dirA .story-meta div { display:flex; justify-content:space-between; padding: 12px 0; border-bottom: 1px dotted var(--line); font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; }
        .dirA .story-meta div b { font-weight: 400; opacity: .6; }

        .dirA .process { padding-top: 96px; padding-bottom: 96px; background: var(--bg-2); margin: 0 -56px; padding-left:56px; padding-right:56px; }
        .dirA .process .grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid var(--line); }
        .dirA .step { padding: 28px 24px 32px; border-right: 1px solid var(--line); position: relative; min-height: 320px; }
        .dirA .step:last-child { border-right: 0; }
        .dirA .step .n { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; color: var(--red); }
        .dirA .step h3 { font-size: 36px; font-weight: 400; margin: 24px 0 12px; letter-spacing: -0.01em; font-style: italic; }
        .dirA .step p { font-family:'Inter', sans-serif; font-size: 14px; line-height: 1.6; font-weight: 300; color: var(--ink-2); margin: 0; }
        .dirA .step-img { margin-top: 24px; aspect-ratio: 4/5; }

        .dirA .biz { padding-top: 96px; padding-bottom: 96px; }
        .dirA .biz-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .dirA .biz-points { display:grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
        .dirA .biz-point { background: var(--bg); padding: 28px 24px; min-height: 180px; transition: background .25s; }
        .dirA .biz-point:hover { background: var(--bg-2); }
        .dirA .biz-point h4 { font-size: 28px; font-weight: 400; margin: 0 0 10px; letter-spacing: -0.01em; font-style: italic; }
        .dirA .biz-point h4:nth-of-type(1) { color: var(--red); }
        .dirA .biz-point p { font-family:'Inter', sans-serif; font-size: 13.5px; line-height: 1.6; font-weight: 300; color: var(--ink-2); margin: 0; }

        .dirA .contact { padding-top: 96px; padding-bottom: 96px; background: var(--ink); color: var(--bg); margin: 0 -56px; padding-left:56px; padding-right:56px; }
        .dirA .contact h2 { font-size: clamp(48px, 7vw, 120px); font-weight: 400; letter-spacing: -0.02em; line-height: 1; margin: 0; }
        .dirA .contact h2 .it { font-style: italic; color: var(--orange); }
        .dirA .contact .row { display:grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; }
        .dirA .contact .right { display:flex; flex-direction:column; gap: 24px; align-items:flex-start; }
        .dirA .contact .right p { font-family:'Inter', sans-serif; font-weight: 300; font-size: 18px; line-height: 1.55; max-width: 38ch; opacity: .8; margin:0; }
        .dirA .contact .btn { background: var(--red); color: #fff; border-color: var(--red); }
        .dirA .contact .btn.ghost { background: transparent; color: var(--bg); border-color: var(--bg); }
        .dirA .contact .btn:hover { background: var(--orange); border-color: var(--orange); color: #fff; }

        .dirA .foot { padding: 32px 56px; display:grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 32px; background: var(--ink); color: var(--bg); border-top: 1px solid rgba(251,250,247,0.12); font-family:'Inter', sans-serif; font-size: 13px; }
        .dirA .foot h5 { font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; opacity: .5; margin: 0 0 10px; font-weight: 400; }
        .dirA .foot p, .dirA .foot a { color: var(--bg); margin: 0; opacity: .85; line-height: 1.6; text-decoration: none; }
        .dirA .foot a:hover { color: var(--orange); opacity: 1; }
        .dirA .foot .copy { font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; opacity: .5; margin-top: 16px; }

        .dirA ::selection { background: var(--red); color: #fff; }

        .dirA .reveal { opacity: 0; transform: translateY(28px); transition: opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1); }
        .dirA .reveal.in { opacity: 1; transform: none; }
        .dirA .photo { position: relative; overflow: hidden; background: var(--bg-2); border: 1px solid var(--line); }
        .dirA .photo img { width:100%; height:100%; object-fit: cover; display:block; transition: transform 1.4s cubic-bezier(.2,.7,.2,1), filter .8s; transform: scale(1.04); filter: saturate(0.95); }
        .dirA .photo.in img, .dirA .reveal.in .photo img { transform: scale(1); }
        .dirA .photo:hover img { transform: scale(1.06); filter: saturate(1.05); }
        .dirA .photo.tall { aspect-ratio: 3/4; }
        .dirA .photo.wide { aspect-ratio: 4/3; }
        .dirA .photo.hero-img { aspect-ratio: 1/1.15; }
        .dirA .photo .cap { position: absolute; left: 12px; bottom: 12px; background: rgba(26,23,20,0.78); color: var(--bg); padding: 4px 8px; font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; backdrop-filter: blur(4px); }
        .dirA .photo.step-img { aspect-ratio: 4/5; margin-top: 24px; }

        .dirA .hero-figure { transform: translateY(var(--p, 0px)); will-change: transform; }

        @keyframes dirAfadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .dirA .hero h1 span.line-anim { display:inline-block; opacity: 0; transform: translateY(28px); animation: dirAfadeUp 1s cubic-bezier(.2,.7,.2,1) forwards; }
        .dirA .hero h1 span.line-anim:nth-child(1) { animation-delay: 0.1s; }
        .dirA .hero h1 span.line-anim:nth-child(2) { animation-delay: 0.25s; }
        .dirA .hero h1 span.line-anim:nth-child(3) { animation-delay: 0.4s; }
        .dirA .hero-eyebrow { animation: dirAfadeUp 0.9s cubic-bezier(.2,.7,.2,1) both; }
        .dirA .hero-meta { animation: dirAfadeUp 1s cubic-bezier(.2,.7,.2,1) 0.55s both; }
        .dirA .hero-eyebrow .line { transform-origin: left center; animation: dirAlineGrow 1.2s cubic-bezier(.2,.7,.2,1) 0.2s both; }
        @keyframes dirAlineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        /* ===== Cinematic intro ===== */
        .dirA.intro-on { overflow: hidden; height: 100vh; }
        .dirA .intro { position: fixed; inset: 0; z-index: 200; background: #0a0807; color: #f3efe5; pointer-events: none; }
        .dirA.intro-done .intro { animation: introFadeOut 0.9s cubic-bezier(.2,.7,.2,1) forwards; }
        @keyframes introFadeOut { to { opacity: 0; visibility: hidden; } }

        /* Letterbox bars (top + bottom) */
        .dirA .intro .bar { position: absolute; left: 0; right: 0; background: #0a0807; z-index: 6; }
        .dirA .intro .bar.top { top: 0; height: 50%; transform: translateY(0); animation: barTopOpen 1.2s cubic-bezier(.7,0,.3,1) 3.6s forwards; }
        .dirA .intro .bar.bot { bottom: 0; height: 50%; transform: translateY(0); animation: barBotOpen 1.2s cubic-bezier(.7,0,.3,1) 3.6s forwards; }
        @keyframes barTopOpen { to { transform: translateY(-100%); } }
        @keyframes barBotOpen { to { transform: translateY(100%); } }

        /* Cinema viewport — 16:9 strip in the middle */
        .dirA .intro .cine { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 56.25vw; max-height: 100vh; overflow: hidden; z-index: 4; }
        .dirA .intro .cine::before, .dirA .intro .cine::after { content: ''; position: absolute; left: 0; right: 0; height: 12vh; background: #0a0807; z-index: 5; }
        .dirA .intro .cine::before { top: 0; }
        .dirA .intro .cine::after { bottom: 0; }
        .dirA .intro .shot { position: absolute; inset: 0; opacity: 0; }
        .dirA .intro .shot img { width: 100%; height: 100%; object-fit: cover; display:block; filter: saturate(0.85) contrast(1.05) brightness(0.7); }
        .dirA .intro .shot.s1 { animation: shotPan 2.6s cubic-bezier(.2,.7,.2,1) 0.2s both; }
        .dirA .intro .shot.s2 { animation: shotPan2 1.8s cubic-bezier(.2,.7,.2,1) 2.2s both; }
        @keyframes shotPan { 0% { opacity: 0; transform: scale(1.18) translateX(-2%); } 12% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; transform: scale(1.04) translateX(0); } }
        @keyframes shotPan2 { 0% { opacity: 0; transform: scale(1.15) translateY(2%); } 18% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: scale(1.0) translateY(0); } }

        /* Vignette + grain over the cine strip */
        .dirA .intro .cine .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%); pointer-events:none; z-index: 3; }
        .dirA .grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.18; mix-blend-mode: overlay; z-index: 2; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); animation: grainShift 0.4s steps(4) infinite; }
        @keyframes grainShift { 0% { transform: translate(0,0); } 25% { transform: translate(-3%,2%); } 50% { transform: translate(2%,-3%); } 75% { transform: translate(-2%,-2%); } 100% { transform: translate(3%,3%); } }

        /* Caption text — kinetic typography */
        .dirA .intro .caption { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); z-index: 7; text-align: center; padding: 0 8vw; }
        .dirA .intro .cap-line { display: block; overflow: hidden; }
        .dirA .intro .cap-line .inner { display: inline-block; transform: translateY(110%); }
        .dirA .intro .l1 { font-family:'JetBrains Mono', monospace; font-size: clamp(11px, 1vw, 13px); letter-spacing: 0.45em; text-transform: uppercase; opacity: 0.85; margin-bottom: 24px; }
        .dirA .intro .l1 .inner { animation: capUp 0.9s cubic-bezier(.2,.7,.2,1) 0.4s forwards; }
        .dirA .intro .l2 { font-family:'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(56px, 9vw, 132px); line-height: 1; letter-spacing: -0.02em; }
        .dirA .intro .l2 .word { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .dirA .intro .l2 .word .inner { display: inline-block; transform: translateY(110%); filter: blur(8px); }
        .dirA .intro .l2 .w1 .inner { animation: capUpBlur 1.1s cubic-bezier(.2,.7,.2,1) 0.7s forwards; }
        .dirA .intro .l2 .w2 .inner { animation: capUpBlur 1.1s cubic-bezier(.2,.7,.2,1) 0.95s forwards; color: var(--red); font-style: italic; font-weight: 300; }
        .dirA .intro .l2 .w3 .inner { animation: capUpBlur 1.1s cubic-bezier(.2,.7,.2,1) 1.2s forwards; }
        .dirA .intro .l3 { font-family:'JetBrains Mono', monospace; font-size: clamp(10px, 0.85vw, 12px); letter-spacing: 0.32em; text-transform: uppercase; opacity: 0.65; margin-top: 28px; }
        .dirA .intro .l3 .inner { animation: capUp 0.9s cubic-bezier(.2,.7,.2,1) 1.6s forwards; }
        @keyframes capUp { to { transform: translateY(0); } }
        @keyframes capUpBlur { to { transform: translateY(0); filter: blur(0); } }

        /* Logo flash at end */
        .dirA .intro .logo-flash { position: absolute; inset: 0; display:grid; place-items:center; z-index: 8; opacity: 0; }
        .dirA .intro .logo-flash img { width: clamp(220px, 26vw, 380px); filter: brightness(1.1); animation: logoFlash 1.8s cubic-bezier(.2,.7,.2,1) 2.6s both; }
        @keyframes logoFlash { 0% { opacity: 0; transform: scale(0.96); filter: brightness(1.4) blur(6px); } 25% { opacity: 1; transform: scale(1); filter: brightness(1.05) blur(0); } 75% { opacity: 1; } 100% { opacity: 0; transform: scale(1.02); } }
        .dirA .intro .logo-flash { animation: logoFlashWrap 1.8s ease 2.6s both; }
        @keyframes logoFlashWrap { 0%, 100% { opacity: 0; } 25%, 75% { opacity: 1; } }

        /* Tick counter */
        .dirA .intro .tick { position: absolute; left: 6vw; bottom: 14vh; font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.55; z-index: 7; display:flex; gap: 16px; align-items: center; }
        .dirA .intro .tick .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: tickPulse 1.2s ease-in-out infinite; }
        @keyframes tickPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        .dirA .intro .stamp { position: absolute; right: 6vw; bottom: 14vh; font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.55; z-index: 7; }

        /* Skip */
        .dirA .intro .skip { position: absolute; right: 6vw; top: 14vh; z-index: 9; pointer-events: auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.18); color: #f3efe5; padding: 8px 14px; border-radius: 999px; font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(6px); }
        .dirA .intro .skip:hover { background: var(--red); border-color: var(--red); }

        @media (prefers-reduced-motion: reduce) {
          .dirA .intro { display: none; }
        }
      `}</style>

      <div className="intro" aria-hidden={introDone}>
        <div className="cine">
          <div className="shot s1"><img src={PHOTOS_A.hero2} alt="" /></div>
          <div className="shot s2"><img src={PHOTOS_A.hero3} alt="" /></div>
          <div className="vignette" />
        </div>
        <div className="grain" />
        <div className="bar top" />
        <div className="bar bot" />
        <div className="caption">
          <div className="cap-line l1"><span className="inner">Tokyo · 1949 — Warsaw · today</span></div>
          <div className="cap-line l2">
            <span className="word w1"><span className="inner">The art</span></span>{' '}
            <span className="word w2"><span className="inner">of Asian</span></span>{' '}
            <span className="word w3"><span className="inner">noodles.</span></span>
          </div>
          <div className="cap-line l3"><span className="inner">A film by Kanno Noodle — Sc. 01</span></div>
        </div>
        <div className="logo-flash"><img src="assets/kanno-logo.png" alt="" /></div>
        <div className="tick"><span className="dot" /><span>REC · 24fps · KANNO/01</span></div>
        <div className="stamp">麺 · ART OF NOODLES</div>
        <button className="skip" onClick={() => setIntroDone(true)}>Skip →</button>
      </div>


      <header className="nav">
        <div className="nav-inner">
          <a href="#" className="logo"><img src="assets/kanno-logo.png" alt="Kanno Noodle" /></a>
          <nav className="nav-links sans">
            {t.nav.map((n) => <a key={n} href="#">{n}</a>)}
          </nav>
          <div className="lang">
            {['EN','PL','JP'].map(l => (
              <button key={l} className={lang===l ? 'on':''} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow mono">
              <span className="line" /><span>{t.heroEyebrow}</span>
            </div>
            <h1>
              <span className="line-anim">{t.heroTitle[0]}</span><br/>
              <span className="line-anim it">{t.heroTitle[1]}</span><br/>
              <span className="line-anim">{t.heroTitle[2]}</span>
            </h1>
          </div>
          <div className="hero-meta">
            <p>{t.heroSub}</p>
            <div className="ctas">
              <a className="btn" href="#contact">{t.heroCta} →</a>
              <a className="btn ghost" href="#story">{t.heroCta2}</a>
            </div>
          </div>
        </div>
        <div className="hero-figure" ref={heroRef}>
          <Reveal delay={100}><div className="photo tall"><img src={PHOTOS_A.hero1} alt="Ramen close-up" loading="lazy"/><span className="cap">Ramen · close-up</span></div></Reveal>
          <Reveal delay={200}><div className="photo hero-img"><img src={PHOTOS_A.hero2} alt="Noodle bowl" loading="lazy"/><span className="cap">Hero · bowl</span></div></Reveal>
          <Reveal delay={300}><div className="photo tall"><img src={PHOTOS_A.hero3} alt="Production hands" loading="lazy"/><span className="cap">Production · hands</span></div></Reveal>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[...Array(2)].flatMap((_,i) => ['Ramen','Udon','Soba','IFS Food','Authentic Japanese','Made in Poland','Since 1949','Tokyo · Warsaw','For HoReCa']
            .map((w, j) => <span key={`${i}-${j}`}>{w}</span>))}
        </div>
      </div>

      <section className="story" id="story">
        <Reveal className="section-head">
          <div className="lbl">— {t.sectionStory}</div>
          <h2>{t.storyTitle}</h2>
        </Reveal>
        <div className="story-grid">
          <Reveal><div className="photo tall"><img src={PHOTOS_A.founder} alt="Dough" loading="lazy"/><span className="cap">Workshop</span></div></Reveal>
          <Reveal delay={120}>
            <p className="body">{t.storyBody1}</p>
            <p className="body">{t.storyBody2}</p>
          </Reveal>
          <Reveal delay={240} className="story-meta">
            {t.storyMeta.map(([a,b], i) => (
              <div key={i}><b>{a}</b><span>{b}</span></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="process">
        <Reveal className="section-head">
          <div className="lbl">— {t.sectionProcess}</div>
          <h2>{t.processTitle}</h2>
        </Reveal>
        <div style={{maxWidth: 720, marginBottom: 40}}>
          <p style={{fontFamily:"'Inter', sans-serif", fontWeight:300, fontSize:17, lineHeight:1.65, color:'var(--ink-2)'}}>{t.processSub}</p>
        </div>
        <div className="grid">
          {t.steps.map((s, i) => {
            const photoKey = ['step1','step2','step3','step4'][i];
            return (
              <Reveal key={s.n} delay={i*120} className="step">
                <div className="n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="photo step-img"><img src={PHOTOS_A[photoKey]} alt={s.title} loading="lazy"/><span className="cap">{t.stepImg[i]}</span></div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="biz">
        <Reveal className="section-head">
          <div className="lbl">— {t.sectionBiz}</div>
          <h2>{t.bizTitle}</h2>
        </Reveal>
        <div className="biz-grid">
          <Reveal>
            <p style={{fontFamily:"'Inter', sans-serif", fontWeight:300, fontSize:18, lineHeight:1.6, color:'var(--ink-2)', maxWidth:'40ch', margin:0}}>{t.bizSub}</p>
            <div style={{marginTop: 32}} className="photo wide"><img src={PHOTOS_A.portfolio} alt="Noodle range" loading="lazy"/><span className="cap">Portfolio · range</span></div>
          </Reveal>
          <Reveal delay={150} className="biz-points">
            {t.bizPoints.map(([h, b], i) => (
              <div className="biz-point" key={i}>
                <h4>{h}</h4>
                <p>{b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="row">
          <h2>{t.contactTitle.split(' ').map((w, i, a) => i === a.length - 1 ? <span key={i} className="it">{w}</span> : <span key={i}>{w} </span>)}</h2>
          <div className="right">
            <p>{t.contactSub}</p>
            <a className="btn" href="mailto:office@kanno.pl">{t.contactCta} →</a>
            <div className="mono" style={{opacity:.6, marginTop: 12}}>office@kanno.pl</div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div>
          <img src="assets/kanno-logo.png" alt="Kanno Noodle" style={{height: 32, filter: 'invert(1) brightness(1.2)', marginBottom: 16, display:'block'}}/>
          <p style={{maxWidth: '32ch', opacity:.7}}>{t.heroSub.split('.')[0]}.</p>
          <div className="copy">© Kanno Noodle Sp. z o.o. 2026</div>
        </div>
        <div>
          <h5>{lang === 'PL' ? 'Adres' : lang === 'JP' ? '所在地' : 'Address'}</h5>
          <p>{t.addr.map((l, i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}</p>
          <p style={{marginTop: 8, opacity: .6}}>{t.production}</p>
        </div>
        <div>
          <h5>{lang === 'PL' ? 'Kontakt' : lang === 'JP' ? '連絡先' : 'Contact'}</h5>
          <p><a href="mailto:office@kanno.pl">office@kanno.pl</a></p>
          <p style={{marginTop: 8}}><a href="https://www.kanno.pl" target="_blank" rel="noopener">www.kanno.pl</a></p>
        </div>
        <div>
          <h5>{lang === 'PL' ? 'Jakość' : lang === 'JP' ? '認証' : 'Quality'}</h5>
          <p>IFS Food certified</p>
          <p style={{marginTop: 8, opacity:.6}}>{lang === 'PL' ? 'Pełna identyfikowalność' : lang === 'JP' ? '完全な追跡可能性' : 'Full traceability'}</p>
        </div>
      </footer>
    </div>
  );
};

window.DirectionA = DirectionA;
