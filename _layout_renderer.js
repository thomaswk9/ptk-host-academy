// ─── LAYOUT RENDERER ──────────────────────────────────────────────────────────
// Takes a layout object (from _layouts.js) plus a list of placed furniture and
// renders the apartment as an isometric SVG scene.
//
// Iso projection: 1 tile = TILE_W × TILE_H pixels (defined in _furniture.js).
// Origin (0,0) is screen position (svgCenterX, svgPaddingY).
//
// Returned SVG is layered:
//   1. Background fill
//   2. Floor diamonds (per room)
//   3. Floor decoration (rugs, stains)
//   4. Walls (perimeter + interior)
//   5. Wall decoration (peeling paint, damp, cracks, art)
//   6. Furniture (sorted by depth)
//   7. Pest layer (dynamic — rendered into a separate <g id="pest-layer">)
// =============================================================================

function renderLayoutSVG(layout, opts = {}) {
  const placedFurniture = opts.placedFurniture || layout.starterFurniture || [];
  const showGrid = opts.showGrid || false;
  const editorMode = opts.editorMode || false;
  const highlightTile = opts.highlightTile || null;
  const selectedItemId = opts.selectedItemId || null;

  // ─── Compute scene bounds ─────────────────────────────────────────────
  const W = layout.gridW;
  const H = layout.gridH;
  // Iso bounds: extreme x → at gx=W,gz=0 it's W*TILE_W/2; at gx=0,gz=H it's -H*TILE_W/2
  // y goes from 0 (top) to (W+H)*TILE_H/2
  const sceneW = (W + H) * TILE_W / 2 + 40;
  const sceneH = (W + H) * TILE_H / 2 + 200;  // extra for walls + ceiling
  const originX = H * TILE_W / 2 + 20;
  const originY = 80;

  let svg = `<svg viewBox="0 0 ${sceneW} ${sceneH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;display:block;background:${layout.bgColor || '#FFF8EE'}">`;

  // Inner translate group so we can use grid coords directly
  svg += `<g transform="translate(${originX} ${originY})">`;

  // ─── Floor (per room) ──────────────────────────────────────────────────
  layout.rooms.forEach(room => {
    const floorType = FLOOR_TYPES[room.floor] || FLOOR_TYPES.oak;
    svg += renderRoomFloor(room, floorType);
  });

  // Plank seams on parquet/oak floors
  layout.rooms.forEach(room => {
    const floorType = FLOOR_TYPES[room.floor];
    if (floorType && floorType.stripe) {
      svg += renderFloorStripes(room);
    }
    if (floorType && floorType.grout) {
      svg += renderTileGrout(room);
    }
  });

  // ─── Floor decoration (stains, etc) ───────────────────────────────────
  if (layout.damage && layout.damage.floorStain) {
    layout.damage.floorStain.forEach(({ x, z }) => {
      const { x: sx, y: sy } = isoXY(x + 0.5, z + 0.5);
      svg += `<ellipse cx="${sx}" cy="${sy}" rx="14" ry="6" fill="#3a2618" opacity="0.55"/>`;
    });
  }
  if (layout.damage && layout.damage.cigaretteBurn) {
    layout.damage.cigaretteBurn.forEach(({ x, z }) => {
      const { x: sx, y: sy } = isoXY(x + 0.5, z + 0.5);
      svg += `<circle cx="${sx}" cy="${sy}" r="3" fill="#1a1010" opacity="0.85"/>`;
      svg += `<circle cx="${sx}" cy="${sy}" r="5" fill="#3a2010" opacity="0.4"/>`;
    });
  }

  // ─── Grid overlay (editor mode) ────────────────────────────────────────
  if (showGrid || editorMode) {
    svg += renderGrid(W, H);
  }

  // Highlight tile (cursor/selection in editor)
  if (highlightTile) {
    svg += renderHighlight(highlightTile.x, highlightTile.z, highlightTile.w || 1, highlightTile.h || 1);
  }

  // ─── Walls ─────────────────────────────────────────────────────────────
  // Perimeter walls (auto-generated unless windows/doors cut them)
  svg += renderPerimeterWalls(layout);
  // Interior walls
  layout.walls.forEach(w => {
    svg += renderInteriorWall(w, layout);
  });

  // ─── Wall decoration ──────────────────────────────────────────────────
  if (layout.damage) {
    if (layout.damage.paintPeel) {
      layout.damage.paintPeel.forEach(p => {
        svg += renderPaintPeel(p);
      });
    }
    if (layout.damage.dampPatch) {
      layout.damage.dampPatch.forEach(p => {
        svg += renderDampPatch(p);
      });
    }
    if (layout.damage.wallCrack) {
      layout.damage.wallCrack.forEach(p => {
        svg += renderWallCrack(p);
      });
    }
    if (layout.damage.mould) {
      layout.damage.mould.forEach(p => {
        svg += renderMould(p);
      });
    }
    if (layout.damage.graffiti) {
      layout.damage.graffiti.forEach(p => {
        svg += renderGraffiti(p);
      });
    }
    if (layout.damage.cobwebs) {
      layout.damage.cobwebs.forEach(p => {
        svg += renderCobweb(p);
      });
    }
  }

  // ─── Furniture (sorted by isometric depth) ────────────────────────────
  const sortedFurn = [...placedFurniture].sort((a, b) => {
    const aZ = a.gridX + a.gridZ;
    const bZ = b.gridX + b.gridZ;
    return aZ - bZ;
  });
  sortedFurn.forEach(item => {
    const f = FURNITURE[item.id];
    if (!f) return;
    const { x: sx, y: sy } = isoXY(item.gridX, item.gridZ);
    let g = `<g class="furn-item" data-furn-id="${item.id}" data-grid="${item.gridX},${item.gridZ}">`;
    g += f.render(sx, sy, item.rot || 0);
    g += `</g>`;
    svg += g;
    // Selection ring
    if (selectedItemId && item._key === selectedItemId) {
      const [fw, fh] = getFurnitureFootprint(item.id, item.rot || 0);
      svg += renderHighlight(item.gridX, item.gridZ, fw, fh, '#ff7028');
    }
  });

  // ─── Pest layer placeholder ───────────────────────────────────────────
  svg += `<g id="pest-layer"></g>`;

  svg += `</g></svg>`;
  return svg;
}

// =============================================================================
// HELPERS
// =============================================================================

function renderRoomFloor(room, floorType) {
  const a = isoXY(room.x, room.z);
  const b = isoXY(room.x + room.w, room.z);
  const c = isoXY(room.x + room.w, room.z + room.h);
  const d = isoXY(room.x, room.z + room.h);
  return `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}" fill="${floorType.color}"/>`;
}

function renderFloorStripes(room) {
  let s = '';
  // Plank seams running along the X axis
  for (let z = room.z + 1; z < room.z + room.h; z++) {
    const a = isoXY(room.x, z);
    const b = isoXY(room.x + room.w, z);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#5a4030" stroke-width="0.5" opacity="0.35"/>`;
  }
  return s;
}

function renderTileGrout(room) {
  let s = '';
  for (let x = room.x + 1; x < room.x + room.w; x++) {
    const a = isoXY(x, room.z);
    const b = isoXY(x, room.z + room.h);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#7a7060" stroke-width="0.4" opacity="0.6"/>`;
  }
  for (let z = room.z + 1; z < room.z + room.h; z++) {
    const a = isoXY(room.x, z);
    const b = isoXY(room.x + room.w, z);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#7a7060" stroke-width="0.4" opacity="0.6"/>`;
  }
  return s;
}

function renderGrid(W, H) {
  let s = '<g class="editor-grid" stroke="#000" stroke-width="0.4" opacity="0.18" fill="none">';
  for (let x = 0; x <= W; x++) {
    const a = isoXY(x, 0);
    const b = isoXY(x, H);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  }
  for (let z = 0; z <= H; z++) {
    const a = isoXY(0, z);
    const b = isoXY(W, z);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  }
  s += '</g>';
  return s;
}

function renderHighlight(x, z, w, h, color = '#5ac8e8') {
  const a = isoXY(x, z);
  const b = isoXY(x + w, z);
  const c = isoXY(x + w, z + h);
  const d = isoXY(x, z + h);
  return `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}" fill="${color}" opacity="0.4" stroke="${color}" stroke-width="2"/>`;
}

function renderPerimeterWalls(layout) {
  const W = layout.gridW;
  const H = layout.gridH;
  const ch = (layout.ceilingHeight || 2.5) * 24; // px per metre

  // Get the dominant wall colour (first room's wall type)
  const firstRoom = layout.rooms[0];
  const wallType = (firstRoom && WALL_TYPES[firstRoom.wall]) || WALL_TYPES.paint_cream;
  const wallColor = wallType.color;
  const shadowColor = darken(wallColor, 0.18);

  // Build wall segments accounting for windows + doors
  const segments = {
    north: { wall: 'north', length: W, opens: [] },
    south: { wall: 'south', length: W, opens: [] },
    east: { wall: 'east', length: H, opens: [] },
    west: { wall: 'west', length: H, opens: [] },
  };

  (layout.windows || []).forEach(w => {
    if (segments[w.wall]) segments[w.wall].opens.push({ start: w.start, length: w.length, type: 'window', meta: w });
  });
  (layout.doors || []).forEach(d => {
    if (d.wall && segments[d.wall]) segments[d.wall].opens.push({ start: d.start, length: d.width || 1, type: 'door', meta: d });
  });

  let s = '';
  // North wall (back wall — runs from (0,0) to (W,0)). In iso it goes from
  // top-of-screen-left to top-right (the back of the apartment).
  s += renderWallStrip('north', segments.north, W, H, ch, wallColor, shadowColor);
  // East wall (right side, from (W,0) to (W,H))
  s += renderWallStrip('east', segments.east, W, H, ch, wallColor, shadowColor);
  // South wall (front, removed for camera — only a baseboard hint)
  // West wall (left, similar)
  s += renderWallStrip('south', segments.south, W, H, ch, wallColor, shadowColor);
  s += renderWallStrip('west', segments.west, W, H, ch, wallColor, shadowColor);

  return s;
}

function renderWallStrip(side, segment, W, H, ch, color, shadow) {
  // Each wall is rendered as a parallelogram (top-down view of the wall
  // surface, slanted by iso projection). For visibility we only render the
  // back walls (north + east) at full opacity; front walls (south + west)
  // are made low-opacity / removed entirely so the camera sees inside.

  let s = '';
  // South + West are "in front of" the camera; render skirting only
  if (side === 'south') {
    const a = isoXY(0, H);
    const b = isoXY(W, H);
    // A short skirting indicator at floor level
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${darken(color, 0.4)}" stroke-width="3" opacity="0.7"/>`;
    return s;
  }
  if (side === 'west') {
    const a = isoXY(0, 0);
    const b = isoXY(0, H);
    s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${darken(color, 0.4)}" stroke-width="3" opacity="0.7"/>`;
    return s;
  }

  // North + East: full walls
  let topPts, bottomPts;
  if (side === 'north') {
    // From (0,0) to (W,0). The back face. Top of wall = floor coords lifted by ch.
    const topL = isoXY(0, 0);
    const topR = isoXY(W, 0);
    s += `<polygon points="${topL.x},${topL.y - ch} ${topR.x},${topR.y - ch} ${topR.x},${topR.y} ${topL.x},${topL.y}" fill="${color}"/>`;
    // Window/door openings — overlay sky/dark
    segment.opens.forEach(op => {
      const oL = isoXY(op.start, 0);
      const oR = isoXY(op.start + op.length, 0);
      if (op.type === 'window') {
        const sill = (op.meta.sill || 0.9) * 24;
        const wh = (op.meta.height || 1.2) * 24;
        const yTop = oL.y - sill - wh;
        const yBot = oL.y - sill;
        // Frame
        s += `<polygon points="${oL.x},${yTop} ${oR.x},${yTop} ${oR.x},${yBot} ${oL.x},${yBot}" fill="#2a2520" stroke="${darken(color, 0.3)}" stroke-width="0.5"/>`;
        // Glass
        s += `<polygon points="${oL.x + 1.5},${yTop + 1.5} ${oR.x - 1.5},${yTop + 1.5} ${oR.x - 1.5},${yBot - 1.5} ${oL.x + 1.5},${yBot - 1.5}" fill="#bfd4e8"/>`;
        // Mullion
        const mid = (oL.x + oR.x) / 2;
        s += `<line x1="${mid}" y1="${yTop + 1}" x2="${mid}" y2="${yBot - 1}" stroke="#2a2520" stroke-width="1"/>`;
        s += `<line x1="${oL.x + 1}" y1="${(yTop + yBot) / 2}" x2="${oR.x - 1}" y2="${(yTop + yBot) / 2}" stroke="#2a2520" stroke-width="0.8"/>`;
        // Sill
        s += `<rect x="${oL.x - 2}" y="${yBot}" width="${oR.x - oL.x + 4}" height="3" fill="${darken(color, 0.4)}"/>`;
      } else {
        // Door
        const dh = 2.0 * 24;
        const yTop = oL.y - dh;
        const yBot = oL.y;
        s += `<polygon points="${oL.x},${yTop} ${oR.x},${yTop} ${oR.x},${yBot} ${oL.x},${yBot}" fill="#3a2818"/>`;
        s += `<rect x="${oL.x + 2}" y="${yTop + 4}" width="${oR.x - oL.x - 4}" height="${dh - 8}" fill="#5a3e22"/>`;
        // Knob
        s += `<circle cx="${oR.x - 5}" cy="${yTop + dh / 2}" r="1.2" fill="#c4985a"/>`;
      }
    });
    return s;
  }
  if (side === 'east') {
    const topL = isoXY(W, 0);
    const topR = isoXY(W, H);
    s += `<polygon points="${topL.x},${topL.y - ch} ${topR.x},${topR.y - ch} ${topR.x},${topR.y} ${topL.x},${topL.y}" fill="${shadow}"/>`;
    segment.opens.forEach(op => {
      const oL = isoXY(W, op.start);
      const oR = isoXY(W, op.start + op.length);
      if (op.type === 'window') {
        const sill = (op.meta.sill || 0.9) * 24;
        const wh = (op.meta.height || 1.2) * 24;
        const yTopL = oL.y - sill - wh, yBotL = oL.y - sill;
        const yTopR = oR.y - sill - wh, yBotR = oR.y - sill;
        s += `<polygon points="${oL.x},${yTopL} ${oR.x},${yTopR} ${oR.x},${yBotR} ${oL.x},${yBotL}" fill="#2a2520"/>`;
        s += `<polygon points="${oL.x + 2},${yTopL + 1.5} ${oR.x - 2},${yTopR + 1.5} ${oR.x - 2},${yBotR - 1.5} ${oL.x + 2},${yBotL - 1.5}" fill="#a8c0d4"/>`;
      } else {
        const dh = 2.0 * 24;
        s += `<polygon points="${oL.x},${oL.y - dh} ${oR.x},${oR.y - dh} ${oR.x},${oR.y} ${oL.x},${oL.y}" fill="#3a2818"/>`;
      }
    });
    return s;
  }
  return s;
}

function renderInteriorWall(w, layout) {
  const ch = (layout.ceilingHeight || 2.5) * 16; // shorter than perimeter so we can see in
  const a = isoXY(w.x1, w.z1);
  const b = isoXY(w.x2, w.z2);
  const wallType = WALL_TYPES.paint_cream; // interior walls always cream by default
  // Half-height interior wall: just an iso block from a to b raised by ch
  let s = '';
  // Wall base shadow on floor
  s += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${darken(wallType.color, 0.5)}" stroke-width="3" opacity="0.5"/>`;
  // Vertical face
  s += `<polygon points="${a.x},${a.y - ch} ${b.x},${b.y - ch} ${b.x},${b.y} ${a.x},${a.y}" fill="${wallType.color}" stroke="${darken(wallType.color, 0.3)}" stroke-width="0.6"/>`;
  return s;
}

function renderPaintPeel({ x, z, side }) {
  const { x: sx, y: sy } = isoXY(x + 0.5, z);
  return `<polygon points="${sx - 6},${sy - 35} ${sx + 6},${sy - 32} ${sx + 4},${sy - 18} ${sx - 5},${sy - 22}" fill="#9a8a70" opacity="0.7"/>`;
}

function renderDampPatch({ x, z, side }) {
  const { x: sx, y: sy } = isoXY(x + 0.5, z);
  return `<ellipse cx="${sx}" cy="${sy - 50}" rx="18" ry="9" fill="#9a8060" opacity="0.45"/>
          <ellipse cx="${sx - 3}" cy="${sy - 48}" rx="12" ry="6" fill="#6a4838" opacity="0.4"/>`;
}

function renderWallCrack({ x, z, side }) {
  const { x: sx, y: sy } = isoXY(x + 0.5, z);
  return `<path d="M ${sx},${sy - 60} L ${sx + 4},${sy - 50} L ${sx - 2},${sy - 38} L ${sx + 5},${sy - 24}" stroke="#5a4838" stroke-width="0.9" fill="none" opacity="0.65"/>`;
}

function renderMould({ x, z, side }) {
  const { x: sx, y: sy } = isoXY(x + 0.5, z);
  let s = '';
  for (let i = 0; i < 8; i++) {
    const dx = (Math.random() - 0.5) * 12;
    const dy = (Math.random() - 0.5) * 8;
    s += `<circle cx="${sx + dx}" cy="${sy - 40 + dy}" r="${1 + Math.random() * 2}" fill="#3a4a30" opacity="${0.4 + Math.random() * 0.3}"/>`;
  }
  return s;
}

function renderGraffiti({ x, z, side }) {
  const { x: sx, y: sy } = isoXY(x + 0.5, z);
  return `<text x="${sx - 14}" y="${sy - 40}" font-family="Arial,sans-serif" font-size="16" font-weight="900" font-style="italic" fill="#e8517d" opacity="0.9">SHO</text>`;
}

function renderCobweb({ x, z, corner }) {
  const { x: sx, y: sy } = isoXY(x, z);
  let s = '<g opacity="0.5" stroke="#fff" stroke-width="0.5" fill="none">';
  // Triangular web
  s += `<line x1="${sx}" y1="${sy}" x2="${sx + 10}" y2="${sy + 4}"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx + 4}" y2="${sy + 10}"/>`;
  s += `<line x1="${sx + 10}" y1="${sy + 4}" x2="${sx + 4}" y2="${sy + 10}"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx + 7}" y2="${sy + 7}"/>`;
  s += `<line x1="${sx + 3}" y1="${sy + 2}" x2="${sx + 8}" y2="${sy + 6}"/>`;
  s += `<line x1="${sx + 2}" y1="${sy + 3}" x2="${sx + 6}" y2="${sy + 8}"/>`;
  s += '</g>';
  return s;
}

function darken(hex, amount = 0.2) {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// =============================================================================
// HIT-TESTING — convert screen pixel back to grid tile
// =============================================================================
function screenToTile(screenX, screenY, originX, originY) {
  const dx = screenX - originX;
  const dy = screenY - originY;
  // Inverse iso: gx = (dx/(TILE_W/2) + dy/(TILE_H/2)) / 2
  const gx = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
  const gz = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;
  return { x: Math.floor(gx), z: Math.floor(gz), gxFloat: gx, gzFloat: gz };
}
