/* LingaRoo — dane: paleta, grafiki SVG rysowane w kodzie, pakiety słów.
 * Wszystkie grafiki są stringami SVG — brak plików graficznych to decyzja:
 * nic nie może się nie wczytać, a paleta jest spójna, bo kolory są stałymi. */

const PAL = {
  cream:  '#F7F2EA',
  paper:  '#FDFBF7',
  card:   '#FBF7EF',
  woodHi: '#F3E4CC',
  wood:   '#EADBC8',
  board:  '#46564C',
  boardTxt: '#D9CFB8',
  ink:    '#2D3142',
  brown:  '#7A6A54',
  sage:   '#7A9A8B',
  sageHi: '#8CAB9C',
  terra:  '#D98A6C',
  terraHi:'#E7A98A',
  fur:    '#C9975F',
  furDark:'#B98255',
  furDeep:'#8B5E45',
  belly:  '#EFE0D2',
};

/* ── LingaRoo (kangur) ── */

const ROO_HEAD_SVG = `<svg viewBox="0 0 100 100">
  <circle cx="46" cy="52" r="30" fill="#C9975F"/>
  <polygon points="58,30 64,2 82,26" fill="#C9975F"/>
  <polygon points="63,22 66,10 76,22" fill="#EFE0D2"/>
  <ellipse cx="16" cy="60" rx="17" ry="12" fill="#C9975F"/>
  <ellipse cx="4" cy="60" rx="5" ry="4" fill="#2D3142"/>
  <circle cx="40" cy="44" r="5" fill="#2D3142"/>
  <polygon points="26,78 54,66 44,98" fill="#7A9A8B"/>
</svg>`;

/* Kangur w podskoku (znacznik na ścieżce postępu) */
const ROO_SVG = `<svg viewBox="0 0 100 100">
  <path d="M32 66 Q12 74 10 92 Q22 90 32 78 Z" fill="#B98255"/>
  <ellipse cx="50" cy="60" rx="23" ry="28" fill="#C9975F"/>
  <ellipse cx="52" cy="64" rx="13" ry="16" fill="#EFE0D2"/>
  <rect x="55" y="80" width="15" height="16" rx="6" fill="#B98255"/>
  <ellipse cx="70" cy="96" rx="17" ry="7" fill="#8B5E45"/>
  <ellipse cx="66" cy="58" rx="6" ry="11" fill="#C9975F"/>
  <rect x="71" y="62" width="13" height="5" rx="2.5" fill="#EFE0D2" transform="rotate(12 78 64)"/>
  <polygon points="48,40 62,36 56,54" fill="#7A9A8B"/>
  <circle cx="60" cy="34" r="15" fill="#C9975F"/>
  <polygon points="54,20 57,2 66,16" fill="#C9975F"/>
  <polygon points="57,15 58,7 63,15" fill="#EFE0D2"/>
  <ellipse cx="78" cy="38" rx="10" ry="7" fill="#C9975F"/>
  <ellipse cx="90" cy="38" rx="3.4" ry="2.8" fill="#2D3142"/>
  <circle cx="64" cy="30" r="2.4" fill="#2D3142"/>
</svg>`;

/* LingaRoo-nauczyciel: okulary, chusta, zwrócony w lewo (do tablicy) */
const TEACHER_SVG = `<svg viewBox="0 0 100 100">
  <path d="M68 66 Q88 74 90 92 Q78 90 68 78 Z" fill="#B98255"/>
  <ellipse cx="50" cy="60" rx="23" ry="28" fill="#C9975F"/>
  <ellipse cx="48" cy="64" rx="13" ry="16" fill="#EFE0D2"/>
  <rect x="30" y="80" width="15" height="16" rx="6" fill="#B98255"/>
  <ellipse cx="30" cy="96" rx="17" ry="7" fill="#8B5E45"/>
  <ellipse cx="34" cy="58" rx="6" ry="11" fill="#C9975F"/>
  <rect x="16" y="62" width="13" height="5" rx="2.5" fill="#FDFBF7" transform="rotate(-12 22 64)"/>
  <polygon points="52,40 38,36 44,54" fill="#7A9A8B"/>
  <circle cx="40" cy="34" r="15" fill="#C9975F"/>
  <polygon points="46,20 43,2 34,16" fill="#C9975F"/>
  <polygon points="43,15 42,7 37,15" fill="#EFE0D2"/>
  <ellipse cx="22" cy="38" rx="10" ry="7" fill="#C9975F"/>
  <ellipse cx="10" cy="38" rx="3.4" ry="2.8" fill="#2D3142"/>
  <circle cx="36" cy="30" r="2.4" fill="#2D3142"/>
  <circle cx="36" cy="30" r="5" fill="none" stroke="#2D3142" stroke-width="2"/>
  <line x1="41" y1="29" x2="46" y2="25" stroke="#2D3142" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

/* ── Ikony ścieżki postępu (5 kamieni milowych sesji) ── */
const TRACK_ICONS = [
  c => `<svg viewBox="0 0 24 24"><path d="M12 3c5 3 7 7 7 11a7 7 0 1 1-14 0c0-4 2-8 7-11Z" fill="${c}"/></svg>`,
  c => `<svg viewBox="0 0 24 24"><path d="M12 10c3 0 5 3 5 6.5S15 21 12 21s-5-2.5-5-4.5S9 10 12 10Z" fill="${c}"/><path d="M6.5 10c0-2.5 2.5-4.5 5.5-4.5s5.5 2 5.5 4.5c-2 1.3-9 1.3-11 0Z" fill="${c}" opacity="0.7"/></svg>`,
  c => `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="5" ry="6" fill="${c}"/><circle cx="7" cy="7" r="2" fill="${c}"/><circle cx="12" cy="5" r="2" fill="${c}"/><circle cx="17" cy="7" r="2" fill="${c}"/></svg>`,
  c => `<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.6L22 9l-5.5 4.6L18 21l-6-3.8L6 21l1.5-7.4L2 9l7.4-.4Z" fill="${c}"/></svg>`,
  c => `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="2" height="18" rx="1" fill="${c}"/><path d="M7 4h11l-3 4 3 4H7Z" fill="${c}" opacity="0.85"/></svg>`,
];

/* ── Zwierzęta ── */

const SVG_OWL = `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="26" ry="24" fill="#9B7C56"/><circle cx="50" cy="42" r="27" fill="#AE8E63"/><polygon points="30,20 36,5 42,22" fill="#AE8E63"/><polygon points="58,22 64,5 70,20" fill="#AE8E63"/><circle cx="38" cy="40" r="12" fill="#FDFBF7"/><circle cx="62" cy="40" r="12" fill="#FDFBF7"/><circle cx="38" cy="40" r="6" fill="#2D3142"/><circle cx="62" cy="40" r="6" fill="#2D3142"/><polygon points="50,50 45,60 55,60" fill="#D98A6C"/></svg>`;

const SVG_BEAR = `<svg viewBox="0 0 100 100"><ellipse cx="44" cy="58" rx="33" ry="21" fill="#8B6A48"/><circle cx="82" cy="44" r="18" fill="#8B6A48"/><circle cx="71" cy="28" r="6.5" fill="#8B6A48"/><circle cx="88" cy="26" r="6.5" fill="#8B6A48"/><circle cx="71" cy="28" r="3" fill="#6E5138"/><circle cx="88" cy="26" r="3" fill="#6E5138"/><ellipse cx="93" cy="50" rx="9" ry="7" fill="#E7D9C4"/><circle cx="99" cy="49" r="2.6" fill="#2D3142"/><circle cx="84" cy="40" r="2.3" fill="#2D3142"/><rect x="20" y="70" width="11" height="19" rx="4" fill="#6E5138"/><rect x="52" y="73" width="11" height="18" rx="4" fill="#6E5138"/><circle cx="12" cy="58" r="6" fill="#8B6A48"/></svg>`;

const SVG_FOX = `<svg viewBox="0 0 100 100"><path d="M18 62Q-4 50 6 24Q14 8 28 18Q22 34 26 48Q28 55 20 60Z" fill="#D08251"/><ellipse cx="12" cy="24" rx="7" ry="9" fill="#FDFBF7"/><ellipse cx="44" cy="62" rx="30" ry="19" fill="#D08251"/><circle cx="78" cy="46" r="17" fill="#D08251"/><polygon points="66,33 71,15 79,31" fill="#D08251"/><polygon points="69,29 72,18 76,29" fill="#2D3142"/><polygon points="79,31 87,14 92,32" fill="#D08251"/><polygon points="81,29 87,18 88,30" fill="#2D3142"/><ellipse cx="90" cy="51" rx="9" ry="6" fill="#FDFBF7"/><circle cx="97" cy="50" r="2.6" fill="#2D3142"/><circle cx="81" cy="42" r="2.3" fill="#2D3142"/><rect x="26" y="72" width="8" height="17" rx="3" fill="#2D3142"/><rect x="54" y="74" width="8" height="16" rx="3" fill="#2D3142"/></svg>`;

const SVG_CAT = `<svg viewBox="0 0 100 100">
  <path d="M74 72 Q94 66 92 46" stroke="#A5937E" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="70" rx="26" ry="21" fill="#A5937E"/>
  <circle cx="50" cy="38" r="20" fill="#A5937E"/>
  <polygon points="34,28 30,8 47,18" fill="#A5937E"/>
  <polygon points="66,28 70,8 53,18" fill="#A5937E"/>
  <polygon points="36,24 34,13 43,19" fill="#EFE0D2"/>
  <polygon points="64,24 66,13 57,19" fill="#EFE0D2"/>
  <circle cx="43" cy="36" r="2.8" fill="#2D3142"/>
  <circle cx="57" cy="36" r="2.8" fill="#2D3142"/>
  <polygon points="50,43 46,47 54,47" fill="#D98A6C"/>
  <line x1="30" y1="42" x2="16" y2="40" stroke="#2D3142" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="30" y1="46" x2="17" y2="48" stroke="#2D3142" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="70" y1="42" x2="84" y2="40" stroke="#2D3142" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="70" y1="46" x2="83" y2="48" stroke="#2D3142" stroke-width="1.4" stroke-linecap="round"/>
  <ellipse cx="38" cy="88" rx="8" ry="5" fill="#8F7D68"/>
  <ellipse cx="62" cy="88" rx="8" ry="5" fill="#8F7D68"/>
</svg>`;

const SVG_DOG = `<svg viewBox="0 0 100 100">
  <path d="M22 66 Q8 60 12 48" stroke="#B98255" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="68" rx="27" ry="20" fill="#B98255"/>
  <circle cx="70" cy="42" r="19" fill="#B98255"/>
  <ellipse cx="56" cy="34" rx="7" ry="14" fill="#8B5E45" transform="rotate(18 56 34)"/>
  <ellipse cx="84" cy="34" rx="7" ry="14" fill="#8B5E45" transform="rotate(-18 84 34)"/>
  <ellipse cx="74" cy="50" rx="11" ry="8" fill="#EFE0D2"/>
  <circle cx="80" cy="47" r="3.4" fill="#2D3142"/>
  <circle cx="66" cy="38" r="2.6" fill="#2D3142"/>
  <rect x="30" y="80" width="10" height="12" rx="4" fill="#8B5E45"/>
  <rect x="54" y="80" width="10" height="12" rx="4" fill="#8B5E45"/>
</svg>`;

const SVG_RABBIT = `<svg viewBox="0 0 100 100">
  <circle cx="26" cy="72" r="7" fill="#FDFBF7"/>
  <ellipse cx="50" cy="72" rx="24" ry="19" fill="#BCAB94"/>
  <circle cx="52" cy="44" r="16" fill="#BCAB94"/>
  <ellipse cx="44" cy="16" rx="6.5" ry="17" fill="#BCAB94" transform="rotate(-10 44 16)"/>
  <ellipse cx="60" cy="16" rx="6.5" ry="17" fill="#BCAB94" transform="rotate(10 60 16)"/>
  <ellipse cx="44" cy="17" rx="3" ry="11" fill="#E7CFC5" transform="rotate(-10 44 17)"/>
  <ellipse cx="60" cy="17" rx="3" ry="11" fill="#E7CFC5" transform="rotate(10 60 17)"/>
  <circle cx="47" cy="43" r="2.7" fill="#2D3142"/>
  <circle cx="59" cy="43" r="2.7" fill="#2D3142"/>
  <polygon points="53,49 50,52 56,52" fill="#D9A5A0"/>
  <ellipse cx="42" cy="89" rx="9" ry="4.5" fill="#A5937E"/>
  <ellipse cx="62" cy="89" rx="9" ry="4.5" fill="#A5937E"/>
</svg>`;

/* ── Owoce ── */

const SVG_APPLE = `<svg viewBox="0 0 100 100">
  <path d="M50 30 C30 18 12 34 16 58 C19 78 34 90 50 88 C66 90 81 78 84 58 C88 34 70 18 50 30Z" fill="#C96B5A"/>
  <rect x="47" y="12" width="6" height="16" rx="3" fill="#8B5E45"/>
  <path d="M53 18 Q68 8 76 20 Q64 28 53 18Z" fill="#7A9A8B"/>
  <ellipse cx="34" cy="46" rx="6" ry="10" fill="#FDFBF7" opacity="0.25" transform="rotate(-18 34 46)"/>
</svg>`;

const SVG_BANANA = `<svg viewBox="0 0 100 100">
  <path d="M18 26 C14 58 38 84 74 82 L80 90 C40 98 4 66 10 24Z" fill="#D9B36C"/>
  <path d="M18 26 C24 52 44 72 74 82 C42 78 20 56 12 28Z" fill="#C79E52"/>
  <rect x="12" y="18" width="10" height="10" rx="3" fill="#8B5E45"/>
  <ellipse cx="79" cy="87" rx="4" ry="3" fill="#6E5138"/>
</svg>`;

const SVG_PEAR = `<svg viewBox="0 0 100 100">
  <path d="M50 26 C56 26 58 34 62 44 C74 52 78 62 76 72 C73 86 62 92 50 92 C38 92 27 86 24 72 C22 62 26 52 38 44 C42 34 44 26 50 26Z" fill="#A8A868"/>
  <path d="M50 26 Q48 14 40 10" stroke="#8B5E45" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M50 16 Q62 6 70 16 Q60 24 50 16Z" fill="#7A9A8B"/>
  <ellipse cx="38" cy="66" rx="6" ry="10" fill="#FDFBF7" opacity="0.22" transform="rotate(-14 38 66)"/>
</svg>`;

const SVG_STRAWBERRY = `<svg viewBox="0 0 100 100">
  <path d="M50 92 C30 82 18 64 20 44 Q35 34 50 36 Q65 34 80 44 C82 64 70 82 50 92Z" fill="#B85C5C"/>
  <path d="M50 22 L58 30 L70 28 L64 38 L72 46 L58 46 L50 56 L42 46 L28 46 L36 38 L30 28 L42 30Z" fill="#7A9A8B"/>
  <rect x="47" y="12" width="6" height="12" rx="3" fill="#8B5E45"/>
  <circle cx="40" cy="54" r="2" fill="#FDFBF7"/><circle cx="56" cy="52" r="2" fill="#FDFBF7"/>
  <circle cx="48" cy="66" r="2" fill="#FDFBF7"/><circle cx="62" cy="64" r="2" fill="#FDFBF7"/>
  <circle cx="36" cy="66" r="2" fill="#FDFBF7"/><circle cx="52" cy="78" r="2" fill="#FDFBF7"/>
</svg>`;

const SVG_ORANGE = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="58" r="34" fill="#D08251"/>
  <rect x="47" y="16" width="6" height="12" rx="3" fill="#8B5E45"/>
  <path d="M53 22 Q66 12 74 22 Q63 30 53 22Z" fill="#7A9A8B"/>
  <ellipse cx="38" cy="46" rx="7" ry="10" fill="#FDFBF7" opacity="0.25" transform="rotate(-20 38 46)"/>
  <circle cx="50" cy="58" r="34" fill="none" stroke="#B96F42" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round"/>
</svg>`;

const SVG_CHERRY = `<svg viewBox="0 0 100 100">
  <path d="M36 62 Q40 32 58 14" stroke="#7A9A8B" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M68 58 Q62 34 58 14" stroke="#7A9A8B" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M58 14 Q70 4 80 12 Q70 22 58 14Z" fill="#7A9A8B"/>
  <circle cx="34" cy="72" r="15" fill="#A34F4F"/>
  <circle cx="68" cy="70" r="15" fill="#B85C5C"/>
  <ellipse cx="29" cy="66" rx="4" ry="6" fill="#FDFBF7" opacity="0.28" transform="rotate(-16 29 66)"/>
  <ellipse cx="63" cy="64" rx="4" ry="6" fill="#FDFBF7" opacity="0.28" transform="rotate(-16 63 64)"/>
</svg>`;

/* ── Kolory: tabliczka jak szpulka barwna Montessori ── */
function colorTabletSvg(hex) {
  return `<svg viewBox="0 0 100 100">
    <rect x="8" y="30" width="12" height="40" rx="4" fill="#EADBC8"/>
    <rect x="80" y="30" width="12" height="40" rx="4" fill="#EADBC8"/>
    <rect x="18" y="34" width="64" height="32" rx="6" fill="${hex}"/>
    <rect x="18" y="34" width="64" height="10" rx="5" fill="#FDFBF7" opacity="0.18"/>
  </svg>`;
}

/* ── Pary ── */

const SVG_BONE = `<svg viewBox="0 0 100 100">
  <rect x="30" y="42" width="40" height="16" rx="8" fill="#E9E0D0"/>
  <circle cx="28" cy="40" r="11" fill="#E9E0D0"/><circle cx="28" cy="60" r="11" fill="#E9E0D0"/>
  <circle cx="72" cy="40" r="11" fill="#E9E0D0"/><circle cx="72" cy="60" r="11" fill="#E9E0D0"/>
</svg>`;

const SVG_BIRD = `<svg viewBox="0 0 100 100">
  <path d="M30 84 L36 72 M44 84 L42 72" stroke="#8A7A5F" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="42" cy="56" rx="24" ry="18" fill="#6B8E9F"/>
  <path d="M40 52 Q22 46 14 58 Q28 66 42 60Z" fill="#567483"/>
  <circle cx="64" cy="40" r="13" fill="#6B8E9F"/>
  <polygon points="76,38 90,42 76,46" fill="#D9B36C"/>
  <circle cx="67" cy="37" r="2.4" fill="#2D3142"/>
  <path d="M18 62 Q6 66 4 76 Q14 74 22 68Z" fill="#567483"/>
</svg>`;

const SVG_NEST = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="52" rx="15" ry="11" fill="#FDFBF7" transform="rotate(-8 50 52)"/>
  <ellipse cx="66" cy="54" rx="12" ry="9" fill="#EFE6D8" transform="rotate(10 66 54)"/>
  <path d="M14 56 Q50 44 86 56 L82 74 Q50 86 18 74Z" fill="#8B6A48"/>
  <path d="M16 60 Q50 50 84 60" stroke="#6E5138" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M20 68 Q50 58 80 68" stroke="#6E5138" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M24 76 Q50 68 76 76" stroke="#6E5138" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_BEE = `<svg viewBox="0 0 100 100">
  <ellipse cx="40" cy="34" rx="14" ry="9" fill="#FDFBF7" opacity="0.85" transform="rotate(-24 40 34)"/>
  <ellipse cx="62" cy="32" rx="14" ry="9" fill="#FDFBF7" opacity="0.85" transform="rotate(20 62 32)"/>
  <ellipse cx="52" cy="58" rx="26" ry="19" fill="#D9B36C"/>
  <path d="M44 40 Q40 58 44 76" stroke="#2D3142" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M60 41 Q57 58 60 75" stroke="#2D3142" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="24" cy="52" r="10" fill="#2D3142"/>
  <circle cx="21" cy="49" r="1.8" fill="#FDFBF7"/>
  <path d="M20 44 Q14 38 10 38 M26 42 Q24 34 20 32" stroke="#2D3142" stroke-width="2" fill="none" stroke-linecap="round"/>
  <polygon points="78,56 88,58 78,62" fill="#2D3142"/>
</svg>`;

const SVG_FLOWER = `<svg viewBox="0 0 100 100">
  <path d="M50 58 Q48 78 50 92" stroke="#7A9A8B" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M50 76 Q36 74 30 64 Q44 62 50 72Z" fill="#7A9A8B"/>
  <ellipse cx="50" cy="20" rx="10" ry="13" fill="#D9A5A0"/>
  <ellipse cx="30" cy="34" rx="10" ry="13" fill="#D9A5A0" transform="rotate(-64 30 34)"/>
  <ellipse cx="70" cy="34" rx="10" ry="13" fill="#D9A5A0" transform="rotate(64 70 34)"/>
  <ellipse cx="37" cy="55" rx="10" ry="13" fill="#D9A5A0" transform="rotate(-130 37 55)"/>
  <ellipse cx="63" cy="55" rx="10" ry="13" fill="#D9A5A0" transform="rotate(130 63 55)"/>
  <circle cx="50" cy="40" r="10" fill="#D9B36C"/>
</svg>`;

const SVG_BOAT = `<svg viewBox="0 0 100 100">
  <rect x="49" y="14" width="4" height="42" rx="2" fill="#8B5E45"/>
  <path d="M53 16 L82 52 L53 52Z" fill="#FDFBF7"/>
  <path d="M47 24 L28 52 L47 52Z" fill="#EFE6D8"/>
  <path d="M18 58 L82 58 L70 74 L30 74Z" fill="#B98255"/>
  <path d="M10 82 Q20 76 30 82 Q40 88 50 82 Q60 76 70 82 Q80 88 90 82" stroke="#6B8E9F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_SEA = `<svg viewBox="0 0 100 100">
  <circle cx="76" cy="24" r="12" fill="#D9B36C"/>
  <path d="M8 46 Q18 38 28 46 Q38 54 48 46 Q58 38 68 46 Q78 54 88 46" stroke="#6B8E9F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M8 64 Q18 56 28 64 Q38 72 48 64 Q58 56 68 64 Q78 72 88 64" stroke="#8FB0BE" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M8 82 Q18 74 28 82 Q38 90 48 82 Q58 74 68 82 Q78 90 88 82" stroke="#6B8E9F" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_KEY = `<svg viewBox="0 0 100 100">
  <circle cx="32" cy="36" r="18" fill="none" stroke="#C9975F" stroke-width="10"/>
  <path d="M44 48 L76 80" stroke="#C9975F" stroke-width="10" stroke-linecap="round"/>
  <path d="M64 84 L72 76 M74 74 L84 84" stroke="#C9975F" stroke-width="9" stroke-linecap="round"/>
</svg>`;

const SVG_LOCK = `<svg viewBox="0 0 100 100">
  <path d="M34 44 V32 a16 16 0 0 1 32 0 V44" fill="none" stroke="#8A7A5F" stroke-width="9" stroke-linecap="round"/>
  <rect x="24" y="44" width="52" height="40" rx="10" fill="#C9975F"/>
  <circle cx="50" cy="60" r="6" fill="#2D3142"/>
  <rect x="47" y="62" width="6" height="12" rx="3" fill="#2D3142"/>
</svg>`;

const SVG_SOCK = `<svg viewBox="0 0 100 100">
  <path d="M38 12 H66 V52 Q66 74 48 78 Q28 82 22 68 Q18 56 34 52 L38 50Z" fill="#7A9A8B"/>
  <path d="M38 12 H66 V24 H38Z" fill="#EFE0D2"/>
  <path d="M24 62 Q20 72 30 76 Q42 80 48 72" fill="#EFE0D2" opacity="0.9"/>
</svg>`;

const SVG_SHOE = `<svg viewBox="0 0 100 100">
  <path d="M22 34 Q20 58 26 66 L84 66 Q90 60 82 52 Q66 48 56 38 Q48 30 40 30 Q26 30 22 34Z" fill="#B98255"/>
  <path d="M24 66 H86 Q92 72 84 76 H26 Q18 72 24 66Z" fill="#8B5E45"/>
  <path d="M40 38 L50 44 M42 48 L52 52" stroke="#FDFBF7" stroke-width="3" stroke-linecap="round"/>
</svg>`;

/* ── Pakiety słów ─────────────────────────────────────────────
 * pl służy tylko podpowiedzi dla rodzica/dziecka czytającego —
 * dziecko słyszy wyłącznie angielski. */

const THEMES = [
  {
    id: 'animals',
    pl: 'Zwierzęta',
    en: 'Animals',
    coverSvg: SVG_OWL,
    words: [
      { en: 'owl',        pl: 'sowa',       svg: SVG_OWL },
      { en: 'bear',       pl: 'miś',        svg: SVG_BEAR },
      { en: 'fox',        pl: 'lis',        svg: SVG_FOX },
      { en: 'cat',        pl: 'kot',        svg: SVG_CAT },
      { en: 'dog',        pl: 'pies',       svg: SVG_DOG },
      { en: 'rabbit',     pl: 'królik',     svg: SVG_RABBIT },
    ],
  },
  {
    id: 'fruit',
    pl: 'Owoce',
    en: 'Fruit',
    coverSvg: SVG_APPLE,
    words: [
      { en: 'apple',      pl: 'jabłko',     svg: SVG_APPLE },
      { en: 'banana',     pl: 'banan',      svg: SVG_BANANA },
      { en: 'pear',       pl: 'gruszka',    svg: SVG_PEAR },
      { en: 'strawberry', pl: 'truskawka',  svg: SVG_STRAWBERRY },
      { en: 'orange',     pl: 'pomarańcza', svg: SVG_ORANGE },
      { en: 'cherry',     pl: 'wiśnia',     svg: SVG_CHERRY },
    ],
  },
  {
    id: 'colors',
    pl: 'Kolory',
    en: 'Colours',
    coverSvg: colorTabletSvg('#C96B5A'),
    words: [
      { en: 'red',        pl: 'czerwony',   svg: colorTabletSvg('#C96B5A') },
      { en: 'blue',       pl: 'niebieski',  svg: colorTabletSvg('#6B8E9F') },
      { en: 'green',      pl: 'zielony',    svg: colorTabletSvg('#7A9A8B') },
      { en: 'yellow',     pl: 'żółty',      svg: colorTabletSvg('#D9B36C') },
      { en: 'pink',       pl: 'różowy',     svg: colorTabletSvg('#D9A5A0') },
      { en: 'brown',      pl: 'brązowy',    svg: colorTabletSvg('#8B6A48') },
    ],
  },
];

/* Pary „co do czego pasuje" — obie karty podpisane po angielsku. */
const PAIRS = [
  { id: 'dog-bone',   a: { en: 'dog',  pl: 'pies',     svg: SVG_DOG },    b: { en: 'bone',   pl: 'kość',    svg: SVG_BONE } },
  { id: 'bird-nest',  a: { en: 'bird', pl: 'ptak',     svg: SVG_BIRD },   b: { en: 'nest',   pl: 'gniazdo', svg: SVG_NEST } },
  { id: 'bee-flower', a: { en: 'bee',  pl: 'pszczoła', svg: SVG_BEE },    b: { en: 'flower', pl: 'kwiat',   svg: SVG_FLOWER } },
  { id: 'boat-sea',   a: { en: 'boat', pl: 'łódka',    svg: SVG_BOAT },   b: { en: 'sea',    pl: 'morze',   svg: SVG_SEA } },
  { id: 'key-lock',   a: { en: 'key',  pl: 'klucz',    svg: SVG_KEY },    b: { en: 'lock',   pl: 'kłódka',  svg: SVG_LOCK } },
  { id: 'sock-shoe',  a: { en: 'sock', pl: 'skarpetka',svg: SVG_SOCK },   b: { en: 'shoe',   pl: 'but',     svg: SVG_SHOE } },
];

/* Ikony interfejsu (kreska 1.6–2, zaokrąglone końcówki — spokojna kreska) */
const UI = {
  gear: `<svg viewBox="0 0 24 24" fill="none">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="#2D3142" stroke-width="1.6"/>
    <path d="M19.4 13.4c.05-.46.05-.94 0-1.4l1.8-1.4-1.8-3.1-2.1.6a7.6 7.6 0 0 0-2.3-1.3L14.6 4h-5.2l-.4 2.4c-.85.3-1.63.75-2.3 1.3l-2.1-.6-1.8 3.1 1.8 1.4a7 7 0 0 0 0 2.8l-1.8 1.4 1.8 3.1 2.1-.6c.67.55 1.45 1 2.3 1.3l.4 2.4h5.2l.4-2.4c.85-.3 1.63-.75 2.3-1.3l2.1.6 1.8-3.1-1.8-1.4Z" stroke="#2D3142" stroke-width="1.3" stroke-linejoin="round"/>
  </svg>`,
  speaker: `<svg viewBox="0 0 24 24" fill="none">
    <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="#7A6A54"/>
    <path d="M16 9c1 .8 1.5 1.8 1.5 3s-.5 2.2-1.5 3M18.5 6.5c1.6 1.4 2.5 3.3 2.5 5.5s-.9 4.1-2.5 5.5" stroke="#7A6A54" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </svg>`,
  mic: `<svg viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="12" rx="3" fill="#FDFBF7"/>
    <path d="M6 11a6 6 0 0 0 12 0" stroke="#FDFBF7" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M12 17v4" stroke="#FDFBF7" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#7A6A54" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 5.5 16 12l-6.5 6.5" stroke="#7A6A54" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-5" stroke="#FDFBF7" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cards: `<svg viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="11" height="14" rx="2.5" fill="#FDFBF7" stroke="#7A6A54" stroke-width="1.6" transform="rotate(-6 9.5 13)"/>
    <rect x="10" y="4" width="11" height="14" rx="2.5" fill="#FDFBF7" stroke="#7A6A54" stroke-width="1.6" transform="rotate(6 15.5 11)"/>
  </svg>`,
  board: `<svg viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="13" rx="2.5" fill="#46564C" stroke="#C7B18C" stroke-width="1.8"/>
    <path d="M7 9h6M7 12.5h9" stroke="#F7F2EA" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M9 17v3M15 17v3" stroke="#C7B18C" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
  pairs: `<svg viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="12" r="4.5" stroke="#7A6A54" stroke-width="1.8"/>
    <circle cx="16" cy="12" r="4.5" stroke="#7A6A54" stroke-width="1.8"/>
  </svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5M6.5 10v9h11v-9" stroke="#7A6A54" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
