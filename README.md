# PTK Host Academy — v4 (Graphical Edition)

A short-let hosting simulator featuring 5 London properties, 35 dramatic guest scenarios, animated SVG characters, and isometric model homes that visibly transform as you buy upgrades.

## What's new in v4

- **Animated guest characters** — every scenario shows a flat-illustrated character with mood-driven expressions (angry brows, blinking eyes, complaining mouth, steam puffs)
- **Visual model homes** — each property is rendered as a cross-section view with rooms; every upgrade you buy appears inside (TVs on walls, beds, kitchens, helicopters in the sky over Mayfair, an H landing pad on Kensington's roof)
- **Speech bubbles** — guests speak their complaints in cartoon-style bubbles instead of plain paragraph text
- **Live shop preview** — see the model home update in real time as you buy upgrades
- **Animations everywhere** — items pop in when purchased, money flies up the screen, confetti for big wins, screen shake on bad answers, helicopter floats above Mayfair
- **Host avatar** — your character appears in the listing header with a rating-driven badge (golden crown at Legendary)

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:8080

## Deploy to Render

1. Push this folder to a public GitHub repo
2. In Render, click New → Blueprint and point it at the repo
3. The included `render.yaml` configures everything automatically

## File structure

```
.
├── server.js          # Express server + leaderboard API
├── package.json
├── render.yaml        # Render Blueprint config
└── public/
    └── index.html     # Single-file game (~140 KB)
```

The game is delivered as a single self-contained HTML file with all data, characters, model homes, and game logic embedded.

## Persistence

The leaderboard is stored in `/tmp/ptk-leaderboard.json` (server-side) with a localStorage fallback if the API is unavailable. On Render free tier, `/tmp` resets when the instance sleeps; for permanent storage attach a Disk in the Render dashboard.
