// ─── ROOM EDITOR ──────────────────────────────────────────────────────────────
// In-game visual editor for layouts. Lets you (and your girlfriend) customise
// every aspect of a property without editing JSON:
//
//   - Resize the apartment (drag outer wall corners)
//   - Add/remove interior walls (click two grid points)
//   - Define rooms (click inside an enclosed area, pick type/floor/wall)
//   - Add windows + doors (click on a perimeter wall)
//   - Place starter furniture (drag from sidebar)
//   - Add atmospheric damage (peeling paint, damp, cobwebs, etc)
//   - Configure pest infestations
//   - Save (to localStorage) and export JSON
//
// All edits are saved per-property. Original defaults remain untouched.
// =============================================================================

const Editor = {
  // State
  active: false,
  propId: null,
  layout: null,
  tool: 'select',     // 'select' | 'resize' | 'wall' | 'room' | 'window' | 'door' | 'furn' | 'damage' | 'pests' | 'erase'
  toolParam: null,    // depends on tool: damage type, furniture id, etc.
  selected: null,     // { type: 'furn'|'wall'|'window'|'door', index, ... }
  wallStart: null,    // for two-click wall placement
  history: [],        // undo stack (last 30)
  redoStack: [],

  // ─── Lifecycle ───────────────────────────────────────────────────────
  open(propId) {
    this.active = true;
    this.propId = propId;
    // Deep clone so editing doesn't mutate the default
    this.layout = JSON.parse(JSON.stringify(getLayout(propId)));
    this.tool = 'select';
    this.toolParam = null;
    this.selected = null;
    this.history = [];
    this.redoStack = [];
    this.saveSnapshot();  // initial state
    Pests.start();
    show('editor');
    this.render();
  },

  close() {
    this.active = false;
    this.layout = null;
    Pests.stop();
    Pests.clear();
    show('listing');
  },

  // ─── Persistence ─────────────────────────────────────────────────────
  saveCurrent() {
    if (!this.layout) return;
    saveCustomLayout(this.propId, this.layout);
    toast('💾 Saved to browser', true);
  },

  resetToDefault() {
    if (!confirm('Reset this property to default layout? Your customisations will be lost.')) return;
    resetLayoutToDefault(this.propId);
    this.layout = JSON.parse(JSON.stringify(getLayout(this.propId)));
    this.history = [];
    this.saveSnapshot();
    this.render();
    toast('Reset to default', true);
  },

  exportJSON() {
    const json = JSON.stringify(this.layout, null, 2);
    // Show in a textarea modal for copy
    const modal = document.getElementById('editor-modal');
    document.getElementById('editor-modal-title').textContent = 'Export layout JSON';
    document.getElementById('editor-modal-body').innerHTML = `
      <p style="font-size:12px;color:#5A6878;margin-bottom:10px">Copy this JSON to back up or share. Paste into the Import box on another device to load it.</p>
      <textarea readonly style="width:100%;height:300px;font-family:Menlo,monospace;font-size:11px;padding:10px;border:1px solid #ccc;border-radius:6px">${this.escapeHtml(json)}</textarea>
      <button class="btn-primary" style="margin-top:10px;width:100%" onclick="navigator.clipboard.writeText(document.querySelector('#editor-modal textarea').value);toast('Copied to clipboard',true)">📋 Copy to clipboard</button>
    `;
    modal.classList.remove('hidden');
  },

  importJSON() {
    const modal = document.getElementById('editor-modal');
    document.getElementById('editor-modal-title').textContent = 'Import layout JSON';
    document.getElementById('editor-modal-body').innerHTML = `
      <p style="font-size:12px;color:#5A6878;margin-bottom:10px">Paste a layout JSON below to import it. This replaces the current layout for this property.</p>
      <textarea id="editor-import-textarea" placeholder="{...}" style="width:100%;height:240px;font-family:Menlo,monospace;font-size:11px;padding:10px;border:1px solid #ccc;border-radius:6px"></textarea>
      <button class="btn-primary" style="margin-top:10px;width:100%" onclick="Editor.applyImport()">↪️ Import</button>
    `;
    modal.classList.remove('hidden');
  },

  applyImport() {
    const ta = document.getElementById('editor-import-textarea');
    try {
      const obj = JSON.parse(ta.value);
      this.saveSnapshot();
      this.layout = makeLayout(obj);
      this.render();
      this.closeModal();
      toast('Imported successfully', true);
    } catch (e) {
      toast('Invalid JSON: ' + e.message, false);
    }
  },

  closeModal() {
    document.getElementById('editor-modal').classList.add('hidden');
  },

  escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },

  // ─── Undo/redo ───────────────────────────────────────────────────────
  saveSnapshot() {
    this.history.push(JSON.stringify(this.layout));
    if (this.history.length > 30) this.history.shift();
    this.redoStack = [];
  },

  undo() {
    if (this.history.length < 2) return;
    this.redoStack.push(this.history.pop());
    this.layout = JSON.parse(this.history[this.history.length - 1]);
    this.render();
  },

  redo() {
    if (!this.redoStack.length) return;
    const snap = this.redoStack.pop();
    this.history.push(snap);
    this.layout = JSON.parse(snap);
    this.render();
  },

  // ─── Tools ───────────────────────────────────────────────────────────
  setTool(tool, param = null) {
    this.tool = tool;
    this.toolParam = param;
    this.wallStart = null;
    this.selected = null;
    this.render();
  },

  // ─── Apartment dimension changes ─────────────────────────────────────
  resizeApartment(deltaW, deltaH) {
    this.saveSnapshot();
    this.layout.gridW = Math.max(3, Math.min(30, this.layout.gridW + deltaW));
    this.layout.gridH = Math.max(3, Math.min(20, this.layout.gridH + deltaH));
    // Clip rooms / walls / windows that go outside new bounds
    this.layout.rooms = this.layout.rooms.map(r => ({
      ...r,
      w: Math.min(r.w, this.layout.gridW - r.x),
      h: Math.min(r.h, this.layout.gridH - r.z),
    })).filter(r => r.w > 0 && r.h > 0 && r.x < this.layout.gridW && r.z < this.layout.gridH);
    this.render();
  },

  setCeilingHeight(h) {
    this.saveSnapshot();
    this.layout.ceilingHeight = Math.max(2.0, Math.min(5.0, h));
    this.render();
  },

  setBgColor(color) {
    this.saveSnapshot();
    this.layout.bgColor = color;
    this.render();
  },

  // ─── Click handler ───────────────────────────────────────────────────
  handleSceneClick(evt) {
    const svg = evt.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    // Compute origin within the SVG (matches renderer)
    const W = this.layout.gridW, H = this.layout.gridH;
    const originX = H * TILE_W / 2 + 20;
    const originY = 80;
    const tile = screenToTile(cursor.x, cursor.y, originX, originY);

    // Reject clicks outside grid bounds
    if (tile.x < 0 || tile.x >= W || tile.z < 0 || tile.z >= H) return;

    if (this.tool === 'wall') {
      this.handleWallClick(tile);
    } else if (this.tool === 'room') {
      this.handleRoomClick(tile);
    } else if (this.tool === 'furn') {
      this.handleFurnClick(tile);
    } else if (this.tool === 'damage') {
      this.handleDamageClick(tile);
    } else if (this.tool === 'erase') {
      this.handleEraseClick(tile);
    } else if (this.tool === 'window' || this.tool === 'door') {
      this.handleWindowDoorClick(tile);
    } else {
      this.handleSelectClick(tile);
    }
  },

  handleWallClick(tile) {
    // Snap click to nearest grid intersection
    const x = Math.round(tile.gxFloat);
    const z = Math.round(tile.gzFloat);
    if (!this.wallStart) {
      this.wallStart = { x, z };
      toast(`Wall start: (${x}, ${z}). Click end point.`, true);
      this.render();
      return;
    }
    // Place wall from wallStart to (x, z)
    const x1 = Math.min(this.wallStart.x, x), x2 = Math.max(this.wallStart.x, x);
    const z1 = Math.min(this.wallStart.z, z), z2 = Math.max(this.wallStart.z, z);
    if (x1 === x2 && z1 === z2) { this.wallStart = null; return; }
    this.saveSnapshot();
    this.layout.walls.push({ x1, z1, x2, z2 });
    this.wallStart = null;
    this.render();
    toast('Wall added', true);
  },

  handleRoomClick(tile) {
    if (!this.toolParam) {
      toast('Pick a room type first', false);
      return;
    }
    // Find existing room at this tile
    const idx = this.layout.rooms.findIndex(r =>
      tile.x >= r.x && tile.x < r.x + r.w &&
      tile.z >= r.z && tile.z < r.z + r.h
    );
    this.saveSnapshot();
    if (idx >= 0) {
      // Update existing room with new properties
      const r = this.layout.rooms[idx];
      if (this.toolParam.type) r.type = this.toolParam.type;
      if (this.toolParam.floor) r.floor = this.toolParam.floor;
      if (this.toolParam.wall) r.wall = this.toolParam.wall;
    } else {
      // Add a new 1×1 room (player can resize via select tool)
      this.layout.rooms.push({
        id: 'room_' + Date.now(),
        x: tile.x, z: tile.z, w: 1, h: 1,
        type: this.toolParam.type || 'living',
        floor: this.toolParam.floor || 'oak',
        wall: this.toolParam.wall || 'paint_cream',
      });
    }
    this.render();
  },

  handleFurnClick(tile) {
    if (!this.toolParam) return;
    const id = this.toolParam;
    const f = FURNITURE[id];
    if (!f) return;
    // Check footprint fits
    const [fw, fh] = f.footprint;
    if (tile.x + fw > this.layout.gridW || tile.z + fh > this.layout.gridH) {
      toast('Doesn\'t fit here', false);
      return;
    }
    this.saveSnapshot();
    this.layout.starterFurniture.push({
      id, gridX: tile.x, gridZ: tile.z, rot: 0,
      _key: 'sf_' + Date.now(),
    });
    this.render();
  },

  handleDamageClick(tile) {
    if (!this.toolParam) return;
    this.saveSnapshot();
    if (!this.layout.damage) this.layout.damage = {};
    if (!this.layout.damage[this.toolParam]) this.layout.damage[this.toolParam] = [];
    this.layout.damage[this.toolParam].push({
      x: tile.x, z: tile.z,
      side: 'north',
      corner: 'NW',
    });
    this.render();
  },

  handleEraseClick(tile) {
    // Try to find what to erase at this tile, in priority order
    // 1. Furniture
    const furnIdx = this.layout.starterFurniture.findIndex(item => {
      const [fw, fh] = getFurnitureFootprint(item.id, item.rot);
      return tile.x >= item.gridX && tile.x < item.gridX + fw &&
             tile.z >= item.gridZ && tile.z < item.gridZ + fh;
    });
    if (furnIdx >= 0) {
      this.saveSnapshot();
      this.layout.starterFurniture.splice(furnIdx, 1);
      this.render();
      toast('Removed', true);
      return;
    }
    // 2. Damage
    if (this.layout.damage) {
      for (const dtype of Object.keys(this.layout.damage)) {
        const dIdx = this.layout.damage[dtype].findIndex(d => d.x === tile.x && d.z === tile.z);
        if (dIdx >= 0) {
          this.saveSnapshot();
          this.layout.damage[dtype].splice(dIdx, 1);
          this.render();
          toast(`Removed ${DAMAGE_TYPES[dtype]?.label || dtype}`, true);
          return;
        }
      }
    }
    // 3. Walls
    const wallIdx = this.layout.walls.findIndex(w =>
      (w.x1 === tile.x && w.z1 === tile.z) || (w.x2 === tile.x && w.z2 === tile.z)
    );
    if (wallIdx >= 0) {
      this.saveSnapshot();
      this.layout.walls.splice(wallIdx, 1);
      this.render();
      toast('Wall removed', true);
    }
  },

  handleWindowDoorClick(tile) {
    // Determine which perimeter wall is closest
    const W = this.layout.gridW, H = this.layout.gridH;
    let wall, start;
    if (tile.z === 0) { wall = 'north'; start = tile.x; }
    else if (tile.z === H - 1) { wall = 'south'; start = tile.x; }
    else if (tile.x === 0) { wall = 'west'; start = tile.z; }
    else if (tile.x === W - 1) { wall = 'east'; start = tile.z; }
    else { toast('Click on a perimeter wall', false); return; }

    this.saveSnapshot();
    if (this.tool === 'window') {
      this.layout.windows.push({ wall, start, length: 1, sill: 0.9, height: 1.4, style: 'sash' });
    } else {
      this.layout.doors.push({ wall, start, width: 1, type: 'interior' });
    }
    this.render();
  },

  handleSelectClick(tile) {
    // Find furniture at click
    const furnIdx = this.layout.starterFurniture.findIndex(item => {
      const [fw, fh] = getFurnitureFootprint(item.id, item.rot);
      return tile.x >= item.gridX && tile.x < item.gridX + fw &&
             tile.z >= item.gridZ && tile.z < item.gridZ + fh;
    });
    if (furnIdx >= 0) {
      const item = this.layout.starterFurniture[furnIdx];
      if (!item._key) item._key = 'sf_' + Date.now();
      this.selected = { type: 'furn', index: furnIdx, key: item._key };
      this.render();
      return;
    }
    this.selected = null;
    this.render();
  },

  // Move selected furniture by delta tiles
  moveSelected(dx, dz) {
    if (!this.selected || this.selected.type !== 'furn') return;
    const item = this.layout.starterFurniture[this.selected.index];
    const [fw, fh] = getFurnitureFootprint(item.id, item.rot);
    const nx = Math.max(0, Math.min(this.layout.gridW - fw, item.gridX + dx));
    const nz = Math.max(0, Math.min(this.layout.gridH - fh, item.gridZ + dz));
    if (nx === item.gridX && nz === item.gridZ) return;
    this.saveSnapshot();
    item.gridX = nx;
    item.gridZ = nz;
    this.render();
  },

  rotateSelected() {
    if (!this.selected || this.selected.type !== 'furn') return;
    this.saveSnapshot();
    const item = this.layout.starterFurniture[this.selected.index];
    item.rot = ((item.rot || 0) + 90) % 360;
    this.render();
  },

  deleteSelected() {
    if (!this.selected) return;
    this.saveSnapshot();
    if (this.selected.type === 'furn') {
      this.layout.starterFurniture.splice(this.selected.index, 1);
    }
    this.selected = null;
    this.render();
  },

  // ─── Pests ───────────────────────────────────────────────────────────
  togglePest(type) {
    this.saveSnapshot();
    if (!this.layout.pests) this.layout.pests = [];
    const idx = this.layout.pests.findIndex(p => p.type === type);
    if (idx >= 0) {
      this.layout.pests.splice(idx, 1);
    } else {
      this.layout.pests.push({ type, count: 3 });
    }
    this.render();
  },

  spawnTestPests(type) {
    Pests.spawn(type, 3, { durationMs: 6000 });
  },

  // ─── Render the whole editor screen ──────────────────────────────────
  render() {
    if (!this.active) return;
    const root = document.getElementById('s-editor');
    if (!root) return;

    root.innerHTML = `
      <div class="ed-root">
        <!-- Top bar -->
        <div class="ed-topbar">
          <button class="ed-btn-icon" onclick="Editor.close()" title="Close">⬅</button>
          <div class="ed-title">
            <input class="ed-name-input" value="${this.escapeHtml(this.layout.name)}" oninput="Editor.layout.name=this.value">
            <span class="ed-meta">${this.layout.gridW}×${this.layout.gridH} · ${this.layout.starterFurniture.length} items</span>
          </div>
          <button class="ed-btn-icon" onclick="Editor.undo()" title="Undo">↶</button>
          <button class="ed-btn-icon" onclick="Editor.redo()" title="Redo">↷</button>
          <button class="ed-btn-icon" onclick="Editor.exportJSON()" title="Export">📤</button>
          <button class="ed-btn-icon" onclick="Editor.importJSON()" title="Import">📥</button>
          <button class="ed-btn-icon ed-save" onclick="Editor.saveCurrent()" title="Save">💾</button>
        </div>

        <!-- Main scene -->
        <div class="ed-scene-wrap" id="ed-scene-wrap">
          <div class="ed-scene" id="ed-scene"></div>
          ${this.renderSelectionControls()}
        </div>

        <!-- Tool panels -->
        <div class="ed-tools">
          <div class="ed-tool-tabs">
            ${this.renderToolTab('select', '👆', 'Select')}
            ${this.renderToolTab('resize', '↔️', 'Size')}
            ${this.renderToolTab('room', '🏠', 'Rooms')}
            ${this.renderToolTab('wall', '🧱', 'Walls')}
            ${this.renderToolTab('window', '🪟', 'Window')}
            ${this.renderToolTab('door', '🚪', 'Door')}
            ${this.renderToolTab('furn', '🛋️', 'Furniture')}
            ${this.renderToolTab('damage', '💥', 'Damage')}
            ${this.renderToolTab('pests', '🐀', 'Pests')}
            ${this.renderToolTab('erase', '🗑️', 'Erase')}
          </div>

          <div class="ed-tool-panel">
            ${this.renderActivePanel()}
          </div>
        </div>
      </div>

      <!-- Modal for export/import dialogs -->
      <div id="editor-modal" class="ed-modal hidden">
        <div class="ed-modal-content">
          <div class="ed-modal-head">
            <h3 id="editor-modal-title">Modal</h3>
            <button onclick="Editor.closeModal()">✕</button>
          </div>
          <div id="editor-modal-body"></div>
        </div>
      </div>
    `;

    // Render the scene SVG
    const sceneEl = document.getElementById('ed-scene');
    sceneEl.innerHTML = renderLayoutSVG(this.layout, {
      placedFurniture: this.layout.starterFurniture,
      showGrid: true,
      editorMode: true,
      selectedItemId: this.selected?.key,
    });

    // Wire up click handler on the SVG
    const svg = sceneEl.querySelector('svg');
    if (svg) {
      svg.style.cursor = this.tool === 'select' ? 'pointer' : 'crosshair';
      svg.addEventListener('click', (e) => this.handleSceneClick(e));
    }

    // Set pest layer
    const pestLayer = sceneEl.querySelector('#pest-layer');
    if (pestLayer) {
      Pests.containerEl = pestLayer;
      // Bounds: roughly the iso scene area in scene-local coords
      const W = this.layout.gridW, H = this.layout.gridH;
      Pests.setBounds({
        x: -H * TILE_W / 2 + 30,
        y: 30,
        w: (W + H) * TILE_W / 2 - 60,
        h: (W + H) * TILE_H / 2,
      });
      Pests.setInfestation(this.layout.pests);
    }
  },

  renderToolTab(id, emoji, label) {
    return `<button class="ed-tab ${this.tool === id ? 'active' : ''}" onclick="Editor.setTool('${id}')"><span>${emoji}</span><span>${label}</span></button>`;
  },

  renderActivePanel() {
    switch (this.tool) {
      case 'select': return this.renderSelectPanel();
      case 'resize': return this.renderResizePanel();
      case 'room': return this.renderRoomPanel();
      case 'wall': return this.renderWallPanel();
      case 'window': return this.renderWindowPanel();
      case 'door': return this.renderDoorPanel();
      case 'furn': return this.renderFurniturePanel();
      case 'damage': return this.renderDamagePanel();
      case 'pests': return this.renderPestsPanel();
      case 'erase': return this.renderErasePanel();
      default: return '';
    }
  },

  renderSelectPanel() {
    if (this.selected && this.selected.type === 'furn') {
      const item = this.layout.starterFurniture[this.selected.index];
      const f = FURNITURE[item.id];
      return `
        <h4>Selected: ${f?.emoji || ''} ${f?.name || item.id}</h4>
        <p style="font-size:12px;color:#5A6878">At tile (${item.gridX}, ${item.gridZ}) · Rot ${item.rot}°</p>
        <div class="ed-row">
          <button class="btn" onclick="Editor.moveSelected(0,-1)">⬆️</button>
          <button class="btn" onclick="Editor.moveSelected(-1,0)">⬅️</button>
          <button class="btn" onclick="Editor.moveSelected(1,0)">➡️</button>
          <button class="btn" onclick="Editor.moveSelected(0,1)">⬇️</button>
          <button class="btn" onclick="Editor.rotateSelected()">↻ Rotate</button>
          <button class="btn btn-danger" onclick="Editor.deleteSelected()">🗑️ Delete</button>
        </div>
      `;
    }
    return `<p style="font-size:12px;color:#5A6878;padding:8px">Click any item in the scene to select it. Then move, rotate, or delete.</p>`;
  },

  renderResizePanel() {
    return `
      <h4>Apartment dimensions</h4>
      <div class="ed-row">
        <span style="font-size:11px">Width: ${this.layout.gridW}m</span>
        <button class="btn" onclick="Editor.resizeApartment(-1, 0)">−</button>
        <button class="btn" onclick="Editor.resizeApartment(1, 0)">+</button>
      </div>
      <div class="ed-row">
        <span style="font-size:11px">Depth: ${this.layout.gridH}m</span>
        <button class="btn" onclick="Editor.resizeApartment(0, -1)">−</button>
        <button class="btn" onclick="Editor.resizeApartment(0, 1)">+</button>
      </div>
      <div class="ed-row">
        <span style="font-size:11px">Ceiling: ${this.layout.ceilingHeight}m</span>
        <button class="btn" onclick="Editor.setCeilingHeight(${this.layout.ceilingHeight - 0.2})">−</button>
        <button class="btn" onclick="Editor.setCeilingHeight(${this.layout.ceilingHeight + 0.2})">+</button>
      </div>
      <h4 style="margin-top:14px">Background colour</h4>
      <div class="ed-color-grid">
        ${COLOR_PALETTE.map(c => `<button class="ed-color" style="background:${c}" onclick="Editor.setBgColor('${c}')" title="${c}"></button>`).join('')}
      </div>
    `;
  },

  renderRoomPanel() {
    const types = ['living', 'bedroom', 'bathroom', 'kitchen', 'hallway'];
    const tp = this.toolParam || {};
    return `
      <h4>Click a tile to set room properties</h4>
      <p style="font-size:11px;color:#5A6878;margin-bottom:8px">Click inside an existing room to change its type/floor/wall, or click empty space to add a new room.</p>
      <div class="ed-section-label">Room type</div>
      <div class="ed-row">
        ${types.map(t => `<button class="btn ${tp.type === t ? 'active' : ''}" onclick="Editor.toolParam = {...(Editor.toolParam||{}), type: '${t}'}; Editor.render()">${t}</button>`).join('')}
      </div>
      <div class="ed-section-label">Floor</div>
      <div class="ed-row" style="flex-wrap:wrap">
        ${Object.entries(FLOOR_TYPES).map(([k, v]) => `<button class="btn ed-swatch ${tp.floor === k ? 'active' : ''}" onclick="Editor.toolParam = {...(Editor.toolParam||{}), floor: '${k}'}; Editor.render()" style="background:${v.color}" title="${v.label}"></button>`).join('')}
      </div>
      <div class="ed-section-label">Wall colour</div>
      <div class="ed-color-grid">
        ${COLOR_PALETTE.map(c => `<button class="ed-color ${tp.wallColor === c ? 'active' : ''}" style="background:${c}" onclick="
          Editor.toolParam = {...(Editor.toolParam||{}), wall: 'paint_cream', wallColor: '${c}'};
          Editor.render();
        " title="${c}"></button>`).join('')}
      </div>
      <div class="ed-section-label">Wall style preset</div>
      <div class="ed-row" style="flex-wrap:wrap">
        ${Object.entries(WALL_TYPES).map(([k, v]) => `<button class="btn ${tp.wall === k ? 'active' : ''}" onclick="Editor.toolParam = {...(Editor.toolParam||{}), wall: '${k}'}; Editor.render()">${v.label}</button>`).join('')}
      </div>
    `;
  },

  renderWallPanel() {
    return `
      <h4>Add wall</h4>
      <p style="font-size:12px;color:#5A6878">Click two grid points on the scene to draw a wall between them.${this.wallStart ? ` <b>Start: (${this.wallStart.x}, ${this.wallStart.z})</b> — click end point.` : ''}</p>
      <div style="margin-top:8px">
        <button class="btn" onclick="Editor.wallStart=null; Editor.render()">Cancel start point</button>
      </div>
      <h4 style="margin-top:14px">Existing walls (${this.layout.walls.length})</h4>
      <div style="font-size:11px;color:#5A6878;max-height:120px;overflow:auto">
        ${this.layout.walls.map((w, i) => `(${w.x1},${w.z1}) → (${w.x2},${w.z2}) <button class="btn-tiny" onclick="Editor.saveSnapshot();Editor.layout.walls.splice(${i},1);Editor.render()">×</button>`).join('<br>')}
      </div>
    `;
  },

  renderWindowPanel() {
    return `
      <h4>Add window</h4>
      <p style="font-size:12px;color:#5A6878">Click on a perimeter wall (north / south / east / west edge) to place a window.</p>
      <h4 style="margin-top:14px">Existing windows (${this.layout.windows.length})</h4>
      <div style="font-size:11px;color:#5A6878;max-height:120px;overflow:auto">
        ${this.layout.windows.map((w, i) => `${w.wall} from ${w.start} (length ${w.length}) <button class="btn-tiny" onclick="Editor.saveSnapshot();Editor.layout.windows.splice(${i},1);Editor.render()">×</button>`).join('<br>')}
      </div>
    `;
  },

  renderDoorPanel() {
    return `
      <h4>Add door</h4>
      <p style="font-size:12px;color:#5A6878">Click on a perimeter wall to place a door.</p>
      <h4 style="margin-top:14px">Existing doors (${this.layout.doors.length})</h4>
      <div style="font-size:11px;color:#5A6878;max-height:120px;overflow:auto">
        ${this.layout.doors.map((d, i) => `${d.wall || 'interior'} ${d.type || ''} <button class="btn-tiny" onclick="Editor.saveSnapshot();Editor.layout.doors.splice(${i},1);Editor.render()">×</button>`).join('<br>')}
      </div>
    `;
  },

  renderFurniturePanel() {
    const cats = furnitureCategories();
    return `
      <h4>Place starter furniture</h4>
      <p style="font-size:11px;color:#5A6878">Pick an item below, then click anywhere on the scene to place.</p>
      ${cats.map(cat => {
        const items = furnitureByCategory(cat);
        if (!items.length) return '';
        return `
          <div class="ed-section-label" style="text-transform:capitalize">${cat}</div>
          <div class="ed-furn-grid">
            ${items.map(f => `
              <button class="ed-furn-tile ${this.toolParam === f.id ? 'active' : ''}" onclick="Editor.toolParam='${f.id}'; Editor.render()">
                <div class="ed-furn-emoji">${f.emoji}</div>
                <div class="ed-furn-name">${f.name}</div>
                <div class="ed-furn-foot">${f.footprint[0]}×${f.footprint[1]}</div>
              </button>
            `).join('')}
          </div>
        `;
      }).join('')}
    `;
  },

  renderDamagePanel() {
    return `
      <h4>Add atmospheric damage</h4>
      <p style="font-size:11px;color:#5A6878">Pick a damage type, then click on a tile to place.</p>
      <div class="ed-row" style="flex-wrap:wrap">
        ${Object.entries(DAMAGE_TYPES).map(([k, v]) => `
          <button class="btn ${this.toolParam === k ? 'active' : ''}" onclick="Editor.toolParam='${k}'; Editor.render()">
            ${v.emoji} ${v.label}
          </button>
        `).join('')}
      </div>
      <h4 style="margin-top:14px">Current damage</h4>
      <div style="font-size:11px;color:#5A6878">
        ${Object.entries(this.layout.damage || {}).map(([k, arr]) =>
          `${DAMAGE_TYPES[k]?.emoji || '·'} ${DAMAGE_TYPES[k]?.label || k}: ${arr.length}`
        ).join(' · ') || 'None'}
      </div>
    `;
  },

  renderPestsPanel() {
    return `
      <h4>Pest infestations</h4>
      <p style="font-size:11px;color:#5A6878">Toggle pest types on/off. They'll scuttle around when this layout is loaded.</p>
      <div class="ed-row" style="flex-wrap:wrap">
        ${PEST_TYPE_LIST.map(t => {
          const active = (this.layout.pests || []).some(p => p.type === t);
          const def = PEST_DEFS[t];
          return `<button class="btn ${active ? 'active' : ''}" onclick="Editor.togglePest('${t}')">${def.emoji} ${def.label}</button>`;
        }).join('')}
      </div>
      <h4 style="margin-top:14px">Test spawn (one-shot)</h4>
      <p style="font-size:11px;color:#5A6878">Spawn pests for 6 seconds to test the animation.</p>
      <div class="ed-row" style="flex-wrap:wrap">
        ${PEST_TYPE_LIST.map(t => `<button class="btn" onclick="Editor.spawnTestPests('${t}')">${PEST_DEFS[t].emoji} 3× ${PEST_DEFS[t].label}</button>`).join('')}
      </div>
    `;
  },

  renderErasePanel() {
    return `
      <h4>Erase</h4>
      <p style="font-size:12px;color:#5A6878">Click anything in the scene to remove it (furniture, damage, walls).</p>
      <button class="btn btn-danger" style="margin-top:10px" onclick="Editor.resetToDefault()">⚠️ Reset entire layout to default</button>
    `;
  },

  renderSelectionControls() {
    if (!this.selected || this.selected.type !== 'furn') return '';
    const item = this.layout.starterFurniture[this.selected.index];
    const f = FURNITURE[item.id];
    return `
      <div class="ed-floating-controls">
        <span style="font-weight:700">${f?.emoji || ''} ${f?.name || ''}</span>
        <button class="btn-tiny" onclick="Editor.rotateSelected()">↻</button>
        <button class="btn-tiny" onclick="Editor.deleteSelected()">🗑️</button>
      </div>
    `;
  },
};

// Expose globally
window.Editor = Editor;
