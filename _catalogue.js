// ─── REAL-PRODUCT CATALOGUE (AFFILIATE-READY) ───────────────────────────────
// This catalogue maps in-game upgrade IDs to real-world products from UK
// retailers. Each product entry contains:
//
//   id          — internal SKU
//   name        — display name
//   retailer    — display name of the retailer
//   network     — affiliate network code ('awin', 'sovrn', 'rakuten', 'direct')
//   imageUrl    — public image URL (placeholder.com fallback used initially)
//   productUrl  — destination URL with affiliate tag baked in
//   price       — display price (string, refreshed from feed)
//   tier        — array of property tiers this product is suitable for [1..6]
//
// IN PRODUCTION:
// 1. Sign up as a publisher with Awin (and optionally Sovrn for fashion/home brands).
// 2. Apply to retailer programmes: John Lewis, IKEA, Dunelm, Heal's, Furniture
//    Village, DFS, Sofology, Wayfair UK, Habitat, Loaf.
// 3. Once approved, download their daily product feed (CSV or JSON) and run
//    /scripts/refresh_catalogue.js to repopulate this file.
// 4. Affiliate-tagged URLs look like: https://www.awin1.com/cread.php?awinmid=XXX&awinaffid=YYY&p=ENCODED_PRODUCT_URL
// 5. Track click-through events with the existing /api/track endpoint
//    (see server.js — coming in v7) so you can measure conversion per game tier.
//
// DURING DEVELOPMENT (now):
// All imageUrls below point to picsum.photos (a free placeholder service that
// always returns a real image). Swap in real retailer image URLs once you have
// the affiliate licence.

const CATALOGUE_DATA = {
  // ─── SOFAS ─────────────────────────────────────────────────────────────────
  sofa: [
    {
      id: 'sofa_jl_riley',
      name: 'Riley 3-Seater',
      retailer: 'John Lewis & Partners',
      network: 'awin',
      // Replace with actual JL image once affiliate-approved:
      // imageUrl: 'https://johnlewis.scene7.com/is/image/JohnLewis/.../riley-3seater.jpg'
      imageUrl: 'https://picsum.photos/seed/sofa-riley/400/250',
      productUrl: 'https://www.johnlewis.com/john-lewis-partners-riley-large-3-seater-sofa/p4859891',
      price: '£1,499',
      tier: [1, 2, 3]
    },
    {
      id: 'sofa_ikea_kivik',
      name: 'KIVIK 3-Seater',
      retailer: 'IKEA',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/sofa-kivik/400/250',
      productUrl: 'https://www.ikea.com/gb/en/p/kivik-3-seat-sofa-tibbleby-beige-grey-s09484829/',
      price: '£549',
      tier: [1, 2]
    },
    {
      id: 'sofa_heals_belgrave',
      name: 'Belgrave Velvet 4-Seater',
      retailer: "Heal's",
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/sofa-belgrave/400/250',
      productUrl: 'https://www.heals.com/belgrave-4-seater-sofa.html',
      price: '£3,895',
      tier: [4, 5, 6]
    },
    {
      id: 'sofa_loaf_squishmeister',
      name: 'Squishmeister 3-Seater',
      retailer: 'Loaf',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/sofa-squish/400/250',
      productUrl: 'https://loaf.com/products/squishmeister-3-seater-sofa',
      price: '£2,395',
      tier: [3, 4, 5]
    },
  ],

  // ─── BEDS ──────────────────────────────────────────────────────────────────
  bed: [
    {
      id: 'bed_jl_emily',
      name: 'Emily Upholstered King',
      retailer: 'John Lewis & Partners',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/bed-emily/400/250',
      productUrl: 'https://www.johnlewis.com/john-lewis-emily-upholstered-bed-frame-king-size/p2306947',
      price: '£899',
      tier: [1, 2, 3, 4]
    },
    {
      id: 'bed_hypnos_orthos',
      name: 'Orthos Elite Wool Mattress',
      retailer: 'Hypnos',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/bed-hypnos/400/250',
      productUrl: 'https://www.hypnosbeds.com/orthos-elite-wool',
      price: '£1,599',
      tier: [3, 4, 5]
    },
    {
      id: 'bed_savoir_no2',
      name: "Savoir No. 2 Bed",
      retailer: 'Savoir Beds',
      network: 'direct',
      imageUrl: 'https://picsum.photos/seed/bed-savoir/400/250',
      productUrl: 'https://www.savoirbeds.com/savoir-no2',
      price: '£12,500',
      tier: [5, 6]
    },
  ],

  // ─── KITCHEN ───────────────────────────────────────────────────────────────
  kitchen: [
    {
      id: 'coffee_jl_sage',
      name: 'Sage Barista Express',
      retailer: 'John Lewis & Partners',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/coffee-sage/400/250',
      productUrl: 'https://www.johnlewis.com/sage-the-barista-express-bes875uk-bean-to-cup-coffee-machine/p2199988',
      price: '£599',
      tier: [1, 2, 3, 4]
    },
    {
      id: 'fridge_smeg_fab32',
      name: 'Smeg FAB32 Retro Fridge',
      retailer: 'John Lewis & Partners',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/fridge-smeg/400/250',
      productUrl: 'https://www.johnlewis.com/smeg-fab32rcr5uk-50s-style-fridge-freezer/p4994859',
      price: '£2,099',
      tier: [3, 4, 5, 6]
    },
  ],

  // ─── BATHROOM ──────────────────────────────────────────────────────────────
  bathroom: [
    {
      id: 'bath_dunelm_freestand',
      name: 'Freestanding Roll-Top Bath',
      retailer: 'Dunelm',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/bath-dunelm/400/250',
      productUrl: 'https://www.dunelm.com/category/home-and-furniture/bathroom',
      price: '£549',
      tier: [3, 4, 5]
    },
  ],

  // ─── LIGHTING ──────────────────────────────────────────────────────────────
  lighting: [
    {
      id: 'pendant_jl_brass',
      name: 'Brass Cluster Pendant',
      retailer: 'John Lewis & Partners',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/pendant-brass/400/250',
      productUrl: 'https://www.johnlewis.com/lighting',
      price: '£199',
      tier: [2, 3, 4, 5]
    },
    {
      id: 'lamp_anglepoise',
      name: 'Anglepoise Original 1227',
      retailer: 'Heal\'s',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/lamp-anglepoise/400/250',
      productUrl: 'https://www.heals.com/anglepoise-original-1227.html',
      price: '£275',
      tier: [3, 4, 5, 6]
    },
  ],

  // ─── RUGS / TEXTILES ───────────────────────────────────────────────────────
  rug: [
    {
      id: 'rug_dunelm_persian',
      name: 'Heritage Persian-Style 200×290',
      retailer: 'Dunelm',
      network: 'awin',
      imageUrl: 'https://picsum.photos/seed/rug-dunelm/400/250',
      productUrl: 'https://www.dunelm.com/category/home-and-furniture/rugs',
      price: '£199',
      tier: [1, 2, 3, 4]
    },
  ],
};

// Map game upgrade IDs → catalogue product IDs.
// One in-game upgrade can have a "featured" real product that surfaces in
// the shop card and post-purchase modal. Multiple products per upgrade
// allowed — we surface the first one matching the property's tier.
const UPGRADE_TO_PRODUCT = {
  // Notting Hill (tier 1)
  premium_bedding: ['bed_jl_emily', 'bed_hypnos_orthos'],
  smart_tv: [],
  artwork: [],
  smart_lock: [],
  fast_wifi: [],
  air_purifier: [],
  coffee_machine: ['coffee_jl_sage'],
  welcome_pack: [],
  boiler: [],
  // Shoreditch (tier 2)
  fast_wifi_2: [],
  smart_tv_2: [],
  bathroom_reno: ['bath_dunelm_freestand'],
  second_bed: ['bed_jl_emily'],
  heating_fix: [],
  rooftop: [],
  noise_sensor: [],
  record_player: ['lamp_anglepoise'],
  dishwasher: [],

  // Chelsea (tier 3)
  garden_land: [],
  cinema: [],
  art: [],
  multi_lang: [],
  full_smart_home: [],

  // Mayfair (tier 4)
  rooftop: [],
  art_collection: [],
  home_cinema: [],
  butler: [],
  payment_pro: [],
  wine_cellar: [],

  // Kensington (tier 5)
  pool: [],
  helipad: [],
  art_gallery: [],
  full_butler: [],
  recording_studio: [],
  stables: [],

  // Covent Garden (tier 6) — royal tier
  helipad_transfer: [],
  royal_kitchen: ['fridge_smeg_fab32'],
  royal_suite: ['bed_savoir_no2'],
  private_theatre: [],
  diplomatic_security: [],
};

// Get a featured product for an upgrade, filtered by property tier
function getFeaturedProduct(upgradeId, propTier) {
  const productIds = UPGRADE_TO_PRODUCT[upgradeId] || [];
  for (const pid of productIds) {
    // Look up the product across all categories
    for (const cat of Object.keys(CATALOGUE_DATA)) {
      const product = CATALOGUE_DATA[cat].find(p => p.id === pid);
      if (product && (!propTier || product.tier.includes(propTier))) {
        return { ...product, category: cat };
      }
    }
  }
  return null;
}

// Get all products in a category — for browsable gallery
function getCatalogueByCategory(cat, propTier) {
  const items = CATALOGUE_DATA[cat] || [];
  if (propTier) return items.filter(p => p.tier.includes(propTier));
  return items;
}

// Build the affiliate-tracked URL.
// For Awin: https://www.awin1.com/cread.php?awinmid={MERCHANT_ID}&awinaffid={YOUR_PUBLISHER_ID}&p={url-encoded product URL}
// We accept a base productUrl and wrap it appropriately by network.
function buildAffiliateUrl(product, ourPublisherId = 'YOUR_AWIN_PUBLISHER_ID') {
  if (!product || !product.productUrl) return '#';
  if (product.network === 'awin') {
    // Each retailer has a different awinmid. Retailer→awinmid map below
    // would be populated during onboarding; for now, fall through to direct.
    const awinmidByRetailer = {
      'John Lewis & Partners': '7488',
      'IKEA': '12345',           // example — replace once enrolled
      "Heal's": '54321',         // example
      'Dunelm': '11111',         // example
      'Loaf': '22222',           // example
      'Hypnos': '33333',         // example
    };
    const mid = awinmidByRetailer[product.retailer];
    if (mid && ourPublisherId !== 'YOUR_AWIN_PUBLISHER_ID') {
      return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${ourPublisherId}&p=${encodeURIComponent(product.productUrl)}`;
    }
  }
  // Fall back to direct URL (no affiliate revenue but still works for demo)
  return product.productUrl;
}

// Render a small "real product" card for use inside upgrade cards
function renderProductTeaser(product) {
  if (!product) return '';
  return `
    <div class="product-teaser" style="margin-top:8px;border-top:1px dashed rgba(0,0,0,0.15);padding-top:8px;display:flex;gap:8px;align-items:center">
      <img src="${product.imageUrl}" alt="${product.name}"
           style="width:42px;height:42px;object-fit:cover;border-radius:6px;flex-shrink:0;background:#eee"
           loading="lazy" onerror="this.style.display='none'"/>
      <div style="flex:1;min-width:0">
        <div style="font-size:9px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.04em">${product.retailer}</div>
        <div style="font-size:11px;font-weight:700;color:#1C2280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${product.name}</div>
        <div style="font-size:10px;font-weight:600;color:#6AAF2E">${product.price}</div>
      </div>
      <a href="${buildAffiliateUrl(product)}" target="_blank" rel="noopener nofollow sponsored"
         onclick="event.stopPropagation(); trackProductClick('${product.id}','${product.retailer}')"
         style="font-size:10px;font-weight:800;color:#1C2280;text-decoration:none;background:#FFD89C;padding:4px 8px;border-radius:6px;white-space:nowrap">
        View →
      </a>
    </div>`;
}

// Track a product click (placeholder for analytics)
function trackProductClick(productId, retailer) {
  // In production: POST to /api/track-click with productId, retailer, ts, sessionId
  console.log(`[product-click] ${productId} → ${retailer}`);
  if (typeof fetch !== 'undefined') {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, retailer, ts: Date.now() })
    }).catch(() => {}); // silent fail in dev
  }
}
