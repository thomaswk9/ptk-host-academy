# PTK Host Academy — v6 Release Notes

## What's new vs v5

### Visual storytelling overhaul

**Empty rooms now look like real apartments.** Previously, a property with zero
upgrades just showed bare blue rectangles labelled "empty". Every room now ships
with starter furniture appropriate to its kind:

- **Living room / studio** — sofa with arms and pillows, coffee table, floor
  lamp, framed wall art. Tier-1 properties show the sofa fabric in a worn grey
  with a slightly crooked picture; Covent Garden uses refined oak tones.
- **Bedroom** — full bed with mattress, pillows, headboard, bedside table with
  lamp, wardrobe with handles.
- **Kitchen** — counter run with three cabinet doors, sink with mixer tap,
  fridge, hob with burners, optional tile pattern at higher tiers.
- **Bathroom** — tub, toilet with cistern, sink, mirror.
- **Outdoor / terrace** — at low tiers, a simple grass strip with tree and
  flowerpot; at high tiers, a tiled terrace with chair, table, and potted plant.

Shabby low-tier properties additionally show subtle peeling-paint cracks on the
walls. The Covent Garden penthouse keeps its dark theatre-marquee ceiling.

### Architectural style picker

Each property now has an architectural style that drives its window treatment:

- **Notting Hill** — Victorian (bay-window arched top, decorative arc, broad sill)
- **Shoreditch** — Modern (plate glass, minimal mullions, steel-frame accent)
- **Chelsea / Mayfair** — Georgian (six-pane sash, central mullion, pediment, painted sill)
- **Kensington** — Edwardian (mullioned with smaller panes, Tudor timber strips top and bottom)
- **Covent Garden penthouse** — Modern (full-height glass)

### Extreme emotional expressions

Ten new character states drive faces that match the gravity of each scenario:

| State          | What you see                                                          |
| -------------- | --------------------------------------------------------------------- |
| `rage`         | Bright red skin tint, bulging red bloodshot eyes, jagged teeth mouth, vein pulse, red rage steam, body jitter |
| `crying`       | Squeezed-shut eyes turning down, tears falling, downturned mouth showing teeth |
| `weeping`      | Fully scrunched eyes, two streams of large tears with cheek lines, body bobs gently |
| `sleepless`    | Heavy red eye bags, bloodshot lines through whites, drooping eyelids, exhausted brows |
| `terrified`    | Pale blue skin, huge wide white eyes with tiny pupils, sweat drops falling, body shakes |
| `disgusted`    | Green skin tint, asymmetric mouth with sick coming out one side, green aura |
| `drunk`        | X-mark eyes, pink cheeks, wavy mouth, body sways, pink bubbles around head |
| `embarrassed`  | Pink blushing skin, looking-down eyes, flat embarrassed mouth |
| `shocked`      | Wide circular eyes with pinpoint pupils, raised brows, pursed mouth |
| `smug`         | Curved-up eyes, knowing brow lift, slight half-smirk |

Mood strings on each scenario (e.g. `"FURIOUS 🤬"`, `"DEVASTATED 😭"`,
`"sleepless 😩"`, `"DRUNK 🥴"`, `"DISGUSTED 🤢"`) automatically map to the
correct state via `getStateFromMood()`.

### Damage overlay system

A new `_damage.js` module renders **29 distinct visible problems** as
animated SVG overlays on top of the scenario stage:

`leak` (drips falling from a ceiling stain into a growing puddle), `mould`
(black blooms slowly pulsing), `cockroach` (six roaches scuttling laterally),
`rat` (rat with whiskers and tail near the kitchen), `vomit` (green pool with
rising stink lines), `smoke` (rising puffs from the kitchen with flames),
`fire` (8 flickering flames flame-tip yellow), `flood` (animated wave layer at
floor with moving ripples), `dark` (full screen darkened with single candle
flame flickering), `freezing` (icy blue tint, falling snowflakes, hanging
icicles), `party_chaos` (purple darkroom with strobe orbs and flying music
notes and beer-bottle floor litter), `stained_carpet` (clusters of red wine
stains), `blood_sheets` (sheet pulled back showing growing blood blooms),
`cracked_window` (spider-web crack pattern radiating from a single impact),
`hidden_camera` (black dome with blinking red REC dot), `broken_glass`
(scattered shards on the floor), `drug_aftermath` (white powder lines on a
table, beer bottles, trashed sofa, pizza box), `brothel` (pink red-light
district lighting with neon "XXX" letters), `faeces` (three brown piles with
faint stink wisps), `bedbugs` (sheet showing eight bugs that crawl), `broken_bed`
(collapsed mattress in a V, broken frame splinters), `wig` (wig flying out of
a bin), `tea_kettle` (kettle with brown sludge inside and dangling tea-bag
string), `condoms` (five used condoms scattered + chewing gum blobs), `horse_indoors`
(hoof prints on floor, manure piles, hay strewn), `declined_card` (credit card
with delayed-slam-in DECLINED stamp), `smashed_vase` (pedestal with broken vase
top, scattered red shards, dust cloud), `paparazzi` (5 cameras with synchronized
flash-burst animations), `silverfish` (4 silvery insects wiggling in S-curves).

### 25 new scenarios from real-world horror stories

Each new scenario is drawn from a documented Airbnb horror story and ships with
a `damage` field that triggers the matching overlay. Each scenario gives **four
genuine middle-ground options** rather than just good/bad:

- a **cheap, small win** — quick fix, mild reputation cost
- an **expensive, bigger win** — pay more, get a 5-star recovery
- a **risky gamble** — could go either way
- a **safe-but-trap** — looks easy but penalises you (off-platform settlement,
  bribe-for-silence, blame the guest, etc.)

Sources include Rachel Bassini's NYC penthouse (£30k claim — used condoms,
faeces, chewing gum), Star and Mark King's Calgary £55k drug-induced orgy,
Derek Starnes' hidden-camera-in-smoke-detector (2019), the London hosts'
brothel raid, the Bored Panda frozen-pizza-with-plastic-still-on-it fire, the
Yerevan broken bed sleeping on the floor for three nights, the 60-youth 3 AM
party from the London Quora hosts, the freezing shower / broken boiler from
the Mexican Airbnb, UK government 2023 Category 1 mould hazard guidance, and
the Modern Slavery Act 2015 reporting requirements.

By property:

- **Notting Hill (1):** Marta broken bed (sleepless), Daniel & Priya mould
  (FURIOUS), Tariq freezing boiler with baby, Ji-eun thin curtains.
- **Shoreditch (2):** Tom & Lex cockroach infestation, Marcus 60-person 3 AM
  party, Henderson family hidden camera, Joey & Mike pizza-with-plastic fire,
  Sarah Bassini-Lite faeces and condoms party aftermath.
- **Chelsea (3):** Mr Aleksandrov's 5-yo smashes the £6k Edmund de Waal vase,
  Carlssons bedbugs with bites on a child, James & Helena vomit cleaner missed,
  Mrs Dimitriou rat at midnight (barrister).
- **Mayfair (4):** Eduard L flood through to neighbour at 6 AM, @MillaAesthetic
  4.2m TikTok hate video, Davood R cocaine + wallaby + ketamine aftermath,
  Calgary 12 £55k orgy damage, Mr Park brothel discovery (Modern Slavery Act
  2015).
- **Kensington (5):** Lord Ashworth Persian rug stains demanding 50% refund,
  Filming Crew Director porn shoot on the driveway, Lady Cavendish-Pryce
  silverfish at 3 AM.
- **Covent Garden (6):** Princess Aaliyah suspected camera in mirror,
  Director Markham 24 paparazzi siege on Oscar night, Ambassador Volkov
  counter-surveillance listening device.

### Doubled animations

Fifteen new CSS keyframes power the damage overlays and emotional states:
`leakDrip`, `mouldBloom`, `roachScuttle`, `smokePuff`, `flameFlicker`,
`candleFlicker`, `snowfall`, `partyStrobe`, `musicNoteFloat`, `stainGrow`,
`cameraBlink`, `brothelLight`, `bugCrawl`, `silverfishWiggle`, `flashBurst`,
`declinedStamp`, `vomitStink`, `rageVein`, plus per-state body movements
(`rageJitter`, `weepBob`, `drunkSway`, `terrifiedShake`).

## Totals

- **Properties:** 6
- **Scenarios:** 94 (+24 over v5's 70)
- **Damage overlays:** 29
- **Character emotion states:** 16 (was 6)
- **Architectural styles:** 4 (Georgian, Victorian, Edwardian, Modern)
- **Bundle size:** 327 KB single file
- **Single HTML file:** still no build step needed at runtime, still deploys to
  Render via the same `server.js`.

## How to deploy

Same as before — push to your existing GitHub repo and Render auto-deploys:

```
git add .
git commit -m "v6: extreme emotions, damage overlays, 25 real-world scenarios, arch styles"
git push
```

Render will redeploy in ~3 minutes.

## Build locally

```
python3 build.py
node server.js
# open http://localhost:3000
```

## Files changed

- `_characters.js` — full rewrite of `renderCharacter`, new `MOOD_TO_STATE`
  table, new `getStateFromMood()` helper.
- `_modelhome.js` — added `renderStarterFurniture()`, `getRoomKind()`,
  `renderStyledWindow()`, `PROP_STYLES` table.
- `_damage.js` — **NEW** module, 29 overlay renderers.
- `_questions_extra2.js` — **NEW** scenario file, 25 entries with `damage`
  fields and middle-ground options.
- `_logic.js` — `renderQuiz()` now reads `q.damage` and routes mood to
  `getStateFromMood()` for extreme states; new `q-damage` overlay element.
- `index_template.html` — 15 new keyframes, splash count updated to 6
  properties / 94 scenarios.
- `build.py` — wires in the two new modules.
- `package.json` — version bumped to 1.6.0.
