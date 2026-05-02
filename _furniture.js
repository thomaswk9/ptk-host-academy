// ─── FURNITURE SPRITE LIBRARY ─────────────────────────────────────────────────
// Each furniture item has:
//   id         — unique key, referenced in layouts and shop
//   name       — display name
//   category   — for the shop (sofa, bed, kitchen, bathroom, decor, lighting)
//   footprint  — [w, h] in tiles (1 tile = 1m). Wall items use [w, 0]
//   price      — cost in £ (for the IKEA-style catalogue)
//   tier       — minimum property tier this is appropriate for (1-6)
//   wall       — boolean, true if this hangs on a wall (no floor footprint)
//   render     — function(ctx) drawing the sprite at its tile origin in iso space
//
// Iso projection: 1 tile = TILE_W=64 wide × TILE_H=32 tall in screen space.
// Each sprite draws relative to its top-left iso anchor point.
// =============================================================================

const TILE_W = 64;
const TILE_H = 32;

// Iso transform: gridX, gridZ → screen x, y (relative to grid origin)
function isoXY(gx, gz) {
  return { x: (gx - gz) * TILE_W / 2, y: (gx + gz) * TILE_H / 2 };
}

// =============================================================================
// SPRITE HELPERS (drawing primitives in iso space)
// =============================================================================
// All "draw…" helpers accept an SVG-string accumulator and return appended SVG.

// Iso box: given footprint {w, h, height} draws a 3D-looking rectangular box
// with top, left, right faces. Origin (0,0) is the iso anchor (back corner).
function isoBox(x, y, w, h, height, colorTop, colorLeft, colorRight) {
  // Convert footprint tiles → screen coordinates of all 8 corners
  const top = [
    [x,                          y                            ],  // back
    [x + w * TILE_W / 2,         y + w * TILE_H / 2           ],  // right
    [x + (w - h) * TILE_W / 2,   y + (w + h) * TILE_H / 2     ],  // front
    [x - h * TILE_W / 2,         y + h * TILE_H / 2           ],  // left
  ];
  const lift = height * 32;  // 32 px per metre of height
  const topL = top.map(p => [p[0], p[1] - lift]);
  let svg = '';
  // Right face
  svg += `<polygon points="${top[1][0]},${top[1][1]} ${top[2][0]},${top[2][1]} ${topL[2][0]},${topL[2][1]} ${topL[1][0]},${topL[1][1]}" fill="${colorRight}"/>`;
  // Left face
  svg += `<polygon points="${top[3][0]},${top[3][1]} ${top[2][0]},${top[2][1]} ${topL[2][0]},${topL[2][1]} ${topL[3][0]},${topL[3][1]}" fill="${colorLeft}"/>`;
  // Top face
  svg += `<polygon points="${topL[0][0]},${topL[0][1]} ${topL[1][0]},${topL[1][1]} ${topL[2][0]},${topL[2][1]} ${topL[3][0]},${topL[3][1]}" fill="${colorTop}"/>`;
  return svg;
}

// Iso flat tile (floor decoration)
function isoTile(x, y, w, h, color, opacity = 1) {
  const pts = [
    [x, y],
    [x + w * TILE_W / 2, y + w * TILE_H / 2],
    [x + (w - h) * TILE_W / 2, y + (w + h) * TILE_H / 2],
    [x - h * TILE_W / 2, y + h * TILE_H / 2],
  ];
  return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}" opacity="${opacity}"/>`;
}

// Vertical line on iso surface (for wall items)
function isoWallRect(x, y, w, h, color) {
  // Simplified vertical rect at iso position (used for posters/TVs on walls)
  const pts = [
    [x, y],
    [x + w * TILE_W / 2, y + w * TILE_H / 2],
    [x + w * TILE_W / 2, y + w * TILE_H / 2 - h * 32],
    [x, y - h * 32],
  ];
  return `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}"/>`;
}

// =============================================================================
// FURNITURE CATALOGUE
// =============================================================================
// Each `render(x, y, rot)` returns an SVG string drawing the furniture at iso
// position (x, y), rotated by `rot` (0 / 90 / 180 / 270). For most items rot
// just swaps which face is drawn first.
// =============================================================================

const FURNITURE = {

  // ─────────── SOFAS ───────────
  sofa_blue_saggy: {
    id: 'sofa_blue_saggy', name: 'Saggy blue sofa', category: 'sofa',
    footprint: [2, 1], price: 80, tier: 1, emoji: '🛋️',
    desc: 'Faded fabric, cushions sag, smells faintly of takeaway.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = '';
      // Base
      s += isoBox(x, y, fw, fh, 0.4, '#7a90a8', '#3e556a', '#5a7090');
      // Backrest along back edge
      const bkw = fw, bkh = 0.2;
      s += isoBox(x, y, bkw, bkh, 0.85, '#8aa0b8', '#4a6080', '#5a7090');
      // Cushions
      const cushColor = '#6a82a0';
      s += isoTile(x + 12, y + 6 - 25, 0.6, 0.4, cushColor);
      return s;
    }
  },

  sofa_3seat_cream: {
    id: 'sofa_3seat_cream', name: '3-seat cream sofa', category: 'sofa',
    footprint: [3, 1], price: 850, tier: 3, emoji: '🛋️',
    desc: 'Linen-look. Feather-filled. Looks expensive; isn\'t.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 3 : 1;
      const fh = (rot % 180 === 0) ? 1 : 3;
      let s = '';
      s += isoBox(x, y, fw, fh, 0.45, '#e8dcc4', '#a89878', '#c8b89a');
      s += isoBox(x, y, fw, 0.2, 0.85, '#f0e6d0', '#a89878', '#d4c4a8');
      // Cushion seams
      for (let i = 1; i < (rot % 180 === 0 ? 3 : 3); i++) {
        const cx = (rot % 180 === 0) ? x + (i * TILE_W / 2) : x;
        const cy = (rot % 180 === 0) ? y + (i * TILE_H / 2) : y + (i * TILE_H / 2);
        s += `<line x1="${cx}" y1="${cy - 30}" x2="${cx + (rot % 180 === 0 ? -16 : 16)}" y2="${cy - 22}" stroke="#a89878" stroke-width="0.6" opacity="0.5"/>`;
      }
      return s;
    }
  },

  // ─────────── BEDS ───────────
  bed_single: {
    id: 'bed_single', name: 'Single bed', category: 'bed',
    footprint: [1, 2], price: 120, tier: 1, emoji: '🛏️',
    desc: 'Ikea Malm frame. Mattress is fine.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 1 : 2;
      const fh = (rot % 180 === 0) ? 2 : 1;
      let s = '';
      s += isoBox(x, y, fw, fh, 0.4, '#7a5a38', '#5a3e22', '#6a4828');
      s += isoTile(x + 2, y + 1 - 12, fw - 0.1, fh - 0.1, '#e8dcc0');  // mattress top
      s += isoTile(x + 4, y + 2 - 12, fw - 0.2, fh - 0.4, '#4a6080', 0.9);  // duvet
      // Pillow
      s += isoTile(x + 4, y + 2 - 14, fw - 0.3, 0.3, '#fafaf0');
      return s;
    }
  },

  bed_double: {
    id: 'bed_double', name: 'Double bed', category: 'bed',
    footprint: [2, 2], price: 250, tier: 1, emoji: '🛏️',
    desc: 'Decent double. Frame might creak.',
    render: (x, y, rot) => {
      let s = '';
      s += isoBox(x, y, 2, 2, 0.4, '#7a5a38', '#5a3e22', '#6a4828');
      s += isoTile(x + 2, y + 1 - 12, 1.9, 1.9, '#e8dcc0');
      s += isoTile(x + 4, y + 4 - 12, 1.8, 1.6, '#4a6080', 0.92);
      // Two pillows
      s += isoTile(x + 4, y + 2 - 14, 0.8, 0.4, '#fafaf0');
      s += isoTile(x + 30, y + 16 - 14, 0.8, 0.4, '#fafaf0');
      return s;
    }
  },

  bed_king: {
    id: 'bed_king', name: 'King bed', category: 'bed',
    footprint: [3, 2], price: 600, tier: 3, emoji: '🛏️',
    desc: 'Hotel-grade. 400-thread cotton.',
    render: (x, y, rot) => {
      let s = '';
      s += isoBox(x, y, 3, 2, 0.4, '#5a4030', '#3a2818', '#4a3020');
      s += isoTile(x + 2, y + 1 - 12, 2.9, 1.9, '#fafaf6');
      s += isoTile(x + 4, y + 4 - 12, 2.8, 1.6, '#3a4858', 0.95);
      // Throw at the foot
      s += isoTile(x + 70, y + 50 - 13, 2.6, 0.5, '#a05c30', 0.95);
      // Pillows (4)
      for (let i = 0; i < 2; i++) {
        s += isoTile(x + 4 + i * 30, y + 2 + i * 15 - 15, 0.7, 0.4, '#fafaf6');
      }
      // Headboard (vertical)
      s += isoBox(x, y, 3, 0.15, 1.0, '#5a4030', '#3a2818', '#4a3020');
      return s;
    }
  },

  // ─────────── TABLES ───────────
  coffee_table_lack: {
    id: 'coffee_table_lack', name: 'Ikea Lack table', category: 'table',
    footprint: [1, 1], price: 30, tier: 1, emoji: '🪑',
    desc: 'White laminate. Iconic.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 1, 1, 0.4, '#fafafa', '#cccccc', '#e0e0e0');
      // Magazine
      s += isoTile(x, y - 16, 0.6, 0.4, '#c04040');
      return s;
    }
  },

  coffee_table_oak: {
    id: 'coffee_table_oak', name: 'Oak coffee table', category: 'table',
    footprint: [1, 1], price: 280, tier: 3, emoji: '🪑',
    desc: 'Solid oak. Visible grain.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 1, 1, 0.4, '#a07852', '#5a3e22', '#7a5a38');
      s += isoTile(x, y - 16, 0.5, 0.3, '#3a2818');
      return s;
    }
  },

  coffee_table_marble: {
    id: 'coffee_table_marble', name: 'Marble coffee table', category: 'table',
    footprint: [1, 1], price: 1200, tier: 4, emoji: '🪑',
    desc: 'Carrara marble. Brass legs.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 1, 1, 0.45, '#e8e4dc', '#b8b4a8', '#d8d4c8');
      // Marble veins
      s += `<line x1="${x + 6}" y1="${y - 16}" x2="${x + 18}" y2="${y - 8}" stroke="#888" stroke-width="0.4" opacity="0.4"/>`;
      return s;
    }
  },

  coffee_table_industrial: {
    id: 'coffee_table_industrial', name: 'Industrial coffee table', category: 'table',
    footprint: [1, 1], price: 180, tier: 2, emoji: '🪑',
    desc: 'Reclaimed wood, steel frame.',
    render: (x, y, rot) => {
      return isoBox(x, y, 1, 1, 0.4, '#7a5a38', '#3a2818', '#5a3e22');
    }
  },

  dining_table_8: {
    id: 'dining_table_8', name: 'Dining table (8 seater)', category: 'table',
    footprint: [3, 1], price: 950, tier: 3, emoji: '🍽️',
    desc: 'Solid wood. Seats 8.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 3 : 1;
      const fh = (rot % 180 === 0) ? 1 : 3;
      let s = isoBox(x, y, fw, fh, 0.75, '#a07852', '#5a3e22', '#7a5a38');
      return s;
    }
  },

  desk: {
    id: 'desk', name: 'Writing desk', category: 'table',
    footprint: [2, 1], price: 320, tier: 3, emoji: '🪑',
    desc: 'Walnut. Brass handles.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      return isoBox(x, y, fw, fh, 0.75, '#7a5a38', '#3a2818', '#5a3e22');
    }
  },

  // ─────────── KITCHEN ───────────
  kitchen_counter_short: {
    id: 'kitchen_counter_short', name: 'Counter run (2m)', category: 'kitchen',
    footprint: [2, 1], price: 380, tier: 1, emoji: '🍳',
    desc: 'Sage cabinets, laminate top.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 0.85, '#dbcaa6', '#7a8268', '#a8b09a');
      // Hob detail on first half
      s += isoTile(x + 4, y - 28, 0.6, 0.6, '#1a1a1a');
      // Sink on second half
      s += isoTile(x + 32, y + 8 - 28, 0.5, 0.5, '#999');
      return s;
    }
  },

  kitchen_counter_long: {
    id: 'kitchen_counter_long', name: 'Counter run (4m)', category: 'kitchen',
    footprint: [4, 1], price: 920, tier: 2, emoji: '🍳',
    desc: 'Full kitchen run with hob, sink, prep.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 4 : 1;
      const fh = (rot % 180 === 0) ? 1 : 4;
      let s = isoBox(x, y, fw, fh, 0.85, '#e8e0d0', '#5a604a', '#a8b09a');
      // Hob
      s += isoTile(x + 8, y - 28, 0.6, 0.6, '#1a1a1a');
      // Sink
      s += isoTile(x + 70, y + 18 - 28, 0.5, 0.5, '#999');
      return s;
    }
  },

  kitchen_island: {
    id: 'kitchen_island', name: 'Kitchen island', category: 'kitchen',
    footprint: [3, 2], price: 1800, tier: 3, emoji: '🍳',
    desc: 'Marble top, breakfast bar overhang.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 3, 2, 0.92, '#fafaf6', '#7a8268', '#c4ccc8');
      return s;
    }
  },

  fridge_small: {
    id: 'fridge_small', name: 'Under-counter fridge', category: 'kitchen',
    footprint: [1, 1], price: 220, tier: 1, emoji: '🧊',
    desc: 'Beko 50L. Hum is constant.',
    render: (x, y, rot) => {
      return isoBox(x, y, 1, 1, 0.85, '#ece4d2', '#aaa0a0', '#c8c0a8');
    }
  },

  fridge_tall: {
    id: 'fridge_tall', name: 'Tall fridge-freezer', category: 'kitchen',
    footprint: [1, 1], price: 720, tier: 2, emoji: '🧊',
    desc: 'Stainless steel. Ice maker.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 1, 1, 1.85, '#cccccc', '#7a7a7a', '#a8a8a8');
      s += `<line x1="${x + 6}" y1="${y - 50}" x2="${x + 6}" y2="${y - 4}" stroke="#888" stroke-width="0.4" opacity="0.7"/>`;
      return s;
    }
  },

  // ─────────── BATHROOM ───────────
  toilet_basic: {
    id: 'toilet_basic', name: 'Toilet', category: 'bathroom',
    footprint: [1, 1], price: 180, tier: 1, emoji: '🚽',
    desc: 'It works.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 0.7, 0.7, 0.4, '#fafaf6', '#dcd4c0', '#e8e0d0');
      // Tank
      s += isoBox(x + 4, y + 2, 0.6, 0.2, 0.85, '#fafaf6', '#dcd4c0', '#e8e0d0');
      return s;
    }
  },

  toilet_designer: {
    id: 'toilet_designer', name: 'Wall-hung toilet', category: 'bathroom',
    footprint: [1, 1], price: 850, tier: 4, emoji: '🚽',
    desc: 'Duravit. Looks like art.',
    render: (x, y, rot) => {
      return isoBox(x, y, 0.7, 0.7, 0.45, '#fafaf6', '#dcd4c0', '#e8e0d0');
    }
  },

  bathtub: {
    id: 'bathtub', name: 'Standard bathtub', category: 'bathroom',
    footprint: [2, 1], price: 380, tier: 2, emoji: '🛁',
    desc: 'Standard rectangular bath.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 0.5, '#dcd6c8', '#aaa498', '#c8c2b6');
      s += isoTile(x + 2, y + 1 - 18, fw - 0.15, fh - 0.15, '#fafaf6');
      return s;
    }
  },

  bathtub_clawfoot: {
    id: 'bathtub_clawfoot', name: 'Clawfoot bathtub', category: 'bathroom',
    footprint: [2, 1], price: 1450, tier: 3, emoji: '🛁',
    desc: 'Cast iron. Roll-top.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 0.55, '#fafaf6', '#bcb0a0', '#dcd4c0');
      s += isoTile(x + 2, y + 1 - 19, fw - 0.15, fh - 0.15, '#fafaf6');
      // Tiny brass feet
      s += `<circle cx="${x + 2}" cy="${y + 16}" r="1.5" fill="#b89668"/>`;
      s += `<circle cx="${x + 50}" cy="${y + 40}" r="1.5" fill="#b89668"/>`;
      return s;
    }
  },

  bathtub_freestanding: {
    id: 'bathtub_freestanding', name: 'Freestanding bath', category: 'bathroom',
    footprint: [2, 1], price: 2400, tier: 4, emoji: '🛁',
    desc: 'Sculpted resin. Looks like a Calatrava.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 0.6, '#fafaf6', '#dcd6c8', '#eae6dc');
      return s;
    }
  },

  shower_basic: {
    id: 'shower_basic', name: 'Shower stall', category: 'bathroom',
    footprint: [1, 1], price: 280, tier: 1, emoji: '🚿',
    desc: 'Plastic curtain. Adequate.',
    render: (x, y, rot) => {
      let s = isoTile(x, y, 1, 1, '#a8a8a8');
      // Vertical glass/curtain edge hint
      s += `<rect x="${x - 16}" y="${y - 50}" width="2" height="50" fill="#888" opacity="0.4"/>`;
      return s;
    }
  },

  sink_pedestal: {
    id: 'sink_pedestal', name: 'Pedestal sink', category: 'bathroom',
    footprint: [1, 1], price: 140, tier: 1, emoji: '🚰',
    desc: 'Old-style ceramic.',
    render: (x, y, rot) => {
      let s = isoBox(x + 6, y + 6, 0.5, 0.5, 0.85, '#fafaf6', '#dcd4c0', '#e8e0d0');
      return s;
    }
  },

  sink_vanity: {
    id: 'sink_vanity', name: 'Vanity unit', category: 'bathroom',
    footprint: [2, 1], price: 720, tier: 3, emoji: '🚰',
    desc: 'Walnut, marble top.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      return isoBox(x, y, fw, fh, 0.85, '#e8e4dc', '#5a3e22', '#7a5a38');
    }
  },

  // ─────────── STORAGE ───────────
  chest_drawers: {
    id: 'chest_drawers', name: 'Chest of drawers', category: 'storage',
    footprint: [1, 1], price: 95, tier: 1, emoji: '🗄️',
    desc: 'Ikea Malm. White or oak.',
    render: (x, y, rot) => {
      let s = isoBox(x, y, 1, 1, 0.85, '#c8b89a', '#7a6850', '#9a8868');
      // Drawer lines
      s += `<line x1="${x + 4}" y1="${y - 16}" x2="${x + 28}" y2="${y - 4}" stroke="#7a6850" stroke-width="0.4" opacity="0.6"/>`;
      s += `<line x1="${x + 4}" y1="${y - 24}" x2="${x + 28}" y2="${y - 12}" stroke="#7a6850" stroke-width="0.4" opacity="0.6"/>`;
      return s;
    }
  },

  wardrobe: {
    id: 'wardrobe', name: 'Wardrobe', category: 'storage',
    footprint: [2, 1], price: 380, tier: 2, emoji: '🗄️',
    desc: 'Sliding doors. Mirrored.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      return isoBox(x, y, fw, fh, 2.1, '#c8b89a', '#7a6850', '#9a8868');
    }
  },

  // ─────────── DECOR / WALL ───────────
  wall_print: {
    id: 'wall_print', name: 'Ikea print', category: 'decor',
    footprint: [1, 0], price: 25, tier: 1, emoji: '🖼️', wall: true,
    desc: 'Generic abstract poster, black frame.',
    render: (x, y, rot) => {
      return `<rect x="${x - 10}" y="${y - 70}" width="20" height="14" fill="#c88860" stroke="#1a1a1a" stroke-width="1"/>`;
    }
  },

  art_gallery: {
    id: 'art_gallery', name: 'Statement artwork', category: 'decor',
    footprint: [2, 0], price: 850, tier: 3, emoji: '🖼️', wall: true,
    desc: 'Original oil. Investment grade.',
    render: (x, y, rot) => {
      return `<rect x="${x - 14}" y="${y - 80}" width="36" height="22" fill="#3a4a6a" stroke="#c4985a" stroke-width="1.5"/>`;
    }
  },

  tv_wall: {
    id: 'tv_wall', name: '65" Smart TV', category: 'decor',
    footprint: [1, 0], price: 500, tier: 2, emoji: '📺', wall: true,
    desc: 'Wall-mounted OLED.',
    render: (x, y, rot) => {
      return `<rect x="${x - 18}" y="${y - 76}" width="40" height="22" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="1"/>`;
    }
  },

  tv_console: {
    id: 'tv_console', name: 'TV on console', category: 'decor',
    footprint: [2, 1], price: 600, tier: 2, emoji: '📺',
    desc: 'TV unit + media console.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 0.45, '#3a2818', '#1a0a05', '#2a1810');
      // TV on top
      s += isoTile(x + 2, y + 1 - 60, fw - 0.2, 0.05, '#0a0a0a');
      return s;
    }
  },

  // ─────────── LIGHTING ───────────
  bare_bulb: {
    id: 'bare_bulb', name: 'Bare bulb', category: 'lighting',
    footprint: [1, 1], price: 8, tier: 1, emoji: '💡', wall: true,
    desc: 'Hanging on a wire. Tells a story.',
    render: (x, y, rot) => {
      return `<line x1="${x}" y1="${y - 100}" x2="${x}" y2="${y - 35}" stroke="#1a1a1a" stroke-width="0.8"/>
              <circle cx="${x}" cy="${y - 30}" r="6" fill="#fff5b0"/>
              <circle cx="${x}" cy="${y - 30}" r="14" fill="#ffe388" opacity="0.25"/>`;
    }
  },

  pendant_edison: {
    id: 'pendant_edison', name: 'Edison pendant', category: 'lighting',
    footprint: [1, 1], price: 80, tier: 2, emoji: '💡', wall: true,
    desc: 'Vintage filament bulb. Cliché but warm.',
    render: (x, y, rot) => {
      return `<line x1="${x}" y1="${y - 100}" x2="${x}" y2="${y - 30}" stroke="#1a1a1a" stroke-width="1"/>
              <ellipse cx="${x}" cy="${y - 24}" rx="6" ry="9" fill="#ffd068" opacity="0.95"/>
              <ellipse cx="${x}" cy="${y - 24}" rx="16" ry="22" fill="#ffe388" opacity="0.2"/>`;
    }
  },

  chandelier: {
    id: 'chandelier', name: 'Crystal chandelier', category: 'lighting',
    footprint: [1, 1], price: 1800, tier: 5, emoji: '✨', wall: true,
    desc: 'Murano crystal. Wired for dimming.',
    render: (x, y, rot) => {
      let s = `<line x1="${x}" y1="${y - 110}" x2="${x}" y2="${y - 55}" stroke="#5a4030" stroke-width="0.8"/>`;
      s += `<ellipse cx="${x}" cy="${y - 50}" rx="22" ry="6" fill="#b89668" opacity="0.9"/>`;
      // Crystals
      for (let i = -2; i <= 2; i++) {
        s += `<polygon points="${x + i*8 - 2},${y - 48} ${x + i*8 + 2},${y - 48} ${x + i*8},${y - 38}" fill="#fafaf6" opacity="0.85"/>`;
      }
      // Glow
      s += `<ellipse cx="${x}" cy="${y - 45}" rx="35" ry="20" fill="#ffe388" opacity="0.18"/>`;
      return s;
    }
  },

  floor_lamp: {
    id: 'floor_lamp', name: 'Floor lamp', category: 'lighting',
    footprint: [1, 1], price: 60, tier: 1, emoji: '💡',
    desc: 'Tripod, fabric shade.',
    render: (x, y, rot) => {
      let s = `<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y - 60}" stroke="#1a1a1a" stroke-width="1.5"/>`;
      s += `<polygon points="${x - 10},${y - 60} ${x + 10},${y - 60} ${x + 14},${y - 80} ${x - 14},${y - 80}" fill="#eee2d0"/>`;
      return s;
    }
  },

  // ─────────── ATMOSPHERE / OBJECTS ───────────
  old_boiler: {
    id: 'old_boiler', name: 'Old combi boiler', category: 'misc',
    footprint: [1, 1], price: 0, tier: 1, emoji: '🔥', wall: true,
    desc: 'Rattles. Pilot light yellowed.',
    render: (x, y, rot) => {
      return `<rect x="${x - 6}" y="${y - 60}" width="14" height="22" fill="#fafaf6" stroke="#7a7a78" stroke-width="0.6"/>
              <circle cx="${x - 2}" cy="${y - 45}" r="1.2" fill="#f0a838"/>
              <line x1="${x + 4}" y1="${y - 38}" x2="${x + 4}" y2="${y - 14}" stroke="#b87a48" stroke-width="1.5"/>`;
    }
  },

  fireplace: {
    id: 'fireplace', name: 'Marble fireplace', category: 'misc',
    footprint: [2, 1], price: 1400, tier: 4, emoji: '🔥', wall: true,
    desc: 'Period feature. Working.',
    render: (x, y, rot) => {
      let s = `<rect x="${x - 22}" y="${y - 80}" width="48" height="48" fill="#fafaf6" stroke="#aaa498" stroke-width="1"/>`;
      s += `<rect x="${x - 14}" y="${y - 60}" width="32" height="24" fill="#1a1a1a"/>`;
      s += `<ellipse cx="${x + 2}" cy="${y - 42}" rx="8" ry="6" fill="#ff7028" opacity="0.85"/>`;
      return s;
    }
  },

  piano: {
    id: 'piano', name: 'Upright piano', category: 'misc',
    footprint: [2, 1], price: 2200, tier: 5, emoji: '🎹',
    desc: 'Steinway upright. Tuned.',
    render: (x, y, rot) => {
      const fw = (rot % 180 === 0) ? 2 : 1;
      const fh = (rot % 180 === 0) ? 1 : 2;
      let s = isoBox(x, y, fw, fh, 1.2, '#1a1a1a', '#0a0a0a', '#2a2a2a');
      // Keys
      s += isoTile(x + 2, y + 1 - 38, fw - 0.2, 0.15, '#fafaf6');
      return s;
    }
  },

  wine_bottle_empty: {
    id: 'wine_bottle_empty', name: 'Empty wine bottle', category: 'misc',
    footprint: [1, 1], price: 0, tier: 1, emoji: '🍾',
    desc: 'On the floor. Lazy host vibe.',
    render: (x, y, rot) => {
      return `<ellipse cx="${x + 4}" cy="${y - 4}" rx="8" ry="2.5" fill="#2a3a2a" transform="rotate(${rot} ${x} ${y})"/>`;
    }
  },

  plant_small: {
    id: 'plant_small', name: 'Small plant', category: 'decor',
    footprint: [1, 1], price: 18, tier: 1, emoji: '🪴',
    desc: 'Snake plant. Hard to kill.',
    render: (x, y, rot) => {
      let s = `<polygon points="${x - 6},${y - 4} ${x + 6},${y - 4} ${x + 4},${y - 14} ${x - 4},${y - 14}" fill="#c8a878"/>`;
      // Leaves
      s += `<ellipse cx="${x}" cy="${y - 22}" rx="8" ry="4" fill="#5a8048"/>`;
      s += `<ellipse cx="${x - 3}" cy="${y - 28}" rx="5" ry="3" fill="#7aa060"/>`;
      s += `<ellipse cx="${x + 3}" cy="${y - 28}" rx="5" ry="3" fill="#7aa060"/>`;
      return s;
    }
  },

  plant_large: {
    id: 'plant_large', name: 'Fiddle leaf fig', category: 'decor',
    footprint: [1, 1], price: 95, tier: 2, emoji: '🪴',
    desc: 'Statement piece. Demanding.',
    render: (x, y, rot) => {
      let s = `<polygon points="${x - 8},${y - 4} ${x + 8},${y - 4} ${x + 6},${y - 18} ${x - 6},${y - 18}" fill="#a08068"/>`;
      // Big leaves
      for (let i = 0; i < 5; i++) {
        const lx = x + (i - 2) * 4;
        const ly = y - 30 - i * 4;
        s += `<ellipse cx="${lx}" cy="${ly}" rx="9" ry="6" fill="#3d6b3d"/>`;
      }
      return s;
    }
  },
};

// =============================================================================
// CATALOGUE QUERIES (for the IKEA-style shop)
// =============================================================================
function furnitureByCategory(cat) {
  return Object.values(FURNITURE).filter(f => f.category === cat);
}

function furnitureCategories() {
  return ['sofa', 'bed', 'table', 'kitchen', 'bathroom', 'storage', 'decor', 'lighting', 'misc'];
}

function furnitureForTier(tier) {
  return Object.values(FURNITURE).filter(f => f.tier <= tier);
}

function getFurnitureFootprint(id, rot = 0) {
  const f = FURNITURE[id];
  if (!f) return [1, 1];
  const [w, h] = f.footprint;
  return (rot % 180 === 0) ? [w, h] : [h, w];
}
