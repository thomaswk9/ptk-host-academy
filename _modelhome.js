// ─── MODEL HOME SYSTEM v2 ────────────────────────────────────────────────────
// Each property has a unique cross-section model that grows as upgrades are bought.
// Bigger rooms, clearer items, real visual interest.

// Window style by property — Georgian (large sash 6-pane), Victorian (bay arched),
// Edwardian (tudor mullioned), Modern (full-height plate glass)
const PROP_STYLES = {
  1: 'victorian',    // Notting Hill
  2: 'modern',       // Shoreditch
  3: 'georgian',     // Chelsea
  4: 'georgian',     // Mayfair
  5: 'edwardian',    // Kensington
  6: 'modern',       // Covent Garden penthouse
};

function renderStyledWindow(winX, winY, winW, winH, wallColor, propId, style) {
  let svg = '';
  // Architecturally accurate frames — darker tones for proper contrast
  const frame = '#2A2520';
  const frameMid = '#4A3F32';
  const glassGrad = `<linearGradient id="glass-${propId}-${Math.round(winX)}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9DC8E8"/>
      <stop offset="0.5" stop-color="#C5DCEA"/>
      <stop offset="1" stop-color="#E5F0F7"/>
    </linearGradient>`;
  const gid = `glass-${propId}-${Math.round(winX)}`;

  if (style === 'georgian') {
    // Georgian 6-over-6 sash window with deep frame, lintel, pediment, sill
    const fw = 6;
    svg += `<defs>${glassGrad}</defs>`;
    // Lintel band above
    svg += `<rect x="${winX - fw - 4}" y="${winY - 16}" width="${winW + 2*fw + 8}" height="6" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw - 8}" y="${winY - 10}" width="${winW + 2*fw + 16}" height="3" fill="${frame}"/>`;
    // Deep architrave (timber surround)
    svg += `<rect x="${winX - fw}" y="${winY - 4}" width="${winW + 2*fw}" height="${winH + 8}" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw + 1}" y="${winY - 3}" width="${winW + 2*fw - 2}" height="${winH + 6}" fill="${frameMid}"/>`;
    // Glazed area
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#${gid})"/>`;
    // 6-over-6 sash: thick central horizontal divider + 2 vertical mullions per sash
    const mullW = 2.5;
    svg += `<rect x="${winX}" y="${winY + winH/2 - 2}" width="${winW}" height="4" fill="${frame}"/>`;
    for (let v = 1; v < 3; v++) {
      svg += `<rect x="${winX + v * winW/3 - mullW/2}" y="${winY}" width="${mullW}" height="${winH}" fill="${frame}"/>`;
    }
    svg += `<rect x="${winX}" y="${winY + winH/4 - 1}" width="${winW}" height="2" fill="${frame}"/>`;
    svg += `<rect x="${winX}" y="${winY + 3*winH/4 - 1}" width="${winW}" height="2" fill="${frame}"/>`;
    // Glass reflection highlights
    svg += `<polygon points="${winX + 4},${winY + 4} ${winX + winW/3 - 4},${winY + 4} ${winX + 4},${winY + winH/4 - 4}" fill="#fff" opacity="0.32"/>`;
    svg += `<polygon points="${winX + winW * 0.6},${winY + winH/2 + 8} ${winX + winW - 6},${winY + winH/2 + 8} ${winX + winW - 6},${winY + winH * 0.85}" fill="#fff" opacity="0.18"/>`;
    // Deep projecting sill
    svg += `<rect x="${winX - fw - 6}" y="${winY + winH + 4}" width="${winW + 2*fw + 12}" height="5" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw - 4}" y="${winY + winH + 9}" width="${winW + 2*fw + 8}" height="3" fill="${frameMid}"/>`;
  }
  else if (style === 'victorian') {
    // Victorian bay window — 3 separate panels: narrow side, wide center, narrow side
    svg += `<defs>${glassGrad}</defs>`;
    const sw = winW * 0.22;
    const cw = winW * 0.56;
    const lcX = winX;
    const cx = winX + sw;
    const rcX = winX + sw + cw;

    // Bay roof — projecting trim
    svg += `<path d="M ${winX - 8} ${winY - 4}
                    L ${winX + 4} ${winY - 18}
                    L ${winX + winW - 4} ${winY - 18}
                    L ${winX + winW + 8} ${winY - 4} Z"
            fill="${frame}"/>`;
    svg += `<path d="M ${winX - 2} ${winY - 4}
                    L ${winX + 8} ${winY - 14}
                    L ${winX + winW - 8} ${winY - 14}
                    L ${winX + winW + 2} ${winY - 4} Z"
            fill="${frameMid}"/>`;
    // Decorative finial above center
    svg += `<rect x="${winX + winW/2 - 1.5}" y="${winY - 24}" width="3" height="8" fill="${frame}"/>`;
    svg += `<circle cx="${winX + winW/2}" cy="${winY - 26}" r="3" fill="${frame}"/>`;

    // Three panels with frames
    [
      { x: lcX, w: sw },
      { x: cx, w: cw },
      { x: rcX, w: sw }
    ].forEach((p, i) => {
      const fwp = 3.5;
      // Panel frame
      svg += `<rect x="${p.x - fwp}" y="${winY - 4}" width="${p.w + 2*fwp}" height="${winH + 8}" fill="${frame}"/>`;
      svg += `<rect x="${p.x - fwp + 1}" y="${winY - 3}" width="${p.w + 2*fwp - 2}" height="${winH + 6}" fill="${frameMid}"/>`;
      // Glass
      svg += `<rect x="${p.x}" y="${winY}" width="${p.w}" height="${winH}" fill="url(#${gid})"/>`;
      // Sash divider (lower 40%)
      svg += `<rect x="${p.x}" y="${winY + winH * 0.6 - 1.5}" width="${p.w}" height="3" fill="${frame}"/>`;
      // Vertical mullion in center panel only (because narrow panels are narrow)
      if (p.w >= 60) {
        svg += `<rect x="${p.x + p.w/2 - 1}" y="${winY}" width="2" height="${winH * 0.6}" fill="${frame}"/>`;
        svg += `<rect x="${p.x + p.w/2 - 1}" y="${winY + winH * 0.6}" width="2" height="${winH * 0.4}" fill="${frame}"/>`;
      }
      // Glass reflection
      svg += `<polygon points="${p.x + 3},${winY + 3} ${p.x + p.w * 0.4},${winY + 3} ${p.x + 3},${winY + winH * 0.4}" fill="#fff" opacity="0.28"/>`;
    });

    // Deep ornate sill — projecting forward as a real bay does
    svg += `<rect x="${winX - 12}" y="${winY + winH + 4}" width="${winW + 24}" height="6" fill="${frame}"/>`;
    svg += `<rect x="${winX - 16}" y="${winY + winH + 10}" width="${winW + 32}" height="4" fill="${frameMid}"/>`;
    svg += `<rect x="${winX - 8}" y="${winY + winH + 14}" width="${winW + 16}" height="2" fill="${frame}"/>`;
  }
  else if (style === 'edwardian') {
    // Edwardian: leaded mullions in a 4×6 grid with timber bands above
    svg += `<defs>${glassGrad}</defs>`;
    const fw = 5;
    // Decorative crown trim
    svg += `<rect x="${winX - fw - 2}" y="${winY - 14}" width="${winW + 2*fw + 4}" height="4" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw - 6}" y="${winY - 10}" width="${winW + 2*fw + 12}" height="3" fill="${frameMid}"/>`;
    // Tudor revival timber accents
    svg += `<rect x="${winX + winW * 0.1}" y="${winY - 22}" width="3" height="18" fill="#3D2817"/>`;
    svg += `<rect x="${winX + winW * 0.45}" y="${winY - 26}" width="3" height="22" fill="#3D2817"/>`;
    svg += `<rect x="${winX + winW * 0.85}" y="${winY - 22}" width="3" height="18" fill="#3D2817"/>`;
    // Frame
    svg += `<rect x="${winX - fw}" y="${winY - 4}" width="${winW + 2*fw}" height="${winH + 8}" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw + 1}" y="${winY - 3}" width="${winW + 2*fw - 2}" height="${winH + 6}" fill="${frameMid}"/>`;
    // Glazing
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#${gid})"/>`;
    // 4 column × 6 row leaded grid
    const mullW = 1.8;
    for (let v = 1; v < 4; v++) svg += `<rect x="${winX + v * winW/4 - mullW/2}" y="${winY}" width="${mullW}" height="${winH}" fill="${frame}"/>`;
    for (let h = 1; h < 6; h++) svg += `<rect x="${winX}" y="${winY + h * winH/6 - mullW/2}" width="${winW}" height="${mullW}" fill="${frame}"/>`;
    // Reflection
    svg += `<polygon points="${winX + 3},${winY + 3} ${winX + winW * 0.35},${winY + 3} ${winX + 3},${winY + winH * 0.32}" fill="#fff" opacity="0.24"/>`;
    // Sill
    svg += `<rect x="${winX - fw - 4}" y="${winY + winH + 4}" width="${winW + 2*fw + 8}" height="5" fill="${frame}"/>`;
    svg += `<rect x="${winX - fw - 2}" y="${winY + winH + 9}" width="${winW + 2*fw + 4}" height="3" fill="${frameMid}"/>`;
  }
  else { // modern
    // Industrial steel-frame plate glass
    svg += `<defs>${glassGrad}</defs>`;
    const fw = 4;
    svg += `<rect x="${winX - fw}" y="${winY - fw}" width="${winW + 2*fw}" height="${winH + 2*fw}" fill="#1A1A1A"/>`;
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#${gid})"/>`;
    const mullW = 2.5;
    for (let v = 1; v < 3; v++) {
      svg += `<rect x="${winX + v * winW/3 - mullW/2}" y="${winY}" width="${mullW}" height="${winH}" fill="#1A1A1A"/>`;
    }
    svg += `<rect x="${winX}" y="${winY + winH * 0.6 - 1.25}" width="${winW}" height="${mullW}" fill="#1A1A1A"/>`;
    // Bold reflection bands
    svg += `<polygon points="${winX + 6},${winY + 6} ${winX + winW * 0.32},${winY + 6} ${winX + 6},${winY + winH * 0.32}" fill="#fff" opacity="0.32"/>`;
    svg += `<rect x="${winX + winW * 0.65}" y="${winY + winH * 0.32}" width="${winW * 0.18}" height="2" fill="#fff" opacity="0.45"/>`;
    svg += `<rect x="${winX - fw - 2}" y="${winY + winH + fw}" width="${winW + 2*fw + 4}" height="4" fill="#1A1A1A"/>`;
  }
  return svg;
}

// Render the property's model home with currently-owned upgrades dropped in
function renderModelHome(propId, ownedUpgrades, width = 600){
  const property = PROPS.find(p => p.id === propId);
  const owned = ownedUpgrades[propId] || [];
  const wallColor = property.col;
  const floorColor = property.light;

  // Layout
  const numRooms = propId; // 1..5
  const aspect = 0.6;
  const height = Math.round(width * aspect);

  // Each room is bigger now. Use horizontal bands.
  const padding = 16;
  const totalRoomWidth = width - padding * 2;
  const roomGap = 6;
  const roomW = (totalRoomWidth - roomGap * (numRooms - 1)) / numRooms;
  const roomH = height - 80;
  const baseY = height - 30;

  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="model-home" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="sky-${propId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFE9C2"/>
        <stop offset="1" stop-color="#FFFAF0"/>
      </linearGradient>
      <radialGradient id="warmlight-${propId}" cx="0.5" cy="0.3" r="0.7">
        <stop offset="0" stop-color="#FFD89C" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#FFD89C" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#sky-${propId})"/>
    <rect width="${width}" height="${height}" fill="url(#warmlight-${propId})"/>`;

  // Atmospheric backdrops by tier
  if (propId === 1) {
    svg += `<circle cx="${width - 60}" cy="40" r="20" fill="#F5A623" opacity="0.5"/>
            <circle cx="${width - 60}" cy="40" r="14" fill="#F5A623" opacity="0.7"/>`;
  } else if (propId === 4) {
    svg += `<circle cx="${width - 80}" cy="50" r="14" fill="#F5A623" opacity="0.4"/>
            <circle cx="${width - 80}" cy="50" r="9" fill="#F5A623"/>`;
    for (let i = 0; i < 8; i++) {
      const sx = i * (width / 8);
      const sh = 30 + (i * 13) % 40;
      svg += `<rect x="${sx}" y="${baseY - roomH - 30 - sh}" width="${width/8 - 4}" height="${sh}" fill="${wallColor}" opacity="0.15"/>`;
    }
  } else if (propId === 5) {
    svg += `<ellipse cx="100" cy="40" rx="36" ry="10" fill="#fff" opacity="0.7"/>
            <ellipse cx="${width - 120}" cy="55" rx="30" ry="8" fill="#fff" opacity="0.6"/>
            <circle cx="${width - 70}" cy="35" r="12" fill="#F5A623" opacity="0.6"/>`;
  } else if (propId === 2) {
    // Shoreditch - urban backdrop
    for (let i = 0; i < 5; i++) {
      const sx = 40 + i * (width / 5.5);
      const sh = 25 + (i * 7) % 30;
      svg += `<rect x="${sx}" y="${baseY - roomH - 20 - sh}" width="${width/6}" height="${sh}" fill="${wallColor}" opacity="0.18"/>`;
    }
  } else if (propId === 3) {
    // Chelsea - trees in background
    svg += `<circle cx="60" cy="${baseY - roomH - 5}" r="22" fill="#6AAF2E" opacity="0.4"/>
            <circle cx="${width - 60}" cy="${baseY - roomH - 8}" r="18" fill="#6AAF2E" opacity="0.4"/>`;
  } else if (propId === 6) {
    // Covent Garden - opera house pediment + theatre lights
    svg += `<rect x="0" y="0" width="${width}" height="${baseY - roomH}" fill="#2A0A0A"/>
            <ellipse cx="${width/2}" cy="${baseY - roomH - 20}" rx="${width * 0.6}" ry="40" fill="#8B0000" opacity="0.3"/>
            <polygon points="${width/2 - 80},${baseY - roomH - 5} ${width/2 - 90},${baseY - roomH - 35} ${width/2 + 90},${baseY - roomH - 35} ${width/2 + 80},${baseY - roomH - 5}" fill="#F8E5E5" opacity="0.4"/>`;
    // Theatre marquee lights
    for (let i = 0; i < 12; i++) {
      svg += `<circle cx="${40 + i * (width - 80) / 11}" cy="${baseY - roomH - 8}" r="3" fill="#FFD700" opacity="0.8"/>`;
    }
    // Twinkling stars
    svg += `<circle cx="${width * 0.15}" cy="30" r="1.5" fill="#fff"/>
            <circle cx="${width * 0.7}" cy="22" r="2" fill="#fff"/>
            <circle cx="${width * 0.85}" cy="45" r="1.2" fill="#fff"/>`;
  }

  // Ground / pavement
  svg += `<line x1="0" y1="${baseY + 8}" x2="${width}" y2="${baseY + 8}" stroke="${wallColor}" stroke-width="1.5" opacity="0.3"/>
          <rect x="0" y="${baseY + 8}" width="${width}" height="${height - baseY - 8}" fill="${wallColor}" opacity="0.05"/>`;

  // Draw each room
  for (let i = 0; i < numRooms; i++) {
    const rx = padding + i * (roomW + roomGap);
    const ry = baseY - roomH;

    // === ROOM SHELL ===
    // Wall (back wall fill) — slightly darker at floor level for depth
    const wallTop = `<linearGradient id="wall-${propId}-${i}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${floorColor}" stop-opacity="0.95"/>
        <stop offset="0.7" stop-color="${floorColor}" stop-opacity="0.78"/>
        <stop offset="1" stop-color="${wallColor}" stop-opacity="0.18"/>
      </linearGradient>`;
    svg += `<defs>${wallTop}</defs>`;
    svg += `<rect x="${rx}" y="${ry}" width="${roomW}" height="${roomH}" fill="url(#wall-${propId}-${i})"/>`;

    // Crown molding at top of wall
    svg += `<rect x="${rx}" y="${ry}" width="${roomW}" height="6" fill="${wallColor}" opacity="0.45"/>`;
    svg += `<rect x="${rx}" y="${ry + 6}" width="${roomW}" height="2" fill="${wallColor}" opacity="0.25"/>`;

    // Wood plank floor — varies by tier
    const floorEnd = baseY;
    const floorStart = baseY - 28;
    const plankTone = propId <= 2 ? '#8B6F47' : propId <= 4 ? '#A8845D' : '#C0986A';
    const plankDark = propId <= 2 ? '#5C3F22' : propId <= 4 ? '#704528' : '#8B5A2B';
    svg += `<rect x="${rx}" y="${floorStart}" width="${roomW}" height="${floorEnd - floorStart}" fill="${plankTone}"/>`;
    // Plank lines (perspective-ish horizontal lines)
    for (let p = 0; p < 4; p++) {
      const py = floorStart + (p + 0.5) * (floorEnd - floorStart) / 4;
      svg += `<line x1="${rx}" y1="${py}" x2="${rx + roomW}" y2="${py}" stroke="${plankDark}" stroke-width="0.6" opacity="0.5"/>`;
    }
    // Vertical plank seams (irregular)
    const seamPositions = [0.18, 0.42, 0.71, 0.88];
    seamPositions.forEach(s => {
      svg += `<line x1="${rx + roomW * s}" y1="${floorStart + 4}" x2="${rx + roomW * s}" y2="${floorEnd - 4}" stroke="${plankDark}" stroke-width="0.5" opacity="0.4"/>`;
    });
    // Skirting board
    svg += `<rect x="${rx}" y="${floorStart - 8}" width="${roomW}" height="8" fill="${wallColor}" opacity="0.55"/>`;
    svg += `<rect x="${rx}" y="${floorStart - 1}" width="${roomW}" height="1" fill="${wallColor}" opacity="0.85"/>`;

    // Outline frame
    svg += `<rect x="${rx}" y="${ry}" width="${roomW}" height="${roomH}" fill="none" stroke="${wallColor}" stroke-width="1" opacity="0.4"/>`;

    // === WINDOW — properly sized, positioned in the UPPER portion of the wall ===
    // Real windows: 1.0–2.2m from floor, room is ~3m tall, so vertical 30%–73% from floor
    // (= 27%–70% from top of room).
    const winW = Math.min(roomW * 0.42, 220);
    const winH = Math.min(roomH * 0.4, 200);
    const winX = rx + (roomW - winW) / 2;
    const winY = ry + roomH * 0.16;
    const propStyle = (typeof PROP_STYLES !== 'undefined' && PROP_STYLES[propId]) || 'modern';
    svg += renderStyledWindow(winX, winY, winW, winH, wallColor, propId, propStyle);

    // === CEILING PENDANT LIGHT ===
    // Hangs from ceiling between window and side wall
    const lampX = rx + roomW * 0.82;
    const lampCordTop = ry + 8;
    const lampCordBottom = ry + roomH * 0.14;
    svg += `<line x1="${lampX}" y1="${lampCordTop}" x2="${lampX}" y2="${lampCordBottom}" stroke="#3D2817" stroke-width="1"/>`;
    svg += `<path d="M ${lampX - 8} ${lampCordBottom} 
                    Q ${lampX} ${lampCordBottom + 14} ${lampX + 8} ${lampCordBottom}
                    L ${lampX + 5} ${lampCordBottom + 2} 
                    L ${lampX - 5} ${lampCordBottom + 2} Z"
            fill="#3D2817"/>`;
    svg += `<ellipse cx="${lampX}" cy="${lampCordBottom + 14}" rx="14" ry="6" fill="#FFD89C" opacity="0.45"/>`;

    // Items in this room
    const itemsForRoom = getUpgradesForRoom(propId, owned, i, numRooms);
    const roomBox = { x: rx, y: ry, w: roomW, h: roomH, baseY, propId, floorY: floorStart };
    itemsForRoom.forEach((upg, idx) => {
      svg += renderItemInRoom(upg, roomBox, idx, itemsForRoom.length);
    });

    // STARTER FURNITURE — every room gets baseline furniture so it looks lived-in
    // even when no upgrades have been bought.
    if (itemsForRoom.length === 0) {
      svg += renderStarterFurniture(roomBox, getRoomKind(i, numRooms), propId);
    }
  }

  return svg + '</svg>';
}

// Determine room "kind" by index (matches getUpgradesForRoom's preferences)
function getRoomKind(roomIndex, totalRooms){
  if (totalRooms === 1) return 'studio';
  if (roomIndex === 0) return 'living';
  if (roomIndex === 1) return 'bedroom';
  if (roomIndex === 2) return 'kitchen';
  if (roomIndex === 3) return totalRooms <= 4 ? 'outdoor' : 'bathroom';
  if (roomIndex === totalRooms - 1) return 'outdoor';
  return 'bedroom';
}

// Render baseline furniture for an empty room — varies by room kind & property tier
// All furniture is at proper scale: ~1m = ~167px on this canvas
function renderStarterFurniture(room, kind, propId){
  const { x, y, w, h, baseY, floorY } = room;
  const fl = floorY || (baseY - 28);          // furniture floor line
  const tier = propId;
  // Tone palette by tier — substantial, not pastel
  const wood       = tier <= 2 ? '#7B5234' : tier <= 4 ? '#9C6E3F' : '#A88454';
  const woodDark   = tier <= 2 ? '#3D2817' : tier <= 4 ? '#5C3F22' : '#704528';
  const woodLight  = tier <= 2 ? '#A88454' : tier <= 4 ? '#C09668' : '#D4B080';
  const fabric     = tier <= 2 ? '#5B7BA3' : tier <= 4 ? '#3D5A82' : '#2A4264';
  const fabricLight= tier <= 2 ? '#7A98BD' : tier <= 4 ? '#5B7BA3' : '#4A6791';
  const accent     = tier <= 2 ? '#C45A4F' : tier <= 4 ? '#D4A057' : '#A88454';
  const wallSh     = tier <= 2 ? '#5C3F22' : '#704528';   // wall shadow color for art frames
  const linenW     = '#F5F0E8';                          // bedding white
  const cushAccent = tier <= 2 ? '#D9B380' : tier <= 4 ? '#C49A6C' : '#7B1F1F';
  let s = '';

  // ---------- HELPERS ----------
  // Floor shadow under any object — rounded ellipse for grounded feel
  const dropShadow = (cx, cy, rx, ry=4, op=0.18) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a1a1a" opacity="${op}"/>`;
  // Picture frame on the wall (multi-frame style)
  const frame = (fx, fy, fw, fh, art='abstract') => {
    let f = '';
    f += `<rect x="${fx-2}" y="${fy-2}" width="${fw+4}" height="${fh+4}" fill="${woodDark}"/>`;
    f += `<rect x="${fx-1}" y="${fy-1}" width="${fw+2}" height="${fh+2}" fill="${linenW}"/>`;
    if (art === 'abstract') {
      f += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="${fabricLight}"/>`;
      f += `<circle cx="${fx + fw*0.35}" cy="${fy + fh*0.4}" r="${fw*0.18}" fill="${accent}" opacity="0.85"/>`;
      f += `<rect x="${fx + fw*0.55}" y="${fy + fh*0.3}" width="${fw*0.3}" height="${fh*0.4}" fill="${cushAccent}" opacity="0.7"/>`;
    } else if (art === 'landscape') {
      f += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh*0.55}" fill="#A8C9E3"/>`;
      f += `<rect x="${fx}" y="${fy + fh*0.55}" width="${fw}" height="${fh*0.45}" fill="#5C7A2E"/>`;
      f += `<polygon points="${fx + fw*0.2},${fy + fh*0.55} ${fx + fw*0.35},${fy + fh*0.3} ${fx + fw*0.5},${fy + fh*0.55}" fill="#6B7280"/>`;
    } else if (art === 'portrait') {
      f += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="#5C3F22"/>`;
      f += `<circle cx="${fx + fw*0.5}" cy="${fy + fh*0.35}" r="${fw*0.18}" fill="#E8C29B"/>`;
      f += `<path d="M ${fx + fw*0.32} ${fy + fh*0.55} L ${fx + fw*0.32} ${fy + fh} L ${fx + fw*0.68} ${fy + fh} L ${fx + fw*0.68} ${fy + fh*0.55} Z" fill="${fabric}"/>`;
    }
    return f;
  };
  // Plant on floor
  const floorPlant = (cx, baseLine, scale=1) => {
    let p = '';
    const potW = 18*scale, potH = 16*scale;
    // Pot
    p += `<path d="M ${cx-potW/2} ${baseLine-potH} L ${cx-potW/2+2} ${baseLine} L ${cx+potW/2-2} ${baseLine} L ${cx+potW/2} ${baseLine-potH} Z" fill="${woodDark}"/>`;
    p += `<rect x="${cx-potW/2}" y="${baseLine-potH-1}" width="${potW}" height="2" fill="${woodDark}"/>`;
    // Foliage — multiple leaves for depth
    p += `<ellipse cx="${cx-7*scale}" cy="${baseLine-potH-12*scale}" rx="${10*scale}" ry="${18*scale}" fill="#3F5A1A" transform="rotate(-25 ${cx-7*scale} ${baseLine-potH-12*scale})"/>`;
    p += `<ellipse cx="${cx+6*scale}" cy="${baseLine-potH-15*scale}" rx="${9*scale}" ry="${20*scale}" fill="#4F7A2A" transform="rotate(20 ${cx+6*scale} ${baseLine-potH-15*scale})"/>`;
    p += `<ellipse cx="${cx}" cy="${baseLine-potH-22*scale}" rx="${8*scale}" ry="${17*scale}" fill="#5C8B30"/>`;
    p += `<ellipse cx="${cx-3*scale}" cy="${baseLine-potH-26*scale}" rx="${5*scale}" ry="${10*scale}" fill="#6FA138"/>`;
    return p;
  };
  // Tabletop plant
  const tablePlant = (cx, baseLine, scale=0.6) => {
    let p = '';
    p += `<rect x="${cx-5*scale}" y="${baseLine-9*scale}" width="${10*scale}" height="${10*scale}" fill="${accent}"/>`;
    p += `<ellipse cx="${cx-3*scale}" cy="${baseLine-15*scale}" rx="${5*scale}" ry="${8*scale}" fill="#4F7A2A"/>`;
    p += `<ellipse cx="${cx+3*scale}" cy="${baseLine-15*scale}" rx="${5*scale}" ry="${8*scale}" fill="#5C8B30"/>`;
    p += `<ellipse cx="${cx}" cy="${baseLine-19*scale}" rx="${4*scale}" ry="${7*scale}" fill="#6FA138"/>`;
    return p;
  };
  // Books stacked
  const books = (cx, baseLine, n=3) => {
    let b = '';
    const colors = ['#7B1F1F','#3D5A82','#2E4A2E','#5C3F22','#A88454'];
    for (let i = 0; i < n; i++) {
      const bw = 18 - i;
      const bh = 4;
      b += `<rect x="${cx-bw/2}" y="${baseLine - (i+1)*bh}" width="${bw}" height="${bh}" fill="${colors[i % colors.length]}" stroke="${woodDark}" stroke-width="0.4"/>`;
    }
    return b;
  };

  // ============ ROOM TYPES ============
  if (kind === 'studio' || kind === 'living') {
    // Layout: Sofa center-left, coffee table in front of sofa, side table+lamp on right,
    // plant in left corner, art on wall, rug under seating, optional bed for studio
    const sofaH  = Math.min(70, h * 0.16);
    const sofaW  = Math.min(w * 0.55, 220);
    const sofaX  = x + (w - sofaW) / 2;
    const sofaY  = fl - sofaH;

    // Rug — large rectangle under seating
    const rugW = sofaW * 1.45;
    const rugH = 12;
    s += `<rect x="${sofaX - sofaW * 0.22}" y="${fl - 4}" width="${rugW}" height="${rugH}" fill="${cushAccent}" opacity="0.7"/>`;
    // Rug pattern
    s += `<rect x="${sofaX - sofaW * 0.22 + 6}" y="${fl - 2}" width="${rugW - 12}" height="${rugH - 4}" fill="none" stroke="${woodDark}" stroke-width="0.6" opacity="0.5"/>`;
    s += `<line x1="${sofaX - sofaW * 0.22 + rugW/2}" y1="${fl - 2}" x2="${sofaX - sofaW * 0.22 + rugW/2}" y2="${fl + rugH - 6}" stroke="${woodDark}" stroke-width="0.4" opacity="0.4"/>`;

    // SOFA — layered: legs, frame, seat cushions, back cushions, armrests, throw pillow
    // Wooden legs
    s += `<rect x="${sofaX + 4}" y="${fl - 8}" width="4" height="8" fill="${woodDark}"/>`;
    s += `<rect x="${sofaX + sofaW - 8}" y="${fl - 8}" width="4" height="8" fill="${woodDark}"/>`;
    // Drop shadow under sofa
    s += dropShadow(sofaX + sofaW/2, fl, sofaW * 0.5, 3, 0.2);
    // Sofa base/frame
    s += `<rect x="${sofaX}" y="${sofaY + sofaH * 0.45}" width="${sofaW}" height="${sofaH * 0.55}" rx="6" fill="${fabric}"/>`;
    // Backrest (taller, behind cushions)
    s += `<rect x="${sofaX + 6}" y="${sofaY}" width="${sofaW - 12}" height="${sofaH * 0.55}" rx="8" fill="${fabricLight}"/>`;
    // Three back cushions with seam lines
    const cushW = (sofaW - 24) / 3;
    for (let c = 0; c < 3; c++) {
      const cxx = sofaX + 12 + c * cushW;
      s += `<rect x="${cxx}" y="${sofaY + 4}" width="${cushW - 4}" height="${sofaH * 0.55 - 4}" rx="4" fill="${fabricLight}" stroke="${fabric}" stroke-width="0.6"/>`;
    }
    // Two seat cushions (front)
    const seatW = (sofaW - 16) / 2;
    for (let c = 0; c < 2; c++) {
      const cxx = sofaX + 8 + c * seatW;
      s += `<rect x="${cxx}" y="${sofaY + sofaH * 0.5}" width="${seatW - 4}" height="${sofaH * 0.4}" rx="5" fill="${fabricLight}" stroke="${fabric}" stroke-width="0.7"/>`;
    }
    // Armrests
    s += `<rect x="${sofaX - 4}" y="${sofaY + sofaH * 0.3}" width="14" height="${sofaH * 0.7}" rx="5" fill="${fabric}"/>`;
    s += `<rect x="${sofaX - 4}" y="${sofaY + sofaH * 0.3}" width="14" height="6" rx="3" fill="${fabricLight}" opacity="0.8"/>`;
    s += `<rect x="${sofaX + sofaW - 10}" y="${sofaY + sofaH * 0.3}" width="14" height="${sofaH * 0.7}" rx="5" fill="${fabric}"/>`;
    s += `<rect x="${sofaX + sofaW - 10}" y="${sofaY + sofaH * 0.3}" width="14" height="6" rx="3" fill="${fabricLight}" opacity="0.8"/>`;
    // Throw pillow
    s += `<rect x="${sofaX + sofaW * 0.6}" y="${sofaY + sofaH * 0.4}" width="20" height="14" rx="3" fill="${cushAccent}" transform="rotate(8 ${sofaX + sofaW * 0.6 + 10} ${sofaY + sofaH * 0.45})"/>`;

    // COFFEE TABLE in front of sofa
    const tblW = sofaW * 0.55;
    const tblX = sofaX + (sofaW - tblW) / 2;
    const tblTop = fl - 18;
    s += dropShadow(tblX + tblW/2, fl, tblW * 0.5, 2.5, 0.18);
    // Top
    s += `<rect x="${tblX}" y="${tblTop}" width="${tblW}" height="5" fill="${wood}"/>`;
    s += `<rect x="${tblX}" y="${tblTop}" width="${tblW}" height="1.5" fill="${woodLight}"/>`;
    // Legs
    s += `<rect x="${tblX + 3}" y="${tblTop + 5}" width="3" height="13" fill="${woodDark}"/>`;
    s += `<rect x="${tblX + tblW - 6}" y="${tblTop + 5}" width="3" height="13" fill="${woodDark}"/>`;
    // Books and tableplant on coffee table
    s += books(tblX + tblW * 0.25, tblTop, 3);
    s += tablePlant(tblX + tblW * 0.7, tblTop, 0.55);

    // SIDE TABLE + LAMP on right side
    const stX = sofaX + sofaW + 10;
    if (stX + 22 < x + w) {
      const stTop = fl - 36;
      s += dropShadow(stX + 11, fl, 14, 2.5, 0.18);
      s += `<rect x="${stX}" y="${stTop}" width="22" height="3" fill="${wood}"/>`;
      s += `<rect x="${stX + 2}" y="${stTop + 3}" width="3" height="33" fill="${woodDark}"/>`;
      s += `<rect x="${stX + 17}" y="${stTop + 3}" width="3" height="33" fill="${woodDark}"/>`;
      // Lamp on top
      const lmpX = stX + 11;
      s += `<rect x="${lmpX - 0.8}" y="${stTop - 18}" width="1.6" height="18" fill="${woodDark}"/>`;
      s += `<polygon points="${lmpX - 9},${stTop - 18} ${lmpX + 9},${stTop - 18} ${lmpX + 6},${stTop - 32} ${lmpX - 6},${stTop - 32}" fill="${linenW}" stroke="${woodDark}" stroke-width="0.6"/>`;
      s += `<ellipse cx="${lmpX}" cy="${stTop - 17}" rx="9" ry="1.5" fill="#FFD89C" opacity="0.85"/>`;
    }

    // FLOOR PLANT in left corner
    s += floorPlant(x + 18, fl, 1.0);

    // WALL ART — a triptych above the sofa, sized to wall
    const artBaseY = sofaY - 8;
    const artH = Math.min(55, (sofaY - y - 30));
    if (artH > 22) {
      const artW1 = sofaW * 0.18;
      s += frame(sofaX + sofaW * 0.1,             artBaseY - artH, artW1, artH, 'abstract');
      s += frame(sofaX + sofaW * 0.4,             artBaseY - artH, artW1 * 1.4, artH, 'landscape');
      s += frame(sofaX + sofaW * 0.78,            artBaseY - artH, artW1, artH, 'abstract');
    }

    // STUDIO: also include a bed on the LEFT side
    if (kind === 'studio' && w > 320) {
      const bedX = x + 16;
      const bedW = w * 0.22;
      const bedY = fl - 50;
      // Drop shadow
      s += dropShadow(bedX + bedW/2, fl, bedW * 0.55, 3, 0.18);
      // Headboard
      s += `<rect x="${bedX}" y="${bedY - 30}" width="${bedW}" height="34" rx="3" fill="${wood}"/>`;
      s += `<rect x="${bedX + 3}" y="${bedY - 27}" width="${bedW - 6}" height="28" rx="2" fill="${woodLight}" opacity="0.6"/>`;
      // Mattress
      s += `<rect x="${bedX}" y="${bedY}" width="${bedW}" height="20" fill="${linenW}"/>`;
      // Frame base
      s += `<rect x="${bedX - 2}" y="${bedY + 20}" width="${bedW + 4}" height="14" fill="${wood}"/>`;
      // Quilt fold-back
      s += `<rect x="${bedX}" y="${bedY + 14}" width="${bedW}" height="4" fill="${cushAccent}" opacity="0.85"/>`;
      // Pillow
      s += `<rect x="${bedX + 3}" y="${bedY + 2}" width="${bedW * 0.4}" height="8" rx="3" fill="${linenW}" stroke="#D8D4CA" stroke-width="0.5"/>`;
      s += `<rect x="${bedX + bedW * 0.55}" y="${bedY + 2}" width="${bedW * 0.4}" height="8" rx="3" fill="${linenW}" stroke="#D8D4CA" stroke-width="0.5"/>`;
    }
  }

  else if (kind === 'bedroom') {
    // Big king bed centered, bedside tables, wardrobe on side, art above bed, rug under
    const bedW = Math.min(w * 0.5, 240);
    const bedX = x + (w - bedW) / 2;
    const bedH = Math.min(120, h * 0.28);
    const bedY = fl - bedH;

    // Rug
    s += `<rect x="${bedX - bedW * 0.18}" y="${fl - 6}" width="${bedW * 1.36}" height="14" fill="${cushAccent}" opacity="0.7"/>`;
    s += `<rect x="${bedX - bedW * 0.18 + 6}" y="${fl - 4}" width="${bedW * 1.36 - 12}" height="10" fill="none" stroke="${woodDark}" stroke-width="0.6" opacity="0.45"/>`;

    s += dropShadow(bedX + bedW/2, fl, bedW * 0.55, 3, 0.2);
    // Headboard — tall, paneled
    const hbH = bedH * 0.65;
    s += `<rect x="${bedX - 4}" y="${bedY - hbH + 30}" width="${bedW + 8}" height="${hbH}" rx="4" fill="${wood}"/>`;
    // Headboard panels
    for (let p = 0; p < 3; p++) {
      const pX = bedX + 4 + p * (bedW - 8) / 3;
      const pW = (bedW - 8) / 3 - 4;
      s += `<rect x="${pX}" y="${bedY - hbH + 36}" width="${pW}" height="${hbH - 12}" fill="none" stroke="${woodDark}" stroke-width="0.6" opacity="0.6"/>`;
    }
    // Bed frame base (wooden)
    s += `<rect x="${bedX - 6}" y="${bedY + bedH - 30}" width="${bedW + 12}" height="30" fill="${wood}"/>`;
    s += `<rect x="${bedX - 6}" y="${bedY + bedH - 6}" width="${bedW + 12}" height="6" fill="${woodDark}"/>`;
    // Mattress
    s += `<rect x="${bedX}" y="${bedY + 20}" width="${bedW}" height="${bedH - 50}" fill="${linenW}"/>`;
    // Mattress quilting lines
    for (let q = 1; q < 4; q++) {
      const qX = bedX + q * bedW / 4;
      s += `<line x1="${qX}" y1="${bedY + 22}" x2="${qX}" y2="${bedY + bedH - 32}" stroke="#D8D4CA" stroke-width="0.5"/>`;
    }
    // Duvet — substantial covering
    const duvetTop = bedY + bedH * 0.55;
    s += `<rect x="${bedX - 2}" y="${duvetTop}" width="${bedW + 4}" height="${bedH - 30}" fill="${fabric}"/>`;
    // Duvet fold-back
    s += `<rect x="${bedX - 2}" y="${duvetTop}" width="${bedW + 4}" height="6" fill="${linenW}"/>`;
    // Decorative throw on bed
    s += `<rect x="${bedX + bedW * 0.1}" y="${duvetTop + 10}" width="${bedW * 0.8}" height="10" fill="${cushAccent}" opacity="0.85"/>`;
    // Pillows (2 pairs — euro shams behind, regular pillows in front)
    s += `<rect x="${bedX + 6}" y="${bedY + 26}" width="${bedW * 0.42}" height="22" rx="5" fill="${fabricLight}" stroke="${fabric}" stroke-width="0.5"/>`;
    s += `<rect x="${bedX + bedW * 0.52}" y="${bedY + 26}" width="${bedW * 0.42}" height="22" rx="5" fill="${fabricLight}" stroke="${fabric}" stroke-width="0.5"/>`;
    s += `<rect x="${bedX + 10}" y="${bedY + 32}" width="${bedW * 0.38}" height="14" rx="4" fill="${linenW}" stroke="#D8D4CA" stroke-width="0.6"/>`;
    s += `<rect x="${bedX + bedW * 0.55}" y="${bedY + 32}" width="${bedW * 0.38}" height="14" rx="4" fill="${linenW}" stroke="#D8D4CA" stroke-width="0.6"/>`;

    // BEDSIDE TABLES — both sides
    const bsW = 28, bsH = 40;
    [bedX - bsW - 6, bedX + bedW + 6].forEach((bsX, idx) => {
      if (bsX > x + 4 && bsX + bsW < x + w - 4) {
        s += dropShadow(bsX + bsW/2, fl, bsW * 0.55, 2.5, 0.16);
        s += `<rect x="${bsX}" y="${fl - bsH}" width="${bsW}" height="${bsH}" fill="${wood}"/>`;
        s += `<rect x="${bsX + 1}" y="${fl - bsH + 1}" width="${bsW - 2}" height="3" fill="${woodLight}" opacity="0.6"/>`;
        // Drawer line
        s += `<rect x="${bsX + 4}" y="${fl - bsH + 14}" width="${bsW - 8}" height="2" fill="${woodDark}"/>`;
        s += `<circle cx="${bsX + bsW/2}" cy="${fl - bsH + 26}" r="1" fill="${woodDark}"/>`;
        // Lamp on top
        const lmpX = bsX + bsW/2;
        const lmpBase = fl - bsH;
        s += `<rect x="${lmpX - 1}" y="${lmpBase - 22}" width="2" height="22" fill="${woodDark}"/>`;
        s += `<polygon points="${lmpX - 8},${lmpBase - 22} ${lmpX + 8},${lmpBase - 22} ${lmpX + 5},${lmpBase - 36} ${lmpX - 5},${lmpBase - 36}" fill="${linenW}" stroke="${woodDark}" stroke-width="0.6"/>`;
        s += `<ellipse cx="${lmpX}" cy="${lmpBase - 21}" rx="8" ry="1.5" fill="#FFD89C" opacity="0.85"/>`;
        // Book on the other side table
        if (idx === 0) s += books(bsX + bsW/2 - 8, lmpBase, 2);
      }
    });

    // WARDROBE — only if room is wide enough
    if (w > 320) {
      const wbW = 50;
      const wbH = Math.min(180, h * 0.42);
      const wbX = x + w - wbW - 12;
      // Don't overlap bed area
      if (wbX > bedX + bedW + 50) {
        s += dropShadow(wbX + wbW/2, fl, wbW * 0.6, 3, 0.18);
        s += `<rect x="${wbX}" y="${fl - wbH}" width="${wbW}" height="${wbH}" fill="${wood}"/>`;
        s += `<rect x="${wbX + 1}" y="${fl - wbH + 1}" width="${wbW - 2}" height="6" fill="${woodLight}" opacity="0.5"/>`;
        // Two doors
        s += `<line x1="${wbX + wbW/2}" y1="${fl - wbH + 6}" x2="${wbX + wbW/2}" y2="${fl - 4}" stroke="${woodDark}" stroke-width="1"/>`;
        // Door panels
        for (let dp = 0; dp < 2; dp++) {
          const dpX = wbX + 4 + dp * wbW/2;
          s += `<rect x="${dpX}" y="${fl - wbH + 12}" width="${wbW/2 - 8}" height="${wbH * 0.4}" fill="none" stroke="${woodDark}" stroke-width="0.5" opacity="0.6"/>`;
          s += `<rect x="${dpX}" y="${fl - wbH * 0.5}" width="${wbW/2 - 8}" height="${wbH * 0.42}" fill="none" stroke="${woodDark}" stroke-width="0.5" opacity="0.6"/>`;
        }
        // Handles (brass)
        s += `<rect x="${wbX + wbW/2 - 4}" y="${fl - wbH * 0.5}" width="2" height="8" fill="${accent}"/>`;
        s += `<rect x="${wbX + wbW/2 + 2}" y="${fl - wbH * 0.5}" width="2" height="8" fill="${accent}"/>`;
      }
    }

    // ART above bed — large landscape
    const artW = bedW * 0.7;
    const artH = Math.min(55, (bedY - hbH + 30 - y - 12));
    if (artH > 22) {
      s += frame(bedX + (bedW - artW) / 2, bedY - hbH + 30 - artH - 10, artW, artH, 'landscape');
    }
  }

  else if (kind === 'kitchen') {
    // Kitchen counter run with cabinets, sink, hob, fridge, splashback, hanging pots
    const counterH = Math.min(75, h * 0.18);
    const counterY = fl - counterH;
    const counterTopH = 5;

    // Drop shadow
    s += dropShadow(x + w/2, fl, w * 0.45, 2.5, 0.15);

    // Lower cabinets — rich wood color
    s += `<rect x="${x + 4}" y="${counterY + counterTopH}" width="${w - 8}" height="${counterH - counterTopH}" fill="${wood}"/>`;
    // Cabinet doors
    const numDoors = 4;
    const doorW = (w - 16) / numDoors;
    for (let d = 0; d < numDoors; d++) {
      const dxx = x + 8 + d * doorW;
      s += `<rect x="${dxx}" y="${counterY + counterTopH + 4}" width="${doorW - 4}" height="${counterH - counterTopH - 8}" fill="${wood}" stroke="${woodDark}" stroke-width="0.6"/>`;
      // Brass handle
      s += `<rect x="${dxx + doorW - 12}" y="${counterY + counterH/2 - 1}" width="6" height="2" fill="${accent}"/>`;
    }

    // Counter top — marble/stone
    s += `<rect x="${x + 2}" y="${counterY}" width="${w - 4}" height="${counterTopH}" fill="#E8E4D8"/>`;
    s += `<rect x="${x + 2}" y="${counterY + counterTopH - 1}" width="${w - 4}" height="1" fill="#A89F8C"/>`;

    // SINK — undermount style
    const sinkW = Math.min(40, w * 0.16);
    const sinkX = x + w * 0.32 - sinkW/2;
    s += `<rect x="${sinkX}" y="${counterY - 2}" width="${sinkW}" height="${counterTopH + 4}" fill="#3A3A3A"/>`;
    s += `<rect x="${sinkX + 2}" y="${counterY}" width="${sinkW - 4}" height="${counterTopH + 1}" fill="#5C7080"/>`;
    // Tap
    s += `<rect x="${sinkX + sinkW/2 - 1.2}" y="${counterY - 14}" width="2.4" height="14" fill="#A0A0A8"/>`;
    s += `<path d="M ${sinkX + sinkW/2 - 5} ${counterY - 14} Q ${sinkX + sinkW/2} ${counterY - 18} ${sinkX + sinkW/2 + 5} ${counterY - 14}" stroke="#A0A0A8" stroke-width="2" fill="none"/>`;

    // HOB / STOVE — built into counter
    const hobW = Math.min(48, w * 0.2);
    const hobX = x + w * 0.62 - hobW/2;
    s += `<rect x="${hobX}" y="${counterY}" width="${hobW}" height="${counterTopH + 1}" fill="#1A1A1A"/>`;
    // 4 burners
    for (let b = 0; b < 4; b++) {
      const bcx = hobX + (b % 2 === 0 ? hobW * 0.25 : hobW * 0.75);
      const bcy = counterY + (b < 2 ? counterTopH * 0.35 : counterTopH * 0.7);
      s += `<circle cx="${bcx}" cy="${bcy}" r="2.5" fill="#5C5C5C"/>`;
      s += `<circle cx="${bcx}" cy="${bcy}" r="1.2" fill="#1A1A1A"/>`;
    }
    // Oven door below
    s += `<rect x="${hobX + 2}" y="${counterY + counterTopH + 6}" width="${hobW - 4}" height="${counterH * 0.45}" fill="#1A1A1A"/>`;
    s += `<rect x="${hobX + 4}" y="${counterY + counterTopH + 8}" width="${hobW - 8}" height="${counterH * 0.4}" fill="#3A3A3A" stroke="#5C5C5C" stroke-width="0.6"/>`;
    s += `<rect x="${hobX + 4}" y="${counterY + counterTopH + 10}" width="${hobW - 8}" height="2" fill="#5C5C5C"/>`;

    // FRIDGE — tall on the right
    const frW = Math.min(50, w * 0.18);
    const frX = x + w - frW - 8;
    const frH = Math.min(170, h * 0.4);
    s += dropShadow(frX + frW/2, fl, frW * 0.55, 2.5, 0.16);
    s += `<rect x="${frX}" y="${fl - frH}" width="${frW}" height="${frH}" fill="#E8E4D8"/>`;
    s += `<rect x="${frX}" y="${fl - frH}" width="${frW}" height="3" fill="#D8D4CA"/>`;
    // Freezer/fridge split
    s += `<line x1="${frX}" y1="${fl - frH * 0.62}" x2="${frX + frW}" y2="${fl - frH * 0.62}" stroke="${woodDark}" stroke-width="0.8"/>`;
    // Handles
    s += `<rect x="${frX + frW - 5}" y="${fl - frH * 0.55}" width="2" height="${frH * 0.45}" fill="#A0A0A8"/>`;
    s += `<rect x="${frX + frW - 5}" y="${fl - frH * 0.85}" width="2" height="${frH * 0.18}" fill="#A0A0A8"/>`;
    // Magnet/note on door
    s += `<rect x="${frX + 6}" y="${fl - frH * 0.4}" width="14" height="10" fill="${linenW}" stroke="${woodDark}" stroke-width="0.4" transform="rotate(-3 ${frX + 13} ${fl - frH * 0.35})"/>`;

    // BACKSPLASH TILES — between counter and upper cabinets
    const bsplashY = counterY - 50;
    const bsplashH = 50;
    const bsplashEnd = frX - 4;
    if (bsplashEnd > x + 12) {
      s += `<rect x="${x + 4}" y="${bsplashY}" width="${bsplashEnd - x - 4}" height="${bsplashH}" fill="${linenW}" opacity="0.4"/>`;
      // Tile grid
      const tCols = Math.floor((bsplashEnd - x - 4) / 22);
      for (let tc = 1; tc < tCols; tc++) {
        const tx = x + 4 + tc * (bsplashEnd - x - 4) / tCols;
        s += `<line x1="${tx}" y1="${bsplashY}" x2="${tx}" y2="${bsplashY + bsplashH}" stroke="${woodDark}" stroke-width="0.3" opacity="0.4"/>`;
      }
      for (let tr = 1; tr < 3; tr++) {
        s += `<line x1="${x + 4}" y1="${bsplashY + tr * bsplashH/3}" x2="${bsplashEnd}" y2="${bsplashY + tr * bsplashH/3}" stroke="${woodDark}" stroke-width="0.3" opacity="0.4"/>`;
      }
    }

    // UPPER CABINETS — left side
    if (w > 280) {
      const ucW = Math.min(60, w * 0.22);
      const ucX = x + 8;
      const ucY = bsplashY - 60;
      const ucH = 60;
      if (ucY > y + 16) {
        s += `<rect x="${ucX}" y="${ucY}" width="${ucW}" height="${ucH}" fill="${wood}"/>`;
        s += `<line x1="${ucX + ucW/2}" y1="${ucY}" x2="${ucX + ucW/2}" y2="${ucY + ucH}" stroke="${woodDark}" stroke-width="0.6"/>`;
        s += `<rect x="${ucX + 2}" y="${ucY + 4}" width="${ucW/2 - 4}" height="${ucH - 8}" fill="none" stroke="${woodDark}" stroke-width="0.4" opacity="0.5"/>`;
        s += `<rect x="${ucX + ucW/2 + 2}" y="${ucY + 4}" width="${ucW/2 - 4}" height="${ucH - 8}" fill="none" stroke="${woodDark}" stroke-width="0.4" opacity="0.5"/>`;
        s += `<rect x="${ucX + ucW/2 - 5}" y="${ucY + ucH/2 - 1}" width="3" height="2" fill="${accent}"/>`;
        s += `<rect x="${ucX + ucW/2 + 2}" y="${ucY + ucH/2 - 1}" width="3" height="2" fill="${accent}"/>`;
      }
    }

    // KITCHEN ITEMS on counter — coffee machine, fruit bowl, plant
    const itemY = counterY - 14;
    s += `<rect x="${x + w * 0.18}" y="${itemY - 4}" width="14" height="18" fill="${woodDark}"/>`;
    s += `<rect x="${x + w * 0.18 + 1}" y="${itemY - 2}" width="12" height="6" fill="#A0A0A8"/>`;
    s += `<circle cx="${x + w * 0.18 + 7}" cy="${itemY + 8}" r="1.2" fill="${accent}"/>`;
    // Fruit bowl
    s += `<ellipse cx="${x + w * 0.45}" cy="${itemY + 10}" rx="14" ry="3" fill="${woodDark}"/>`;
    s += `<circle cx="${x + w * 0.43}" cy="${itemY + 6}" r="3" fill="#FF6A1A"/>`;
    s += `<circle cx="${x + w * 0.47}" cy="${itemY + 5}" r="3" fill="#D4A057"/>`;
    s += `<circle cx="${x + w * 0.45}" cy="${itemY + 3}" r="2.5" fill="#7B1F1F"/>`;
    // Tabletop plant near fridge
    if (frX > x + w * 0.85) s += tablePlant(frX - 14, counterY, 0.7);
  }

  else if (kind === 'bathroom') {
    // Tub with shower curtain, toilet, sink with vanity, large mirror, towel rail, tiled floor
    // Floor tiles
    for (let tc = 0; tc < 8; tc++) {
      const tx = x + 4 + tc * (w - 8) / 8;
      s += `<line x1="${tx}" y1="${fl - 6}" x2="${tx}" y2="${fl}" stroke="${woodDark}" stroke-width="0.4" opacity="0.4"/>`;
    }

    // TUB — large with shower curtain
    const tubW = w * 0.42;
    const tubX = x + 8;
    const tubH = 36;
    s += dropShadow(tubX + tubW/2, fl, tubW * 0.55, 3, 0.16);
    // Tub side
    s += `<rect x="${tubX}" y="${fl - tubH}" width="${tubW}" height="${tubH}" rx="4" fill="${linenW}"/>`;
    s += `<rect x="${tubX + 4}" y="${fl - tubH + 4}" width="${tubW - 8}" height="${tubH - 10}" rx="3" fill="#D8E4ED"/>`;
    // Tub feet (clawfoot)
    s += `<ellipse cx="${tubX + 8}" cy="${fl - 2}" rx="4" ry="3" fill="${accent}"/>`;
    s += `<ellipse cx="${tubX + tubW - 8}" cy="${fl - 2}" rx="4" ry="3" fill="${accent}"/>`;
    // Shower curtain rod
    s += `<rect x="${tubX - 4}" y="${fl - tubH - 70}" width="${tubW + 8}" height="2" fill="${woodDark}"/>`;
    // Curtain
    s += `<rect x="${tubX - 4}" y="${fl - tubH - 68}" width="${tubW + 8}" height="68" fill="${linenW}" opacity="0.55"/>`;
    // Curtain folds
    for (let cf = 1; cf < 6; cf++) {
      const cfX = tubX + cf * (tubW + 8) / 6 - 4;
      s += `<line x1="${cfX}" y1="${fl - tubH - 65}" x2="${cfX}" y2="${fl - tubH - 4}" stroke="${woodDark}" stroke-width="0.4" opacity="0.4"/>`;
    }
    // Shower head
    s += `<rect x="${tubX + tubW - 18}" y="${fl - tubH - 78}" width="2" height="14" fill="#A0A0A8"/>`;
    s += `<circle cx="${tubX + tubW - 17}" cy="${fl - tubH - 80}" r="4" fill="#A0A0A8"/>`;
    // Tap
    s += `<rect x="${tubX + 4}" y="${fl - tubH - 8}" width="2" height="8" fill="#A0A0A8"/>`;

    // TOILET
    const toX = x + w * 0.55;
    s += dropShadow(toX + 14, fl, 16, 2.5, 0.16);
    // Cistern
    s += `<rect x="${toX}" y="${fl - 50}" width="22" height="22" rx="2" fill="${linenW}" stroke="${woodDark}" stroke-width="0.5"/>`;
    s += `<rect x="${toX + 14}" y="${fl - 46}" width="6" height="3" fill="#A0A0A8"/>`; // flush button
    // Bowl + seat
    s += `<rect x="${toX - 2}" y="${fl - 28}" width="26" height="6" rx="2" fill="${linenW}" stroke="${woodDark}" stroke-width="0.5"/>`;
    s += `<ellipse cx="${toX + 11}" cy="${fl - 14}" rx="14" ry="6" fill="${linenW}" stroke="${woodDark}" stroke-width="0.6"/>`;
    s += `<ellipse cx="${toX + 11}" cy="${fl - 14}" rx="11" ry="4" fill="#D8E4ED"/>`;
    // Base
    s += `<rect x="${toX + 6}" y="${fl - 10}" width="10" height="10" fill="${linenW}" stroke="${woodDark}" stroke-width="0.5"/>`;

    // SINK with vanity
    const snX = x + w * 0.78;
    const snW = 40;
    if (snX + snW < x + w - 4) {
      s += dropShadow(snX + snW/2, fl, snW * 0.55, 2.5, 0.16);
      // Vanity body
      s += `<rect x="${snX}" y="${fl - 50}" width="${snW}" height="50" fill="${wood}"/>`;
      // Vanity drawer
      s += `<rect x="${snX + 3}" y="${fl - 26}" width="${snW - 6}" height="10" fill="${woodLight}" stroke="${woodDark}" stroke-width="0.4"/>`;
      s += `<rect x="${snX + snW/2 - 4}" y="${fl - 22}" width="8" height="2" fill="${accent}"/>`;
      // Counter top
      s += `<rect x="${snX - 1}" y="${fl - 52}" width="${snW + 2}" height="3" fill="#E8E4D8"/>`;
      // Basin
      s += `<ellipse cx="${snX + snW/2}" cy="${fl - 48}" rx="${snW * 0.4}" ry="3" fill="#D8E4ED" stroke="${woodDark}" stroke-width="0.4"/>`;
      // Tap
      s += `<rect x="${snX + snW/2 - 1}" y="${fl - 60}" width="2" height="8" fill="#A0A0A8"/>`;
      s += `<rect x="${snX + snW/2 - 4}" y="${fl - 62}" width="8" height="2" fill="#A0A0A8"/>`;
      // MIRROR above sink
      const mrW = snW + 12;
      const mrX = snX - 6;
      const mrH = Math.min(70, fl - 65 - y - 12);
      if (mrH > 25) {
        s += `<rect x="${mrX - 2}" y="${fl - 65 - mrH}" width="${mrW + 4}" height="${mrH + 4}" fill="${wood}"/>`;
        s += `<rect x="${mrX}" y="${fl - 65 - mrH + 2}" width="${mrW}" height="${mrH}" fill="#C5DCEA"/>`;
        // Reflection highlight
        s += `<polygon points="${mrX + 4},${fl - 65 - mrH + 4} ${mrX + mrW * 0.4},${fl - 65 - mrH + 4} ${mrX + 4},${fl - 65 - mrH * 0.6}" fill="#fff" opacity="0.3"/>`;
      }
    }

    // TOWEL RAIL with hanging towel
    const trX = x + w * 0.4;
    s += `<rect x="${trX}" y="${fl - 100}" width="40" height="2" fill="${accent}"/>`;
    s += `<rect x="${trX + 5}" y="${fl - 98}" width="14" height="40" fill="${cushAccent}"/>`;
    s += `<rect x="${trX + 22}" y="${fl - 98}" width="14" height="36" fill="${linenW}"/>`;

    // BATHMAT
    s += `<rect x="${tubX + 8}" y="${fl - 4}" width="${tubW * 0.65}" height="6" fill="${cushAccent}" opacity="0.85"/>`;
  }

  else if (kind === 'outdoor') {
    if (tier >= 4) {
      // Premium terrace — stone tiles, dining set, large planters, string lights
      // Stone tile floor
      for (let tc = 0; tc < 6; tc++) {
        const tx = x + 4 + tc * (w - 8) / 6;
        s += `<rect x="${tx}" y="${fl - 4}" width="${(w - 8) / 6 - 2}" height="4" fill="${woodDark}" opacity="0.6"/>`;
      }
      // String lights from one wall to other
      const lightStartX = x + 8;
      const lightEndX = x + w - 8;
      const lightY = y + h * 0.18;
      s += `<path d="M ${lightStartX} ${lightY} Q ${(lightStartX + lightEndX)/2} ${lightY + 18} ${lightEndX} ${lightY}" stroke="${woodDark}" stroke-width="0.8" fill="none"/>`;
      for (let lb = 1; lb < 8; lb++) {
        const lbT = lb / 8;
        const lbX = lightStartX + (lightEndX - lightStartX) * lbT;
        const lbY = lightY + 18 * 4 * lbT * (1 - lbT);
        s += `<circle cx="${lbX}" cy="${lbY + 3}" r="2.2" fill="#FFD89C"/>`;
        s += `<circle cx="${lbX}" cy="${lbY + 3}" r="3.5" fill="#FFD89C" opacity="0.4"/>`;
      }
      // Dining table
      const tblW = Math.min(80, w * 0.32);
      const tblX = x + (w - tblW) / 2;
      s += dropShadow(tblX + tblW/2, fl, tblW * 0.55, 3, 0.18);
      s += `<rect x="${tblX}" y="${fl - 32}" width="${tblW}" height="6" fill="${wood}"/>`;
      s += `<rect x="${tblX}" y="${fl - 32}" width="${tblW}" height="2" fill="${woodLight}"/>`;
      // Pedestal base
      s += `<rect x="${tblX + tblW/2 - 4}" y="${fl - 26}" width="8" height="22" fill="${woodDark}"/>`;
      s += `<rect x="${tblX + tblW/2 - 12}" y="${fl - 6}" width="24" height="6" fill="${woodDark}"/>`;
      // Chairs (left + right)
      [tblX - 26, tblX + tblW + 4].forEach(chX => {
        s += `<rect x="${chX}" y="${fl - 38}" width="22" height="4" fill="${wood}"/>`;
        s += `<rect x="${chX + 2}" y="${fl - 56}" width="18" height="22" fill="${wood}"/>`;
        // Cushion
        s += `<rect x="${chX + 3}" y="${fl - 38}" width="16" height="2" fill="${cushAccent}"/>`;
        // Legs
        s += `<rect x="${chX + 2}" y="${fl - 34}" width="2" height="34" fill="${woodDark}"/>`;
        s += `<rect x="${chX + 18}" y="${fl - 34}" width="2" height="34" fill="${woodDark}"/>`;
      });
      // Items on table — wine bottle + 2 glasses
      s += `<rect x="${tblX + 6}" y="${fl - 50}" width="6" height="18" fill="#2E4A2E"/>`;
      s += `<rect x="${tblX + 7}" y="${fl - 54}" width="4" height="6" fill="#2E4A2E"/>`;
      s += `<polygon points="${tblX + 22},${fl - 32} ${tblX + 26},${fl - 44} ${tblX + 30},${fl - 32}" fill="#C5DCEA" opacity="0.7"/>`;
      s += `<polygon points="${tblX + tblW - 30},${fl - 32} ${tblX + tblW - 26},${fl - 44} ${tblX + tblW - 22},${fl - 32}" fill="#C5DCEA" opacity="0.7"/>`;
      // Big planter
      s += `<rect x="${x + w - 38}" y="${fl - 28}" width="26" height="28" fill="${woodDark}"/>`;
      s += `<rect x="${x + w - 36}" y="${fl - 28}" width="22" height="3" fill="${woodLight}"/>`;
      s += `<ellipse cx="${x + w - 30}" cy="${fl - 36}" rx="9" ry="14" fill="#3F5A1A"/>`;
      s += `<ellipse cx="${x + w - 22}" cy="${fl - 38}" rx="8" ry="13" fill="#5C8B30"/>`;
      s += `<ellipse cx="${x + w - 26}" cy="${fl - 46}" rx="6" ry="10" fill="#6FA138"/>`;
    } else {
      // Simple garden — grass, tree, flowerpots, garden chair
      s += `<rect x="${x + 4}" y="${fl - 6}" width="${w - 8}" height="6" fill="#5C7A2E" opacity="0.7"/>`;
      // Grass tufts
      for (let g = 0; g < 8; g++) {
        const gx = x + 8 + g * (w - 16) / 7;
        s += `<path d="M ${gx} ${fl - 6} L ${gx + 2} ${fl - 12} L ${gx + 4} ${fl - 6}" fill="#7CAA4E"/>`;
      }
      // Tree (right side)
      const treeX = x + w - 30;
      s += `<rect x="${treeX - 2}" y="${fl - 60}" width="5" height="60" fill="${woodDark}"/>`;
      s += `<circle cx="${treeX}" cy="${fl - 70}" r="22" fill="#5C7A2E"/>`;
      s += `<circle cx="${treeX - 8}" cy="${fl - 78}" r="14" fill="#7CAA4E"/>`;
      s += `<circle cx="${treeX + 8}" cy="${fl - 76}" r="13" fill="#6FA138"/>`;
      // Apples
      s += `<circle cx="${treeX - 3}" cy="${fl - 68}" r="2.5" fill="#C45A4F"/>`;
      s += `<circle cx="${treeX + 6}" cy="${fl - 72}" r="2.5" fill="#C45A4F"/>`;
      // Flowerpots
      s += `<rect x="${x + 12}" y="${fl - 16}" width="14" height="16" fill="${woodDark}"/>`;
      s += `<circle cx="${x + 19}" cy="${fl - 22}" r="6" fill="#5C8B30"/>`;
      s += `<circle cx="${x + 16}" cy="${fl - 24}" r="3" fill="#E91E63"/>`;
      s += `<circle cx="${x + 22}" cy="${fl - 24}" r="3" fill="#FFD700"/>`;
      // Garden chair
      const chX = x + w * 0.4;
      s += `<rect x="${chX}" y="${fl - 26}" width="22" height="3" fill="${wood}"/>`;
      s += `<rect x="${chX + 2}" y="${fl - 44}" width="18" height="20" fill="${wood}"/>`;
      s += `<rect x="${chX + 1}" y="${fl - 22}" width="2" height="22" fill="${woodDark}"/>`;
      s += `<rect x="${chX + 19}" y="${fl - 22}" width="2" height="22" fill="${woodDark}"/>`;
      // Slats on chair back
      for (let sl = 0; sl < 3; sl++) {
        s += `<line x1="${chX + 4}" y1="${fl - 40 + sl * 5}" x2="${chX + 18}" y2="${fl - 40 + sl * 5}" stroke="${woodDark}" stroke-width="0.6"/>`;
      }
    }
  }

  return s;
}

// Distribute owned upgrades across rooms based on item type
function getUpgradesForRoom(propId, ownedIds, roomIndex, totalRooms) {
  const property = PROPS.find(p => p.id === propId);
  const ownedUpgrades = ownedIds.map(id => property.upgrades.find(u => u.id === id)).filter(Boolean);

  const livingItems = ['fast_wifi','fast_wifi_2','smart_tv','smart_tv_2','artwork','art','art_collection','art_gallery','smart_lock','smart_home','smart_home_2','record_player','cinema','home_cinema','private_cinema','cinema20','full_smart_home','welcome_pack','noise_sensor','multi_lang','payment_pro','private_elevator','private_theatre','diplomatic_security'];
  const bedroomItems = ['premium_bedding','second_bed','heating_fix','boiler','air_purifier','royal_suite'];
  const kitchenItems = ['coffee_machine','dishwasher','wine_fridge','wine_cellar','chef_kitchen','kitchen_reno','michelin_kitchen','royal_kitchen','royal_wine'];
  const bathroomItems = ['bathroom_reno','lux_baths','spa_bath'];
  const outdoorItems = ['rooftop','garden_land','pool','helipad','helipad_transfer','transfer','stables','opera_terrace','infinity_pool','royal_garage'];
  const serviceItems = ['concierge','butler','full_butler','vault','recording_studio','studio','gym'];

  const roomBuckets = [];
  for (let i = 0; i < totalRooms; i++) roomBuckets.push([]);

  ownedUpgrades.forEach(upg => {
    let preferredRoom = 0;
    if (livingItems.includes(upg.id)) preferredRoom = 0;
    else if (bedroomItems.includes(upg.id)) preferredRoom = Math.min(1, totalRooms - 1);
    else if (kitchenItems.includes(upg.id)) preferredRoom = Math.min(2, totalRooms - 1);
    else if (bathroomItems.includes(upg.id)) preferredRoom = Math.min(3, totalRooms - 1);
    else if (outdoorItems.includes(upg.id)) preferredRoom = totalRooms - 1;
    else if (serviceItems.includes(upg.id)) preferredRoom = Math.min(2, totalRooms - 1);
    roomBuckets[preferredRoom].push(upg);
  });

  // Spread overflow: if any room has >1 item AND another room is empty, redistribute
  let pass = 0;
  while (pass++ < 10) {
    let moved = false;
    for (let r = 0; r < totalRooms; r++) {
      if (roomBuckets[r].length > 1) {
        // Find nearest empty room
        for (let dist = 1; dist < totalRooms; dist++) {
          for (const dir of [+1, -1]) {
            const target = r + dir * dist;
            if (target >= 0 && target < totalRooms && roomBuckets[target].length === 0) {
              roomBuckets[target].push(roomBuckets[r].pop());
              moved = true;
              break;
            }
          }
          if (moved) break;
        }
      }
    }
    if (!moved) break;
  }

  return roomBuckets[roomIndex] || [];
}

// Map upgrade IDs to slot types
const ITEM_SLOT_TYPE = {
  fast_wifi: 'router', fast_wifi_2: 'router',
  smart_tv: 'tv', smart_tv_2: 'tv',
  coffee_machine: 'coffee',
  premium_bedding: 'bed', second_bed: 'bed',
  smart_lock: 'lock',
  air_purifier: 'air_purifier',
  artwork: 'art', art: 'art', art_collection: 'art', art_gallery: 'art',
  boiler: 'boiler', heating_fix: 'boiler',
  dishwasher: 'dishwasher',
  bathroom_reno: 'bath', lux_baths: 'bath', spa_bath: 'bath',
  record_player: 'record_player',
  rooftop: 'rooftop',
  kitchen_reno: 'kitchen_full', chef_kitchen: 'kitchen_full', michelin_kitchen: 'kitchen_full',
  garden_land: 'plant',
  smart_home: 'smart_panel', smart_home_2: 'smart_panel', full_smart_home: 'smart_panel',
  cinema: 'screen', home_cinema: 'screen', private_cinema: 'screen', cinema20: 'screen',
  concierge: 'butler', butler: 'butler', full_butler: 'butler',
  gym: 'gym',
  wine_fridge: 'wine', wine_cellar: 'wine',
  transfer: 'helicopter', helipad_transfer: 'helicopter',
  helipad: 'helipad',
  pool: 'pool',
  recording_studio: 'studio', studio: 'studio',
  vault: 'safe',
  // New upgrades
  welcome_pack: 'welcome_basket',
  noise_sensor: 'noise_meter',
  multi_lang: 'language_kit',
  payment_pro: 'card_terminal',
  stables: 'horse_stable',
  royal_kitchen: 'kitchen_full',
  opera_terrace: 'opera_terrace',
  private_elevator: 'lift',
  royal_suite: 'royal_bed',
  diplomatic_security: 'security_team',
  infinity_pool: 'pool',
  private_theatre: 'theatre_stage',
  royal_garage: 'supercar',
  royal_wine: 'wine',
};

// Each upgrade renders as a substantial visual element inside the room
function renderItemInRoom(upg, room, index, total){
  const { x, y, w, h, baseY } = room;
  const slot = ITEM_SLOT_TYPE[upg.id] || 'floor_object';

  switch(slot){
    case 'tv': {
      const tvW = w * 0.55, tvH = h * 0.32;
      const tvX = x + (w - tvW) / 2, tvY = y + h * 0.22;
      return `<g class="item-pop">
        <rect x="${tvX}" y="${tvY}" width="${tvW}" height="${tvH}" fill="#1a1a2e" stroke="#444" stroke-width="2" rx="3"/>
        <rect x="${tvX + 4}" y="${tvY + 4}" width="${tvW - 8}" height="${tvH - 8}" fill="#3a4a8a" opacity="0.85"/>
        <circle cx="${tvX + tvW/2}" cy="${tvY + tvH/2}" r="${tvH * 0.2}" fill="#F5A623" opacity="0.7"/>
        <text x="${tvX + tvW/2}" y="${tvY + tvH/2 + 5}" font-size="14" text-anchor="middle">📺</text>
      </g>`;
    }
    case 'screen': {
      const sW = w * 0.7, sH = h * 0.4;
      const sX = x + (w - sW) / 2, sY = y + h * 0.18;
      return `<g class="item-pop">
        <rect x="${sX}" y="${sY}" width="${sW}" height="${sH}" fill="#000" stroke="#704020" stroke-width="3" rx="2"/>
        <rect x="${sX + 4}" y="${sY + 4}" width="${sW - 8}" height="${sH - 8}" fill="#1C2280"/>
        <text x="${sX + sW/2}" y="${sY + sH/2 + 8}" font-size="26" text-anchor="middle">🎬</text>
      </g>`;
    }
    case 'bed': {
      const bW = w * 0.55, bH = h * 0.18;
      const bX = x + w * 0.22, bY = baseY - 30 - bH;
      const fillC = upg.id === 'second_bed' ? '#C5CAFE' : '#FFE4B0';
      return `<g class="item-pop">
        <rect x="${bX}" y="${bY + bH - 6}" width="${bW}" height="6" fill="#704020"/>
        <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="#fff" stroke="#704020" stroke-width="1.5" rx="2"/>
        <rect x="${bX}" y="${bY}" width="${bW}" height="${bH * 0.4}" fill="${fillC}"/>
        <rect x="${bX + 4}" y="${bY + 3}" width="${bW * 0.35}" height="${bH * 0.3}" fill="#fff" stroke="#bbb" stroke-width="0.8" rx="2"/>
        <rect x="${bX + bW * 0.55}" y="${bY + 3}" width="${bW * 0.35}" height="${bH * 0.3}" fill="#fff" stroke="#bbb" stroke-width="0.8" rx="2"/>
        <text x="${bX + bW/2}" y="${bY + bH * 0.78}" font-size="14" text-anchor="middle">🛏️</text>
      </g>`;
    }
    case 'kitchen_full': {
      const kW = w * 0.7, kH = h * 0.2;
      const kX = x + (w - kW) / 2, kY = baseY - 15 - kH;
      return `<g class="item-pop">
        <rect x="${kX}" y="${kY}" width="${kW}" height="${kH}" fill="#3a3a3a" rx="2"/>
        <rect x="${kX}" y="${kY}" width="${kW}" height="4" fill="#F5A623"/>
        <rect x="${kX + kW * 0.1}" y="${kY + 6}" width="${kW * 0.18}" height="${kH - 10}" fill="#888" stroke="#222" stroke-width="0.5" rx="1"/>
        <rect x="${kX + kW * 0.32}" y="${kY + 6}" width="${kW * 0.12}" height="${kH - 10}" fill="#1a1a2e"/>
        <rect x="${kX + kW * 0.48}" y="${kY + 6}" width="${kW * 0.22}" height="${kH - 10}" fill="#888" stroke="#222" stroke-width="0.5"/>
        <rect x="${kX + kW * 0.74}" y="${kY + 6}" width="${kW * 0.18}" height="${kH - 10}" fill="#fff" stroke="#888" stroke-width="0.5"/>
        <text x="${kX + kW/2}" y="${kY + kH/2 + 5}" font-size="14" text-anchor="middle">${upg.id === 'michelin_kitchen' ? '👨‍🍳' : '🍳'}</text>
      </g>`;
    }
    case 'coffee': {
      const cW = w * 0.18, cH = h * 0.18;
      const cX = x + w * 0.05, cY = baseY - 18 - cH;
      return `<g class="item-pop">
        <rect x="${cX}" y="${cY}" width="${cW}" height="${cH}" fill="#3a3a3a" rx="2"/>
        <rect x="${cX + 3}" y="${cY + 3}" width="${cW - 6}" height="6" fill="#F5A623"/>
        <rect x="${cX + cW/2 - 4}" y="${cY + cH - 8}" width="8" height="6" fill="#222"/>
        <text x="${cX + cW/2}" y="${cY - 4}" font-size="14" text-anchor="middle">☕</text>
      </g>`;
    }
    case 'bath': {
      const bW = w * 0.55, bH = h * 0.16;
      const bX = x + (w - bW) / 2, bY = baseY - 25 - bH/2;
      return `<g class="item-pop">
        <ellipse cx="${bX + bW/2}" cy="${bY + bH/2 + 4}" rx="${bW/2 + 4}" ry="${bH/2 + 4}" fill="#704020"/>
        <ellipse cx="${bX + bW/2}" cy="${bY + bH/2}" rx="${bW/2}" ry="${bH/2}" fill="#fff" stroke="#1C2280" stroke-width="1.5"/>
        <ellipse cx="${bX + bW/2}" cy="${bY + bH/2 - 1}" rx="${bW/2 - 6}" ry="${bH/2 - 4}" fill="#B8E3FF"/>
        <text x="${bX + bW/2}" y="${bY + bH/2 + 5}" font-size="16" text-anchor="middle">🛁</text>
      </g>`;
    }
    case 'pool': {
      const pW = w * 0.7, pH = h * 0.18;
      const pX = x + (w - pW) / 2, pY = baseY - 22 - pH/2;
      return `<g class="item-pop">
        <ellipse cx="${pX + pW/2}" cy="${pY + pH/2}" rx="${pW/2}" ry="${pH/2}" fill="#1C2280"/>
        <ellipse cx="${pX + pW/2}" cy="${pY + pH/2 - 2}" rx="${pW/2 - 5}" ry="${pH/2 - 3}" fill="#5BC0EB" opacity="0.85"/>
        <ellipse cx="${pX + pW * 0.3}" cy="${pY + pH/2 - 4}" rx="${pW * 0.1}" ry="2" fill="#fff" opacity="0.5"/>
        <text x="${pX + pW/2}" y="${pY + pH/2 + 6}" font-size="20" text-anchor="middle">🏊</text>
      </g>`;
    }
    case 'art': {
      const aW = w * 0.28, aH = h * 0.22;
      const aX = x + w * 0.08 + (index % 2) * (aW + 8), aY = y + h * 0.18;
      return `<g class="item-pop">
        <rect x="${aX - 3}" y="${aY - 3}" width="${aW + 6}" height="${aH + 6}" fill="#704020"/>
        <rect x="${aX}" y="${aY}" width="${aW}" height="${aH}" fill="#F5A623"/>
        <circle cx="${aX + aW * 0.3}" cy="${aY + aH * 0.4}" r="${aH * 0.18}" fill="#1C2280"/>
        <rect x="${aX + aW * 0.5}" y="${aY + aH * 0.3}" width="${aW * 0.35}" height="${aH * 0.4}" fill="#6AAF2E"/>
      </g>`;
    }
    case 'router': {
      const rW = w * 0.12, rH = h * 0.06;
      const rX = x + w - rW - 8, rY = y + 12;
      return `<g class="item-pop">
        <rect x="${rX}" y="${rY}" width="${rW}" height="${rH}" fill="#1C2280" rx="2"/>
        <circle cx="${rX + rW * 0.25}" cy="${rY + rH/2}" r="2" fill="#6AAF2E"/>
        <circle cx="${rX + rW * 0.5}" cy="${rY + rH/2}" r="2" fill="#F5A623"/>
        <circle cx="${rX + rW * 0.75}" cy="${rY + rH/2}" r="2" fill="#6AAF2E"/>
      </g>`;
    }
    case 'lock': {
      const lX = x + 16, lY = baseY - 35;
      return `<g class="item-pop">
        <rect x="${lX - 5}" y="${lY - 18}" width="10" height="32" fill="#704020"/>
        <circle cx="${lX}" cy="${lY}" r="6" fill="#F5A623"/>
        <circle cx="${lX}" cy="${lY}" r="3" fill="#1a1a2e"/>
      </g>`;
    }
    case 'wine': {
      const wW = w * 0.16, wH = h * 0.22;
      const wX = x + w * 0.78, wY = baseY - 18 - wH;
      return `<g class="item-pop">
        <rect x="${wX}" y="${wY}" width="${wW}" height="${wH}" fill="#704020" rx="2"/>
        <rect x="${wX + 2}" y="${wY + 3}" width="3" height="${wH - 6}" fill="#3a3a3a"/>
        <rect x="${wX + wW * 0.3}" y="${wY + 3}" width="3" height="${wH - 6}" fill="#3a3a3a"/>
        <rect x="${wX + wW * 0.55}" y="${wY + 3}" width="3" height="${wH - 6}" fill="#3a3a3a"/>
        <rect x="${wX + wW * 0.8}" y="${wY + 3}" width="3" height="${wH - 6}" fill="#3a3a3a"/>
        <text x="${wX + wW/2}" y="${wY - 4}" font-size="13" text-anchor="middle">🍷</text>
      </g>`;
    }
    case 'butler': {
      const bX = x + w * 0.78, bY = baseY - 12;
      return `<g class="item-pop" transform="translate(${bX}, ${bY})">
        <ellipse cx="0" cy="-5" rx="14" ry="3" fill="#1a1a2e" opacity="0.3"/>
        <rect x="-7" y="-50" width="14" height="40" fill="#1a1a2e" rx="2"/>
        <rect x="-3" y="-48" width="6" height="36" fill="#fff"/>
        <circle cx="0" cy="-58" r="9" fill="#F5C9A0"/>
        <ellipse cx="-2.5" cy="-58" rx="0.8" ry="1" fill="#3D2817"/>
        <ellipse cx="2.5" cy="-58" rx="0.8" ry="1" fill="#3D2817"/>
        <path d="M -3 -54 Q 0 -52 3 -54" stroke="#3D2817" stroke-width="0.6" fill="none"/>
        <rect x="-7" y="-66" width="14" height="6" fill="#1a1a2e" rx="1"/>
        <ellipse cx="0" cy="-66" rx="9" ry="3" fill="#1a1a2e"/>
      </g>`;
    }
    case 'gym': {
      const gX = x + w * 0.5, gY = baseY - 20;
      return `<g class="item-pop" transform="translate(${gX},${gY})">
        <rect x="-22" y="-3" width="44" height="3" fill="#444"/>
        <circle cx="-22" cy="-1.5" r="6" fill="#1a1a2e"/>
        <circle cx="22" cy="-1.5" r="6" fill="#1a1a2e"/>
        <rect x="-3" y="-12" width="6" height="9" fill="#1a1a2e"/>
        <text x="0" y="-15" font-size="14" text-anchor="middle">💪</text>
      </g>`;
    }
    case 'plant': {
      const pX = x + w * 0.3 + (index * 60) % (w * 0.5), pY = baseY - 8;
      return `<g class="item-pop" transform="translate(${pX},${pY})">
        <ellipse cx="0" cy="0" rx="20" ry="4" fill="#3B6D11" opacity="0.4"/>
        <circle cx="-12" cy="-6" r="9" fill="#6AAF2E"/>
        <circle cx="-2" cy="-10" r="10" fill="#7BC332"/>
        <circle cx="10" cy="-7" r="8" fill="#6AAF2E"/>
        <circle cx="-5" cy="-15" r="3" fill="#F5A623"/>
        <circle cx="5" cy="-13" r="3" fill="#E91E63"/>
        <circle cx="0" cy="-18" r="2.5" fill="#fff"/>
      </g>`;
    }
    case 'rooftop': {
      const rW = w * 0.7, rX = x + (w - rW) / 2, rY = y - 18;
      return `<g class="item-pop">
        <rect x="${rX}" y="${rY}" width="${rW}" height="6" fill="#704020"/>
        <rect x="${rX + 6}" y="${rY - 8}" width="6" height="8" fill="#6AAF2E"/>
        <rect x="${rX + 18}" y="${rY - 12}" width="6" height="12" fill="#6AAF2E"/>
        <rect x="${rX + rW - 24}" y="${rY - 10}" width="6" height="10" fill="#6AAF2E"/>
        <rect x="${rX + rW - 12}" y="${rY - 8}" width="6" height="8" fill="#6AAF2E"/>
        <text x="${rX + rW/2}" y="${rY - 14}" font-size="12" text-anchor="middle">🌆</text>
      </g>`;
    }
    case 'helicopter': {
      const hX = x + w/2, hY = y - 35;
      return `<g class="item-pop chopper" transform="translate(${hX},${hY})">
        <line x1="-30" y1="-3" x2="30" y2="-3" stroke="#1a1a2e" stroke-width="3"/>
        <ellipse cx="0" cy="0" rx="14" ry="6" fill="#1C2280"/>
        <ellipse cx="0" cy="-1" rx="9" ry="3" fill="#5BC0EB" opacity="0.6"/>
        <rect x="-2" y="2" width="4" height="6" fill="#F5A623"/>
        <line x1="-25" y1="6" x2="25" y2="6" stroke="#1a1a2e" stroke-width="1"/>
      </g>`;
    }
    case 'helipad': {
      const hX = x + w/2, hY = y - 20;
      return `<g class="item-pop" transform="translate(${hX},${hY})">
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#1a1a2e" opacity="0.3"/>
        <circle cx="0" cy="0" r="20" fill="#fff" stroke="#1C2280" stroke-width="2"/>
        <text x="0" y="6" font-size="22" font-weight="800" text-anchor="middle" fill="#1C2280">H</text>
      </g>`;
    }
    case 'safe': {
      const sW = w * 0.16, sH = h * 0.18;
      const sX = x + 16, sY = y + h * 0.55;
      return `<g class="item-pop">
        <rect x="${sX}" y="${sY}" width="${sW}" height="${sH}" fill="#3a3a3a" stroke="#1a1a2e" stroke-width="1.5"/>
        <circle cx="${sX + sW/2}" cy="${sY + sH/2}" r="${sH * 0.25}" fill="#F5A623"/>
        <circle cx="${sX + sW/2}" cy="${sY + sH/2}" r="${sH * 0.12}" fill="#1a1a2e"/>
      </g>`;
    }
    case 'studio': {
      const stX = x + w * 0.7, stY = baseY - 30;
      return `<g class="item-pop" transform="translate(${stX},${stY})">
        <rect x="-22" y="-5" width="44" height="8" fill="#3a3a3a" rx="1"/>
        <circle cx="-12" cy="-2" r="5" fill="#222"/><circle cx="-12" cy="-2" r="2" fill="#888"/>
        <circle cx="12" cy="-2" r="5" fill="#222"/><circle cx="12" cy="-2" r="2" fill="#888"/>
        <rect x="-2" y="-22" width="4" height="20" fill="#444"/>
        <ellipse cx="0" cy="-25" rx="6" ry="4" fill="#1a1a2e"/>
        <text x="0" y="-32" font-size="12" text-anchor="middle">🎙️</text>
      </g>`;
    }
    case 'smart_panel': {
      const sW = w * 0.13, sH = h * 0.15;
      const sX = x + w - sW - 18, sY = y + h * 0.55;
      return `<g class="item-pop">
        <rect x="${sX}" y="${sY}" width="${sW}" height="${sH}" fill="#1a1a2e" rx="3"/>
        <rect x="${sX + 4}" y="${sY + 4}" width="${sW - 8}" height="${sH - 8}" fill="#1C2280"/>
        <circle cx="${sX + sW * 0.3}" cy="${sY + sH * 0.4}" r="2" fill="#6AAF2E"/>
        <circle cx="${sX + sW * 0.5}" cy="${sY + sH * 0.4}" r="2" fill="#F5A623"/>
        <circle cx="${sX + sW * 0.7}" cy="${sY + sH * 0.4}" r="2" fill="#fff"/>
        <rect x="${sX + 4}" y="${sY + sH * 0.6}" width="${sW - 8}" height="2" fill="#fff" opacity="0.3"/>
      </g>`;
    }
    case 'boiler': {
      const bW = w * 0.13, bH = h * 0.18;
      const bX = x + w - bW - 18, bY = y + h * 0.62;
      return `<g class="item-pop">
        <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="#C5CAFE" stroke="#1C2280" stroke-width="1.5" rx="2"/>
        <circle cx="${bX + bW/2}" cy="${bY + bH * 0.4}" r="${bH * 0.18}" fill="#F5A623"/>
        <rect x="${bX + bW * 0.3}" y="${bY + bH * 0.7}" width="${bW * 0.4}" height="3" fill="#1C2280"/>
      </g>`;
    }
    case 'air_purifier': {
      const aX = x + 24, aY = baseY - 28;
      return `<g class="item-pop" transform="translate(${aX},${aY})">
        <rect x="-7" y="-22" width="14" height="22" fill="#fff" stroke="#888" stroke-width="1" rx="2"/>
        <circle cx="0" cy="-12" r="3" fill="#6AAF2E" opacity="0.7"/>
        <rect x="-5" y="-6" width="10" height="2" fill="#bbb"/>
      </g>`;
    }
    case 'record_player': {
      const rX = x + w * 0.55, rY = baseY - 22;
      return `<g class="item-pop" transform="translate(${rX},${rY})">
        <rect x="-15" y="-3" width="30" height="6" fill="#704020"/>
        <rect x="-13" y="-12" width="26" height="9" fill="#1a1a2e"/>
        <circle cx="-3" cy="-7" r="3" fill="#3a3a3a"/>
        <circle cx="-3" cy="-7" r="0.8" fill="#F5A623"/>
      </g>`;
    }
    case 'dishwasher': {
      const dW = w * 0.18, dH = h * 0.18;
      const dX = x + w * 0.05, dY = baseY - 18 - dH;
      return `<g class="item-pop">
        <rect x="${dX}" y="${dY}" width="${dW}" height="${dH}" fill="#888" stroke="#444" stroke-width="1"/>
        <rect x="${dX + 3}" y="${dY + 3}" width="${dW - 6}" height="${dH * 0.6}" fill="#1a1a2e"/>
        <rect x="${dX + 3}" y="${dY + dH * 0.7}" width="${dW - 6}" height="2" fill="#888"/>
        <text x="${dX + dW/2}" y="${dY - 3}" font-size="11" text-anchor="middle">🍽️</text>
      </g>`;
    }
    case 'welcome_basket': {
      const wX = x + w * 0.12, wY = baseY - 20;
      return `<g class="item-pop" transform="translate(${wX},${wY})">
        <ellipse cx="0" cy="2" rx="14" ry="3" fill="#1a1a2e" opacity="0.3"/>
        <path d="M -12 -4 Q -14 -14 0 -16 Q 14 -14 12 -4 Z" fill="#A0522D" stroke="#704020" stroke-width="1"/>
        <rect x="-12" y="-6" width="24" height="3" fill="#8B4513"/>
        <path d="M -8 -16 Q 0 -22 8 -16" stroke="#704020" stroke-width="2" fill="none"/>
        <circle cx="-4" cy="-12" r="2" fill="#E91E63"/>
        <circle cx="3" cy="-13" r="2" fill="#F5A623"/>
      </g>`;
    }
    case 'noise_meter': {
      const nW = w * 0.12, nH = h * 0.12;
      const nX = x + w - nW - 12, nY = y + h * 0.45;
      return `<g class="item-pop">
        <rect x="${nX}" y="${nY}" width="${nW}" height="${nH}" fill="#1a1a2e" rx="3"/>
        <circle cx="${nX + nW * 0.3}" cy="${nY + nH * 0.5}" r="2" fill="#6AAF2E"/>
        <rect x="${nX + nW * 0.5}" y="${nY + nH * 0.3}" width="${nW * 0.4}" height="${nH * 0.4}" fill="#3a3a3a"/>
        <text x="${nX + nW * 0.7}" y="${nY + nH * 0.65}" font-size="6" fill="#6AAF2E" font-family="monospace">42dB</text>
      </g>`;
    }
    case 'language_kit': {
      const lX = x + w * 0.5, lY = y + h * 0.32;
      return `<g class="item-pop">
        <rect x="${lX - 18}" y="${lY}" width="36" height="22" fill="#fff" stroke="#1C2280" stroke-width="1.5" rx="2"/>
        <text x="${lX}" y="${lY + 9}" font-size="6" text-anchor="middle" fill="#1C2280" font-weight="800">EN ES PL FR</text>
        <text x="${lX}" y="${lY + 17}" font-size="6" text-anchor="middle" fill="#1C2280" font-weight="800">DE IT ZH AR</text>
        <text x="${lX}" y="${lY - 4}" font-size="11" text-anchor="middle">🌍</text>
      </g>`;
    }
    case 'card_terminal': {
      const tX = x + w * 0.78, tY = baseY - 22;
      return `<g class="item-pop" transform="translate(${tX},${tY})">
        <rect x="-9" y="-15" width="18" height="14" fill="#1C2280" rx="2"/>
        <rect x="-7" y="-13" width="14" height="6" fill="#1a1a2e"/>
        <rect x="-6" y="-5" width="12" height="3" fill="#fff"/>
        <text x="0" y="3" font-size="9" text-anchor="middle">💳</text>
      </g>`;
    }
    case 'horse_stable': {
      const sW = w * 0.35, sH = h * 0.32;
      const sX = x + (w - sW) / 2, sY = baseY - 8 - sH;
      return `<g class="item-pop">
        <rect x="${sX}" y="${sY}" width="${sW}" height="${sH}" fill="#704020" stroke="#3D2817" stroke-width="1.5"/>
        <line x1="${sX + sW/2}" y1="${sY}" x2="${sX + sW/2}" y2="${sY + sH}" stroke="#3D2817" stroke-width="1.2"/>
        <polygon points="${sX},${sY} ${sX + sW/2},${sY - 8} ${sX + sW},${sY}" fill="#A0522D"/>
        <!-- Horse head poking out -->
        <ellipse cx="${sX + sW * 0.3}" cy="${sY + sH * 0.5}" rx="6" ry="5" fill="#704020"/>
        <circle cx="${sX + sW * 0.35}" cy="${sY + sH * 0.45}" r="0.8" fill="#1a1a2e"/>
        <text x="${sX + sW/2}" y="${sY - 12}" font-size="14" text-anchor="middle">🐎</text>
      </g>`;
    }
    case 'opera_terrace': {
      const tX = x + (w * 0.5), tY = y - 18;
      return `<g class="item-pop">
        <rect x="${tX - w * 0.35}" y="${tY}" width="${w * 0.7}" height="6" fill="#704020"/>
        <!-- Opera building suggestion -->
        <polygon points="${tX - 30},${tY} ${tX - 35},${tY - 24} ${tX + 35},${tY - 24} ${tX + 30},${tY}" fill="#F8E5E5" stroke="#704020" stroke-width="0.8"/>
        <rect x="${tX - 22}" y="${tY - 18}" width="6" height="14" fill="#FFD700"/>
        <rect x="${tX - 12}" y="${tY - 18}" width="6" height="14" fill="#FFD700"/>
        <rect x="${tX - 2}" y="${tY - 18}" width="6" height="14" fill="#FFD700"/>
        <rect x="${tX + 8}" y="${tY - 18}" width="6" height="14" fill="#FFD700"/>
        <rect x="${tX + 18}" y="${tY - 18}" width="6" height="14" fill="#FFD700"/>
        <text x="${tX}" y="${tY - 28}" font-size="14" text-anchor="middle">🎭</text>
      </g>`;
    }
    case 'lift': {
      const lW = w * 0.15, lH = h * 0.4;
      const lX = x + w * 0.05, lY = y + h * 0.3;
      return `<g class="item-pop">
        <rect x="${lX}" y="${lY}" width="${lW}" height="${lH}" fill="#3a3a3a" stroke="#1a1a2e" stroke-width="1.5"/>
        <line x1="${lX + lW/2}" y1="${lY}" x2="${lX + lW/2}" y2="${lY + lH}" stroke="#FFD700" stroke-width="1.2"/>
        <rect x="${lX + 2}" y="${lY + 4}" width="${lW - 4}" height="3" fill="#FFD700"/>
        <text x="${lX + lW/2}" y="${lY - 3}" font-size="10" text-anchor="middle">🛗</text>
      </g>`;
    }
    case 'royal_bed': {
      const bW = w * 0.62, bH = h * 0.22;
      const bX = x + w * 0.2, bY = baseY - 30 - bH;
      return `<g class="item-pop">
        <rect x="${bX - 6}" y="${bY - 30}" width="${bW + 12}" height="${bH + 30}" fill="#8B0000" opacity="0.3"/>
        <rect x="${bX - 4}" y="${bY - 28}" width="${bW + 8}" height="6" fill="#FFD700"/>
        <rect x="${bX}" y="${bY + bH - 6}" width="${bW}" height="6" fill="#704020"/>
        <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="#fff" stroke="#8B0000" stroke-width="2" rx="2"/>
        <rect x="${bX}" y="${bY}" width="${bW}" height="${bH * 0.4}" fill="#FFD700"/>
        <rect x="${bX + 4}" y="${bY + 3}" width="${bW * 0.4}" height="${bH * 0.3}" fill="#fff" stroke="#bbb" rx="2"/>
        <rect x="${bX + bW * 0.55}" y="${bY + 3}" width="${bW * 0.4}" height="${bH * 0.3}" fill="#fff" stroke="#bbb" rx="2"/>
        <text x="${bX + bW/2}" y="${bY + bH * 0.78}" font-size="16" text-anchor="middle">👑</text>
      </g>`;
    }
    case 'security_team': {
      const sX = x + w * 0.78, sY = baseY - 12;
      return `<g class="item-pop" transform="translate(${sX}, ${sY})">
        <ellipse cx="0" cy="-5" rx="14" ry="3" fill="#1a1a2e" opacity="0.3"/>
        <rect x="-7" y="-50" width="14" height="40" fill="#1a1a2e"/>
        <circle cx="0" cy="-58" r="9" fill="#F5C9A0"/>
        <rect x="-9" y="-66" width="18" height="6" fill="#1a1a2e"/>
        <rect x="-3" y="-48" width="6" height="3" fill="#FFD700"/>
        <rect x="-2" y="-58" width="4" height="2" fill="#1a1a2e"/>
      </g>`;
    }
    case 'theatre_stage': {
      const sW = w * 0.65, sH = h * 0.35;
      const sX = x + (w - sW) / 2, sY = y + h * 0.2;
      return `<g class="item-pop">
        <rect x="${sX - 4}" y="${sY - 4}" width="${sW + 8}" height="${sH + 8}" fill="#8B0000"/>
        <rect x="${sX}" y="${sY}" width="${sW}" height="${sH}" fill="#1a1a2e"/>
        <!-- Curtains -->
        <path d="M ${sX} ${sY} Q ${sX + 12} ${sY + sH * 0.3} ${sX + 6} ${sY + sH} L ${sX} ${sY + sH} Z" fill="#8B0000"/>
        <path d="M ${sX + sW} ${sY} Q ${sX + sW - 12} ${sY + sH * 0.3} ${sX + sW - 6} ${sY + sH} L ${sX + sW} ${sY + sH} Z" fill="#8B0000"/>
        <!-- Stage light -->
        <circle cx="${sX + sW/2}" cy="${sY + sH * 0.5}" r="${sH * 0.18}" fill="#FFD700" opacity="0.6"/>
        <text x="${sX + sW/2}" y="${sY + sH/2 + 6}" font-size="22" text-anchor="middle">🎭</text>
      </g>`;
    }
    case 'supercar': {
      const cX = x + w * 0.5, cY = baseY - 12;
      return `<g class="item-pop" transform="translate(${cX},${cY})">
        <ellipse cx="0" cy="2" rx="36" ry="4" fill="#1a1a2e" opacity="0.3"/>
        <!-- Car body -->
        <path d="M -32 0 Q -34 -10 -22 -12 L -10 -18 L 14 -18 L 22 -12 Q 32 -10 30 0 Z" fill="#8B0000"/>
        <rect x="-8" y="-16" width="16" height="6" fill="#1C2280" opacity="0.6"/>
        <!-- Wheels -->
        <circle cx="-20" cy="0" r="6" fill="#1a1a2e"/>
        <circle cx="-20" cy="0" r="3" fill="#888"/>
        <circle cx="20" cy="0" r="6" fill="#1a1a2e"/>
        <circle cx="20" cy="0" r="3" fill="#888"/>
        <!-- Headlight -->
        <ellipse cx="-30" cy="-5" rx="3" ry="2" fill="#FFD700"/>
        <text x="0" y="-22" font-size="10" text-anchor="middle">🏎️</text>
      </g>`;
    }
    default: {
      const fX = x + w * 0.5 + ((index - total/2) * 28), fY = baseY - 24;
      return `<g class="item-pop" transform="translate(${fX},${fY})">
        <ellipse cx="0" cy="2" rx="14" ry="3" fill="#1a1a2e" opacity="0.2"/>
        <text x="0" y="-2" font-size="22" text-anchor="middle">${upg.emoji}</text>
      </g>`;
    }
  }
}
