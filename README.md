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
│   ├── index.html         Single-page app (markup + styles + game logic)
│   └── images/            Drop property-1.jpg through property-5.jpg here
├── DEPLOY.md              Step-by-step GitHub Desktop → Render guide
└── README.md
```

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
guests, so it works out of the box. For proper 3D-style graphics, see
**[ASSET_GUIDE.md](ASSET_GUIDE.md)** — it walks you through:

- Generating 5 property photos + 4 character avatars using free AI image
  generators (Microsoft Designer, ChatGPT, etc.) with copy-paste prompts
- Downloading 6 free room-scene illustrations from Storyset
- Where each file goes and what filename it needs

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
