// ─── GAME STATE ──────────────────────────────────────────────────────────────
const UNLOCK_THRESHOLDS = [0, 1000, 2000, 4000, 8000, 16000];

const RATINGS = [
  { min: -99999, max: 0, label: 'Hosting disaster', emoji: '🔥' },
  { min: 1, max: 499, label: 'Accidental host', emoji: '😅' },
  { min: 500, max: 999, label: 'Getting there', emoji: '🏠' },
  { min: 1000, max: 1999, label: 'Solid host', emoji: '⭐' },
  { min: 2000, max: 3999, label: 'Superhost', emoji: '🌟' },
  { min: 4000, max: 7999, label: 'Elite host', emoji: '💎' },
  { min: 8000, max: 999999, label: 'Legendary host', emoji: '🏆' },
];

function getRat(s) { return RATINGS.find(r => s >= r.min && s <= r.max) || RATINGS[0]; }

// Renders the property hero illustration. Layer order (bottom → top):
//   1. Hero asset SVG illustration (the "exterior view" of the property)
//   2. HD photo (public/images/property-N.jpg) — covers the SVG when present
// If the photo is missing, the onerror handler removes it and the hand-drawn
// SVG illustration shows through.
function renderPropertyHero(propId, ownedUpgrades, width = 600) {
  const heroSvg = renderHeroAsset(propId);
  return `${heroSvg}<img class="prop-hero-img" src="/images/property-${propId}.jpg" alt="" onerror="this.remove()">`;
}

const G = {
  name: '',
  pts: 0,
  upgrades: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
  activeProp: 1,
  testMode: false,  // Set true to enable Test Sandbox property + £100k starting cash
  shopProp: 1,
  curQ: null,
  usedQ: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  lb: [],
  selectedOpt: null,
};

function getBaseIncome(propId) { return [80, 140, 220, 350, 500, 800][propId - 1]; }
function getIncomeBonus(propId) {
  const owned = G.upgrades[propId] || [];
  const p = PROPS.find(x => x.id === propId);
  return owned.reduce((sum, uid) => {
    const u = p.upgrades.find(x => x.id === uid);
    return sum + (u ? u.income : 0);
  }, 0);
}
function getCurrentIncome(propId) { return getBaseIncome(propId) + getIncomeBonus(propId); }
function isUnlocked(id) {
  // Test sandbox (id 7) is always unlocked (only shown in test mode anyway)
  if (id === 7) return true;
  return G.pts >= UNLOCK_THRESHOLDS[id - 1];
}
function getNextUnlock() {
  for (let i = 1; i <= 5; i++) {
    if (G.pts < UNLOCK_THRESHOLDS[i]) return { propId: i + 1, threshold: UNLOCK_THRESHOLDS[i] };
  }
  return null;
}

function getMaxUnlocked() {
  let m = 1;
  for (let i = 1; i < 6; i++) if (G.pts >= UNLOCK_THRESHOLDS[i]) m = i + 1;
  return m;
}

// ─── SCREEN ROUTING ──────────────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('s-' + id).classList.remove('hidden');
  window.scrollTo(0, 0);
  if (id === 'intro') renderLadder();
  if (id === 'listing') renderListing();
  if (id === 'shop') renderShop();
  if (id === 'leaderboard') renderLB();
}

// ─── INTRO SCREEN ────────────────────────────────────────────────────────────
function renderLadder() {
  const el = document.getElementById('ladder');
  if (!el) return;
  el.innerHTML = PROPS.map(p => `
    <div class="ladder-card" style="border-color:${p.border}">
      <div class="ladder-icon" style="background:linear-gradient(135deg, ${p.light}, ${p.col}22)">
        ${getPropIcon(p.id)}
      </div>
      <div class="ladder-name" style="color:${p.col}">${p.short}</div>
    </div>
  `).join('');
}

// Mini-icon SVGs for the ladder (just the building silhouette)
function getPropIcon(id) {
  const c = PROPS.find(p => p.id === id).col;
  const icons = {
    1: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="22" width="32" height="32" fill="#fff" stroke="${c}" stroke-width="1"/><polygon points="14,22 30,8 46,22" fill="${c}" opacity="0.7"/><rect x="20" y="30" width="8" height="10" fill="${c}" opacity="0.4"/><rect x="32" y="30" width="8" height="10" fill="${c}" opacity="0.4"/><rect x="26" y="44" width="8" height="10" fill="${c}" opacity="0.6"/></svg>`,
    2: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="14" width="44" height="40" fill="${c}" opacity="0.85"/><rect x="14" y="20" width="10" height="14" fill="#fff" opacity="0.4"/><rect x="26" y="20" width="10" height="14" fill="#fff" opacity="0.4"/><rect x="38" y="20" width="10" height="14" fill="#fff" opacity="0.4"/><rect x="14" y="38" width="10" height="14" fill="#fff" opacity="0.4"/><rect x="26" y="38" width="10" height="14" fill="#fff" opacity="0.4"/><rect x="38" y="38" width="10" height="14" fill="#fff" opacity="0.4"/></svg>`,
    3: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="14" height="36" fill="#fff" stroke="${c}" stroke-width="1"/><rect x="22" y="14" width="16" height="40" fill="#FFFAF0" stroke="${c}" stroke-width="1"/><rect x="38" y="20" width="14" height="34" fill="#fff" stroke="${c}" stroke-width="1"/><polygon points="8,18 15,10 22,18" fill="${c}" opacity="0.5"/><polygon points="22,14 30,6 38,14" fill="${c}" opacity="0.7"/><polygon points="38,20 45,12 52,20" fill="${c}" opacity="0.5"/></svg>`,
    4: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="20" width="36" height="34" fill="#fff" stroke="${c}" stroke-width="1"/><rect x="12" y="20" width="36" height="3" fill="${c}" opacity="0.7"/><g fill="${c}" opacity="0.3"><rect x="16" y="27" width="6" height="6"/><rect x="24" y="27" width="6" height="6"/><rect x="32" y="27" width="6" height="6"/><rect x="40" y="27" width="6" height="6"/><rect x="16" y="36" width="6" height="6"/><rect x="24" y="36" width="6" height="6"/><rect x="32" y="36" width="6" height="6"/><rect x="40" y="36" width="6" height="6"/><rect x="16" y="45" width="6" height="6"/><rect x="24" y="45" width="6" height="6"/><rect x="32" y="45" width="6" height="6"/><rect x="40" y="45" width="6" height="6"/></g><circle cx="48" cy="14" r="5" fill="#F5A623" opacity="0.7"/></svg>`,
    5: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="22" width="48" height="32" fill="#F5F1E8" stroke="${c}" stroke-width="1"/><polygon points="6,22 30,8 54,22" fill="${c}" opacity="0.85"/><rect x="28" y="14" width="4" height="6" fill="#F5A623"/><g fill="${c}" opacity="0.6"><rect x="12" y="28" width="2" height="22"/><rect x="20" y="28" width="2" height="22"/><rect x="28" y="28" width="2" height="22"/><rect x="36" y="28" width="2" height="22"/><rect x="44" y="28" width="2" height="22"/></g><rect x="11" y="26" width="38" height="2" fill="${c}" opacity="0.7"/><rect x="11" y="50" width="38" height="2" fill="${c}" opacity="0.7"/><rect x="26" y="40" width="8" height="14" fill="${c}" opacity="0.4"/></svg>`,
  };
  return icons[id] || '';
}

// ─── START GAME ──────────────────────────────────────────────────────────────
function startGame() {
  const n = document.getElementById('nameInput').value.trim();
  if (!n) { toast('Enter a name first', false); return; }
  G.name = n;
  // Test mode: type the name "test" or "TEST" to unlock the sandbox property
  // with £100k starting cash and access to the Test Sandbox tile.
  G.testMode = n.toLowerCase() === 'test';
  G.pts = G.testMode ? 100000 : 0;
  G.upgrades = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  G.usedQ = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  G.activeProp = 1;
  G.shopProp = G.testMode ? 7 : 1;  // jump straight to test sandbox
  show('listing');
  if (G.testMode) toast('🧪 Test mode enabled · £100,000 starting cash', true);
}

// ─── LISTING SCREEN ──────────────────────────────────────────────────────────
function renderListing() {
  document.getElementById('lh-name').textContent = G.name;
  document.getElementById('lh-pts').textContent = '£' + G.pts.toLocaleString();
  const r = getRat(G.pts);
  document.getElementById('lh-rating').textContent = `${r.emoji} ${r.label}`;
  document.getElementById('lh-avatar').innerHTML = renderHost(r, 64);

  const next = getNextUnlock();
  if (next) {
    const pct = Math.min(100, Math.round((G.pts / next.threshold) * 100));
    const np = PROPS.find(p => p.id === next.propId);
    document.getElementById('lh-unlock-label').textContent = `Next: ${np.short}`;
    document.getElementById('lh-unlock-target').textContent = `£${G.pts.toLocaleString()} / £${next.threshold.toLocaleString()}`;
    document.getElementById('lh-unlock-bar').style.width = pct + '%';
  } else {
    document.getElementById('lh-unlock-label').textContent = 'All unlocked';
    document.getElementById('lh-unlock-target').textContent = '🏆 Legendary';
    document.getElementById('lh-unlock-bar').style.width = '100%';
  }

  const el = document.getElementById('listing-cards');
  el.innerHTML = '';
  // Hide test sandbox property from non-test runs
  PROPS.filter(p => !p.test || G.testMode).forEach(p => {
    const locked = !isUnlocked(p.id);
    const owned = G.upgrades[p.id] || [];
    const pct = Math.round((owned.length / p.upgrades.length) * 100);
    const income = getCurrentIncome(p.id);
    const threshold = UNLOCK_THRESHOLDS[p.id - 1] ?? 0;
    const isComplete = owned.length >= p.upgrades.length;

    // Test sandbox is always unlocked + has its own status badge
    const isTest = !!p.test;
    const statusClass = isTest ? 'active' : (locked ? 'locked-tag' : (isComplete ? 'complete' : 'active'));
    const statusText = isTest ? '🧪 SANDBOX'
      : (locked ? `EARN £${threshold.toLocaleString()}` : (isComplete ? 'FULLY UPGRADED' : `+£${income}/CORRECT`));

    const card = document.createElement('div');
    card.className = 'prop-card' + (locked ? ' locked' : '');
    card.innerHTML = `
      <div class="prop-card-top" style="background:${p.col}"></div>
      ${!locked ? `<div class="prop-model">${renderPropertyHero(p.id, G.upgrades, 600)}</div>` : ''}
      <div class="prop-info">
        <div class="prop-info-head">
          <div>
            <div class="prop-info-title">${p.name}</div>
            <div class="prop-info-meta">${p.type} · ${p.short}</div>
          </div>
          <span class="prop-status ${statusClass}">${statusText}</span>
        </div>
        <p style="font-size:13px;color:#6B7280;line-height:1.55;margin-bottom:14px">${p.desc}</p>
        <div class="prop-progress"><span>UPGRADES</span><span style="color:${p.col}">${owned.length} / ${p.upgrades.length}</span></div>
        <div class="prop-progress-bar"><div class="prop-progress-fill" style="width:${pct}%;background:${p.col}"></div></div>
        ${!locked && !isComplete ? `<button class="btn-navy" onclick="startHosting(${p.id})" style="background:${p.col}">Host at this property →</button>` : ''}
        ${!locked && isComplete ? `<button class="btn-ghost" onclick="G.shopProp=${p.id};show('shop')">View shop →</button>` : ''}
        ${!locked ? `<button class="btn-editor" onclick="Editor.open(${p.id})">🛠 EDIT ROOM</button>` : ''}
      </div>
    `;
    el.appendChild(card);
  });
}

// ─── QUIZ FLOW ───────────────────────────────────────────────────────────────
function startHosting(propId) {
  G.activeProp = propId;
  G.curQ = pickQuestion(propId);
  G.selectedOpt = null;
  renderQuiz();
  show('quiz');
}

function pickQuestion(propId) {
  const qs = ALL_QUESTIONS[propId];
  const used = G.usedQ[propId] || [];
  const available = qs.filter((_, i) => !used.includes(i));
  if (available.length === 0) {
    G.usedQ[propId] = [];
    return qs[Math.floor(Math.random() * qs.length)];
  }
  const picked = available[Math.floor(Math.random() * available.length)];
  const idx = qs.indexOf(picked);
  G.usedQ[propId] = [...used, idx];
  return picked;
}

function renderQuiz() {
  const p = PROPS.find(x => x.id === G.activeProp);
  const q = G.curQ;
  const income = getCurrentIncome(G.activeProp);

  document.getElementById('q-propname').textContent = p.name.toUpperCase();
  document.getElementById('q-propname').style.color = p.col;
  document.getElementById('q-progress').textContent = `${p.short} · +£${income} per correct answer`;
  document.getElementById('q-pts').textContent = '£' + G.pts.toLocaleString();

  // Drama flag
  const drama = document.getElementById('q-drama');
  drama.classList.toggle('hidden', !q.drama);

  // Character state — driven by mood string for extreme emotions
  let charState = (typeof getStateFromMood === 'function') ? getStateFromMood(q.mood) : 'complaining';
  if (charState === 'neutral') {
    charState = q.drama ? 'angry' : (q.mood && q.mood.includes('🥰') ? 'happy' : 'complaining');
  }
  document.getElementById('q-character').innerHTML = renderCharacter(q.icon, charState, 100);

  // Scenario prop (horse, dog, party, etc.) — floating in stage corner
  const propHTML = (typeof renderScenarioProp === 'function') ? renderScenarioProp(q.icon, 90) : '';
  let propEl = document.getElementById('q-scenario-prop');
  if (!propEl) {
    propEl = document.createElement('div');
    propEl.id = 'q-scenario-prop';
    propEl.className = 'scenario-prop';
    const stage = document.getElementById('q-stage');
    if (stage) stage.appendChild(propEl);
  }
  propEl.innerHTML = propHTML;
  propEl.style.display = propHTML ? 'block' : 'none';

  // DAMAGE OVERLAY — visible problem indicator on top of scenario stage
  let dmgEl = document.getElementById('q-damage');
  if (!dmgEl) {
    dmgEl = document.createElement('div');
    dmgEl.id = 'q-damage';
    dmgEl.className = 'damage-overlay-host';
    dmgEl.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5;';
    const stage = document.getElementById('q-stage');
    if (stage) stage.appendChild(dmgEl);
  }
  if (q.damage && typeof renderDamageOverlay === 'function') {
    dmgEl.innerHTML = renderDamageOverlay(q.damage, 600, 360);
    dmgEl.style.display = 'block';
  } else {
    dmgEl.innerHTML = '';
    dmgEl.style.display = 'none';
  }

  // Speech bubble
  const bubble = document.getElementById('q-bubble');
  bubble.innerHTML = `
    <div style="font-size:11px;font-weight:800;color:#1C2280;margin-bottom:4px;letter-spacing:0.05em">${q.guest.toUpperCase()} · ${q.mood}</div>
    <div id="q-scenario">"${q.scenario}"</div>
  `;

  // Property hero (2D illustration with HD photo overlay if available)
  document.getElementById('q-minihome').innerHTML = renderPropertyHero(G.activeProp, G.upgrades, 600);

  // Options
  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  q.options.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${o.text}</span>`;
    btn.onclick = () => answerOption(i);
    opts.appendChild(btn);
  });

  // Hide feedback
  document.getElementById('q-feedback').classList.add('hidden');
}

function answerOption(idx) {
  if (G.selectedOpt !== null) return;
  G.selectedOpt = idx;
  const q = G.curQ;
  const opt = q.options[idx];
  const p = PROPS.find(x => x.id === G.activeProp);

  // Calculate income gained
  const baseIncome = getCurrentIncome(G.activeProp);
  let earned = opt.pts;
  // If marked good, give base income; if bad, the negative score IS the loss
  if (opt.good) earned = opt.pts + baseIncome;

  G.pts += earned;
  if (G.pts < 0) G.pts = 0;

  // Update money display
  document.getElementById('q-pts').textContent = '£' + G.pts.toLocaleString();

  // Visual feedback
  showCoinFx(earned);

  // Style options
  const optBtns = document.querySelectorAll('#q-options .option-btn');
  optBtns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === idx) {
      btn.classList.add(opt.good ? 'correct' : 'wrong');
    } else {
      btn.classList.add('dim');
    }
  });

  // Update character to show reaction (happy if you helped, angry if you didn't)
  const newState = opt.good ? 'happy' : 'angry';
  document.getElementById('q-character').innerHTML = renderCharacter(q.icon, newState, 100);

  // Stage shake on bad
  if (!opt.good) {
    const stage = document.getElementById('q-stage');
    stage.classList.add('shake');
    setTimeout(() => stage.classList.remove('shake'), 500);
  } else {
    // Confetti for big wins
    if (earned >= 200) confetti(20);
  }

  // Show feedback
  document.getElementById('q-reaction').textContent = opt.reaction;
  document.getElementById('q-tip').textContent = '💡 ' + q.tip;
  document.getElementById('q-feedback').classList.remove('hidden');

  // Check for unlocks
  checkUnlock();
}

function checkUnlock() {
  const max = getMaxUnlocked();
  if (max > 1 && !G._unlocked) G._unlocked = {};
  for (let i = 2; i <= 6; i++) {
    if (G.pts >= UNLOCK_THRESHOLDS[i - 1] && !(G._unlocked && G._unlocked[i])) {
      G._unlocked = G._unlocked || {};
      G._unlocked[i] = true;
      const p = PROPS.find(x => x.id === i);
      setTimeout(() => toast(`🔓 ${p.short} unlocked!`, true), 800);
    }
  }
}

function nextQuestion() {
  G.curQ = pickQuestion(G.activeProp);
  G.selectedOpt = null;
  renderQuiz();
}

// ─── SHOP ────────────────────────────────────────────────────────────────────
function renderShop() {
  // Tabs (filter test sandbox unless testMode is on)
  const tabs = document.getElementById('shop-tabs');
  tabs.innerHTML = '';
  PROPS.filter(p => !p.test || G.testMode).forEach(p => {
    const locked = !isUnlocked(p.id);
    const active = G.shopProp === p.id;
    const btn = document.createElement('button');
    btn.style.cssText = `flex:1;min-width:80px;padding:8px 10px;border-radius:10px;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;letter-spacing:0.04em;transition:all 0.2s;${active ? `background:${p.col};color:#fff;border:none` : `background:#fff;color:${locked ? '#bbb' : p.col};border:1.5px solid ${locked ? '#eee' : p.border}`};${locked ? 'opacity:0.5;cursor:not-allowed' : ''}`;
    btn.textContent = p.short.toUpperCase();
    btn.onclick = () => { if (!locked) { G.shopProp = p.id; renderShop(); } };
    tabs.appendChild(btn);
  });

  const p = PROPS.find(x => x.id === G.shopProp);
  document.getElementById('shop-prop').textContent = p.name;
  document.getElementById('shop-pts').textContent = '£' + G.pts.toLocaleString();

  // Property hero (2D illustration with HD photo overlay if available)
  document.getElementById('shop-model').innerHTML = renderPropertyHero(G.shopProp, G.upgrades, 600);

  // Upgrade grid
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  const owned = G.upgrades[G.shopProp] || [];
  p.upgrades.forEach(u => {
    const isOwned = owned.includes(u.id);
    const canAfford = G.pts >= u.cost;
    const item = document.createElement('button');
    item.className = 'shop-item' + (isOwned ? ' owned' : '');
    item.disabled = isOwned || !canAfford;
    // Look up real-world product teaser if available
    const featured = (typeof getFeaturedProduct === 'function')
      ? getFeaturedProduct(u.id, G.shopProp)
      : null;
    const teaser = (typeof renderProductTeaser === 'function' && featured)
      ? renderProductTeaser(featured)
      : '';
    item.innerHTML = `
      <div class="shop-emoji">${u.emoji}</div>
      <div class="shop-name">${u.name}</div>
      <div class="shop-desc">${u.desc}</div>
      <div class="shop-cost">
        <span>${isOwned ? '✓ Owned' : '£' + u.cost}</span>
        <span class="shop-income">+£${u.income}/correct</span>
      </div>
      ${teaser}
    `;
    if (!isOwned) item.onclick = () => buyUpgrade(G.shopProp, u.id);
    grid.appendChild(item);
  });
}

function buyUpgrade(propId, uid) {
  const p = PROPS.find(x => x.id === propId);
  const u = p.upgrades.find(x => x.id === uid);
  if (G.pts < u.cost) { toast('Not enough funds!', false); return; }
  if ((G.upgrades[propId] || []).includes(uid)) { toast('Already owned', false); return; }
  G.pts -= u.cost;
  G.upgrades[propId] = [...(G.upgrades[propId] || []), uid];
  toast(`${u.emoji} ${u.name} added! +£${u.income}/correct`, true);
  showCoinFx(-u.cost);
  renderShop();
  // Affiliate moment: if this upgrade has a featured real-world product, offer
  // a non-intrusive CTA after the user has just expressed buying intent in-game.
  if (typeof getFeaturedProduct === 'function') {
    const featured = getFeaturedProduct(uid, propId);
    if (featured) showProductCta(featured);
  }
}

// Non-blocking CTA card that surfaces a real-world equivalent of what the
// user just bought. User can dismiss or click through (affiliate URL).
function showProductCta(product) {
  // Remove any existing CTA
  const existing = document.getElementById('product-cta');
  if (existing) existing.remove();
  const cta = document.createElement('div');
  cta.id = 'product-cta';
  cta.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    background:#fff;border:2px solid #1C2280;border-radius:14px;
    padding:14px 18px;display:flex;gap:14px;align-items:center;
    box-shadow:0 12px 32px rgba(0,0,0,0.25);z-index:9999;
    max-width:480px;width:calc(100% - 32px);
    animation:ctaSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;
  cta.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}"
         style="width:64px;height:64px;object-fit:cover;border-radius:8px;flex-shrink:0;background:#eee"
         onerror="this.style.display='none'"/>
    <div style="flex:1;min-width:0">
      <div style="font-size:10px;font-weight:800;color:#6AAF2E;text-transform:uppercase;letter-spacing:0.05em">Loved that upgrade?</div>
      <div style="font-size:13px;font-weight:800;color:#1C2280;line-height:1.3;margin-top:2px">Get the real ${product.name}</div>
      <div style="font-size:11px;color:#666;margin-top:1px">${product.retailer} · ${product.price}</div>
    </div>
    <a href="${buildAffiliateUrl(product)}" target="_blank" rel="noopener nofollow sponsored"
       onclick="trackProductClick('${product.id}','${product.retailer}'); document.getElementById('product-cta').remove()"
       style="font-size:12px;font-weight:800;color:#fff;background:#1C2280;padding:10px 14px;border-radius:8px;text-decoration:none;white-space:nowrap;flex-shrink:0">
      Shop →
    </a>
    <button onclick="document.getElementById('product-cta').remove()"
            style="background:none;border:none;font-size:18px;color:#999;cursor:pointer;padding:4px;line-height:1;flex-shrink:0">✕</button>
  `;
  document.body.appendChild(cta);
  // Auto-dismiss after 12 seconds
  setTimeout(() => { const e = document.getElementById('product-cta'); if (e) e.remove(); }, 12000);
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
async function saveLB() {
  const r = getRat(G.pts);
  const entry = { name: G.name, score: G.pts, rating: r.label, date: new Date().toLocaleDateString('en-GB') };
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (res.ok) { const data = await res.json(); G.lb = data.entries || []; return; }
  } catch {}
  try {
    let lb = JSON.parse(localStorage.getItem('ptk-lb') || '[]');
    lb = [...lb, entry].sort((a, b) => b.score - a.score).slice(0, 20);
    localStorage.setItem('ptk-lb', JSON.stringify(lb));
    G.lb = lb;
  } catch {}
}

async function renderLB() {
  let lb = G.lb;
  if (!lb || !lb.length) {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) { const data = await res.json(); lb = data.entries || []; }
    } catch {}
    if (!lb || !lb.length) {
      try { lb = JSON.parse(localStorage.getItem('ptk-lb') || '[]'); } catch { lb = []; }
    }
  }
  const el = document.getElementById('lb-rows');
  el.innerHTML = '';
  if (!lb.length) {
    el.innerHTML = `<div style="text-align:center;padding:48px 24px;color:#9AA3B2;font-size:14px">No scores yet — be the first legendary host!</div>`;
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  lb.forEach((e, i) => {
    const r = getRat(e.score);
    const row = document.createElement('div');
    row.className = 'lb-row' + (i === 0 ? ' first' : '');
    row.innerHTML = `
      <span class="lb-medal">${medals[i] || '#' + (i + 1)}</span>
      <div class="lb-name">
        <div>${escapeHtml(e.name)}</div>
        <div style="font-size:11px;color:#9AA3B2;font-weight:500;margin-top:2px">${r.emoji} ${r.label} · ${e.date}</div>
      </div>
      <div class="lb-score">£${e.score.toLocaleString()}</div>
    `;
    el.appendChild(row);
  });
}

// ─── HELPERS / FX ────────────────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg, good) {
  const el = document.createElement('div');
  el.className = 'toast ' + (good ? 'good' : 'bad');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function showCoinFx(amount) {
  const el = document.createElement('div');
  el.className = 'coin-fx ' + (amount >= 0 ? 'pos' : 'neg');
  el.textContent = (amount > 0 ? '+£' : '-£') + Math.abs(amount).toLocaleString();
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function confetti(count) {
  const colors = ['#F5A623', '#6AAF2E', '#1C2280', '#E91E63', '#FFD700'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = (40 + Math.random() * 30) + '%';
    piece.style.top = '20%';
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--cx', (Math.random() * 200 - 100) + 'px');
    piece.style.setProperty('--cy', (200 + Math.random() * 200) + 'px');
    piece.style.animationDelay = (i * 0.04) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  show('intro');
  document.getElementById('nameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') startGame();
  });
});
