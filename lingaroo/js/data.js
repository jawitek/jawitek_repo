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

const SVG_DUCK = `<svg viewBox="0 0 100 100">
  <path d="M20 44 Q12 52 16 60 Q24 56 28 50Z" fill="#C79E52"/>
  <ellipse cx="46" cy="58" rx="26" ry="17" fill="#D9B36C"/>
  <ellipse cx="42" cy="58" rx="13" ry="9" fill="#C79E52"/>
  <circle cx="68" cy="36" r="13" fill="#D9B36C"/>
  <polygon points="79,33 94,38 79,43" fill="#D08251"/>
  <circle cx="71" cy="33" r="2.4" fill="#2D3142"/>
  <path d="M8 80 Q18 72 28 80 Q38 88 48 80 Q58 72 68 80 Q78 88 88 80" stroke="#6B8E9F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_HORSE = `<svg viewBox="0 0 100 100">
  <path d="M20 52 Q6 56 8 68 Q16 66 22 60Z" fill="#8B5E45"/>
  <rect x="22" y="42" width="46" height="26" rx="13" fill="#B98255"/>
  <rect x="27" y="62" width="8" height="24" rx="3" fill="#8B5E45"/>
  <rect x="41" y="64" width="8" height="22" rx="3" fill="#8B5E45"/>
  <rect x="55" y="62" width="8" height="24" rx="3" fill="#8B5E45"/>
  <polygon points="58,52 72,22 84,28 68,56" fill="#B98255"/>
  <path d="M62 48 Q70 28 78 24 L70 20 Q60 30 56 48Z" fill="#8B5E45"/>
  <ellipse cx="82" cy="28" rx="11" ry="8" transform="rotate(18 82 28)" fill="#B98255"/>
  <ellipse cx="91" cy="31" rx="4.5" ry="3.6" fill="#EFE0D2"/>
  <polygon points="74,20 76,8 82,18" fill="#B98255"/>
  <circle cx="82" cy="24" r="2.2" fill="#2D3142"/>
</svg>`;

const SVG_SHEEP = `<svg viewBox="0 0 100 100">
  <rect x="30" y="66" width="8" height="20" rx="3" fill="#6E5C4F"/>
  <rect x="52" y="66" width="8" height="20" rx="3" fill="#6E5C4F"/>
  <circle cx="34" cy="52" r="14" fill="#EFE6D8"/>
  <circle cx="50" cy="46" r="15" fill="#EFE6D8"/>
  <circle cx="64" cy="54" r="13" fill="#EFE6D8"/>
  <circle cx="44" cy="60" r="14" fill="#EFE6D8"/>
  <circle cx="58" cy="62" r="12" fill="#EFE6D8"/>
  <ellipse cx="80" cy="50" rx="10" ry="12" fill="#6E5C4F"/>
  <circle cx="79" cy="38" r="7" fill="#EFE6D8"/>
  <ellipse cx="70" cy="44" rx="4" ry="6" transform="rotate(24 70 44)" fill="#6E5C4F"/>
  <circle cx="83" cy="47" r="2.2" fill="#FDFBF7"/>
</svg>`;

const SVG_PIG = `<svg viewBox="0 0 100 100">
  <path d="M20 46 Q10 42 12 34 Q20 36 22 42" stroke="#C98F8A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="58" rx="27" ry="20" fill="#D9A5A0"/>
  <rect x="30" y="72" width="9" height="15" rx="3.5" fill="#C98F8A"/>
  <rect x="52" y="72" width="9" height="15" rx="3.5" fill="#C98F8A"/>
  <circle cx="74" cy="48" r="15" fill="#D9A5A0"/>
  <polygon points="63,36 66,24 74,34" fill="#C98F8A"/>
  <polygon points="84,34 88,23 90,36" fill="#C98F8A"/>
  <ellipse cx="83" cy="52" rx="8" ry="6" fill="#C98F8A"/>
  <circle cx="80" cy="52" r="1.6" fill="#2D3142"/>
  <circle cx="86" cy="52" r="1.6" fill="#2D3142"/>
  <circle cx="72" cy="42" r="2.2" fill="#2D3142"/>
</svg>`;

const SVG_MOUSE = `<svg viewBox="0 0 100 100">
  <path d="M78 66 Q94 70 92 84" stroke="#8F8A80" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="54" cy="62" rx="25" ry="18" fill="#A9A49B"/>
  <polygon points="34,52 12,64 34,74" fill="#A9A49B"/>
  <circle cx="13" cy="64" r="2.6" fill="#2D3142"/>
  <circle cx="40" cy="38" r="12" fill="#A9A49B"/>
  <circle cx="40" cy="38" r="6" fill="#D9A5A0"/>
  <circle cx="62" cy="34" r="12" fill="#A9A49B"/>
  <circle cx="62" cy="34" r="6" fill="#D9A5A0"/>
  <circle cx="34" cy="58" r="2.2" fill="#2D3142"/>
</svg>`;

const SVG_FROG = `<svg viewBox="0 0 100 100">
  <ellipse cx="24" cy="74" rx="10" ry="6" fill="#6B8A7B"/>
  <ellipse cx="76" cy="74" rx="10" ry="6" fill="#6B8A7B"/>
  <ellipse cx="50" cy="58" rx="28" ry="21" fill="#7A9A8B"/>
  <ellipse cx="50" cy="66" rx="16" ry="11" fill="#EFE6D8"/>
  <circle cx="35" cy="34" r="10" fill="#7A9A8B"/>
  <circle cx="65" cy="34" r="10" fill="#7A9A8B"/>
  <circle cx="35" cy="32" r="5" fill="#FDFBF7"/>
  <circle cx="65" cy="32" r="5" fill="#FDFBF7"/>
  <circle cx="35" cy="32" r="2.4" fill="#2D3142"/>
  <circle cx="65" cy="32" r="2.4" fill="#2D3142"/>
  <path d="M40 50 Q50 56 60 50" stroke="#2D3142" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_LEMON = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="60" rx="31" ry="21" transform="rotate(-14 50 60)" fill="#D9C25F"/>
  <ellipse cx="21" cy="70" rx="5" ry="4" transform="rotate(-14 21 70)" fill="#D9C25F"/>
  <ellipse cx="79" cy="50" rx="5" ry="4" transform="rotate(-14 79 50)" fill="#D9C25F"/>
  <path d="M72 38 Q82 26 92 30 Q84 40 72 38Z" fill="#7A9A8B"/>
  <ellipse cx="38" cy="52" rx="7" ry="10" transform="rotate(-20 38 52)" fill="#FDFBF7" opacity="0.25"/>
</svg>`;

const SVG_PLUM = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="60" r="27" fill="#8B7A9A"/>
  <path d="M50 34 Q42 56 48 86" stroke="#766787" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="47" y="18" width="6" height="14" rx="3" fill="#8B5E45"/>
  <path d="M53 24 Q66 14 74 24 Q64 32 53 24Z" fill="#7A9A8B"/>
  <ellipse cx="38" cy="50" rx="6" ry="9" transform="rotate(-16 38 50)" fill="#FDFBF7" opacity="0.22"/>
</svg>`;

const SVG_GRAPES = `<svg viewBox="0 0 100 100">
  <rect x="47" y="10" width="6" height="16" rx="3" fill="#8B5E45"/>
  <path d="M53 16 Q66 6 76 14 Q66 24 53 16Z" fill="#7A9A8B"/>
  <circle cx="40" cy="38" r="10" fill="#8B7A9A"/><circle cx="60" cy="38" r="10" fill="#8B7A9A"/>
  <circle cx="30" cy="54" r="10" fill="#96859F"/><circle cx="50" cy="54" r="10" fill="#8B7A9A"/><circle cx="70" cy="54" r="10" fill="#96859F"/>
  <circle cx="40" cy="70" r="10" fill="#8B7A9A"/><circle cx="60" cy="70" r="10" fill="#96859F"/>
  <circle cx="50" cy="84" r="10" fill="#8B7A9A"/>
</svg>`;

const SVG_WATERMELON = `<svg viewBox="0 0 100 100">
  <path d="M10 42 A40 40 0 0 0 90 42 Z" fill="#7A9A8B"/>
  <path d="M15 42 A35 35 0 0 0 85 42 Z" fill="#EFE6D8"/>
  <path d="M19 42 A31 31 0 0 0 81 42 Z" fill="#C96B5A"/>
  <ellipse cx="42" cy="54" rx="2.6" ry="4" fill="#2D3142"/>
  <ellipse cx="58" cy="54" rx="2.6" ry="4" fill="#2D3142"/>
  <ellipse cx="50" cy="64" rx="2.6" ry="4" fill="#2D3142"/>
</svg>`;

const SVG_PEACH = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="60" r="28" fill="#E7A98A"/>
  <path d="M50 34 Q58 56 52 86" stroke="#D98A6C" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="47" y="18" width="6" height="14" rx="3" fill="#8B5E45"/>
  <path d="M47 24 Q34 14 26 24 Q36 32 47 24Z" fill="#7A9A8B"/>
  <ellipse cx="38" cy="50" rx="6" ry="9" transform="rotate(-16 38 50)" fill="#FDFBF7" opacity="0.25"/>
</svg>`;

const SVG_KIWI = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="54" r="31" fill="#8B6A48"/>
  <circle cx="50" cy="54" r="27" fill="#A8A868"/>
  <ellipse cx="50" cy="54" rx="9" ry="13" fill="#EFE6D8"/>
  <circle cx="50" cy="34" r="1.8" fill="#2D3142"/><circle cx="62" cy="40" r="1.8" fill="#2D3142"/>
  <circle cx="67" cy="54" r="1.8" fill="#2D3142"/><circle cx="62" cy="68" r="1.8" fill="#2D3142"/>
  <circle cx="50" cy="74" r="1.8" fill="#2D3142"/><circle cx="38" cy="68" r="1.8" fill="#2D3142"/>
  <circle cx="33" cy="54" r="1.8" fill="#2D3142"/><circle cx="38" cy="40" r="1.8" fill="#2D3142"/>
</svg>`;

const SVG_MOON = `<svg viewBox="0 0 100 100">
  <path d="M60 12 A40 40 0 1 0 60 88 A32 32 0 1 1 60 12Z" fill="#D9B36C"/>
  <circle cx="74" cy="30" r="2.5" fill="#D9B36C"/>
  <circle cx="84" cy="48" r="3.5" fill="#D9B36C"/>
  <circle cx="76" cy="68" r="2.5" fill="#D9B36C"/>
</svg>`;

const SVG_STAR = `<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.6L22 9l-5.5 4.6L18 21l-6-3.8L6 21l1.5-7.4L2 9l7.4-.4Z" fill="#D9B36C"/></svg>`;

const SVG_UMBRELLA = `<svg viewBox="0 0 100 100">
  <path d="M50 22 v56 Q50 86 42 86" stroke="#8B5E45" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M12 52 Q16 24 50 18 Q84 24 88 52 Q82 45 76 52 Q68 44 60 52 Q52 44 44 52 Q36 44 28 52 Q22 45 12 52Z" fill="#C96B5A"/>
  <circle cx="50" cy="15" r="3.5" fill="#8B5E45"/>
</svg>`;

const SVG_RAIN = `<svg viewBox="0 0 100 100">
  <circle cx="36" cy="38" r="14" fill="#E9E0D0"/>
  <circle cx="54" cy="30" r="17" fill="#E9E0D0"/>
  <circle cx="68" cy="40" r="12" fill="#E9E0D0"/>
  <rect x="22" y="38" width="58" height="14" rx="7" fill="#E9E0D0"/>
  <path d="M34 62 L30 74" stroke="#6B8E9F" stroke-width="4" stroke-linecap="round"/>
  <path d="M52 64 L48 78" stroke="#6B8E9F" stroke-width="4" stroke-linecap="round"/>
  <path d="M68 62 L64 74" stroke="#6B8E9F" stroke-width="4" stroke-linecap="round"/>
  <path d="M44 80 L42 88" stroke="#6B8E9F" stroke-width="4" stroke-linecap="round"/>
  <path d="M60 82 L58 90" stroke="#6B8E9F" stroke-width="4" stroke-linecap="round"/>
</svg>`;

/* ── Kolory: tabliczka jak szpulka barwna Montessori ── */
function colorTabletSvg(hex) {
  return `<svg viewBox="0 0 100 100">
    <rect x="8" y="30" width="12" height="40" rx="4" fill="#EADBC8"/>
    <rect x="80" y="30" width="12" height="40" rx="4" fill="#EADBC8"/>
    <rect x="18" y="34" width="64" height="32" rx="6" fill="${hex}" stroke="rgba(45,49,66,0.1)" stroke-width="1.5"/>
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

/* ── Zwierzęta, część dalsza ── */

const SVG_FISH = `<svg viewBox="0 0 100 100">
  <polygon points="72,50 92,34 92,66" fill="#567483"/>
  <ellipse cx="46" cy="50" rx="30" ry="19" fill="#6B8E9F"/>
  <path d="M40 34 Q50 24 58 34 Q50 40 40 34Z" fill="#567483"/>
  <path d="M40 66 Q50 76 58 66 Q50 60 40 66Z" fill="#567483"/>
  <circle cx="28" cy="46" r="3" fill="#2D3142"/>
  <path d="M56 42 Q62 50 56 58" stroke="#567483" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="14" cy="30" r="3" fill="#8FB0BE"/><circle cx="10" cy="20" r="2.2" fill="#8FB0BE"/>
</svg>`;

const SVG_COW = `<svg viewBox="0 0 100 100">
  <ellipse cx="44" cy="58" rx="30" ry="20" fill="#EFE6D8"/>
  <path d="M28 48 Q40 42 50 52 Q42 64 30 62 Q24 56 28 48Z" fill="#8B6A48"/>
  <ellipse cx="58" cy="70" rx="9" ry="6" fill="#D9A5A0"/>
  <rect x="24" y="70" width="9" height="17" rx="3.5" fill="#D9CBB4"/>
  <rect x="48" y="72" width="9" height="15" rx="3.5" fill="#D9CBB4"/>
  <circle cx="78" cy="44" r="15" fill="#EFE6D8"/>
  <path d="M64 32 Q58 24 62 18 Q68 22 68 30" fill="#D9CBB4"/>
  <path d="M92 32 Q98 24 94 18 Q88 22 88 30" fill="#D9CBB4"/>
  <ellipse cx="80" cy="52" rx="10" ry="7" fill="#D9A5A0"/>
  <circle cx="76" cy="52" r="1.6" fill="#2D3142"/><circle cx="84" cy="52" r="1.6" fill="#2D3142"/>
  <circle cx="74" cy="40" r="2.2" fill="#2D3142"/>
</svg>`;

const SVG_CHICKEN = `<svg viewBox="0 0 100 100">
  <path d="M28 46 Q10 42 8 56 Q20 62 32 56Z" fill="#D9CBB4"/>
  <ellipse cx="52" cy="58" rx="26" ry="20" fill="#EFE6D8"/>
  <circle cx="72" cy="36" r="13" fill="#EFE6D8"/>
  <path d="M66 24 Q66 16 72 16 Q72 22 78 20 Q78 26 72 26Z" fill="#C96B5A"/>
  <polygon points="84,34 95,38 84,42" fill="#D9B36C"/>
  <path d="M82 42 Q86 48 82 50 Q79 46 80 42Z" fill="#C96B5A"/>
  <circle cx="74" cy="33" r="2.2" fill="#2D3142"/>
  <path d="M42 76 L40 88 M48 78 L48 88 M54 76 L56 88" stroke="#D9B36C" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_TURTLE = `<svg viewBox="0 0 100 100">
  <ellipse cx="48" cy="52" rx="30" ry="22" fill="#7A9A8B"/>
  <path d="M30 42 Q48 30 66 42 M24 54 H72 M30 66 Q48 76 66 66 M40 34 V70 M56 34 V70" stroke="#6B8A7B" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="84" cy="52" r="10" fill="#A8A868"/>
  <circle cx="87" cy="49" r="2" fill="#2D3142"/>
  <ellipse cx="28" cy="76" rx="8" ry="5" fill="#A8A868"/>
  <ellipse cx="64" cy="76" rx="8" ry="5" fill="#A8A868"/>
</svg>`;

/* ── Warzywa ── */

const SVG_CARROT = `<svg viewBox="0 0 100 100">
  <path d="M46 30 Q54 26 60 32 Q66 60 52 88 Q48 90 46 86 Q36 58 46 30Z" fill="#D08251"/>
  <path d="M50 26 Q44 12 34 10 Q40 22 48 28Z" fill="#7A9A8B"/>
  <path d="M52 24 Q52 8 60 4 Q62 16 56 26Z" fill="#7A9A8B"/>
  <path d="M56 26 Q66 14 76 16 Q68 26 58 30Z" fill="#7A9A8B"/>
  <path d="M46 44 H58 M44 56 H56 M46 68 H54" stroke="#B96F42" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const SVG_TOMATO = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="58" r="28" fill="#C96B5A"/>
  <path d="M50 26 L56 34 L66 30 L60 40 L70 44 L58 44 L50 52 L42 44 L30 44 L40 40 L34 30 L44 34Z" fill="#7A9A8B"/>
  <rect x="47" y="20" width="6" height="10" rx="3" fill="#6B8A7B"/>
  <ellipse cx="38" cy="52" rx="6" ry="9" transform="rotate(-16 38 52)" fill="#FDFBF7" opacity="0.22"/>
</svg>`;

const SVG_CUCUMBER = `<svg viewBox="0 0 100 100">
  <rect x="12" y="40" width="76" height="22" rx="11" transform="rotate(-14 50 51)" fill="#6B8A7B"/>
  <rect x="18" y="45" width="64" height="6" rx="3" transform="rotate(-14 50 51)" fill="#7A9A8B"/>
  <circle cx="30" cy="58" r="1.8" fill="#EFE6D8"/><circle cx="46" cy="52" r="1.8" fill="#EFE6D8"/>
  <circle cx="62" cy="46" r="1.8" fill="#EFE6D8"/><circle cx="76" cy="41" r="1.8" fill="#EFE6D8"/>
</svg>`;

const SVG_POTATO = `<svg viewBox="0 0 100 100">
  <path d="M26 40 Q40 24 60 30 Q80 36 78 56 Q76 76 54 78 Q30 80 24 62 Q20 50 26 40Z" fill="#B98255"/>
  <circle cx="40" cy="46" r="2.5" fill="#8B5E45"/><circle cx="60" cy="42" r="2.5" fill="#8B5E45"/>
  <circle cx="66" cy="60" r="2.5" fill="#8B5E45"/><circle cx="44" cy="66" r="2.5" fill="#8B5E45"/>
</svg>`;

const SVG_ONION = `<svg viewBox="0 0 100 100">
  <path d="M50 34 Q74 42 74 62 Q74 82 50 84 Q26 82 26 62 Q26 42 50 34Z" fill="#C9975F"/>
  <path d="M50 36 Q42 56 46 82 M50 36 Q58 56 54 82" stroke="#B07F45" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M46 32 Q44 18 40 14 Q48 18 50 28 Q52 18 60 14 Q56 18 54 32Z" fill="#A8A868"/>
</svg>`;

const SVG_PEAS = `<svg viewBox="0 0 100 100">
  <path d="M16 44 Q48 26 84 44 Q66 74 48 76 Q28 74 16 44Z" fill="#6B8A7B"/>
  <circle cx="36" cy="52" r="9" fill="#A8C0A0"/>
  <circle cx="54" cy="54" r="9" fill="#A8C0A0"/>
  <circle cx="70" cy="50" r="8" fill="#A8C0A0"/>
  <path d="M14 44 Q10 36 14 30" stroke="#6B8A7B" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_CORN = `<svg viewBox="0 0 100 100">
  <path d="M20 62 Q14 84 26 92 Q34 78 34 62 Q26 56 20 62Z" fill="#7A9A8B"/>
  <path d="M80 62 Q86 84 74 92 Q66 78 66 62 Q74 56 80 62Z" fill="#7A9A8B"/>
  <ellipse cx="50" cy="52" rx="20" ry="38" fill="#D9C25F"/>
  <circle cx="42" cy="28" r="2.5" fill="#C9A94F"/><circle cx="58" cy="28" r="2.5" fill="#C9A94F"/>
  <circle cx="42" cy="44" r="2.5" fill="#C9A94F"/><circle cx="58" cy="44" r="2.5" fill="#C9A94F"/><circle cx="50" cy="36" r="2.5" fill="#C9A94F"/>
  <circle cx="42" cy="60" r="2.5" fill="#C9A94F"/><circle cx="58" cy="60" r="2.5" fill="#C9A94F"/><circle cx="50" cy="52" r="2.5" fill="#C9A94F"/>
  <circle cx="50" cy="68" r="2.5" fill="#C9A94F"/><circle cx="44" cy="76" r="2.5" fill="#C9A94F"/><circle cx="56" cy="76" r="2.5" fill="#C9A94F"/>
</svg>`;

const SVG_PEPPER = `<svg viewBox="0 0 100 100">
  <path d="M34 34 Q22 44 24 62 Q26 82 42 84 Q46 86 50 84 Q54 86 58 84 Q74 82 76 62 Q78 44 66 34 Q58 30 50 34 Q42 30 34 34Z" fill="#D9B36C"/>
  <path d="M42 36 Q40 60 44 82 M58 36 Q60 60 56 82" stroke="#C9A052" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="46" y="18" width="8" height="14" rx="4" fill="#7A9A8B"/>
</svg>`;

const SVG_PUMPKIN = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="58" rx="34" ry="26" fill="#D08251"/>
  <ellipse cx="50" cy="58" rx="14" ry="26" fill="#DB9265"/>
  <path d="M32 38 Q28 58 32 78 M68 38 Q72 58 68 78" stroke="#B96F42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M50 32 Q48 20 54 14 Q60 18 56 32Z" fill="#7A9A8B"/>
</svg>`;

const SVG_BROCCOLI = `<svg viewBox="0 0 100 100">
  <rect x="44" y="56" width="12" height="28" rx="5" fill="#A8C0A0"/>
  <path d="M38 62 L32 76 M62 62 L68 76" stroke="#A8C0A0" stroke-width="8" stroke-linecap="round"/>
  <circle cx="34" cy="44" r="14" fill="#6B8A7B"/>
  <circle cx="52" cy="34" r="16" fill="#6B8A7B"/>
  <circle cx="68" cy="46" r="13" fill="#6B8A7B"/>
  <circle cx="50" cy="52" r="13" fill="#6B8A7B"/>
</svg>`;

const SVG_MUSHROOM = `<svg viewBox="0 0 100 100">
  <path d="M18 50 Q20 22 50 22 Q80 22 82 50 Q66 56 50 56 Q34 56 18 50Z" fill="#B98255"/>
  <circle cx="38" cy="38" r="4" fill="#EFE6D8"/><circle cx="58" cy="32" r="3.4" fill="#EFE6D8"/><circle cx="66" cy="44" r="3" fill="#EFE6D8"/>
  <path d="M40 56 Q38 78 44 86 H56 Q62 78 60 56 Q50 58 40 56Z" fill="#EFE6D8"/>
</svg>`;

const SVG_RADISH = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="58" r="22" fill="#C96B5A"/>
  <path d="M50 80 Q49 88 46 92" stroke="#EFE6D8" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M44 38 Q36 20 26 16 Q34 30 42 38Z" fill="#7A9A8B"/>
  <path d="M50 36 Q50 16 58 8 Q60 22 54 36Z" fill="#7A9A8B"/>
  <path d="M56 38 Q66 24 76 22 Q68 34 58 40Z" fill="#7A9A8B"/>
  <ellipse cx="42" cy="52" rx="5" ry="8" transform="rotate(-16 42 52)" fill="#FDFBF7" opacity="0.25"/>
</svg>`;

/* ── Dom ── */

const SVG_PLATE = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="32" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="3"/>
  <circle cx="50" cy="50" r="19" fill="#EFE6D8"/>
</svg>`;

const SVG_CUP = `<svg viewBox="0 0 100 100">
  <path d="M64 44 Q80 44 80 56 Q80 68 62 66" stroke="#567483" stroke-width="6" fill="none"/>
  <rect x="26" y="32" width="40" height="42" rx="10" fill="#6B8E9F"/>
  <rect x="26" y="32" width="40" height="10" rx="5" fill="#8FB0BE"/>
</svg>`;

const SVG_GLASS = `<svg viewBox="0 0 100 100">
  <path d="M36 24 H64 L60 80 H40Z" fill="#EFE6D8"/>
  <path d="M38 48 H62 L60 78 H40Z" fill="#8FB0BE"/>
  <path d="M36 24 H64" stroke="#D9CBB4" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_CHAIR = `<svg viewBox="0 0 100 100">
  <rect x="32" y="14" width="8" height="44" rx="3" fill="#B98255"/>
  <rect x="32" y="20" width="30" height="7" rx="3" fill="#B98255"/>
  <rect x="32" y="52" width="38" height="8" rx="3" fill="#8B5E45"/>
  <rect x="32" y="58" width="7" height="28" rx="3" fill="#B98255"/>
  <rect x="62" y="58" width="7" height="28" rx="3" fill="#B98255"/>
</svg>`;

const SVG_ARMCHAIR = `<svg viewBox="0 0 100 100">
  <rect x="24" y="22" width="52" height="40" rx="14" fill="#7A9A8B"/>
  <rect x="14" y="44" width="16" height="30" rx="8" fill="#6B8A7B"/>
  <rect x="70" y="44" width="16" height="30" rx="8" fill="#6B8A7B"/>
  <rect x="28" y="50" width="44" height="18" rx="8" fill="#8CAB9C"/>
  <rect x="24" y="66" width="52" height="10" rx="5" fill="#6B8A7B"/>
  <rect x="28" y="76" width="8" height="8" rx="2" fill="#8B5E45"/>
  <rect x="64" y="76" width="8" height="8" rx="2" fill="#8B5E45"/>
</svg>`;

const SVG_TABLE = `<svg viewBox="0 0 100 100">
  <rect x="14" y="38" width="72" height="10" rx="5" fill="#B98255"/>
  <rect x="22" y="48" width="8" height="34" rx="3" fill="#8B5E45"/>
  <rect x="70" y="48" width="8" height="34" rx="3" fill="#8B5E45"/>
</svg>`;

const SVG_BED = `<svg viewBox="0 0 100 100">
  <rect x="12" y="28" width="10" height="44" rx="4" fill="#B98255"/>
  <rect x="12" y="58" width="78" height="12" rx="5" fill="#B98255"/>
  <rect x="22" y="48" width="66" height="12" rx="5" fill="#EFE6D8"/>
  <rect x="24" y="42" width="18" height="10" rx="4" fill="#FDFBF7"/>
  <path d="M46 48 H88 V60 H46 Q42 54 46 48Z" fill="#6B8E9F"/>
  <rect x="14" y="70" width="7" height="12" rx="3" fill="#8B5E45"/>
  <rect x="80" y="70" width="7" height="12" rx="3" fill="#8B5E45"/>
</svg>`;

const SVG_LAMP = `<svg viewBox="0 0 100 100">
  <path d="M34 22 H66 L74 48 H26Z" fill="#D9B36C"/>
  <rect x="47" y="48" width="6" height="30" fill="#8B5E45"/>
  <ellipse cx="50" cy="82" rx="16" ry="5" fill="#8B5E45"/>
</svg>`;

const SVG_DOOR = `<svg viewBox="0 0 100 100">
  <rect x="26" y="12" width="48" height="78" rx="3" fill="#8B5E45"/>
  <rect x="31" y="17" width="38" height="70" rx="2" fill="#B98255"/>
  <rect x="37" y="24" width="26" height="24" rx="2" fill="#C99B72"/>
  <rect x="37" y="54" width="26" height="26" rx="2" fill="#C99B72"/>
  <circle cx="63" cy="52" r="3.4" fill="#D9B36C"/>
</svg>`;

const SVG_WINDOW = `<svg viewBox="0 0 100 100">
  <rect x="20" y="16" width="60" height="62" rx="4" fill="#B98255"/>
  <rect x="26" y="22" width="22" height="24" fill="#8FB0BE"/>
  <rect x="52" y="22" width="22" height="24" fill="#8FB0BE"/>
  <rect x="26" y="50" width="22" height="22" fill="#A7C2CC"/>
  <rect x="52" y="50" width="22" height="22" fill="#A7C2CC"/>
  <rect x="14" y="78" width="72" height="8" rx="4" fill="#8B5E45"/>
</svg>`;

const SVG_SPOON = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="30" rx="14" ry="18" fill="#A9A49B"/>
  <ellipse cx="50" cy="28" rx="8" ry="11" fill="#BCB8AF"/>
  <rect x="46" y="46" width="8" height="42" rx="4" fill="#A9A49B"/>
</svg>`;

const SVG_FORK = `<svg viewBox="0 0 100 100">
  <rect x="38" y="14" width="5" height="22" rx="2.5" fill="#A9A49B"/>
  <rect x="47.5" y="14" width="5" height="22" rx="2.5" fill="#A9A49B"/>
  <rect x="57" y="14" width="5" height="22" rx="2.5" fill="#A9A49B"/>
  <path d="M38 32 Q38 44 50 44 Q62 44 62 32 V28 H38Z" fill="#A9A49B"/>
  <rect x="46" y="44" width="8" height="44" rx="4" fill="#A9A49B"/>
</svg>`;

/* ── Ubrania ── */

const SVG_HAT = `<svg viewBox="0 0 100 100">
  <path d="M32 52 Q32 26 50 26 Q68 26 68 52Z" fill="#D9B36C"/>
  <ellipse cx="50" cy="54" rx="34" ry="9" fill="#C9A052"/>
  <path d="M32 46 H68 V52 H32Z" fill="#C96B5A"/>
</svg>`;

const SVG_DRESS = `<svg viewBox="0 0 100 100">
  <path d="M40 14 L44 26 H56 L60 14" stroke="#C98F8A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M40 24 H60 L58 46 Q76 70 68 84 H32 Q24 70 42 46Z" fill="#D9A5A0"/>
  <rect x="40" y="42" width="20" height="6" rx="3" fill="#C98F8A"/>
</svg>`;

const SVG_SHIRT = `<svg viewBox="0 0 100 100">
  <path d="M32 26 L44 20 Q50 27 56 20 L68 26 L80 42 L66 50 L66 82 H34 V50 L20 42Z" fill="#6B8E9F"/>
  <path d="M44 20 Q50 27 56 20" stroke="#567483" stroke-width="3" fill="none"/>
</svg>`;

const SVG_TROUSERS = `<svg viewBox="0 0 100 100">
  <path d="M34 16 H66 V46 L61 88 H52 L50 54 L48 88 H39 L34 46Z" fill="#567483"/>
  <rect x="34" y="16" width="32" height="8" rx="3" fill="#466170"/>
</svg>`;

const SVG_JACKET = `<svg viewBox="0 0 100 100">
  <path d="M30 28 L44 20 H56 L70 28 L78 46 L66 52 L66 84 H34 V52 L22 46Z" fill="#B98255"/>
  <path d="M50 24 V84" stroke="#EFE6D8" stroke-width="3"/>
  <polygon points="44,20 50,30 40,30" fill="#8B5E45"/>
  <polygon points="56,20 50,30 60,30" fill="#8B5E45"/>
  <circle cx="44" cy="46" r="2" fill="#8B5E45"/><circle cx="44" cy="60" r="2" fill="#8B5E45"/>
</svg>`;

const SVG_SCARF = `<svg viewBox="0 0 100 100">
  <rect x="26" y="30" width="48" height="14" rx="7" fill="#C96B5A"/>
  <path d="M40 42 H56 L54 78 Q47 82 40 78Z" fill="#C96B5A"/>
  <path d="M42 50 H54 M41 60 H54 M41 70 H53" stroke="#EFE6D8" stroke-width="3" stroke-linecap="round"/>
  <path d="M42 78 V86 M48 79 V88 M53 78 V85" stroke="#C96B5A" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_GLOVES = `<svg viewBox="0 0 100 100">
  <path d="M24 44 Q24 28 36 28 Q48 28 48 44 V64 H24 Z" fill="#7A9A8B"/>
  <path d="M24 46 Q14 42 14 34 Q22 34 26 40Z" fill="#7A9A8B"/>
  <rect x="24" y="64" width="24" height="10" rx="4" fill="#EFE6D8"/>
  <path d="M56 44 Q56 28 68 28 Q80 28 80 44 V64 H56Z" fill="#7A9A8B"/>
  <path d="M80 46 Q90 42 90 34 Q82 34 78 40Z" fill="#7A9A8B"/>
  <rect x="56" y="64" width="24" height="10" rx="4" fill="#EFE6D8"/>
</svg>`;

const SVG_BOOTS = `<svg viewBox="0 0 100 100">
  <path d="M20 22 H40 V56 Q52 58 52 68 V74 H20Z" fill="#D9B36C"/>
  <rect x="18" y="74" width="36" height="8" rx="4" fill="#8B5E45"/>
  <path d="M56 22 H76 V56 Q88 58 88 68 V74 H56Z" fill="#D9B36C"/>
  <rect x="54" y="74" width="36" height="8" rx="4" fill="#8B5E45"/>
  <rect x="20" y="22" width="20" height="8" fill="#C9A052"/>
  <rect x="56" y="22" width="20" height="8" fill="#C9A052"/>
</svg>`;

const SVG_SKIRT = `<svg viewBox="0 0 100 100">
  <rect x="34" y="22" width="32" height="8" rx="4" fill="#766787"/>
  <path d="M36 30 H64 L76 74 Q50 84 24 74Z" fill="#8B7A9A"/>
  <path d="M44 32 L40 76 M56 32 L60 76" stroke="#766787" stroke-width="2" fill="none"/>
</svg>`;

const SVG_CAP = `<svg viewBox="0 0 100 100">
  <path d="M26 52 Q26 28 48 28 Q70 28 70 52Z" fill="#6B8E9F"/>
  <path d="M66 52 Q88 50 92 58 Q74 62 64 56Z" fill="#567483"/>
  <path d="M24 52 H70" stroke="#567483" stroke-width="5" stroke-linecap="round"/>
  <circle cx="48" cy="28" r="3" fill="#567483"/>
</svg>`;

/* ── Rekwizyty do par ── */

const SVG_SUN = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="20" fill="#D9B36C"/>
  <g stroke="#D9B36C" stroke-width="5" stroke-linecap="round">
    <path d="M50 14 V24 M50 76 V86 M14 50 H24 M76 50 H86"/>
    <path d="M25 25 L32 32 M68 68 L75 75 M75 25 L68 32 M32 68 L25 75"/>
  </g>
</svg>`;

const SVG_SUNGLASSES = `<svg viewBox="0 0 100 100">
  <circle cx="30" cy="54" r="16" fill="#2D3142"/>
  <circle cx="70" cy="54" r="16" fill="#2D3142"/>
  <path d="M46 52 Q50 48 54 52" stroke="#2D3142" stroke-width="4" fill="none"/>
  <path d="M14 50 L6 42 M86 50 L94 42" stroke="#2D3142" stroke-width="4" stroke-linecap="round"/>
  <circle cx="25" cy="49" r="4" fill="#FDFBF7" opacity="0.35"/>
  <circle cx="65" cy="49" r="4" fill="#FDFBF7" opacity="0.35"/>
</svg>`;

const SVG_TOOTHBRUSH = `<svg viewBox="0 0 100 100">
  <rect x="14" y="52" width="56" height="12" rx="6" transform="rotate(-18 42 58)" fill="#6B8E9F"/>
  <g transform="rotate(-18 74 44)">
    <rect x="64" y="38" width="22" height="10" rx="4" fill="#6B8E9F"/>
    <path d="M66 38 V28 M71 38 V28 M76 38 V28 M81 38 V28" stroke="#EFE6D8" stroke-width="3.4" stroke-linecap="round"/>
  </g>
</svg>`;

const SVG_TOOTHPASTE = `<svg viewBox="0 0 100 100">
  <path d="M26 40 H70 V72 Q48 80 26 72Z" fill="#EFE6D8"/>
  <rect x="70" y="44" width="10" height="22" rx="3" fill="#C96B5A"/>
  <rect x="30" y="48" width="32" height="14" rx="7" fill="#6B8E9F"/>
  <path d="M18 26 Q30 18 40 26 Q30 32 22 30Z" fill="#8FB0BE"/>
</svg>`;

const SVG_PENCIL = `<svg viewBox="0 0 100 100">
  <g transform="rotate(-40 50 50)">
    <rect x="24" y="42" width="44" height="16" rx="2" fill="#D9B36C"/>
    <path d="M68 42 L84 50 L68 58Z" fill="#E7C4A8"/>
    <path d="M78 47 L84 50 L78 53Z" fill="#2D3142"/>
    <rect x="14" y="42" width="10" height="16" rx="3" fill="#D9A5A0"/>
  </g>
</svg>`;

const SVG_PAPER = `<svg viewBox="0 0 100 100">
  <path d="M28 14 H62 L76 28 V86 H28Z" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="2.5"/>
  <path d="M62 14 V28 H76" fill="none" stroke="#E2D9C6" stroke-width="2.5"/>
  <path d="M36 40 H68 M36 50 H68 M36 60 H60 M36 70 H64" stroke="#B3A78F" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const SVG_PAINT = `<svg viewBox="0 0 100 100">
  <path d="M24 34 H76 V78 Q50 86 24 78Z" fill="#A9A49B"/>
  <ellipse cx="50" cy="34" rx="26" ry="7" fill="#6B8E9F"/>
  <path d="M70 38 Q74 50 70 56 Q66 50 68 40Z" fill="#6B8E9F"/>
  <path d="M22 30 Q50 22 78 30" stroke="#8F8A80" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_BRUSH = `<svg viewBox="0 0 100 100">
  <g transform="rotate(-38 50 50)">
    <rect x="16" y="44" width="38" height="12" rx="5" fill="#B98255"/>
    <rect x="54" y="42" width="10" height="16" rx="2" fill="#A9A49B"/>
    <path d="M64 42 Q82 42 88 50 Q82 58 64 58Z" fill="#6B8E9F"/>
  </g>
</svg>`;

const SVG_PILLOW = `<svg viewBox="0 0 100 100">
  <path d="M20 34 Q50 26 80 34 Q88 50 80 66 Q50 74 20 66 Q12 50 20 34Z" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="2.5"/>
  <path d="M30 42 Q50 36 70 42" stroke="#E2D9C6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_TEAPOT = `<svg viewBox="0 0 100 100">
  <path d="M20 46 Q8 42 10 32 Q20 34 24 40Z" fill="#6B8E9F"/>
  <ellipse cx="50" cy="58" rx="28" ry="22" fill="#6B8E9F"/>
  <path d="M74 46 Q90 50 88 62 Q80 68 72 64" fill="none" stroke="#567483" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="50" cy="38" rx="14" ry="5" fill="#567483"/>
  <rect x="46" y="26" width="8" height="8" rx="4" fill="#567483"/>
</svg>`;

const SVG_KNIFE = `<svg viewBox="0 0 100 100">
  <g transform="rotate(-40 50 50)">
    <path d="M14 44 Q40 36 62 44 L62 54 H14 Q10 49 14 44Z" fill="#BCB8AF"/>
    <rect x="62" y="42" width="26" height="14" rx="6" fill="#8B5E45"/>
  </g>
</svg>`;

const SVG_SPIDER = `<svg viewBox="0 0 100 100">
  <path d="M50 6 V22" stroke="#8F8A80" stroke-width="2.5"/>
  <g stroke="#2D3142" stroke-width="3.4" stroke-linecap="round" fill="none">
    <path d="M38 52 Q20 48 14 36 M38 60 Q20 62 12 56 M40 66 Q28 76 26 86 M44 70 Q40 80 42 90"/>
    <path d="M62 52 Q80 48 86 36 M62 60 Q80 62 88 56 M60 66 Q72 76 74 86 M56 70 Q60 80 58 90"/>
  </g>
  <circle cx="50" cy="42" r="12" fill="#2D3142"/>
  <ellipse cx="50" cy="62" rx="16" ry="14" fill="#2D3142"/>
  <circle cx="46" cy="40" r="2.4" fill="#FDFBF7"/>
  <circle cx="54" cy="40" r="2.4" fill="#FDFBF7"/>
</svg>`;

const SVG_WEB = `<svg viewBox="0 0 100 100">
  <g stroke="#A9A49B" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M50 8 V92 M8 50 H92 M20 20 L80 80 M80 20 L20 80"/>
    <path d="M50 26 Q67 33 74 50 Q67 67 50 74 Q33 67 26 50 Q33 33 50 26Z"/>
    <path d="M50 42 Q56 44 58 50 Q56 56 50 58 Q44 56 42 50 Q44 44 50 42Z"/>
  </g>
</svg>`;

const SVG_AQUARIUM = `<svg viewBox="0 0 100 100">
  <path d="M28 24 Q12 40 12 58 Q12 84 50 84 Q88 84 88 58 Q88 40 72 24Z" fill="#D7E3E8"/>
  <path d="M16 52 Q16 80 50 80 Q84 80 84 52 Q60 44 16 52Z" fill="#8FB0BE"/>
  <polygon points="60,62 70,56 70,68" fill="#D08251"/>
  <ellipse cx="52" cy="62" rx="9" ry="6" fill="#D08251"/>
  <circle cx="47" cy="61" r="1.5" fill="#2D3142"/>
  <circle cx="42" cy="46" r="2.4" fill="#D7E3E8"/><circle cx="38" cy="38" r="1.8" fill="#D7E3E8"/>
</svg>`;

const SVG_WHEEL = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="32" fill="#2D3142"/>
  <circle cx="50" cy="50" r="20" fill="#A9A49B"/>
  <circle cx="50" cy="50" r="6" fill="#2D3142"/>
  <path d="M50 32 V44 M50 56 V68 M32 50 H44 M56 50 H68" stroke="#2D3142" stroke-width="4"/>
</svg>`;

const SVG_TRACK = `<svg viewBox="0 0 100 100">
  <path d="M34 14 L22 86 M66 14 L78 86" stroke="#8F8A80" stroke-width="5" stroke-linecap="round"/>
  <path d="M32 26 H68 M30 42 H70 M27 58 H73 M24 74 H76" stroke="#8B5E45" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const SVG_BOOK = `<svg viewBox="0 0 100 100">
  <path d="M50 26 Q34 18 16 22 V72 Q34 68 50 76 Q66 68 84 72 V22 Q66 18 50 26Z" fill="#FDFBF7" stroke="#C96B5A" stroke-width="3"/>
  <path d="M50 26 V76" stroke="#E2D9C6" stroke-width="2.5"/>
  <path d="M24 34 Q36 31 44 34 M24 44 Q36 41 44 44 M24 54 Q36 51 44 54 M56 34 Q64 31 76 34 M56 44 Q64 41 76 44 M56 54 Q64 51 76 54" stroke="#B3A78F" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_GLASSES = `<svg viewBox="0 0 100 100">
  <circle cx="30" cy="54" r="15" fill="none" stroke="#8B5E45" stroke-width="4"/>
  <circle cx="70" cy="54" r="15" fill="none" stroke="#8B5E45" stroke-width="4"/>
  <path d="M45 52 Q50 48 55 52" stroke="#8B5E45" stroke-width="3.4" fill="none"/>
  <path d="M15 52 L6 44 M85 52 L94 44" stroke="#8B5E45" stroke-width="3.4" stroke-linecap="round"/>
</svg>`;

const SVG_HAMMER = `<svg viewBox="0 0 100 100">
  <rect x="44" y="30" width="12" height="56" rx="5" transform="rotate(22 50 58)" fill="#B98255"/>
  <path d="M26 24 H62 Q70 24 72 32 L72 40 H26 Q20 32 26 24Z" fill="#8F8A80" transform="rotate(22 49 32)"/>
</svg>`;

const SVG_NAIL = `<svg viewBox="0 0 100 100">
  <rect x="30" y="22" width="40" height="9" rx="4.5" fill="#A9A49B"/>
  <path d="M45 31 H55 L52 78 L50 86 L48 78Z" fill="#BCB8AF"/>
</svg>`;

const SVG_SOAP = `<svg viewBox="0 0 100 100">
  <rect x="20" y="42" width="60" height="32" rx="14" fill="#D9A5A0"/>
  <rect x="28" y="48" width="26" height="8" rx="4" fill="#E7C0BC"/>
  <circle cx="70" cy="30" r="6" fill="#D7E3E8"/>
  <circle cx="82" cy="22" r="4" fill="#D7E3E8"/>
  <circle cx="60" cy="20" r="3" fill="#D7E3E8"/>
</svg>`;

const SVG_TOWEL = `<svg viewBox="0 0 100 100">
  <path d="M16 20 H84" stroke="#8B5E45" stroke-width="5" stroke-linecap="round"/>
  <path d="M28 20 H72 V74 Q50 80 28 74Z" fill="#7A9A8B"/>
  <rect x="28" y="56" width="44" height="8" fill="#EFE6D8"/>
</svg>`;

/* ── Zawody: wspólna sylwetka + akcesoria ── */
function personSvg(o) {
  return `<svg viewBox="0 0 100 100">
    ${o.behind || ''}
    <path d="M26 92 Q26 62 50 62 Q74 62 74 92Z" fill="${o.coat}" stroke="rgba(45,49,66,0.14)" stroke-width="1.5"/>
    ${o.chest || ''}
    <circle cx="50" cy="40" r="17" fill="${o.skin}"/>
    <circle cx="44" cy="41" r="2.4" fill="#2D3142"/>
    <circle cx="56" cy="41" r="2.4" fill="#2D3142"/>
    <path d="M45 49 Q50 52 55 49" stroke="#2D3142" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    ${o.hair || ''}
    ${o.hat || ''}
    ${o.front || ''}
  </svg>`;
}
const HAIR_DARK = `<path d="M33 36 Q35 22 50 22 Q65 22 67 36 Q60 26 50 26 Q40 26 33 36Z" fill="#5A4F45"/>`;
const HAIR_LIGHT = `<path d="M33 36 Q35 22 50 22 Q65 22 67 36 Q60 26 50 26 Q40 26 33 36Z" fill="#C9A052"/>`;

const PROFESSIONS = [
  { en: 'doctor', pl: 'lekarz', svg: personSvg({ skin: '#E7C4A8', coat: '#FDFBF7', hair: HAIR_DARK,
    chest: `<path d="M42 64 Q42 76 50 76 Q58 76 58 64" stroke="#567483" stroke-width="2.5" fill="none"/><circle cx="50" cy="79" r="4" fill="#567483"/>` }) },
  { en: 'nurse', pl: 'pielęgniarka', svg: personSvg({ skin: '#C99B72', coat: '#FDFBF7', hair: HAIR_DARK,
    hat: `<rect x="40" y="16" width="20" height="10" rx="3" fill="#FDFBF7"/><path d="M50 18 V24 M47 21 H53" stroke="#C96B5A" stroke-width="2" stroke-linecap="round"/>` }) },
  { en: 'cook', pl: 'kucharz', svg: personSvg({ skin: '#E7C4A8', coat: '#FDFBF7',
    hat: `<g stroke="#E2D9C6" stroke-width="1.5"><circle cx="40" cy="18" r="7" fill="#FDFBF7"/><circle cx="50" cy="15" r="8" fill="#FDFBF7"/><circle cx="60" cy="18" r="7" fill="#FDFBF7"/><rect x="38" y="18" width="24" height="9" fill="#FDFBF7"/></g>`,
    chest: `<circle cx="46" cy="70" r="1.8" fill="#B3A78F"/><circle cx="54" cy="70" r="1.8" fill="#B3A78F"/><circle cx="46" cy="80" r="1.8" fill="#B3A78F"/><circle cx="54" cy="80" r="1.8" fill="#B3A78F"/>` }) },
  { en: 'teacher', pl: 'nauczycielka', svg: personSvg({ skin: '#C99B72', coat: '#7A9A8B', hair: HAIR_DARK,
    front: `<circle cx="44" cy="41" r="5" fill="none" stroke="#2D3142" stroke-width="1.6"/><circle cx="56" cy="41" r="5" fill="none" stroke="#2D3142" stroke-width="1.6"/><path d="M49 41 H51" stroke="#2D3142" stroke-width="1.6"/><rect x="60" y="74" width="16" height="12" rx="2" fill="#C96B5A"/><path d="M62 78 H74 M62 82 H74" stroke="#EFE6D8" stroke-width="1.6"/>` }) },
  { en: 'firefighter', pl: 'strażak', svg: personSvg({ skin: '#8B5E45', coat: '#C96B5A',
    chest: `<rect x="30" y="72" width="40" height="7" fill="#D9B36C"/>`,
    hat: `<path d="M32 32 Q34 14 50 14 Q66 14 68 32 Q50 26 32 32Z" fill="#C96B5A"/><rect x="46" y="18" width="8" height="8" rx="2" fill="#D9B36C"/>` }) },
  { en: 'police officer', pl: 'policjant', svg: personSvg({ skin: '#E7C4A8', coat: '#567483',
    chest: `<circle cx="42" cy="72" r="4" fill="#D9B36C"/>`,
    hat: `<path d="M33 28 Q35 16 50 16 Q65 16 67 28Z" fill="#466170"/><path d="M31 28 H69 V33 H31Z" fill="#2D3142"/><circle cx="50" cy="22" r="3" fill="#D9B36C"/>` }) },
  { en: 'builder', pl: 'budowniczy', svg: personSvg({ skin: '#C99B72', coat: '#D08251',
    chest: `<path d="M34 68 L66 84 M66 68 L34 84" stroke="#D9C25F" stroke-width="4" stroke-linecap="round"/>`,
    hat: `<path d="M32 30 Q34 14 50 14 Q66 14 68 30Z" fill="#D9B36C"/><rect x="28" y="28" width="44" height="6" rx="3" fill="#C9A052"/>` }) },
  { en: 'farmer', pl: 'rolnik', svg: personSvg({ skin: '#E7C4A8', coat: '#B98255',
    chest: `<path d="M38 62 V78 M62 62 V78" stroke="#8B5E45" stroke-width="5" stroke-linecap="round"/><rect x="38" y="76" width="24" height="16" fill="#8B5E45"/>`,
    hat: `<path d="M36 26 Q38 12 50 12 Q62 12 64 26Z" fill="#D9C25F"/><ellipse cx="50" cy="27" rx="26" ry="6" fill="#C9A94F"/>` }) },
  { en: 'pilot', pl: 'pilot', svg: personSvg({ skin: '#8B5E45', coat: '#466170',
    chest: `<path d="M42 68 L50 72 L58 68" stroke="#D9B36C" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    hat: `<path d="M33 28 Q35 16 50 16 Q65 16 67 28Z" fill="#2D3142"/><path d="M31 28 H69 V33 H31Z" fill="#466170"/><circle cx="50" cy="22" r="3" fill="#D9B36C"/>` }) },
  { en: 'painter', pl: 'malarz', svg: personSvg({ skin: '#E7C4A8', coat: '#FDFBF7', hair: HAIR_LIGHT,
    chest: `<circle cx="42" cy="70" r="2.5" fill="#C96B5A"/><circle cx="54" cy="76" r="2.5" fill="#6B8E9F"/><circle cx="60" cy="66" r="2.5" fill="#D9B36C"/>`,
    hat: `<ellipse cx="46" cy="22" rx="15" ry="7" fill="#C96B5A"/><circle cx="46" cy="15" r="3" fill="#C96B5A"/>`,
    front: `<rect x="66" y="66" width="6" height="22" rx="3" fill="#B98255" transform="rotate(14 69 77)"/><rect x="68" y="58" width="8" height="10" rx="2" fill="#6B8E9F" transform="rotate(14 72 63)"/>` }) },
  { en: 'gardener', pl: 'ogrodniczka', svg: personSvg({ skin: '#C99B72', coat: '#7A9A8B', hair: HAIR_LIGHT,
    hat: `<path d="M36 26 Q38 14 50 14 Q62 14 64 26Z" fill="#A8A868"/><ellipse cx="50" cy="27" rx="24" ry="6" fill="#96955C"/>`,
    front: `<circle cx="68" cy="72" r="6" fill="#D9A5A0"/><circle cx="68" cy="72" r="2.5" fill="#D9B36C"/><path d="M68 78 Q66 84 64 88" stroke="#6B8A7B" stroke-width="2.5" fill="none" stroke-linecap="round"/>` }) },
  { en: 'postman', pl: 'listonosz', svg: personSvg({ skin: '#E7C4A8', coat: '#6B8E9F', hair: HAIR_DARK,
    hat: `<path d="M34 28 Q36 18 50 18 Q64 18 66 28Z" fill="#567483"/><path d="M32 28 H68 V32 H32Z" fill="#466170"/>`,
    front: `<rect x="58" y="70" width="20" height="14" rx="2" fill="#EFE6D8"/><path d="M58 70 L68 78 L78 70" stroke="#B3A78F" stroke-width="1.8" fill="none"/>` }) },
];

/* ── Pojazdy ── */

const SVG_CAR = `<svg viewBox="0 0 100 100">
  <path d="M28 52 Q34 34 50 34 Q66 34 72 52Z" fill="#D98A6C"/>
  <rect x="40" y="40" width="20" height="12" rx="3" fill="#EFE6D8"/>
  <rect x="12" y="50" width="76" height="22" rx="10" fill="#C96B5A"/>
  <circle cx="30" cy="72" r="10" fill="#2D3142"/><circle cx="30" cy="72" r="4.5" fill="#A9A49B"/>
  <circle cx="70" cy="72" r="10" fill="#2D3142"/><circle cx="70" cy="72" r="4.5" fill="#A9A49B"/>
</svg>`;

const SVG_BUS = `<svg viewBox="0 0 100 100">
  <rect x="10" y="30" width="80" height="40" rx="9" fill="#D9B36C"/>
  <rect x="16" y="38" width="14" height="13" rx="3" fill="#EFE6D8"/>
  <rect x="34" y="38" width="14" height="13" rx="3" fill="#EFE6D8"/>
  <rect x="52" y="38" width="14" height="13" rx="3" fill="#EFE6D8"/>
  <rect x="70" y="38" width="14" height="26" rx="3" fill="#EFE6D8"/>
  <circle cx="28" cy="72" r="9" fill="#2D3142"/><circle cx="28" cy="72" r="4" fill="#A9A49B"/>
  <circle cx="66" cy="72" r="9" fill="#2D3142"/><circle cx="66" cy="72" r="4" fill="#A9A49B"/>
</svg>`;

const SVG_BIKE = `<svg viewBox="0 0 100 100">
  <circle cx="26" cy="66" r="16" fill="none" stroke="#2D3142" stroke-width="4"/>
  <circle cx="74" cy="66" r="16" fill="none" stroke="#2D3142" stroke-width="4"/>
  <path d="M26 66 L44 40 H62 L74 66 M44 40 L52 66 H26" stroke="#C96B5A" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <path d="M62 40 L58 32 H50" stroke="#2D3142" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="38" y="32" width="12" height="5" rx="2.5" fill="#8B5E45"/>
</svg>`;

const SVG_TRAIN = `<svg viewBox="0 0 100 100">
  <rect x="54" y="26" width="30" height="46" rx="7" fill="#7A9A8B"/>
  <rect x="60" y="34" width="18" height="14" rx="3" fill="#EFE6D8"/>
  <rect x="12" y="44" width="46" height="28" rx="8" fill="#6B8A7B"/>
  <rect x="20" y="30" width="10" height="16" rx="3" fill="#567483"/>
  <circle cx="26" cy="74" r="8" fill="#2D3142"/><circle cx="46" cy="74" r="8" fill="#2D3142"/><circle cx="70" cy="74" r="8" fill="#2D3142"/>
  <circle cx="26" cy="74" r="3.4" fill="#A9A49B"/><circle cx="46" cy="74" r="3.4" fill="#A9A49B"/><circle cx="70" cy="74" r="3.4" fill="#A9A49B"/>
</svg>`;

const SVG_PLANE = `<svg viewBox="0 0 100 100">
  <polygon points="46,48 28,22 40,22 58,44" fill="#6B8E9F"/>
  <ellipse cx="50" cy="54" rx="37" ry="13" fill="#8FB0BE"/>
  <polygon points="80,48 92,32 96,44 86,52" fill="#6B8E9F"/>
  <polygon points="44,58 24,80 38,80 58,62" fill="#6B8E9F"/>
  <circle cx="26" cy="52" r="3" fill="#FDFBF7"/><circle cx="38" cy="51" r="3" fill="#FDFBF7"/><circle cx="50" cy="50" r="3" fill="#FDFBF7"/><circle cx="62" cy="50" r="3" fill="#FDFBF7"/>
</svg>`;

const SVG_TRUCK = `<svg viewBox="0 0 100 100">
  <rect x="8" y="30" width="52" height="34" rx="4" fill="#EFE6D8" stroke="#D9CBB4" stroke-width="2"/>
  <path d="M60 42 H78 L88 56 V64 H60Z" fill="#C96B5A"/>
  <rect x="66" y="46" width="12" height="10" rx="2" fill="#EFE6D8"/>
  <circle cx="26" cy="68" r="9" fill="#2D3142"/><circle cx="26" cy="68" r="4" fill="#A9A49B"/>
  <circle cx="74" cy="68" r="9" fill="#2D3142"/><circle cx="74" cy="68" r="4" fill="#A9A49B"/>
</svg>`;

const SVG_TRACTOR = `<svg viewBox="0 0 100 100">
  <rect x="24" y="38" width="46" height="22" rx="6" fill="#7A9A8B"/>
  <rect x="30" y="20" width="24" height="22" rx="4" fill="#6B8A7B"/>
  <rect x="35" y="25" width="14" height="12" rx="2" fill="#EFE6D8"/>
  <rect x="64" y="26" width="6" height="14" rx="3" fill="#567483"/>
  <circle cx="34" cy="68" r="17" fill="#2D3142"/><circle cx="34" cy="68" r="8" fill="#A9A49B"/>
  <circle cx="76" cy="74" r="10" fill="#2D3142"/><circle cx="76" cy="74" r="4.5" fill="#A9A49B"/>
</svg>`;

const SVG_SCOOTER = `<svg viewBox="0 0 100 100">
  <path d="M62 24 L74 24" stroke="#2D3142" stroke-width="5" stroke-linecap="round"/>
  <path d="M68 24 L60 70" stroke="#2D3142" stroke-width="5" stroke-linecap="round"/>
  <rect x="22" y="68" width="40" height="7" rx="3.5" fill="#C96B5A"/>
  <circle cx="24" cy="80" r="8" fill="#2D3142"/><circle cx="24" cy="80" r="3.4" fill="#A9A49B"/>
  <circle cx="64" cy="80" r="8" fill="#2D3142"/><circle cx="64" cy="80" r="3.4" fill="#A9A49B"/>
</svg>`;

const SVG_HELICOPTER = `<svg viewBox="0 0 100 100">
  <path d="M14 22 H86" stroke="#2D3142" stroke-width="4" stroke-linecap="round"/>
  <rect x="47" y="22" width="6" height="12" fill="#567483"/>
  <ellipse cx="44" cy="52" rx="26" ry="17" fill="#6B8E9F"/>
  <path d="M66 48 H90 V54 H66Z" fill="#567483"/>
  <path d="M88 40 V60" stroke="#2D3142" stroke-width="4" stroke-linecap="round"/>
  <circle cx="32" cy="50" r="7" fill="#EFE6D8"/>
  <path d="M32 70 H62 M38 62 L38 70 M56 62 L56 70" stroke="#2D3142" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;

const SVG_ROCKET = `<svg viewBox="0 0 100 100">
  <path d="M50 6 Q66 24 66 52 Q66 70 50 74 Q34 70 34 52 Q34 24 50 6Z" fill="#EFE6D8"/>
  <path d="M50 6 Q60 16 63 30 Q50 24 37 30 Q40 16 50 6Z" fill="#C96B5A"/>
  <circle cx="50" cy="44" r="8" fill="#6B8E9F"/>
  <circle cx="50" cy="44" r="4.5" fill="#8FB0BE"/>
  <path d="M34 54 Q22 62 22 76 Q32 70 36 64Z" fill="#C96B5A"/>
  <path d="M66 54 Q78 62 78 76 Q68 70 64 64Z" fill="#C96B5A"/>
  <path d="M50 76 Q56 84 50 94 Q44 84 50 76Z" fill="#D9B36C"/>
</svg>`;

const SVG_SHIP = `<svg viewBox="0 0 100 100">
  <rect x="36" y="24" width="9" height="18" rx="2" fill="#C96B5A"/>
  <rect x="52" y="24" width="9" height="18" rx="2" fill="#C96B5A"/>
  <rect x="26" y="40" width="48" height="12" rx="3" fill="#EFE6D8"/>
  <path d="M12 52 H88 L74 74 H26Z" fill="#567483"/>
  <path d="M8 82 Q18 74 28 82 Q38 90 48 82 Q58 74 68 82 Q78 90 88 82" stroke="#6B8E9F" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

/* ── Liczby: cyfra + tyle samo kropek ── */
function numberSvg(n) {
  let dots = '';
  const rows = [];
  for (let left = n; left > 0; left -= 4) rows.push(Math.min(4, left));
  rows.forEach((k, r) => {
    const x0 = 50 - (k - 1) * 8;
    for (let c = 0; c < k; c++) dots += `<circle cx="${x0 + c * 16}" cy="${62 + r * 15}" r="5.5" fill="#7A9A8B"/>`;
  });
  return `<svg viewBox="0 0 100 100">
    <text x="50" y="48" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="46" fill="#2D3142">${n}</text>
    ${dots}
  </svg>`;
}

/* ── Kształty ── */
const SHAPES = [
  { en: 'circle',    pl: 'koło',      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#C96B5A"/></svg>` },
  { en: 'square',    pl: 'kwadrat',   svg: `<svg viewBox="0 0 100 100"><rect x="22" y="22" width="56" height="56" rx="6" fill="#6B8E9F"/></svg>` },
  { en: 'triangle',  pl: 'trójkąt',   svg: `<svg viewBox="0 0 100 100"><path d="M50 20 L82 76 H18Z" fill="#7A9A8B" stroke-linejoin="round" stroke="#7A9A8B" stroke-width="8"/></svg>` },
  { en: 'star',      pl: 'gwiazda',   svg: SVG_STAR },
  { en: 'heart',     pl: 'serce',     svg: `<svg viewBox="0 0 100 100"><path d="M50 82 C22 62 14 44 24 32 Q34 22 50 36 Q66 22 76 32 C86 44 78 62 50 82Z" fill="#D9A5A0"/></svg>` },
  { en: 'rectangle', pl: 'prostokąt', svg: `<svg viewBox="0 0 100 100"><rect x="14" y="30" width="72" height="40" rx="6" fill="#D9B36C"/></svg>` },
  { en: 'oval',      pl: 'owal',      svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="34" ry="22" fill="#8B7A9A"/></svg>` },
  { en: 'diamond',   pl: 'romb',      svg: `<svg viewBox="0 0 100 100"><path d="M50 16 L80 50 L50 84 L20 50Z" fill="#8FB0BE" stroke="#8FB0BE" stroke-width="6" stroke-linejoin="round"/></svg>` },
  { en: 'moon',      pl: 'księżyc',   svg: SVG_MOON },
  { en: 'cross',     pl: 'krzyżyk',   svg: `<svg viewBox="0 0 100 100"><path d="M28 28 L72 72 M72 28 L28 72" stroke="#C96B5A" stroke-width="14" stroke-linecap="round"/></svg>` },
  { en: 'arrow',     pl: 'strzałka',  svg: `<svg viewBox="0 0 100 100"><path d="M20 50 H68 M50 28 L72 50 L50 72" stroke="#567483" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { en: 'ring',      pl: 'obrączka',  svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="22" fill="none" stroke="#C9A94F" stroke-width="10"/><path d="M50 24 L58 34 L50 40 L42 34Z" fill="#8FB0BE"/></svg>` },
];

/* ── Ciało ── */

const SVG_HEAD = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="30" fill="#E7C4A8"/>
  <path d="M22 44 Q24 20 50 20 Q76 20 78 44 Q66 30 50 30 Q34 30 22 44Z" fill="#8B5E45"/>
  <ellipse cx="20" cy="54" rx="5" ry="8" fill="#E7C4A8"/>
  <ellipse cx="80" cy="54" rx="5" ry="8" fill="#E7C4A8"/>
  <circle cx="41" cy="52" r="2.6" fill="#2D3142"/>
  <circle cx="59" cy="52" r="2.6" fill="#2D3142"/>
  <path d="M44 66 Q50 70 56 66" stroke="#2D3142" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_EYES = `<svg viewBox="0 0 100 100">
  <ellipse cx="30" cy="50" rx="18" ry="12" fill="#FDFBF7" stroke="#2D3142" stroke-width="2.5"/>
  <ellipse cx="70" cy="50" rx="18" ry="12" fill="#FDFBF7" stroke="#2D3142" stroke-width="2.5"/>
  <circle cx="33" cy="50" r="6.5" fill="#6B8E9F"/><circle cx="33" cy="50" r="3" fill="#2D3142"/>
  <circle cx="73" cy="50" r="6.5" fill="#6B8E9F"/><circle cx="73" cy="50" r="3" fill="#2D3142"/>
  <path d="M14 38 Q30 30 46 38 M54 38 Q70 30 86 38" stroke="#8B5E45" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_NOSE = `<svg viewBox="0 0 100 100">
  <path d="M50 22 Q56 44 60 58 Q64 72 50 74 Q36 72 40 58 Q44 44 50 22Z" fill="#E7C4A8"/>
  <ellipse cx="43" cy="70" rx="3.4" ry="2.4" fill="#C99B72"/>
  <ellipse cx="57" cy="70" rx="3.4" ry="2.4" fill="#C99B72"/>
</svg>`;

const SVG_MOUTH = `<svg viewBox="0 0 100 100">
  <path d="M20 48 Q35 40 50 48 Q65 40 80 48 Q68 70 50 70 Q32 70 20 48Z" fill="#C96B5A"/>
  <path d="M24 49 Q50 56 76 49" stroke="#A34F4F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_EARS = `<svg viewBox="0 0 100 100">
  <path d="M34 28 Q14 30 16 52 Q18 74 34 72 Q28 52 34 28Z" fill="#E7C4A8"/>
  <path d="M30 40 Q22 44 24 56" stroke="#C99B72" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M66 28 Q86 30 84 52 Q82 74 66 72 Q72 52 66 28Z" fill="#E7C4A8"/>
  <path d="M70 40 Q78 44 76 56" stroke="#C99B72" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_HAIR = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="60" r="26" fill="#EFE0D2"/>
  <path d="M22 58 Q18 26 50 22 Q82 26 78 58 Q74 42 64 40 Q70 52 62 50 Q54 36 46 44 Q40 36 34 46 Q28 44 30 56 Q24 50 22 58Z" fill="#8B5E45"/>
</svg>`;

const SVG_HANDS = `<svg viewBox="0 0 100 100">
  <path d="M30 84 V52 Q30 46 35 46 Q39 46 39 52 V40 Q39 34 44 34 Q48 34 48 40 V36 Q48 30 53 30 Q57 30 57 36 V44 Q57 40 61 40 Q65 40 65 46 V70 Q65 84 48 86 Q36 86 30 84Z" fill="#E7C4A8" transform="translate(-22 0)"/>
  <path d="M30 84 V52 Q30 46 35 46 Q39 46 39 52 V40 Q39 34 44 34 Q48 34 48 40 V36 Q48 30 53 30 Q57 30 57 36 V44 Q57 40 61 40 Q65 40 65 46 V70 Q65 84 48 86 Q36 86 30 84Z" fill="#E7C4A8" transform="translate(28 0) scale(-1,1) translate(-95 0)"/>
</svg>`;

const SVG_FEET = `<svg viewBox="0 0 100 100">
  <path d="M20 36 Q32 36 34 52 Q35 66 44 70 Q48 78 40 80 H26 Q18 74 18 58Z" fill="#E7C4A8"/>
  <path d="M80 36 Q68 36 66 52 Q65 66 56 70 Q52 78 60 80 H74 Q82 74 82 58Z" fill="#E7C4A8"/>
  <circle cx="42" cy="76" r="2" fill="#C99B72"/><circle cx="58" cy="76" r="2" fill="#C99B72"/>
</svg>`;

const SVG_LEGS = `<svg viewBox="0 0 100 100">
  <path d="M30 14 H70 L72 40 H54 L50 30 L46 40 H28Z" fill="#6B8E9F"/>
  <rect x="32" y="40" width="14" height="40" rx="7" fill="#E7C4A8"/>
  <rect x="54" y="40" width="14" height="40" rx="7" fill="#E7C4A8"/>
  <ellipse cx="38" cy="84" rx="11" ry="5" fill="#B98255"/>
  <ellipse cx="62" cy="84" rx="11" ry="5" fill="#B98255"/>
</svg>`;

const SVG_ARMS = `<svg viewBox="0 0 100 100">
  <path d="M10 20 H36 V44 H10Z" fill="#C96B5A"/>
  <path d="M30 32 Q52 28 64 40 Q76 50 78 64" stroke="#E7C4A8" stroke-width="14" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="70" r="10" fill="#E7C4A8"/>
  <path d="M74 64 Q80 58 86 62" stroke="#C99B72" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_TUMMY = `<svg viewBox="0 0 100 100">
  <path d="M28 18 H72 Q78 50 72 84 H28 Q22 50 28 18Z" fill="#D9A5A0"/>
  <ellipse cx="50" cy="56" rx="17" ry="19" fill="#E7C4A8"/>
  <circle cx="50" cy="58" r="3" fill="#C99B72"/>
</svg>`;

const SVG_TEETH = `<svg viewBox="0 0 100 100">
  <path d="M16 44 Q50 30 84 44 Q78 74 50 74 Q22 74 16 44Z" fill="#C96B5A"/>
  <path d="M24 45 H76 V54 Q76 58 71 58 H29 Q24 58 24 54Z" fill="#FDFBF7"/>
  <path d="M33 45 V58 M42 45 V58 M51 45 V58 M60 45 V58 M69 45 V58" stroke="#E2D9C6" stroke-width="2"/>
</svg>`;

/* ── Jedzenie ── */

const SVG_BREAD = `<svg viewBox="0 0 100 100">
  <path d="M14 52 Q14 34 32 34 H74 Q88 34 88 46 Q88 54 80 56 V70 Q80 76 74 76 H26 Q20 76 20 70 V56 Q14 56 14 52Z" fill="#C9975F"/>
  <path d="M34 44 Q40 38 46 44 M52 44 Q58 38 64 44 M70 44 Q76 38 80 44" stroke="#B07F45" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_MILK = `<svg viewBox="0 0 100 100">
  <path d="M34 34 L40 18 H60 L66 34 V82 Q66 86 62 86 H38 Q34 86 34 82Z" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="2.5"/>
  <path d="M34 34 H66" stroke="#E2D9C6" stroke-width="2.5"/>
  <rect x="34" y="46" width="32" height="16" fill="#8FB0BE"/>
  <path d="M42 54 Q46 50 50 54 Q54 58 58 54" stroke="#FDFBF7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_CHEESE = `<svg viewBox="0 0 100 100">
  <path d="M14 62 L82 34 Q88 40 88 48 V70 Q88 74 84 74 H18 Q14 74 14 70Z" fill="#D9C25F"/>
  <circle cx="40" cy="62" r="5" fill="#C9A94F"/>
  <circle cx="62" cy="56" r="4" fill="#C9A94F"/>
  <circle cx="74" cy="66" r="3.4" fill="#C9A94F"/>
  <circle cx="28" cy="68" r="3" fill="#C9A94F"/>
</svg>`;

const SVG_EGG = `<svg viewBox="0 0 100 100">
  <path d="M26 46 Q20 30 34 28 Q40 18 52 24 Q66 16 72 30 Q86 34 78 48 Q86 60 72 64 Q70 76 56 72 Q44 80 36 68 Q22 68 26 56 Q20 52 26 46Z" fill="#FDFBF7"/>
  <circle cx="50" cy="48" r="13" fill="#D9B36C"/>
  <circle cx="46" cy="44" r="4" fill="#E7C987"/>
</svg>`;

const SVG_CAKE = `<svg viewBox="0 0 100 100">
  <path d="M22 46 H78 V78 Q50 84 22 78Z" fill="#E7C4A8"/>
  <path d="M22 58 H78" stroke="#C96B5A" stroke-width="5"/>
  <path d="M22 46 Q28 38 36 44 Q42 36 50 44 Q58 36 64 44 Q72 38 78 46 V52 H22Z" fill="#FDFBF7"/>
  <circle cx="50" cy="32" r="6" fill="#B85C5C"/>
  <path d="M50 26 Q52 20 56 18" stroke="#7A9A8B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_SOUP = `<svg viewBox="0 0 100 100">
  <path d="M40 18 Q38 26 42 30 Q46 34 44 40 M58 16 Q56 24 60 28 Q64 32 62 38" stroke="#B3A78F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M14 50 H86 Q86 74 62 80 H38 Q14 74 14 50Z" fill="#C96B5A"/>
  <ellipse cx="50" cy="50" rx="36" ry="7" fill="#D98A6C"/>
  <ellipse cx="42" cy="50" rx="6" ry="2.5" fill="#D9B36C"/>
  <ellipse cx="60" cy="51" rx="5" ry="2.2" fill="#A8C0A0"/>
</svg>`;

const SVG_JUICE = `<svg viewBox="0 0 100 100">
  <path d="M34 26 H66 L62 82 H38Z" fill="#EFE6D8"/>
  <path d="M36 42 H64 L62 80 H38Z" fill="#D08251"/>
  <path d="M56 30 L70 12" stroke="#C96B5A" stroke-width="5" stroke-linecap="round"/>
  <circle cx="30" cy="22" r="7" fill="#D08251"/>
  <path d="M28 16 Q32 12 36 14" stroke="#7A9A8B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_WATER = `<svg viewBox="0 0 100 100">
  <path d="M50 14 Q64 34 64 46 Q64 60 50 60 Q36 60 36 46 Q36 34 50 14Z" fill="#8FB0BE"/>
  <path d="M44 44 Q42 50 46 53" stroke="#FDFBF7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M20 76 Q30 70 40 76 Q50 82 60 76 Q70 70 80 76" stroke="#6B8E9F" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M24 88 Q34 82 44 88 Q54 94 64 88 Q72 84 78 88" stroke="#8FB0BE" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_PIZZA = `<svg viewBox="0 0 100 100">
  <path d="M50 88 L18 24 Q50 8 82 24Z" fill="#D9B36C"/>
  <path d="M18 24 Q50 8 82 24 L78 32 Q50 18 22 32Z" fill="#C96B5A"/>
  <circle cx="44" cy="42" r="6" fill="#C96B5A"/>
  <circle cx="60" cy="50" r="5" fill="#C96B5A"/>
  <circle cx="48" cy="64" r="5" fill="#C96B5A"/>
  <circle cx="36" cy="52" r="3" fill="#A8C0A0"/>
  <circle cx="56" cy="34" r="3" fill="#A8C0A0"/>
</svg>`;

const SVG_HONEY = `<svg viewBox="0 0 100 100">
  <path d="M30 34 H70 Q76 48 76 62 Q76 82 50 82 Q24 82 24 62 Q24 48 30 34Z" fill="#D9A94F"/>
  <rect x="28" y="24" width="44" height="12" rx="4" fill="#8B5E45"/>
  <path d="M32 52 H68 M30 62 H70" stroke="#C99B3F" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 44 Q54 48 50 52 Q46 48 50 44Z" fill="#FDFBF7" opacity="0.4"/>
</svg>`;

const SVG_COOKIE = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="32" fill="#C9975F"/>
  <circle cx="40" cy="42" r="4.5" fill="#6E5138"/>
  <circle cx="60" cy="48" r="4" fill="#6E5138"/>
  <circle cx="46" cy="62" r="4.5" fill="#6E5138"/>
  <circle cx="63" cy="64" r="3.4" fill="#6E5138"/>
  <circle cx="32" cy="56" r="3.4" fill="#6E5138"/>
</svg>`;

const SVG_BUTTER = `<svg viewBox="0 0 100 100">
  <path d="M20 46 L64 36 L80 44 V62 L36 72 L20 64Z" fill="#E7D06C"/>
  <path d="M64 36 L80 44 L36 54 L20 46Z" fill="#EFDC8C"/>
  <path d="M36 54 V72" stroke="#D9C25F" stroke-width="2"/>
  <ellipse cx="50" cy="80" rx="34" ry="6" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="2"/>
</svg>`;

/* ── Czynności: mała postać w akcji ── */

const KID_HEAD = (cx, cy, r = 11) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#E7C4A8"/>
  <path d="M${cx - r} ${cy - 2} Q${cx - r + 2} ${cy - r - 3} ${cx} ${cy - r - 1} Q${cx + r - 2} ${cy - r - 3} ${cx + r} ${cy - 2} Q${cx + r - 4} ${cy - r + 3} ${cx} ${cy - r + 4} Q${cx - r + 4} ${cy - r + 3} ${cx - r} ${cy - 2}Z" fill="#8B5E45"/>
  <circle cx="${cx - 4}" cy="${cy}" r="1.6" fill="#2D3142"/>
  <circle cx="${cx + 4}" cy="${cy}" r="1.6" fill="#2D3142"/>
  <path d="M${cx - 3} ${cy + 5} Q${cx} ${cy + 7} ${cx + 3} ${cy + 5}" stroke="#2D3142" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;

const SVG_RUN = `<svg viewBox="0 0 100 100">
  <path d="M10 44 H26 M8 56 H22" stroke="#B3A78F" stroke-width="3" stroke-linecap="round"/>
  ${KID_HEAD(62, 26)}
  <path d="M58 38 Q54 52 58 62" stroke="#6B8E9F" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M58 44 Q70 46 78 40" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M56 46 Q46 50 40 46" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M58 62 Q70 66 76 76 M56 62 Q46 70 34 70" stroke="#567483" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="80" cy="79" rx="7" ry="4" fill="#B98255"/>
  <ellipse cx="30" cy="71" rx="7" ry="4" fill="#B98255"/>
</svg>`;

const SVG_JUMP = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(50, 22)}
  <path d="M50 34 Q50 48 50 54" stroke="#C96B5A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M46 38 Q34 32 28 22 M54 38 Q66 32 72 22" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M47 54 Q40 62 40 70 M53 54 Q60 62 60 70" stroke="#567483" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="74" rx="6" ry="3.5" fill="#B98255"/>
  <ellipse cx="60" cy="74" rx="6" ry="3.5" fill="#B98255"/>
  <path d="M28 88 H72" stroke="#B3A78F" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_EAT = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(46, 26)}
  <path d="M46 38 Q46 54 46 60" stroke="#7A9A8B" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M50 44 Q60 40 58 32" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="28" rx="4" ry="6" fill="#A9A49B" transform="rotate(30 60 28)"/>
  <path d="M42 44 Q34 48 30 54" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M24 66 H72 Q72 78 60 80 H36 Q24 78 24 66Z" fill="#C96B5A"/>
  <ellipse cx="48" cy="66" rx="24" ry="4" fill="#D98A6C"/>
</svg>`;

const SVG_DRINK = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(50, 28)}
  <path d="M50 40 Q50 58 50 68" stroke="#D08251" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M54 46 Q64 42 62 36" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M58 24 L70 20 L68 36 L58 38Z" fill="#8FB0BE"/>
  <path d="M46 46 Q38 50 34 58" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M40 82 H60 M50 68 V82" stroke="#567483" stroke-width="7" stroke-linecap="round"/>
</svg>`;

const SVG_SLEEP = `<svg viewBox="0 0 100 100">
  <text x="64" y="26" font-family="Quicksand, sans-serif" font-weight="700" font-size="16" fill="#8A7A5F">z</text>
  <text x="74" y="18" font-family="Quicksand, sans-serif" font-weight="700" font-size="12" fill="#B3A78F">z</text>
  <circle cx="28" cy="52" r="11" fill="#E7C4A8"/>
  <path d="M17 50 Q19 41 28 41 Q37 41 39 50 Q33 44 28 45 Q23 44 17 50Z" fill="#8B5E45"/>
  <path d="M23 54 Q25 56 27 54 M31 54 Q33 56 35 54" stroke="#2D3142" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M38 56 Q60 50 84 56 V70 Q60 76 38 70Z" fill="#6B8E9F"/>
  <rect x="14" y="66" width="74" height="8" rx="4" fill="#B98255"/>
  <rect x="16" y="74" width="6" height="12" rx="2.5" fill="#8B5E45"/>
  <rect x="80" y="74" width="6" height="12" rx="2.5" fill="#8B5E45"/>
</svg>`;

const SVG_SING = `<svg viewBox="0 0 100 100">
  <path d="M70 26 V12 Q76 10 80 12 V24" stroke="#7A6A54" stroke-width="3" fill="none"/>
  <circle cx="68" cy="28" r="4" fill="#7A6A54"/><circle cx="78" cy="26" r="4" fill="#7A6A54"/>
  <circle cx="86" cy="44" r="3" fill="#B3A78F"/>
  ${KID_HEAD(42, 30)}
  <ellipse cx="42" cy="37" rx="3" ry="4" fill="#A34F4F"/>
  <path d="M42 42 Q42 58 42 66" stroke="#D9A5A0" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M38 48 Q28 44 24 36 M46 48 Q56 44 60 36" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M39 66 Q36 74 36 80 M45 66 Q48 74 48 80" stroke="#567483" stroke-width="7" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_DANCE = `<svg viewBox="0 0 100 100">
  <circle cx="20" cy="24" r="3.4" fill="#B3A78F"/>
  <path d="M80 18 V32 M80 18 Q86 16 88 18 V30" stroke="#7A6A54" stroke-width="2.5" fill="none"/>
  <circle cx="78" cy="34" r="3.4" fill="#7A6A54"/><circle cx="86" cy="32" r="3.4" fill="#7A6A54"/>
  ${KID_HEAD(50, 26)}
  <path d="M50 38 Q54 52 50 60" stroke="#D9B36C" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M48 42 Q36 36 30 26 M54 44 Q66 42 72 34" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M48 60 Q40 64 36 74 M52 60 Q62 62 66 54" stroke="#567483" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="33" cy="77" rx="6" ry="3.5" fill="#B98255"/>
  <ellipse cx="70" cy="52" rx="6" ry="3.5" fill="#B98255" transform="rotate(40 70 52)"/>
</svg>`;

const SVG_READ = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(50, 26)}
  <path d="M50 38 Q50 52 50 58" stroke="#7A9A8B" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M44 46 Q36 52 34 58 M56 46 Q64 52 66 58" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M50 62 Q36 54 26 58 V74 Q36 70 50 78 Q64 70 74 74 V58 Q64 54 50 62Z" fill="#FDFBF7" stroke="#C96B5A" stroke-width="2.5"/>
  <path d="M50 62 V78" stroke="#E2D9C6" stroke-width="2"/>
  <path d="M32 62 Q40 60 46 64 M54 64 Q60 60 68 62" stroke="#B3A78F" stroke-width="1.8" fill="none"/>
</svg>`;

const SVG_DRAW = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(34, 24)}
  <path d="M34 36 Q34 52 34 60" stroke="#C96B5A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M38 42 Q50 44 58 50" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="56" y="48" width="5" height="14" rx="2.5" fill="#D9B36C" transform="rotate(-36 58 55)"/>
  <rect x="50" y="30" width="38" height="46" rx="3" fill="#FDFBF7" stroke="#E2D9C6" stroke-width="2.5" transform="rotate(6 69 53)"/>
  <path d="M62 44 Q70 38 78 44 Q74 52 66 52Z" fill="#7A9A8B" transform="rotate(6 69 53)"/>
  <circle cx="76" cy="60" r="5" fill="#D9B36C" transform="rotate(6 69 53)"/>
</svg>`;

const SVG_WASH = `<svg viewBox="0 0 100 100">
  <path d="M50 12 Q60 12 60 22 V28 H72 V36 H60" stroke="#A9A49B" stroke-width="6" fill="none"/>
  <path d="M58 40 Q56 48 58 54 M64 40 Q62 48 64 54" stroke="#8FB0BE" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="48" cy="50" r="5" fill="#D7E3E8"/>
  <circle cx="70" cy="48" r="4" fill="#D7E3E8"/>
  <path d="M34 58 Q44 50 56 58 Q66 66 78 60" stroke="#E7C4A8" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M20 78 H80 Q78 88 60 88 H40 Q22 88 20 78Z" fill="#8FB0BE"/>
  <ellipse cx="50" cy="78" rx="30" ry="5" fill="#A7C2CC"/>
</svg>`;

const SVG_WALK = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(50, 24)}
  <path d="M50 36 Q50 50 50 58" stroke="#6B8A7B" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M47 42 Q40 48 38 54 M53 42 Q60 48 62 54" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M48 58 Q42 66 38 76 M52 58 Q58 66 62 76" stroke="#567483" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="36" cy="80" rx="6.5" ry="3.5" fill="#B98255"/>
  <ellipse cx="64" cy="80" rx="6.5" ry="3.5" fill="#B98255"/>
  <path d="M20 88 H80" stroke="#B3A78F" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_SWIM = `<svg viewBox="0 0 100 100">
  ${KID_HEAD(30, 38)}
  <path d="M40 46 Q54 50 66 48" stroke="#C96B5A" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M40 42 Q50 32 60 30" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M66 48 Q76 50 84 46" stroke="#E7C4A8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M8 64 Q18 56 28 64 Q38 72 48 64 Q58 56 68 64 Q78 72 88 64" stroke="#6B8E9F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M12 80 Q22 72 32 80 Q42 88 52 80 Q62 72 72 80 Q80 86 88 80" stroke="#8FB0BE" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

/* ── Pogoda (sun, rain, moon, star są wyżej) ── */

const SVG_CLOUD = `<svg viewBox="0 0 100 100">
  <circle cx="34" cy="52" r="16" fill="#E9E0D0"/>
  <circle cx="54" cy="44" r="20" fill="#E9E0D0"/>
  <circle cx="72" cy="54" r="14" fill="#E9E0D0"/>
  <rect x="20" y="54" width="66" height="16" rx="8" fill="#E9E0D0"/>
  <circle cx="46" cy="50" r="16" fill="#F1EADC"/>
</svg>`;

const SVG_SNOW = `<svg viewBox="0 0 100 100">
  <g stroke="#8FB0BE" stroke-width="4" stroke-linecap="round">
    <path d="M50 14 V86 M19 32 L81 68 M81 32 L19 68"/>
    <path d="M50 14 L44 22 M50 14 L56 22 M50 86 L44 78 M50 86 L56 78"/>
    <path d="M19 32 L29 33 M19 32 L20 42 M81 68 L71 67 M81 68 L80 58"/>
    <path d="M81 32 L71 33 M81 32 L80 42 M19 68 L29 67 M19 68 L20 58"/>
  </g>
  <circle cx="50" cy="50" r="6" fill="#8FB0BE"/>
</svg>`;

const SVG_WIND = `<svg viewBox="0 0 100 100">
  <path d="M12 36 H62 Q74 36 74 26 Q74 18 66 18" stroke="#8FB0BE" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M10 52 H78 Q90 52 90 62 Q90 70 82 70" stroke="#6B8E9F" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M14 68 H50 Q60 68 60 76 Q60 84 52 84" stroke="#8FB0BE" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M28 22 Q34 18 38 22" stroke="#B3A78F" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_STORM = `<svg viewBox="0 0 100 100">
  <circle cx="36" cy="34" r="14" fill="#A9A49B"/>
  <circle cx="56" cy="28" r="17" fill="#A9A49B"/>
  <circle cx="70" cy="38" r="12" fill="#A9A49B"/>
  <rect x="24" y="36" width="58" height="14" rx="7" fill="#A9A49B"/>
  <polygon points="52,52 40,72 50,72 42,92 64,66 53,66 60,52" fill="#D9B36C"/>
</svg>`;

const SVG_RAINBOW = `<svg viewBox="0 0 100 100">
  <path d="M14 78 A36 36 0 0 1 86 78" stroke="#C96B5A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M24 78 A26 26 0 0 1 76 78" stroke="#D9B36C" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M34 78 A16 16 0 0 1 66 78" stroke="#7A9A8B" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M44 78 A6 6 0 0 1 56 78" stroke="#6B8E9F" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="16" cy="80" r="7" fill="#E9E0D0"/><circle cx="26" cy="82" r="6" fill="#E9E0D0"/>
  <circle cx="84" cy="80" r="7" fill="#E9E0D0"/><circle cx="74" cy="82" r="6" fill="#E9E0D0"/>
</svg>`;

const SVG_FOG = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="36" r="16" fill="#D9C25F" opacity="0.55"/>
  <path d="M16 46 H84 M12 58 H88 M18 70 H82 M26 82 H74" stroke="#D9CBB4" stroke-width="7" stroke-linecap="round"/>
</svg>`;

const SVG_ICE = `<svg viewBox="0 0 100 100">
  <path d="M28 34 L64 26 L78 40 L74 72 L38 80 L24 66Z" fill="#D7E3E8"/>
  <path d="M28 34 L64 26 L78 40 L42 48Z" fill="#E8F0F3"/>
  <path d="M42 48 L38 80 M42 48 L78 40" stroke="#A7C2CC" stroke-width="2.5" fill="none"/>
  <path d="M50 58 Q54 54 58 58" stroke="#FDFBF7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_SKY = `<svg viewBox="0 0 100 100">
  <rect x="12" y="18" width="76" height="64" rx="12" fill="#8FB0BE"/>
  <circle cx="70" cy="34" r="10" fill="#D9C25F"/>
  <circle cx="32" cy="42" r="8" fill="#FDFBF7"/><circle cx="42" cy="38" r="10" fill="#FDFBF7"/><circle cx="52" cy="44" r="7" fill="#FDFBF7"/>
  <rect x="26" y="42" width="32" height="8" rx="4" fill="#FDFBF7"/>
  <circle cx="58" cy="64" r="6" fill="#FDFBF7"/><circle cx="66" cy="61" r="7" fill="#FDFBF7"/><circle cx="74" cy="66" r="5" fill="#FDFBF7"/>
  <rect x="54" y="63" width="24" height="6" rx="3" fill="#FDFBF7"/>
</svg>`;

/* ── Zabawki ── */

const SVG_BALL = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="52" r="32" fill="#FDFBF7"/>
  <path d="M50 20 A32 32 0 0 1 78 68 Q60 60 50 20Z" fill="#C96B5A"/>
  <path d="M50 20 A32 32 0 0 0 22 68 Q40 60 50 20Z" fill="#6B8E9F"/>
  <path d="M22 68 Q50 84 78 68 A32 32 0 0 1 22 68Z" fill="#D9B36C"/>
  <circle cx="50" cy="52" r="32" fill="none" stroke="rgba(45,49,66,0.12)" stroke-width="2"/>
</svg>`;

const SVG_DOLL = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="28" r="15" fill="#E7C4A8"/>
  <path d="M35 26 Q36 12 50 12 Q64 12 65 26 Q58 18 50 18 Q42 18 35 26Z" fill="#C9A052"/>
  <circle cx="35" cy="24" r="4" fill="#C9A052"/><circle cx="65" cy="24" r="4" fill="#C9A052"/>
  <circle cx="45" cy="28" r="2" fill="#2D3142"/><circle cx="55" cy="28" r="2" fill="#2D3142"/>
  <path d="M46 34 Q50 37 54 34" stroke="#2D3142" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M40 44 H60 L70 78 H30Z" fill="#D9A5A0"/>
  <path d="M40 50 Q30 54 26 62 M60 50 Q70 54 74 62" stroke="#E7C4A8" stroke-width="5" fill="none" stroke-linecap="round"/>
  <rect x="40" y="78" width="6" height="10" rx="3" fill="#E7C4A8"/>
  <rect x="54" y="78" width="6" height="10" rx="3" fill="#E7C4A8"/>
</svg>`;

const SVG_TEDDY = `<svg viewBox="0 0 100 100">
  <circle cx="32" cy="26" r="9" fill="#B98255"/><circle cx="68" cy="26" r="9" fill="#B98255"/>
  <circle cx="32" cy="26" r="4" fill="#D9A97F"/><circle cx="68" cy="26" r="4" fill="#D9A97F"/>
  <circle cx="50" cy="36" r="18" fill="#B98255"/>
  <ellipse cx="50" cy="42" rx="8" ry="6" fill="#D9A97F"/>
  <circle cx="44" cy="32" r="2.4" fill="#2D3142"/><circle cx="56" cy="32" r="2.4" fill="#2D3142"/>
  <ellipse cx="50" cy="40" rx="2.6" ry="2" fill="#2D3142"/>
  <ellipse cx="50" cy="68" rx="20" ry="17" fill="#B98255"/>
  <ellipse cx="50" cy="70" rx="10" ry="11" fill="#D9A97F"/>
  <ellipse cx="27" cy="62" rx="7" ry="10" fill="#B98255" transform="rotate(20 27 62)"/>
  <ellipse cx="73" cy="62" rx="7" ry="10" fill="#B98255" transform="rotate(-20 73 62)"/>
  <ellipse cx="34" cy="84" rx="9" ry="6" fill="#B98255"/>
  <ellipse cx="66" cy="84" rx="9" ry="6" fill="#B98255"/>
</svg>`;

const SVG_BLOCKS = `<svg viewBox="0 0 100 100">
  <rect x="30" y="18" width="26" height="26" rx="3" fill="#C96B5A"/>
  <text x="43" y="37" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="15" fill="#FDFBF7">A</text>
  <rect x="16" y="48" width="26" height="26" rx="3" fill="#6B8E9F"/>
  <text x="29" y="67" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="15" fill="#FDFBF7">B</text>
  <rect x="46" y="48" width="26" height="26" rx="3" fill="#7A9A8B"/>
  <text x="59" y="67" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="15" fill="#FDFBF7">C</text>
  <rect x="62" y="24" width="20" height="20" rx="3" fill="#D9B36C" transform="rotate(12 72 34)"/>
</svg>`;

const SVG_KITE = `<svg viewBox="0 0 100 100">
  <path d="M50 10 L74 38 L50 66 L26 38Z" fill="#C96B5A"/>
  <path d="M50 10 L74 38 L50 38Z" fill="#D98A6C"/>
  <path d="M50 10 V66 M26 38 H74" stroke="#FDFBF7" stroke-width="2"/>
  <path d="M50 66 Q46 78 52 84 Q58 90 54 94" stroke="#8A7A5F" stroke-width="2.5" fill="none"/>
  <path d="M46 76 L54 72 M50 88 L58 84" stroke="#6B8E9F" stroke-width="3.4" stroke-linecap="round"/>
</svg>`;

const SVG_DRUM = `<svg viewBox="0 0 100 100">
  <path d="M20 16 L46 40 M80 16 L58 40" stroke="#8B5E45" stroke-width="4" stroke-linecap="round"/>
  <circle cx="18" cy="14" r="5" fill="#B98255"/><circle cx="82" cy="14" r="5" fill="#B98255"/>
  <path d="M22 46 H78 V72 Q50 82 22 72Z" fill="#C96B5A"/>
  <ellipse cx="50" cy="46" rx="28" ry="9" fill="#EFE6D8"/>
  <path d="M30 52 L42 72 M42 52 L30 70 M58 52 L70 72 M70 52 L58 70" stroke="#D9B36C" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const SVG_ROBOT = `<svg viewBox="0 0 100 100">
  <path d="M50 10 V18" stroke="#8F8A80" stroke-width="3"/>
  <circle cx="50" cy="9" r="3.4" fill="#C96B5A"/>
  <rect x="34" y="18" width="32" height="26" rx="6" fill="#A9A49B"/>
  <circle cx="43" cy="30" r="4" fill="#6B8E9F"/><circle cx="57" cy="30" r="4" fill="#6B8E9F"/>
  <path d="M44 38 H56" stroke="#2D3142" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="30" y="48" width="40" height="30" rx="6" fill="#BCB8AF"/>
  <rect x="42" y="54" width="16" height="12" rx="2" fill="#7A9A8B"/>
  <rect x="16" y="50" width="10" height="22" rx="5" fill="#A9A49B"/>
  <rect x="74" y="50" width="10" height="22" rx="5" fill="#A9A49B"/>
  <rect x="35" y="80" width="11" height="10" rx="3" fill="#A9A49B"/>
  <rect x="54" y="80" width="11" height="10" rx="3" fill="#A9A49B"/>
</svg>`;

const SVG_PUZZLE = `<svg viewBox="0 0 100 100">
  <path d="M18 30 H40 Q38 22 44 20 Q52 18 52 26 Q52 30 48 30 H70 V52 Q78 50 80 56 Q82 64 74 64 Q70 64 70 60 V82 H18Z" fill="#7A9A8B"/>
  <path d="M70 30 H48 Q52 30 52 26 Q52 18 44 20 Q38 22 40 30 H18 V52 Q10 50 8 56 Q6 64 14 64 Q18 64 18 60" fill="none"/>
  <rect x="52" y="12" width="30" height="0" fill="none"/>
  <path d="M70 30 V52 Q78 50 80 56 Q82 64 74 64 Q70 64 70 60 V82 H48 Q50 90 44 92 Q36 94 36 86 Q36 82 40 82" fill="none" stroke="#6B8A7B" stroke-width="2"/>
</svg>`;

const SVG_DINOSAUR = `<svg viewBox="0 0 100 100">
  <polygon points="34,38 40,28 46,38" fill="#6B8A7B"/>
  <polygon points="46,34 52,24 58,34" fill="#6B8A7B"/>
  <polygon points="58,36 64,27 70,36" fill="#6B8A7B"/>
  <ellipse cx="50" cy="56" rx="27" ry="19" fill="#7A9A8B"/>
  <path d="M24 60 Q8 64 6 76 Q18 76 28 68Z" fill="#7A9A8B"/>
  <circle cx="76" cy="42" r="13" fill="#7A9A8B"/>
  <ellipse cx="84" cy="47" rx="8" ry="5" fill="#A8C0A0"/>
  <circle cx="78" cy="38" r="2.4" fill="#2D3142"/>
  <rect x="36" y="70" width="10" height="16" rx="4" fill="#6B8A7B"/>
  <rect x="56" y="70" width="10" height="16" rx="4" fill="#6B8A7B"/>
  <ellipse cx="46" cy="58" rx="4" ry="3" fill="#A8C0A0"/>
  <ellipse cx="58" cy="62" rx="3.4" ry="2.6" fill="#A8C0A0"/>
</svg>`;

const SVG_BALLOON = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="38" rx="24" ry="28" fill="#C96B5A"/>
  <ellipse cx="42" cy="28" rx="7" ry="10" fill="#D98A6C" transform="rotate(-16 42 28)"/>
  <polygon points="46,64 54,64 50,72" fill="#A34F4F"/>
  <path d="M50 72 Q44 80 50 86 Q56 92 52 96" stroke="#8A7A5F" stroke-width="2.5" fill="none"/>
</svg>`;

const SVG_SWING = `<svg viewBox="0 0 100 100">
  <path d="M16 88 L34 16 H66 L84 88" stroke="#B98255" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M34 16 H66" stroke="#8B5E45" stroke-width="6" stroke-linecap="round"/>
  <path d="M42 18 V62 M58 18 V62" stroke="#8A7A5F" stroke-width="3"/>
  <rect x="36" y="62" width="28" height="7" rx="3" fill="#C96B5A"/>
</svg>`;

const SVG_SLIDE = `<svg viewBox="0 0 100 100">
  <path d="M22 22 V78 M34 22 V60" stroke="#A9A49B" stroke-width="4"/>
  <path d="M22 30 H34 M22 42 H34 M22 54 H34" stroke="#A9A49B" stroke-width="3.4"/>
  <path d="M28 18 H40 Q44 18 46 24 Q56 56 84 74 Q88 78 84 82 Q60 84 44 66 Q30 50 26 24Z" fill="#C96B5A"/>
  <path d="M84 82 Q60 84 44 66" stroke="#A34F4F" stroke-width="3" fill="none"/>
</svg>`;

/* ── Przeciwieństwa ── */

const SVG_BIG = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="38" fill="#6B8E9F"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#567483" stroke-width="3"/>
</svg>`;
const SVG_SMALL = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="11" fill="#6B8E9F"/>
  <circle cx="50" cy="50" r="11" fill="none" stroke="#567483" stroke-width="2"/>
</svg>`;
const SVG_HOT = `<svg viewBox="0 0 100 100">
  <circle cx="38" cy="30" r="12" fill="#D9B36C"/>
  <g stroke="#D9B36C" stroke-width="3.4" stroke-linecap="round">
    <path d="M38 10 V16 M38 44 V50 M18 30 H24 M52 30 H58 M24 16 L28 20 M48 40 L52 44 M52 16 L48 20 M24 44 L28 40"/>
  </g>
  <rect x="66" y="18" width="12" height="52" rx="6" fill="#EFE6D8" stroke="#D9CBB4" stroke-width="2"/>
  <circle cx="72" cy="78" r="10" fill="#C96B5A"/>
  <rect x="68" y="28" width="8" height="46" rx="4" fill="#C96B5A"/>
</svg>`;
const SVG_COLD = `<svg viewBox="0 0 100 100">
  <g stroke="#8FB0BE" stroke-width="3.4" stroke-linecap="round">
    <path d="M34 12 V48 M19 21 L49 39 M49 21 L19 39"/>
    <path d="M34 12 L30 17 M34 12 L38 17 M34 48 L30 43 M34 48 L38 43"/>
  </g>
  <rect x="66" y="18" width="12" height="52" rx="6" fill="#EFE6D8" stroke="#D9CBB4" stroke-width="2"/>
  <circle cx="72" cy="78" r="10" fill="#6B8E9F"/>
  <rect x="68" y="54" width="8" height="20" rx="4" fill="#6B8E9F"/>
</svg>`;
const SVG_HAPPY = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="32" fill="#D9B36C"/>
  <circle cx="39" cy="43" r="4" fill="#2D3142"/>
  <circle cx="61" cy="43" r="4" fill="#2D3142"/>
  <path d="M34 58 Q50 72 66 58" stroke="#2D3142" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <circle cx="31" cy="54" r="4.5" fill="#D98A6C" opacity="0.55"/>
  <circle cx="69" cy="54" r="4.5" fill="#D98A6C" opacity="0.55"/>
</svg>`;
const SVG_SAD = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="32" fill="#8FB0BE"/>
  <circle cx="39" cy="44" r="4" fill="#2D3142"/>
  <circle cx="61" cy="44" r="4" fill="#2D3142"/>
  <path d="M36 66 Q50 56 64 66" stroke="#2D3142" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M64 50 Q66 58 62 62 Q58 58 60 52Z" fill="#6B8E9F"/>
</svg>`;
const SVG_DAY = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="44" r="16" fill="#D9C25F"/>
  <g stroke="#D9C25F" stroke-width="4" stroke-linecap="round">
    <path d="M50 16 V24 M22 44 H30 M70 44 H78 M30 24 L36 30 M70 24 L64 30"/>
  </g>
  <path d="M12 76 H88" stroke="#7A9A8B" stroke-width="5" stroke-linecap="round"/>
  <path d="M24 76 Q28 66 36 70 M62 70 Q70 64 76 76" stroke="#7A9A8B" stroke-width="3.4" fill="none" stroke-linecap="round"/>
</svg>`;
const SVG_NIGHT = `<svg viewBox="0 0 100 100">
  <rect x="12" y="14" width="76" height="72" rx="14" fill="#46564C"/>
  <path d="M58 28 A22 22 0 1 0 58 70 A17 17 0 1 1 58 28Z" fill="#D9C25F"/>
  <circle cx="70" cy="32" r="2.4" fill="#EFE6D8"/>
  <circle cx="76" cy="52" r="3" fill="#EFE6D8"/>
  <circle cx="68" cy="70" r="2" fill="#EFE6D8"/>
  <circle cx="26" cy="30" r="2" fill="#EFE6D8"/>
</svg>`;
const SVG_FAST = `<svg viewBox="0 0 100 100">
  <path d="M8 36 H30 M4 48 H26 M10 60 H30" stroke="#B3A78F" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="58" cy="50" rx="24" ry="15" fill="#A5937E"/>
  <circle cx="80" cy="42" r="9" fill="#A5937E"/>
  <ellipse cx="80" cy="30" rx="4" ry="10" fill="#A5937E" transform="rotate(-30 80 30)"/>
  <ellipse cx="88" cy="34" rx="3.4" ry="8" fill="#A5937E" transform="rotate(-14 88 34)"/>
  <circle cx="84" cy="40" r="2" fill="#2D3142"/>
  <circle cx="38" cy="52" r="6" fill="#FDFBF7"/>
  <path d="M46 62 Q56 68 68 64 M76 58 Q82 60 86 56" stroke="#8F7D68" stroke-width="5" stroke-linecap="round" fill="none"/>
</svg>`;
const SVG_SLOW = `<svg viewBox="0 0 100 100">
  <circle cx="46" cy="52" r="22" fill="#C9975F"/>
  <path d="M46 34 Q58 36 60 48 Q60 60 48 60 Q40 60 40 52 Q40 46 46 46 Q51 46 51 51" stroke="#B07F45" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M24 66 Q16 64 12 56 M22 70 Q30 60 24 52" fill="none"/>
  <path d="M66 60 Q76 58 80 48" stroke="#A8A868" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="82" cy="44" r="6" fill="#A8A868"/>
  <path d="M80 40 Q78 34 74 32 M85 39 Q86 33 90 31" stroke="#A8A868" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M20 76 H84" stroke="#B3A78F" stroke-width="4" stroke-linecap="round"/>
</svg>`;
const SVG_CLEAN = `<svg viewBox="0 0 100 100">
  <path d="M32 26 L44 20 Q50 26 56 20 L68 26 L76 40 L64 46 L64 78 H36 V46 L24 40Z" fill="#8FB0BE"/>
  <path d="M50 40 L52 46 L58 48 L52 50 L50 56 L48 50 L42 48 L48 46Z" fill="#FDFBF7"/>
  <path d="M28 60 L29 63 L32 64 L29 65 L28 68 L27 65 L24 64 L27 63Z" fill="#D7E3E8"/>
  <path d="M74 56 L75 59 L78 60 L75 61 L74 64 L73 61 L70 60 L73 59Z" fill="#D7E3E8"/>
</svg>`;
const SVG_DIRTY = `<svg viewBox="0 0 100 100">
  <path d="M32 26 L44 20 Q50 26 56 20 L68 26 L76 40 L64 46 L64 78 H36 V46 L24 40Z" fill="#8FB0BE"/>
  <ellipse cx="46" cy="54" rx="7" ry="5" fill="#8B6A48"/>
  <ellipse cx="58" cy="66" rx="5" ry="4" fill="#6E5138"/>
  <circle cx="40" cy="68" r="3.4" fill="#8B6A48"/>
  <circle cx="60" cy="38" r="3" fill="#6E5138"/>
</svg>`;

/* ── Wyprawa: plecak i przebarwialne przedmioty ── */

const BACKPACK_SVG = `<svg viewBox="0 0 100 100">
  <path d="M34 26 Q34 12 50 12 Q66 12 66 26" stroke="#6E6B47" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="20" y="26" width="60" height="62" rx="16" fill="#8B885E"/>
  <rect x="20" y="26" width="60" height="20" rx="10" fill="#77744E"/>
  <rect x="32" y="52" width="36" height="28" rx="9" fill="#A5A276"/>
  <rect x="44" y="48" width="12" height="10" rx="3" fill="#6E6B47"/>
  <rect x="47" y="54" width="6" height="10" rx="2" fill="#D9CBB4"/>
</svg>`;

/* Zestawy kolorów (main / jaśniejszy / ciemniejszy) do przebarwiania. */
const TRIP_COLORS = {
  red:    { pl: 'czerwone', c: ['#C96B5A', '#D98A6C', '#A34F4F'] },
  blue:   { pl: 'niebieskie', c: ['#6B8E9F', '#8FB0BE', '#567483'] },
  green:  { pl: 'zielone', c: ['#7A9A8B', '#8CAB9C', '#6B8A7B'] },
  yellow: { pl: 'żółte', c: ['#D9B36C', '#E7C987', '#C9A052'] },
};
function recolorSvg(svg, from, to) {
  let out = svg;
  from.forEach((f, i) => { if (to[i]) out = out.split(f).join(to[i]); });
  return out;
}
/* Bazy rysowane w schemacie czerwonym/niebieskim — from wymienia ich kolory. */
const TRIP_BASES = [
  { en: 'car',     pl: 'auta',    svg: SVG_CAR,     from: ['#C96B5A', '#D98A6C', '#A34F4F'] },
  { en: 'balloon', pl: 'balony',  svg: SVG_BALLOON, from: ['#C96B5A', '#D98A6C', '#A34F4F'] },
  { en: 'cup',     pl: 'kubki',   svg: SVG_CUP,     from: ['#6B8E9F', '#8FB0BE', '#567483'] },
  { en: 'kite',    pl: 'latawce', svg: SVG_KITE,    from: ['#C96B5A', '#D98A6C', '#A34F4F'] },
];
function tripItemSvg(baseEn, colorKey) {
  const base = TRIP_BASES.find(b => b.en === baseEn);
  return recolorSvg(base.svg, base.from, TRIP_COLORS[colorKey].c);
}
/* Wyprawa działa w tematach z policzalnymi, „pakowalnymi" rzeczami. */
const TRIP_THEMES = ['animals', 'vegetables', 'fruit', 'home', 'clothes', 'vehicles', 'toys', 'food', 'shapes'];

/* Angielska liczba mnoga — reguły + wyjątki z naszych pakietów. */
const PLURAL_IRREG = { sheep: 'sheep', fish: 'fish', mouse: 'mice', bus: 'buses' };
function plural(en) {
  if (PLURAL_IRREG[en]) return PLURAL_IRREG[en];
  if (/(ss|x|ch|sh)$/.test(en)) return en + 'es';
  if (/s$/.test(en)) return en; /* gloves, boots, trousers — już mnogie */
  if (/[^aeiou]y$/.test(en)) return en.slice(0, -1) + 'ies';
  return en + 's';
}

/* ── Owoce, część dalsza ── */

const SVG_MANGO = `<svg viewBox="0 0 100 100">
  <path d="M34 26 Q60 14 74 34 Q86 52 72 72 Q56 90 38 78 Q20 66 24 46 Q26 32 34 26Z" fill="#D9A94F"/>
  <path d="M40 34 Q58 26 68 40" stroke="#C9836C" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>
  <rect x="30" y="14" width="6" height="12" rx="3" fill="#8B5E45" transform="rotate(-24 33 20)"/>
  <path d="M36 20 Q48 10 58 16 Q48 24 36 20Z" fill="#7A9A8B"/>
</svg>`;

const SVG_PINEAPPLE = `<svg viewBox="0 0 100 100">
  <path d="M42 30 Q34 18 24 16 Q34 12 44 20 Q44 8 50 2 Q56 8 56 20 Q66 12 76 16 Q66 18 58 30Z" fill="#7A9A8B"/>
  <ellipse cx="50" cy="62" rx="24" ry="30" fill="#D9B36C"/>
  <path d="M32 44 L68 80 M28 56 L64 88 M36 34 L72 68 M46 30 L74 56 M26 70 L52 92" stroke="#C9A052" stroke-width="2.5"/>
  <path d="M68 44 L32 80 M72 56 L36 88 M64 34 L28 68 M54 30 L26 56 M74 70 L48 92" stroke="#C9A052" stroke-width="2.5"/>
</svg>`;

const SVG_MELON = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="54" r="32" fill="#A8A868"/>
  <path d="M50 22 Q42 54 50 86 M26 32 Q34 54 28 78 M74 32 Q66 54 72 78 M19 48 Q50 40 81 48 M20 66 Q50 74 80 66" stroke="#96955C" stroke-width="2.5" fill="none"/>
  <rect x="47" y="14" width="6" height="10" rx="3" fill="#8B5E45"/>
</svg>`;

const SVG_BLUEBERRY = `<svg viewBox="0 0 100 100">
  <circle cx="34" cy="46" r="17" fill="#567483"/>
  <circle cx="66" cy="44" r="15" fill="#6B8E9F"/>
  <circle cx="50" cy="70" r="16" fill="#4C6472"/>
  <path d="M30 42 L38 42 M34 38 L34 46" stroke="#3E4E63" stroke-width="2" stroke-linecap="round"/>
  <path d="M62 40 L70 40 M66 36 L66 44" stroke="#3E4E63" stroke-width="2" stroke-linecap="round"/>
  <path d="M46 66 L54 66 M50 62 L50 70" stroke="#3E4E63" stroke-width="2" stroke-linecap="round"/>
  <path d="M42 26 Q50 16 60 22" stroke="#7A9A8B" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_RASPBERRY = `<svg viewBox="0 0 100 100">
  <path d="M50 24 Q40 14 30 16 Q36 24 44 26 M50 24 Q60 14 70 16 Q64 24 56 26" fill="#7A9A8B"/>
  <circle cx="38" cy="40" r="9" fill="#B85C5C"/><circle cx="54" cy="38" r="9" fill="#C96B5A"/><circle cx="68" cy="44" r="8" fill="#B85C5C"/>
  <circle cx="32" cy="56" r="9" fill="#C96B5A"/><circle cx="48" cy="54" r="9" fill="#B85C5C"/><circle cx="64" cy="58" r="8" fill="#C96B5A"/>
  <circle cx="40" cy="70" r="9" fill="#B85C5C"/><circle cx="56" cy="70" r="8" fill="#C96B5A"/>
  <circle cx="48" cy="82" r="8" fill="#B85C5C"/>
</svg>`;

const SVG_COCONUT = `<svg viewBox="0 0 100 100">
  <circle cx="42" cy="56" r="26" fill="#8B6A48"/>
  <path d="M28 38 Q42 30 56 38 M24 52 Q28 44 34 40 M60 40 Q64 46 66 52" stroke="#6E5138" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="36" cy="52" r="3" fill="#4F3A28"/><circle cx="48" cy="50" r="3" fill="#4F3A28"/><circle cx="42" cy="62" r="3" fill="#4F3A28"/>
  <path d="M66 66 A20 20 0 0 1 90 46 Q88 66 74 72Z" fill="#EFE6D8"/>
  <path d="M66 66 A20 20 0 0 1 90 46" stroke="#8B6A48" stroke-width="4" fill="none"/>
</svg>`;

/* ── Warzywa, część dalsza ── */

const SVG_CABBAGE = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="54" r="30" fill="#A8C0A0"/>
  <path d="M24 48 Q36 30 56 28 Q44 40 40 56 Q38 70 44 82" stroke="#8CAB84" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M76 46 Q66 32 50 30 M78 58 Q70 70 58 78" stroke="#8CAB84" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M22 60 Q30 74 44 80" stroke="#8CAB84" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_BEETROOT = `<svg viewBox="0 0 100 100">
  <path d="M50 34 Q72 38 72 58 Q72 76 50 86 Q28 76 28 58 Q28 38 50 34Z" fill="#A34F6A"/>
  <path d="M50 86 Q49 92 46 96" stroke="#8B3F58" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M44 34 Q38 16 30 10 Q42 14 48 28 M52 32 Q54 12 64 6 Q60 18 56 32Z" fill="#7A9A8B"/>
  <path d="M42 48 Q40 62 44 74" stroke="#8B3F58" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_GARLIC = `<svg viewBox="0 0 100 100">
  <path d="M50 30 Q54 40 62 46 Q74 54 72 68 Q70 82 50 84 Q30 82 28 68 Q26 54 38 46 Q46 40 50 30Z" fill="#EFE6D8"/>
  <path d="M50 34 Q48 60 46 82 M42 46 Q38 64 38 80 M58 46 Q62 64 62 80" stroke="#D9CBB4" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M48 30 Q46 20 42 16 Q50 18 52 28Z" fill="#A8A868"/>
</svg>`;

const SVG_LETTUCE = `<svg viewBox="0 0 100 100">
  <path d="M20 58 Q14 40 28 36 Q26 22 42 24 Q46 12 58 20 Q70 14 74 28 Q88 30 82 46 Q90 58 76 64 Q60 74 40 72 Q24 70 20 58Z" fill="#A8C0A0"/>
  <path d="M30 44 Q42 36 56 40 M36 56 Q50 48 66 52 M48 28 Q52 36 54 44" stroke="#8CAB84" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="72" rx="26" ry="8" fill="#8CAB84"/>
</svg>`;

const SVG_BEAN = `<svg viewBox="0 0 100 100">
  <path d="M26 34 Q22 24 30 20 Q36 26 36 34 Q52 30 66 40 Q82 52 76 70 Q70 84 54 80 Q60 70 56 60 Q50 48 38 44 Q28 42 26 34Z" fill="#A8C0A0"/>
  <path d="M34 78 Q26 82 22 78 Q26 70 34 70 Q30 60 36 54 Q44 60 42 70Z" fill="#8CAB84"/>
</svg>`;

const SVG_ZUCCHINI = `<svg viewBox="0 0 100 100">
  <path d="M20 74 Q14 66 22 58 Q40 42 62 32 Q74 26 80 32 Q86 38 80 48 Q68 68 44 78 Q28 84 20 74Z" fill="#6B8A7B"/>
  <path d="M28 68 Q46 56 66 44" stroke="#A8C0A0" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="76" y="22" width="8" height="14" rx="4" fill="#8B5E45" transform="rotate(35 80 29)"/>
</svg>`;

/* ── Dom, część dalsza ── */

const SVG_SOFA = `<svg viewBox="0 0 100 100">
  <rect x="18" y="30" width="64" height="26" rx="10" fill="#C98F8A"/>
  <rect x="10" y="46" width="18" height="28" rx="8" fill="#B87F7A"/>
  <rect x="72" y="46" width="18" height="28" rx="8" fill="#B87F7A"/>
  <rect x="24" y="50" width="26" height="16" rx="6" fill="#D9A5A0"/>
  <rect x="50" y="50" width="26" height="16" rx="6" fill="#D9A5A0"/>
  <rect x="18" y="64" width="64" height="10" rx="5" fill="#B87F7A"/>
  <rect x="22" y="74" width="8" height="10" rx="3" fill="#8B5E45"/>
  <rect x="70" y="74" width="8" height="10" rx="3" fill="#8B5E45"/>
</svg>`;

const SVG_TV = `<svg viewBox="0 0 100 100">
  <rect x="14" y="22" width="72" height="48" rx="5" fill="#4A4A45"/>
  <rect x="19" y="27" width="62" height="38" rx="3" fill="#8FB0BE"/>
  <path d="M30 58 Q40 44 52 52 Q62 40 72 50 L72 60 H30Z" fill="#A8C0A0"/>
  <circle cx="64" cy="36" r="6" fill="#D9C25F"/>
  <path d="M40 70 L36 82 M60 70 L64 82" stroke="#4A4A45" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const SVG_WARDROBE = `<svg viewBox="0 0 100 100">
  <rect x="24" y="12" width="52" height="74" rx="4" fill="#B98255"/>
  <path d="M50 12 V86" stroke="#8B5E45" stroke-width="3"/>
  <rect x="29" y="18" width="17" height="56" rx="2" fill="#C99B72"/>
  <rect x="54" y="18" width="17" height="56" rx="2" fill="#C99B72"/>
  <circle cx="44" cy="48" r="2.5" fill="#6E5138"/>
  <circle cx="56" cy="48" r="2.5" fill="#6E5138"/>
  <rect x="26" y="86" width="7" height="8" rx="2" fill="#8B5E45"/>
  <rect x="67" y="86" width="7" height="8" rx="2" fill="#8B5E45"/>
</svg>`;

const SVG_SHOWER = `<svg viewBox="0 0 100 100">
  <path d="M30 26 Q30 14 42 14 H50" stroke="#A9A49B" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M24 30 Q30 22 40 24 Q44 32 38 38 Q28 40 24 30Z" fill="#A9A49B"/>
  <path d="M28 46 L24 58 M36 46 L34 60 M44 44 L44 58 M32 66 L30 78 M40 66 L40 80" stroke="#8FB0BE" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M62 88 H86 M74 88 V40 Q74 34 68 34" stroke="#A9A49B" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

const SVG_FRIDGE = `<svg viewBox="0 0 100 100">
  <rect x="30" y="10" width="40" height="80" rx="6" fill="#D7E3E8"/>
  <path d="M30 40 H70" stroke="#A7C2CC" stroke-width="3"/>
  <rect x="36" y="20" width="4" height="12" rx="2" fill="#8F8A80"/>
  <rect x="36" y="48" width="4" height="18" rx="2" fill="#8F8A80"/>
</svg>`;

const SVG_MIRROR = `<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="46" rx="26" ry="34" fill="#B98255"/>
  <ellipse cx="50" cy="46" rx="19" ry="27" fill="#D7E3E8"/>
  <path d="M40 32 Q46 24 54 26 M38 44 Q40 36 44 32" stroke="#FDFBF7" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M42 80 H58 L62 90 H38Z" fill="#8B5E45"/>
</svg>`;

const SVG_CLOCK = `<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="32" fill="#B98255"/>
  <circle cx="50" cy="50" r="25" fill="#FDFBF7"/>
  <path d="M50 30 V34 M50 66 V70 M30 50 H34 M66 50 H70" stroke="#8A7A5F" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M50 50 L50 36 M50 50 L60 56" stroke="#2D3142" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="3" fill="#2D3142"/>
  <circle cx="34" cy="24" r="6" fill="#C9A052"/><circle cx="66" cy="24" r="6" fill="#C9A052"/>
</svg>`;

const SVG_PHONE = `<svg viewBox="0 0 100 100">
  <rect x="32" y="12" width="36" height="76" rx="8" fill="#4A4A45"/>
  <rect x="36" y="20" width="28" height="56" rx="3" fill="#8FB0BE"/>
  <circle cx="50" cy="82" r="3.4" fill="#A9A49B"/>
  <circle cx="44" cy="34" r="6" fill="#D9C25F"/>
  <path d="M40 56 Q50 48 60 56 L60 64 H40Z" fill="#A8C0A0"/>
</svg>`;

/* ── Dotknij!: duża postać dziecka + strefy dotyku ── */

const KID_SVG = `<svg viewBox="0 0 200 320">
  <rect x="78" y="220" width="18" height="72" rx="9" fill="#E7C4A8"/>
  <rect x="104" y="220" width="18" height="72" rx="9" fill="#E7C4A8"/>
  <ellipse cx="84" cy="300" rx="18" ry="9" fill="#B98255"/>
  <ellipse cx="116" cy="300" rx="18" ry="9" fill="#B98255"/>
  <path d="M66 122 Q40 140 36 172" stroke="#E7C4A8" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="M134 122 Q160 140 164 172" stroke="#E7C4A8" stroke-width="18" fill="none" stroke-linecap="round"/>
  <circle cx="34" cy="182" r="13" fill="#E7C4A8"/>
  <circle cx="166" cy="182" r="13" fill="#E7C4A8"/>
  <path d="M62 112 Q100 100 138 112 L134 196 Q100 206 66 196Z" fill="#7A9A8B"/>
  <ellipse cx="100" cy="160" rx="26" ry="22" fill="#8CAB9C"/>
  <path d="M66 196 Q100 206 134 196 L132 232 H106 L100 216 L94 232 H68Z" fill="#6B8E9F"/>
  <ellipse cx="56" cy="64" rx="8" ry="12" fill="#E7C4A8"/>
  <ellipse cx="144" cy="64" rx="8" ry="12" fill="#E7C4A8"/>
  <ellipse cx="56" cy="64" rx="3.5" ry="6" fill="#C99B72"/>
  <ellipse cx="144" cy="64" rx="3.5" ry="6" fill="#C99B72"/>
  <circle cx="100" cy="64" r="42" fill="#E7C4A8"/>
  <path d="M58 54 Q60 24 100 22 Q140 24 142 54 Q130 34 100 34 Q70 34 58 54Z" fill="#8B5E45"/>
  <ellipse cx="84" cy="58" rx="9" ry="10" fill="#FDFBF7"/>
  <ellipse cx="116" cy="58" rx="9" ry="10" fill="#FDFBF7"/>
  <circle cx="85" cy="60" r="4.5" fill="#6E5138"/>
  <circle cx="115" cy="60" r="4.5" fill="#6E5138"/>
  <path d="M74 44 Q84 40 92 44 M108 44 Q116 40 126 44" stroke="#8B5E45" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M100 62 Q104 70 100 74 Q96 70 100 62Z" fill="#D9A97F"/>
  <path d="M82 84 Q100 98 118 84 Q112 98 100 98 Q88 98 82 84Z" fill="#C96B5A"/>
  <path d="M85 85 H115 V90 Q100 93 85 90Z" fill="#FDFBF7"/>
  <circle cx="72" cy="76" r="6" fill="#D9A5A0" opacity="0.6"/>
  <circle cx="128" cy="76" r="6" fill="#D9A5A0" opacity="0.6"/>
</svg>`;

/* Strefy dotyku w % kontenera postaci; parts = słowa, które strefa zalicza. */
const KID_ZONES = [
  { parts: 'hair', l: 29, t: 6, w: 42, h: 7 },
  { parts: 'ears', l: 22, t: 16, w: 9, h: 9 },
  { parts: 'ears', l: 69, t: 16, w: 9, h: 9 },
  { parts: 'eyes', l: 36, t: 15, w: 10, h: 7 },
  { parts: 'eyes', l: 54, t: 15, w: 10, h: 7 },
  { parts: 'nose', l: 45, t: 20, w: 10, h: 5.5 },
  { parts: 'mouth,teeth', l: 40, t: 25.5, w: 20, h: 6 },
  { parts: 'head', l: 34, t: 11.5, w: 32, h: 3.5 },
  { parts: 'head', l: 31, t: 20, w: 6, h: 7 },
  { parts: 'head', l: 63, t: 20, w: 6, h: 7 },
  { parts: 'arm', l: 13, t: 37, w: 13, h: 15 },
  { parts: 'arm', l: 74, t: 37, w: 13, h: 15 },
  { parts: 'hands', l: 9, t: 53, w: 13, h: 9 },
  { parts: 'hands', l: 78, t: 53, w: 13, h: 9 },
  { parts: 'tummy', l: 37, t: 44, w: 26, h: 15 },
  { parts: 'legs', l: 37, t: 69, w: 11, h: 20 },
  { parts: 'legs', l: 52, t: 69, w: 11, h: 20 },
  { parts: 'feet', l: 32, t: 91, w: 18, h: 6.5 },
  { parts: 'feet', l: 50, t: 91, w: 18, h: 6.5 },
];

/* ── Sortowanie: koszyk + pula rzeczy dla wielkości ── */

const SVG_BASKET = `<svg viewBox="0 0 100 100">
  <path d="M30 42 Q30 22 50 22 Q70 22 70 42" stroke="#B07F45" stroke-width="5" fill="none"/>
  <path d="M16 42 H84 L76 84 Q50 90 24 84Z" fill="#C9975F"/>
  <path d="M20 54 H80 M23 66 H77 M26 76 H74" stroke="#B07F45" stroke-width="3"/>
</svg>`;

const SORT_SIZE_POOL = [
  { en: 'apple', svg: SVG_APPLE }, { en: 'ball', svg: SVG_BALL },
  { en: 'teddy', svg: SVG_TEDDY }, { en: 'cup', svg: SVG_CUP },
  { en: 'banana', svg: SVG_BANANA }, { en: 'car', svg: SVG_CAR },
  { en: 'star', svg: SVG_STAR }, { en: 'balloon', svg: SVG_BALLOON },
];

/* ── Ubieranie na pogodę ── */

const DRESS_ITEMS = {
  umbrella: SVG_UMBRELLA, sunglasses: SVG_SUNGLASSES, boots: SVG_BOOTS,
  scarf: SVG_SCARF, gloves: SVG_GLOVES, cap: SVG_CAP, jacket: SVG_JACKET,
  hat: SVG_HAT, shirt: SVG_SHIRT, dress: SVG_DRESS, skirt: SVG_SKIRT,
  shoe: SVG_SHOE, sock: SVG_SOCK, trousers: SVG_TROUSERS,
};
/* Prośby idą po jednej rzeczy naraz; intro z pogodą tylko przy pierwszej. */
const DRESS_SCENES = [
  { w: 'rain', svg: SVG_RAIN, need: ['umbrella', 'boots'], intro: `It's raining!` },
  { w: 'snow', svg: SVG_SNOW, need: ['scarf', 'gloves'], intro: `It's snowing!` },
  { w: 'sun', svg: SVG_SUN, need: ['cap', 'sunglasses'], intro: `It's sunny!` },
  { w: 'wind', svg: SVG_WIND, need: ['jacket', 'hat'], intro: `It's windy!` },
];

/* ── Sprzątanie domu: każda rzecz wraca na swoje miejsce ── */

const CLEAN_ITEMS = {
  plate: SVG_PLATE, cup: SVG_CUP, fork: SVG_FORK, spoon: SVG_SPOON,
  pillow: SVG_PILLOW, teddy: SVG_TEDDY, book: SVG_BOOK,
  shirt: SVG_SHIRT, sock: SVG_SOCK, cap: SVG_CAP,
  ball: SVG_BALL, car: SVG_CAR, blocks: SVG_BLOCKS,
};
/* Polecenia idą po jednej rzeczy naraz (place buduje zdanie
 * „Put the plate on the table!") — dziecko nie zapamięta trzech. */
const CLEAN_ROUNDS = [
  { spot: 'table', spotSvg: SVG_TABLE, place: 'on the table', items: ['plate', 'cup', 'fork'] },
  { spot: 'bed', spotSvg: SVG_BED, place: 'on the bed', items: ['pillow', 'teddy', 'book'] },
  { spot: 'wardrobe', spotSvg: SVG_WARDROBE, place: 'in the wardrobe', items: ['shirt', 'sock', 'cap'] },
  { spot: 'basket', spotSvg: SVG_BASKET, place: 'in the basket', items: ['ball', 'car', 'blocks'] },
];

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
      { en: 'duck',       pl: 'kaczka',     svg: SVG_DUCK },
      { en: 'horse',      pl: 'koń',        svg: SVG_HORSE },
      { en: 'sheep',      pl: 'owca',       svg: SVG_SHEEP },
      { en: 'pig',        pl: 'świnka',     svg: SVG_PIG },
      { en: 'mouse',      pl: 'mysz',       svg: SVG_MOUSE },
      { en: 'frog',       pl: 'żaba',       svg: SVG_FROG },
      { en: 'bird',       pl: 'ptak',       svg: SVG_BIRD },
      { en: 'bee',        pl: 'pszczoła',   svg: SVG_BEE },
      { en: 'fish',       pl: 'ryba',       svg: SVG_FISH },
      { en: 'cow',        pl: 'krowa',      svg: SVG_COW },
      { en: 'chicken',    pl: 'kura',       svg: SVG_CHICKEN },
      { en: 'turtle',     pl: 'żółw',       svg: SVG_TURTLE },
    ],
  },
  {
    id: 'vegetables',
    pl: 'Warzywa',
    en: 'Vegetables',
    coverSvg: SVG_CARROT,
    words: [
      { en: 'carrot',     pl: 'marchewka',  svg: SVG_CARROT },
      { en: 'tomato',     pl: 'pomidor',    svg: SVG_TOMATO },
      { en: 'cucumber',   pl: 'ogórek',     svg: SVG_CUCUMBER },
      { en: 'potato',     pl: 'ziemniak',   svg: SVG_POTATO },
      { en: 'onion',      pl: 'cebula',     svg: SVG_ONION },
      { en: 'peas',       pl: 'groszek',    svg: SVG_PEAS },
      { en: 'corn',       pl: 'kukurydza',  svg: SVG_CORN },
      { en: 'pepper',     pl: 'papryka',    svg: SVG_PEPPER },
      { en: 'pumpkin',    pl: 'dynia',      svg: SVG_PUMPKIN },
      { en: 'broccoli',   pl: 'brokuł',     svg: SVG_BROCCOLI },
      { en: 'mushroom',   pl: 'grzyb',      svg: SVG_MUSHROOM },
      { en: 'radish',     pl: 'rzodkiewka', svg: SVG_RADISH },
      { en: 'cabbage',    pl: 'kapusta',    svg: SVG_CABBAGE },
      { en: 'beetroot',   pl: 'burak',      svg: SVG_BEETROOT },
      { en: 'garlic',     pl: 'czosnek',    svg: SVG_GARLIC },
      { en: 'lettuce',    pl: 'sałata',     svg: SVG_LETTUCE },
      { en: 'bean',       pl: 'fasolka',    svg: SVG_BEAN },
      { en: 'zucchini',   pl: 'cukinia',    svg: SVG_ZUCCHINI },
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
      { en: 'lemon',      pl: 'cytryna',    svg: SVG_LEMON },
      { en: 'plum',       pl: 'śliwka',     svg: SVG_PLUM },
      { en: 'grapes',     pl: 'winogrona',  svg: SVG_GRAPES },
      { en: 'watermelon', pl: 'arbuz',      svg: SVG_WATERMELON },
      { en: 'peach',      pl: 'brzoskwinia',svg: SVG_PEACH },
      { en: 'kiwi',       pl: 'kiwi',       svg: SVG_KIWI },
      { en: 'mango',      pl: 'mango',      svg: SVG_MANGO },
      { en: 'pineapple',  pl: 'ananas',     svg: SVG_PINEAPPLE },
      { en: 'melon',      pl: 'melon',      svg: SVG_MELON },
      { en: 'blueberry',  pl: 'borówka',    svg: SVG_BLUEBERRY },
      { en: 'raspberry',  pl: 'malina',     svg: SVG_RASPBERRY },
      { en: 'coconut',    pl: 'kokos',      svg: SVG_COCONUT },
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
      { en: 'orange',     pl: 'pomarańczowy', svg: colorTabletSvg('#D08251') },
      { en: 'purple',     pl: 'fioletowy',  svg: colorTabletSvg('#8B7A9A') },
      { en: 'white',      pl: 'biały',      svg: colorTabletSvg('#F5F1E8') },
      { en: 'black',      pl: 'czarny',     svg: colorTabletSvg('#3D3D3D') },
      { en: 'grey',       pl: 'szary',      svg: colorTabletSvg('#A9A49B') },
      { en: 'gold',       pl: 'złoty',      svg: colorTabletSvg('#C9A94F') },
      { en: 'light blue', pl: 'błękitny',   svg: colorTabletSvg('#A7C2CC') },
      { en: 'navy',       pl: 'granatowy',  svg: colorTabletSvg('#3E4E63') },
      { en: 'turquoise',  pl: 'turkusowy',  svg: colorTabletSvg('#6FA8A0') },
      { en: 'lime',       pl: 'limonkowy',  svg: colorTabletSvg('#A8C060') },
      { en: 'silver',     pl: 'srebrny',    svg: colorTabletSvg('#C0BDB4') },
      { en: 'beige',      pl: 'beżowy',     svg: colorTabletSvg('#D8C9AC') },
    ],
  },
  {
    id: 'home',
    pl: 'Dom',
    en: 'At home',
    coverSvg: SVG_CUP,
    words: [
      { en: 'plate',      pl: 'talerz',     svg: SVG_PLATE },
      { en: 'cup',        pl: 'kubek',      svg: SVG_CUP },
      { en: 'glass',      pl: 'szklanka',   svg: SVG_GLASS },
      { en: 'spoon',      pl: 'łyżka',      svg: SVG_SPOON },
      { en: 'fork',       pl: 'widelec',    svg: SVG_FORK },
      { en: 'table',      pl: 'stół',       svg: SVG_TABLE },
      { en: 'chair',      pl: 'krzesło',    svg: SVG_CHAIR },
      { en: 'armchair',   pl: 'fotel',      svg: SVG_ARMCHAIR },
      { en: 'bed',        pl: 'łóżko',      svg: SVG_BED },
      { en: 'lamp',       pl: 'lampa',      svg: SVG_LAMP },
      { en: 'door',       pl: 'drzwi',      svg: SVG_DOOR },
      { en: 'window',     pl: 'okno',       svg: SVG_WINDOW },
      { en: 'sofa',       pl: 'kanapa',     svg: SVG_SOFA },
      { en: 'TV',         pl: 'telewizor',  svg: SVG_TV },
      { en: 'wardrobe',   pl: 'szafa',      svg: SVG_WARDROBE },
      { en: 'shower',     pl: 'prysznic',   svg: SVG_SHOWER },
      { en: 'fridge',     pl: 'lodówka',    svg: SVG_FRIDGE },
      { en: 'mirror',     pl: 'lustro',     svg: SVG_MIRROR },
      { en: 'clock',      pl: 'zegar',      svg: SVG_CLOCK },
      { en: 'phone',      pl: 'telefon',    svg: SVG_PHONE },
      { en: 'pillow',     pl: 'poduszka',   svg: SVG_PILLOW },
      { en: 'towel',      pl: 'ręcznik',    svg: SVG_TOWEL },
      { en: 'soap',       pl: 'mydło',      svg: SVG_SOAP },
      { en: 'book',       pl: 'książka',    svg: SVG_BOOK },
    ],
  },
  {
    id: 'clothes',
    pl: 'Ubrania',
    en: 'Clothes',
    coverSvg: SVG_HAT,
    words: [
      { en: 'hat',        pl: 'kapelusz',   svg: SVG_HAT },
      { en: 'cap',        pl: 'czapka',     svg: SVG_CAP },
      { en: 'shirt',      pl: 'koszulka',   svg: SVG_SHIRT },
      { en: 'trousers',   pl: 'spodnie',    svg: SVG_TROUSERS },
      { en: 'dress',      pl: 'sukienka',   svg: SVG_DRESS },
      { en: 'skirt',      pl: 'spódnica',   svg: SVG_SKIRT },
      { en: 'jacket',     pl: 'kurtka',     svg: SVG_JACKET },
      { en: 'scarf',      pl: 'szalik',     svg: SVG_SCARF },
      { en: 'gloves',     pl: 'rękawiczki', svg: SVG_GLOVES },
      { en: 'boots',      pl: 'kalosze',    svg: SVG_BOOTS },
      { en: 'sock',       pl: 'skarpetka',  svg: SVG_SOCK },
      { en: 'shoe',       pl: 'but',        svg: SVG_SHOE },
    ],
  },
  {
    id: 'jobs',
    pl: 'Zawody',
    en: 'Jobs',
    coverSvg: PROFESSIONS[2].svg,
    words: PROFESSIONS,
  },
  {
    id: 'vehicles',
    pl: 'Pojazdy',
    en: 'Vehicles',
    coverSvg: SVG_CAR,
    words: [
      { en: 'car',        pl: 'samochód',   svg: SVG_CAR },
      { en: 'bus',        pl: 'autobus',    svg: SVG_BUS },
      { en: 'bike',       pl: 'rower',      svg: SVG_BIKE },
      { en: 'scooter',    pl: 'hulajnoga',  svg: SVG_SCOOTER },
      { en: 'train',      pl: 'pociąg',     svg: SVG_TRAIN },
      { en: 'tractor',    pl: 'traktor',    svg: SVG_TRACTOR },
      { en: 'truck',      pl: 'ciężarówka', svg: SVG_TRUCK },
      { en: 'boat',       pl: 'łódka',      svg: SVG_BOAT },
      { en: 'ship',       pl: 'statek',     svg: SVG_SHIP },
      { en: 'plane',      pl: 'samolot',    svg: SVG_PLANE },
      { en: 'helicopter', pl: 'helikopter', svg: SVG_HELICOPTER },
      { en: 'rocket',     pl: 'rakieta',    svg: SVG_ROCKET },
    ],
  },
  {
    id: 'numbers',
    pl: 'Liczby',
    en: 'Numbers',
    coverSvg: numberSvg(3),
    words: [
      { en: 'one',    pl: 'jeden',      svg: numberSvg(1) },
      { en: 'two',    pl: 'dwa',        svg: numberSvg(2) },
      { en: 'three',  pl: 'trzy',       svg: numberSvg(3) },
      { en: 'four',   pl: 'cztery',     svg: numberSvg(4) },
      { en: 'five',   pl: 'pięć',       svg: numberSvg(5) },
      { en: 'six',    pl: 'sześć',      svg: numberSvg(6) },
      { en: 'seven',  pl: 'siedem',     svg: numberSvg(7) },
      { en: 'eight',  pl: 'osiem',      svg: numberSvg(8) },
      { en: 'nine',   pl: 'dziewięć',   svg: numberSvg(9) },
      { en: 'ten',    pl: 'dziesięć',   svg: numberSvg(10) },
      { en: 'eleven', pl: 'jedenaście', svg: numberSvg(11) },
      { en: 'twelve', pl: 'dwanaście',  svg: numberSvg(12) },
    ],
  },
  {
    id: 'shapes',
    pl: 'Kształty',
    en: 'Shapes',
    coverSvg: SHAPES[2].svg,
    words: SHAPES,
  },
  {
    id: 'body',
    pl: 'Ciało',
    en: 'My body',
    coverSvg: SVG_HEAD,
    words: [
      { en: 'head',   pl: 'głowa',  svg: SVG_HEAD },
      { en: 'eyes',   pl: 'oczy',   svg: SVG_EYES },
      { en: 'nose',   pl: 'nos',    svg: SVG_NOSE },
      { en: 'mouth',  pl: 'buzia',  svg: SVG_MOUTH },
      { en: 'ears',   pl: 'uszy',   svg: SVG_EARS },
      { en: 'hair',   pl: 'włosy',  svg: SVG_HAIR },
      { en: 'hands',  pl: 'ręce',   svg: SVG_HANDS },
      { en: 'feet',   pl: 'stopy',  svg: SVG_FEET },
      { en: 'legs',   pl: 'nogi',   svg: SVG_LEGS },
      { en: 'arm',    pl: 'ramię',  svg: SVG_ARMS },
      { en: 'tummy',  pl: 'brzuszek', svg: SVG_TUMMY },
      { en: 'teeth',  pl: 'zęby',   svg: SVG_TEETH },
    ],
  },
  {
    id: 'food',
    pl: 'Jedzenie',
    en: 'Food',
    coverSvg: SVG_BREAD,
    words: [
      { en: 'bread',  pl: 'chleb',   svg: SVG_BREAD },
      { en: 'milk',   pl: 'mleko',   svg: SVG_MILK },
      { en: 'cheese', pl: 'ser',     svg: SVG_CHEESE },
      { en: 'egg',    pl: 'jajko',   svg: SVG_EGG },
      { en: 'butter', pl: 'masło',   svg: SVG_BUTTER },
      { en: 'honey',  pl: 'miód',    svg: SVG_HONEY },
      { en: 'soup',   pl: 'zupa',    svg: SVG_SOUP },
      { en: 'pizza',  pl: 'pizza',   svg: SVG_PIZZA },
      { en: 'cake',   pl: 'ciasto',  svg: SVG_CAKE },
      { en: 'cookie', pl: 'ciastko', svg: SVG_COOKIE },
      { en: 'juice',  pl: 'sok',     svg: SVG_JUICE },
      { en: 'water',  pl: 'woda',    svg: SVG_WATER },
    ],
  },
  {
    id: 'actions',
    pl: 'Czynności',
    en: 'Actions',
    coverSvg: SVG_RUN,
    words: [
      { en: 'run',    pl: 'biegać',  svg: SVG_RUN },
      { en: 'jump',   pl: 'skakać',  svg: SVG_JUMP },
      { en: 'walk',   pl: 'chodzić', svg: SVG_WALK },
      { en: 'eat',    pl: 'jeść',    svg: SVG_EAT },
      { en: 'drink',  pl: 'pić',     svg: SVG_DRINK },
      { en: 'sleep',  pl: 'spać',    svg: SVG_SLEEP },
      { en: 'sing',   pl: 'śpiewać', svg: SVG_SING },
      { en: 'dance',  pl: 'tańczyć', svg: SVG_DANCE },
      { en: 'read',   pl: 'czytać',  svg: SVG_READ },
      { en: 'draw',   pl: 'rysować', svg: SVG_DRAW },
      { en: 'wash',   pl: 'myć',     svg: SVG_WASH },
      { en: 'swim',   pl: 'pływać',  svg: SVG_SWIM },
    ],
  },
  {
    id: 'weather',
    pl: 'Pogoda',
    en: 'Weather',
    coverSvg: SVG_RAINBOW,
    words: [
      { en: 'sun',     pl: 'słońce',  svg: SVG_SUN },
      { en: 'cloud',   pl: 'chmura',  svg: SVG_CLOUD },
      { en: 'rain',    pl: 'deszcz',  svg: SVG_RAIN },
      { en: 'snow',    pl: 'śnieg',   svg: SVG_SNOW },
      { en: 'wind',    pl: 'wiatr',   svg: SVG_WIND },
      { en: 'storm',   pl: 'burza',   svg: SVG_STORM },
      { en: 'rainbow', pl: 'tęcza',   svg: SVG_RAINBOW },
      { en: 'fog',     pl: 'mgła',    svg: SVG_FOG },
      { en: 'ice',     pl: 'lód',     svg: SVG_ICE },
      { en: 'sky',     pl: 'niebo',   svg: SVG_SKY },
      { en: 'moon',    pl: 'księżyc', svg: SVG_MOON },
      { en: 'star',    pl: 'gwiazda', svg: SVG_STAR },
    ],
  },
  {
    id: 'toys',
    pl: 'Zabawki',
    en: 'Toys',
    coverSvg: SVG_TEDDY,
    words: [
      { en: 'ball',     pl: 'piłka',    svg: SVG_BALL },
      { en: 'doll',     pl: 'lalka',    svg: SVG_DOLL },
      { en: 'teddy',    pl: 'miś przytulanka', svg: SVG_TEDDY },
      { en: 'blocks',   pl: 'klocki',   svg: SVG_BLOCKS },
      { en: 'kite',     pl: 'latawiec', svg: SVG_KITE },
      { en: 'drum',     pl: 'bębenek',  svg: SVG_DRUM },
      { en: 'robot',    pl: 'robot',    svg: SVG_ROBOT },
      { en: 'puzzle',   pl: 'puzzle',   svg: SVG_PUZZLE },
      { en: 'dinosaur', pl: 'dinozaur', svg: SVG_DINOSAUR },
      { en: 'balloon',  pl: 'balon',    svg: SVG_BALLOON },
      { en: 'swing',    pl: 'huśtawka', svg: SVG_SWING },
      { en: 'slide',    pl: 'zjeżdżalnia', svg: SVG_SLIDE },
    ],
  },
  {
    id: 'opposites',
    pl: 'Przeciwieństwa',
    en: 'Opposites',
    coverSvg: SVG_HOT,
    words: [
      { en: 'big',    pl: 'duży',     svg: SVG_BIG },
      { en: 'small',  pl: 'mały',     svg: SVG_SMALL },
      { en: 'hot',    pl: 'gorący',   svg: SVG_HOT },
      { en: 'cold',   pl: 'zimny',    svg: SVG_COLD },
      { en: 'happy',  pl: 'wesoły',   svg: SVG_HAPPY },
      { en: 'sad',    pl: 'smutny',   svg: SVG_SAD },
      { en: 'day',    pl: 'dzień',    svg: SVG_DAY },
      { en: 'night',  pl: 'noc',      svg: SVG_NIGHT },
      { en: 'fast',   pl: 'szybki',   svg: SVG_FAST },
      { en: 'slow',   pl: 'wolny',    svg: SVG_SLOW },
      { en: 'clean',  pl: 'czysty',   svg: SVG_CLEAN },
      { en: 'dirty',  pl: 'brudny',   svg: SVG_DIRTY },
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
  { id: 'moon-star',  a: { en: 'moon', pl: 'księżyc',  svg: SVG_MOON },   b: { en: 'star',   pl: 'gwiazdka',svg: SVG_STAR } },
  { id: 'rain-umbrella', a: { en: 'rain', pl: 'deszcz', svg: SVG_RAIN },  b: { en: 'umbrella', pl: 'parasol', svg: SVG_UMBRELLA } },
  { id: 'sun-sunglasses', a: { en: 'sun', pl: 'słońce', svg: SVG_SUN },   b: { en: 'sunglasses', pl: 'okulary słoneczne', svg: SVG_SUNGLASSES } },
  { id: 'brush-paste', a: { en: 'toothbrush', pl: 'szczoteczka', svg: SVG_TOOTHBRUSH }, b: { en: 'toothpaste', pl: 'pasta do zębów', svg: SVG_TOOTHPASTE } },
  { id: 'pencil-paper', a: { en: 'pencil', pl: 'ołówek', svg: SVG_PENCIL }, b: { en: 'paper', pl: 'kartka', svg: SVG_PAPER } },
  { id: 'paint-brush', a: { en: 'paint', pl: 'farba',   svg: SVG_PAINT },  b: { en: 'brush', pl: 'pędzel',  svg: SVG_BRUSH } },
  { id: 'bed-pillow', a: { en: 'bed',   pl: 'łóżko',    svg: SVG_BED },    b: { en: 'pillow', pl: 'poduszka', svg: SVG_PILLOW } },
  { id: 'cup-teapot', a: { en: 'cup',   pl: 'kubek',    svg: SVG_CUP },    b: { en: 'teapot', pl: 'czajniczek', svg: SVG_TEAPOT } },
  { id: 'fork-knife', a: { en: 'fork',  pl: 'widelec',  svg: SVG_FORK },   b: { en: 'knife',  pl: 'nóż',     svg: SVG_KNIFE } },
  { id: 'spider-web', a: { en: 'spider', pl: 'pająk',   svg: SVG_SPIDER }, b: { en: 'web',    pl: 'pajęczyna', svg: SVG_WEB } },
  { id: 'fish-aquarium', a: { en: 'fish', pl: 'rybka',  svg: SVG_FISH },   b: { en: 'aquarium', pl: 'akwarium', svg: SVG_AQUARIUM } },
  { id: 'car-wheel',  a: { en: 'car',   pl: 'samochód', svg: SVG_CAR },    b: { en: 'wheel',  pl: 'koło',    svg: SVG_WHEEL } },
  { id: 'train-track', a: { en: 'train', pl: 'pociąg',  svg: SVG_TRAIN },  b: { en: 'track',  pl: 'tory',    svg: SVG_TRACK } },
  { id: 'book-glasses', a: { en: 'book', pl: 'książka', svg: SVG_BOOK },   b: { en: 'glasses', pl: 'okulary', svg: SVG_GLASSES } },
  { id: 'hammer-nail', a: { en: 'hammer', pl: 'młotek', svg: SVG_HAMMER }, b: { en: 'nail',   pl: 'gwóźdź',  svg: SVG_NAIL } },
  { id: 'soap-towel', a: { en: 'soap',  pl: 'mydło',    svg: SVG_SOAP },   b: { en: 'towel',  pl: 'ręcznik', svg: SVG_TOWEL } },
  /* Prawdziwe przeciwieństwa */
  { id: 'big-small',   a: { en: 'big',   pl: 'duży',   svg: SVG_BIG },   b: { en: 'small', pl: 'mały',   svg: SVG_SMALL } },
  { id: 'hot-cold',    a: { en: 'hot',   pl: 'gorący', svg: SVG_HOT },   b: { en: 'cold',  pl: 'zimny',  svg: SVG_COLD } },
  { id: 'happy-sad',   a: { en: 'happy', pl: 'wesoły', svg: SVG_HAPPY }, b: { en: 'sad',   pl: 'smutny', svg: SVG_SAD } },
  { id: 'day-night',   a: { en: 'day',   pl: 'dzień',  svg: SVG_DAY },   b: { en: 'night', pl: 'noc',    svg: SVG_NIGHT } },
  { id: 'fast-slow',   a: { en: 'fast',  pl: 'szybki', svg: SVG_FAST },  b: { en: 'slow',  pl: 'wolny',  svg: SVG_SLOW } },
  { id: 'clean-dirty', a: { en: 'clean', pl: 'czysty', svg: SVG_CLEAN }, b: { en: 'dirty', pl: 'brudny', svg: SVG_DIRTY } },
  { id: 'rabbit-carrot', a: { en: 'rabbit', pl: 'królik', svg: SVG_RABBIT }, b: { en: 'carrot', pl: 'marchewka', svg: SVG_CARROT } },
  { id: 'mouse-cheese', a: { en: 'mouse', pl: 'mysz',    svg: SVG_MOUSE },  b: { en: 'cheese', pl: 'ser',    svg: SVG_CHEESE } },
  { id: 'cow-milk',    a: { en: 'cow',   pl: 'krowa',   svg: SVG_COW },    b: { en: 'milk',   pl: 'mleko',  svg: SVG_MILK } },
  { id: 'chicken-egg', a: { en: 'chicken', pl: 'kura',  svg: SVG_CHICKEN },b: { en: 'egg',    pl: 'jajko',  svg: SVG_EGG } },
  { id: 'kite-wind',   a: { en: 'kite',  pl: 'latawiec',svg: SVG_KITE },   b: { en: 'wind',   pl: 'wiatr',  svg: SVG_WIND } },
  { id: 'snow-gloves', a: { en: 'snow',  pl: 'śnieg',   svg: SVG_SNOW },   b: { en: 'gloves', pl: 'rękawiczki', svg: SVG_GLOVES } },
  { id: 'bear-honey',  a: { en: 'bear',  pl: 'miś',     svg: SVG_BEAR },   b: { en: 'honey',  pl: 'miód',   svg: SVG_HONEY } },
  { id: 'bee-honey',   a: { en: 'bee',   pl: 'pszczoła',svg: SVG_BEE },    b: { en: 'honey',  pl: 'miód',   svg: SVG_HONEY } },
  { id: 'bread-butter', a: { en: 'bread', pl: 'chleb',  svg: SVG_BREAD },  b: { en: 'butter', pl: 'masło',  svg: SVG_BUTTER } },
  { id: 'cookie-milk', a: { en: 'cookie', pl: 'ciastko', svg: SVG_COOKIE }, b: { en: 'milk',  pl: 'mleko',  svg: SVG_MILK } },
  { id: 'soup-spoon',  a: { en: 'soup',  pl: 'zupa',    svg: SVG_SOUP },   b: { en: 'spoon',  pl: 'łyżka',  svg: SVG_SPOON } },
  { id: 'juice-orange', a: { en: 'juice', pl: 'sok',    svg: SVG_JUICE },  b: { en: 'orange', pl: 'pomarańcza', svg: SVG_ORANGE } },
  { id: 'water-glass', a: { en: 'water', pl: 'woda',    svg: SVG_WATER },  b: { en: 'glass',  pl: 'szklanka', svg: SVG_GLASS } },
  { id: 'table-chair', a: { en: 'table', pl: 'stół',    svg: SVG_TABLE },  b: { en: 'chair',  pl: 'krzesło', svg: SVG_CHAIR } },
  { id: 'tv-sofa',     a: { en: 'TV',    pl: 'telewizor', svg: SVG_TV },   b: { en: 'sofa',   pl: 'kanapa', svg: SVG_SOFA } },
  { id: 'wardrobe-jacket', a: { en: 'wardrobe', pl: 'szafa', svg: SVG_WARDROBE }, b: { en: 'jacket', pl: 'kurtka', svg: SVG_JACKET } },
  { id: 'door-key',    a: { en: 'door',  pl: 'drzwi',   svg: SVG_DOOR },   b: { en: 'key',    pl: 'klucz',  svg: SVG_KEY } },
  { id: 'scarf-snow',  a: { en: 'scarf', pl: 'szalik',  svg: SVG_SCARF },  b: { en: 'snow',   pl: 'śnieg',  svg: SVG_SNOW } },
  { id: 'boots-rain',  a: { en: 'boots', pl: 'kalosze', svg: SVG_BOOTS },  b: { en: 'rain',   pl: 'deszcz', svg: SVG_RAIN } },
  { id: 'hat-sun',     a: { en: 'hat',   pl: 'kapelusz', svg: SVG_HAT },   b: { en: 'sun',    pl: 'słońce', svg: SVG_SUN } },
  { id: 'cloud-rain',  a: { en: 'cloud', pl: 'chmura',  svg: SVG_CLOUD },  b: { en: 'rain',   pl: 'deszcz', svg: SVG_RAIN } },
  { id: 'teeth-toothbrush', a: { en: 'teeth', pl: 'zęby', svg: SVG_TEETH }, b: { en: 'toothbrush', pl: 'szczoteczka', svg: SVG_TOOTHBRUSH } },
  { id: 'eyes-glasses', a: { en: 'eyes', pl: 'oczy',    svg: SVG_EYES },   b: { en: 'glasses', pl: 'okulary', svg: SVG_GLASSES } },
  { id: 'hands-gloves', a: { en: 'hands', pl: 'ręce',   svg: SVG_HANDS },  b: { en: 'gloves', pl: 'rękawiczki', svg: SVG_GLOVES } },
  { id: 'nose-flower', a: { en: 'nose',  pl: 'nos',     svg: SVG_NOSE },   b: { en: 'flower', pl: 'kwiat',  svg: SVG_FLOWER } },
  { id: 'doll-dress',  a: { en: 'doll',  pl: 'lalka',   svg: SVG_DOLL },   b: { en: 'dress',  pl: 'sukienka', svg: SVG_DRESS } },
  { id: 'balloon-sky', a: { en: 'balloon', pl: 'balon', svg: SVG_BALLOON }, b: { en: 'sky',   pl: 'niebo',  svg: SVG_SKY } },
  { id: 'swing-slide', a: { en: 'swing', pl: 'huśtawka', svg: SVG_SWING }, b: { en: 'slide',  pl: 'zjeżdżalnia', svg: SVG_SLIDE } },
  { id: 'teddy-bed',   a: { en: 'teddy', pl: 'miś przytulanka', svg: SVG_TEDDY }, b: { en: 'bed', pl: 'łóżko', svg: SVG_BED } },
  { id: 'dinosaur-egg', a: { en: 'dinosaur', pl: 'dinozaur', svg: SVG_DINOSAUR }, b: { en: 'egg', pl: 'jajko', svg: SVG_EGG } },
  { id: 'rocket-moon', a: { en: 'rocket', pl: 'rakieta', svg: SVG_ROCKET }, b: { en: 'moon',  pl: 'księżyc', svg: SVG_MOON } },
  { id: 'swim-fish',   a: { en: 'swim',  pl: 'pływać',  svg: SVG_SWIM },   b: { en: 'fish',   pl: 'ryba',   svg: SVG_FISH } },
  { id: 'read-book',   a: { en: 'read',  pl: 'czytać',  svg: SVG_READ },   b: { en: 'book',   pl: 'książka', svg: SVG_BOOK } },
  { id: 'draw-pencil', a: { en: 'draw',  pl: 'rysować', svg: SVG_DRAW },   b: { en: 'pencil', pl: 'ołówek', svg: SVG_PENCIL } },
  { id: 'eat-apple',   a: { en: 'eat',   pl: 'jeść',    svg: SVG_EAT },    b: { en: 'apple',  pl: 'jabłko', svg: SVG_APPLE } },
  { id: 'drink-juice', a: { en: 'drink', pl: 'pić',     svg: SVG_DRINK },  b: { en: 'juice',  pl: 'sok',    svg: SVG_JUICE } },
  { id: 'wash-soap',   a: { en: 'wash',  pl: 'myć',     svg: SVG_WASH },   b: { en: 'soap',   pl: 'mydło',  svg: SVG_SOAP } },
  { id: 'sing-bird',   a: { en: 'sing',  pl: 'śpiewać', svg: SVG_SING },   b: { en: 'bird',   pl: 'ptak',   svg: SVG_BIRD } },
  { id: 'run-shoe',    a: { en: 'run',   pl: 'biegać',  svg: SVG_RUN },    b: { en: 'shoe',   pl: 'but',    svg: SVG_SHOE } },
  { id: 'jump-frog',   a: { en: 'jump',  pl: 'skakać',  svg: SVG_JUMP },   b: { en: 'frog',   pl: 'żaba',   svg: SVG_FROG } },
  { id: 'dance-drum',  a: { en: 'dance', pl: 'tańczyć', svg: SVG_DANCE },  b: { en: 'drum',   pl: 'bębenek', svg: SVG_DRUM } },
  { id: 'walk-dog',    a: { en: 'walk',  pl: 'chodzić', svg: SVG_WALK },   b: { en: 'dog',    pl: 'pies',   svg: SVG_DOG } },
  { id: 'sleep-pillow', a: { en: 'sleep', pl: 'spać',   svg: SVG_SLEEP },  b: { en: 'pillow', pl: 'poduszka', svg: SVG_PILLOW } },
  { id: 'lemon-teapot', a: { en: 'lemon', pl: 'cytryna', svg: SVG_LEMON }, b: { en: 'teapot', pl: 'czajniczek', svg: SVG_TEAPOT } },
  { id: 'strawberry-cake', a: { en: 'strawberry', pl: 'truskawka', svg: SVG_STRAWBERRY }, b: { en: 'cake', pl: 'ciasto', svg: SVG_CAKE } },
  { id: 'night-owl',   a: { en: 'night', pl: 'noc',     svg: SVG_NIGHT },  b: { en: 'owl',    pl: 'sowa',   svg: SVG_OWL } },
  { id: 'day-sun',     a: { en: 'day',   pl: 'dzień',   svg: SVG_DAY },    b: { en: 'sun',    pl: 'słońce', svg: SVG_SUN } },
  { id: 'slow-turtle', a: { en: 'slow',  pl: 'wolny',   svg: SVG_SLOW },   b: { en: 'turtle', pl: 'żółw',   svg: SVG_TURTLE } },
  { id: 'fast-rocket', a: { en: 'fast',  pl: 'szybki',  svg: SVG_FAST },   b: { en: 'rocket', pl: 'rakieta', svg: SVG_ROCKET } },
  { id: 'plane-cloud', a: { en: 'plane', pl: 'samolot', svg: SVG_PLANE },  b: { en: 'cloud',  pl: 'chmura', svg: SVG_CLOUD } },
  { id: 'duck-water',  a: { en: 'duck',  pl: 'kaczka',  svg: SVG_DUCK },   b: { en: 'water',  pl: 'woda',   svg: SVG_WATER } },
  { id: 'cat-mouse',   a: { en: 'cat',   pl: 'kot',     svg: SVG_CAT },    b: { en: 'mouse',  pl: 'mysz',   svg: SVG_MOUSE } },
];

/* ── Pudełka: słowa tematu w porcjach po 6, odblokowywane po kolei ── */
const BOX_SIZE = 6;
function themeBoxes(theme) {
  const out = [];
  for (let i = 0; i < theme.words.length; i += BOX_SIZE) out.push(theme.words.slice(i, i + BOX_SIZE));
  return out;
}

/* Ikony interfejsu (kreska 1.6–2, zaokrąglone końcówki — spokojna kreska) */
const UI = {
  hand: `<svg viewBox="0 0 24 24" fill="none">
    <path d="M8.5 12V5.7a1.4 1.4 0 0 1 2.8 0V10m0-4.6V4.6a1.4 1.4 0 0 1 2.8 0V10m0-3.6a1.4 1.4 0 0 1 2.8 0V11m0-.6a1.4 1.4 0 0 1 2.8 0v4.3a6.3 6.3 0 0 1-6.3 6.3h-.9a6.3 6.3 0 0 1-5.2-2.7l-2.5-3.6a1.4 1.4 0 0 1 2.2-1.7l1.5 1.6" stroke="#2D3142" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
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
  play: `<svg viewBox="0 0 24 24" fill="none"><path d="M8.5 5.5 L18 12 L8.5 18.5Z" fill="#7A9A8B" stroke="#7A9A8B" stroke-width="2" stroke-linejoin="round"/></svg>`,
  find: `<svg viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="6" stroke="#7A6A54" stroke-width="1.9"/>
    <path d="M15 15 L20 20" stroke="#7A6A54" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
  form: `<svg viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="#7A6A54" stroke-width="1.8"/>
    <path d="M8.5 8 H15.5 M8.5 12 H15.5 M8.5 16 H12.5" stroke="#7A6A54" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none">
    <path d="M6 8 Q6 4.5 9.5 4.5 H17 M17 4.5 L14 1.8 M17 4.5 L14 7.2" stroke="#7A6A54" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 16 Q18 19.5 14.5 19.5 H7 M7 19.5 L10 16.8 M7 19.5 L10 22.2" stroke="#7A6A54" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};
