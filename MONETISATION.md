# Monetisation: Affiliate Traffic to Furniture Retailers

PTK Host Academy includes infrastructure to drive traffic to UK furniture
retailers via affiliate links — generating commission on every purchase
without showing ads or charging users.

## How it works (current scaffold)

Three integration points surface real-world products at high-conversion
moments:

### 1. Upgrade shop cards
Every upgrade card in the shop can show a small real-product teaser at the
bottom — retailer, product name, price, and a "View →" button. Currently:

- **Barista coffee machine** card → Sage Barista Express, John Lewis, £599
- **Hotel-grade bedding** card → Emily Upholstered King, John Lewis, £899
- **Bathroom renovation** card → Roll-Top Bath, Dunelm, £549
- **Royal kitchen** card → Smeg FAB32 Retro Fridge, John Lewis, £2,099
- **Royal suite** card → Savoir No. 2 Bed, £12,500

The user sees the teaser while they're already in "shopping mode" — they're
weighing in-game costs against value. Showing a real product right next to
the in-game equivalent piques curiosity.

### 2. Post-purchase CTA
After a user completes an in-game upgrade purchase, a small CTA card slides
up from the bottom of the screen for 12 seconds:

> LOVED THAT UPGRADE?
> Get the real Emily Upholstered King
> John Lewis & Partners · £899
> [Shop →]

The user has just demonstrated commercial intent within the game (they spent
their hard-earned in-game £100 on better bedding). Surfacing the real
equivalent at this moment converts intent into clicks.

### 3. Click tracking endpoint
`/api/track-click` accepts POST events and appends them to a JSONL log at
`/tmp/ptk-clicks.jsonl`. Each event records `productId`, `retailer`, `ts`,
truncated IP, and user agent. Run nightly aggregations to reconcile against
your Awin commission reports.

## The affiliate path: practical steps

### 1. Sign up as a publisher
- **[Awin](https://www.awin.com/gb/publishers)** is the dominant UK affiliate
  network for furniture retailers. Free to join. Approval takes 2-5 days
  and requires a live website (PTK Host Academy at
  `ptk-host-academy.onrender.com` qualifies once it has any traffic).
- **[Sovrn Commerce](https://www.sovrn.com/products/commerce/)** (formerly
  VigLink) handles auto-conversion of regular product URLs into affiliate
  URLs across thousands of retailers. Useful as a fallback for retailers
  Awin doesn't cover.
- **[Rakuten Advertising](https://rakutenadvertising.com/)** — fewer UK
  furniture retailers but covers some international brands.

### 2. Apply to retailer programmes
Once approved as an Awin publisher, apply to specific advertiser programmes.
Most accept publisher applications within 1-3 days. Recommended starting set:

| Retailer | Network | Avg commission | Notes |
|----------|---------|---------------:|-------|
| John Lewis & Partners | Awin | 1.5–4% | Wide product range, strong conversion |
| IKEA | Awin | 4–6% | Excellent EPC, broad audience |
| Dunelm | Awin | 4–7% | Mid-market, very high volume |
| Heal's | Awin | 5–8% | Premium, high AOV |
| Furniture Village | Awin | 6–8% | High AOV, ~£800 average basket |
| Sofology | Awin | 5–7% | Sofas only, perfect category match |
| DFS | Awin | 4–6% | Mass market, high spend |
| Wayfair UK | Wayfair direct | 5–7% | Apply via wayfair.co.uk/affiliates |
| Loaf | Awin | 6–8% | Premium British brand |
| Soho Home | Awin | 6–10% | Aspirational tier |
| Hypnos Beds | Awin | 6–8% | Premium beds, AOV £1,500+ |
| Habitat (Sainsbury's) | Awin | 4–6% | Mid-market modern |

### 3. Wire up your publisher ID
Once approved, edit `_catalogue.js`:

```js
function buildAffiliateUrl(product, ourPublisherId = 'YOUR_AWIN_PUBLISHER_ID') {
  // Replace 'YOUR_AWIN_PUBLISHER_ID' with your actual ID (e.g., '12345678')
  // and populate awinmidByRetailer with the merchant IDs from your Awin dashboard.
}
```

Each retailer in Awin has a unique `awinmid`. You'll find this in the
"My Programmes" section of your dashboard. Update the
`awinmidByRetailer` table:

```js
const awinmidByRetailer = {
  'John Lewis & Partners': '7488',  // ← replace with your real awinmid
  'IKEA': '12345',
  // ...
};
```

### 4. Replace placeholder images with real product imagery
Awin provides daily product feeds in CSV/XML format. Each row contains
`aw_image_url`, `aw_product_id`, `display_price`, `product_url` and many
other fields.

Build a refresh script (suggested location: `scripts/refresh_catalogue.js`)
that:

1. Downloads the Awin feed for each enrolled retailer (URL provided in
   Awin's "Datafeeds" tab).
2. Filters to your chosen categories (e.g., sofas, beds, dining tables).
3. Picks the top 3-5 products per category by display price tier.
4. Outputs a fresh `_catalogue.js` with real `imageUrl`, `productUrl`,
   and `price` fields.

Run nightly via cron or Render's scheduled jobs. The catalogue stays fresh
without manual intervention.

### 5. Reconcile clicks vs conversions
Awin's reporting dashboard shows your daily clicks and confirmed sales by
advertiser. Compare against `/tmp/ptk-clicks.jsonl` to:

- See which products drive the most clicks (refine your catalogue).
- Spot which retailers convert best (lean into those).
- A/B test post-purchase CTA copy.
- Identify dead products (404s) and remove them.

## Realistic revenue maths

Conservative scenario assuming PTK Host Academy reaches 1,000 plays/month:

| Metric | Value |
|--------|------:|
| Monthly plays | 1,000 |
| % who reach upgrade shop | 80% |
| Avg upgrades viewed per session | 5 |
| Click-through rate on teaser | 4% |
| Click-through rate on post-purchase CTA | 12% |
| Conversion rate on retailer | 1.5% |
| Avg basket | £350 |
| Avg commission | 5% |
| **Monthly clicks** | ~880 |
| **Monthly orders** | ~13 |
| **Monthly commission** | **~£230** |

Aggressive scenario at 10,000 plays/month: **~£2,300/month** in commission.
This compounds: every additional retailer programme adds inventory; every
catalogue refresh improves relevance.

## Compliance / Legal notes

- **Disclosure**: Required by ASA. The `rel="sponsored"` attribute is
  already set on all affiliate links. Add a footer line: "We earn a
  commission when you buy through links — at no extra cost to you."
- **Cookies**: Affiliate links typically set a tracking cookie. Add a
  cookie banner before launch (none currently). Affiliate networks accept
  consent-mode integration.
- **Hot-linking images without affiliate licence**: Don't. UK retailers'
  CDNs sometimes block hot-linking; their imagery is copyrighted and only
  licensed when you're an enrolled publisher. The current placeholder images
  via `picsum.photos` are safe; once you're approved, swap to feed-supplied
  URLs.
- **Tax**: Affiliate income is trading income. Declare on your annual SA
  return (or assign to one of the Quantum Capital entities if appropriate
  for the corporate group's tax position).

## Files to edit when going live

1. **`_catalogue.js`** — populate real product URLs, image URLs, awinmid
   mappings, your publisher ID. Add more products from the feeds.
2. **`scripts/refresh_catalogue.js`** *(to create)* — nightly feed processor.
3. **`server.js`** — already has `/api/track-click` endpoint. Consider
   migrating from JSONL append to a real database when click volume exceeds
   ~10k/day.
4. **Footer of `index_template.html`** — add disclosure line.
5. **Render's `render.yaml`** — add a Render Disk so click logs persist
   across deploys.

## Beyond v6: future enhancements

- **Personalised products**: After a few scenarios, build a profile of
  what kinds of upgrades the user prefers (eco / luxury / minimalist) and
  surface matching catalogue items.
- **Furniture gallery screen**: A dedicated browsable shop within the game
  with category filters (sofas / beds / kitchens / lighting).
- **Wishlist mechanic**: Let users "save for later" — a list of real
  products they liked. Email digest weekly with prices/stock updates.
  Higher conversion than impulse clicks.
- **Property-style filtering**: When the user is shopping at the
  Edwardian Kensington property, surface mid-century / English heritage
  products. When at modern Shoreditch, surface industrial / Scandi.
- **Retailer-sponsored scenarios**: Offer named-brand placements within
  scenarios (e.g., "Mrs Henderson loved the John Lewis bedding") for an
  uplifted CPA.
