# Deploying PTK Host Academy

Same flow as Primestay and BloodWise: GitHub Desktop → Render. About 10 minutes.

## Step 1 — Create a new GitHub repo

1. Open **GitHub Desktop**
2. **File → New Repository**
3. Name: `ptk-host-academy` (or anything you like)
4. Local path: pick a fresh empty folder, e.g. `Downloads/ptk-host-academy-deploy`
5. **Untick** *Initialise this repository with a README*
6. Click **Create Repository**

## Step 2 — Drop the files in

Copy everything from this download into that new folder. The folder should now contain:

```
ptk-host-academy-deploy/
├── server.js
├── package.json
├── render.yaml
├── .gitignore
├── README.md
├── DEPLOY.md
└── public/
    ├── index.html
    └── images/
        └── README.md
```

GitHub Desktop will detect all the new files automatically.

## Step 3 — Commit and publish

1. In GitHub Desktop, type a commit message: *"Initial PTK Host Academy commit"*
2. Click **Commit to main**
3. Click **Publish repository** at the top
4. **Untick** *Keep this code private* — Render's free tier needs public repos
5. Click **Publish Repository**

Your code is now at `github.com/thomaswk9/ptk-host-academy`.

## Step 4 — Deploy to Render

1. Open [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your GitHub if needed, then pick **`thomaswk9/ptk-host-academy`**
4. Render reads `render.yaml` automatically — you'll see *Service: ptk-host-academy*
5. Click **Apply**

After ~60 seconds the URL will be live at something like:

```
https://ptk-host-academy.onrender.com
```

## Step 5 — Test it

Open the URL on your phone or laptop:

- Enter a name and start the game
- The intro screen should show 5 architectural illustrations (the SVG fallbacks)
- Play through a property, buy some upgrades, check the leaderboard

## Step 6 — Add real property photos (optional)

Right now the game uses hand-drawn SVG illustrations for each property tier.
To replace them with real photos:

1. Find 5 photos (one per property tier) — see `public/images/README.md` for free sources
2. Save them as:
   - `public/images/property-1.jpg` (Notting Hill Studio)
   - `public/images/property-2.jpg` (Shoreditch Loft)
   - `public/images/property-3.jpg` (Chelsea Townhouse)
   - `public/images/property-4.jpg` (Mayfair Penthouse)
   - `public/images/property-5.jpg` (Kensington Mansion)
3. Square crop, ~800×800 px, under 200KB each
4. GitHub Desktop → commit → push
5. Render auto-redeploys; photos appear within 60 seconds

If a photo file is missing, the SVG illustration is shown instead — so the
game looks fine even with only 2 or 3 real photos uploaded.

## Step 7 — Add to home screen (optional)

For quick access on iPhone:

1. Open the Render URL in **Safari** (not Chrome)
2. Tap **Share** → **Add to Home Screen**
3. You'll get a Host Academy icon that opens fullscreen

---

## Persisting the leaderboard

By default, the leaderboard lives at `/tmp/ptk-leaderboard.json` on the server.
On Render's free tier, this **resets when the instance spins down** (after
15 minutes of inactivity).

For permanent storage:

1. In Render → your service → **Disks** → **Add Disk**
2. Mount path: `/var/data` · Size: `1 GB`
3. Go to **Environment** → add `LEADERBOARD_PATH=/var/data/ptk-leaderboard.json`
4. Save → Render redeploys automatically

Note: attaching a disk requires bumping to the **Starter plan ($7/month)**.
On free tier, the localStorage fallback still gives each player their own
local leaderboard view.

## Updating later

Any time you want to change scenarios, properties, photos, or anything else:

1. Edit files locally
2. GitHub Desktop → commit → push
3. Render auto-redeploys in ~60 seconds

## Troubleshooting

**Build fails on Render with "Cannot find module 'express'":**
Run `npm install` locally first to verify it works, then commit the
`package.json` again.

**Leaderboard is empty even after submitting a score:**
On free tier, instances spin down after 15 mins. The next request takes
~30s to wake the server. If the wake-up fails, the client falls back to
localStorage automatically.

**Photos aren't showing:**
Check the filenames are exactly `property-1.jpg` through `property-5.jpg`
(not `.jpeg`, not `.png`, not capitalised). Browser cache might also need
a hard refresh — Cmd+Shift+R or Ctrl+Shift+R.
