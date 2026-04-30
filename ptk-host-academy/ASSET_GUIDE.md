# Asset Pack for PTK Host Academy

This guide gets you proper 3D-style characters and high-quality room
illustrations into the game in about 30 minutes.

You'll do two things:
1. Generate **5 property photos + 4 character avatars** using a free AI image generator
2. Download **6 free room scene illustrations** from Storyset

Then drop everything into `public/images/` and push to GitHub. Render
auto-deploys; the new graphics replace the SVG pictograms automatically.

---

## Part 1 — AI-Generated Images (Characters + Properties)

### Where to generate

**Best free options (in order of recommendation):**

| Tool | URL | Notes |
|---|---|---|
| **Microsoft Designer / Image Creator** | bing.com/images/create | Free, 100 boosts/day, DALL-E 3 quality, no card needed |
| **ChatGPT (free tier)** | chat.openai.com | Free, ~3 images/day, very high quality |
| **Ideogram** | ideogram.ai | Free tier with daily credits, good at consistent style |
| **Leonardo.ai** | leonardo.ai | 150 free credits/day, more controls |

I recommend Microsoft Designer — easy, fast, and produces consistent
high-quality 3D-style results.

### The Style Rule

To make every image look like it belongs in the same game, **always use
this style suffix** at the end of every prompt:

```
3D rendered illustration, soft lighting, isometric perspective,
warm colour palette, high detail, friendly cartoon style,
Pixar-meets-architectural-render aesthetic, clean background
```

Or for the trendier "claymation" look:
```
3D claymation style, soft pastel lighting, hand-crafted feel,
warm and inviting, professional digital illustration
```

Pick one style and stick with it for ALL 9 images. Mixing styles
makes the game look inconsistent.

### The 5 Properties

Save each as a square JPG, ~800×800px, into `public/images/`.

#### `property-1.jpg` — Notting Hill Studio
> A cosy small ground-floor flat in Notting Hill London with a colourful
> pastel pink and cream facade, original Victorian features, a small
> blue door, hanging flower baskets, behind Portobello Road market,
> slightly weathered but charming, [STYLE]

#### `property-2.jpg` — Shoreditch Loft
> A converted warehouse loft apartment in Shoreditch East London,
> exposed red brick exterior, large industrial Crittall windows,
> rooftop visible, urban setting with a hint of street art, evening
> lighting, [STYLE]

#### `property-3.jpg` — Chelsea Townhouse
> A Victorian terraced townhouse in Chelsea London, classic white
> stucco facade with black railings, three storeys, columned porch,
> manicured front garden with topiary, sunny afternoon, prestigious
> residential street, [STYLE]

#### `property-4.jpg` — Mayfair Penthouse
> A luxury modern penthouse apartment building in Mayfair London,
> top-floor terrace with skyline views over Hyde Park, floor-to-ceiling
> windows, exterior view from across the street, golden hour lighting,
> high-end residential, [STYLE]

#### `property-5.jpg` — Kensington Mansion
> A grand Regency mansion in Kensington London, white stucco facade
> with tall columns and pediment, Grade II listed building, walled
> garden visible, classical architecture, prestigious neighbourhood,
> blue sky, [STYLE]

### The 4 Character Avatars

Save each as a square PNG with transparent background, ~400×400px.
(If you can't get transparency, white background is fine — the
game crops them into circles.)

#### `host-avatar.png` — You, the host
> Friendly professional 30-something property host, smiling warmly,
> wearing smart casual attire, holding a set of keys, neutral background,
> portrait orientation, head and shoulders, [STYLE]

#### `guest-anxious.png` — Anxious / disappointed guest
> A worried looking traveller in their 30s, holding a phone with concerned
> expression, tired eyes, casual clothing, head and shoulders portrait,
> neutral background, [STYLE]

#### `guest-happy.png` — Happy / relaxed guest
> A cheerful smiling traveller, relaxed expression, casual holiday clothing,
> warm friendly vibes, head and shoulders portrait, neutral background, [STYLE]

#### `guest-corporate.png` — Corporate / formal guest
> A polished business professional in their 40s wearing a suit,
> serious confident expression, briefcase visible, head and shoulders
> portrait, neutral background, [STYLE]

These 4 avatars cover all 35 scenarios — the game maps each guest mood
to one of these four characters automatically (see Part 3 below).

---

## Part 2 — Free Room Illustrations from Storyset

[Storyset](https://storyset.com) gives you free, high-quality vector
illustrations in a consistent style. Search for these and download as
**PNG with transparent background** (you may need to make a free account):

| Game scene | Storyset search term | Save as |
|---|---|---|
| Living room (general) | `living room` | `room-living.png` |
| Bedroom | `bedroom` | `room-bedroom.png` |
| Kitchen | `kitchen` | `room-kitchen.png` |
| Bathroom | `bathroom` | `room-bathroom.png` |
| Front door / arrival | `home owner` or `welcome home` | `room-arrival.png` |
| Party / chaos | `party` or `noisy neighbour` | `room-party.png` |

**Tip:** Storyset lets you change the colour palette before downloading.
Pick a consistent palette across all 6 — I recommend their **"Amico"**
or **"Bro"** style packs (illustrated people in flat-3D style) and tweak
the primary colour to **#1C2280** (PTK navy) for cohesion.

**Alternative source if Storyset doesn't have what you want:**
- [unDraw](https://undraw.co) — also free, customisable single colour
- [Freepik](https://freepik.com) — free with attribution, huge library

---

## Part 3 — Drop everything in and deploy

When you have all the images, your folder should look like:

```
public/images/
├── property-1.jpg          (Notting Hill)
├── property-2.jpg          (Shoreditch)
├── property-3.jpg          (Chelsea)
├── property-4.jpg          (Mayfair)
├── property-5.jpg          (Kensington)
├── host-avatar.png
├── guest-anxious.png
├── guest-happy.png
├── guest-corporate.png
├── room-living.png
├── room-bedroom.png
├── room-kitchen.png
├── room-bathroom.png
├── room-arrival.png
└── room-party.png
```

Then:
1. GitHub Desktop → it'll show 15 new files
2. Commit message: *"Add proper graphics"*
3. Commit → Push
4. Render auto-redeploys in ~60 seconds
5. Reload the game URL — graphics appear instantly

**You don't have to do all 15 at once.** Each image is independent. If
you only do the 5 property photos, the rest still falls back to SVG.
If you only do the 4 character avatars, the rooms still use the default
illustrations. Add them progressively.

---

## Part 4 — Quick path if you want to start small

If 15 images sounds like a lot, do these 5 first for the biggest visual
upgrade:

1. `property-1.jpg` — Notting Hill (intro screen impact)
2. `property-3.jpg` — Chelsea (most-played mid-game)
3. `property-5.jpg` — Kensington (endgame reward)
4. `guest-anxious.png` — used in 60% of scenarios
5. `guest-happy.png` — used in 30% of scenarios

That gives you photo-quality intro tiles, the prestige endgame reward
visible, and characters across most scenarios. About 15 minutes total
in Microsoft Designer.

The rest can come later or never — the game still looks good.
