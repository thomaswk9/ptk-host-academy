# Game graphics

This folder holds property photos, character avatars, and room scenes.
**Every image is optional** — if a file is missing, the game shows a
built-in fallback (SVG illustration or emoji).

## What goes here

| File                  | Used for                                      |
|-----------------------|-----------------------------------------------|
| `property-1.jpg`      | Notting Hill Studio (intro tile + card)       |
| `property-2.jpg`      | Shoreditch Loft                               |
| `property-3.jpg`      | Chelsea Townhouse                             |
| `property-4.jpg`      | Mayfair Penthouse                             |
| `property-5.jpg`      | Kensington Mansion                            |
| `guest-anxious.png`   | Worried/disappointed/angry guest avatars      |
| `guest-happy.png`     | Cheerful/relaxed/excited guest avatars        |
| `guest-corporate.png` | Business/formal/celebrity guest avatars       |
| `room-living.png`     | Default scenario background                   |
| `room-bedroom.png`    | Bed/sleep/pillow scenarios                    |
| `room-kitchen.png`    | Cooking/coffee/smoke scenarios                |
| `room-bathroom.png`   | Shower/water/boiler scenarios                 |
| `room-arrival.png`    | Check-in/key/lock scenarios                   |
| `room-party.png`      | Loud/music/police scenarios                   |

## How to fill this folder

See **`ASSET_GUIDE.md`** in the project root for prompts and free sources.
Short version:

1. Generate properties + characters with Microsoft Designer (free)
2. Download rooms from Storyset (free)
3. Save here with exact filenames above
4. Push to GitHub — Render redeploys automatically

## Specs

| Type | Format | Size | Aspect |
|------|--------|------|--------|
| Property photos | JPG | ~800×800 px | Square |
| Character avatars | PNG (transparent) | ~400×400 px | Square |
| Room scenes | PNG (transparent) | ~1000×600 px | Landscape |

Keep each under 200KB for fast loading.

## Partial is fine

Even just 5 property photos is a huge upgrade. Avatars can come later.
Rooms can come later still. The game falls back gracefully every time.
