// PTK Host Academy — _hero_assets.js
// =============================================================================
// Rich hand-crafted SVG hero illustrations for each property.
// Each illustration captures the architectural character and atmosphere of
// that tier — designed to feel instantly recognisable as "that London".
//
// Dimensions: 600 × 360 viewBox (5:3 ratio, matches renderModelHome).
// =============================================================================

function renderHeroAsset(propId) {
  if (propId === 1) return heroNottingHill();
  if (propId === 2) return heroShoreditch();
  if (propId === 3) return heroChelsea();
  if (propId === 4) return heroMayfair();
  if (propId === 5) return heroKensington();
  if (propId === 6) return heroCoventGarden();
  if (propId === 7) return heroTestSandbox();
  return '';
}

// ─── TEST SANDBOX HERO ──────────────────────────────────────────────────
// Distinctive purple lab-themed visual so it's instantly recognisable as "the dev sandbox"
function heroTestSandbox() {
  return svgWrap(`
    <defs>
      <linearGradient id="ts-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a1a52"/>
        <stop offset="0.6" stop-color="#5a2870"/>
        <stop offset="1" stop-color="#7a3a90"/>
      </linearGradient>
      <pattern id="ts-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" fill="none"/>
        <path d="M 30 0 L 0 0 0 30" stroke="#9a5ab0" stroke-width="0.5" opacity="0.4" fill="none"/>
      </pattern>
    </defs>
    <rect width="600" height="360" fill="url(#ts-bg)"/>
    <rect width="600" height="360" fill="url(#ts-grid)"/>

    <!-- Glowing test tube cluster -->
    <g transform="translate(300, 200)">
      <!-- Tube 1 -->
      <rect x="-90" y="-100" width="36" height="160" rx="18" fill="#1a0a28" stroke="#c884e8" stroke-width="2"/>
      <rect x="-86" y="-20" width="28" height="76" rx="14" fill="#9333EA" opacity="0.85"/>
      <ellipse cx="-72" cy="-20" rx="14" ry="3" fill="#c884e8" opacity="0.6"/>
      <circle cx="-78" cy="0" r="3" fill="#fff" opacity="0.6"/>
      <circle cx="-66" cy="20" r="2.5" fill="#fff" opacity="0.5"/>
      <circle cx="-72" cy="40" r="2" fill="#fff" opacity="0.4"/>
      <!-- Tube 2 (centre, taller) -->
      <rect x="-22" y="-130" width="44" height="190" rx="22" fill="#1a0a28" stroke="#e884ff" stroke-width="2"/>
      <rect x="-18" y="-50" width="36" height="106" rx="18" fill="#c4519c" opacity="0.85"/>
      <ellipse cx="0" cy="-50" rx="18" ry="4" fill="#e884ff" opacity="0.7"/>
      <circle cx="-8" cy="-30" r="3" fill="#fff" opacity="0.7"/>
      <circle cx="6" cy="-10" r="2.5" fill="#fff" opacity="0.6"/>
      <circle cx="-4" cy="15" r="2" fill="#fff" opacity="0.5"/>
      <circle cx="8" cy="35" r="3" fill="#fff" opacity="0.6"/>
      <!-- Tube 3 -->
      <rect x="54" y="-90" width="36" height="150" rx="18" fill="#1a0a28" stroke="#84e8ff" stroke-width="2"/>
      <rect x="58" y="-30" width="28" height="86" rx="14" fill="#5ac8e8" opacity="0.85"/>
      <ellipse cx="72" cy="-30" rx="14" ry="3" fill="#84e8ff" opacity="0.6"/>
      <circle cx="66" cy="-10" r="2.5" fill="#fff" opacity="0.6"/>
      <circle cx="78" cy="10" r="3" fill="#fff" opacity="0.5"/>
      <circle cx="68" cy="30" r="2" fill="#fff" opacity="0.4"/>
    </g>

    <!-- Glow halos around tubes -->
    <circle cx="228" cy="220" r="40" fill="#9333EA" opacity="0.15"/>
    <circle cx="300" cy="180" r="55" fill="#e884ff" opacity="0.12"/>
    <circle cx="372" cy="220" r="40" fill="#5ac8e8" opacity="0.15"/>

    <!-- Bubbles drifting up -->
    <g opacity="0.6">
      <circle cx="220" cy="100" r="4" fill="#fff" opacity="0.3"/>
      <circle cx="240" cy="80" r="3" fill="#fff" opacity="0.25"/>
      <circle cx="380" cy="90" r="3" fill="#fff" opacity="0.3"/>
      <circle cx="400" cy="120" r="2" fill="#fff" opacity="0.2"/>
      <circle cx="290" cy="60" r="3" fill="#fff" opacity="0.35"/>
      <circle cx="320" cy="40" r="2" fill="#fff" opacity="0.25"/>
    </g>

    <!-- Grid floor lines (perspective) -->
    <g opacity="0.4" stroke="#c884e8" stroke-width="0.6" fill="none">
      <line x1="0" y1="320" x2="600" y2="320"/>
      <line x1="40" y1="340" x2="560" y2="340"/>
      <line x1="100" y1="358" x2="500" y2="358"/>
    </g>

    <!-- Title overlay -->
    <text x="300" y="50" font-family="Arial,sans-serif" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="6" opacity="0.9">DEV SANDBOX</text>
    <text x="300" y="75" font-family="Arial,sans-serif" font-size="10" fill="#e8b8ff" text-anchor="middle" letter-spacing="3" opacity="0.7">£100,000 STARTING CASH · ALL TESTS</text>

    <!-- Corner markers (lab/UI motif) -->
    <g stroke="#e884ff" stroke-width="1.5" fill="none" opacity="0.7">
      <path d="M 20 20 L 20 40 L 40 40"/>
      <path d="M 580 20 L 580 40 L 560 40"/>
      <path d="M 20 340 L 20 320 L 40 320"/>
      <path d="M 580 340 L 580 320 L 560 320"/>
    </g>
  `, '', '#3a1a52');
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function svgWrap(content, bgGradId, bgFill) {
  return `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="hero-asset" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block;border-radius:10px;overflow:hidden;background:${bgFill || '#E8DBC0'}">${content}</svg>`;
}

function terracedHouse(x, fillCol, accentCol, roofCol, isOurs) {
  // A single terraced house, 110px wide, 280px tall, ground at y=320
  // Returns SVG fragments for one house at horizontal position x
  const w = 110;
  const baseY = 320;
  const houseH = 240;
  const topY = baseY - houseH;
  const door = isOurs ? '#1A1A1A' : '#2D2D2D';
  const ours = isOurs ? `<circle cx="${x + w/2}" cy="${topY - 18}" r="6" fill="#F5A623" opacity="0.95"/>
                          <text x="${x + w/2}" y="${topY - 14}" font-family="Arial,sans-serif" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">★</text>` : '';
  return `
    <!-- ${isOurs ? 'OUR' : ''} house at x=${x} -->
    <!-- Main facade -->
    <rect x="${x}" y="${topY}" width="${w}" height="${houseH}" fill="${fillCol}"/>
    <!-- Roof line / cornice -->
    <rect x="${x - 3}" y="${topY}" width="${w + 6}" height="6" fill="${accentCol}"/>
    <rect x="${x - 5}" y="${topY - 4}" width="${w + 10}" height="5" fill="${roofCol}"/>
    <!-- Chimney -->
    <rect x="${x + w - 28}" y="${topY - 30}" width="14" height="30" fill="${roofCol}"/>
    <rect x="${x + w - 30}" y="${topY - 32}" width="18" height="4" fill="#3D3530"/>
    <!-- Top floor windows (sash) -->
    <g>
      <rect x="${x + 14}" y="${topY + 18}" width="32" height="44" fill="#FFFAF0" stroke="${accentCol}" stroke-width="2"/>
      <line x1="${x + 30}" y1="${topY + 18}" x2="${x + 30}" y2="${topY + 62}" stroke="${accentCol}" stroke-width="1.5"/>
      <line x1="${x + 14}" y1="${topY + 40}" x2="${x + 46}" y2="${topY + 40}" stroke="${accentCol}" stroke-width="1.5"/>
      <rect x="${x + 64}" y="${topY + 18}" width="32" height="44" fill="#FFFAF0" stroke="${accentCol}" stroke-width="2"/>
      <line x1="${x + 80}" y1="${topY + 18}" x2="${x + 80}" y2="${topY + 62}" stroke="${accentCol}" stroke-width="1.5"/>
      <line x1="${x + 64}" y1="${topY + 40}" x2="${x + 96}" y2="${topY + 40}" stroke="${accentCol}" stroke-width="1.5"/>
    </g>
    <!-- First floor windows -->
    <g>
      <rect x="${x + 14}" y="${topY + 86}" width="32" height="50" fill="#FFFAF0" stroke="${accentCol}" stroke-width="2"/>
      <line x1="${x + 30}" y1="${topY + 86}" x2="${x + 30}" y2="${topY + 136}" stroke="${accentCol}" stroke-width="1.5"/>
      <line x1="${x + 14}" y1="${topY + 111}" x2="${x + 46}" y2="${topY + 111}" stroke="${accentCol}" stroke-width="1.5"/>
      <rect x="${x + 64}" y="${topY + 86}" width="32" height="50" fill="#FFFAF0" stroke="${accentCol}" stroke-width="2"/>
      <line x1="${x + 80}" y1="${topY + 86}" x2="${x + 80}" y2="${topY + 136}" stroke="${accentCol}" stroke-width="1.5"/>
      <line x1="${x + 64}" y1="${topY + 111}" x2="${x + 96}" y2="${topY + 111}" stroke="${accentCol}" stroke-width="1.5"/>
      <!-- Window flower box on our house -->
      ${isOurs ? `<rect x="${x + 12}" y="${topY + 132}" width="36" height="8" fill="#6B4226"/>
                   <circle cx="${x + 18}" cy="${topY + 130}" r="3" fill="#E8517D"/>
                   <circle cx="${x + 24}" cy="${topY + 128}" r="3" fill="#F5A623"/>
                   <circle cx="${x + 30}" cy="${topY + 130}" r="3" fill="#FFC0CB"/>
                   <circle cx="${x + 36}" cy="${topY + 129}" r="3" fill="#E8517D"/>
                   <circle cx="${x + 42}" cy="${topY + 130}" r="3" fill="#F5A623"/>` : ''}
    </g>
    <!-- Bay window (ground floor, on left) -->
    <g>
      <path d="M ${x + 8} ${topY + 158} L ${x + 8} ${topY + 220} L ${x + 50} ${topY + 220} L ${x + 50} ${topY + 158} Z" fill="${fillCol}" stroke="${accentCol}" stroke-width="1"/>
      <rect x="${x + 12}" y="${topY + 162}" width="34" height="56" fill="#FFFAF0" stroke="${accentCol}" stroke-width="2"/>
      <line x1="${x + 29}" y1="${topY + 162}" x2="${x + 29}" y2="${topY + 218}" stroke="${accentCol}" stroke-width="1.5"/>
      <line x1="${x + 12}" y1="${topY + 190}" x2="${x + 46}" y2="${topY + 190}" stroke="${accentCol}" stroke-width="1.5"/>
      <!-- Bay top -->
      <rect x="${x + 6}" y="${topY + 156}" width="46" height="4" fill="${accentCol}"/>
    </g>
    <!-- Door (right of bay) -->
    <g>
      <!-- Steps up -->
      <rect x="${x + 64}" y="${topY + 218}" width="34" height="4" fill="#A89888"/>
      <rect x="${x + 66}" y="${topY + 222}" width="30" height="3" fill="#988878"/>
      <!-- Door frame -->
      <rect x="${x + 68}" y="${topY + 168}" width="26" height="52" fill="${accentCol}"/>
      <!-- Door -->
      <rect x="${x + 70}" y="${topY + 170}" width="22" height="48" fill="${door}"/>
      <!-- Fanlight above door -->
      <rect x="${x + 68}" y="${topY + 158}" width="26" height="10" fill="#FFFAF0" stroke="${accentCol}" stroke-width="1"/>
      <line x1="${x + 81}" y1="${topY + 158}" x2="${x + 81}" y2="${topY + 168}" stroke="${accentCol}" stroke-width="0.8"/>
      <line x1="${x + 75}" y1="${topY + 158}" x2="${x + 75}" y2="${topY + 168}" stroke="${accentCol}" stroke-width="0.5"/>
      <line x1="${x + 87}" y1="${topY + 158}" x2="${x + 87}" y2="${topY + 168}" stroke="${accentCol}" stroke-width="0.5"/>
      <!-- Door knob -->
      <circle cx="${x + 88}" cy="${topY + 195}" r="1.5" fill="#D4AF37"/>
      <!-- Door number -->
      ${isOurs ? `<rect x="${x + 75}" y="${topY + 175}" width="12" height="6" fill="#D4AF37" opacity="0.9"/>
                   <text x="${x + 81}" y="${topY + 180}" font-family="Georgia,serif" font-size="5" font-weight="700" text-anchor="middle" fill="#1A1A1A">22</text>` : ''}
    </g>
    <!-- Black railings in front -->
    <g stroke="#1A1A1A" stroke-width="1.5">
      <line x1="${x + 5}" y1="${topY + 222}" x2="${x + 5}" y2="${topY + 240}"/>
      <line x1="${x + 18}" y1="${topY + 222}" x2="${x + 18}" y2="${topY + 240}"/>
      <line x1="${x + 31}" y1="${topY + 222}" x2="${x + 31}" y2="${topY + 240}"/>
      <line x1="${x + 44}" y1="${topY + 222}" x2="${x + 44}" y2="${topY + 240}"/>
      <line x1="${x + 57}" y1="${topY + 222}" x2="${x + 57}" y2="${topY + 240}"/>
      <line x1="${x + 100}" y1="${topY + 222}" x2="${x + 100}" y2="${topY + 240}"/>
      <line x1="${x + 5}" y1="${topY + 224}" x2="${x + 60}" y2="${topY + 224}" stroke-width="1"/>
      <line x1="${x + 100}" y1="${topY + 224}" x2="${x + 105}" y2="${topY + 224}" stroke-width="1"/>
    </g>
    ${ours}
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. NOTTING HILL STUDIO — Pastel Portobello Road terrace
// ═══════════════════════════════════════════════════════════════════════════
function heroNottingHill() {
  return svgWrap(`
    <defs>
      <linearGradient id="nh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#B8D8E8"/>
        <stop offset="0.6" stop-color="#F4D8C0"/>
        <stop offset="1" stop-color="#FCE8D5"/>
      </linearGradient>
      <pattern id="nh-cobbles" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
        <rect width="14" height="8" fill="#9A8472"/>
        <ellipse cx="7" cy="4" rx="6" ry="3" fill="#A89684" opacity="0.6"/>
        <line x1="0" y1="0" x2="14" y2="0" stroke="#7A6452" stroke-width="0.4"/>
      </pattern>
    </defs>
    <!-- Sky -->
    <rect width="600" height="360" fill="url(#nh-sky)"/>
    <!-- Soft sun -->
    <circle cx="510" cy="55" r="36" fill="#FFE9C2" opacity="0.5"/>
    <circle cx="510" cy="55" r="22" fill="#FFD68A" opacity="0.85"/>
    <!-- Distant rooftop silhouettes -->
    <g opacity="0.25" fill="#7A8A98">
      <polygon points="0,140 30,120 60,135 90,115 120,130 150,115 180,128 200,140 0,150"/>
      <polygon points="380,135 410,118 440,128 470,115 500,125 530,118 600,130 600,150 380,150"/>
      <rect x="100" y="100" width="6" height="40" opacity="0.6"/>
      <rect x="450" y="105" width="6" height="35" opacity="0.6"/>
    </g>
    <!-- Birds -->
    <g stroke="#5A6878" stroke-width="1.4" fill="none" opacity="0.6">
      <path d="M 200 70 q 4 -4 8 0 q 4 -4 8 0"/>
      <path d="M 240 85 q 3 -3 6 0 q 3 -3 6 0"/>
      <path d="M 380 60 q 4 -4 8 0 q 4 -4 8 0"/>
    </g>

    <!-- Tree on left edge -->
    <g>
      <!-- Trunk -->
      <rect x="22" y="240" width="14" height="80" fill="#5A4030"/>
      <line x1="29" y1="260" x2="29" y2="320" stroke="#3D2A1E" stroke-width="1"/>
      <!-- Foliage layers -->
      <circle cx="20" cy="225" r="32" fill="#5A8A48" opacity="0.85"/>
      <circle cx="42" cy="215" r="34" fill="#6FA050" opacity="0.9"/>
      <circle cx="28" cy="200" r="28" fill="#7AB05A" opacity="0.85"/>
      <circle cx="55" cy="240" r="22" fill="#5A8A48" opacity="0.8"/>
      <!-- Highlights -->
      <circle cx="38" cy="210" r="4" fill="#9ECC78" opacity="0.7"/>
      <circle cx="22" cy="225" r="3" fill="#9ECC78" opacity="0.6"/>
    </g>

    <!-- Row of 5 terraced houses (we are the middle one) -->
    <!-- House 1 (left, partial): mint green -->
    ${terracedHouse(70, '#B8DDC8', '#5A8268', '#3D4A3A', false)}
    <!-- House 2: pale yellow -->
    ${terracedHouse(180, '#F0DAA0', '#A87830', '#5A4222', false)}
    <!-- House 3 (CENTRE - OURS): warm pink -->
    ${terracedHouse(290, '#E8A8B8', '#A04860', '#5A2840', true)}
    <!-- House 4: cream -->
    ${terracedHouse(400, '#F2E4CC', '#9A7848', '#5A4020', false)}
    <!-- House 5 (right, partial): dusty blue -->
    ${terracedHouse(510, '#A8C4DC', '#4A6A88', '#2A3D52', false)}

    <!-- Pavement (cobbled) -->
    <rect x="0" y="320" width="600" height="40" fill="url(#nh-cobbles)"/>
    <!-- Pavement edge shadow -->
    <rect x="0" y="320" width="600" height="2" fill="#5A4838"/>

    <!-- Lamppost between houses 4 and 5 -->
    <g>
      <rect x="497" y="200" width="3" height="125" fill="#1A1A1A"/>
      <rect x="494" y="320" width="9" height="6" fill="#1A1A1A"/>
      <rect x="495" y="195" width="7" height="6" fill="#1A1A1A"/>
      <!-- Lantern -->
      <path d="M 488 178 L 491 195 L 506 195 L 509 178 Z" fill="#1A1A1A"/>
      <rect x="491" y="180" width="15" height="14" fill="#FFE9A0" opacity="0.85"/>
      <line x1="491" y1="187" x2="506" y2="187" stroke="#1A1A1A" stroke-width="0.5"/>
      <line x1="498.5" y1="180" x2="498.5" y2="194" stroke="#1A1A1A" stroke-width="0.5"/>
      <!-- Top finial -->
      <circle cx="498.5" cy="175" r="2.5" fill="#1A1A1A"/>
    </g>

    <!-- Bicycle leaning against railings of OUR house -->
    <g>
      <!-- Wheels -->
      <circle cx="350" cy="312" r="10" fill="none" stroke="#1A1A1A" stroke-width="1.8"/>
      <circle cx="350" cy="312" r="6" fill="none" stroke="#5A5A5A" stroke-width="0.5"/>
      <circle cx="380" cy="312" r="10" fill="none" stroke="#1A1A1A" stroke-width="1.8"/>
      <circle cx="380" cy="312" r="6" fill="none" stroke="#5A5A5A" stroke-width="0.5"/>
      <!-- Frame -->
      <line x1="350" y1="312" x2="370" y2="295" stroke="#3A6A8A" stroke-width="2"/>
      <line x1="370" y1="295" x2="380" y2="312" stroke="#3A6A8A" stroke-width="2"/>
      <line x1="370" y1="295" x2="358" y2="312" stroke="#3A6A8A" stroke-width="2"/>
      <line x1="358" y1="312" x2="380" y2="312" stroke="#3A6A8A" stroke-width="2"/>
      <!-- Handlebar + seat -->
      <line x1="358" y1="298" x2="365" y2="290" stroke="#1A1A1A" stroke-width="1.5"/>
      <circle cx="365" cy="290" r="2" fill="#1A1A1A"/>
      <line x1="370" y1="295" x2="372" y2="285" stroke="#3A6A8A" stroke-width="2"/>
      <ellipse cx="372" cy="284" rx="4" ry="2" fill="#1A1A1A"/>
      <!-- Basket on front -->
      <rect x="354" y="284" width="10" height="6" fill="#A0764A" stroke="#5A4030" stroke-width="0.5"/>
      <!-- Flowers in basket -->
      <circle cx="357" cy="282" r="2" fill="#E8517D"/>
      <circle cx="361" cy="281" r="2" fill="#F5A623"/>
    </g>

    <!-- Small market crate near house 2 -->
    <g>
      <rect x="220" y="305" width="22" height="14" fill="#A0764A" stroke="#5A4030" stroke-width="0.5"/>
      <line x1="220" y1="312" x2="242" y2="312" stroke="#5A4030" stroke-width="0.5"/>
      <!-- Apples -->
      <circle cx="225" cy="304" r="3" fill="#C8302E"/>
      <circle cx="231" cy="303" r="3" fill="#C8302E"/>
      <circle cx="237" cy="304" r="3" fill="#A02822"/>
      <circle cx="228" cy="299" r="3" fill="#C8302E"/>
      <circle cx="234" cy="299" r="3" fill="#A02822"/>
    </g>

    <!-- Person walking (silhouette) -->
    <g opacity="0.85">
      <!-- Body -->
      <ellipse cx="155" cy="290" rx="5" ry="14" fill="#5A3A2A"/>
      <!-- Head -->
      <circle cx="155" cy="270" r="5" fill="#D8B89A"/>
      <!-- Hair -->
      <path d="M 150 268 q 5 -7 10 0 q -3 -3 -10 0" fill="#3A2820"/>
      <!-- Legs -->
      <line x1="153" y1="302" x2="151" y2="320" stroke="#3A2820" stroke-width="2.5"/>
      <line x1="157" y1="302" x2="161" y2="320" stroke="#3A2820" stroke-width="2.5"/>
      <!-- Coat detail -->
      <path d="M 150 280 L 155 282 L 160 280 L 158 295 L 152 295 Z" fill="#A87848" opacity="0.7"/>
    </g>

    <!-- Subtle Portobello street sign -->
    <g>
      <rect x="42" y="280" width="36" height="14" fill="#FFFAF0" stroke="#1A1A1A" stroke-width="0.8"/>
      <text x="60" y="290" font-family="Arial,sans-serif" font-size="6" font-weight="700" text-anchor="middle" fill="#1A1A1A">PORTOBELLO RD</text>
    </g>

    <!-- Soft warm vignette at top -->
    <rect width="600" height="80" fill="#FFE9C2" opacity="0.15"/>
  `, '', '#E8DBC0');
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. SHOREDITCH LOFT — Brick warehouse conversion, urban edge
// ═══════════════════════════════════════════════════════════════════════════
function heroShoreditch() {
  return svgWrap(`
    <defs>
      <linearGradient id="sh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3A4A5A"/>
        <stop offset="0.5" stop-color="#7A6A6A"/>
        <stop offset="1" stop-color="#C8A088"/>
      </linearGradient>
      <pattern id="sh-brick" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#8A4A3A"/>
        <rect x="0" y="0" width="19" height="9" fill="#A05A48" stroke="#5A2A20" stroke-width="0.4"/>
        <rect x="20" y="0" width="19" height="9" fill="#9A5040" stroke="#5A2A20" stroke-width="0.4"/>
        <rect x="-10" y="10" width="19" height="9" fill="#955040" stroke="#5A2A20" stroke-width="0.4"/>
        <rect x="10" y="10" width="19" height="9" fill="#A85A48" stroke="#5A2A20" stroke-width="0.4"/>
        <rect x="30" y="10" width="19" height="9" fill="#8E4838" stroke="#5A2A20" stroke-width="0.4"/>
      </pattern>
      <pattern id="sh-brick-dark" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#6A3A2A"/>
        <rect x="0" y="0" width="19" height="9" fill="#7A4A38" stroke="#3A1A10" stroke-width="0.4"/>
        <rect x="20" y="0" width="19" height="9" fill="#704030" stroke="#3A1A10" stroke-width="0.4"/>
        <rect x="-10" y="10" width="19" height="9" fill="#6E3D2D" stroke="#3A1A10" stroke-width="0.4"/>
        <rect x="10" y="10" width="19" height="9" fill="#784535" stroke="#3A1A10" stroke-width="0.4"/>
        <rect x="30" y="10" width="19" height="9" fill="#683C2C" stroke="#3A1A10" stroke-width="0.4"/>
      </pattern>
    </defs>
    <!-- Sky (dusk, urban) -->
    <rect width="600" height="360" fill="url(#sh-sky)"/>
    <!-- Distant skyline -->
    <g opacity="0.5" fill="#2A1A20">
      <rect x="0" y="100" width="40" height="80"/>
      <rect x="50" y="110" width="50" height="70"/>
      <rect x="105" y="80" width="30" height="100"/>
      <rect x="140" y="120" width="60" height="60"/>
      <rect x="430" y="95" width="40" height="85"/>
      <rect x="475" y="115" width="50" height="65"/>
      <rect x="540" y="85" width="35" height="95"/>
      <rect x="580" y="125" width="20" height="55"/>
      <!-- Tiny windows -->
      <rect x="10" y="120" width="2" height="2" fill="#FFE0A0"/>
      <rect x="20" y="130" width="2" height="2" fill="#FFE0A0"/>
      <rect x="115" y="100" width="2" height="2" fill="#FFE0A0"/>
      <rect x="125" y="120" width="2" height="2" fill="#FFE0A0"/>
      <rect x="450" y="110" width="2" height="2" fill="#FFE0A0"/>
      <rect x="555" y="105" width="2" height="2" fill="#FFE0A0"/>
    </g>

    <!-- Smoke / clouds tinted with sunset -->
    <g opacity="0.4" fill="#D8B098">
      <ellipse cx="100" cy="60" rx="60" ry="12"/>
      <ellipse cx="400" cy="50" rx="80" ry="14"/>
      <ellipse cx="280" cy="80" rx="45" ry="10"/>
    </g>

    <!-- Truman-style chimney in background -->
    <g>
      <rect x="60" y="130" width="22" height="100" fill="#5A3A28"/>
      <rect x="58" y="125" width="26" height="8" fill="#3A2618"/>
      <rect x="55" y="120" width="32" height="6" fill="#3A2618"/>
      <!-- Smoke -->
      <ellipse cx="71" cy="115" rx="10" ry="4" fill="#A8A0A0" opacity="0.55"/>
      <ellipse cx="80" cy="105" rx="14" ry="5" fill="#A8A0A0" opacity="0.45"/>
      <ellipse cx="90" cy="92" rx="18" ry="6" fill="#A8A0A0" opacity="0.35"/>
    </g>

    <!-- WAREHOUSE main facade (centre, our building) -->
    <!-- Building body -->
    <rect x="120" y="120" width="360" height="200" fill="url(#sh-brick)"/>
    <!-- Top cornice with text -->
    <rect x="115" y="110" width="370" height="14" fill="#3A1A10"/>
    <rect x="115" y="108" width="370" height="3" fill="#5A2A20"/>
    <text x="300" y="121" font-family="Georgia,serif" font-size="10" font-weight="700" text-anchor="middle" fill="#E8C8A0" letter-spacing="2">EST. 1890 · WAREHOUSE No.7</text>

    <!-- Industrial windows (large grid panes) -->
    <!-- Top floor (3 large windows) -->
    <g>
      <rect x="135" y="135" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="167.5" y1="135" x2="167.5" y2="190" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="135" y1="151" x2="200" y2="151" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="135" y1="167" x2="200" y2="167" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="135" y1="178" x2="200" y2="178" stroke="#3A1A10" stroke-width="1.5"/>

      <rect x="265" y="135" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="297.5" y1="135" x2="297.5" y2="190" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="265" y1="151" x2="330" y2="151" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="265" y1="167" x2="330" y2="167" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="265" y1="178" x2="330" y2="178" stroke="#3A1A10" stroke-width="1.5"/>

      <rect x="395" y="135" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="427.5" y1="135" x2="427.5" y2="190" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="395" y1="151" x2="460" y2="151" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="395" y1="167" x2="460" y2="167" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="395" y1="178" x2="460" y2="178" stroke="#3A1A10" stroke-width="1.5"/>
    </g>
    <!-- Mezzanine floor windows -->
    <g>
      <rect x="135" y="210" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="167.5" y1="210" x2="167.5" y2="265" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="135" y1="226" x2="200" y2="226" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="135" y1="242" x2="200" y2="242" stroke="#3A1A10" stroke-width="1.5"/>
      <!-- Plant on inside windowsill -->
      <ellipse cx="155" cy="250" rx="10" ry="6" fill="#3D5A2D"/>
      <rect x="151" y="250" width="8" height="10" fill="#5A4030"/>

      <rect x="265" y="210" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="297.5" y1="210" x2="297.5" y2="265" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="265" y1="226" x2="330" y2="226" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="265" y1="242" x2="330" y2="242" stroke="#3A1A10" stroke-width="1.5"/>
      <!-- Pendant lamp -->
      <line x1="297.5" y1="210" x2="297.5" y2="225" stroke="#1A1A1A" stroke-width="1"/>
      <ellipse cx="297.5" cy="228" rx="6" ry="4" fill="#FFD68A" opacity="0.9"/>

      <rect x="395" y="210" width="65" height="55" fill="#FFE8B0" stroke="#3A1A10" stroke-width="2"/>
      <line x1="427.5" y1="210" x2="427.5" y2="265" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="395" y1="226" x2="460" y2="226" stroke="#3A1A10" stroke-width="1.5"/>
      <line x1="395" y1="242" x2="460" y2="242" stroke="#3A1A10" stroke-width="1.5"/>
    </g>

    <!-- Industrial double door (centre, ground level) -->
    <g>
      <rect x="270" y="285" width="70" height="35" fill="#3A1A10"/>
      <rect x="272" y="287" width="32" height="33" fill="#1A0A05"/>
      <rect x="306" y="287" width="32" height="33" fill="#1A0A05"/>
      <line x1="305" y1="287" x2="305" y2="320" stroke="#5A2A20" stroke-width="1"/>
      <!-- Bolts -->
      <circle cx="288" cy="295" r="1.5" fill="#5A5A5A"/>
      <circle cx="288" cy="312" r="1.5" fill="#5A5A5A"/>
      <circle cx="322" cy="295" r="1.5" fill="#5A5A5A"/>
      <circle cx="322" cy="312" r="1.5" fill="#5A5A5A"/>
      <!-- "Number 7" plate above door -->
      <rect x="290" y="270" width="30" height="14" fill="#3A1A10" stroke="#1A0A05"/>
      <text x="305" y="280" font-family="Arial,sans-serif" font-size="11" font-weight="800" text-anchor="middle" fill="#E8C8A0">N° 7</text>
    </g>

    <!-- Fire escape on right side -->
    <g stroke="#1A1A1A" stroke-width="1.5" fill="none">
      <!-- Vertical posts -->
      <line x1="466" y1="195" x2="466" y2="320"/>
      <line x1="478" y1="195" x2="478" y2="320"/>
      <!-- Platform -->
      <line x1="466" y1="200" x2="478" y2="200"/>
      <line x1="466" y1="280" x2="478" y2="280"/>
      <!-- Stairs zigzag -->
      <path d="M 466 280 L 478 295 L 466 295 L 478 310 L 466 310"/>
      <!-- Rungs at top -->
      <line x1="467" y1="220" x2="477" y2="220"/>
      <line x1="467" y1="240" x2="477" y2="240"/>
      <line x1="467" y1="260" x2="477" y2="260"/>
    </g>

    <!-- Hanging Edison-bulb string lights between buildings -->
    <g>
      <path d="M 0 100 Q 60 130 120 110" stroke="#1A1A1A" stroke-width="0.8" fill="none"/>
      <path d="M 480 110 Q 540 130 600 105" stroke="#1A1A1A" stroke-width="0.8" fill="none"/>
      <circle cx="30" cy="118" r="3" fill="#FFE8B0"/>
      <circle cx="60" cy="125" r="3" fill="#FFE8B0"/>
      <circle cx="90" cy="120" r="3" fill="#FFE8B0"/>
      <circle cx="510" cy="120" r="3" fill="#FFE8B0"/>
      <circle cx="540" cy="125" r="3" fill="#FFE8B0"/>
      <circle cx="570" cy="115" r="3" fill="#FFE8B0"/>
    </g>

    <!-- Small adjacent building on left -->
    <rect x="0" y="180" width="115" height="140" fill="url(#sh-brick-dark)"/>
    <rect x="0" y="175" width="120" height="6" fill="#3A1A10"/>
    <!-- Graffiti tag -->
    <g>
      <text x="20" y="265" font-family="Arial,sans-serif" font-size="22" font-weight="900" font-style="italic" fill="#E8517D" opacity="0.9">SHO</text>
      <text x="60" y="280" font-family="Arial,sans-serif" font-size="22" font-weight="900" font-style="italic" fill="#5AC8E8" opacity="0.9">RE</text>
    </g>
    <!-- Adjacent building windows -->
    <rect x="20" y="195" width="20" height="25" fill="#5A4030" stroke="#3A1A10"/>
    <rect x="80" y="195" width="20" height="25" fill="#5A4030" stroke="#3A1A10"/>

    <!-- Right adjacent building -->
    <rect x="485" y="170" width="115" height="150" fill="url(#sh-brick-dark)"/>
    <rect x="485" y="165" width="115" height="6" fill="#3A1A10"/>
    <rect x="500" y="185" width="22" height="28" fill="#FFE8B0" stroke="#3A1A10"/>
    <rect x="540" y="185" width="22" height="28" fill="#FFE8B0" stroke="#3A1A10"/>
    <rect x="500" y="225" width="22" height="28" fill="#FFE8B0" stroke="#3A1A10"/>
    <rect x="540" y="225" width="22" height="28" fill="#FFE8B0" stroke="#3A1A10"/>

    <!-- Pavement -->
    <rect x="0" y="320" width="600" height="40" fill="#3A3530"/>
    <rect x="0" y="320" width="600" height="2" fill="#1A1810"/>
    <!-- Cobblestone hint -->
    <g opacity="0.4" stroke="#1A1810" stroke-width="0.5">
      <line x1="40" y1="332" x2="50" y2="332"/>
      <line x1="100" y1="338" x2="115" y2="338"/>
      <line x1="180" y1="335" x2="195" y2="335"/>
      <line x1="280" y1="338" x2="295" y2="338"/>
      <line x1="380" y1="335" x2="395" y2="335"/>
      <line x1="480" y1="332" x2="495" y2="332"/>
      <line x1="540" y1="338" x2="555" y2="338"/>
    </g>

    <!-- OUR HOUSE indicator (gold star) -->
    <g>
      <circle cx="300" cy="100" r="9" fill="#F5A623"/>
      <text x="300" y="105" font-family="Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">★</text>
    </g>

    <!-- Cyclist passing in foreground -->
    <g>
      <circle cx="155" cy="312" r="8" fill="none" stroke="#1A1A1A" stroke-width="1.5"/>
      <circle cx="180" cy="312" r="8" fill="none" stroke="#1A1A1A" stroke-width="1.5"/>
      <line x1="155" y1="312" x2="172" y2="298" stroke="#3A1A10" stroke-width="2"/>
      <line x1="172" y1="298" x2="180" y2="312" stroke="#3A1A10" stroke-width="2"/>
      <line x1="172" y1="298" x2="160" y2="312" stroke="#3A1A10" stroke-width="2"/>
      <!-- Rider -->
      <circle cx="170" cy="285" r="4" fill="#5A4030"/>
      <ellipse cx="172" cy="293" rx="5" ry="6" fill="#1A1A1A"/>
      <line x1="170" y1="295" x2="160" y2="298" stroke="#1A1A1A" stroke-width="1.5"/>
      <!-- Helmet -->
      <path d="M 166 282 q 4 -3 8 0" stroke="#3A1A10" stroke-width="2" fill="none"/>
    </g>
  `, '', '#3A4A5A');
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CHELSEA TOWNHOUSE — White stucco terrace, refined
// ═══════════════════════════════════════════════════════════════════════════
function heroChelsea() {
  return svgWrap(`
    <defs>
      <linearGradient id="ch-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#A8C8E0"/>
        <stop offset="1" stop-color="#E0E8F0"/>
      </linearGradient>
    </defs>
    <rect width="600" height="360" fill="url(#ch-sky)"/>

    <!-- Distant trees in park behind -->
    <g opacity="0.5" fill="#5A8A48">
      <ellipse cx="80" cy="140" rx="35" ry="20"/>
      <ellipse cx="140" cy="135" rx="40" ry="22"/>
      <ellipse cx="500" cy="138" rx="38" ry="20"/>
      <ellipse cx="550" cy="142" rx="35" ry="18"/>
    </g>

    <!-- Soft clouds -->
    <ellipse cx="200" cy="60" rx="50" ry="10" fill="#fff" opacity="0.7"/>
    <ellipse cx="430" cy="75" rx="65" ry="11" fill="#fff" opacity="0.6"/>

    <!-- Chelsea terrace — white stucco, 4 storeys -->
    <!-- Building body (full width) -->
    <rect x="0" y="100" width="600" height="220" fill="#F4EEE0"/>
    <!-- Subtle vertical seams between houses -->
    <line x1="120" y1="100" x2="120" y2="320" stroke="#C8B89A" stroke-width="1" opacity="0.6"/>
    <line x1="240" y1="100" x2="240" y2="320" stroke="#C8B89A" stroke-width="1" opacity="0.6"/>
    <line x1="360" y1="100" x2="360" y2="320" stroke="#C8B89A" stroke-width="1" opacity="0.6"/>
    <line x1="480" y1="100" x2="480" y2="320" stroke="#C8B89A" stroke-width="1" opacity="0.6"/>

    <!-- Top cornice -->
    <rect x="0" y="92" width="600" height="10" fill="#E8DCC0"/>
    <rect x="0" y="88" width="600" height="6" fill="#D8CCB0"/>
    <rect x="0" y="100" width="600" height="3" fill="#C8B89A"/>

    <!-- Dentil moulding -->
    <g fill="#D8CCB0">
      <rect x="5" y="103" width="6" height="4"/><rect x="17" y="103" width="6" height="4"/>
      <rect x="29" y="103" width="6" height="4"/><rect x="41" y="103" width="6" height="4"/>
      <rect x="53" y="103" width="6" height="4"/><rect x="65" y="103" width="6" height="4"/>
      <rect x="77" y="103" width="6" height="4"/><rect x="89" y="103" width="6" height="4"/>
      <rect x="101" y="103" width="6" height="4"/><rect x="113" y="103" width="6" height="4"/>
      <rect x="125" y="103" width="6" height="4"/><rect x="137" y="103" width="6" height="4"/>
      <rect x="149" y="103" width="6" height="4"/><rect x="161" y="103" width="6" height="4"/>
      <rect x="173" y="103" width="6" height="4"/><rect x="185" y="103" width="6" height="4"/>
      <rect x="197" y="103" width="6" height="4"/><rect x="209" y="103" width="6" height="4"/>
      <rect x="221" y="103" width="6" height="4"/><rect x="233" y="103" width="6" height="4"/>
      <rect x="245" y="103" width="6" height="4"/><rect x="257" y="103" width="6" height="4"/>
      <rect x="269" y="103" width="6" height="4"/><rect x="281" y="103" width="6" height="4"/>
      <rect x="293" y="103" width="6" height="4"/><rect x="305" y="103" width="6" height="4"/>
      <rect x="317" y="103" width="6" height="4"/><rect x="329" y="103" width="6" height="4"/>
      <rect x="341" y="103" width="6" height="4"/><rect x="353" y="103" width="6" height="4"/>
      <rect x="365" y="103" width="6" height="4"/><rect x="377" y="103" width="6" height="4"/>
      <rect x="389" y="103" width="6" height="4"/><rect x="401" y="103" width="6" height="4"/>
      <rect x="413" y="103" width="6" height="4"/><rect x="425" y="103" width="6" height="4"/>
      <rect x="437" y="103" width="6" height="4"/><rect x="449" y="103" width="6" height="4"/>
      <rect x="461" y="103" width="6" height="4"/><rect x="473" y="103" width="6" height="4"/>
      <rect x="485" y="103" width="6" height="4"/><rect x="497" y="103" width="6" height="4"/>
      <rect x="509" y="103" width="6" height="4"/><rect x="521" y="103" width="6" height="4"/>
      <rect x="533" y="103" width="6" height="4"/><rect x="545" y="103" width="6" height="4"/>
      <rect x="557" y="103" width="6" height="4"/><rect x="569" y="103" width="6" height="4"/>
      <rect x="581" y="103" width="6" height="4"/><rect x="593" y="103" width="6" height="4"/>
    </g>

    <!-- Roof above with chimneys -->
    <rect x="-10" y="80" width="620" height="12" fill="#3A2818"/>
    <!-- Chimneys -->
    <rect x="100" y="50" width="22" height="32" fill="#5A4030"/>
    <rect x="98" y="46" width="26" height="6" fill="#3A2818"/>
    <rect x="240" y="50" width="22" height="32" fill="#5A4030"/>
    <rect x="238" y="46" width="26" height="6" fill="#3A2818"/>
    <rect x="380" y="50" width="22" height="32" fill="#5A4030"/>
    <rect x="378" y="46" width="26" height="6" fill="#3A2818"/>
    <rect x="500" y="50" width="22" height="32" fill="#5A4030"/>
    <rect x="498" y="46" width="26" height="6" fill="#3A2818"/>

    <!-- Function: render windows with Georgian sash style + black shutters -->
    <!-- I'll inline a 5-house x 3-floor grid -->

    <!-- Top floor windows (smaller, attic) -->
    <g>
      ${[60, 180, 300, 420, 540].map(cx => `
        <rect x="${cx-22}" y="118" width="44" height="32" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="118" x2="${cx}" y2="150" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-22}" y1="134" x2="${cx+22}" y2="134" stroke="#5A4030" stroke-width="1"/>
        <rect x="${cx-26}" y="115" width="52" height="4" fill="#5A4030"/>
      `).join('')}
    </g>

    <!-- First floor (the Piano Nobile - the grandest, with balconies) -->
    <g>
      ${[60, 180, 300, 420, 540].map((cx, i) => `
        <rect x="${cx-26}" y="165" width="52" height="60" fill="#3A4A5A" stroke="#5A4030" stroke-width="2"/>
        <line x1="${cx}" y1="165" x2="${cx}" y2="225" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx-26}" y1="195" x2="${cx+26}" y2="195" stroke="#5A4030" stroke-width="1"/>
        <!-- Lintel/pediment -->
        <rect x="${cx-30}" y="161" width="60" height="5" fill="#5A4030"/>
        <polygon points="${cx-15},161 ${cx},155 ${cx+15},161" fill="#5A4030" opacity="0.9"/>
        <!-- Window box / balconette -->
        <rect x="${cx-28}" y="225" width="56" height="6" fill="#1A1A1A"/>
        <g stroke="#1A1A1A" stroke-width="1" fill="none">
          <line x1="${cx-25}" y1="226" x2="${cx-25}" y2="232"/>
          <line x1="${cx-15}" y1="226" x2="${cx-15}" y2="232"/>
          <line x1="${cx-5}" y1="226" x2="${cx-5}" y2="232"/>
          <line x1="${cx+5}" y1="226" x2="${cx+5}" y2="232"/>
          <line x1="${cx+15}" y1="226" x2="${cx+15}" y2="232"/>
          <line x1="${cx+25}" y1="226" x2="${cx+25}" y2="232"/>
        </g>
        ${i === 2 ? `<!-- Plant on our balcony -->
          <rect x="${cx-15}" y="220" width="8" height="10" fill="#5A4030"/>
          <ellipse cx="${cx-11}" cy="218" rx="6" ry="4" fill="#5A8A48"/>
          <rect x="${cx+5}" y="220" width="8" height="10" fill="#5A4030"/>
          <ellipse cx="${cx+9}" cy="218" rx="6" ry="4" fill="#5A8A48"/>` : ''}
      `).join('')}
    </g>

    <!-- Ground floor (with front doors) -->
    <g>
      ${[60, 180, 300, 420, 540].map((cx, i) => {
        const doorCol = ['#1A1A1A', '#5A2828', '#1A3A5A', '#1A4A2A', '#5A2828'][i]; // navy on ours
        const isOurs = i === 2;
        return `
          <!-- Window left of door -->
          <rect x="${cx-40}" y="245" width="32" height="48" fill="#3A4A5A" stroke="#5A4030" stroke-width="2"/>
          <line x1="${cx-24}" y1="245" x2="${cx-24}" y2="293" stroke="#5A4030" stroke-width="1"/>
          <line x1="${cx-40}" y1="269" x2="${cx-8}" y2="269" stroke="#5A4030" stroke-width="1"/>
          <!-- Door -->
          <rect x="${cx-2}" y="245" width="38" height="65" fill="${doorCol}"/>
          <rect x="${cx-4}" y="243" width="42" height="3" fill="#5A4030"/>
          <!-- Door panels -->
          <rect x="${cx+3}" y="252" width="12" height="22" fill="none" stroke="#000" stroke-width="0.5" opacity="0.4"/>
          <rect x="${cx+19}" y="252" width="12" height="22" fill="none" stroke="#000" stroke-width="0.5" opacity="0.4"/>
          <rect x="${cx+3}" y="280" width="12" height="22" fill="none" stroke="#000" stroke-width="0.5" opacity="0.4"/>
          <rect x="${cx+19}" y="280" width="12" height="22" fill="none" stroke="#000" stroke-width="0.5" opacity="0.4"/>
          <!-- Door knocker -->
          <circle cx="${cx+17}" cy="278" r="2" fill="#D4AF37"/>
          <!-- Fanlight -->
          <path d="M ${cx-2} 245 L ${cx+36} 245 L ${cx+36} 240 Q ${cx+17} 232 ${cx-2} 240 Z" fill="#FFE8B0" stroke="#5A4030" stroke-width="1"/>
          <!-- Steps -->
          <rect x="${cx-6}" y="310" width="46" height="4" fill="#A89888"/>
          <rect x="${cx-2}" y="314" width="38" height="6" fill="#988878"/>
          <!-- Hedge in pot beside door -->
          ${isOurs ? `<rect x="${cx+38}" y="295" width="14" height="20" fill="#5A4030"/>
                       <ellipse cx="${cx+45}" cy="290" rx="9" ry="8" fill="#3D6A38"/>
                       <ellipse cx="${cx+45}" cy="285" rx="6" ry="4" fill="#5A8A48"/>
                       <rect x="${cx-58}" y="295" width="14" height="20" fill="#5A4030"/>
                       <ellipse cx="${cx-51}" cy="290" rx="9" ry="8" fill="#3D6A38"/>
                       <ellipse cx="${cx-51}" cy="285" rx="6" ry="4" fill="#5A8A48"/>` : ''}
          <!-- Number plate ours -->
          ${isOurs ? `<rect x="${cx+8}" y="237" width="22" height="6" fill="#D4AF37"/>
                       <text x="${cx+19}" y="242" font-family="Georgia,serif" font-size="5" font-weight="700" text-anchor="middle" fill="#1A1A1A">42 CHEYNE</text>` : ''}
        `;
      }).join('')}
    </g>

    <!-- Black railings + basement steps -->
    <g stroke="#1A1A1A" stroke-width="1.2">
      <line x1="0" y1="318" x2="600" y2="318"/>
      ${Array.from({length: 30}, (_, i) => `<line x1="${i*20+10}" y1="319" x2="${i*20+10}" y2="332"/>`).join('')}
    </g>

    <!-- Pavement + road -->
    <rect x="0" y="332" width="600" height="14" fill="#A89A88"/>
    <rect x="0" y="346" width="600" height="14" fill="#3A3530"/>
    <line x1="0" y1="332" x2="600" y2="332" stroke="#5A4838" stroke-width="0.8"/>

    <!-- Vintage car parked outside our house -->
    <g>
      <!-- Body (vintage Range Rover Classic style, dark green) -->
      <rect x="245" y="305" width="100" height="22" rx="3" fill="#2A4A3A"/>
      <rect x="252" y="298" width="78" height="14" rx="2" fill="#2A4A3A"/>
      <rect x="258" y="302" width="22" height="9" fill="#A0C8D8" opacity="0.7"/>
      <rect x="284" y="302" width="22" height="9" fill="#A0C8D8" opacity="0.7"/>
      <rect x="310" y="302" width="14" height="9" fill="#A0C8D8" opacity="0.7"/>
      <!-- Wheels -->
      <circle cx="263" cy="328" r="9" fill="#1A1A1A"/>
      <circle cx="263" cy="328" r="4" fill="#5A5A5A"/>
      <circle cx="328" cy="328" r="9" fill="#1A1A1A"/>
      <circle cx="328" cy="328" r="4" fill="#5A5A5A"/>
      <!-- Headlight -->
      <circle cx="345" cy="316" r="3" fill="#FFE8B0"/>
      <!-- Roof rack -->
      <rect x="258" y="295" width="68" height="3" fill="#1A1A1A"/>
    </g>

    <!-- Boy walking dog (silhouette far left) -->
    <g opacity="0.85">
      <ellipse cx="40" cy="305" rx="4" ry="10" fill="#5A2828"/>
      <circle cx="40" cy="290" r="4" fill="#D8B89A"/>
      <line x1="38" y1="313" x2="36" y2="328" stroke="#3A1A10" stroke-width="2"/>
      <line x1="42" y1="313" x2="44" y2="328" stroke="#3A1A10" stroke-width="2"/>
      <!-- Dog -->
      <ellipse cx="58" cy="324" rx="8" ry="4" fill="#D8B89A"/>
      <circle cx="64" cy="320" r="3" fill="#D8B89A"/>
      <line x1="55" y1="328" x2="55" y2="333" stroke="#A88868" stroke-width="1.2"/>
      <line x1="60" y1="328" x2="60" y2="333" stroke="#A88868" stroke-width="1.2"/>
      <!-- Lead -->
      <line x1="46" y1="304" x2="60" y2="320" stroke="#1A1A1A" stroke-width="0.8"/>
    </g>

    <!-- OUR HOUSE indicator (gold star) above middle door -->
    <g>
      <circle cx="300" cy="78" r="9" fill="#F5A623"/>
      <text x="300" y="83" font-family="Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">★</text>
    </g>
  `, '', '#A8C8E0');
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. MAYFAIR PENTHOUSE — Modern luxury, Hyde Park views, golden hour
// ═══════════════════════════════════════════════════════════════════════════
function heroMayfair() {
  return svgWrap(`
    <defs>
      <linearGradient id="mf-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F5A878"/>
        <stop offset="0.3" stop-color="#FFC8A0"/>
        <stop offset="0.7" stop-color="#FFE0C0"/>
        <stop offset="1" stop-color="#FFF2DC"/>
      </linearGradient>
      <linearGradient id="mf-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFE0B0" stop-opacity="0.85"/>
        <stop offset="0.5" stop-color="#F5C088" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#D8A878" stop-opacity="0.5"/>
      </linearGradient>
    </defs>
    <rect width="600" height="360" fill="url(#mf-sky)"/>

    <!-- Sun glow -->
    <circle cx="120" cy="100" r="60" fill="#FFE9C2" opacity="0.5"/>
    <circle cx="120" cy="100" r="38" fill="#FFD68A" opacity="0.85"/>
    <circle cx="120" cy="100" r="22" fill="#FFEFB0"/>

    <!-- Hyde Park trees in distance -->
    <g opacity="0.45" fill="#3D5A3D">
      <ellipse cx="200" cy="220" rx="80" ry="20"/>
      <ellipse cx="320" cy="218" rx="100" ry="22"/>
      <ellipse cx="450" cy="222" rx="80" ry="20"/>
      <ellipse cx="540" cy="225" rx="60" ry="18"/>
    </g>
    <!-- Tree tops -->
    <g opacity="0.6" fill="#5A8A48">
      <ellipse cx="180" cy="205" rx="20" ry="14"/>
      <ellipse cx="220" cy="200" rx="22" ry="15"/>
      <ellipse cx="280" cy="208" rx="18" ry="12"/>
      <ellipse cx="340" cy="200" rx="25" ry="16"/>
      <ellipse cx="400" cy="206" rx="20" ry="14"/>
      <ellipse cx="460" cy="200" rx="22" ry="15"/>
    </g>

    <!-- Distant buildings (London skyline) -->
    <g opacity="0.4" fill="#7A6850">
      <rect x="0" y="170" width="60" height="60"/>
      <rect x="60" y="180" width="40" height="50"/>
      <!-- Hint of Shard -->
      <polygon points="540,170 555,150 570,170 575,230 535,230"/>
      <rect x="490" y="195" width="40" height="35"/>
    </g>

    <!-- OUR PENTHOUSE BUILDING — modern glass tower (right of centre) -->
    <!-- Building footprint with rooftop terrace -->
    <!-- Lower floors (semi-visible base) -->
    <rect x="280" y="230" width="200" height="90" fill="#E8DCC8"/>
    <!-- Floor lines -->
    <line x1="280" y1="260" x2="480" y2="260" stroke="#C8B89A" stroke-width="1"/>
    <line x1="280" y1="290" x2="480" y2="290" stroke="#C8B89A" stroke-width="1"/>
    <!-- Lower floor windows -->
    <g>
      <rect x="295" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="325" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="355" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="385" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="415" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="445" y="240" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="295" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="325" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="355" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="385" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="415" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="445" y="270" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="295" y="300" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="325" y="300" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="355" y="300" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="385" y="300" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="415" y="300" width="22" height="14" fill="url(#mf-glass)"/>
      <rect x="445" y="300" width="22" height="14" fill="url(#mf-glass)"/>
    </g>

    <!-- PENTHOUSE — top floor with terrace (this is our space) -->
    <!-- Terrace floor -->
    <rect x="270" y="225" width="220" height="8" fill="#D8C8B0"/>
    <rect x="270" y="220" width="220" height="6" fill="#E8DCC8"/>
    <!-- Penthouse glass walls (full-height windows) -->
    <rect x="305" y="160" width="160" height="65" fill="url(#mf-glass)" stroke="#3A2818" stroke-width="1.5"/>
    <!-- Vertical mullions -->
    <line x1="345" y1="160" x2="345" y2="225" stroke="#3A2818" stroke-width="1"/>
    <line x1="385" y1="160" x2="385" y2="225" stroke="#3A2818" stroke-width="1"/>
    <line x1="425" y1="160" x2="425" y2="225" stroke="#3A2818" stroke-width="1"/>
    <!-- Roof slab -->
    <rect x="295" y="155" width="180" height="8" fill="#3A2818"/>
    <rect x="290" y="151" width="190" height="5" fill="#5A4030"/>

    <!-- Interior glow visible through glass -->
    <ellipse cx="325" cy="200" rx="14" ry="20" fill="#FFE8B0" opacity="0.6"/>
    <ellipse cx="405" cy="200" rx="16" ry="20" fill="#FFE8B0" opacity="0.7"/>
    <!-- Hint of furniture inside (sofa silhouette) -->
    <rect x="350" y="200" width="30" height="18" fill="#E8C8A0" opacity="0.55"/>
    <rect x="410" y="200" width="22" height="18" fill="#A88860" opacity="0.4"/>

    <!-- TERRACE FURNITURE -->
    <!-- Outdoor sofa -->
    <g>
      <rect x="285" y="208" width="40" height="14" fill="#E8DCC8"/>
      <rect x="285" y="200" width="40" height="9" fill="#F0E4D0"/>
      <rect x="280" y="200" width="6" height="22" fill="#A89878"/>
      <rect x="324" y="200" width="6" height="22" fill="#A89878"/>
      <!-- Cushions -->
      <rect x="290" y="202" width="14" height="6" fill="#5A8068"/>
      <rect x="307" y="202" width="14" height="6" fill="#A04060"/>
    </g>

    <!-- Outdoor armchair -->
    <g>
      <rect x="465" y="208" width="20" height="14" fill="#E8DCC8"/>
      <rect x="465" y="200" width="20" height="9" fill="#F0E4D0"/>
      <rect x="461" y="200" width="5" height="22" fill="#A89878"/>
      <rect x="484" y="200" width="5" height="22" fill="#A89878"/>
    </g>

    <!-- Round side table with vase -->
    <g>
      <ellipse cx="445" cy="218" rx="10" ry="3" fill="#3A2818"/>
      <rect x="443" y="213" width="4" height="6" fill="#3A2818"/>
      <rect x="438" y="208" width="14" height="5" fill="#A0C8D8"/>
      <ellipse cx="445" cy="208" rx="7" ry="2" fill="#7A98A8"/>
      <!-- Flowers in vase -->
      <circle cx="442" cy="204" r="2" fill="#E8517D"/>
      <circle cx="447" cy="203" r="2" fill="#FFE0A0"/>
      <circle cx="445" cy="201" r="2" fill="#E8517D"/>
    </g>

    <!-- Glass balustrade around terrace -->
    <g>
      <rect x="270" y="215" width="220" height="10" fill="#A0C8D8" opacity="0.45" stroke="#3A2818" stroke-width="0.5"/>
      <line x1="280" y1="215" x2="280" y2="225" stroke="#3A2818" stroke-width="1"/>
      <line x1="320" y1="215" x2="320" y2="225" stroke="#3A2818" stroke-width="1"/>
      <line x1="360" y1="215" x2="360" y2="225" stroke="#3A2818" stroke-width="1"/>
      <line x1="400" y1="215" x2="400" y2="225" stroke="#3A2818" stroke-width="1"/>
      <line x1="440" y1="215" x2="440" y2="225" stroke="#3A2818" stroke-width="1"/>
      <line x1="480" y1="215" x2="480" y2="225" stroke="#3A2818" stroke-width="1"/>
    </g>

    <!-- Planters along terrace edge -->
    <g>
      <rect x="335" y="218" width="14" height="10" fill="#3A2818"/>
      <ellipse cx="342" cy="216" rx="8" ry="4" fill="#5A8A48"/>
      <rect x="375" y="218" width="14" height="10" fill="#3A2818"/>
      <ellipse cx="382" cy="216" rx="8" ry="4" fill="#5A8A48"/>
      <rect x="415" y="218" width="14" height="10" fill="#3A2818"/>
      <ellipse cx="422" cy="216" rx="8" ry="4" fill="#5A8A48"/>
    </g>

    <!-- Doorman / entrance canopy on building below -->
    <g>
      <!-- Entrance awning -->
      <rect x="350" y="316" width="60" height="4" fill="#3A2818"/>
      <rect x="346" y="313" width="68" height="4" fill="#5A4030"/>
      <!-- Doorman -->
      <rect x="376" y="318" width="8" height="2" fill="#1A1A1A"/>
      <ellipse cx="380" cy="312" rx="4" ry="6" fill="#1A1A1A"/>
      <circle cx="380" cy="305" r="3" fill="#D8B89A"/>
      <rect x="377" y="302" width="6" height="2" fill="#3A2818"/>
    </g>

    <!-- Mercedes S-class parked outside (luxury vibe) -->
    <g>
      <!-- Body -->
      <rect x="100" y="305" width="120" height="22" rx="6" fill="#1A1A1A"/>
      <path d="M 110 305 L 130 290 L 200 290 L 215 305" fill="#1A1A1A"/>
      <!-- Windows -->
      <path d="M 132 303 L 145 293 L 175 293 L 187 303 Z" fill="#5A6878" opacity="0.8"/>
      <path d="M 188 303 L 192 293 L 198 293 L 213 303 Z" fill="#5A6878" opacity="0.8"/>
      <!-- Wheels -->
      <circle cx="128" cy="328" r="9" fill="#1A1A1A"/>
      <circle cx="128" cy="328" r="5" fill="#3A3A3A"/>
      <circle cx="128" cy="328" r="2" fill="#A0A0A0"/>
      <circle cx="200" cy="328" r="9" fill="#1A1A1A"/>
      <circle cx="200" cy="328" r="5" fill="#3A3A3A"/>
      <circle cx="200" cy="328" r="2" fill="#A0A0A0"/>
      <!-- Headlights -->
      <ellipse cx="218" cy="313" rx="3" ry="2" fill="#FFE8B0"/>
      <!-- Mercedes star (subtle) -->
      <circle cx="219" cy="307" r="2" fill="#A0A0A0"/>
    </g>

    <!-- Pavement -->
    <rect x="0" y="320" width="600" height="40" fill="#5A5048"/>
    <rect x="0" y="320" width="600" height="2" fill="#3A3530"/>

    <!-- Flag pole on top -->
    <g>
      <rect x="295" y="120" width="2" height="34" fill="#1A1A1A"/>
      <path d="M 297 122 L 318 125 L 318 137 L 297 134 Z" fill="#A04060"/>
      <line x1="297" y1="122" x2="318" y2="125" stroke="#5A2030" stroke-width="0.5"/>
    </g>

    <!-- Birds in golden sky -->
    <g stroke="#5A4030" stroke-width="1.4" fill="none" opacity="0.7">
      <path d="M 380 70 q 4 -4 8 0 q 4 -4 8 0"/>
      <path d="M 420 90 q 3 -3 6 0 q 3 -3 6 0"/>
      <path d="M 480 75 q 4 -4 8 0 q 4 -4 8 0"/>
    </g>

    <!-- OUR HOUSE indicator -->
    <g>
      <circle cx="385" cy="142" r="9" fill="#F5A623"/>
      <text x="385" y="147" font-family="Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">★</text>
    </g>

    <!-- "MAYFAIR" subtle district label -->
    <text x="20" y="345" font-family="Georgia,serif" font-size="10" font-weight="700" fill="#3A2818" letter-spacing="3" opacity="0.7">MAYFAIR · W1</text>
  `, '', '#FFC8A0');
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. KENSINGTON MANSION — Grand Regency, gates, embassy-row vibe
// ═══════════════════════════════════════════════════════════════════════════
function heroKensington() {
  return svgWrap(`
    <defs>
      <linearGradient id="ke-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7A98B0"/>
        <stop offset="0.5" stop-color="#A8C0D0"/>
        <stop offset="1" stop-color="#D8E0E8"/>
      </linearGradient>
      <radialGradient id="ke-glow" cx="0.5" cy="0.4" r="0.5">
        <stop offset="0" stop-color="#FFE9C2" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#FFE9C2" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="360" fill="url(#ke-sky)"/>
    <rect width="600" height="360" fill="url(#ke-glow)"/>

    <!-- Distant trees (private gardens) -->
    <g opacity="0.5" fill="#4A7848">
      <ellipse cx="50" cy="170" rx="40" ry="22"/>
      <ellipse cx="120" cy="165" rx="50" ry="25"/>
      <ellipse cx="490" cy="170" rx="50" ry="25"/>
      <ellipse cx="560" cy="168" rx="40" ry="22"/>
    </g>

    <!-- MAIN MANSION — central, grand, Regency white stucco -->
    <!-- Side wings -->
    <rect x="60" y="170" width="120" height="160" fill="#F0E8D8"/>
    <rect x="420" y="170" width="120" height="160" fill="#F0E8D8"/>
    <!-- Wing roofs -->
    <rect x="55" y="160" width="130" height="12" fill="#3A2818"/>
    <rect x="415" y="160" width="130" height="12" fill="#3A2818"/>

    <!-- Central main block (taller, grander) -->
    <rect x="170" y="130" width="260" height="200" fill="#F8F0DC"/>

    <!-- Roof of central block -->
    <polygon points="160,130 300,80 440,130" fill="#3A2818"/>
    <polygon points="160,130 300,80 440,130 440,140 160,140" fill="#5A4030" opacity="0.5"/>
    <!-- Decorative ridge -->
    <rect x="280" y="78" width="40" height="4" fill="#5A4030"/>
    <!-- Central crest / coat of arms -->
    <circle cx="300" cy="100" r="10" fill="#D4AF37" stroke="#5A4030" stroke-width="1"/>
    <text x="300" y="105" font-family="Georgia,serif" font-size="11" font-weight="700" text-anchor="middle" fill="#5A4030">K</text>

    <!-- Triangular pediment over front (Greek temple style) -->
    <polygon points="200,165 300,118 400,165" fill="#F8F0DC"/>
    <polygon points="200,165 300,118 400,165 400,170 200,170" fill="#3A2818"/>
    <!-- Pediment dentils -->
    <g fill="#D8C8A0">
      ${Array.from({length: 18}, (_, i) => `<rect x="${204 + i*11}" y="160" width="6" height="4"/>`).join('')}
    </g>

    <!-- 4 Massive Corinthian columns at front -->
    <g>
      ${[225, 265, 335, 375].map(cx => `
        <!-- Column shaft -->
        <rect x="${cx-7}" y="170" width="14" height="155" fill="#F0E8D8"/>
        <!-- Vertical fluting -->
        <line x1="${cx-5}" y1="172" x2="${cx-5}" y2="320" stroke="#D8C8A0" stroke-width="0.6"/>
        <line x1="${cx-2}" y1="172" x2="${cx-2}" y2="320" stroke="#D8C8A0" stroke-width="0.6"/>
        <line x1="${cx+1}" y1="172" x2="${cx+1}" y2="320" stroke="#D8C8A0" stroke-width="0.6"/>
        <line x1="${cx+4}" y1="172" x2="${cx+4}" y2="320" stroke="#D8C8A0" stroke-width="0.6"/>
        <!-- Capital -->
        <rect x="${cx-12}" y="166" width="24" height="6" fill="#E8DCC0"/>
        <rect x="${cx-10}" y="170" width="20" height="3" fill="#D8C8A0"/>
        <!-- Decorative volutes -->
        <circle cx="${cx-8}" cy="170" r="2" fill="#D4AF37" opacity="0.7"/>
        <circle cx="${cx+8}" cy="170" r="2" fill="#D4AF37" opacity="0.7"/>
        <!-- Base -->
        <rect x="${cx-10}" y="320" width="20" height="6" fill="#D8C8A0"/>
      `).join('')}
    </g>

    <!-- Massive double doors in centre between columns -->
    <g>
      <rect x="285" y="240" width="30" height="80" fill="#3A1818"/>
      <rect x="287" y="242" width="13" height="76" fill="#2A0A0A"/>
      <rect x="300" y="242" width="13" height="76" fill="#2A0A0A"/>
      <!-- Door panels -->
      <rect x="290" y="252" width="9" height="20" fill="none" stroke="#000" stroke-width="0.5"/>
      <rect x="301" y="252" width="9" height="20" fill="none" stroke="#000" stroke-width="0.5"/>
      <rect x="290" y="280" width="9" height="20" fill="none" stroke="#000" stroke-width="0.5"/>
      <rect x="301" y="280" width="9" height="20" fill="none" stroke="#000" stroke-width="0.5"/>
      <!-- Brass knocker -->
      <circle cx="295" cy="278" r="2.5" fill="#D4AF37"/>
      <circle cx="305" cy="278" r="2.5" fill="#D4AF37"/>
      <!-- Decorative arched fanlight -->
      <path d="M 285 240 L 315 240 Q 315 222 300 218 Q 285 222 285 240 Z" fill="#FFE8B0" stroke="#5A4030" stroke-width="1"/>
      <line x1="300" y1="218" x2="300" y2="240" stroke="#5A4030" stroke-width="0.6"/>
      <line x1="288" y1="232" x2="312" y2="232" stroke="#5A4030" stroke-width="0.4"/>
    </g>

    <!-- Wing windows (3 floors x 2 windows per wing) -->
    <g>
      <!-- Left wing -->
      ${[80, 140].map(cx => `
        <rect x="${cx-15}" y="185" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="185" x2="${cx}" y2="223" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="204" x2="${cx+15}" y2="204" stroke="#5A4030" stroke-width="1"/>

        <rect x="${cx-15}" y="240" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="240" x2="${cx}" y2="278" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="259" x2="${cx+15}" y2="259" stroke="#5A4030" stroke-width="1"/>

        <rect x="${cx-15}" y="290" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="290" x2="${cx}" y2="328" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="309" x2="${cx+15}" y2="309" stroke="#5A4030" stroke-width="1"/>
      `).join('')}
      <!-- Right wing -->
      ${[460, 520].map(cx => `
        <rect x="${cx-15}" y="185" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="185" x2="${cx}" y2="223" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="204" x2="${cx+15}" y2="204" stroke="#5A4030" stroke-width="1"/>

        <rect x="${cx-15}" y="240" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="240" x2="${cx}" y2="278" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="259" x2="${cx+15}" y2="259" stroke="#5A4030" stroke-width="1"/>

        <rect x="${cx-15}" y="290" width="30" height="38" fill="#3A4A5A" stroke="#5A4030" stroke-width="1.5"/>
        <line x1="${cx}" y1="290" x2="${cx}" y2="328" stroke="#5A4030" stroke-width="1"/>
        <line x1="${cx-15}" y1="309" x2="${cx+15}" y2="309" stroke="#5A4030" stroke-width="1"/>
      `).join('')}
    </g>

    <!-- Iron gates and gateposts in foreground -->
    <g>
      <!-- Left gatepost -->
      <rect x="195" y="270" width="14" height="50" fill="#E8DCC0"/>
      <rect x="193" y="266" width="18" height="6" fill="#D8C8A0"/>
      <rect x="191" y="262" width="22" height="4" fill="#5A4030"/>
      <!-- Pineapple finial -->
      <ellipse cx="202" cy="258" rx="5" ry="6" fill="#D4AF37"/>
      <line x1="202" y1="252" x2="202" y2="246" stroke="#5A8A48" stroke-width="2"/>

      <!-- Right gatepost -->
      <rect x="391" y="270" width="14" height="50" fill="#E8DCC0"/>
      <rect x="389" y="266" width="18" height="6" fill="#D8C8A0"/>
      <rect x="387" y="262" width="22" height="4" fill="#5A4030"/>
      <ellipse cx="398" cy="258" rx="5" ry="6" fill="#D4AF37"/>
      <line x1="398" y1="252" x2="398" y2="246" stroke="#5A8A48" stroke-width="2"/>

      <!-- Gate bars (wrought iron) -->
      <g stroke="#1A1A1A" stroke-width="1.5" fill="none">
        <line x1="210" y1="320" x2="210" y2="278"/>
        <line x1="220" y1="320" x2="220" y2="270"/>
        <line x1="230" y1="320" x2="230" y2="265"/>
        <line x1="240" y1="320" x2="240" y2="262"/>
        <line x1="250" y1="320" x2="250" y2="260"/>
        <line x1="260" y1="320" x2="260" y2="262"/>
        <line x1="270" y1="320" x2="270" y2="265"/>
        <line x1="280" y1="320" x2="280" y2="270"/>
        <line x1="290" y1="320" x2="290" y2="278"/>
        <line x1="310" y1="320" x2="310" y2="278"/>
        <line x1="320" y1="320" x2="320" y2="270"/>
        <line x1="330" y1="320" x2="330" y2="265"/>
        <line x1="340" y1="320" x2="340" y2="262"/>
        <line x1="350" y1="320" x2="350" y2="260"/>
        <line x1="360" y1="320" x2="360" y2="262"/>
        <line x1="370" y1="320" x2="370" y2="265"/>
        <line x1="380" y1="320" x2="380" y2="270"/>
        <line x1="390" y1="320" x2="390" y2="278"/>
        <!-- Top crest curves -->
        <path d="M 210 278 q 40 -25 80 0"/>
        <path d="M 310 278 q 40 -25 80 0"/>
        <!-- Centre crown -->
        <path d="M 295 278 q 5 -15 10 0" stroke-width="1.2"/>
        <circle cx="300" cy="270" r="3" fill="#D4AF37"/>
      </g>

      <!-- Gravel driveway visible through gates -->
      <rect x="210" y="320" width="180" height="6" fill="#D8C8A8" opacity="0.6"/>
    </g>

    <!-- Topiary in pots flanking gates -->
    <g>
      <rect x="172" y="290" width="18" height="30" fill="#5A4030"/>
      <ellipse cx="181" cy="285" rx="14" ry="11" fill="#3D6A38"/>
      <ellipse cx="181" cy="278" rx="10" ry="7" fill="#5A8A48"/>
      <ellipse cx="181" cy="272" rx="6" ry="5" fill="#7AAA68"/>

      <rect x="410" y="290" width="18" height="30" fill="#5A4030"/>
      <ellipse cx="419" cy="285" rx="14" ry="11" fill="#3D6A38"/>
      <ellipse cx="419" cy="278" rx="10" ry="7" fill="#5A8A48"/>
      <ellipse cx="419" cy="272" rx="6" ry="5" fill="#7AAA68"/>
    </g>

    <!-- Pavement -->
    <rect x="0" y="320" width="600" height="40" fill="#A89A88"/>
    <rect x="0" y="320" width="600" height="2" fill="#5A4838"/>

    <!-- Black security bollards at edge -->
    <g>
      <rect x="20" y="316" width="6" height="14" rx="2" fill="#1A1A1A"/>
      <circle cx="23" cy="316" r="3" fill="#1A1A1A"/>
      <circle cx="23" cy="314" r="1" fill="#D4AF37"/>

      <rect x="80" y="316" width="6" height="14" rx="2" fill="#1A1A1A"/>
      <circle cx="83" cy="316" r="3" fill="#1A1A1A"/>
      <circle cx="83" cy="314" r="1" fill="#D4AF37"/>

      <rect x="510" y="316" width="6" height="14" rx="2" fill="#1A1A1A"/>
      <circle cx="513" cy="316" r="3" fill="#1A1A1A"/>
      <circle cx="513" cy="314" r="1" fill="#D4AF37"/>

      <rect x="570" y="316" width="6" height="14" rx="2" fill="#1A1A1A"/>
      <circle cx="573" cy="316" r="3" fill="#1A1A1A"/>
      <circle cx="573" cy="314" r="1" fill="#D4AF37"/>
    </g>

    <!-- Embassy-style flag flying from one wing -->
    <g>
      <rect x="119" y="158" width="2" height="32" fill="#1A1A1A"/>
      <path d="M 121 160 L 145 162 L 145 175 L 121 173 Z" fill="#A04060"/>
      <circle cx="133" cy="167" r="3" fill="#D4AF37"/>
    </g>

    <!-- Birds soaring -->
    <g stroke="#3A2818" stroke-width="1.4" fill="none" opacity="0.6">
      <path d="M 80 80 q 5 -5 10 0 q 5 -5 10 0"/>
      <path d="M 480 70 q 5 -5 10 0 q 5 -5 10 0"/>
    </g>

    <!-- District label -->
    <text x="20" y="350" font-family="Georgia,serif" font-size="10" font-weight="700" fill="#3A2818" letter-spacing="3" opacity="0.7">KENSINGTON · W8</text>
  `, '', '#A8C0D0');
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. COVENT GARDEN ROYAL PENTHOUSE — Opera House with penthouse on top
// ═══════════════════════════════════════════════════════════════════════════
function heroCoventGarden() {
  return svgWrap(`
    <defs>
      <radialGradient id="cg-sky" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stop-color="#3D2A4A"/>
        <stop offset="0.5" stop-color="#2A1A35"/>
        <stop offset="1" stop-color="#0A0510"/>
      </radialGradient>
      <radialGradient id="cg-marquee" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FFE08A"/>
        <stop offset="1" stop-color="#FFE08A" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="360" fill="url(#cg-sky)"/>

    <!-- Stars in night sky -->
    <g fill="#FFFEC8">
      <circle cx="80" cy="40" r="1"/><circle cx="120" cy="60" r="0.8"/>
      <circle cx="180" cy="35" r="1.2"/><circle cx="240" cy="55" r="0.8"/>
      <circle cx="290" cy="30" r="1"/><circle cx="350" cy="50" r="0.8"/>
      <circle cx="410" cy="35" r="1.2"/><circle cx="470" cy="60" r="0.8"/>
      <circle cx="530" cy="40" r="1"/><circle cx="570" cy="65" r="0.8"/>
      <circle cx="50" cy="80" r="0.7"/><circle cx="140" cy="95" r="0.7"/>
      <circle cx="380" cy="100" r="0.7"/><circle cx="500" cy="110" r="0.7"/>
    </g>
    <!-- Crescent moon -->
    <g>
      <circle cx="510" cy="55" r="14" fill="#FFFEC8"/>
      <circle cx="514" cy="52" r="13" fill="url(#cg-sky)"/>
    </g>

    <!-- Distant theatre district silhouette -->
    <g opacity="0.6" fill="#1A0A18">
      <rect x="0" y="200" width="80" height="140"/>
      <rect x="80" y="180" width="50" height="160"/>
      <rect x="500" y="190" width="60" height="150"/>
      <rect x="555" y="170" width="45" height="170"/>
    </g>
    <!-- Distant lit windows -->
    <g fill="#FFE08A" opacity="0.7">
      <rect x="20" y="220" width="4" height="6"/>
      <rect x="40" y="240" width="4" height="6"/>
      <rect x="60" y="230" width="4" height="6"/>
      <rect x="95" y="200" width="4" height="6"/>
      <rect x="110" y="220" width="4" height="6"/>
      <rect x="515" y="210" width="4" height="6"/>
      <rect x="535" y="230" width="4" height="6"/>
      <rect x="565" y="195" width="4" height="6"/>
      <rect x="585" y="220" width="4" height="6"/>
    </g>

    <!-- ROYAL OPERA HOUSE — central, classical -->
    <!-- Main facade body -->
    <rect x="120" y="180" width="360" height="140" fill="#D8C0A0"/>
    <!-- Glow from windows -->
    <rect x="120" y="180" width="360" height="140" fill="#FFE08A" opacity="0.06"/>

    <!-- Greek pediment over main entrance -->
    <polygon points="180,180 300,118 420,180" fill="#E0CAA8"/>
    <polygon points="180,180 300,118 420,180 420,185 180,185" fill="#3A2818"/>
    <!-- Pediment sculpture (Apollo / Muses silhouettes) -->
    <g opacity="0.6">
      <circle cx="280" cy="158" r="3" fill="#5A4030"/>
      <ellipse cx="280" cy="168" rx="2" ry="5" fill="#5A4030"/>
      <circle cx="300" cy="148" r="3" fill="#5A4030"/>
      <ellipse cx="300" cy="158" rx="2" ry="5" fill="#5A4030"/>
      <circle cx="320" cy="158" r="3" fill="#5A4030"/>
      <ellipse cx="320" cy="168" rx="2" ry="5" fill="#5A4030"/>
    </g>

    <!-- 6 Corinthian columns under pediment -->
    <g>
      ${[195, 235, 275, 315, 355, 395].map(cx => `
        <rect x="${cx-6}" y="180" width="12" height="100" fill="#E0CAA8"/>
        <line x1="${cx-4}" y1="182" x2="${cx-4}" y2="278" stroke="#C8B090" stroke-width="0.5"/>
        <line x1="${cx-1}" y1="182" x2="${cx-1}" y2="278" stroke="#C8B090" stroke-width="0.5"/>
        <line x1="${cx+2}" y1="182" x2="${cx+2}" y2="278" stroke="#C8B090" stroke-width="0.5"/>
        <line x1="${cx+5}" y1="182" x2="${cx+5}" y2="278" stroke="#C8B090" stroke-width="0.5"/>
        <!-- Capital -->
        <rect x="${cx-9}" y="178" width="18" height="4" fill="#F0DAB8"/>
        <!-- Base -->
        <rect x="${cx-9}" y="278" width="18" height="5" fill="#C8B090"/>
      `).join('')}
    </g>

    <!-- Main entrance door (centre) -->
    <g>
      <rect x="285" y="245" width="30" height="40" fill="#3A1A0A"/>
      <rect x="287" y="247" width="13" height="38" fill="#1A0500"/>
      <rect x="300" y="247" width="13" height="38" fill="#1A0500"/>
      <!-- Glow from inside -->
      <rect x="287" y="247" width="13" height="38" fill="#FFE08A" opacity="0.2"/>
      <rect x="300" y="247" width="13" height="38" fill="#FFE08A" opacity="0.2"/>
      <!-- Doorman -->
      <ellipse cx="270" cy="278" rx="3" ry="5" fill="#1A0A20"/>
      <circle cx="270" cy="271" r="2.5" fill="#D8B89A"/>
      <rect x="268" y="269" width="4" height="2" fill="#1A0A20"/>
    </g>

    <!-- THEATRE MARQUEE / GLOWING SIGN over entrance -->
    <g>
      <rect x="220" y="220" width="160" height="22" fill="#1A0510" stroke="#D4AF37" stroke-width="1.5" rx="2"/>
      <rect x="220" y="220" width="160" height="22" fill="url(#cg-marquee)" opacity="0.6"/>
      <text x="300" y="234" font-family="Georgia,serif" font-size="12" font-weight="700" text-anchor="middle" fill="#FFE08A" letter-spacing="1">ROYAL OPERA HOUSE</text>
      <!-- Marquee bulbs around edge -->
      ${Array.from({length: 12}, (_, i) => `<circle cx="${225 + i*13}" cy="220" r="1.5" fill="#FFEFB0"/>`).join('')}
      ${Array.from({length: 12}, (_, i) => `<circle cx="${225 + i*13}" cy="242" r="1.5" fill="#FFEFB0"/>`).join('')}
      <!-- Tonight's show poster -->
      <rect x="150" y="225" width="50" height="55" fill="#5A1830" stroke="#D4AF37" stroke-width="1"/>
      <text x="175" y="240" font-family="Georgia,serif" font-size="6" font-weight="700" text-anchor="middle" fill="#FFE08A">TONIGHT</text>
      <text x="175" y="252" font-family="Georgia,serif" font-size="9" font-weight="700" text-anchor="middle" fill="#FFE08A">LA</text>
      <text x="175" y="263" font-family="Georgia,serif" font-size="9" font-weight="700" text-anchor="middle" fill="#FFE08A">TRAVIATA</text>
      <text x="175" y="275" font-family="Georgia,serif" font-size="5" text-anchor="middle" fill="#FFE08A">19:30</text>
    </g>

    <!-- Side wing windows with light -->
    <g>
      <rect x="140" y="235" width="20" height="35" fill="#FFE08A" stroke="#3A1A0A" stroke-width="1.5"/>
      <line x1="150" y1="235" x2="150" y2="270" stroke="#3A1A0A" stroke-width="0.6"/>
      <line x1="140" y1="252" x2="160" y2="252" stroke="#3A1A0A" stroke-width="0.6"/>
      <rect x="430" y="235" width="20" height="35" fill="#FFE08A" stroke="#3A1A0A" stroke-width="1.5"/>
      <line x1="440" y1="235" x2="440" y2="270" stroke="#3A1A0A" stroke-width="0.6"/>
      <line x1="430" y1="252" x2="450" y2="252" stroke="#3A1A0A" stroke-width="0.6"/>
      <!-- Hint of chandelier inside -->
      <circle cx="150" cy="245" r="2" fill="#FFEFB0"/>
      <circle cx="440" cy="245" r="2" fill="#FFEFB0"/>
    </g>

    <!-- DOMED ROOF on right side of opera house -->
    <g>
      <ellipse cx="430" cy="180" rx="38" ry="14" fill="#D8C0A0"/>
      <path d="M 392 180 Q 392 130 430 130 Q 468 130 468 180 Z" fill="#5A8068"/>
      <path d="M 395 180 Q 395 138 430 138 Q 465 138 465 180 Z" fill="#7A9A82"/>
      <!-- Dome ribs -->
      <line x1="430" y1="138" x2="430" y2="180" stroke="#3D5A48" stroke-width="0.5"/>
      <path d="M 410 145 Q 415 165 405 178" stroke="#3D5A48" stroke-width="0.5" fill="none"/>
      <path d="M 450 145 Q 445 165 455 178" stroke="#3D5A48" stroke-width="0.5" fill="none"/>
      <!-- Spire -->
      <rect x="428" y="118" width="4" height="14" fill="#D4AF37"/>
      <polygon points="428,118 430,108 432,118" fill="#D4AF37"/>
      <circle cx="430" cy="125" r="3" fill="#D4AF37"/>
      <!-- Cross-shaped finial -->
      <line x1="430" y1="106" x2="430" y2="100" stroke="#D4AF37" stroke-width="2"/>
      <line x1="427" y1="103" x2="433" y2="103" stroke="#D4AF37" stroke-width="2"/>
    </g>

    <!-- OUR PENTHOUSE — glass extension on TOP of the opera house roof, left side -->
    <g>
      <!-- Penthouse base (matches opera house cornice) -->
      <rect x="135" y="160" width="160" height="20" fill="#3A2818"/>
      <!-- Glass cube -->
      <rect x="150" y="115" width="130" height="46" fill="#5A4060" opacity="0.4" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Mullions -->
      <line x1="180" y1="115" x2="180" y2="161" stroke="#D4AF37" stroke-width="0.8"/>
      <line x1="215" y1="115" x2="215" y2="161" stroke="#D4AF37" stroke-width="0.8"/>
      <line x1="250" y1="115" x2="250" y2="161" stroke="#D4AF37" stroke-width="0.8"/>
      <line x1="150" y1="138" x2="280" y2="138" stroke="#D4AF37" stroke-width="0.8"/>
      <!-- Warm interior glow -->
      <rect x="153" y="118" width="124" height="40" fill="#FFE08A" opacity="0.18"/>
      <!-- Hint of chandelier inside -->
      <circle cx="215" cy="135" r="5" fill="#FFE08A" opacity="0.85"/>
      <g stroke="#FFE08A" stroke-width="0.4" opacity="0.6">
        <line x1="215" y1="115" x2="215" y2="130"/>
      </g>
      <!-- Roof of penthouse -->
      <rect x="148" y="111" width="134" height="5" fill="#D4AF37"/>
      <!-- Rooftop terrace railing on top edge -->
      <line x1="135" y1="160" x2="295" y2="160" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Terrace plants -->
      <rect x="142" y="155" width="8" height="6" fill="#3A2818"/>
      <ellipse cx="146" cy="151" rx="6" ry="4" fill="#5A8A48"/>
      <rect x="285" y="155" width="8" height="6" fill="#3A2818"/>
      <ellipse cx="289" cy="151" rx="6" ry="4" fill="#5A8A48"/>
      <!-- Outdoor sofa silhouette -->
      <rect x="200" y="148" width="40" height="12" fill="#3A2A20"/>
      <rect x="200" y="143" width="40" height="6" fill="#5A4030"/>
    </g>

    <!-- Royal crest on penthouse front -->
    <g>
      <rect x="206" y="120" width="18" height="14" fill="#5A1830" stroke="#D4AF37" stroke-width="0.8"/>
      <circle cx="215" cy="127" r="3" fill="#D4AF37"/>
      <text x="215" y="129" font-family="Georgia,serif" font-size="4" font-weight="700" text-anchor="middle" fill="#1A0510">CG</text>
    </g>

    <!-- Theatre crowd in foreground (silhouettes) -->
    <g opacity="0.85">
      <!-- Couple 1 (man + woman) -->
      <ellipse cx="80" cy="320" rx="5" ry="13" fill="#1A0A20"/>
      <circle cx="80" cy="305" r="4" fill="#D8B89A"/>
      <ellipse cx="100" cy="320" rx="5" ry="13" fill="#5A1830"/>
      <circle cx="100" cy="305" r="4" fill="#D8B89A"/>
      <!-- Long dress -->
      <path d="M 95 320 L 92 340 L 108 340 L 105 320 Z" fill="#5A1830"/>

      <!-- Group 2 -->
      <ellipse cx="490" cy="320" rx="5" ry="13" fill="#1A0A20"/>
      <circle cx="490" cy="305" r="4" fill="#D8B89A"/>
      <ellipse cx="510" cy="320" rx="5" ry="13" fill="#3A2050"/>
      <circle cx="510" cy="305" r="4" fill="#D8B89A"/>
      <ellipse cx="530" cy="320" rx="5" ry="13" fill="#1A0A20"/>
      <circle cx="530" cy="305" r="4" fill="#D8B89A"/>

      <!-- Bowler hats -->
      <ellipse cx="80" cy="299" rx="4" ry="2" fill="#1A0A20"/>
      <ellipse cx="490" cy="299" rx="4" ry="2" fill="#1A0A20"/>
      <ellipse cx="530" cy="299" rx="4" ry="2" fill="#1A0A20"/>
    </g>

    <!-- Black taxi waiting -->
    <g>
      <rect x="280" y="318" width="60" height="14" rx="2" fill="#1A1A1A"/>
      <rect x="285" y="310" width="50" height="10" rx="2" fill="#1A1A1A"/>
      <rect x="290" y="313" width="14" height="6" fill="#A0C8D8" opacity="0.5"/>
      <rect x="316" y="313" width="14" height="6" fill="#A0C8D8" opacity="0.5"/>
      <circle cx="295" cy="334" r="5" fill="#1A1A1A"/>
      <circle cx="295" cy="334" r="2" fill="#5A5A5A"/>
      <circle cx="325" cy="334" r="5" fill="#1A1A1A"/>
      <circle cx="325" cy="334" r="2" fill="#5A5A5A"/>
      <!-- Yellow "TAXI" sign on top -->
      <rect x="298" y="307" width="24" height="4" fill="#F5A623"/>
      <text x="310" y="310" font-family="Arial,sans-serif" font-size="3" font-weight="700" text-anchor="middle" fill="#1A1A1A">TAXI</text>
    </g>

    <!-- Cobbled piazza -->
    <rect x="0" y="320" width="600" height="40" fill="#3A2A28"/>
    <g opacity="0.5" stroke="#5A4040" stroke-width="0.5" fill="none">
      ${Array.from({length: 30}, (_, i) => `<ellipse cx="${i*22+10}" cy="${328 + (i%3)*4}" rx="8" ry="2"/>`).join('')}
    </g>

    <!-- OUR HOUSE indicator on penthouse -->
    <g>
      <circle cx="215" cy="105" r="9" fill="#F5A623"/>
      <text x="215" y="110" font-family="Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">★</text>
    </g>

    <!-- District label -->
    <text x="20" y="350" font-family="Georgia,serif" font-size="10" font-weight="700" fill="#D4AF37" letter-spacing="3" opacity="0.8">COVENT GARDEN · WC2</text>
  `, '', '#2A1A35');
}
