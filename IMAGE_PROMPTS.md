# 🎨 HD Property Image Prompts

These prompts produce HD images for the 5 property tiles on the game's intro/tier-select screen, matching the **isometric Mayfair render** style you uploaded on 30 Apr.

## How to use

Paste each prompt into one of:
- **ChatGPT (4o image gen)** — best quality, most consistent style
- **Microsoft Designer / Bing Image Creator** — free, fast, decent quality
- **Midjourney** — best control over style, requires subscription

Save the resulting images into `public/images/` with these exact filenames:

- `property-1.jpg` — Notting Hill Studio
- `property-2.jpg` — Shoreditch Loft
- `property-3.jpg` — Chelsea Townhouse
- `property-4.jpg` — Mayfair Penthouse *(already bundled — your earlier upload)*
- `property-5.jpg` — Kensington Mansion

**ChatGPT/Designer outputs PNG by default** — just rename the `.png` extension to `.jpg` after download. Browsers don't care about the extension; the file format is detected from the content. (Or use a converter if you want, but renaming is faster.)

Each image powers three places in the game:
- Square thumbnail on the property selection card (top-right of each card)
- Wide banner image on the home property listing
- Same wide banner repeated on the upgrade shop and question screens

The same image gets cropped differently by `object-fit: cover` for each spot.

---

## Style anchor (use the Mayfair image as visual reference)

All five should feel like a **set** — same isometric camera angle, same illustration style, same warm light, same level of detail. Each prompt below ends with a consistency line that pins the style.

---

## 1️⃣ Notting Hill Studio

```
Isometric 3D render of a small London ground-floor studio apartment,
warm cosy interior visible through a cutaway view. One bed, compact
kitchen with a battered oven, small living area with a worn sofa, single
window looking onto a Portobello-Road style streetscape. Original 1970s
fixtures, slightly faded floral wallpaper, squeaky floorboards visible.
Charming but tired. Pastel pinks, dusty cream walls, oak floor with a
small Persian rug. Visible character but everything has seen better days.
Soft natural daylight from the side, no harsh shadows.

Illustration style: high-detail isometric architectural render, painterly
warm lighting, slight watercolour quality, the same illustration style
as a luxury Mayfair apartment cutaway render — warm tones, hand-drawn
feeling, professional architectural visualisation.
```

## 2️⃣ Shoreditch Loft

```
Isometric 3D render of a converted East London warehouse loft, cutaway
view. Exposed red brick walls, raw oak floors, industrial steel beams,
double-height ceiling with skylights. Mid-century furniture: leather
Eames chair, low concrete coffee table, vintage record player on a
sideboard. Open-plan kitchen with stainless steel hood, breakfast bar,
two bar stools. Industrial pendant lights. Second bedroom mezzanine
visible. Bathroom grout slightly questionable. Brick walls, dark teal
accents, lots of plants. Edison bulb pendant lights cast a warm glow.

Illustration style: high-detail isometric architectural render, painterly
warm lighting, hand-drawn feel, same illustration style as a luxury
Mayfair apartment cutaway render — warm tones, professional
architectural visualisation, slight watercolour quality.
```

## 3️⃣ Chelsea Townhouse

```
Isometric 3D render of an elegant Victorian London townhouse over three
floors, cutaway view showing all levels. Classical proportions, bay
windows, cornicing on the ceilings. Ground floor: smart entrance hall,
formal living room with a navy velvet sofa, marble fireplace, oak
parquet floor. Middle floor: dated 2003 kitchen needing renovation,
small dining room. Top floor: three bedrooms, one tiny windowless
bathroom. Lush overgrown garden visible at the back. Cream and navy
palette, oak woodwork, elegant but in need of curation. Soft late-
afternoon light through tall sash windows.

Illustration style: high-detail isometric architectural render, painterly
warm lighting, hand-drawn feel, same illustration style as a luxury
Mayfair apartment cutaway render — warm tones, professional
architectural visualisation, slight watercolour quality.
```

## 4️⃣ Mayfair Penthouse — *(you already have this image)*

If you ever need to regenerate it, the prompt is:

```
Isometric 3D render of a luxury Mayfair penthouse apartment, top floor,
cutaway view. Sweeping Hyde Park views through floor-to-ceiling glass.
Open-plan living/dining/kitchen with marble island, brass pendant
lights, dark cabinetry, designer sofa in cream bouclé. Master suite
with terracotta feature wall, walk-in wardrobe. Spa-style en-suite with
a freestanding bathtub. Curated artwork on every wall. Wine fridge.
Wraparound terrace with outdoor sofa, dining set, planters, glass
balustrade overlooking London skyline at golden hour. Marble floors,
deep teal accents, brass fixtures, warm lighting.

Illustration style: high-detail isometric architectural render, painterly
warm lighting, hand-drawn feel, professional architectural visualisation,
slight watercolour quality, warm golden-hour tones.
```

## 5️⃣ Kensington Mansion

```
Isometric 3D render of a Grade II listed Regency mansion in Kensington,
five floors, cutaway view showing all levels. Imposing white stucco
exterior with classical pillared entrance. Inside: grand entrance hall
with double staircase, formal drawing room with a Steinway, library
with floor-to-ceiling oak shelves. Michelin-grade chef's kitchen with
La Cornue range. Indoor pool with sauna and steam room on lower ground.
Twenty-seat private cinema with red velvet seating. Five bedrooms each
with en-suite. Rooftop helipad. Private art gallery wing. Ivory walls,
deep emerald accents, gold leaf detailing, antique chandeliers, oil
paintings. Soft warm chandelier light throughout. London skyline at
dusk visible in the distance.

Illustration style: high-detail isometric architectural render, painterly
warm lighting, hand-drawn feel, same illustration style as a luxury
Mayfair apartment cutaway render — warm tones, professional
architectural visualisation, slight watercolour quality.
```

---

## Tips for getting consistent results

- Run all 5 prompts in the **same chat session** with ChatGPT — it'll start to lock the visual style across renders.
- If a render comes back too photorealistic or too cartoony, add: *"matching exactly the style of the previous Mayfair render"*.
- Generate at the largest size your tool allows (1024×1024 or 1792×1024). The game tile will display at ~360×240 so detail is well-preserved.
- The Mayfair upload is your style anchor — when in doubt, say *"in the style of [attached Mayfair image]"*.

## Image sizing for the game

The game's property cards display the image at roughly:
- **Square thumbnail (top-right of each card):** 64×64px — square crop
- **Wide banner (main illustration):** 580×180px — landscape crop (~3:1)

Because the same image fills both contexts via `object-fit: cover`, **square images centred on the apartment work best** (the wide banner will show the middle horizontal band; the thumbnail will show the centre square).

- Best output sizes from ChatGPT/Designer: 1024×1024 or 1792×1024 — both work
- 16:9 (1280×720, 1920×1080) also works
- PNG with transparent background not needed — solid is fine
