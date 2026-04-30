# PTK Host Academy

A short-let hosting simulator. Start with a battered 1-bed in Notting Hill,
handle real guest crises, earn rental income, upgrade your flat — and unlock
your way up to a Kensington mansion.

## What's in the game

- 5 properties from Notting Hill to Kensington, each with progressive unlock thresholds
- 35+ unique guest scenarios across all properties (random selection each playthrough)
- Per-property upgrade shop — upgrades increase income per correct answer
- Real-time leaderboard backed by the server (with localStorage fallback)
- 5 hand-drawn SVG architectural illustrations as default property art
- Drop-in support for real photos via `public/images/property-1.jpg` through `property-5.jpg`

## Architecture

```
ptk-host-academy/
├── server.js              Express server + /api/leaderboard endpoints
├── package.json
├── render.yaml            Render deployment blueprint
├── public/
│   ├── index.html         Single-page game (markup + styles + game logic)
│   ├── viewer.html        Standalone 3D apartment viewer (test/preview)
│   ├── apartment3d.js     Three.js viewer module — tier + upgrade aware
│   ├── vendor/
│   │   └── three.module.min.js   Self-hosted Three.js r160 (655KB)
│   └── images/            Drop property-1.jpg through property-5.jpg here
├── IMAGE_PROMPTS.md       Ready-to-paste AI prompts for the 5 HD tiles
├── DEPLOY.md              Step-by-step GitHub Desktop → Render guide
└── README.md
```

## 3D apartment viewer

Open `/viewer.html` to interactively explore a customisable apartment that
adapts to property tier (Notting Hill → Kensington) and game upgrades. Toggle
upgrades on/off and watch furniture, art, kitchens, cinema seats, pools, etc.
appear in the scene.

- **Three view modes:** Orbit (drag/pinch), Plan (top-down floor plan), Walk
  (first-person, WASD + on-screen joystick on mobile).
- **Time of day:** Day, Evening, Night — affects sky and interior lighting.
- **Roof toggle:** show/hide ceiling.
- **Mobile-first:** touch drag, pinch zoom, on-screen joystick in walk mode.
- **No CDN dependency:** Three.js is self-hosted in `/vendor/`.

The viewer is wired to `index.html`'s upgrade IDs (`smart_tv`, `kitchen_reno`,
`pool`, etc.) so it can be embedded directly in the game's property screens.
That integration is staged for the next iteration once you've verified the
viewer behaves as expected.

## Run locally

```bash
npm install
npm start
# Open http://localhost:8080
```

The leaderboard writes to `/tmp/ptk-leaderboard.json` by default. To use a
different path locally, set `LEADERBOARD_PATH=./ptk-leaderboard.json`.

## Deploy

See [DEPLOY.md](DEPLOY.md) for the GitHub Desktop → Render flow (same as
Primestay and BloodWise). About 10 minutes start to finish.

## Adding real graphics

The game ships with hand-drawn SVG fallbacks for properties and emoji for
guests, so it works out of the box. For proper graphics, you have two routes:

**HD property tiles** (the cinematic isometric renders, like the Mayfair
image) — see **[IMAGE_PROMPTS.md](IMAGE_PROMPTS.md)** for ready-to-paste
ChatGPT/Designer/Midjourney prompts for all 5 tiers, plus filename guidance.

**Photo-based assets** (real-world photography for property cards and guest
scenarios) — see **[ASSET_GUIDE.md](ASSET_GUIDE.md)** for free AI generation
prompts plus the 6 Storyset room scenes.

Quick filename reference:

```
property-1.jpg .. property-5.jpg     5 property exteriors
guest-anxious.png / guest-happy.png  3 character avatars
guest-corporate.png
room-living.png / room-bedroom.png   6 scenario backgrounds
room-kitchen.png / room-bathroom.png
room-arrival.png / room-party.png
```

Each image is independent — if a file is missing, the fallback kicks in.
You can add them progressively.

## Leaderboard storage

By default the leaderboard lives at `/tmp/ptk-leaderboard.json` on the
server. On Render's free tier, **`/tmp` resets when the instance spins
down** (after 15 mins of inactivity). For permanent storage:

1. In Render dashboard → your service → Disks → Add Disk
2. Mount path: `/var/data` · Size: 1 GB (free tier allows this)
3. Set env var `LEADERBOARD_PATH=/var/data/ptk-leaderboard.json`

The client also keeps a localStorage backup, so individual players see
their own scores even if the server resets.
