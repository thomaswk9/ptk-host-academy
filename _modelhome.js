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
  if (style === 'georgian') {
    // 6-pane sash — Georgian symmetry
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="#B8E3FF" stroke="${wallColor}" stroke-width="1.5"/>`;
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#sky-${propId})" opacity="0.5"/>`;
    // 3 vertical mullions
    svg += `<line x1="${winX + winW/3}" y1="${winY}" x2="${winX + winW/3}" y2="${winY + winH}" stroke="${wallColor}" stroke-width="1.2"/>`;
    svg += `<line x1="${winX + 2*winW/3}" y1="${winY}" x2="${winX + 2*winW/3}" y2="${winY + winH}" stroke="${wallColor}" stroke-width="1.2"/>`;
    // Horizontal sash split
    svg += `<line x1="${winX}" y1="${winY + winH/2}" x2="${winX + winW}" y2="${winY + winH/2}" stroke="${wallColor}" stroke-width="2"/>`;
    // Pediment above
    svg += `<polygon points="${winX - 4},${winY} ${winX + winW + 4},${winY} ${winX + winW/2},${winY - 8}" fill="${wallColor}" opacity="0.6"/>`;
    // Lower sill
    svg += `<rect x="${winX - 3}" y="${winY + winH}" width="${winW + 6}" height="4" fill="${wallColor}" opacity="0.7"/>`;
  } else if (style === 'victorian') {
    // Bay-window arched top
    svg += `<path d="M ${winX} ${winY + winH * 0.2}
                    Q ${winX} ${winY} ${winX + winW * 0.5} ${winY}
                    Q ${winX + winW} ${winY} ${winX + winW} ${winY + winH * 0.2}
                    L ${winX + winW} ${winY + winH}
                    L ${winX} ${winY + winH} Z"
            fill="#B8E3FF" stroke="${wallColor}" stroke-width="1.5"/>`;
    svg += `<path d="M ${winX} ${winY + winH * 0.2}
                    Q ${winX} ${winY} ${winX + winW * 0.5} ${winY}
                    Q ${winX + winW} ${winY} ${winX + winW} ${winY + winH * 0.2}
                    L ${winX + winW} ${winY + winH}
                    L ${winX} ${winY + winH} Z"
            fill="url(#sky-${propId})" opacity="0.5"/>`;
    // Center mullion
    svg += `<line x1="${winX + winW/2}" y1="${winY + 4}" x2="${winX + winW/2}" y2="${winY + winH}" stroke="${wallColor}" stroke-width="1.2"/>`;
    // Decorative top-arc
    svg += `<path d="M ${winX} ${winY + winH * 0.2} Q ${winX + winW/2} ${winY - 5} ${winX + winW} ${winY + winH * 0.2}" stroke="${wallColor}" stroke-width="1.5" fill="none"/>`;
    // Bay sill
    svg += `<rect x="${winX - 4}" y="${winY + winH}" width="${winW + 8}" height="5" fill="${wallColor}" opacity="0.7"/>`;
  } else if (style === 'edwardian') {
    // Mullioned with smaller panes
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="#B8E3FF" stroke="${wallColor}" stroke-width="1.5"/>`;
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#sky-${propId})" opacity="0.5"/>`;
    // 2 vertical mullions, 2 horizontal
    for (let v = 1; v < 3; v++) svg += `<line x1="${winX + v*winW/3}" y1="${winY}" x2="${winX + v*winW/3}" y2="${winY + winH}" stroke="${wallColor}" stroke-width="1.2"/>`;
    for (let h = 1; h < 3; h++) svg += `<line x1="${winX}" y1="${winY + h*winH/3}" x2="${winX + winW}" y2="${winY + h*winH/3}" stroke="${wallColor}" stroke-width="1"/>`;
    // Tudor-style timber strip
    svg += `<rect x="${winX - 2}" y="${winY - 6}" width="${winW + 4}" height="4" fill="#5C3010"/>`;
    svg += `<rect x="${winX - 2}" y="${winY + winH + 1}" width="${winW + 4}" height="4" fill="#5C3010"/>`;
  } else { // modern
    // Plate glass — minimal mullions
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="#B8E3FF" stroke="${wallColor}" stroke-width="1.5"/>`;
    svg += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="url(#sky-${propId})" opacity="0.5"/>`;
    // Single horizontal divider near top
    svg += `<line x1="${winX}" y1="${winY + winH * 0.15}" x2="${winX + winW}" y2="${winY + winH * 0.15}" stroke="${wallColor}" stroke-width="0.8" opacity="0.5"/>`;
    // Steel frame accent bottom
    svg += `<rect x="${winX}" y="${winY + winH}" width="${winW}" height="3" fill="#3a3a3a" opacity="0.6"/>`;
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

    // Floor strip
    svg += `<rect x="${rx}" y="${baseY - 6}" width="${roomW}" height="6" fill="${wallColor}" opacity="0.4"/>`;

    // Back wall (the "inside" of the room — front-facing cross-section view)
    svg += `<rect x="${rx}" y="${ry}" width="${roomW}" height="${roomH}" fill="${floorColor}" opacity="0.85"/>`;

    // Subtle wall texture
    svg += `<line x1="${rx}" y1="${ry + roomH * 0.7}" x2="${rx + roomW}" y2="${ry + roomH * 0.7}" stroke="${wallColor}" stroke-width="0.5" opacity="0.2"/>`;

    // Outline frame
    svg += `<rect x="${rx}" y="${ry}" width="${roomW}" height="${roomH}" fill="none" stroke="${wallColor}" stroke-width="1.5" opacity="0.5"/>`;

    // Window in back wall — STYLED per architectural style
    const winW = roomW * 0.45;
    const winH = roomH * 0.4;
    const winX = rx + (roomW - winW) / 2;
    const winY = ry + roomH * 0.18;
    const propStyle = (typeof PROP_STYLES !== 'undefined' && PROP_STYLES[propId]) || 'modern';
    svg += renderStyledWindow(winX, winY, winW, winH, wallColor, propId, propStyle);

    // Skirting board
    svg += `<rect x="${rx}" y="${baseY - 12}" width="${roomW}" height="3" fill="${wallColor}" opacity="0.6"/>`;

    // Items in this room
    const itemsForRoom = getUpgradesForRoom(propId, owned, i, numRooms);
    const roomBox = { x: rx, y: ry, w: roomW, h: roomH, baseY, propId };
    itemsForRoom.forEach((upg, idx) => {
      svg += renderItemInRoom(upg, roomBox, idx, itemsForRoom.length);
    });

    // STARTER FURNITURE — every room gets baseline furniture so it looks lived-in
    // even when no upgrades have been bought. Rooms without an "upgrade item" still
    // show as a real, furnished interior.
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
function renderStarterFurniture(room, kind, propId){
  const { x, y, w, h, baseY } = room;
  const fl = baseY - 6; // floor line
  let s = '';
  // Rough "shabby" tone for low-tier props, refined for high-tier
  const tier = propId; // 1..6
  const baseTone = tier <= 2 ? '#8B6F47' : tier <= 4 ? '#A8845D' : '#C0986A';
  const fabricTone = tier <= 2 ? '#6B7280' : tier <= 4 ? '#5B7BA3' : '#4A5F8C';
  const shabby = tier <= 2; // crooked frames, peeling paint

  if (kind === 'studio' || kind === 'living') {
    // Sofa
    const sofaW = w * 0.45;
    const sofaX = x + (w - sofaW) / 2;
    const sofaY = fl - 28;
    s += `<rect x="${sofaX}" y="${sofaY}" width="${sofaW}" height="22" rx="3" fill="${fabricTone}"/>`;
    s += `<rect x="${sofaX - 4}" y="${sofaY - 4}" width="6" height="26" rx="2" fill="${fabricTone}" opacity="0.85"/>`;
    s += `<rect x="${sofaX + sofaW - 2}" y="${sofaY - 4}" width="6" height="26" rx="2" fill="${fabricTone}" opacity="0.85"/>`;
    s += `<rect x="${sofaX + 4}" y="${sofaY - 6}" width="${sofaW * 0.4}" height="6" rx="1.5" fill="${fabricTone}" opacity="0.9"/>`;
    s += `<rect x="${sofaX + sofaW * 0.55}" y="${sofaY - 6}" width="${sofaW * 0.4}" height="6" rx="1.5" fill="${fabricTone}" opacity="0.9"/>`;
    // Coffee table
    const tblY = fl - 8;
    s += `<rect x="${sofaX + 6}" y="${tblY}" width="${sofaW - 12}" height="4" fill="${baseTone}"/>`;
    s += `<rect x="${sofaX + 8}" y="${tblY + 4}" width="2" height="4" fill="${baseTone}"/>`;
    s += `<rect x="${sofaX + sofaW - 12}" y="${tblY + 4}" width="2" height="4" fill="${baseTone}"/>`;
    // Lamp
    const lampX = x + 8;
    s += `<rect x="${lampX + 1}" y="${fl - 32}" width="2" height="24" fill="${baseTone}"/>`;
    s += `<polygon points="${lampX - 4},${fl - 32} ${lampX + 8},${fl - 32} ${lampX + 5},${fl - 40} ${lampX - 1},${fl - 40}" fill="#F5D89C" opacity="0.85"/>`;
    // Wall picture
    s += `<rect x="${x + w - 22}" y="${y + h * 0.65}" width="14" height="10" fill="#fff" stroke="${baseTone}" stroke-width="0.8"${shabby ? ' transform="rotate(-3 ' + (x + w - 15) + ' ' + (y + h * 0.7) + ')"' : ''}/>`;
    s += `<rect x="${x + w - 21}" y="${y + h * 0.65 + 1}" width="12" height="6" fill="${fabricTone}" opacity="0.6"${shabby ? ' transform="rotate(-3 ' + (x + w - 15) + ' ' + (y + h * 0.7) + ')"' : ''}/>`;
    if (kind === 'studio') {
      // Bed in studio
      const bedW = w * 0.35;
      const bedX = x + 6;
      const bedY = fl - 14;
      s += `<rect x="${bedX}" y="${bedY}" width="${bedW}" height="10" fill="${baseTone}"/>`;
      s += `<rect x="${bedX}" y="${bedY - 4}" width="${bedW}" height="5" fill="#F5F5F0"/>`;
      s += `<rect x="${bedX + 2}" y="${bedY - 7}" width="${bedW * 0.4}" height="4" rx="1" fill="#fff"/>`;
    }
  }
  else if (kind === 'bedroom') {
    // Big bed centered
    const bedW = w * 0.55;
    const bedX = x + (w - bedW) / 2;
    const bedY = fl - 16;
    s += `<rect x="${bedX}" y="${bedY}" width="${bedW}" height="14" rx="2" fill="${baseTone}"/>`;
    // Mattress
    s += `<rect x="${bedX + 1}" y="${bedY - 8}" width="${bedW - 2}" height="9" fill="#F5F5F0"/>`;
    // Headboard
    s += `<rect x="${bedX - 3}" y="${bedY - 22}" width="${bedW + 6}" height="14" rx="2" fill="${baseTone}" opacity="0.9"/>`;
    // Pillows
    s += `<rect x="${bedX + 4}" y="${bedY - 11}" width="${bedW * 0.35}" height="6" rx="2" fill="#fff"/>`;
    s += `<rect x="${bedX + bedW * 0.55}" y="${bedY - 11}" width="${bedW * 0.35}" height="6" rx="2" fill="#fff"/>`;
    // Duvet line
    s += `<rect x="${bedX}" y="${bedY + 2}" width="${bedW}" height="2" fill="${fabricTone}" opacity="0.5"/>`;
    // Bedside table & lamp
    s += `<rect x="${bedX - 14}" y="${fl - 12}" width="10" height="12" fill="${baseTone}"/>`;
    s += `<circle cx="${bedX - 9}" cy="${fl - 18}" r="3" fill="#F5D89C" opacity="0.85"/>`;
    // Wardrobe on right
    s += `<rect x="${x + w - 22}" y="${fl - 38}" width="18" height="38" fill="${baseTone}" opacity="0.85"/>`;
    s += `<line x1="${x + w - 13}" y1="${fl - 38}" x2="${x + w - 13}" y2="${fl}" stroke="#3D2817" stroke-width="0.8"/>`;
    s += `<circle cx="${x + w - 15}" cy="${fl - 18}" r="0.8" fill="#3D2817"/>`;
    s += `<circle cx="${x + w - 11}" cy="${fl - 18}" r="0.8" fill="#3D2817"/>`;
  }
  else if (kind === 'kitchen') {
    // Kitchen counter run along floor
    const counterY = fl - 18;
    s += `<rect x="${x + 4}" y="${counterY}" width="${w - 8}" height="18" fill="${baseTone}" opacity="0.85"/>`;
    s += `<rect x="${x + 4}" y="${counterY}" width="${w - 8}" height="3" fill="#D8D4CA"/>`;
    // Cabinet doors
    const doorW = (w - 12) / 3;
    for (let d = 0; d < 3; d++) {
      const dx = x + 6 + d * doorW;
      s += `<rect x="${dx}" y="${counterY + 4}" width="${doorW - 2}" height="13" fill="${baseTone}" stroke="#3D2817" stroke-width="0.6"/>`;
      s += `<circle cx="${dx + doorW - 4}" cy="${counterY + 10}" r="0.8" fill="#3D2817"/>`;
    }
    // Sink
    s += `<rect x="${x + w/2 - 8}" y="${counterY - 1}" width="16" height="5" rx="1" fill="#5C7080"/>`;
    s += `<rect x="${x + w/2 - 1}" y="${counterY - 5}" width="2" height="4" fill="#A0A0A8"/>`;
    s += `<circle cx="${x + w/2}" cy="${counterY - 5}" r="1.5" fill="#A0A0A8"/>`;
    // Fridge
    s += `<rect x="${x + 6}" y="${fl - 38}" width="14" height="38" fill="#E8E4D8" stroke="${baseTone}" stroke-width="0.8"/>`;
    s += `<line x1="${x + 6}" y1="${fl - 25}" x2="${x + 20}" y2="${fl - 25}" stroke="${baseTone}" stroke-width="0.8"/>`;
    s += `<rect x="${x + 17}" y="${fl - 32}" width="2" height="3" fill="${baseTone}"/>`;
    s += `<rect x="${x + 17}" y="${fl - 18}" width="2" height="3" fill="${baseTone}"/>`;
    // Hob/cooker
    s += `<rect x="${x + w - 22}" y="${counterY - 2}" width="18" height="6" fill="#3D2817"/>`;
    s += `<circle cx="${x + w - 18}" cy="${counterY + 1}" r="1.2" fill="#5C5C5C"/>`;
    s += `<circle cx="${x + w - 8}" cy="${counterY + 1}" r="1.2" fill="#5C5C5C"/>`;
    // Wall tile pattern
    if (!shabby) {
      for (let tx = 0; tx < 4; tx++) {
        s += `<line x1="${x + 4 + tx * (w - 8) / 3}" y1="${y + h * 0.4}" x2="${x + 4 + tx * (w - 8) / 3}" y2="${counterY}" stroke="${baseTone}" stroke-width="0.4" opacity="0.3"/>`;
      }
    }
  }
  else if (kind === 'bathroom') {
    // Tub
    s += `<rect x="${x + 4}" y="${fl - 12}" width="${w * 0.5}" height="12" rx="2" fill="#F5F5F0" stroke="${baseTone}" stroke-width="0.8"/>`;
    s += `<rect x="${x + 6}" y="${fl - 10}" width="${w * 0.5 - 4}" height="8" rx="1" fill="#D8E4ED"/>`;
    // Toilet
    const tx = x + w * 0.6;
    s += `<rect x="${tx}" y="${fl - 16}" width="10" height="6" rx="1" fill="#fff" stroke="${baseTone}" stroke-width="0.6"/>`;
    s += `<ellipse cx="${tx + 5}" cy="${fl - 6}" rx="6" ry="3" fill="#fff" stroke="${baseTone}" stroke-width="0.6"/>`;
    s += `<rect x="${tx + 4}" y="${fl - 9}" width="2" height="3" fill="${baseTone}"/>`;
    // Sink
    s += `<rect x="${x + w - 18}" y="${fl - 22}" width="14" height="3" fill="${baseTone}"/>`;
    s += `<ellipse cx="${x + w - 11}" cy="${fl - 19}" rx="6" ry="3" fill="#fff" stroke="${baseTone}" stroke-width="0.6"/>`;
    s += `<rect x="${x + w - 12}" y="${fl - 26}" width="1.5" height="4" fill="#A0A0A8"/>`;
    // Mirror
    s += `<rect x="${x + w - 18}" y="${y + h * 0.3}" width="14" height="14" fill="#B8E3FF" stroke="${baseTone}" stroke-width="0.8"/>`;
  }
  else if (kind === 'outdoor') {
    // Garden / terrace — depends on tier
    if (tier >= 4) {
      // Terrace tiles
      for (let tx = 0; tx < 4; tx++) {
        s += `<rect x="${x + 6 + tx * (w - 12) / 4}" y="${fl - 4}" width="${(w - 12) / 4 - 1}" height="4" fill="${baseTone}" opacity="0.5"/>`;
      }
      // Chair & table
      s += `<rect x="${x + w * 0.2}" y="${fl - 16}" width="3" height="16" fill="${baseTone}"/>`;
      s += `<rect x="${x + w * 0.18}" y="${fl - 22}" width="7" height="6" fill="${baseTone}"/>`;
      s += `<circle cx="${x + w * 0.65}" cy="${fl - 14}" r="6" fill="${baseTone}"/>`;
      s += `<rect x="${x + w * 0.65 - 1}" y="${fl - 10}" width="2" height="10" fill="${baseTone}"/>`;
      // Plant
      s += `<rect x="${x + w - 18}" y="${fl - 6}" width="10" height="6" fill="${baseTone}"/>`;
      s += `<ellipse cx="${x + w - 13}" cy="${fl - 12}" rx="7" ry="9" fill="#5C7A2E"/>`;
      s += `<ellipse cx="${x + w - 16}" cy="${fl - 14}" rx="3" ry="4" fill="#7CAA4E"/>`;
    } else {
      // Simple garden — grass + tree
      s += `<rect x="${x + 4}" y="${fl - 4}" width="${w - 8}" height="4" fill="#5C7A2E" opacity="0.6"/>`;
      // Grass tufts
      for (let g = 0; g < 5; g++) {
        const gx = x + 8 + g * (w - 16) / 4;
        s += `<path d="M ${gx} ${fl - 4} L ${gx + 1} ${fl - 8} L ${gx + 2} ${fl - 4}" fill="#7CAA4E"/>`;
      }
      // Tree
      s += `<rect x="${x + w - 18}" y="${fl - 22}" width="3" height="22" fill="${baseTone}"/>`;
      s += `<circle cx="${x + w - 16}" cy="${fl - 26}" r="11" fill="#5C7A2E"/>`;
      s += `<circle cx="${x + w - 20}" cy="${fl - 30}" r="6" fill="#7CAA4E" opacity="0.85"/>`;
      // Flowerpot
      s += `<rect x="${x + 8}" y="${fl - 8}" width="8" height="8" fill="${baseTone}"/>`;
      s += `<circle cx="${x + 12}" cy="${fl - 11}" r="3" fill="#E91E63"/>`;
    }
  }

  // Shabby details for low tiers — peeling paint, cracks
  if (shabby) {
    s += `<path d="M ${x + w * 0.2} ${y + 4} Q ${x + w * 0.25} ${y + h * 0.15} ${x + w * 0.22} ${y + h * 0.3}" fill="none" stroke="#3D2817" stroke-width="0.5" opacity="0.4"/>`;
    s += `<path d="M ${x + w * 0.7} ${y + h * 0.5} L ${x + w * 0.72} ${y + h * 0.55} L ${x + w * 0.69} ${y + h * 0.6}" fill="none" stroke="#3D2817" stroke-width="0.4" opacity="0.35"/>`;
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
