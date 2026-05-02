// ─── PEST ANIMATION SYSTEM ────────────────────────────────────────────────────
// Renders animated pests scuttling across the apartment when triggered.
// Each pest type has a different sprite + movement pattern + lifespan.
//
// Triggered by:
//   - Layout's `pests` array (always-on infestation)
//   - Complaint events (Pests.spawn('rats', count: 3, durationMs: 5000))
//   - Test mode buttons (one of each kind)
//
// Animation runs as a setInterval on the pest layer; pests move along procedural
// paths and fade out / disappear when they exit or expire.
// =============================================================================

const Pests = {
  active: [],
  intervalId: null,
  containerEl: null,
  apartmentBounds: { x: 0, y: 0, w: 600, h: 400 }, // updated by editor
  listeners: [],

  init(containerEl, bounds) {
    this.containerEl = containerEl;
    if (bounds) this.apartmentBounds = bounds;
    this.start();
  },

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 50);
  },

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  },

  clear() {
    this.active = [];
    this.render();
  },

  // Spawn pests of given type. Returns array of pest objects.
  spawn(type, count = 1, opts = {}) {
    const dur = opts.durationMs ?? 8000;
    const persistent = opts.persistent ?? false;
    const b = this.apartmentBounds;
    const newPests = [];
    for (let i = 0; i < count; i++) {
      // Spawn at random edge of apartment
      const edge = Math.floor(Math.random() * 4);
      let sx, sy, sdx, sdy;
      if (edge === 0) { sx = b.x; sy = b.y + Math.random() * b.h; sdx = 1; sdy = 0; }
      else if (edge === 1) { sx = b.x + b.w; sy = b.y + Math.random() * b.h; sdx = -1; sdy = 0; }
      else if (edge === 2) { sx = b.x + Math.random() * b.w; sy = b.y; sdx = 0; sdy = 1; }
      else { sx = b.x + Math.random() * b.w; sy = b.y + b.h; sdx = 0; sdy = -1; }

      const speed = PEST_DEFS[type]?.speed ?? 1.0;
      const pest = {
        id: 'pest_' + Math.random().toString(36).slice(2, 9),
        type,
        x: sx, y: sy,
        vx: (Math.random() * 0.4 + 0.6) * sdx * speed * 1.5,
        vy: (Math.random() * 0.4 + 0.6) * sdy * speed * 1.5,
        wiggle: Math.random() * Math.PI * 2,
        bornAt: Date.now(),
        ttl: persistent ? Infinity : dur,
        rot: 0,
        scale: 2.2 + Math.random() * 0.8,  // bigger so visible at scene scale
        nextDecisionAt: Date.now() + 200 + Math.random() * 500,
      };
      this.active.push(pest);
      newPests.push(pest);
    }
    this.render();
    return newPests;
  },

  // Set always-on infestation from a layout's pests array
  setInfestation(pestArray) {
    this.active = this.active.filter(p => !p.persistent);
    if (!pestArray || !pestArray.length) return;
    pestArray.forEach(({ type, count }) => {
      this.spawn(type, count || 2, { persistent: true, durationMs: Infinity });
    });
  },

  tick() {
    if (!this.active.length) return;
    const now = Date.now();
    const b = this.apartmentBounds;

    for (const p of this.active) {
      // Add wiggle to motion
      p.wiggle += 0.3;
      const wobble = Math.sin(p.wiggle) * 0.6;
      const def = PEST_DEFS[p.type] ?? PEST_DEFS.rats;
      const wiggleAmount = def.wiggle ?? 0.6;

      p.x += p.vx + wobble * wiggleAmount * (p.vy === 0 ? 0 : 1);
      p.y += p.vy + wobble * wiggleAmount * (p.vx === 0 ? 0 : 1);

      // Random direction changes
      if (now > p.nextDecisionAt) {
        const turn = (Math.random() - 0.5) * Math.PI * 0.5;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || def.speed;
        const newAngle = Math.atan2(p.vy, p.vx) + turn;
        p.vx = Math.cos(newAngle) * speed;
        p.vy = Math.sin(newAngle) * speed;
        p.nextDecisionAt = now + 200 + Math.random() * 800;
      }

      // Compute rotation from velocity
      p.rot = Math.atan2(p.vy, p.vx) * 180 / Math.PI;

      // Bounce off bounds
      if (p.x < b.x) { p.x = b.x; p.vx = Math.abs(p.vx); }
      if (p.x > b.x + b.w) { p.x = b.x + b.w; p.vx = -Math.abs(p.vx); }
      if (p.y < b.y) { p.y = b.y; p.vy = Math.abs(p.vy); }
      if (p.y > b.y + b.h) { p.y = b.y + b.h; p.vy = -Math.abs(p.vy); }
    }

    // Cull expired pests (non-persistent)
    this.active = this.active.filter(p => p.ttl === Infinity || (now - p.bornAt) < p.ttl);

    this.render();
  },

  setBounds(bounds) {
    this.apartmentBounds = bounds;
  },

  // Render to the container as inline SVG
  render() {
    if (!this.containerEl) return;
    const now = Date.now();
    const parts = this.active.map(p => {
      const def = PEST_DEFS[p.type] ?? PEST_DEFS.rats;
      const age = now - p.bornAt;
      const fadeIn = Math.min(1, age / 300);
      // Last 800ms fade out (only for non-persistent)
      let fadeOut = 1;
      if (p.ttl !== Infinity) {
        const remaining = p.ttl - age;
        fadeOut = Math.min(1, remaining / 800);
      }
      const alpha = Math.max(0, fadeIn * fadeOut);
      return `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)}) scale(${p.scale.toFixed(2)})" opacity="${alpha.toFixed(2)}">${def.svg}</g>`;
    });
    this.containerEl.innerHTML = parts.join('');
  },
};

// =============================================================================
// PEST SPRITE LIBRARY — each is a small SVG drawn at origin (0,0), facing right
// =============================================================================
const PEST_DEFS = {
  rats: {
    label: 'Rats',
    emoji: '🐀',
    speed: 2.5,
    wiggle: 0.5,
    svg: `
      <ellipse cx="-2" cy="0" rx="9" ry="4" fill="#5a4838"/>
      <ellipse cx="-2" cy="-1" rx="8" ry="3" fill="#7a6450"/>
      <circle cx="6" cy="-1" r="3.5" fill="#5a4838"/>
      <circle cx="7" cy="-2" r="0.7" fill="#1a1a1a"/>
      <ellipse cx="4" cy="-3" rx="1.5" ry="1.2" fill="#3a2818"/>
      <line x1="-10" y1="0" x2="-18" y2="2" stroke="#3a2818" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="-2" cy="3" rx="1.5" ry="1" fill="#3a2818"/>
      <ellipse cx="2" cy="3" rx="1.5" ry="1" fill="#3a2818"/>
    `,
  },
  mice: {
    label: 'Mice',
    emoji: '🐁',
    speed: 3.5,
    wiggle: 0.7,
    svg: `
      <ellipse cx="-1" cy="0" rx="5" ry="2.5" fill="#a89c88"/>
      <circle cx="3.5" cy="-0.5" r="2.2" fill="#a89c88"/>
      <circle cx="4.5" cy="-1" r="0.5" fill="#1a1a1a"/>
      <ellipse cx="2" cy="-2" rx="1" ry="0.8" fill="#7a6450"/>
      <line x1="-6" y1="0" x2="-12" y2="1" stroke="#7a6450" stroke-width="0.8" stroke-linecap="round"/>
    `,
  },
  cockroaches: {
    label: 'Cockroaches',
    emoji: '🪳',
    speed: 3.0,
    wiggle: 1.0,
    svg: `
      <ellipse cx="0" cy="0" rx="6" ry="3" fill="#3a2010"/>
      <ellipse cx="-1" cy="-1" rx="5" ry="2" fill="#5a3018"/>
      <line x1="3" y1="-1" x2="6" y2="-3" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="3" y1="-1" x2="7" y2="-1" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="-2" y1="2" x2="-4" y2="4" stroke="#1a1a1a" stroke-width="0.5"/>
      <line x1="2" y1="2" x2="4" y2="4" stroke="#1a1a1a" stroke-width="0.5"/>
      <line x1="-2" y1="-2" x2="-4" y2="-4" stroke="#1a1a1a" stroke-width="0.5"/>
      <line x1="2" y1="-2" x2="4" y2="-4" stroke="#1a1a1a" stroke-width="0.5"/>
    `,
  },
  ants: {
    label: 'Ants',
    emoji: '🐜',
    speed: 4.0,
    wiggle: 0.4,
    svg: `
      <circle cx="-3" cy="0" r="1.4" fill="#1a1a1a"/>
      <circle cx="0" cy="0" r="1.2" fill="#1a1a1a"/>
      <circle cx="3" cy="0" r="1.5" fill="#1a1a1a"/>
      <line x1="3" y1="-1" x2="5" y2="-3" stroke="#1a1a1a" stroke-width="0.4"/>
      <line x1="3" y1="-1" x2="6" y2="-1" stroke="#1a1a1a" stroke-width="0.4"/>
      <line x1="0" y1="1" x2="1" y2="3" stroke="#1a1a1a" stroke-width="0.4"/>
      <line x1="0" y1="-1" x2="1" y2="-3" stroke="#1a1a1a" stroke-width="0.4"/>
      <line x1="-1" y1="1" x2="-2" y2="3" stroke="#1a1a1a" stroke-width="0.4"/>
      <line x1="-1" y1="-1" x2="-2" y2="-3" stroke="#1a1a1a" stroke-width="0.4"/>
    `,
  },
  bedbugs: {
    label: 'Bedbugs',
    emoji: '🛏️',
    speed: 1.0,
    wiggle: 0.2,
    svg: `
      <ellipse cx="0" cy="0" rx="2.5" ry="2" fill="#7a2010"/>
      <ellipse cx="0" cy="-0.5" rx="2" ry="1.5" fill="#a83018"/>
      <line x1="-2" y1="-1" x2="-3" y2="-2" stroke="#1a1a1a" stroke-width="0.3"/>
    `,
  },
  flies: {
    label: 'Flies',
    emoji: '🪰',
    speed: 5.0,
    wiggle: 1.5,
    svg: `
      <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="#1a2818"/>
      <ellipse cx="0" cy="-1.5" rx="3" ry="1.2" fill="#a8c8d8" opacity="0.6"/>
      <ellipse cx="0" cy="1.5" rx="3" ry="1.2" fill="#a8c8d8" opacity="0.6"/>
      <circle cx="2" cy="-0.5" r="0.4" fill="#c84040"/>
    `,
  },
  spiders: {
    label: 'Spiders',
    emoji: '🕷️',
    speed: 2.0,
    wiggle: 0.3,
    svg: `
      <ellipse cx="0" cy="0" rx="3" ry="2.5" fill="#1a1a1a"/>
      <line x1="-2" y1="0" x2="-7" y2="-3" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="-2" y1="0" x2="-7" y2="0" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="-2" y1="0" x2="-7" y2="3" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="-2" y1="0" x2="-5" y2="5" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="2" y1="0" x2="7" y2="-3" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="2" y1="0" x2="7" y2="0" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="2" y1="0" x2="7" y2="3" stroke="#1a1a1a" stroke-width="0.6"/>
      <line x1="2" y1="0" x2="5" y2="5" stroke="#1a1a1a" stroke-width="0.6"/>
    `,
  },
  silverfish: {
    label: 'Silverfish',
    emoji: '🐟',
    speed: 3.5,
    wiggle: 1.2,
    svg: `
      <ellipse cx="0" cy="0" rx="5" ry="1.5" fill="#a8c0d0"/>
      <ellipse cx="0" cy="0" rx="4.5" ry="1" fill="#c8d8e4"/>
      <line x1="-5" y1="0" x2="-8" y2="-1" stroke="#7a8898" stroke-width="0.4"/>
      <line x1="-5" y1="0" x2="-8" y2="1" stroke="#7a8898" stroke-width="0.4"/>
      <line x1="5" y1="-0.5" x2="7" y2="-1.5" stroke="#7a8898" stroke-width="0.3"/>
      <line x1="5" y1="0.5" x2="7" y2="1.5" stroke="#7a8898" stroke-width="0.3"/>
    `,
  },
};

// Pest type IDs for buttons / iteration
const PEST_TYPE_LIST = ['rats', 'mice', 'cockroaches', 'ants', 'bedbugs', 'flies', 'spiders', 'silverfish'];
