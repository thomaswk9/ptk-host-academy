// ─── LAYOUTS ─────────────────────────────────────────────────────────────────
// Each property has a default layout that defines:
//   - grid dimensions (apartment size in metres, 1 tile = 1m)
//   - rooms (rectangles with type + floor + wall colour)
//   - interior walls (line segments between tiles)
//   - windows + doors
//   - atmospheric damage (peeling paint, damp, cracks, cobwebs, stains)
//   - starter furniture (auto-placed; player can move/remove)
//
// The Room Editor (in test mode) lets you visually edit any of these. When you
// save in the editor, the result is stored in localStorage as a CUSTOM layout
// override for that property. Original defaults stay intact in this file.
// =============================================================================

const FLOOR_TYPES = {
  oak:        { color: '#a07852', label: 'Oak', roughness: 0.7 },
  oak_worn:   { color: '#8a6a48', label: 'Oak (worn)', roughness: 0.85 },
  parquet:    { color: '#9a7548', label: 'Parquet', stripe: true },
  tile_white: { color: '#dcd6c8', label: 'White tile', grout: true },
  tile_grey:  { color: '#a8a8a8', label: 'Grey tile', grout: true },
  marble:     { color: '#e8e4dc', label: 'Marble', veins: true },
  carpet_beige:{ color: '#c0a888', label: 'Beige carpet' },
  carpet_grey:{ color: '#888888', label: 'Grey carpet' },
  concrete:   { color: '#6a6a6a', label: 'Polished concrete' },
};

const WALL_TYPES = {
  paint_cream:  { color: '#f0e8d8', label: 'Cream' },
  paint_white:  { color: '#fafaf6', label: 'White' },
  paint_pink:   { color: '#e8a890', label: 'Dusty pink' },
  paint_olive:  { color: '#7a8265', label: 'Olive' },
  paint_navy:   { color: '#2c4858', label: 'Navy' },
  paint_sage:   { color: '#a8b09a', label: 'Sage' },
  paint_terra:  { color: '#c47858', label: 'Terracotta' },
  paint_black:  { color: '#1a1a1a', label: 'Charcoal' },
  brick:        { color: '#8a4a3a', label: 'Exposed brick', pattern: true },
  panelled:     { color: '#e8dcc4', label: 'Wood panelled', vertical: true },
  tile_subway:  { color: '#fafaf6', label: 'Subway tile', pattern: true },
};

// Wide colour palette for the editor (60 colours organized by hue)
const COLOR_PALETTE = [
  // Warm whites
  '#fafaf6', '#f4ead4', '#f0e8d8', '#ece4d2', '#e8dcc4', '#dcd0b8',
  // Cool whites
  '#f0f4f8', '#e8eef4', '#dce4ec', '#c8d4e0',
  // Pinks
  '#fde8e8', '#f8c8d0', '#e8a8b0', '#e87a90', '#c45878', '#a04060',
  // Reds
  '#f0c0c0', '#e88080', '#c84040', '#a02020', '#5a1830', '#3a0820',
  // Oranges
  '#fce0a8', '#f8b878', '#f08c40', '#c46428', '#8a4818', '#5a3010',
  // Yellows
  '#fff5b0', '#ffe388', '#f5d050', '#c4985a', '#8a7028', '#5a4818',
  // Greens
  '#d8e8c8', '#a8c478', '#7aa050', '#4a8030', '#2a5818', '#1a3810',
  // Sage / muted greens
  '#c4d4b0', '#a8b89a', '#88a078', '#7a8265', '#5a604a', '#3a4030',
  // Teals
  '#a8d4d4', '#5aa8a8', '#2a7878', '#1a4848', '#0a2828',
  // Blues
  '#c0d8e8', '#80b0d4', '#4080b0', '#205080', '#102850', '#081830',
  // Navy / charcoal
  '#3a4a5a', '#2c4858', '#1a2840', '#0a1428', '#1a1a1a', '#000000',
  // Purples
  '#e8c8e0', '#b888c4', '#8a4898', '#5a2070', '#380040',
  // Browns / wood tones
  '#dcc098', '#b89668', '#8a6a48', '#5a3e22', '#3a2818', '#1f1408',
  // Greys
  '#e0e0e0', '#a8a8a8', '#707070', '#3a3a3a',
];

// Pest types for the damage system
const PEST_TYPES = ['rats', 'cockroaches', 'ants', 'bedbugs', 'flies', 'spiders', 'mice', 'silverfish'];

// Damage / atmospheric flair types (for editor "Add Damage" panel)
const DAMAGE_TYPES = {
  paintPeel:    { label: 'Peeling paint',  emoji: '🩹' },
  dampPatch:    { label: 'Damp stain',     emoji: '💧' },
  crackedWindow:{ label: 'Cracked window', emoji: '💥' },
  cobwebs:      { label: 'Cobwebs',        emoji: '🕸️' },
  floorStain:   { label: 'Floor stain',    emoji: '🟫' },
  cigaretteBurn:{ label: 'Cig burn',       emoji: '🔥' },
  wallCrack:    { label: 'Wall crack',     emoji: '⚡' },
  mould:        { label: 'Mould patch',    emoji: '🦠' },
  graffiti:     { label: 'Graffiti',       emoji: '✏️' },
  brokenLight:  { label: 'Broken bulb',    emoji: '💡' },
};

// =============================================================================
// DEFAULT LAYOUTS — one per property tier
// =============================================================================

// Helper: every layout shares the same shape; this validates and fills defaults
function makeLayout(spec) {
  return {
    id: spec.id,
    name: spec.name || 'Unnamed',
    tier: spec.tier || 1,
    description: spec.description || '',
    gridW: spec.gridW || 6,
    gridH: spec.gridH || 5,
    ceilingHeight: spec.ceilingHeight || 2.5,
    rooms: spec.rooms || [],
    walls: spec.walls || [],
    windows: spec.windows || [],
    doors: spec.doors || [],
    damage: spec.damage || {},
    pests: spec.pests || [],
    starterFurniture: spec.starterFurniture || [],
    bgColor: spec.bgColor || '#FFF8EE',
  };
}

// ─── 1: NOTTING HILL STUDIO (grubby, ground floor, ~28m²) ─────
const LAYOUT_NOTTING_STUDIO = makeLayout({
  id: 'notting_studio',
  name: 'Notting Hill Studio',
  tier: 1,
  description: 'A grubby ground-floor flat behind Portobello Road.',
  gridW: 11,
  gridH: 9,
  ceilingHeight: 2.4,
  bgColor: '#FFF8EE',
  rooms: [
    // Whole flat as living, then bathroom carved out
    { id: 'living', x: 0, z: 0, w: 11, h: 9, type: 'living',
      floor: 'parquet', wall: 'paint_cream' },
    { id: 'bathroom', x: 0, z: 0, w: 4, h: 4, type: 'bathroom',
      floor: 'tile_white', wall: 'paint_white' }
  ],
  walls: [
    { x1: 4, z1: 0, x2: 4, z2: 4 },  // bathroom east
    { x1: 0, z1: 4, x2: 4, z2: 4 }   // bathroom south
  ],
  windows: [
    { wall: 'south', start: 4, length: 3, sill: 0.9, height: 1.4, style: 'sash' }
  ],
  doors: [
    { wall: 'east', start: 5, width: 1, type: 'front' },
    { x1: 3, z1: 4, x2: 4, z2: 4, type: 'interior' }
  ],
  damage: {
    paintPeel: [{ x: 1, z: 0, side: 'north' }, { x: 8, z: 0, side: 'north' }],
    dampPatch: [{ x: 5, z: 0, side: 'north' }],
    crackedWindow: [{ wall: 'south', start: 4 }],
    floorStain: [{ x: 4, z: 5 }, { x: 6, z: 7 }],
    cobwebs: [{ x: 0, z: 0, corner: 'NW' }, { x: 10, z: 0, corner: 'NE' }]
  },
  pests: [],   // no infestation by default; complaints can spawn
  starterFurniture: [
    { id: 'sofa_blue_saggy', gridX: 5, gridZ: 6, rot: 0 },
    { id: 'coffee_table_lack', gridX: 6, gridZ: 5, rot: 0 },
    { id: 'bed_double',      gridX: 8, gridZ: 1, rot: 0 },
    { id: 'chest_drawers',   gridX: 6, gridZ: 1, rot: 0 },
    { id: 'kitchen_counter_short', gridX: 9, gridZ: 4, rot: 90 },
    { id: 'kitchen_counter_short', gridX: 9, gridZ: 6, rot: 90 },
    { id: 'fridge_small',    gridX: 9, gridZ: 8, rot: 90 },
    { id: 'old_boiler',      gridX: 10, gridZ: 4, rot: 90 },
    { id: 'toilet_basic',    gridX: 0, gridZ: 1, rot: 90 },
    { id: 'sink_pedestal',   gridX: 2, gridZ: 0, rot: 0 },
    { id: 'shower_basic',    gridX: 0, gridZ: 3, rot: 90 },
    { id: 'bare_bulb',       gridX: 5, gridZ: 5, rot: 0 },
    { id: 'wall_print',      gridX: 6, gridZ: 0, rot: 0 },
    { id: 'wine_bottle_empty', gridX: 4, gridZ: 8, rot: 45 }
  ]
});

// ─── 2: SHOREDITCH LOFT (industrial, ~45m²) ─────
const LAYOUT_SHOREDITCH_LOFT = makeLayout({
  id: 'shoreditch_loft',
  name: 'Shoreditch Loft',
  tier: 2,
  description: 'Converted warehouse with exposed brick.',
  gridW: 9,
  gridH: 7,
  ceilingHeight: 3.2,
  bgColor: '#F4ECE0',
  rooms: [
    { id: 'living', x: 0, z: 0, w: 9, h: 7, type: 'living',
      floor: 'concrete', wall: 'brick' },
    { id: 'bedroom', x: 6, z: 0, w: 3, h: 3, type: 'bedroom',
      floor: 'oak', wall: 'paint_cream' },
    { id: 'bathroom', x: 0, z: 0, w: 2, h: 3, type: 'bathroom',
      floor: 'tile_grey', wall: 'tile_subway' }
  ],
  walls: [
    { x1: 6, z1: 0, x2: 6, z2: 3 },
    { x1: 6, z1: 3, x2: 9, z2: 3 },
    { x1: 2, z1: 0, x2: 2, z2: 3 },
    { x1: 0, z1: 3, x2: 2, z2: 3 }
  ],
  windows: [
    { wall: 'south', start: 1, length: 3, sill: 0.4, height: 2.0, style: 'industrial' },
    { wall: 'south', start: 5, length: 3, sill: 0.4, height: 2.0, style: 'industrial' },
    { wall: 'east', start: 1, length: 1, sill: 1.0, height: 1.2, style: 'industrial' }
  ],
  doors: [
    { wall: 'west', start: 4, width: 1, type: 'front' },
    { x1: 1, z1: 3, x2: 2, z2: 3, type: 'interior' },
    { x1: 6, z1: 2, x2: 6, z2: 3, type: 'interior' }
  ],
  damage: {
    paintPeel: [{ x: 4, z: 0, side: 'north' }],
    floorStain: [{ x: 5, z: 4 }],
    graffiti: [{ x: 0, z: 4, side: 'west' }]
  },
  pests: [],
  starterFurniture: [
    { id: 'sofa_3seat_cream', gridX: 2, gridZ: 4, rot: 0 },
    { id: 'coffee_table_industrial', gridX: 3, gridZ: 5, rot: 0 },
    { id: 'kitchen_counter_long', gridX: 5, gridZ: 6, rot: 0 },
    { id: 'fridge_tall', gridX: 8, gridZ: 5, rot: 0 },
    { id: 'bed_double', gridX: 7, gridZ: 1, rot: 0 },
    { id: 'wardrobe', gridX: 6, gridZ: 2, rot: 90 },
    { id: 'toilet_basic', gridX: 1, gridZ: 1, rot: 0 },
    { id: 'bathtub', gridX: 0, gridZ: 1, rot: 90 },
    { id: 'pendant_edison', gridX: 4, gridZ: 4, rot: 0 }
  ]
});

// ─── 3: CHELSEA TOWNHOUSE (refined, ~75m²) ─────
const LAYOUT_CHELSEA_TOWNHOUSE = makeLayout({
  id: 'chelsea_townhouse',
  name: 'Chelsea Townhouse',
  tier: 3,
  description: 'Victorian terraced townhouse, refined finish.',
  gridW: 10,
  gridH: 8,
  ceilingHeight: 2.8,
  bgColor: '#F4F0E8',
  rooms: [
    { id: 'living', x: 0, z: 4, w: 10, h: 4, type: 'living',
      floor: 'oak', wall: 'paint_cream' },
    { id: 'kitchen', x: 6, z: 0, w: 4, h: 4, type: 'kitchen',
      floor: 'tile_white', wall: 'panelled' },
    { id: 'bedroom', x: 0, z: 0, w: 4, h: 4, type: 'bedroom',
      floor: 'oak', wall: 'paint_navy' },
    { id: 'bathroom', x: 4, z: 0, w: 2, h: 4, type: 'bathroom',
      floor: 'marble', wall: 'tile_subway' }
  ],
  walls: [
    { x1: 0, z1: 4, x2: 4, z2: 4 },
    { x1: 6, z1: 4, x2: 10, z2: 4 },
    { x1: 4, z1: 0, x2: 4, z2: 4 },
    { x1: 6, z1: 0, x2: 6, z2: 4 }
  ],
  windows: [
    { wall: 'south', start: 1, length: 2, sill: 0.9, height: 1.6, style: 'sash' },
    { wall: 'south', start: 6, length: 2, sill: 0.9, height: 1.6, style: 'sash' },
    { wall: 'north', start: 1, length: 2, sill: 0.9, height: 1.4, style: 'sash' },
    { wall: 'north', start: 7, length: 2, sill: 0.9, height: 1.4, style: 'sash' }
  ],
  doors: [
    { wall: 'south', start: 4, width: 1, type: 'front' },
    { x1: 4, z1: 4, x2: 6, z2: 4, type: 'interior' },
    { x1: 4, z1: 1, x2: 4, z2: 2, type: 'interior' },
    { x1: 6, z1: 1, x2: 6, z2: 2, type: 'interior' }
  ],
  damage: {},
  pests: [],
  starterFurniture: [
    { id: 'sofa_3seat_cream', gridX: 2, gridZ: 5, rot: 0 },
    { id: 'sofa_3seat_cream', gridX: 5, gridZ: 5, rot: 0 },
    { id: 'coffee_table_oak', gridX: 4, gridZ: 6, rot: 0 },
    { id: 'tv_console', gridX: 8, gridZ: 6, rot: 90 },
    { id: 'bed_king', gridX: 1, gridZ: 1, rot: 0 },
    { id: 'wardrobe', gridX: 0, gridZ: 3, rot: 0 },
    { id: 'kitchen_counter_long', gridX: 6, gridZ: 0, rot: 0 },
    { id: 'kitchen_island', gridX: 7, gridZ: 2, rot: 0 },
    { id: 'fridge_tall', gridX: 9, gridZ: 0, rot: 0 },
    { id: 'bathtub_clawfoot', gridX: 4, gridZ: 1, rot: 0 },
    { id: 'toilet_basic', gridX: 5, gridZ: 0, rot: 90 },
    { id: 'sink_pedestal', gridX: 4, gridZ: 3, rot: 90 }
  ]
});

// ─── 4: MAYFAIR PENTHOUSE (modern luxury, ~120m²) ─────
const LAYOUT_MAYFAIR_PENTHOUSE = makeLayout({
  id: 'mayfair_penthouse',
  name: 'Mayfair Penthouse',
  tier: 4,
  description: 'Modern lateral penthouse with Hyde Park views.',
  gridW: 12,
  gridH: 9,
  ceilingHeight: 3.0,
  bgColor: '#F8F2E8',
  rooms: [
    { id: 'living', x: 0, z: 4, w: 12, h: 5, type: 'living',
      floor: 'marble', wall: 'paint_white' },
    { id: 'kitchen', x: 8, z: 0, w: 4, h: 4, type: 'kitchen',
      floor: 'marble', wall: 'paint_white' },
    { id: 'master', x: 0, z: 0, w: 5, h: 4, type: 'bedroom',
      floor: 'oak', wall: 'paint_terra' },
    { id: 'bathroom', x: 5, z: 0, w: 3, h: 4, type: 'bathroom',
      floor: 'marble', wall: 'tile_subway' }
  ],
  walls: [
    { x1: 0, z1: 4, x2: 5, z2: 4 },
    { x1: 5, z1: 4, x2: 8, z2: 4 },
    { x1: 8, z1: 4, x2: 12, z2: 4 },
    { x1: 5, z1: 0, x2: 5, z2: 4 },
    { x1: 8, z1: 0, x2: 8, z2: 4 }
  ],
  windows: [
    { wall: 'south', start: 0, length: 4, sill: 0.3, height: 2.4, style: 'modern' },
    { wall: 'south', start: 5, length: 3, sill: 0.3, height: 2.4, style: 'modern' },
    { wall: 'south', start: 9, length: 3, sill: 0.3, height: 2.4, style: 'modern' },
    { wall: 'north', start: 0, length: 4, sill: 0.6, height: 1.8, style: 'modern' },
    { wall: 'north', start: 9, length: 3, sill: 0.6, height: 1.8, style: 'modern' }
  ],
  doors: [
    { wall: 'east', start: 4, width: 1, type: 'front' },
    { x1: 5, z1: 1, x2: 5, z2: 2, type: 'interior' },
    { x1: 8, z1: 2, x2: 8, z2: 3, type: 'interior' }
  ],
  damage: {},
  pests: [],
  starterFurniture: [
    { id: 'sofa_3seat_cream', gridX: 2, gridZ: 5, rot: 0 },
    { id: 'sofa_3seat_cream', gridX: 6, gridZ: 5, rot: 0 },
    { id: 'coffee_table_marble', gridX: 4, gridZ: 6, rot: 0 },
    { id: 'tv_wall', gridX: 0, gridZ: 6, rot: 90 },
    { id: 'dining_table_8', gridX: 9, gridZ: 5, rot: 0 },
    { id: 'kitchen_island', gridX: 9, gridZ: 1, rot: 0 },
    { id: 'kitchen_counter_long', gridX: 8, gridZ: 0, rot: 0 },
    { id: 'fridge_tall', gridX: 11, gridZ: 0, rot: 0 },
    { id: 'bed_king', gridX: 1, gridZ: 1, rot: 0 },
    { id: 'wardrobe', gridX: 4, gridZ: 0, rot: 0 },
    { id: 'bathtub_freestanding', gridX: 5, gridZ: 1, rot: 0 },
    { id: 'toilet_designer', gridX: 7, gridZ: 0, rot: 90 },
    { id: 'sink_vanity', gridX: 5, gridZ: 3, rot: 0 }
  ]
});

// ─── 5: KENSINGTON MANSION (grand Regency, ~200m²) ─────
const LAYOUT_KENSINGTON_MANSION = makeLayout({
  id: 'kensington_mansion',
  name: 'Kensington Mansion',
  tier: 5,
  description: 'Grade II listed Regency mansion.',
  gridW: 14,
  gridH: 10,
  ceilingHeight: 3.6,
  bgColor: '#F4EDE0',
  rooms: [
    { id: 'foyer', x: 6, z: 4, w: 2, h: 2, type: 'hallway',
      floor: 'marble', wall: 'paint_cream' },
    { id: 'living', x: 0, z: 4, w: 6, h: 6, type: 'living',
      floor: 'parquet', wall: 'paint_cream' },
    { id: 'dining', x: 8, z: 4, w: 6, h: 6, type: 'living',
      floor: 'parquet', wall: 'paint_olive' },
    { id: 'kitchen', x: 9, z: 0, w: 5, h: 4, type: 'kitchen',
      floor: 'tile_white', wall: 'panelled' },
    { id: 'master', x: 0, z: 0, w: 5, h: 4, type: 'bedroom',
      floor: 'oak', wall: 'paint_navy' },
    { id: 'bathroom', x: 5, z: 0, w: 4, h: 4, type: 'bathroom',
      floor: 'marble', wall: 'tile_subway' }
  ],
  walls: [
    { x1: 0, z1: 4, x2: 6, z2: 4 },
    { x1: 8, z1: 4, x2: 14, z2: 4 },
    { x1: 6, z1: 4, x2: 6, z2: 6 },
    { x1: 8, z1: 4, x2: 8, z2: 6 },
    { x1: 5, z1: 0, x2: 5, z2: 4 },
    { x1: 9, z1: 0, x2: 9, z2: 4 }
  ],
  windows: [
    { wall: 'south', start: 1, length: 2, sill: 0.6, height: 2.2, style: 'sash' },
    { wall: 'south', start: 5, length: 2, sill: 0.6, height: 2.2, style: 'sash' },
    { wall: 'south', start: 9, length: 2, sill: 0.6, height: 2.2, style: 'sash' },
    { wall: 'south', start: 12, length: 2, sill: 0.6, height: 2.2, style: 'sash' },
    { wall: 'north', start: 1, length: 2, sill: 0.9, height: 1.6, style: 'sash' },
    { wall: 'north', start: 11, length: 2, sill: 0.9, height: 1.6, style: 'sash' }
  ],
  doors: [
    { wall: 'south', start: 6, width: 2, type: 'front' },
    { x1: 6, z1: 4, x2: 6, z2: 5, type: 'interior' },
    { x1: 8, z1: 4, x2: 8, z2: 5, type: 'interior' },
    { x1: 5, z1: 2, x2: 5, z2: 3, type: 'interior' },
    { x1: 9, z1: 2, x2: 9, z2: 3, type: 'interior' }
  ],
  damage: {},
  pests: [],
  starterFurniture: [
    { id: 'sofa_3seat_cream', gridX: 1, gridZ: 6, rot: 0 },
    { id: 'sofa_3seat_cream', gridX: 1, gridZ: 8, rot: 180 },
    { id: 'coffee_table_oak', gridX: 2, gridZ: 7, rot: 0 },
    { id: 'piano', gridX: 4, gridZ: 5, rot: 90 },
    { id: 'fireplace', gridX: 0, gridZ: 5, rot: 270 },
    { id: 'dining_table_8', gridX: 10, gridZ: 6, rot: 0 },
    { id: 'chandelier', gridX: 11, gridZ: 6, rot: 0 },
    { id: 'kitchen_counter_long', gridX: 9, gridZ: 0, rot: 0 },
    { id: 'kitchen_island', gridX: 10, gridZ: 2, rot: 0 },
    { id: 'fridge_tall', gridX: 13, gridZ: 0, rot: 0 },
    { id: 'bed_king', gridX: 1, gridZ: 1, rot: 0 },
    { id: 'wardrobe', gridX: 4, gridZ: 0, rot: 0 },
    { id: 'bathtub_clawfoot', gridX: 5, gridZ: 1, rot: 0 },
    { id: 'toilet_designer', gridX: 8, gridZ: 0, rot: 90 },
    { id: 'sink_vanity', gridX: 5, gridZ: 3, rot: 0 }
  ]
});

// ─── 6: COVENT GARDEN ROYAL PENTHOUSE (apex, ~250m²) ─────
const LAYOUT_COVENT_PENTHOUSE = makeLayout({
  id: 'covent_penthouse',
  name: 'Covent Garden Royal Penthouse',
  tier: 6,
  description: 'Two-storey penthouse above the Royal Opera House.',
  gridW: 15,
  gridH: 11,
  ceilingHeight: 3.8,
  bgColor: '#F8F0E0',
  rooms: [
    { id: 'salon', x: 0, z: 5, w: 9, h: 6, type: 'living',
      floor: 'marble', wall: 'paint_cream' },
    { id: 'dining', x: 9, z: 5, w: 6, h: 6, type: 'living',
      floor: 'marble', wall: 'paint_pink' },
    { id: 'kitchen', x: 10, z: 0, w: 5, h: 5, type: 'kitchen',
      floor: 'marble', wall: 'paint_white' },
    { id: 'master', x: 0, z: 0, w: 5, h: 5, type: 'bedroom',
      floor: 'oak', wall: 'paint_terra' },
    { id: 'master_bath', x: 5, z: 0, w: 3, h: 5, type: 'bathroom',
      floor: 'marble', wall: 'tile_subway' },
    { id: 'study', x: 8, z: 0, w: 2, h: 5, type: 'living',
      floor: 'oak', wall: 'paint_navy' }
  ],
  walls: [
    { x1: 0, z1: 5, x2: 15, z2: 5 },
    { x1: 9, z1: 5, x2: 9, z2: 11 },
    { x1: 5, z1: 0, x2: 5, z2: 5 },
    { x1: 8, z1: 0, x2: 8, z2: 5 },
    { x1: 10, z1: 0, x2: 10, z2: 5 }
  ],
  windows: [
    { wall: 'south', start: 1, length: 3, sill: 0.3, height: 2.8, style: 'modern' },
    { wall: 'south', start: 5, length: 3, sill: 0.3, height: 2.8, style: 'modern' },
    { wall: 'south', start: 10, length: 4, sill: 0.3, height: 2.8, style: 'modern' },
    { wall: 'north', start: 1, length: 3, sill: 0.6, height: 2.0, style: 'sash' },
    { wall: 'north', start: 11, length: 3, sill: 0.6, height: 2.0, style: 'modern' }
  ],
  doors: [
    { wall: 'east', start: 5, width: 1, type: 'front' },
    { x1: 5, z1: 2, x2: 5, z2: 3, type: 'interior' },
    { x1: 8, z1: 2, x2: 8, z2: 3, type: 'interior' },
    { x1: 9, z1: 7, x2: 9, z2: 8, type: 'interior' },
    { x1: 10, z1: 2, x2: 10, z2: 3, type: 'interior' }
  ],
  damage: {},
  pests: [],
  starterFurniture: [
    { id: 'sofa_3seat_cream', gridX: 1, gridZ: 7, rot: 0 },
    { id: 'sofa_3seat_cream', gridX: 5, gridZ: 7, rot: 0 },
    { id: 'coffee_table_marble', gridX: 3, gridZ: 8, rot: 0 },
    { id: 'piano', gridX: 0, gridZ: 9, rot: 90 },
    { id: 'fireplace', gridX: 0, gridZ: 6, rot: 270 },
    { id: 'chandelier', gridX: 4, gridZ: 7, rot: 0 },
    { id: 'dining_table_8', gridX: 11, gridZ: 7, rot: 0 },
    { id: 'chandelier', gridX: 11, gridZ: 7, rot: 0 },
    { id: 'kitchen_counter_long', gridX: 10, gridZ: 0, rot: 0 },
    { id: 'kitchen_island', gridX: 11, gridZ: 2, rot: 0 },
    { id: 'fridge_tall', gridX: 14, gridZ: 0, rot: 0 },
    { id: 'bed_king', gridX: 1, gridZ: 1, rot: 0 },
    { id: 'wardrobe', gridX: 4, gridZ: 0, rot: 0 },
    { id: 'bathtub_freestanding', gridX: 5, gridZ: 1, rot: 0 },
    { id: 'toilet_designer', gridX: 7, gridZ: 0, rot: 90 },
    { id: 'sink_vanity', gridX: 6, gridZ: 3, rot: 0 },
    { id: 'desk', gridX: 8, gridZ: 1, rot: 0 }
  ]
});

// ─── 7: TEST SANDBOX (blank canvas with one of each room) ─────
const LAYOUT_TEST_SANDBOX = makeLayout({
  id: 'test_sandbox',
  name: 'Test Sandbox',
  tier: 1,
  description: 'Empty space for testing the editor.',
  gridW: 10,
  gridH: 8,
  ceilingHeight: 2.6,
  bgColor: '#FFF0E0',
  rooms: [
    { id: 'main', x: 0, z: 0, w: 10, h: 8, type: 'living',
      floor: 'oak', wall: 'paint_cream' }
  ],
  walls: [],
  windows: [
    { wall: 'south', start: 4, length: 2, sill: 0.9, height: 1.4, style: 'sash' }
  ],
  doors: [
    { wall: 'east', start: 3, width: 1, type: 'front' }
  ],
  damage: {},
  pests: [],
  starterFurniture: [
    { id: 'sofa_blue_saggy', gridX: 3, gridZ: 5, rot: 0 },
    { id: 'coffee_table_lack', gridX: 4, gridZ: 4, rot: 0 }
  ]
});

// =============================================================================
// LAYOUT REGISTRY
// =============================================================================
const DEFAULT_LAYOUTS = {
  1: LAYOUT_NOTTING_STUDIO,
  2: LAYOUT_SHOREDITCH_LOFT,
  3: LAYOUT_CHELSEA_TOWNHOUSE,
  4: LAYOUT_MAYFAIR_PENTHOUSE,
  5: LAYOUT_KENSINGTON_MANSION,
  6: LAYOUT_COVENT_PENTHOUSE,
  7: LAYOUT_TEST_SANDBOX
};

// Returns the layout for a property (custom override from localStorage if present)
function getLayout(propId) {
  const saved = loadCustomLayout(propId);
  if (saved) return saved;
  return DEFAULT_LAYOUTS[propId] || LAYOUT_NOTTING_STUDIO;
}

function loadCustomLayout(propId) {
  try {
    const raw = localStorage.getItem('ptk_layout_' + propId);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveCustomLayout(propId, layout) {
  try {
    localStorage.setItem('ptk_layout_' + propId, JSON.stringify(layout));
    return true;
  } catch (e) { return false; }
}

function resetLayoutToDefault(propId) {
  try { localStorage.removeItem('ptk_layout_' + propId); return true; }
  catch (e) { return false; }
}

function exportLayoutJSON(propId) {
  return JSON.stringify(getLayout(propId), null, 2);
}

function importLayoutJSON(propId, jsonStr) {
  try {
    const obj = JSON.parse(jsonStr);
    saveCustomLayout(propId, makeLayout(obj));
    return true;
  } catch (e) { return false; }
}
