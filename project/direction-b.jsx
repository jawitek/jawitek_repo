// Direction B — Bowl / Street
// Warmer, denser. Real Kanno red & orange brand colors used confidently.

const DirectionB = () => {
  const [lang, setLang] = React.useState('EN');

  const copy = {
    EN: {
      nav: ['About', 'Portfolio', 'Quality', 'Production', 'Contact'],
      strap: 'The art of Asian noodles · Tokyo 1949 → Warsaw',
      heroBig: 'AUTHENTIC',
      heroBig2: 'JAPANESE',
      heroBig3: 'NOODLES.',
      jp: '麺の芸術',
      heroSub: 'A joint venture between the Kanno family — producing Japanese noodles in Tokyo since 1949 — and a Polish family business. Bringing authentic ramen, udon and soba to European kitchens.',
      ticker: ['Authentic Japanese recipes', 'Made in Poland', 'IFS Food certified', 'Three generations', 'Tokyo since 1949', 'EU-wide delivery'],
      sectionStory: '01 — About us',
      storyTitle: 'Three generations of noodle craft. One European production.',
      storyBody1: 'Kanno Noodle is a joint venture between Mr. Yoshio Kanno — head of a Tokyo family business producing Japanese noodles since 1949 — and a Polish family enterprise. The recipe and technique come straight from Tokyo. The factory, logistics and team sit in central Poland.',
      storyBody2: 'The result is genuine Japanese craft, made on EU soil, ready to ship across the continent. Three generations of know-how, one modern facility, one disciplined standard.',
      bigStat: ['1949', 'Family in Tokyo since'],
      bigStat2: ['EU', 'Production · Poland'],
      sectionProcess: '02 — Quality',
      processTitle: 'Japanese recipe. European discipline.',
      steps: [
        { n: '01', title: 'Recipe', kana: 'レシピ', body: 'Authentic formulations from the Kanno family in Tokyo, refined across three generations of noodle-making.' },
        { n: '02', title: 'Sourcing', kana: '原料', body: 'Carefully selected wheat flours and ingredients. Every component traceable, every delivery checked.' },
        { n: '03', title: 'Production', kana: '生産', body: 'A modern facility in central Poland, supervised at every stage by qualified food technologists.' },
        { n: '04', title: 'Standard', kana: '基準', body: 'Certified to IFS Food. Documented procedures, regular audits, full chain-of-custody on every shipment.' }
      ],
      sectionBiz: '03 — Portfolio',
      bizTitle: 'Ramen, udon, soba — and what your kitchen needs next.',
      bizSub: 'The full Japanese noodle range, plus the flexibility to develop bespoke products for restaurants, distributors and food-service partners.',
      bizPoints: [
        { k: '01 · Ramen', t: 'Ramen', body: 'Fresh and dried ramen in multiple gauges. The heart of the Kanno range.' },
        { k: '02 · Udon', t: 'Udon', body: 'Thick wheat noodles with a soft bite, true to the Japanese tradition.' },
        { k: '03 · Soba', t: 'Soba', body: 'Buckwheat noodles, both pure and blended, for cold and hot service.' },
        { k: '04 · Custom', t: 'Bespoke', body: 'Custom recipes, gauges and packaging for B2B partners with specific kitchen needs.' }
      ],
      contactTitle: 'Hungry?',
      contactSub: 'Distributors, restaurants, food-service operators — we answer every inquiry. In English, Polish or Japanese.',
      contactCta: 'Send an inquiry',
      contactCta2: 'Visit production',
      footAddr: ['al. Niepodległości 112', '02-577 Warszawa', 'Poland'],
      footEmail: 'office@kanno.pl',
      footProd: 'Production · central Poland'
    },
    PL: {
      nav: ['O nas', 'Portfolio', 'Jakość', 'Produkcja', 'Kontakt'],
      strap: 'Sztuka azjatyckiego makaronu · Tokio 1949 → Warszawa',
      heroBig: 'AUTENTYCZNY',
      heroBig2: 'JAPOŃSKI',
      heroBig3: 'MAKARON.',
      jp: '麺の芸術',
      heroSub: 'Wspólne przedsięwzięcie rodziny Kanno — produkującej japoński makaron w Tokio od 1949 roku — i polskiej firmy rodzinnej. Autentyczny ramen, udon i soba dla kuchni w całej Europie.',
      ticker: ['Autentyczne japońskie receptury', 'Produkcja w Polsce', 'Certyfikat IFS Food', 'Trzy pokolenia', 'Tokio od 1949', 'Dostawy w całej UE'],
      sectionStory: '01 — O nas',
      storyTitle: 'Trzy pokolenia rzemiosła makaronowego. Jedna europejska produkcja.',
      storyBody1: 'Kanno Noodle to wspólne przedsięwzięcie pana Yoshio Kanno — głowy tokijskiej firmy rodzinnej produkującej japoński makaron od 1949 roku — i polskiego biznesu rodzinnego. Receptura i technika prosto z Tokio. Zakład, logistyka i zespół — w centralnej Polsce.',
      storyBody2: 'Efekt: autentyczne japońskie rzemiosło, wytwarzane na terenie UE, gotowe do wysyłki po całym kontynencie. Trzy pokolenia know-how, jeden nowoczesny zakład, jeden zdyscyplinowany standard.',
      bigStat: ['1949', 'Rodzina w Tokio od'],
      bigStat2: ['UE', 'Produkcja · Polska'],
      sectionProcess: '02 — Jakość',
      processTitle: 'Japońska receptura. Europejska dyscyplina.',
      steps: [
        { n: '01', title: 'Receptura', kana: 'レシピ', body: 'Autentyczne receptury rodziny Kanno z Tokio, doskonalone przez trzy pokolenia.' },
        { n: '02', title: 'Surowce', kana: '原料', body: 'Starannie dobrane mąki i składniki. Każdy element identyfikowalny, każda dostawa sprawdzona.' },
        { n: '03', title: 'Produkcja', kana: '生産', body: 'Nowoczesny zakład w centralnej Polsce, na każdym etapie pod nadzorem wykwalifikowanych technologów.' },
        { n: '04', title: 'Standard', kana: '基準', body: 'Certyfikat IFS Food. Udokumentowane procedury, regularne audyty, pełna identyfikowalność każdej wysyłki.' }
      ],
      sectionBiz: '03 — Portfolio',
      bizTitle: 'Ramen, udon, soba — i to, czego potrzebuje Twoja kuchnia.',
      bizSub: 'Pełna gama japońskich makaronów oraz elastyczność tworzenia produktów na zamówienie dla restauracji, dystrybutorów i partnerów food-service.',
      bizPoints: [
        { k: '01 · Ramen', t: 'Ramen', body: 'Świeży i suszony ramen w wielu grubościach. Serce oferty Kanno.' },
        { k: '02 · Udon', t: 'Udon', body: 'Grube makarony pszenne o miękkim gryzie, wierne japońskiej tradycji.' },
        { k: '03 · Soba', t: 'Soba', body: 'Makarony gryczane, czyste i mieszane, do dań ciepłych i zimnych.' },
        { k: '04 · Na zamówienie', t: 'Bespoke', body: 'Receptury, grubości i opakowania szyte pod wymagania partnerów B2B.' }
      ],
      contactTitle: 'Głodni?',
      contactSub: 'Dystrybutorzy, restauracje, food-service — odpowiadamy na każde zapytanie. Po polsku, angielsku albo japońsku.',
      contactCta: 'Wyślij zapytanie',
      contactCta2: 'Odwiedź produkcję',
      footAddr: ['al. Niepodległości 112', '02-577 Warszawa', 'Polska'],
      footEmail: 'office@kanno.pl',
      footProd: 'Produkcja · centralna Polska'
    },
    JP: {
      nav: ['会社概要', '製品', '品質', '工場', 'お問合せ'],
      strap: 'アジア麺の芸術 · 東京 1949 → ワルシャワ',
      heroBig: '本物の',
      heroBig2: '日本の',
      heroBig3: '麺。',
      jp: 'NOODLES BY KANNO',
      heroSub: '1949年から東京で日本の麺を製造する菅野家と、ポーランドの家族企業によるジョイント・ベンチャー。本格的なラーメン、うどん、蕎麦をヨーロッパの厨房へ。',
      ticker: ['本格的な日本のレシピ', 'ポーランドで生産', 'IFS Food認証', '三代続く家業', '東京 1949年から', 'EU全域配送'],
      sectionStory: '01 — 会社概要',
      storyTitle: '三代続く製麺の技。一つの欧州生産拠点。',
      storyBody1: 'Kanno Noodleは、1949年から日本の麺を製造する東京の菅野家を率いる菅野義雄氏と、ポーランドの家族経営企業によるジョイント・ベンチャーです。レシピと技術は東京から。工場、物流、チームはポーランド中部に。',
      storyBody2: '結果として——EU圏内で作られる本物の日本の麺づくり、欧州全域への発送に対応。三代の知見、一つの近代工場、一つの規律。',
      bigStat: ['1949', '東京で創業以来'],
      bigStat2: ['EU', '生産 · ポーランド'],
      sectionProcess: '02 — 品質',
      processTitle: '日本のレシピ、欧州の規律。',
      steps: [
        { n: '01', title: 'レシピ', kana: 'Recipe', body: '東京の菅野家による本格レシピ。三代にわたり磨かれた製麺技術。' },
        { n: '02', title: '原料', kana: 'Sourcing', body: '厳選された小麦粉と原材料。すべて追跡可能、すべての納品を検査。' },
        { n: '03', title: '生産', kana: 'Production', body: 'ポーランド中部の近代工場。各工程で有資格の食品技術者が監督。' },
        { n: '04', title: '基準', kana: 'Standard', body: 'IFS Food認証。文書化された手順、定期監査、全出荷の完全な追跡。' }
      ],
      sectionBiz: '03 — 製品',
      bizTitle: 'ラーメン、うどん、蕎麦——そして厨房の次の一手。',
      bizSub: '日本の麺の全レンジに加え、レストラン、卸、業務用パートナー向け特注品の柔軟な開発。',
      bizPoints: [
        { k: '01 · ラーメン', t: 'Ramen', body: '生・乾燥ラーメンを複数の太さで。Kannoの中核。' },
        { k: '02 · うどん', t: 'Udon', body: '日本の伝統に忠実な、コシのある太麺。' },
        { k: '03 · 蕎麦', t: 'Soba', body: '純粋・ブレンド両方の蕎麦。冷温両方のサービスに。' },
        { k: '04 · 特注', t: 'Bespoke', body: '業務用パートナーの厨房に合わせた、レシピ・太さ・包装のカスタム対応。' }
      ],
      contactTitle: 'お腹空いた？',
      contactSub: '卸、レストラン、業務用事業者——すべてのお問い合わせにお答えします。日本語・英語・ポーランド語で。',
      contactCta: '問合せを送る',
      contactCta2: '工場見学',
      footAddr: ['al. Niepodległości 112', '02-577 ワルシャワ', 'ポーランド'],
      footEmail: 'office@kanno.pl',
      footProd: '生産 · ポーランド中部'
    }
  };
  const t = copy[lang];

  return (
    <div className="dirB">
      <style>{`
        .dirB { --bg:#fffaf0; --bg-2:#fdf3dc; --ink:#161310; --ink-2:#3a2f24; --red:#E2231A; --orange:#F39200; --line:rgba(22,19,16,0.14); font-family: 'Inter', 'Helvetica Neue', sans-serif; color: var(--ink); background: var(--bg); min-height:100%; overflow:hidden; }
        .dirB *, .dirB *::before, .dirB *::after { box-sizing: border-box; }
        .dirB .display { font-family: 'Bricolage Grotesque', 'Inter', sans-serif; font-weight: 800; letter-spacing: -0.045em; }
        .dirB .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.06em; text-transform: uppercase; font-size: 11px; }
        .dirB .jp { font-family: 'Shippori Mincho', 'Noto Serif JP', serif; }

        .dirB .nav { position: sticky; top:0; z-index:50; background: var(--bg); border-bottom: 1px solid var(--line); }
        .dirB .nav-inner { display:flex; align-items:center; justify-content:space-between; padding: 14px 40px; gap: 24px; }
        .dirB .logo { height: 44px; display:block; }
        .dirB .logo img { height: 100%; width: auto; display: block; }
        .dirB .nav-links { display:flex; gap: 28px; }
        .dirB .nav-links a { color: var(--ink); text-decoration:none; font-size: 13.5px; font-weight: 500; }
        .dirB .nav-links a:hover { color: var(--red); }
        .dirB .lang { display:flex; gap:4px; }
        .dirB .lang button { background: transparent; border:1px solid var(--line); padding: 7px 11px; font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; color: var(--ink); cursor:pointer; border-radius: 6px; }
        .dirB .lang button.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }

        .dirB section { padding: 0 40px; }

        .dirB .strap { display:flex; justify-content:space-between; align-items:center; padding: 10px 40px; background: var(--ink); color: var(--bg); font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.25em; text-transform: uppercase; }
        .dirB .strap .dot { width:6px; height:6px; border-radius: 50%; background: var(--red); display:inline-block; margin-right: 8px; vertical-align: middle; animation: dirBpulse 2s infinite; }
        @keyframes dirBpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .dirB .hero { padding-top: 48px; padding-bottom: 32px; position: relative; }
        .dirB .hero-grid { display:grid; grid-template-columns: 1fr 380px; gap: 32px; }
        .dirB .hero-mega h1 { font-size: clamp(96px, 15vw, 240px); line-height: 0.86; margin: 0; }
        .dirB .hero-mega .row1 { display:flex; align-items: flex-start; gap: 20px; }
        .dirB .hero-mega .row2 { display:flex; align-items: center; gap: 24px; }
        .dirB .hero-mega .stamp { display:inline-flex; align-items:center; gap:8px; background: var(--red); color: #fff; padding: 8px 14px; border-radius: 999px; font-size: 11px; font-family:'JetBrains Mono', monospace; letter-spacing: 0.18em; text-transform: uppercase; align-self: center; transform: translateY(20px) rotate(-3deg); white-space:nowrap; }
        .dirB .hero-mega .row3 { display:flex; align-items:flex-end; gap: 24px; }
        .dirB .hero-mega .red { color: var(--red); }
        .dirB .hero-mega .orange { color: var(--orange); }
        .dirB .hero-mega .jp-vert { writing-mode: vertical-rl; font-size: 18px; letter-spacing: 0.4em; color: var(--ink); opacity: .65; padding-bottom: 8px; }
        .dirB .hero-img { aspect-ratio: 3/4; }
        .dirB .placeholder { background:
          repeating-linear-gradient(135deg, rgba(22,19,16,0.07) 0 1px, transparent 1px 12px),
          var(--bg-2);
          border: 1px solid var(--line);
          color: var(--ink-2);
          font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          display:flex; align-items:flex-end; padding: 12px;
          position:relative; overflow:hidden; border-radius: 10px;
        }
        .dirB .placeholder .tag { background: var(--ink); color: var(--bg); padding: 4px 8px; border-radius: 4px; }

        .dirB .hero-meta { display:grid; grid-template-rows: auto 1fr auto; gap: 16px; }
        .dirB .hero-meta p { font-size: 15.5px; line-height: 1.6; max-width: 40ch; margin:0; color: var(--ink-2); font-weight: 400; }
        .dirB .ctas { display:flex; gap: 8px; flex-wrap:wrap; }
        .dirB .btn { font-family:'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 12px 18px; border-radius: 10px; border: 1.5px solid var(--ink); background: var(--ink); color: var(--bg); text-decoration:none; cursor:pointer; display:inline-flex; align-items:center; gap: 8px; }
        .dirB .btn.red { background: var(--red); border-color: var(--red); color: #fff; }
        .dirB .btn.ghost { background: transparent; color: var(--ink); }
        .dirB .btn:hover { transform: translateY(-1px); }

        .dirB .ticker { background: var(--red); color: #fff; padding: 14px 0; overflow:hidden; border-top: 2px solid var(--ink); border-bottom: 2px solid var(--ink); }
        .dirB .ticker-track { display:flex; gap: 32px; white-space:nowrap; animation: dirBticker 35s linear infinite; }
        .dirB .ticker-track span { font-family:'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.01em; }
        .dirB .ticker-track span::after { content:'●'; margin-left: 32px; color: var(--orange); font-size: 14px; vertical-align: middle; }
        @keyframes dirBticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .dirB .story { padding-top: 80px; padding-bottom: 80px; }
        .dirB .story-grid { display:grid; grid-template-columns: 360px 1fr 1fr; gap: 32px; align-items: start; }
        .dirB .story-grid .lbl { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--red); }
        .dirB .story-headline { grid-column: 2 / -1; }
        .dirB .story-headline h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.5vw, 84px); letter-spacing: -0.04em; line-height: 0.95; margin: 0 0 28px; }
        .dirB .story-img { aspect-ratio: 3/4; grid-row: span 2; }
        .dirB .story-cols { display:grid; grid-template-columns: 1fr 1fr; gap: 28px; grid-column: 2 / -1; }
        .dirB .story-cols p { font-size: 15.5px; line-height: 1.65; color: var(--ink-2); margin: 0; }

        .dirB .stats { display:grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 56px 0 0; }
        .dirB .stat { background: var(--ink); color: var(--bg); padding: 32px; border-radius: 14px; display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: end; }
        .dirB .stat:first-child { background: var(--red); }
        .dirB .stat:last-child { background: var(--orange); color: var(--ink); }
        .dirB .stat .big { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 110px; letter-spacing: -0.05em; line-height: 0.85; }
        .dirB .stat .lbl { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; opacity: .85; max-width: 16ch; padding-bottom: 14px; }

        .dirB .process { padding-top: 80px; padding-bottom: 80px; background: var(--ink); color: var(--bg); margin: 0 -40px; padding-left: 40px; padding-right: 40px; }
        .dirB .process-head { display:flex; justify-content: space-between; align-items: end; margin-bottom: 40px; gap: 32px; }
        .dirB .process-head .lbl { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; opacity: .6; }
        .dirB .process-head h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.5vw, 84px); letter-spacing: -0.04em; line-height: 0.95; margin: 0; max-width: 18ch; }
        .dirB .process-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .dirB .step { background: rgba(255,255,255,0.04); border: 1px solid rgba(251,250,247,0.12); border-radius: 14px; padding: 24px; transition: all .25s ease; cursor: default; }
        .dirB .step:hover { background: var(--red); border-color: var(--red); }
        .dirB .step:nth-child(2):hover { background: var(--orange); border-color: var(--orange); color: var(--ink); }
        .dirB .step .head { display:flex; justify-content:space-between; align-items: baseline; margin-bottom: 16px; }
        .dirB .step .n { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; opacity: .6; }
        .dirB .step .kana { font-family:'Shippori Mincho', serif; font-size: 22px; opacity: .9; }
        .dirB .step h3 { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 36px; letter-spacing: -0.03em; margin: 0 0 12px; }
        .dirB .step p { font-size: 13.5px; line-height: 1.55; opacity: .82; margin: 0 0 20px; }
        .dirB .step .img { aspect-ratio: 4/3; background:
          repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 10px),
          rgba(255,255,255,0.04);
          border-radius: 8px; padding: 10px; display:flex; align-items:flex-end;
          font-family:'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; opacity: .7;
        }

        .dirB .biz { padding-top: 80px; padding-bottom: 80px; }
        .dirB .biz-head { display:grid; grid-template-columns: 360px 1fr; gap: 32px; align-items: start; margin-bottom: 40px; }
        .dirB .biz-head .lbl { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--red); }
        .dirB .biz-head h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.5vw, 84px); letter-spacing: -0.04em; line-height: 0.95; margin: 0; }
        .dirB .biz-head p { margin: 0 0 0 auto; max-width: 38ch; font-size: 16px; line-height: 1.55; color: var(--ink-2); align-self: end; }
        .dirB .biz-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .dirB .biz-card { background: var(--bg-2); border: 1px solid var(--line); border-radius: 14px; padding: 24px; min-height: 240px; display:flex; flex-direction: column; gap: 10px; transition: all .25s ease; }
        .dirB .biz-card:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
        .dirB .biz-card:nth-child(1):hover { background: var(--red); border-color: var(--red); color:#fff; }
        .dirB .biz-card:nth-child(2):hover { background: var(--orange); border-color: var(--orange); color: var(--ink); }
        .dirB .biz-card .k { font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.25em; text-transform: uppercase; opacity: .6; }
        .dirB .biz-card .t { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -0.03em; line-height: 1; margin-top: auto; }
        .dirB .biz-card p { font-size: 13.5px; line-height: 1.5; margin: 4px 0 0; }

        .dirB .contact { padding-top: 100px; padding-bottom: 80px; background: var(--red); color: #fff; margin: 0 -40px; padding-left: 40px; padding-right: 40px; position: relative; overflow: hidden; }
        .dirB .contact h2 { font-family:'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(80px, 14vw, 240px); letter-spacing: -0.05em; line-height: 0.85; margin: 0; }
        .dirB .contact .row { display:grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; position: relative; z-index: 1; }
        .dirB .contact p { font-size: 17px; line-height: 1.55; max-width: 38ch; margin: 0 0 20px; opacity: .92; }
        .dirB .contact .ctas { display:flex; gap: 8px; flex-wrap: wrap; }
        .dirB .contact .ctas .btn { background: #fff; color: var(--red); border-color: #fff; }
        .dirB .contact .ctas .btn.ghost { background: transparent; color: #fff; border-color: #fff; }
        .dirB .contact .jp-bg { position: absolute; right: -20px; top: -40px; font-family:'Shippori Mincho', serif; font-size: 360px; opacity: .12; line-height: 1; user-select: none; pointer-events: none; color: var(--orange); }

        .dirB .foot { background: var(--ink); color: var(--bg); padding: 40px; display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; }
        .dirB .foot h5 { font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; opacity: .5; margin: 0 0 10px; font-weight: 400; }
        .dirB .foot p, .dirB .foot a { font-size: 14px; line-height: 1.6; color: var(--bg); margin: 0; text-decoration: none; opacity: .9; }
        .dirB .foot a:hover { color: var(--orange); }
        .dirB .foot .meta { font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; opacity: .5; }
        .dirB .foot .logo-wrap img { filter: invert(1) brightness(1.15); }

        .dirB ::selection { background: var(--ink); color: var(--bg); }
      `}</style>

      <div className="strap">
        <span><span className="dot" />{t.strap}</span>
        <span>EN · PL · JP</span>
      </div>

      <header className="nav">
        <div className="nav-inner">
          <a href="#" className="logo"><img src="assets/kanno-logo.png" alt="Kanno Noodle" /></a>
          <nav className="nav-links">
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
          <div className="hero-mega">
            <div className="row1">
              <h1 className="display">{t.heroBig}</h1>
              <span className="stamp">⬤ Since 1949 · 1949年から</span>
            </div>
            <div className="row2">
              <h1 className="display red">{t.heroBig2}</h1>
            </div>
            <div className="row3">
              <h1 className="display">{t.heroBig3}</h1>
              <span className="jp-vert jp">{t.jp}</span>
            </div>
          </div>
          <div className="hero-meta">
            <div className="placeholder hero-img"><span className="tag">ramen bowl · macro</span></div>
            <p>{t.heroSub}</p>
            <div className="ctas">
              <a className="btn red" href="#contact">{t.contactCta} →</a>
              <a className="btn ghost" href="#story">↓</a>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].flatMap((_, i) => t.ticker.map((w, j) => <span key={`${i}-${j}`}>{w}</span>))}
        </div>
      </div>

      <section className="story" id="story">
        <div className="story-grid">
          <div className="placeholder story-img"><span className="tag">production · vertical</span></div>
          <div className="story-headline">
            <div className="lbl" style={{marginBottom: 20}}>{t.sectionStory}</div>
            <h2>{t.storyTitle}</h2>
          </div>
          <div className="story-cols">
            <p>{t.storyBody1}</p>
            <p>{t.storyBody2}</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="big">{t.bigStat[0]}</div>
            <div className="lbl">{t.bigStat[1]}</div>
          </div>
          <div className="stat">
            <div className="big">{t.bigStat2[0]}</div>
            <div className="lbl">{t.bigStat2[1]}</div>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="process-head">
          <div>
            <div className="lbl" style={{marginBottom: 16}}>{t.sectionProcess}</div>
            <h2>{t.processTitle}</h2>
          </div>
          <div className="mono" style={{opacity:.6, paddingBottom: 16}}>IFS Food certified</div>
        </div>
        <div className="process-grid">
          {t.steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="head">
                <span className="n">{s.n}</span>
                <span className="kana jp">{s.kana}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="img">{s.title} · photo</div>
            </div>
          ))}
        </div>
      </section>

      <section className="biz">
        <div className="biz-head">
          <div>
            <div className="lbl" style={{marginBottom: 20}}>{t.sectionBiz}</div>
            <h2>{t.bizTitle}</h2>
          </div>
          <p>{t.bizSub}</p>
        </div>
        <div className="biz-grid">
          {t.bizPoints.map((p, i) => (
            <div className="biz-card" key={i}>
              <span className="k">{p.k}</span>
              <p>{p.body}</p>
              <div className="t">{p.t}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="jp-bg jp">麺</div>
        <div className="row">
          <h2>{t.contactTitle}</h2>
          <div>
            <p>{t.contactSub}</p>
            <div className="ctas">
              <a className="btn" href="mailto:office@kanno.pl">{t.contactCta} →</a>
              <a className="btn ghost" href="#">{t.contactCta2}</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div>
          <div className="logo-wrap" style={{marginBottom: 16}}>
            <img src="assets/kanno-logo.png" alt="Kanno Noodle" style={{height: 36, display:'block'}}/>
          </div>
          <p style={{maxWidth:'34ch', opacity:.7}}>The art of Asian noodles. Authentic Japanese craft, made in Poland.</p>
          <p className="meta" style={{marginTop: 16}}>© Kanno Noodle Sp. z o.o. 2026</p>
        </div>
        <div>
          <h5>{lang === 'PL' ? 'Adres' : lang === 'JP' ? '所在地' : 'Address'}</h5>
          <p>{t.footAddr.map((l, i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}</p>
          <p style={{marginTop: 8, opacity: .6}}>{t.footProd}</p>
        </div>
        <div>
          <h5>{lang === 'PL' ? 'Kontakt' : lang === 'JP' ? '連絡先' : 'Contact'}</h5>
          <p><a href="mailto:office@kanno.pl">{t.footEmail}</a></p>
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

window.DirectionB = DirectionB;
