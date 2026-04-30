// PTK Host Academy — Customisable 3D Apartment Viewer
// ============================================================================
// A mobile-friendly Three.js viewer that adapts to property tier + upgrades.
//
// Usage:
//   import { Apartment3D } from './apartment3d.js';
//   const v = Apartment3D.mount(containerEl, { tier: 0, upgrades: [], time: 'day' });
//   v.update({ tier: 2, upgrades: ['smart_tv','kitchen_reno','art'] });
//   v.setMode('walk');           // 'orbit' | 'top' | 'walk'
//   v.setTime('evening');        // 'day' | 'evening' | 'night'
//   v.destroy();
//
// Tiers (0–4): Notting Hill / Shoreditch / Chelsea / Mayfair / Kensington
// Upgrade IDs match the game's PROPS[].upgrades[].id values.
// ============================================================================

import * as THREE from './vendor/three.module.min.js';

// --- Tier palettes -----------------------------------------------------------
// Each tier has distinctive walls, accents, and woodtones
const TIER_PALETTES = [
  { // 0 — Notting Hill Studio: pastel, original Victorian features, soft pinks
    wall: 0xf2e8dc, accent: 0xd6c0a8, feature: 0xe1a89a,
    floor: 0xc8a880, sofa: 0xe8d4c0, kitchen: 0xf0ebe2, cabinets: 0x6b8268,
    counterTop: 0xe8e0d0, art1: 0xc78a76, art2: 0x88a89b, art3: 0xe5cba8,
    name: 'Notting Hill Studio',
  },
  { // 1 — Shoreditch Loft: industrial brick, exposed beams, dark/moody
    wall: 0x9a4a3a, accent: 0x2b2620, feature: 0x4a3530,
    floor: 0x6e5238, sofa: 0x6c6862, kitchen: 0x2a2825, cabinets: 0x1c1c1a,
    counterTop: 0x88817a, art1: 0xc89456, art2: 0x4a5868, art3: 0xe8dcc4,
    name: 'Shoreditch Loft',
  },
  { // 2 — Chelsea Townhouse: classic, oak, navy + cream
    wall: 0xe8ddc8, accent: 0x2c4858, feature: 0x344258,
    floor: 0xb88858, sofa: 0xe2dac8, kitchen: 0xf4f0e8, cabinets: 0x223047,
    counterTop: 0xe8e4d8, art1: 0x3a4a6a, art2: 0xc4985a, art3: 0xe8dcc4,
    name: 'Chelsea Townhouse',
  },
  { // 3 — Mayfair Penthouse: marble, brass, deep teal
    wall: 0xe5dccd, accent: 0x1f3a3d, feature: 0xb89668,
    floor: 0xc8a880, sofa: 0xe8e0d2, kitchen: 0xf6f2ea, cabinets: 0x1c1f24,
    counterTop: 0xeae6dc, art1: 0x223047, art2: 0xb89668, art3: 0xc8a4a0,
    name: 'Mayfair Penthouse',
  },
  { // 4 — Kensington Mansion: grand, ivory, gilt, deep emerald
    wall: 0xefe7d4, accent: 0x2a4a3a, feature: 0xc8a060,
    floor: 0xa07444, sofa: 0xf0e8d8, kitchen: 0xf8f5ee, cabinets: 0x1a3025,
    counterTop: 0xeee8d8, art1: 0x2a4a3a, art2: 0xc8a060, art3: 0xefe0c0,
    name: 'Kensington Mansion',
  },
];

// --- Upgrade → 3D object mapping --------------------------------------------
// Defines which game upgrade IDs flip which 3D features visible.
// Keyed by upgrade id (which appears across multiple property tiers); a few are
// tier-specific. Anything not listed is a non-visual upgrade (e.g. WiFi, butler).
const UPGRADE_FEATURES = {
  // TVs
  smart_tv:        ['tv'],
  smart_tv_2:      ['tv', 'tv2'],
  // Coffee
  coffee_machine:  ['coffeeMachine'],
  // Kitchen tiers
  kitchen_reno:    ['kitchenPremium'],
  chef_kitchen:    ['kitchenPremium', 'kitchenPro'],
  michelin:        ['kitchenPremium', 'kitchenPro', 'kitchenChef'],
  dishwasher:      ['dishwasher'],
  // Bathroom tiers
  lux_baths:       ['bathPremium'],
  spa_bath:        ['bathPremium', 'bathSpa'],
  bathroom_reno:   ['bathPremium'],
  // Bed
  premium_bedding: ['bedPremium'],
  second_bed:      ['bed2Premium'],
  // Wine
  wine_fridge:     ['wineFridge'],
  wine_cellar:     ['wineFridge', 'wineCellar'],
  // Art / decor
  artwork:         ['artwork'],
  art:             ['artwork', 'gallery'],
  art_gallery:     ['artwork', 'gallery'],
  // Music / cinema
  record_player:   ['recordPlayer'],
  cinema:          ['cinema'],
  home_cinema:     ['cinema', 'cinemaPro'],
  cinema20:        ['cinema', 'cinemaPro', 'cinemaGrand'],
  // Outdoor / terrace
  rooftop:         ['terrace'],
  garden_land:     ['terrace', 'garden'],
  // Smart home (pulses lighting + shows ambient screens)
  smart_home:      ['smartHome'],
  smart_home_2:    ['smartHome', 'smartHomePro'],
  // Plants & atmosphere
  air_purifier:    ['plantSmall'],
  // Pool
  pool:            ['pool'],
  // Gym
  gym:             ['gym'],
};

// Compute which 3D features are visible given a list of game upgrade IDs
function computeFeatures(upgradeIds = []) {
  const set = new Set();
  for (const id of upgradeIds) {
    const features = UPGRADE_FEATURES[id];
    if (features) features.forEach((f) => set.add(f));
  }
  return set;
}

// ============================================================================
// PROCEDURAL TEXTURES (kept simple for mobile performance)
// ============================================================================
function makeOakTexture(tint = '#b88858') {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#d4ae7c');
  grad.addColorStop(0.5, tint);
  grad.addColorStop(1, '#9a6e3e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  // Wood grain
  for (let i = 0; i < 80; i++) {
    ctx.strokeStyle = `rgba(${50 + Math.random() * 30}, ${30 + Math.random() * 20}, 15, ${0.08 + Math.random() * 0.18})`;
    ctx.lineWidth = 0.4 + Math.random() * 0.8;
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i * 0.5) * (1 + Math.random() * 2));
    }
    ctx.stroke();
  }
  // Plank seams
  for (let py = 0; py < 512; py += 64) {
    ctx.fillStyle = 'rgba(40,25,12,0.5)';
    ctx.fillRect(0, py, 512, 1.2);
    // Random short joints
    const joint = Math.random() * 512;
    ctx.fillRect(joint, py, 1.2, 64);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function makeMarbleTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f6f2ea';
  ctx.fillRect(0, 0, 512, 512);
  // Veins
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(${110 + Math.random() * 40}, ${100 + Math.random() * 30}, 90, ${0.25 + Math.random() * 0.25})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.5;
    ctx.beginPath();
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    let x = sx, y = sy;
    for (let s = 0; s < 60; s++) {
      x += (Math.random() - 0.5) * 18;
      y += (Math.random() - 0.5) * 18;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function makeWallTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);
  // Subtle noise (microcement)
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeBrickTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5a3a30';
  ctx.fillRect(0, 0, 512, 512);
  const bw = 64, bh = 24;
  for (let y = 0; y < 512; y += bh) {
    const off = (Math.floor(y / bh) % 2) * (bw / 2);
    for (let x = -bw; x < 512 + bw; x += bw) {
      // Brick body
      const r = 90 + Math.random() * 60;
      const g = 50 + Math.random() * 30;
      const b = 40 + Math.random() * 20;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
      // Mortar line
      ctx.fillStyle = '#3a2c25';
      ctx.fillRect(x + off, y, bw, 1);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeRugTexture(c1 = '#cdb89a', c2 = '#9a8060') {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, 256, 256);
  // Geometric pattern
  ctx.strokeStyle = c2;
  ctx.lineWidth = 1.2;
  for (let i = 16; i < 240; i += 22) {
    ctx.strokeRect(i, i, 256 - i * 2, 256 - i * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

// ============================================================================
// MAIN API: Apartment3D.mount(container, opts)
// ============================================================================
export const Apartment3D = {
  mount(container, opts = {}) {
    return new ApartmentInstance(container, opts);
  },
};

class ApartmentInstance {
  constructor(container, opts) {
    this.container = container;
    this.tier = opts.tier ?? 0;
    this.upgradeIds = opts.upgrades ?? [];
    this.timeOfDay = opts.time ?? 'day';
    this.mode = opts.mode ?? 'orbit';
    this.featureSet = computeFeatures(this.upgradeIds);
    this.disposed = false;

    // Track all swappable feature objects so update() can flip them
    this.featureGroups = {};

    this.initRenderer();
    this.initScene();
    this.buildAll();
    this.initControls();
    this.applyTime();
    this.applyFeatures();
    this.startLoop();
  }

  // --- Renderer setup ----------------------------------------------------
  initRenderer() {
    const W = this.container.clientWidth || 800;
    const H = this.container.clientHeight || 600;
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    this.container.innerHTML = '';
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    // Resize observer
    this.ro = new ResizeObserver(() => this.handleResize());
    this.ro.observe(this.container);
  }

  handleResize() {
    if (this.disposed) return;
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
  }

  // --- Scene + camera ----------------------------------------------------
  initScene() {
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb8c8d8);

    this.camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);

    // Hemisphere ambient + key/fill/back directional lights
    this.lights = {};
    this.lights.hemi = new THREE.HemisphereLight(0xfff5e0, 0x6a6f78, 0.55);
    this.scene.add(this.lights.hemi);

    this.lights.key = new THREE.DirectionalLight(0xffe8c8, 1.2);
    this.lights.key.position.set(8, 12, 6);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.set(1024, 1024);
    this.lights.key.shadow.camera.left = -10;
    this.lights.key.shadow.camera.right = 10;
    this.lights.key.shadow.camera.top = 8;
    this.lights.key.shadow.camera.bottom = -8;
    this.lights.key.shadow.bias = -0.0005;
    this.scene.add(this.lights.key);

    this.lights.fill = new THREE.DirectionalLight(0xc4d4e8, 0.4);
    this.lights.fill.position.set(-6, 6, -5);
    this.scene.add(this.lights.fill);

    this.lights.bounce = new THREE.DirectionalLight(0xffd4a0, 0.25);
    this.lights.bounce.position.set(0, -2, 4);
    this.scene.add(this.lights.bounce);

    // Interior warm point lights (for evening/night)
    this.interiorLights = [
      this.makePointLight(-3, 2.4, 2.5, 0xffb070, 0),     // living
      this.makePointLight(2.5, 2.4, 2, 0xffb070, 0),       // dining
      this.makePointLight(-2.5, 2.4, -2.5, 0xffb070, 0),   // bedroom
      this.makePointLight(2.5, 2.4, -2.5, 0xffb070, 0),    // bedroom 2
    ];
  }

  makePointLight(x, y, z, color, intensity) {
    const l = new THREE.PointLight(color, intensity, 8, 1.5);
    l.position.set(x, y, z);
    this.scene.add(l);
    return l;
  }

  // --- Build everything --------------------------------------------------
  buildAll() {
    // Build texture set per tier
    const palette = TIER_PALETTES[this.tier];
    this.palette = palette;

    this.textures = {
      oak: makeOakTexture(),
      marble: makeMarbleTexture(),
      wall: makeWallTexture(),
      brick: makeBrickTexture(),
      rug: makeRugTexture('#cdb89a', '#9a8060'),
    };
    this.textures.oak.repeat.set(3, 3);
    this.textures.marble.repeat.set(2, 2);
    this.textures.wall.repeat.set(2, 2);
    this.textures.brick.repeat.set(2, 1);

    // Materials (palette-aware)
    this.M = {
      floor: new THREE.MeshStandardMaterial({
        map: this.textures.oak,
        color: palette.floor,
        roughness: 0.55,
      }),
      bathFloor: new THREE.MeshStandardMaterial({
        map: this.textures.marble,
        color: 0xeae6dc,
        roughness: 0.25,
      }),
      wall: new THREE.MeshStandardMaterial({
        map: this.textures.wall,
        color: palette.wall,
        roughness: 0.92,
      }),
      wallAccent: new THREE.MeshStandardMaterial({
        map: this.textures.wall,
        color: palette.accent,
        roughness: 0.85,
      }),
      wallFeature: new THREE.MeshStandardMaterial({
        map: this.textures.wall,
        color: palette.feature,
        roughness: 0.85,
      }),
      brickWall: new THREE.MeshStandardMaterial({
        map: this.textures.brick,
        roughness: 0.95,
      }),
      sofa: new THREE.MeshStandardMaterial({
        color: palette.sofa,
        roughness: 0.95,
      }),
      kitchenCabinet: new THREE.MeshStandardMaterial({
        color: palette.cabinets,
        roughness: 0.4,
        metalness: 0.15,
      }),
      kitchenCounter: new THREE.MeshStandardMaterial({
        map: this.textures.marble,
        color: palette.counterTop,
        roughness: 0.18,
        metalness: 0.05,
      }),
      blackMetal: new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.35, metalness: 0.85 }),
      brushedSteel: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.95 }),
      brass: new THREE.MeshStandardMaterial({ color: 0xb89668, roughness: 0.35, metalness: 0.9 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xdde2e8, roughness: 0.05, metalness: 1.0 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xb8ccdc, roughness: 0.05, metalness: 0.1,
        transmission: 0.92, thickness: 0.05, opacity: 0.3,
        transparent: true, ior: 1.5,
      }),
      mirror: new THREE.MeshPhysicalMaterial({ color: 0xe8eef4, roughness: 0.02, metalness: 1.0 }),
      ceramic: new THREE.MeshStandardMaterial({ color: 0xfafaf6, roughness: 0.15 }),
      linen: new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.9 }),
      duvet: new THREE.MeshStandardMaterial({ color: palette.sofa, roughness: 0.95 }),
      foliage: new THREE.MeshStandardMaterial({ color: 0x3d6b3d, roughness: 0.8 }),
      foliageLight: new THREE.MeshStandardMaterial({ color: 0x5a8a4a, roughness: 0.8 }),
      pot: new THREE.MeshStandardMaterial({ color: 0xc0b8a8, roughness: 0.5 }),
      art1: new THREE.MeshStandardMaterial({ color: palette.art1, roughness: 0.7 }),
      art2: new THREE.MeshStandardMaterial({ color: palette.art2, roughness: 0.7 }),
      art3: new THREE.MeshStandardMaterial({ color: palette.art3, roughness: 0.7 }),
      rug: new THREE.MeshStandardMaterial({ map: this.textures.rug, roughness: 0.95 }),
      tvScreen: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3, emissive: 0x111111 }),
      water: new THREE.MeshPhysicalMaterial({ color: 0x4a8aa8, transmission: 0.7, roughness: 0.1, transparent: true, opacity: 0.7 }),
    };

    // Group containers
    this.world = new THREE.Group();
    this.scene.add(this.world);

    // Build the spaces in order
    this.buildShell();           // walls, floor, ceiling, windows
    this.buildKitchen();
    this.buildLivingDining();
    this.buildMasterBed();
    this.buildSecondBed();
    this.buildBathrooms();
    this.buildHallway();
    this.buildExterior();

    // Brick override for Shoreditch (tier 1)
    if (this.tier === 1) {
      // Apply brick to the south wall (visual interest)
      const sw = this.world.getObjectByName('southWall');
      if (sw) sw.material = this.M.brickWall;
    }
  }

  // === GEOMETRY HELPERS ====================================================
  // Apartment dimensions: 12m wide × 8.5m deep × 2.8m tall
  // Coords: x=±6 east-west, z=±4.25 north-south, y up

  box(w, h, d, mat, x, y, z, name) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    if (name) m.name = name;
    this.world.add(m);
    return m;
  }

  feature(name, builder) {
    // Create a group, build into it, register under featureGroups
    const g = new THREE.Group();
    builder(g);
    this.world.add(g);
    if (!this.featureGroups[name]) this.featureGroups[name] = [];
    this.featureGroups[name].push(g);
    g.visible = this.featureSet.has(name);
    return g;
  }

  // === SHELL: walls, floor, ceiling, windows ==============================
  buildShell() {
    const W_X = 12, D_Z = 8.5, H_Y = 2.8;

    // Floor (oak, with bathroom tile insets)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W_X, D_Z), this.M.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.world.add(floor);

    // En-suite floor: x ∈ [-6, -3.5], z ∈ [-4.25, -2.25]
    const f1 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2), this.M.bathFloor);
    f1.rotation.x = -Math.PI / 2;
    f1.position.set(-4.75, 0.005, -3.25);
    f1.receiveShadow = true;
    this.world.add(f1);

    // Family bath floor: x ∈ [3.8, 6], z ∈ [-4.25, -2.25]
    const f2 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2), this.M.bathFloor);
    f2.rotation.x = -Math.PI / 2;
    f2.position.set(4.9, 0.005, -3.25);
    f2.receiveShadow = true;
    this.world.add(f2);

    // Ceiling
    this.ceilingGroup = new THREE.Group();
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W_X, D_Z), this.M.wall);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = H_Y;
    this.ceilingGroup.add(ceiling);
    this.world.add(this.ceilingGroup);

    // Perimeter walls (each one goes from y=0 to y=H_Y)
    // South wall (front, with big windows in living/dining)
    // Wall segments: [0..3] [4..8] [8..12] across x with 2 window cutouts
    const tWall = 0.15;
    // South wall — left segment + right segment, leaving big window in middle
    this.box(2, H_Y, tWall, this.M.wall, -W_X/2 + 1, H_Y/2, D_Z/2 + tWall/2, 'southWallL');
    this.box(2, H_Y, tWall, this.M.wall, W_X/2 - 1, H_Y/2, D_Z/2 + tWall/2, 'southWallR');
    // Window strip in middle (transom)
    this.box(8, 0.4, tWall, this.M.wall, 0, H_Y - 0.2, D_Z/2 + tWall/2, 'southTransom');
    // Bottom strip below window
    this.box(8, 0.4, tWall, this.M.wall, 0, 0.2, D_Z/2 + tWall/2, 'southSill');
    // Glass infill
    const sg = new THREE.Mesh(new THREE.BoxGeometry(8, 2.0, 0.04), this.M.glass);
    sg.position.set(0, 1.4, D_Z/2 + tWall/2);
    this.world.add(sg);

    // North wall (back, with smaller bedroom windows)
    this.box(W_X, H_Y, tWall, this.M.wall, 0, H_Y/2, -D_Z/2 - tWall/2, 'northWall');
    // Two window cutouts (one per bedroom)
    const ng1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.06), this.M.glass);
    ng1.position.set(-2, 1.7, -D_Z/2 - tWall/2 - 0.005);
    this.world.add(ng1);
    const ng2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.06), this.M.glass);
    ng2.position.set(2, 1.7, -D_Z/2 - tWall/2 - 0.005);
    this.world.add(ng2);

    // East wall (right, solid)
    this.box(tWall, H_Y, D_Z, this.M.wall, W_X/2 + tWall/2, H_Y/2, 0, 'eastWall');

    // West wall (left) — accent feature wall material in living room half
    this.box(tWall, H_Y, D_Z/2, this.M.wallAccent, -W_X/2 - tWall/2, H_Y/2, D_Z/4, 'westWallS');
    // North half — regular
    this.box(tWall, H_Y, D_Z/2, this.M.wall, -W_X/2 - tWall/2, H_Y/2, -D_Z/4, 'westWallN');

    // === Internal walls ===
    // Wall separating north zone (bedrooms+baths) from south zone (open plan)
    // Above 2nd bedroom: x ∈ [-6, -0.5]
    this.box(5.5, H_Y, tWall, this.M.wall, -3.25, H_Y/2, 0, 'midWallL');
    // Above master: x ∈ [0.5, 6]
    this.box(5.5, H_Y, tWall, this.M.wall, 3.25, H_Y/2, 0, 'midWallR');

    // En-suite walls (south + east)
    this.box(2.5, H_Y, tWall, this.M.wall, -4.75, H_Y/2, -2.25, 'ensuiteS');
    this.box(tWall, H_Y, 2, this.M.wall, -3.5, H_Y/2, -3.25, 'ensuiteE');

    // Family bath walls (south + west)
    this.box(2.2, H_Y, tWall, this.M.wall, 4.9, H_Y/2, -2.25, 'familyBS');
    this.box(tWall, H_Y, 2, this.M.wall, 3.8, H_Y/2, -3.25, 'familyBW');

    // Hallway walls (between bedrooms)
    this.box(tWall, H_Y, D_Z/2, this.M.wall, -0.5, H_Y/2, -D_Z/4, 'hallwayL');
    this.box(tWall, H_Y, D_Z/2, this.M.wall, 0.5, H_Y/2, -D_Z/4, 'hallwayR');

    // Bedroom 2 / en-suite divider (between 2nd bed and en-suite)
    this.box(tWall, H_Y, 0.25, this.M.wall, -3.5, H_Y/2, -2.125, 'bed2D');

    // Feature accent: terracotta/feature panel behind master bed (north wall section)
    this.box(2.4, 1.6, 0.04, this.M.wallFeature, 2.2, 1.5, -D_Z/2 + 0.06, 'masterFeatureWall');

    // Feature accent: olive sage behind 2nd bed
    this.box(2.4, 1.6, 0.04, this.M.wallFeature, -2.2, 1.5, -D_Z/2 + 0.06, 'bed2FeatureWall');
  }

  // === KITCHEN (back-left of open-plan, x ∈ [-6, -2], z ∈ [0, 2.5]) =======
  buildKitchen() {
    // Base counter run along west wall and partial north wall of kitchen
    // West-facing run: x = -5.7, z ∈ [0.5, 4]
    const wcRun = new THREE.Group();
    wcRun.position.set(-5.5, 0, 1.5);
    // Base cabinets
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 3), this.M.kitchenCabinet);
    cab.position.set(0, 0.43, 0);
    cab.castShadow = true;
    cab.receiveShadow = true;
    wcRun.add(cab);
    // Marble top
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.05, 3.05), this.M.kitchenCounter);
    top.position.set(0, 0.88, 0);
    wcRun.add(top);
    // Sink (cutout effect via dark inset)
    const sink = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.7), this.M.brushedSteel);
    sink.position.set(0, 0.88, 1);
    wcRun.add(sink);
    // Tap (chrome)
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35), this.M.chrome);
    tap.position.set(0, 1.05, 1);
    wcRun.add(tap);
    const tapHead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), this.M.chrome);
    tapHead.position.set(0, 1.21, 0.92);
    wcRun.add(tapHead);
    // Hob (south end of run)
    const hob = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.5), this.M.blackMetal);
    hob.position.set(0, 0.89, -1);
    wcRun.add(hob);
    // 4 burners
    for (let i = 0; i < 4; i++) {
      const burner = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), this.M.blackMetal);
      burner.rotation.x = -Math.PI / 2;
      burner.position.set(((i % 2) - 0.5) * 0.2, 0.901, -1 + (Math.floor(i/2) - 0.5) * 0.2);
      wcRun.add(burner);
    }
    this.world.add(wcRun);

    // Island in middle of kitchen area (x = -3, z = 1.5)
    const island = new THREE.Group();
    island.position.set(-3.2, 0, 1.5);
    const iCab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 1.0), this.M.kitchenCabinet);
    iCab.position.set(0, 0.43, 0);
    iCab.castShadow = true;
    iCab.receiveShadow = true;
    island.add(iCab);
    const iTop = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.05, 1.1), this.M.kitchenCounter);
    iTop.position.set(0, 0.88, 0);
    island.add(iTop);
    // Counter overhang for stools
    // Bar stools (3)
    for (let i = 0; i < 3; i++) {
      const stool = new THREE.Group();
      // Seat (round)
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04), this.M.blackMetal);
      seat.position.y = 0.7;
      stool.add(seat);
      // Back
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.4, 0.04), this.M.blackMetal);
      back.position.set(0, 0.92, -0.16);
      stool.add(back);
      // Legs
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7), this.M.blackMetal);
      leg.position.y = 0.35;
      stool.add(leg);
      stool.position.set((i - 1) * 0.7, 0, 0.85);
      island.add(stool);
    }
    this.world.add(island);

    // Wall cabinets (upper) along west wall above counter
    const wallCab = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 2.4), this.M.kitchenCabinet);
    wallCab.position.set(-5.6, 1.85, 1.5);
    wallCab.castShadow = true;
    this.world.add(wallCab);

    // Range hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.5), this.M.brushedSteel);
    hood.position.set(-5.5, 1.85, 0.5);
    this.world.add(hood);

    // Fridge (tall, integrated, north end of run)
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.0, 0.7), this.M.kitchenCabinet);
    fridge.position.set(-5.5, 1.0, 3.4);
    fridge.castShadow = true;
    this.world.add(fridge);

    // === Upgrade features in kitchen ===

    // Coffee machine on island corner
    this.feature('coffeeMachine', (g) => {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 0.32), this.M.brushedSteel);
      body.position.set(-2.3, 1.06, 1.55);
      g.add(body);
      const drip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.2), this.M.blackMetal);
      drip.position.set(-2.3, 0.92, 1.6);
      g.add(drip);
      // Tiny cup
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05), this.M.ceramic);
      cup.position.set(-2.3, 0.93, 1.7);
      g.add(cup);
    });

    // Premium kitchen — adds gold pendant lights + nicer hardware
    this.feature('kitchenPremium', (g) => {
      // 3 pendant lights over island
      for (let i = 0; i < 3; i++) {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.6), this.M.blackMetal);
        stem.position.set(-3.2 + (i - 1) * 0.8, 2.5, 1.5);
        g.add(stem);
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 16, 1, true), this.M.brass);
        shade.material = this.M.brass;
        shade.position.set(-3.2 + (i - 1) * 0.8, 2.1, 1.5);
        g.add(shade);
      }
    });

    // Pro kitchen — adds full splashback + wine bottle row + extra appliances
    this.feature('kitchenPro', (g) => {
      const splash = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 2.4), this.M.kitchenCounter);
      splash.position.set(-5.92, 1.25, 1.5);
      g.add(splash);
      // Wine bottle row (decoration on counter)
      for (let i = 0; i < 4; i++) {
        const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28), 
          new THREE.MeshStandardMaterial({ color: i % 2 ? 0x2a4030 : 0x5a3020, roughness: 0.4 }));
        bot.position.set(-5.6, 1.04, 2.5 + i * 0.12);
        g.add(bot);
      }
    });

    // Chef kitchen — adds professional red range, replaces hob area
    this.feature('kitchenChef', (g) => {
      // Big La Cornue style range (where hob was)
      const range = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.95, 1.0), 
        new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.3, metalness: 0.4 }));
      range.position.set(-5.5, 0.475, 0.3);
      g.add(range);
      // Brass knobs along front
      for (let i = 0; i < 5; i++) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04), this.M.brass);
        knob.rotation.z = Math.PI / 2;
        knob.position.set(-5.18, 0.6, -0.05 + i * 0.18);
        g.add(knob);
      }
      // Brass back rail
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.95), this.M.brass);
      rail.position.set(-5.78, 0.99, 0.3);
      g.add(rail);
    });

    // Dishwasher (under counter, marker via panel hint)
    this.feature('dishwasher', (g) => {
      const dw = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.05), this.M.brushedSteel);
      dw.position.set(-5.2, 0.42, 0.5);
      dw.rotation.y = Math.PI / 2;
      g.add(dw);
    });

    // Wine fridge — visible wine fridge slot
    this.feature('wineFridge', (g) => {
      const wf = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.85, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1f, roughness: 0.3, metalness: 0.3 }));
      wf.position.set(-2.0, 0.43, 1.3);
      g.add(wf);
      // Glass front
      const wfg = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.78, 0.05), this.M.glass);
      wfg.position.set(-2.0, 0.43, 0.99);
      g.add(wfg);
      // 6 bottles inside
      for (let i = 0; i < 6; i++) {
        const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25),
          new THREE.MeshStandardMaterial({ color: 0x2a4030, roughness: 0.4 }));
        bot.rotation.z = Math.PI / 2;
        bot.position.set(-2.0 + (i % 3 - 1) * 0.12, 0.3 + Math.floor(i / 3) * 0.2, 1.0);
        g.add(bot);
      }
    });

    // Wine cellar — larger glass-walled cellar (replaces small fridge)
    this.feature('wineCellar', (g) => {
      const cellar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x2a1a1a, roughness: 0.3 }));
      cellar.position.set(-1.3, 1.0, 1.3);
      g.add(cellar);
      const glassFront = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.85, 0.05), this.M.glass);
      glassFront.position.set(-1.3, 1.0, 1.0);
      g.add(glassFront);
      // Many bottles in racks
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
          const bot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22),
            new THREE.MeshStandardMaterial({ color: row % 2 ? 0x2a4030 : 0x5a3020, roughness: 0.4 }));
          bot.rotation.z = Math.PI / 2;
          bot.position.set(-1.3 + (col - 1.5) * 0.18, 0.3 + row * 0.3, 1.1);
          g.add(bot);
        }
      }
    });
  }

  // === LIVING / DINING (front of open-plan) ================================
  buildLivingDining() {
    // Living rug (left front)
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), this.M.rug);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-3.2, 0.01, 2.6);
    rug.receiveShadow = true;
    this.world.add(rug);

    // Sofa (L-shape)
    const sofa = new THREE.Group();
    sofa.position.set(-3.5, 0, 2.2);
    // Base seat
    const sBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 1.0), this.M.sofa);
    sBase.position.set(0, 0.3, 0);
    sBase.castShadow = true; sBase.receiveShadow = true;
    sofa.add(sBase);
    // Backrest
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.25), this.M.sofa);
    sBack.position.set(0, 0.7, -0.4);
    sBack.castShadow = true;
    sofa.add(sBack);
    // L-extension chaise
    const sCh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 1.6), this.M.sofa);
    sCh.position.set(1.6, 0.3, 0.35);
    sCh.castShadow = true;
    sofa.add(sCh);
    const sChBack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.6), this.M.sofa);
    sChBack.position.set(1.95, 0.7, 0.35);
    sChBack.castShadow = true;
    sofa.add(sChBack);
    // Cushions on top
    for (let i = 0; i < 3; i++) {
      const cush = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.35), 
        new THREE.MeshStandardMaterial({ color: i === 1 ? 0xa86a4a : 0xc8a880, roughness: 0.9 }));
      cush.position.set(-0.85 + i * 0.85, 0.55, 0.15);
      sofa.add(cush);
    }
    this.world.add(sofa);

    // Coffee table (round marble + black metal)
    const ct = new THREE.Group();
    ct.position.set(-3, 0, 3.5);
    const ctTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06), this.M.kitchenCounter);
    ctTop.position.y = 0.4;
    ctTop.castShadow = true;
    ct.add(ctTop);
    const ctLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), this.M.blackMetal);
    ctLeg.position.y = 0.2;
    ct.add(ctLeg);
    const ctBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02), this.M.blackMetal);
    ctBase.position.y = 0.01;
    ct.add(ctBase);
    // Decorative items on coffee table
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.28), this.M.art1);
    book.position.set(-0.1, 0.45, 0);
    ct.add(book);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08), this.M.ceramic);
    cup.position.set(0.15, 0.46, 0.1);
    ct.add(cup);
    this.world.add(ct);

    // Reading armchair (cognac leather, mid-century)
    const arm = new THREE.Group();
    arm.position.set(-1.8, 0, 3.6);
    arm.rotation.y = -Math.PI / 4;
    const armSeat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.7), 
      new THREE.MeshStandardMaterial({ color: 0x8a4a2a, roughness: 0.55 }));
    armSeat.position.y = 0.32;
    armSeat.castShadow = true;
    arm.add(armSeat);
    const armBack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.15), 
      new THREE.MeshStandardMaterial({ color: 0x8a4a2a, roughness: 0.55 }));
    armBack.position.set(0, 0.65, -0.28);
    arm.add(armBack);
    // Splayed wood legs
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.32), 
        new THREE.MeshStandardMaterial({ color: 0x4a2e1c, roughness: 0.6 }));
      const fx = (i % 2 ? 1 : -1) * 0.28;
      const fz = (i < 2 ? 1 : -1) * 0.28;
      leg.position.set(fx, 0.16, fz);
      leg.rotation.z = (i % 2 ? -1 : 1) * 0.1;
      leg.rotation.x = (i < 2 ? -1 : 1) * 0.08;
      arm.add(leg);
    }
    this.world.add(arm);

    // Floor lamp (sculptural, matte black)
    const lamp = new THREE.Group();
    lamp.position.set(-1.0, 0, 4.2);
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.04), this.M.blackMetal);
    lampBase.position.y = 0.02;
    lamp.add(lampBase);
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6), this.M.blackMetal);
    lampStem.position.y = 0.84;
    lamp.add(lampStem);
    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.3, 16, 1, true), 
      new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.85, side: THREE.DoubleSide }));
    lampShade.position.y = 1.7;
    lamp.add(lampShade);
    this.world.add(lamp);

    // Dining area (right front)
    const diningRug = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), 
      new THREE.MeshStandardMaterial({ color: 0xb8a888, roughness: 0.95 }));
    diningRug.rotation.x = -Math.PI / 2;
    diningRug.position.set(3, 0.005, 2.3);
    this.world.add(diningRug);

    // Dining table (oval/oak)
    const table = new THREE.Group();
    table.position.set(3, 0, 2.3);
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.06, 32), 
      new THREE.MeshStandardMaterial({ map: this.textures.oak, color: this.palette.floor, roughness: 0.5 }));
    tableTop.scale.set(1.2, 1, 0.7);
    tableTop.position.y = 0.74;
    tableTop.castShadow = true;
    table.add(tableTop);
    // Pedestal
    const tablePed = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 0.7), this.M.blackMetal);
    tablePed.position.y = 0.36;
    table.add(tablePed);
    const tablePedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04), this.M.blackMetal);
    tablePedBase.position.y = 0.02;
    table.add(tablePedBase);
    // 6 chairs
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const chair = new THREE.Group();
      chair.position.set(Math.cos(ang) * 1.4 * 1.2, 0, Math.sin(ang) * 1.4 * 0.7);
      chair.rotation.y = -ang - Math.PI / 2;
      // Seat (boucle)
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), this.M.sofa);
      seat.position.y = 0.45;
      seat.castShadow = true;
      chair.add(seat);
      // Back
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.05), this.M.sofa);
      back.position.set(0, 0.7, 0.18);
      chair.add(back);
      // Legs
      for (let l = 0; l < 4; l++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.45), this.M.blackMetal);
        leg.position.set(((l % 2) - 0.5) * 0.34, 0.225, ((l < 2 ? 1 : -1) * 0.16));
        chair.add(leg);
      }
      table.add(chair);
    }
    this.world.add(table);

    // Hanging pendant lamp over dining
    const dLamp = new THREE.Group();
    dLamp.position.set(3, 0, 2.3);
    const dStem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.7), this.M.blackMetal);
    dStem.position.y = 2.45;
    dLamp.add(dStem);
    const dShade = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7), 
      new THREE.MeshStandardMaterial({ color: 0xeee8d0, roughness: 0.6, side: THREE.DoubleSide }));
    dShade.position.y = 2.05;
    dLamp.add(dShade);
    this.world.add(dLamp);

    // === Upgrade features in living/dining ===

    // TV — wall-mounted on east wall (between living and dining, on the internal wall)
    this.feature('tv', (g) => {
      const tv = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.04), this.M.tvScreen);
      tv.position.set(-5.85, 1.55, 4);
      tv.rotation.y = Math.PI / 2;
      g.add(tv);
      // Bezel
      const bz = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.9, 0.02), this.M.blackMetal);
      bz.position.set(-5.84, 1.55, 4);
      bz.rotation.y = Math.PI / 2;
      g.add(bz);
      // Console under TV
      const console = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 1.8), 
        new THREE.MeshStandardMaterial({ map: this.textures.oak, roughness: 0.5 }));
      console.position.set(-5.7, 0.25, 4);
      g.add(console);
    });

    // Second TV (in master bedroom)
    this.feature('tv2', (g) => {
      const tv = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.04), this.M.tvScreen);
      tv.position.set(0.55, 1.4, -2);
      tv.rotation.y = Math.PI / 2;
      g.add(tv);
      const bz = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.65, 0.02), this.M.blackMetal);
      bz.position.set(0.56, 1.4, -2);
      bz.rotation.y = Math.PI / 2;
      g.add(bz);
    });

    // Artwork — large statement piece on west feature wall
    this.feature('artwork', (g) => {
      // Triptych
      for (let i = 0; i < 3; i++) {
        const f = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.85, 0.5), 
          [this.M.art1, this.M.art2, this.M.art3][i]);
        f.position.set(-5.93, 1.6, 2.4 + i * 0.6);
        g.add(f);
        // Frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.92, 0.55), this.M.blackMetal);
        frame.position.set(-5.94, 1.6, 2.4 + i * 0.6);
        g.add(frame);
      }
    });

    // Gallery — bigger array of frames
    this.feature('gallery', (g) => {
      const positions = [
        { y: 1.0, z: 4.2, w: 0.4, h: 0.5 },
        { y: 1.7, z: 4.2, w: 0.4, h: 0.5 },
        { y: 1.0, z: 0.4, w: 0.45, h: 0.6 },
        { y: 1.6, z: 0.4, w: 0.45, h: 0.6 },
        { y: 1.3, z: 4.7, w: 0.6, h: 0.4 },
      ];
      positions.forEach((p, i) => {
        const f = new THREE.Mesh(new THREE.BoxGeometry(0.04, p.h, p.w), 
          [this.M.art1, this.M.art2, this.M.art3, this.M.art1, this.M.art2][i]);
        f.position.set(-5.93, p.y, p.z);
        g.add(f);
        const fr = new THREE.Mesh(new THREE.BoxGeometry(0.05, p.h + 0.07, p.w + 0.07), this.M.brass);
        fr.position.set(-5.94, p.y, p.z);
        g.add(fr);
      });
    });

    // Record player — on a side table next to sofa
    this.feature('recordPlayer', (g) => {
      // Side table
      const sd = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), 
        new THREE.MeshStandardMaterial({ map: this.textures.oak, roughness: 0.5 }));
      sd.position.set(-5.3, 0.225, 1.5);
      g.add(sd);
      // Record player on top
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.42), this.M.blackMetal);
      base.position.set(-5.3, 0.475, 1.5);
      g.add(base);
      const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.01), 
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 }));
      platter.position.set(-5.3, 0.51, 1.5);
      g.add(platter);
      const record = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.005), 
        new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.3 }));
      record.position.set(-5.3, 0.515, 1.5);
      g.add(record);
      // Tonearm (thin cylinder)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18), this.M.brass);
      arm.position.set(-5.18, 0.51, 1.4);
      arm.rotation.x = Math.PI / 2;
      arm.rotation.z = -0.4;
      g.add(arm);
    });

    // Plants (small statement plant next to armchair)
    this.feature('plantSmall', (g) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 0.22), this.M.pot);
      pot.position.set(-1.2, 0.11, 4.2);
      g.add(pot);
      // Foliage layers
      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.25 - i * 0.04, 8, 6), 
          i % 2 ? this.M.foliage : this.M.foliageLight);
        leaf.scale.set(1.2, 0.7, 1.2);
        leaf.position.set(-1.2, 0.4 + i * 0.18, 4.2);
        g.add(leaf);
      }
    });

    // Cinema — projector + screen on west wall (replaces gallery if both)
    this.feature('cinema', (g) => {
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.5, 2.6), 
        new THREE.MeshStandardMaterial({ color: 0xf0f0e8, roughness: 0.3, emissive: 0x222222 }));
      screen.position.set(-5.92, 1.6, 3.2);
      g.add(screen);
      // Projector mounted on ceiling
      const proj = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.35), this.M.blackMetal);
      proj.position.set(-2.5, 2.55, 3.2);
      g.add(proj);
      // Lens
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05), this.M.chrome);
      lens.rotation.z = Math.PI / 2;
      lens.position.set(-2.65, 2.55, 3.2);
      g.add(lens);
    });

    // Cinema Pro — adds row of theatre seating
    this.feature('cinemaPro', (g) => {
      for (let i = 0; i < 4; i++) {
        const seat = new THREE.Group();
        seat.position.set(-1.5, 0, 1.2 + i * 0.7);
        seat.rotation.y = -Math.PI / 2;
        const sBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.55), 
          new THREE.MeshStandardMaterial({ color: 0x4a1a1a, roughness: 0.6 }));
        sBase.position.y = 0.3;
        seat.add(sBase);
        const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.15), 
          new THREE.MeshStandardMaterial({ color: 0x4a1a1a, roughness: 0.6 }));
        sBack.position.set(0, 0.75, -0.2);
        seat.add(sBack);
        g.add(seat);
      }
    });

    // Cinema Grand — adds 2nd row + more drama
    this.feature('cinemaGrand', (g) => {
      // Second row, lifted on tier
      for (let i = 0; i < 4; i++) {
        const seat = new THREE.Group();
        seat.position.set(-0.7, 0.3, 1.2 + i * 0.7);
        seat.rotation.y = -Math.PI / 2;
        const sBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.55), 
          new THREE.MeshStandardMaterial({ color: 0x4a1a1a, roughness: 0.6 }));
        sBase.position.y = 0.3;
        seat.add(sBase);
        const sBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.15), 
          new THREE.MeshStandardMaterial({ color: 0x4a1a1a, roughness: 0.6 }));
        sBack.position.set(0, 0.75, -0.2);
        seat.add(sBack);
        g.add(seat);
      }
      // Tier platform
      const tier = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 3.0), 
        new THREE.MeshStandardMaterial({ color: 0x2a2020, roughness: 0.7 }));
      tier.position.set(-0.7, 0.15, 2.6);
      g.add(tier);
    });
  }

  // === MASTER BEDROOM (back-right of centre, x=[0.5, 3.8], z=[-4.25, 0]) ===
  buildMasterBed() {
    // Bedroom rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), 
      new THREE.MeshStandardMaterial({ color: 0xc8b89a, roughness: 0.95 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(2.2, 0.005, -2.0);
    this.world.add(rug);

    // Bed (king, against north wall)
    const bed = new THREE.Group();
    bed.position.set(2.2, 0, -3.2);
    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 2.2), 
      new THREE.MeshStandardMaterial({ map: this.textures.oak, color: this.palette.floor, roughness: 0.55 }));
    frame.position.y = 0.15;
    frame.castShadow = true;
    bed.add(frame);
    // Mattress
    const mat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.25, 2.1), this.M.linen);
    mat.position.y = 0.42;
    mat.castShadow = true;
    bed.add(mat);
    // Duvet (flipped over end)
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.15, 1.6), this.M.duvet);
    duvet.position.set(0, 0.59, 0.3);
    bed.add(duvet);
    // Pillows
    for (let i = 0; i < 2; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), this.M.linen);
      p.position.set((i - 0.5) * 0.7, 0.62, -0.85);
      bed.add(p);
    }
    // Headboard
    const hb = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 0.15), this.M.sofa);
    hb.position.set(0, 0.75, -1.05);
    bed.add(hb);
    this.world.add(bed);

    // Nightstands
    for (let i = 0; i < 2; i++) {
      const ns = new THREE.Group();
      ns.position.set(2.2 + (i - 0.5) * 2.4, 0, -3.6);
      const nsBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.4), 
        new THREE.MeshStandardMaterial({ map: this.textures.oak, roughness: 0.55 }));
      nsBody.position.y = 0.25;
      nsBody.castShadow = true;
      ns.add(nsBody);
      // Lamp on top
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.04), this.M.brass);
      lampBase.position.y = 0.52;
      ns.add(lampBase);
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), this.M.brass);
      lampStem.position.y = 0.69;
      ns.add(lampStem);
      const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.16, 16, 1, true), 
        new THREE.MeshStandardMaterial({ color: 0xeee2d0, roughness: 0.85, side: THREE.DoubleSide }));
      lampShade.position.y = 0.92;
      ns.add(lampShade);
      this.world.add(ns);
    }

    // Walk-in wardrobe wall (along south wall of master bedroom, runs from z=-0.15 inward)
    // We'll just put a row of integrated wardrobes along the internal east wall
    const wb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 3.0), this.M.kitchenCabinet);
    wb.position.set(3.55, 1.1, -1.5);
    wb.castShadow = true;
    this.world.add(wb);
    // Vertical handle grooves
    for (let i = 0; i < 3; i++) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.8, 0.04), this.M.brushedSteel);
      groove.position.set(3.31, 1.1, -2.5 + i * 1.0);
      this.world.add(groove);
    }

    // === Upgrade features in master ===

    // Premium bedding (silky duvet, more pillows, throw)
    this.feature('bedPremium', (g) => {
      // Throw at foot of bed
      const throw_ = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.05, 0.6), 
        new THREE.MeshStandardMaterial({ color: 0x88a89b, roughness: 0.85 }));
      throw_.position.set(2.2, 0.7, -2.7);
      g.add(throw_);
      // Decorative pillows
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.3), 
        new THREE.MeshStandardMaterial({ color: 0xb87a5a, roughness: 0.85 }));
      p1.position.set(2.2, 0.74, -3.5);
      g.add(p1);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.25), 
        new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.85 }));
      p2.position.set(2.55, 0.78, -3.5);
      g.add(p2);
    });
  }

  // === SECOND BEDROOM (back-left of centre, x=[-3.5, -0.5], z=[-4.25, 0]) ===
  buildSecondBed() {
    // Bedroom rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), 
      new THREE.MeshStandardMaterial({ color: 0xb8a888, roughness: 0.95 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-2.2, 0.005, -2.0);
    this.world.add(rug);

    // Bed (queen)
    const bed = new THREE.Group();
    bed.position.set(-2.2, 0, -3.2);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 2.1), 
      new THREE.MeshStandardMaterial({ map: this.textures.oak, color: this.palette.floor, roughness: 0.55 }));
    frame.position.y = 0.15;
    frame.castShadow = true;
    bed.add(frame);
    const mat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 2.0), this.M.linen);
    mat.position.y = 0.42;
    bed.add(mat);
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.15, 1.5), 
      new THREE.MeshStandardMaterial({ color: 0x7a8260, roughness: 0.95 }));
    duvet.position.set(0, 0.59, 0.3);
    bed.add(duvet);
    // Pillows
    for (let i = 0; i < 2; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.35), this.M.linen);
      p.position.set((i - 0.5) * 0.5, 0.62, -0.8);
      bed.add(p);
    }
    // Headboard
    const hb = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.9, 0.12), 
      new THREE.MeshStandardMaterial({ color: 0x7a8260, roughness: 0.85 }));
    hb.position.set(0, 0.7, -1.0);
    bed.add(hb);
    this.world.add(bed);

    // Nightstand (single, simpler)
    const ns = new THREE.Group();
    ns.position.set(-3.2, 0, -3.6);
    const nsBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.4), 
      new THREE.MeshStandardMaterial({ map: this.textures.oak, roughness: 0.55 }));
    nsBody.position.y = 0.25;
    ns.add(nsBody);
    // Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25), this.M.blackMetal);
    lampStem.position.y = 0.625;
    ns.add(lampStem);
    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.14, 16, 1, true), 
      new THREE.MeshStandardMaterial({ color: 0xeee2d0, roughness: 0.85, side: THREE.DoubleSide }));
    lampShade.position.y = 0.83;
    ns.add(lampShade);
    this.world.add(ns);

    // Floating shelf above bed with art
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.18), 
      new THREE.MeshStandardMaterial({ map: this.textures.oak, roughness: 0.55 }));
    shelf.position.set(-2.2, 1.65, -4.1);
    this.world.add(shelf);
    // 2 books on shelf
    const sb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.12), this.M.art1);
    sb.position.set(-2.55, 1.76, -4.1);
    this.world.add(sb);
    const sb2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.1), this.M.art2);
    sb2.position.set(-2.0, 1.74, -4.1);
    this.world.add(sb2);
    // Vase
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.2), this.M.ceramic);
    vase.position.set(-1.65, 1.77, -4.1);
    this.world.add(vase);

    // === Upgrade feature in 2nd bed ===
    this.feature('bed2Premium', (g) => {
      // Throw + cushions
      const throw_ = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.04, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x4a4030, roughness: 0.85 }));
      throw_.position.set(-2.2, 0.7, -2.7);
      g.add(throw_);
      // Side chair
      const chair = new THREE.Group();
      chair.position.set(-3.3, 0, -1.5);
      chair.rotation.y = Math.PI / 4;
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x88a89b, roughness: 0.85 }));
      ch.position.y = 0.3;
      chair.add(ch);
      const chBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), 
        new THREE.MeshStandardMaterial({ color: 0x88a89b, roughness: 0.85 }));
      chBack.position.set(0, 0.65, -0.2);
      chair.add(chBack);
      g.add(chair);
    });
  }

  // === BATHROOMS ============================================================
  buildBathrooms() {
    // === EN-SUITE (back-left, x=[-6, -3.5], z=[-4.25, -2.25]) ===
    // Vanity (wall-hung)
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.5), this.M.kitchenCabinet);
    vanity.position.set(-4.75, 0.65, -2.5);
    vanity.castShadow = true;
    this.world.add(vanity);
    // Marble counter
    const vTop = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.05, 0.55), this.M.kitchenCounter);
    vTop.position.set(-4.75, 0.9, -2.5);
    this.world.add(vTop);
    // Basin
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32), this.M.kitchenCounter);
    basin.scale.set(1, 1, 1.4);
    basin.position.set(-4.75, 0.93, -2.5);
    this.world.add(basin);
    // Tap
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.25), this.M.chrome);
    tap.position.set(-4.75, 1.04, -2.62);
    this.world.add(tap);
    // Mirror (round, backlit)
    const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.35, 32), this.M.mirror);
    mirror.position.set(-4.75, 1.6, -2.36);
    mirror.rotation.x = 0;
    mirror.rotation.y = 0;
    this.world.add(mirror);
    // Shower (back-right of en-suite)
    const sFloor = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), 
      new THREE.MeshStandardMaterial({ color: 0xaaa8a4, roughness: 0.4 }));
    sFloor.rotation.x = -Math.PI / 2;
    sFloor.position.set(-3.85, 0.01, -3.7);
    this.world.add(sFloor);
    // Glass shower divider
    const sg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.0, 0.9), this.M.glass);
    sg.position.set(-3.65, 1.0, -3.7);
    this.world.add(sg);
    // Showerhead
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02), this.M.chrome);
    sh.position.set(-3.85, 2.1, -3.95);
    sh.rotation.x = Math.PI / 2;
    this.world.add(sh);
    // WC (wall-hung)
    const wc1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.55), this.M.ceramic);
    wc1.position.set(-5.7, 0.5, -3.5);
    this.world.add(wc1);
    const wc1Lid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.48), this.M.ceramic);
    wc1Lid.position.set(-5.7, 0.66, -3.5);
    this.world.add(wc1Lid);

    // === FAMILY BATH (back-right, x=[3.8, 6], z=[-4.25, -2.25]) ===
    // Bathtub (freestanding oval)
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.55, 24), this.M.ceramic);
    tub.scale.set(1.1, 1, 2.2);
    tub.position.set(4.5, 0.3, -3.0);
    tub.castShadow = true;
    this.world.add(tub);
    // Tub interior (water-like)
    const tubIn = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.4, 24), this.M.water);
    tubIn.scale.set(1.1, 1, 2.2);
    tubIn.position.set(4.5, 0.42, -3.0);
    this.world.add(tubIn);
    // Floor-standing tap
    const tubTap = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9), this.M.chrome);
    tubTap.position.set(4.5, 0.45, -2.4);
    this.world.add(tubTap);
    const tubTapHead = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.12), this.M.chrome);
    tubTapHead.position.set(4.5, 0.95, -2.45);
    tubTapHead.rotation.x = Math.PI / 2;
    this.world.add(tubTapHead);
    // Vanity (smaller)
    const v2 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.5), this.M.kitchenCabinet);
    v2.position.set(5.5, 0.65, -3.95);
    this.world.add(v2);
    const v2Top = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.55), this.M.kitchenCounter);
    v2Top.position.set(5.5, 0.9, -3.95);
    this.world.add(v2Top);
    // Mirror (rectangular, frameless)
    const m2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.02), this.M.mirror);
    m2.position.set(5.5, 1.65, -4.18);
    this.world.add(m2);
    // WC
    const wc2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.55), this.M.ceramic);
    wc2.position.set(4.0, 0.5, -3.95);
    wc2.rotation.y = Math.PI / 2;
    this.world.add(wc2);

    // === Upgrade features in bathrooms ===

    // Bath Premium — adds heated towel rail + fancier fittings
    this.feature('bathPremium', (g) => {
      // Heated towel rail in en-suite
      for (let i = 0; i < 5; i++) {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5), this.M.chrome);
        rail.rotation.z = Math.PI / 2;
        rail.position.set(-5.55, 0.6 + i * 0.18, -2.5);
        g.add(rail);
      }
      // Side stiles
      for (let s = 0; s < 2; s++) {
        const stile = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9), this.M.chrome);
        stile.position.set(-5.55, 1.0, -2.25 + s * -0.5);
        g.add(stile);
      }
      // Towel
      const towel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.05), 
        new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.85 }));
      towel.position.set(-5.5, 0.85, -2.5);
      g.add(towel);
    });

    // Bath Spa — adds rain shower, marble cladding, plant
    this.feature('bathSpa', (g) => {
      // Marble cladding
      const wall1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 1.0), this.M.kitchenCounter);
      wall1.position.set(-5.95, 1.2, -3.7);
      g.add(wall1);
      // Larger rainfall shower head
      const big = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), this.M.brushedSteel);
      big.position.set(-3.85, 2.4, -3.95);
      g.add(big);
      // Spa plant
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.18), this.M.pot);
      pot.position.set(5.5, 0.09, -2.3);
      g.add(pot);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), this.M.foliage);
      leaf.scale.set(1.0, 0.7, 1.0);
      leaf.position.set(5.5, 0.4, -2.3);
      g.add(leaf);
    });
  }

  // === HALLWAY ==============================================================
  buildHallway() {
    // Built-in storage in hallway centre
    const hStorage = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 1.5), this.M.kitchenCabinet);
    hStorage.position.set(0, 1.2, -3.0);
    hStorage.castShadow = true;
    this.world.add(hStorage);
    // Vertical groove handles
    for (let i = 0; i < 2; i++) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.8, 0.04), this.M.brushedSteel);
      groove.position.set((i - 0.5) * 0.5, 1.2, -2.24);
      this.world.add(groove);
    }
  }

  // === EXTERIOR (terrace, garden, pool) =====================================
  buildExterior() {
    // Terrace floor — stone tiles, in front of south wall
    this.feature('terrace', (g) => {
      const t = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), 
        new THREE.MeshStandardMaterial({ color: 0xa8a09a, roughness: 0.6 }));
      t.rotation.x = -Math.PI / 2;
      t.position.set(0, 0.005, 6.4);
      t.receiveShadow = true;
      g.add(t);
      // Glass balustrade
      for (let s = 0; s < 3; s++) {
        const pane = new THREE.Mesh(new THREE.BoxGeometry(s === 1 ? 9.5 : 4, 1.0, 0.04), this.M.glass);
        if (s === 0) { pane.position.set(0, 0.5, 8.4); }
        else if (s === 1) { pane.position.set(-4.95, 0.5, 6.4); pane.rotation.y = Math.PI / 2; pane.scale.x = 4 / 9.5; }
        else { pane.position.set(4.95, 0.5, 6.4); pane.rotation.y = Math.PI / 2; pane.scale.x = 4 / 9.5; }
        g.add(pane);
      }
      // Outdoor sofa
      const oSofa = new THREE.Group();
      oSofa.position.set(2.5, 0, 7.2);
      const oBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.85), 
        new THREE.MeshStandardMaterial({ color: 0xc8c0a8, roughness: 0.9 }));
      oBase.position.y = 0.25;
      oSofa.add(oBase);
      const oBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.2), 
        new THREE.MeshStandardMaterial({ color: 0xc8c0a8, roughness: 0.9 }));
      oBack.position.set(0, 0.6, -0.32);
      oSofa.add(oBack);
      g.add(oSofa);
      // Outdoor armchairs (2)
      for (let i = 0; i < 2; i++) {
        const oa = new THREE.Group();
        oa.position.set(0.5 + i * 0.9, 0, 7.5);
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), 
          new THREE.MeshStandardMaterial({ color: 0xc8c0a8, roughness: 0.9 }));
        seat.position.y = 0.25;
        oa.add(seat);
        g.add(oa);
      }
      // Coffee table
      const oct = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04), 
        new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.5 }));
      oct.position.set(1.2, 0.32, 7.5);
      g.add(oct);
      // Plants in pots
      for (let i = 0; i < 4; i++) {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.3), this.M.pot);
        pot.position.set(-4 + i * 2.5, 0.15, 8.1);
        g.add(pot);
        const fol = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), this.M.foliage);
        fol.scale.set(1.0, 1.2, 1.0);
        fol.position.set(-4 + i * 2.5, 0.5, 8.1);
        g.add(fol);
      }
      // Dining table on terrace
      const oDining = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 24), 
        new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.5 }));
      oDining.position.set(-3, 0.74, 6.6);
      g.add(oDining);
      const oDiningLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.74), this.M.blackMetal);
      oDiningLeg.position.set(-3, 0.37, 6.6);
      g.add(oDiningLeg);
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        const ch = new THREE.Group();
        ch.position.set(-3 + Math.cos(ang) * 0.95, 0, 6.6 + Math.sin(ang) * 0.95);
        ch.rotation.y = -ang - Math.PI / 2;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), 
          new THREE.MeshStandardMaterial({ color: 0x88826e, roughness: 0.9 }));
        seat.position.y = 0.45;
        ch.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.05), 
          new THREE.MeshStandardMaterial({ color: 0x88826e, roughness: 0.9 }));
        back.position.set(0, 0.7, 0.18);
        ch.add(back);
        g.add(ch);
      }
    });

    // Garden — adds lawn + bigger landscaping (extends terrace)
    this.feature('garden', (g) => {
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), 
        new THREE.MeshStandardMaterial({ color: 0x5a8a4a, roughness: 0.95 }));
      lawn.rotation.x = -Math.PI / 2;
      lawn.position.set(0, 0.02, 9.5);
      g.add(lawn);
      // Topiary
      for (let i = 0; i < 4; i++) {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.35), this.M.pot);
        pot.position.set(-4 + i * 2.5, 0.18, 9);
        g.add(pot);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 8), this.M.foliage);
        top.position.set(-4 + i * 2.5, 0.7, 9);
        g.add(top);
      }
    });

    // Pool — adds an indoor pool (Kensington tier)
    this.feature('pool', (g) => {
      const poolFloor = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 1.6), 
        new THREE.MeshStandardMaterial({ color: 0xb8d4e8, roughness: 0.3 }));
      poolFloor.position.set(0, -0.1, 5.5);
      g.add(poolFloor);
      const poolWater = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.4), this.M.water);
      poolWater.position.set(0, 0.05, 5.5);
      g.add(poolWater);
      // Pool surround
      const surround = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.6), 
        new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.4 }));
      surround.rotation.x = -Math.PI / 2;
      surround.position.set(0, 0.001, 5.5);
      g.add(surround);
    });

    // Smart home — pulses ambient screens (visible cue: extra glowing wall panels)
    this.feature('smartHome', (g) => {
      // Glowing wall panel near entry
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.04), 
        new THREE.MeshStandardMaterial({ color: 0x224466, emissive: 0x0a4a8a, emissiveIntensity: 0.6 }));
      panel.position.set(0, 1.5, -0.1);
      g.add(panel);
    });

    this.feature('smartHomePro', (g) => {
      // Multiple ambient panels
      const positions = [[-2.5, 1.8, -0.1], [2.5, 1.8, -0.1], [0, 1.5, 4.2]];
      positions.forEach(p => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.04), 
          new THREE.MeshStandardMaterial({ color: 0x224466, emissive: 0x0a4a8a, emissiveIntensity: 0.6 }));
        panel.position.set(...p);
        g.add(panel);
      });
    });

    // Gym — adds equipment in a corner
    this.feature('gym', (g) => {
      // Treadmill
      const tBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 1.6), this.M.blackMetal);
      tBase.position.set(-5.3, 0.08, 4.5);
      g.add(tBase);
      const tBelt = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 1.4), 
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }));
      tBelt.position.set(-5.3, 0.16, 4.5);
      g.add(tBelt);
      const tConsole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.04), this.M.tvScreen);
      tConsole.position.set(-5.3, 1.0, 3.85);
      g.add(tConsole);
      // Dumbbells rack
      for (let i = 0; i < 3; i++) {
        const dum = new THREE.Mesh(new THREE.SphereGeometry(0.06), this.M.blackMetal);
        dum.position.set(-5.3, 0.3, 3.5 + i * 0.2);
        g.add(dum);
        const dum2 = new THREE.Mesh(new THREE.SphereGeometry(0.06), this.M.blackMetal);
        dum2.position.set(-5.5, 0.3, 3.5 + i * 0.2);
        g.add(dum2);
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), this.M.brushedSteel);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(-5.4, 0.3, 3.5 + i * 0.2);
        g.add(bar);
      }
    });

    // Distant skyline (for atmosphere through windows)
    const sky = new THREE.Group();
    for (let i = 0; i < 18; i++) {
      const w = 0.8 + Math.random() * 1.5;
      const h = 1.5 + Math.random() * 4;
      const d = 0.8 + Math.random() * 1.5;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), 
        new THREE.MeshStandardMaterial({ color: 0x6a7280 + Math.random() * 0x202020, roughness: 0.7 }));
      b.position.set(-25 + i * 2.8, h / 2, 18);
      sky.add(b);
    }
    this.world.add(sky);
  }

  // ==========================================================================
  // CONTROLS — orbit / top / walk modes, mouse + touch + keyboard
  // ==========================================================================
  initControls() {
    const c = this.renderer.domElement;
    this.cstate = {
      target: new THREE.Vector3(0, 0.8, 0),
      distance: 13,
      azimuth: Math.PI * 0.32,
      polar: 1.05,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      lastTouchDist: 0,
      walkPos: new THREE.Vector3(-2, 1.65, 5.5),
      walkYaw: Math.PI,
      walkPitch: 0,
      walkKeys: { w: false, a: false, s: false, d: false },
      joystickX: 0, // -1..1 for touch joystick
      joystickY: 0,
    };

    // --- Mouse ---
    c.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
    c.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => this.onPointerUp());
    c.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // --- Touch ---
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        this.cstate.lastTouchDist = Math.sqrt(dx*dx + dy*dy);
      }
      e.preventDefault();
    }, { passive: false });
    c.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const delta = dist - this.cstate.lastTouchDist;
        this.onWheel({ deltaY: -delta * 4, preventDefault: () => {} });
        this.cstate.lastTouchDist = dist;
      }
      e.preventDefault();
    }, { passive: false });
    c.addEventListener('touchend', () => this.onPointerUp());

    // --- Keyboard (walk mode) ---
    this.keydown = (e) => {
      if (this.mode !== 'walk') return;
      const k = e.key.toLowerCase();
      if (this.cstate.walkKeys.hasOwnProperty(k)) {
        this.cstate.walkKeys[k] = true;
      }
    };
    this.keyup = (e) => {
      const k = e.key.toLowerCase();
      if (this.cstate.walkKeys.hasOwnProperty(k)) {
        this.cstate.walkKeys[k] = false;
      }
    };
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
  }

  onPointerDown(x, y) {
    this.cstate.isDragging = true;
    this.cstate.lastX = x;
    this.cstate.lastY = y;
  }
  onPointerUp() { this.cstate.isDragging = false; }
  onPointerMove(x, y) {
    if (!this.cstate.isDragging) return;
    const dx = x - this.cstate.lastX;
    const dy = y - this.cstate.lastY;
    this.cstate.lastX = x;
    this.cstate.lastY = y;
    if (this.mode === 'walk') {
      this.cstate.walkYaw -= dx * 0.005;
      this.cstate.walkPitch -= dy * 0.005;
      this.cstate.walkPitch = Math.max(-1.2, Math.min(1.2, this.cstate.walkPitch));
    } else if (this.mode === 'orbit') {
      this.cstate.azimuth -= dx * 0.005;
      this.cstate.polar -= dy * 0.005;
      this.cstate.polar = Math.max(0.1, Math.min(Math.PI - 0.1, this.cstate.polar));
    }
  }
  onWheel(e) {
    e.preventDefault?.();
    if (this.mode === 'orbit') {
      this.cstate.distance *= e.deltaY > 0 ? 1.08 : 0.92;
      this.cstate.distance = Math.max(4, Math.min(30, this.cstate.distance));
    }
  }

  // Touch joystick interface (called from outside)
  setJoystick(x, y) {
    this.cstate.joystickX = x;
    this.cstate.joystickY = y;
  }

  // ==========================================================================
  // CAMERA UPDATE
  // ==========================================================================
  updateCamera(dt) {
    const cs = this.cstate;
    if (this.mode === 'walk') {
      // Walking — keys + joystick
      const speed = 2.5; // m/s
      let fwd = (cs.walkKeys.w ? 1 : 0) - (cs.walkKeys.s ? 1 : 0);
      let right = (cs.walkKeys.d ? 1 : 0) - (cs.walkKeys.a ? 1 : 0);
      // Apply joystick (touch)
      fwd += -cs.joystickY;
      right += cs.joystickX;
      const yaw = cs.walkYaw;
      const dx = (Math.cos(yaw) * right - Math.sin(yaw) * fwd) * speed * dt;
      const dz = (Math.sin(yaw) * right + Math.cos(yaw) * fwd) * speed * dt;
      cs.walkPos.x += dx;
      cs.walkPos.z += dz;
      // Clamp inside apartment
      cs.walkPos.x = Math.max(-5.7, Math.min(5.7, cs.walkPos.x));
      cs.walkPos.z = Math.max(-4.0, Math.min(8.2, cs.walkPos.z));

      this.camera.position.copy(cs.walkPos);
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = cs.walkYaw;
      this.camera.rotation.x = cs.walkPitch;
      this.camera.fov = 75;
      this.camera.near = 0.05;
      this.camera.updateProjectionMatrix();
    } else if (this.mode === 'top') {
      this.camera.position.set(0, 18, 0.01);
      this.camera.up.set(0, 0, -1);
      this.camera.lookAt(0, 0, 0);
      this.camera.fov = 32;
      this.camera.updateProjectionMatrix();
    } else {
      // Orbit
      const x = cs.target.x + cs.distance * Math.sin(cs.polar) * Math.cos(cs.azimuth);
      const y = cs.target.y + cs.distance * Math.cos(cs.polar);
      const z = cs.target.z + cs.distance * Math.sin(cs.polar) * Math.sin(cs.azimuth);
      this.camera.position.set(x, y, z);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(cs.target);
      this.camera.fov = 55;
      this.camera.updateProjectionMatrix();
    }
  }

  // ==========================================================================
  // TIME OF DAY — adjusts lighting + sky color
  // ==========================================================================
  applyTime() {
    const t = this.timeOfDay;
    if (t === 'day') {
      this.scene.background = new THREE.Color(0xb8c8d8);
      this.lights.hemi.intensity = 0.55;
      this.lights.hemi.color.set(0xfff5e0);
      this.lights.key.intensity = 1.2;
      this.lights.key.color.set(0xffe8c8);
      this.lights.fill.intensity = 0.4;
      this.lights.bounce.intensity = 0.25;
      this.interiorLights.forEach(l => l.intensity = 0);
      this.renderer.toneMappingExposure = 1.0;
    } else if (t === 'evening') {
      this.scene.background = new THREE.Color(0x6a4a4a);
      this.lights.hemi.intensity = 0.3;
      this.lights.hemi.color.set(0xff9a60);
      this.lights.key.intensity = 0.6;
      this.lights.key.color.set(0xff8a40);
      this.lights.fill.intensity = 0.15;
      this.lights.bounce.intensity = 0.1;
      this.interiorLights.forEach(l => l.intensity = 1.5);
      this.renderer.toneMappingExposure = 0.95;
    } else { // night
      this.scene.background = new THREE.Color(0x101220);
      this.lights.hemi.intensity = 0.08;
      this.lights.hemi.color.set(0x4060a0);
      this.lights.key.intensity = 0.05;
      this.lights.key.color.set(0x4a5a80);
      this.lights.fill.intensity = 0.05;
      this.lights.bounce.intensity = 0;
      this.interiorLights.forEach(l => l.intensity = 2.5);
      this.renderer.toneMappingExposure = 0.85;
    }
  }

  // ==========================================================================
  // FEATURES — flip visibility per upgrade state
  // ==========================================================================
  applyFeatures() {
    Object.entries(this.featureGroups).forEach(([name, groups]) => {
      const visible = this.featureSet.has(name);
      groups.forEach(g => g.visible = visible);
    });
  }

  // ==========================================================================
  // PUBLIC API: update / setMode / setTime / destroy / setRoof
  // ==========================================================================
  update(opts = {}) {
    let needsRebuild = false;
    if (opts.tier !== undefined && opts.tier !== this.tier) {
      this.tier = opts.tier;
      needsRebuild = true;
    }
    if (opts.upgrades !== undefined) {
      this.upgradeIds = opts.upgrades;
      this.featureSet = computeFeatures(this.upgradeIds);
    }
    if (needsRebuild) {
      // Tier change requires full rebuild (palette swap)
      this.world.clear();
      this.featureGroups = {};
      this.buildAll();
    }
    this.applyFeatures();
  }

  setMode(mode) {
    this.mode = mode;
    // Reset walk position when entering walk mode
    if (mode === 'walk') {
      this.cstate.walkPos.set(0, 1.65, 5.5);
      this.cstate.walkYaw = Math.PI;
      this.cstate.walkPitch = 0;
    }
  }

  setTime(t) {
    this.timeOfDay = t;
    this.applyTime();
  }

  setRoof(visible) {
    this.ceilingGroup.visible = visible;
  }

  // ==========================================================================
  // RENDER LOOP
  // ==========================================================================
  startLoop() {
    let last = performance.now();
    const loop = () => {
      if (this.disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.updateCamera(dt);
      this.renderer.render(this.scene, this.camera);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.disposed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.ro) this.ro.disconnect();
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup);
    // Dispose textures + geometries + materials
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
    this.renderer.dispose();
    this.container.innerHTML = '';
  }
}
