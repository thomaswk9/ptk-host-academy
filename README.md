# PTK Host Academy — v6 (Visual Storytelling Edition)

A short-let hosting simulator featuring **6 London properties**, **94 dramatic guest scenarios**, animated SVG characters with extreme emotional expressions, isometric model homes that visibly transform as you buy upgrades, and visible damage overlays for every guest crisis.

## What's new in v6

- **Empty rooms now look like real apartments.** Every room ships with starter
  furniture appropriate to its kind — sofa + lamp + coffee table + framed art
  in the living room; bed + wardrobe + bedside lamp in the bedroom; counter +
  fridge + hob + sink in the kitchen; tub + toilet + sink + mirror in the
  bathroom; tiered terraces or simple gardens outdoors. Tier-1 properties
  show worn fabrics and a slightly crooked picture; Covent Garden uses
  refined oak tones.
- **Architectural style picker** — Georgian (Chelsea, Mayfair) ships with
  six-pane sash windows, central mullion, pediment and painted sill;
  Victorian (Notting Hill) gets bay-window arched tops with decorative arc;
  Edwardian (Kensington) gets mullioned smaller panes with Tudor timber
  strips; Modern (Shoreditch, Covent Garden) gets plate glass with steel
  accent.
- **10 new emotion states** — guests now visibly *rage* (red skin, bulging
  eyes, vein pulse, body jitter), *cry* with streaming tears, *weep* with
  scrunched eyes and dual tear streams + body bob, are *sleepless* (heavy
  red eye bags, bloodshot lines), *terrified* (pale blue, sweat drops,
  shaking), *disgusted* (green tint, sick mouth), *drunk* (X-eyes, pink
  cheeks, swaying), *embarrassed*, *shocked* and *smug*.
- **29 damage overlays** — leaks drip from ceiling stains, mould blooms
  pulse on walls, cockroaches scuttle, fire flickers, snow falls in
  freezing scenarios, party strobes flash with floating music notes,
  stained sheets show blood blooms, hidden cameras blink red REC, paparazzi
  flash bursts fire, smashed vases scatter shards, drug aftermath shows
  white powder lines and beer bottles, brothel red lighting glows with
  XXX neon, and 17 more.
- **25 new real-world scenarios with middle-ground choices** — Marta's
  broken bed (Yerevan-style), Daniel & Priya's mould (UK Cat-1 hazard),
  Tom & Lex's cockroaches, Marcus's 60-person 3 AM party, the Hendersons'
  hidden-camera-in-smoke-detector (Derek Starnes 2019), Mr Aleksandrov's
  £6k Edmund de Waal vase smashed by a 5-yo, the Calgary 12 £55k drug
  orgy (Star and Mark King), the Mayfair brothel discovery (Modern
  Slavery Act 2015), Princess Aaliyah's suspected camera in the
  Covent Garden penthouse, Director Markham's 24-paparazzi siege, and
  Ambassador Volkov's counter-surveillance listening device.
- **Genuine middle-ground tradeoffs** — every new scenario has 4 options:
  cheap+small win / expensive+big win / risky+variable / safe-but-trap
  (off-platform settlement, bribe-for-silence, blame-the-guest, etc.).
- **15 new keyframe animations** powering the damage overlays plus
  per-state body movements: rage jitter, weep bob, drunk sway, terrified
  shake.

## Inherits from v5

- The Covent Garden Royal Penthouse with 9 royal-tier upgrades
- 33 v5 scenarios (horses, paparazzi, gang parties, declined cards, wigs)
- 7 character archetypes (diplomats, posh, German, royalty, gangster,
  cleaner, crypto)
- 8 prop animations

## Inherits from v4

- Animated guest characters with mood-driven expressions
- Visual model homes — each property rendered as a cross-section view
- Live shop preview as you buy upgrades
- Confetti, money fountains, screen shake, host-avatar progression

## Run locally

```bash
npm install
python3 build.py    # rebuild public/index.html from sources
npm start
```

Then open http://localhost:3000

## Deploy to Render

Just `git push` — `render.yaml` handles the rest. Render auto-deploys in ~3 minutes.

## File structure

```
.
├── server.js                  # Express server + leaderboard API
├── package.json               # express only at runtime
├── render.yaml                # Render Blueprint config
├── build.py                   # Concatenates sources into public/index.html
├── index_template.html        # CSS + DOM scaffold + animation keyframes
├── _props.js                  # 6 properties + their upgrades
├── _questions.js              # v3 scenarios
├── _questions_extra.js        # v5 scenarios (Royal Edition)
├── _questions_extra2.js       # v6 scenarios (Real-World Horror Stories)
├── _characters.js             # Character SVG renderer + emotion states
├── _modelhome.js              # Model home + starter furniture + arch styles
├── _damage.js                 # Damage overlay system (29 problem types)
├── _logic.js                  # Game state, screen routing, quiz flow
└── public/
    └── index.html             # Built single-file game (~327 KB)
```

The game is delivered as a single self-contained HTML file with all data,
characters, model homes, damage overlays, and game logic embedded.
