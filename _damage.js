// ─── DAMAGE OVERLAY SYSTEM ───────────────────────────────────────────────────
// Renders visible problem indicators that overlay the model home or the
// scenario prop area. Each scenario can have a `damage` field that maps to
// one of these renderers. Supports: leak, mould, cockroach, broken_bed,
// vomit, smoke, cracked_window, flood, dark, freezing, party_chaos,
// stained_carpet, rat, hidden_camera, broken_glass, fire, brothel,
// drug_aftermath, faeces, wig, tea_kettle, blood_sheets, condoms.

function renderDamageOverlay(damageType, width = 600, height = 360) {
  if (!damageType) return '';
  const overlays = {
    leak: () => `
      <g class="damage-leak">
        <ellipse cx="${width * 0.5}" cy="${height * 0.05}" rx="${width * 0.15}" ry="6" fill="#5C3026" opacity="0.6"/>
        <ellipse cx="${width * 0.5}" cy="${height * 0.05}" rx="${width * 0.1}" ry="4" fill="#3D2817" opacity="0.7"/>
        ${[...Array(6)].map((_,i) => {
          const dx = width * (0.42 + i * 0.03);
          return `<ellipse class="leak-drip" cx="${dx}" cy="${height * 0.08}" rx="2" ry="4" fill="#5BC0EB" opacity="0.85" style="animation-delay:${i*0.3}s"/>`;
        }).join('')}
        <ellipse cx="${width * 0.5}" cy="${height * 0.92}" rx="${width * 0.18}" ry="5" fill="#5BC0EB" opacity="0.6"/>
        <ellipse cx="${width * 0.5}" cy="${height * 0.92}" rx="${width * 0.12}" ry="3" fill="#3FA8E0" opacity="0.5"/>
      </g>`,

    mould: () => `
      <g class="damage-mould">
        ${[...Array(8)].map((_,i) => {
          const cx = width * (0.05 + (i % 4) * 0.08);
          const cy = height * (0.1 + Math.floor(i / 4) * 0.15);
          const r = 8 + (i % 3) * 4;
          return `<g class="mould-bloom"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#1a1a1a" opacity="0.55"/>
                  <circle cx="${cx-3}" cy="${cy-2}" r="${r*0.6}" fill="#3a2820" opacity="0.5"/>
                  <circle cx="${cx+4}" cy="${cy+3}" r="${r*0.4}" fill="#1a1a1a" opacity="0.6"/></g>`;
        }).join('')}
        ${[...Array(5)].map((_,i) => {
          const cx = width * (0.7 + (i % 3) * 0.07);
          const cy = height * (0.55 + Math.floor(i / 3) * 0.18);
          return `<circle cx="${cx}" cy="${cy}" r="${10 + i * 2}" fill="#2a3a1a" opacity="0.5"/>`;
        }).join('')}
      </g>`,

    cockroach: () => {
      const positions = [[0.15,0.85],[0.32,0.92],[0.55,0.88],[0.72,0.82],[0.85,0.95],[0.25,0.78],[0.6,0.95]];
      return `<g class="damage-roaches">
        ${positions.map(([px,py],i) => {
          const cx = width * px, cy = height * py;
          return `<g class="roach" style="animation-delay:${i*0.4}s">
            <ellipse cx="${cx}" cy="${cy}" rx="6" ry="3.5" fill="#3A1F0A"/>
            <ellipse cx="${cx-1}" cy="${cy-1}" rx="4" ry="2" fill="#5C3010" opacity="0.7"/>
            <line x1="${cx-5}" y1="${cy-1}" x2="${cx-9}" y2="${cy-4}" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="${cx-5}" y1="${cy+1}" x2="${cx-9}" y2="${cy+3}" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="${cx+5}" y1="${cy-1}" x2="${cx+9}" y2="${cy-4}" stroke="#1a1a1a" stroke-width="0.8"/>
            <line x1="${cx+5}" y1="${cy+1}" x2="${cx+9}" y2="${cy+3}" stroke="#1a1a1a" stroke-width="0.8"/>
            <path d="M ${cx-7} ${cy-3} L ${cx-9} ${cy-7}" stroke="#1a1a1a" stroke-width="0.8"/>
            <path d="M ${cx+7} ${cy-3} L ${cx+9} ${cy-7}" stroke="#1a1a1a" stroke-width="0.8"/>
          </g>`;
        }).join('')}
      </g>`;
    },

    rat: () => {
      const cx = width * 0.7, cy = height * 0.9;
      return `<g class="damage-rat">
        <ellipse cx="${cx}" cy="${cy}" rx="18" ry="8" fill="#5A4A3A"/>
        <circle cx="${cx-15}" cy="${cy-2}" r="6" fill="#5A4A3A"/>
        <ellipse cx="${cx-18}" cy="${cy-5}" rx="2" ry="3" fill="#3A2A1A"/>
        <ellipse cx="${cx-20}" cy="${cy-1}" rx="1" ry="0.5" fill="#FFB0B0"/>
        <circle cx="${cx-22}" cy="${cy-2}" r="0.8" fill="#1a1a1a"/>
        <path d="M ${cx+18} ${cy} Q ${cx+30} ${cy-4} ${cx+34} ${cy+2}" stroke="#5A4A3A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>`;
    },

    vomit: () => `
      <g class="damage-vomit">
        <ellipse cx="${width * 0.4}" cy="${height * 0.92}" rx="${width * 0.12}" ry="${height * 0.04}" fill="#6BA844" opacity="0.85"/>
        <ellipse cx="${width * 0.42}" cy="${height * 0.92}" rx="${width * 0.08}" ry="${height * 0.03}" fill="#A8C97F" opacity="0.7"/>
        <circle cx="${width * 0.32}" cy="${height * 0.93}" r="3" fill="#5C3026" opacity="0.6"/>
        <circle cx="${width * 0.48}" cy="${height * 0.92}" r="2" fill="#5C3026" opacity="0.6"/>
        <g class="vomit-stink">
          <path d="M ${width * 0.4} ${height * 0.85} Q ${width * 0.38} ${height * 0.78} ${width * 0.41} ${height * 0.73}" fill="none" stroke="#7AAA50" stroke-width="2" opacity="0.6"/>
          <path d="M ${width * 0.45} ${height * 0.85} Q ${width * 0.47} ${height * 0.78} ${width * 0.44} ${height * 0.72}" fill="none" stroke="#7AAA50" stroke-width="2" opacity="0.5"/>
        </g>
      </g>`,

    smoke: () => `
      <g class="damage-smoke">
        ${[...Array(6)].map((_,i) => {
          const cx = width * (0.4 + i * 0.04);
          const cy = height * (0.5 - i * 0.06);
          return `<circle class="smoke-puff" cx="${cx}" cy="${cy}" r="${15 + i * 3}" fill="#4A4A4A" opacity="${0.5 - i * 0.05}" style="animation-delay:${i*0.2}s"/>`;
        }).join('')}
        <rect x="${width * 0.3}" y="${height * 0.65}" width="${width * 0.2}" height="${height * 0.2}" fill="#1a1a1a" opacity="0.4"/>
        <path d="M ${width * 0.32} ${height * 0.7} L ${width * 0.36} ${height * 0.78} L ${width * 0.4} ${height * 0.7} L ${width * 0.44} ${height * 0.8} L ${width * 0.48} ${height * 0.7}" fill="#FF6A1A" opacity="0.85"/>
      </g>`,

    fire: () => `
      <g class="damage-fire">
        ${[...Array(8)].map((_,i) => {
          const cx = width * (0.3 + i * 0.05);
          const baseY = height * 0.85;
          return `<path class="flame" d="M ${cx} ${baseY} Q ${cx - 3} ${baseY - 12} ${cx} ${baseY - 25} Q ${cx + 3} ${baseY - 12} ${cx} ${baseY}" fill="#FF6A1A" opacity="0.85" style="animation-delay:${i*0.15}s"/>
                  <path d="M ${cx} ${baseY} Q ${cx - 1.5} ${baseY - 6} ${cx} ${baseY - 12} Q ${cx + 1.5} ${baseY - 6} ${cx} ${baseY}" fill="#FFD700" opacity="0.9"/>`;
        }).join('')}
      </g>`,

    flood: () => `
      <g class="damage-flood">
        <rect x="0" y="${height * 0.85}" width="${width}" height="${height * 0.15}" fill="#5BC0EB" opacity="0.6"/>
        <ellipse cx="${width * 0.3}" cy="${height * 0.86}" rx="40" ry="3" fill="#3FA8E0" opacity="0.4">
          <animate attributeName="cx" values="${width * 0.3};${width * 0.7};${width * 0.3}" dur="4s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="${width * 0.7}" cy="${height * 0.88}" rx="35" ry="3" fill="#3FA8E0" opacity="0.4">
          <animate attributeName="cx" values="${width * 0.7};${width * 0.3};${width * 0.7}" dur="4.5s" repeatCount="indefinite"/>
        </ellipse>
        <path d="M 0 ${height * 0.84} Q ${width * 0.25} ${height * 0.86} ${width * 0.5} ${height * 0.84} T ${width} ${height * 0.86} L ${width} ${height} L 0 ${height} Z" fill="#5BC0EB" opacity="0.7"/>
      </g>`,

    dark: () => `
      <g class="damage-dark">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#0A0A1A" opacity="0.7"/>
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.18}" fill="#FFD700" opacity="0.15"/>
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.1}" fill="#FFE860" opacity="0.25"/>
        <path class="candle-flame" d="M ${width * 0.5} ${height * 0.45} Q ${width * 0.49} ${height * 0.4} ${width * 0.5} ${height * 0.36} Q ${width * 0.51} ${height * 0.4} ${width * 0.5} ${height * 0.45}" fill="#FFA040"/>
      </g>`,

    freezing: () => `
      <g class="damage-freezing">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#9EC6F0" opacity="0.35"/>
        ${[...Array(20)].map((_,i) => {
          const cx = width * Math.random();
          const cy = height * Math.random();
          return `<circle class="snowflake" cx="${cx}" cy="${cy}" r="${1.5 + Math.random() * 2}" fill="#fff" opacity="${0.6 + Math.random() * 0.3}" style="animation-delay:${i*0.2}s"/>`;
        }).join('')}
        ${[...Array(4)].map((_,i) => {
          const x = width * (0.1 + i * 0.25);
          return `<path d="M ${x} ${height * 0.05} L ${x - 4} ${height * 0.12} L ${x + 4} ${height * 0.12} Z" fill="#B8E3FF" opacity="0.85"/>
                  <path d="M ${x} ${height * 0.05} L ${x} ${height * 0.18}" stroke="#B8E3FF" stroke-width="2" opacity="0.85"/>`;
        }).join('')}
      </g>`,

    party_chaos: () => `
      <g class="damage-party">
        <rect x="0" y="0" width="${width}" height="${height}" fill="#1a0033" opacity="0.55"/>
        ${[...Array(5)].map((_,i) => {
          const cx = width * (0.15 + i * 0.18);
          const cy = height * 0.15;
          const colors = ['#E91E63','#FFD700','#00FF88','#9C27B0','#00B0FF'];
          return `<circle class="party-strobe" cx="${cx}" cy="${cy}" r="${20 + i * 5}" fill="${colors[i]}" opacity="0.5" style="animation-delay:${i*0.2}s"/>`;
        }).join('')}
        ${[...Array(15)].map((_,i) => {
          const x = width * Math.random();
          const y = height * Math.random();
          const colors = ['#E91E63','#FFD700','#00FF88','#9C27B0','#00B0FF','#FF6B5A'];
          return `<text class="music-note-bg" x="${x}" y="${y}" font-size="${14 + Math.random() * 8}" fill="${colors[i % 6]}" opacity="0.85" style="animation-delay:${i*0.15}s">♪</text>`;
        }).join('')}
        <!-- Beer bottles scattered -->
        ${[...Array(6)].map((_,i) => {
          const bx = width * (0.1 + i * 0.13);
          const by = height * 0.92;
          return `<rect x="${bx-3}" y="${by-12}" width="6" height="14" fill="#5C7A2E" opacity="0.85"/>
                  <rect x="${bx-2}" y="${by-16}" width="4" height="5" fill="#5C7A2E"/>`;
        }).join('')}
      </g>`,

    stained_carpet: () => `
      <g class="damage-stains">
        ${[
          {cx: 0.25, cy: 0.88, r: 30, color: '#7B1F1F'},
          {cx: 0.55, cy: 0.92, r: 22, color: '#5C2820'},
          {cx: 0.75, cy: 0.85, r: 18, color: '#A0301A'},
          {cx: 0.4, cy: 0.95, r: 15, color: '#3D1F1F'},
        ].map(s => `
          <ellipse cx="${width*s.cx}" cy="${height*s.cy}" rx="${s.r}" ry="${s.r*0.7}" fill="${s.color}" opacity="0.75"/>
          <ellipse cx="${width*s.cx + 5}" cy="${height*s.cy + 2}" rx="${s.r*0.5}" ry="${s.r*0.4}" fill="${s.color}" opacity="0.6"/>
        `).join('')}
      </g>`,

    blood_sheets: () => `
      <g class="damage-blood">
        <rect x="${width * 0.3}" y="${height * 0.55}" width="${width * 0.4}" height="${height * 0.3}" fill="#fff" stroke="#D8D8D8"/>
        <rect x="${width * 0.3}" y="${height * 0.55}" width="${width * 0.4}" height="${height * 0.06}" fill="#F5E5C8"/>
        ${[
          {cx: 0.45, cy: 0.7, r: 25},
          {cx: 0.55, cy: 0.75, r: 15},
          {cx: 0.6, cy: 0.68, r: 10},
        ].map(s => `
          <ellipse class="stain-grow" cx="${width*s.cx}" cy="${height*s.cy}" rx="${s.r}" ry="${s.r*0.85}" fill="#7B1F1F" opacity="0.9"/>
          <ellipse cx="${width*s.cx-3}" cy="${height*s.cy-2}" rx="${s.r*0.5}" ry="${s.r*0.4}" fill="#5C1010" opacity="0.85"/>
        `).join('')}
      </g>`,

    cracked_window: () => `
      <g class="damage-crack">
        <rect x="${width*0.3}" y="${height*0.15}" width="${width*0.4}" height="${height*0.4}" fill="#B8E3FF" opacity="0.6" stroke="#3D2817" stroke-width="2"/>
        <line x1="${width*0.5}" y1="${height*0.35}" x2="${width*0.32}" y2="${height*0.18}" stroke="#1a1a1a" stroke-width="1.2"/>
        <line x1="${width*0.5}" y1="${height*0.35}" x2="${width*0.68}" y2="${height*0.2}" stroke="#1a1a1a" stroke-width="1.2"/>
        <line x1="${width*0.5}" y1="${height*0.35}" x2="${width*0.45}" y2="${height*0.52}" stroke="#1a1a1a" stroke-width="1.2"/>
        <line x1="${width*0.5}" y1="${height*0.35}" x2="${width*0.65}" y2="${height*0.5}" stroke="#1a1a1a" stroke-width="1.2"/>
        <line x1="${width*0.42}" y1="${height*0.28}" x2="${width*0.34}" y2="${height*0.4}" stroke="#1a1a1a" stroke-width="0.8"/>
        <line x1="${width*0.55}" y1="${height*0.42}" x2="${width*0.62}" y2="${height*0.45}" stroke="#1a1a1a" stroke-width="0.8"/>
      </g>`,

    hidden_camera: () => `
      <g class="damage-camera">
        <circle cx="${width*0.5}" cy="${height*0.2}" r="14" fill="#1a1a1a" stroke="#fff" stroke-width="1"/>
        <circle cx="${width*0.5}" cy="${height*0.2}" r="9" fill="#3a3a3a"/>
        <circle cx="${width*0.5}" cy="${height*0.2}" r="5" fill="#1a1a1a"/>
        <circle class="camera-blink" cx="${width*0.55}" cy="${height*0.18}" r="2.5" fill="#FF1A1A"/>
        <text x="${width*0.5}" y="${height*0.28}" text-anchor="middle" font-size="10" font-weight="800" fill="#FF1A1A">REC</text>
      </g>`,

    broken_glass: () => `
      <g class="damage-shards">
        ${[...Array(8)].map((_,i) => {
          const x1 = width * (0.2 + i * 0.08);
          const y1 = height * 0.85;
          const x2 = x1 + (Math.random() - 0.5) * 30;
          const y2 = y1 - 15 - Math.random() * 25;
          return `<polygon points="${x1},${y1} ${x2},${y2} ${x1 + 8},${y1 + 5}" fill="#B8E3FF" stroke="#3a3a3a" stroke-width="0.5" opacity="0.85"/>`;
        }).join('')}
      </g>`,

    drug_aftermath: () => `
      <g class="damage-drugs">
        <!-- White powder lines on table -->
        <rect x="${width*0.3}" y="${height*0.7}" width="${width*0.35}" height="${height*0.05}" fill="#5C3026" opacity="0.7"/>
        <line x1="${width*0.32}" y1="${height*0.72}" x2="${width*0.45}" y2="${height*0.72}" stroke="#fff" stroke-width="2" opacity="0.95"/>
        <line x1="${width*0.5}" y1="${height*0.72}" x2="${width*0.62}" y2="${height*0.72}" stroke="#fff" stroke-width="2" opacity="0.95"/>
        <!-- Empty bottles -->
        ${[...Array(4)].map((_,i) => {
          const bx = width * (0.1 + i * 0.07);
          return `<rect x="${bx}" y="${height*0.82}" width="6" height="14" fill="#5C7A2E" opacity="0.85"/>
                  <rect x="${bx+1}" y="${height*0.78}" width="4" height="5" fill="#5C7A2E"/>`;
        }).join('')}
        <!-- Trashed sofa -->
        <rect x="${width*0.7}" y="${height*0.78}" width="${width*0.25}" height="${height*0.12}" fill="#7B5848" opacity="0.85" transform="rotate(8 ${width*0.82} ${height*0.85})"/>
        <!-- Pizza box -->
        <rect x="${width*0.15}" y="${height*0.92}" width="40" height="6" fill="#A86E48" stroke="#3D2817" stroke-width="0.6"/>
      </g>`,

    brothel: () => `
      <g class="damage-brothel">
        <!-- Red lights -->
        ${[...Array(4)].map((_,i) => {
          const lx = width * (0.15 + i * 0.25);
          return `<circle class="brothel-light" cx="${lx}" cy="${height * 0.1}" r="14" fill="#E91E63" opacity="0.6" style="animation-delay:${i*0.3}s"/>
                  <circle cx="${lx}" cy="${height * 0.1}" r="6" fill="#FF1A6A"/>`;
        }).join('')}
        <rect x="0" y="0" width="${width}" height="${height}" fill="#7B1F4F" opacity="0.25"/>
        <text x="${width*0.5}" y="${height*0.5}" text-anchor="middle" font-size="48" font-weight="900" fill="#fff" opacity="0.85" style="letter-spacing:0.1em">XXX</text>
      </g>`,

    faeces: () => `
      <g class="damage-feces">
        ${[
          {cx: 0.35, cy: 0.88},
          {cx: 0.55, cy: 0.92},
          {cx: 0.7, cy: 0.85},
        ].map(s => `
          <ellipse cx="${width*s.cx}" cy="${height*s.cy}" rx="14" ry="6" fill="#5C3010"/>
          <ellipse cx="${width*s.cx-2}" cy="${height*s.cy-3}" rx="9" ry="4" fill="#704020"/>
          <ellipse cx="${width*s.cx-3}" cy="${height*s.cy-6}" rx="5" ry="3" fill="#8B5A2B"/>
          <path d="M ${width*s.cx} ${height*s.cy-8} Q ${width*s.cx-2} ${height*s.cy-12} ${width*s.cx+1} ${height*s.cy-15}" fill="none" stroke="#7AAA50" stroke-width="1.5" opacity="0.6"/>
        `).join('')}
      </g>`,

    bedbugs: () => {
      const positions = [[0.3,0.6],[0.4,0.65],[0.5,0.62],[0.6,0.68],[0.45,0.7],[0.55,0.73],[0.35,0.7],[0.5,0.75]];
      return `<g class="damage-bedbugs">
        <rect x="${width*0.25}" y="${height*0.55}" width="${width*0.5}" height="${height*0.3}" fill="#fff" stroke="#D8D8D8"/>
        ${positions.map(([px,py],i) => `
          <ellipse class="bug-crawl" cx="${width*px}" cy="${height*py}" rx="3" ry="2" fill="#5C2820" style="animation-delay:${i*0.2}s"/>
          <ellipse cx="${width*px}" cy="${height*py}" rx="1.5" ry="1" fill="#8B3020"/>
        `).join('')}
      </g>`;
    },

    broken_bed: () => `
      <g class="damage-broken-bed">
        <!-- Collapsed mattress -->
        <polygon points="${width*0.25},${height*0.85} ${width*0.5},${height*0.92} ${width*0.75},${height*0.85} ${width*0.7},${height*0.78} ${width*0.3},${height*0.78}" fill="#F5F5F0" stroke="#8B6F47" stroke-width="1.5"/>
        <!-- Broken frame -->
        <rect x="${width*0.22}" y="${height*0.92}" width="${width*0.18}" height="6" fill="#8B6F47" transform="rotate(-12 ${width*0.3} ${height*0.93})"/>
        <rect x="${width*0.6}" y="${height*0.92}" width="${width*0.18}" height="6" fill="#8B6F47" transform="rotate(15 ${width*0.7} ${height*0.93})"/>
        <!-- Broken leg -->
        <rect x="${width*0.45}" y="${height*0.93}" width="3" height="5" fill="#3D2817" transform="rotate(45 ${width*0.46} ${height*0.95})"/>
        <!-- Splinters -->
        <line x1="${width*0.35}" y1="${height*0.88}" x2="${width*0.32}" y2="${height*0.84}" stroke="#5C3010" stroke-width="2"/>
        <line x1="${width*0.65}" y1="${height*0.88}" x2="${width*0.68}" y2="${height*0.84}" stroke="#5C3010" stroke-width="2"/>
      </g>`,

    wig: () => `
      <g class="damage-wig">
        <!-- Bin -->
        <rect x="${width*0.42}" y="${height*0.65}" width="${width*0.16}" height="${height*0.3}" fill="#3a3a3a" stroke="#1a1a1a" stroke-width="1"/>
        <rect x="${width*0.41}" y="${height*0.62}" width="${width*0.18}" height="6" fill="#1a1a1a"/>
        <!-- Wig flying out -->
        <g class="wig-fly-anim" style="transform-origin: ${width*0.5}px ${height*0.5}px;">
          <ellipse cx="${width*0.5}" cy="${height*0.4}" rx="35" ry="22" fill="#704020"/>
          <path d="M ${width*0.5 - 35} ${height*0.4} Q ${width*0.5 - 40} ${height*0.5} ${width*0.5 - 30} ${height*0.55}" fill="#704020"/>
          <path d="M ${width*0.5 + 35} ${height*0.4} Q ${width*0.5 + 40} ${height*0.5} ${width*0.5 + 30} ${height*0.55}" fill="#704020"/>
          <path d="M ${width*0.5 - 25} ${height*0.45} L ${width*0.5 - 28} ${height*0.6} L ${width*0.5 - 22} ${height*0.6}" fill="#5C3010"/>
          <path d="M ${width*0.5 + 25} ${height*0.45} L ${width*0.5 + 28} ${height*0.6} L ${width*0.5 + 22} ${height*0.6}" fill="#5C3010"/>
        </g>
      </g>`,

    tea_kettle: () => `
      <g class="damage-kettle">
        <rect x="${width*0.4}" y="${height*0.65}" width="${width*0.2}" height="${height*0.25}" rx="8" fill="#9CA0A8" stroke="#3a3a3a" stroke-width="2"/>
        <rect x="${width*0.42}" y="${height*0.6}" width="${width*0.16}" height="8" fill="#5C5C5C"/>
        <rect x="${width*0.48}" y="${height*0.55}" width="${width*0.04}" height="6" fill="#3a3a3a"/>
        <!-- Sludge inside -->
        <ellipse cx="${width*0.5}" cy="${height*0.78}" rx="${width*0.08}" ry="6" fill="#5C3010"/>
        <ellipse cx="${width*0.48}" cy="${height*0.76}" rx="${width*0.05}" ry="3" fill="#8B5A2B" opacity="0.8"/>
        <!-- Tea bag string hanging out -->
        <line x1="${width*0.55}" y1="${height*0.7}" x2="${width*0.62}" y2="${height*0.85}" stroke="#fff" stroke-width="1"/>
        <rect x="${width*0.6}" y="${height*0.83}" width="6" height="6" fill="#A86E48"/>
        <!-- Steam -->
        ${[...Array(3)].map((_,i) => `
          <ellipse class="kettle-steam" cx="${width*(0.46 + i*0.04)}" cy="${height*0.5}" rx="4" ry="6" fill="#fff" opacity="0.7" style="animation-delay:${i*0.4}s"/>
        `).join('')}
      </g>`,

    condoms: () => `
      <g class="damage-condoms">
        ${[
          {cx: 0.3, cy: 0.85, r: 0},
          {cx: 0.45, cy: 0.92, r: 30},
          {cx: 0.6, cy: 0.88, r: -15},
          {cx: 0.7, cy: 0.94, r: 60},
          {cx: 0.25, cy: 0.93, r: -45},
        ].map(s => `
          <g transform="translate(${width*s.cx}, ${height*s.cy}) rotate(${s.r})">
            <ellipse cx="0" cy="0" rx="10" ry="3" fill="#FFE5D9" stroke="#A86E48" stroke-width="0.6" opacity="0.85"/>
            <circle cx="-8" cy="0" r="3" fill="#FFE5D9" opacity="0.7"/>
          </g>
        `).join('')}
        <!-- Chewing gum blobs -->
        <ellipse cx="${width*0.55}" cy="${height*0.78}" rx="6" ry="3" fill="#FFB0C0" opacity="0.8"/>
        <ellipse cx="${width*0.4}" cy="${height*0.82}" rx="5" ry="3" fill="#9ED4F5" opacity="0.7"/>
      </g>`,

    horse_indoors: () => `
      <g class="damage-horse-indoors">
        <!-- Hoof prints on floor -->
        ${[...Array(5)].map((_,i) => {
          const hx = width * (0.15 + i * 0.16);
          return `<ellipse cx="${hx}" cy="${height*0.93}" rx="6" ry="4" fill="#3D2817" opacity="0.6"/>`;
        }).join('')}
        <!-- Manure piles -->
        <ellipse cx="${width*0.3}" cy="${height*0.9}" rx="14" ry="6" fill="#5C3010"/>
        <ellipse cx="${width*0.7}" cy="${height*0.92}" rx="12" ry="5" fill="#704020"/>
        <!-- Hay strewn -->
        ${[...Array(8)].map((_,i) => {
          const x1 = width * Math.random();
          const y1 = height * (0.85 + Math.random() * 0.1);
          return `<line x1="${x1}" y1="${y1}" x2="${x1 + 8}" y2="${y1 - 2}" stroke="#D4A574" stroke-width="1.5"/>`;
        }).join('')}
      </g>`,

    declined_card: () => `
      <g class="damage-card">
        <rect x="${width*0.35}" y="${height*0.35}" width="${width*0.3}" height="${height*0.25}" rx="8" fill="#1C2280"/>
        <rect x="${width*0.35}" y="${height*0.42}" width="${width*0.3}" height="14" fill="#1a1a1a"/>
        <text x="${width*0.5}" y="${height*0.55}" text-anchor="middle" font-size="14" font-weight="900" fill="#FFD700" letter-spacing="0.15em">**** ****</text>
        <g class="declined-stamp" style="transform-origin: ${width*0.5}px ${height*0.7}px">
          <rect x="${width*0.38}" y="${height*0.65}" width="${width*0.24}" height="${height*0.12}" fill="none" stroke="#E63030" stroke-width="3" transform="rotate(-12 ${width*0.5} ${height*0.71})"/>
          <text x="${width*0.5}" y="${height*0.74}" text-anchor="middle" font-size="20" font-weight="900" fill="#E63030" transform="rotate(-12 ${width*0.5} ${height*0.71})">DECLINED</text>
        </g>
      </g>`,

    smashed_vase: () => `
      <g class="damage-vase">
        <!-- Pedestal -->
        <rect x="${width*0.45}" y="${height*0.6}" width="${width*0.1}" height="${height*0.3}" fill="#8B6F47"/>
        <!-- Base of vase still on top -->
        <ellipse cx="${width*0.5}" cy="${height*0.6}" rx="${width*0.06}" ry="6" fill="#9C3F36"/>
        <!-- Shards on floor -->
        ${[...Array(7)].map((_,i) => {
          const sx = width * (0.2 + i * 0.1);
          const sy = height * (0.88 + Math.random() * 0.06);
          const rot = Math.random() * 60 - 30;
          return `<polygon points="${sx},${sy} ${sx + 8},${sy - 12} ${sx + 14},${sy + 2}" fill="#9C3F36" stroke="#5C1010" stroke-width="0.6" transform="rotate(${rot} ${sx + 7} ${sy})"/>
                  <polygon points="${sx + 4},${sy + 2} ${sx + 10},${sy - 5} ${sx + 8},${sy + 6}" fill="#7B1F1F" transform="rotate(${rot} ${sx + 7} ${sy})"/>`;
        }).join('')}
        <!-- Dust cloud -->
        <ellipse cx="${width*0.5}" cy="${height*0.85}" rx="${width*0.25}" ry="6" fill="#D8D4CA" opacity="0.4"/>
      </g>`,

    paparazzi: () => `
      <g class="damage-paparazzi">
        ${[...Array(5)].map((_,i) => {
          const px = width * (0.15 + i * 0.18);
          return `<g>
            <rect x="${px - 8}" y="${height*0.4}" width="16" height="11" rx="1" fill="#1a1a1a"/>
            <circle cx="${px}" cy="${height*0.45}" r="4" fill="#3a3a3a" stroke="#fff" stroke-width="0.6"/>
            <circle cx="${px}" cy="${height*0.45}" r="2" fill="#0a0a0a"/>
            <rect x="${px - 3}" y="${height*0.37}" width="6" height="3" fill="#3a3a3a"/>
            <circle class="flash-burst" cx="${px}" cy="${height*0.3}" r="14" fill="#fff" opacity="0.85" style="animation-delay:${i*0.4}s"/>
          </g>`;
        }).join('')}
      </g>`,

    confused_tech: () => `
      <g class="damage-confused-tech">
        <!-- TV static squiggles top-right -->
        ${[...Array(8)].map((_,i) => {
          const y = height * (0.08 + i * 0.06);
          const x1 = width * 0.72;
          const x2 = width * 0.95;
          const amp = 4 + (i%3)*2;
          const pts = [...Array(10)].map((_,j) => {
            const px = x1 + (x2-x1)*(j/9);
            const py = y + (j%2===0 ? amp : -amp);
            return `${px},${py}`;
          }).join(' ');
          return `<polyline points="${pts}" fill="none" stroke="#aaaaaa" stroke-width="1.2" opacity="${0.25 + i*0.04}"/>`;
        }).join('')}
        <!-- Giant floating question marks -->
        ${[
          {x:width*0.15, y:height*0.25, sz:44, delay:0,   op:0.18},
          {x:width*0.78, y:height*0.18, sz:36, delay:0.4, op:0.14},
          {x:width*0.48, y:height*0.12, sz:52, delay:0.8, op:0.20},
          {x:width*0.62, y:height*0.40, sz:30, delay:1.2, op:0.12},
        ].map(q => `
          <text x="${q.x}" y="${q.y}" font-size="${q.sz}" fill="#3366FF"
                opacity="${q.op}" text-anchor="middle" font-family="sans-serif" font-weight="700"
                class="tech-float" style="animation-delay:${q.delay}s">?</text>`).join('')}
        <!-- Remote control icon, bottom-left -->
        <g transform="translate(${width*0.06}, ${height*0.62})" opacity="0.22">
          <rect x="0" y="0" width="22" height="44" rx="5" fill="none" stroke="#555" stroke-width="2"/>
          <circle cx="11" cy="10" r="4" fill="none" stroke="#555" stroke-width="1.5"/>
          ${[0,1,2,3,4,5].map(i => `<rect x="${3+(i%3)*7}" y="${20+Math.floor(i/3)*9}" width="5" height="5" rx="1" fill="#888"/>`).join('')}
        </g>
        <!-- Wifi symbol with X, bottom-right -->
        <g transform="translate(${width*0.85}, ${height*0.72})" opacity="0.20">
          <path d="M-20,0 Q0,-18 20,0" fill="none" stroke="#3366FF" stroke-width="3" stroke-linecap="round"/>
          <path d="M-12,6 Q0,-6 12,6"  fill="none" stroke="#3366FF" stroke-width="3" stroke-linecap="round"/>
          <circle cx="0" cy="12" r="3" fill="#3366FF"/>
          <line x1="14" y1="-8" x2="26" y2="4"  stroke="#e53935" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="26" y1="-8" x2="14" y2="4"  stroke="#e53935" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>`,

    silverfish: () => `
      <g class="damage-silverfish">
        ${[...Array(4)].map((_,i) => {
          const cx = width * (0.2 + i * 0.2);
          const cy = height * 0.9;
          return `<g class="silverfish-wiggle" style="animation-delay:${i*0.3}s">
            <ellipse cx="${cx}" cy="${cy}" rx="8" ry="2" fill="#B0B5C5"/>
            <line x1="${cx-7}" y1="${cy}" x2="${cx-11}" y2="${cy-2}" stroke="#1a1a1a" stroke-width="0.6"/>
            <line x1="${cx-7}" y1="${cy}" x2="${cx-11}" y2="${cy+2}" stroke="#1a1a1a" stroke-width="0.6"/>
            <line x1="${cx+7}" y1="${cy}" x2="${cx+10}" y2="${cy-1}" stroke="#1a1a1a" stroke-width="0.6"/>
          </g>`;
        }).join('')}
      </g>`,
  };

  const renderer = overlays[damageType];
  if (!renderer) return '';
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="damage-overlay" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">${renderer()}</svg>`;
}
