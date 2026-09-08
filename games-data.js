/* =====================================================================
   IN5KNIGHTS — SHARED DATA SOURCE
   Every page (index, store, game-details, cart, dashboard) renders its
   grids/tables by LOOPING over this file instead of hand-typed HTML.
   Add a game here and it automatically appears everywhere it belongs
   (store grid, related games, dashboard, filters, genre list, etc.)
   with zero copy-pasted markup and no risk of the numbers disagreeing
   between pages.
   ===================================================================== */

const SITE_NAME = "In5kNights";

/* The signed-in developer for the Dashboard / Sell-Your-Game demo */
const CURRENT_DEVELOPER_ID = "lanternfall";

const DEVELOPERS = {
  "lanternfall":       { name: "Lanternfall Interactive", bio: "3-person indie studio, est. 2021. We make small, story-driven games about quiet worlds.", founded: 2021, teamSize: 3 },
  "two-static":        { name: "Two Static Games", bio: "A two-person duo obsessed with sound design and signal noise as gameplay.", founded: 2022, teamSize: 2 },
  "ashen-sprout":      { name: "Ashen Sprout Studio", bio: "Solo developer building roguelikes with permanent, story-driven consequences.", founded: 2020, teamSize: 1 },
  "loom-gear":         { name: "Loom & Gear Co.", bio: "A clockmaker-turned-developer duo crafting mechanical puzzle worlds.", founded: 2019, teamSize: 2 },
  "nightbloom":        { name: "Nightbloom Games", bio: "Four friends making quiet, unsettling horror games with a soft color palette.", founded: 2021, teamSize: 4 },
  "clockwork-orchard": { name: "Clockwork Orchard", bio: "A tiny team of platformer purists, obsessed with pixel-perfect jump arcs.", founded: 2018, teamSize: 3 },
  "salt-harbor":       { name: "Salt Harbor Studio", bio: "Coastal co-op games built for couches, made by a five-person crew.", founded: 2020, teamSize: 5 },
  "inkwell":           { name: "Inkwell Interactive", bio: "A writer-led studio telling small, personal stories through interactive fiction.", founded: 2022, teamSize: 2 },
  "terra-firma":       { name: "Terra Firma Studio", bio: "Slow, meditative simulation games about tending to small pieces of land.", founded: 2021, teamSize: 3 },
  "late-owl":          { name: "Late Owl Games", bio: "Narrative games set after hours, made by night-shift workers turned developers.", founded: 2023, teamSize: 2 },
  "circuit-break":     { name: "Circuit Break Studio", bio: "First-time developers building tight, difficult platformers.", founded: 2023, teamSize: 2 }
};

/* status: "published" | "pending" | "draft"
   Only "published" games are ever shown to buyers (store, homepage,
   related games, cart, checkout). Pending/draft only ever show on the
   owning developer's Dashboard — looping over the SAME array is what
   keeps that rule enforced in exactly one place (see games-data.js
   consumers: GAMES.filter(g => g.status === "published")). */
const GAMES = [
  {
    id: 1, slug: "ember-wake", title: "Ember Wake", developerId: "lanternfall",
    price: 14.99, genre: "Metroidvania", tags: ["Metroidvania", "Hand-Painted", "Single-Player", "Atmospheric"],
    rating: 4.9, reviewCount: 312, unitsSold: 412, wishlistCount: 812, status: "published", color: "ff8a3d",
    releaseDate: "2026-03-14",
    description: "Ember Wake is a hand-painted metroidvania set in a world where the sun has stopped rising. As the last lantern-keeper, you'll explore collapsing shrines, befriend forgotten spirits, and carry a dwindling flame through sixteen interconnected regions. Every ability you unlock reveals new paths back through areas you thought you'd already finished exploring.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "2 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "2 GB available space (SSD recommended)" },
    reviews: [
      { user: "@mosslight", rating: 5, text: "The art direction alone is worth the price. Combat feels a little slow early on but opens up fast once you get the double-jump." },
      { user: "@paperlantern", rating: 4.5, text: "One of the best map designs I've seen in the genre. Wish there was a New Game+ mode." },
      { user: "@driftwood_dev", rating: 4, text: "Beautiful, moody, and the soundtrack is stuck in my head. Runs great even on my old laptop." }
    ]
  },
  {
    id: 2, slug: "signal-loss", title: "Signal Loss", developerId: "two-static",
    price: 9.99, genre: "Sci-Fi", tags: ["Sci-Fi", "Co-op", "Puzzle", "2 Players"],
    rating: 4.6, reviewCount: 188, unitsSold: 260, wishlistCount: 340, status: "published", color: "2dd4bf",
    releaseDate: "2026-05-02",
    description: "A co-op sci-fi puzzler where communication is the only tool you have. Two players, two disconnected consoles, one dying satellite relay. Describe what you see, trust what your partner tells you, and route power before the signal cuts out for good.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "1.5 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1060 / RX 570", Storage: "1.5 GB available space" },
    reviews: [
      { user: "@relaystatic", rating: 5, text: "Played this with my sister over a call and we were both yelling by chapter 3. Perfect co-op tension." },
      { user: "@nullpointer", rating: 4, text: "Puzzle logic is sharp. Voice chat is basically required — don't try this over text." }
    ]
  },
  {
    id: 3, slug: "rootbound", title: "Rootbound", developerId: "ashen-sprout",
    price: 12.99, genre: "Roguelike", tags: ["Roguelike", "Farming", "Single-Player", "Replayable"],
    rating: 4.8, reviewCount: 245, unitsSold: 501, wishlistCount: 670, status: "published", color: "6c5ce7",
    releaseDate: "2026-01-22",
    description: "A cozy farming roguelike where every run reshapes the map. Plant, harvest, and rebuild a homestead that collapses back into wilderness each season — but every seed you save carries forward, so no two runs (and no two farms) ever look the same.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "1 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "1 GB available space" },
    reviews: [
      { user: "@greenthumb", rating: 5, text: "The seed-carryover system is genius. I've lost entire weekends to 'one more season.'" },
      { user: "@quietfields", rating: 4.5, text: "Gorgeous pixel art. Difficulty curve is fair even when a run goes badly." }
    ]
  },
  {
    id: 4, slug: "quiet-machines", title: "Quiet Machines", developerId: "loom-gear",
    price: 7.99, genre: "Puzzle", tags: ["Puzzle", "Relaxing", "Single-Player", "Mechanical"],
    rating: 4.4, reviewCount: 98, unitsSold: 210, wishlistCount: 265, status: "published", color: "6c5ce7",
    releaseDate: "2025-11-08",
    description: "Repair a workshop of gentle clockwork machines, one gear at a time. No timers, no fail states — just satisfying mechanical puzzles that reward slow, careful thinking, scored to a soft ambient soundtrack.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3", Memory: "2 GB RAM", Graphics: "Integrated GPU", Storage: "500 MB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "500 MB available space" },
    reviews: [
      { user: "@gearhead", rating: 4.5, text: "My go-to wind-down game after work. Genuinely relaxing." },
      { user: "@brasscogs", rating: 4, text: "Short but sweet. Would happily pay for a full expansion." }
    ]
  },
  {
    id: 5, slug: "hollow-static", title: "Hollow Static", developerId: "nightbloom",
    price: 16.99, genre: "Horror", tags: ["Horror", "Atmospheric", "Single-Player", "Psychological"],
    rating: 4.3, reviewCount: 156, unitsSold: 190, wishlistCount: 410, status: "published", color: "6c5ce7",
    releaseDate: "2026-02-10",
    description: "A found-footage horror game about a night-shift radio host who starts taking calls from a station that went dark in 1987. Every broadcast changes what's waiting for you in the hallway when the mic cuts out.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 Ti", Storage: "6 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i7 / Ryzen 7", Memory: "16 GB RAM", Graphics: "RTX 2060 / RX 5700", Storage: "6 GB available space (SSD recommended)" },
    reviews: [
      { user: "@static_hiss", rating: 4.5, text: "Genuinely unsettling without relying on jump scares. Sound design is the real monster here." },
      { user: "@nightowl_plays", rating: 4, text: "Slow burn. Stick with it past the first broadcast, it gets much stranger." }
    ]
  },
  {
    id: 6, slug: "tin-fable", title: "Tin Fable", developerId: "clockwork-orchard",
    price: 11.49, genre: "Platformer", tags: ["Platformer", "Precision", "Single-Player", "Storybook"],
    rating: 4.7, reviewCount: 134, unitsSold: 240, wishlistCount: 300, status: "published", color: "ff8a3d",
    releaseDate: "2026-04-18",
    description: "A tightly-tuned precision platformer told through a pop-up storybook world. Every level is a page you fold, tear, and rebuild to reach the next chapter of a tin soldier's fairy tale.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "1.2 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "1.2 GB available space" },
    reviews: [
      { user: "@framerperfect", rating: 5, text: "Controls are razor sharp. This is how precision platformers should feel." },
      { user: "@paperfold", rating: 4.5, text: "The storybook presentation is such a clever hook for a genre that's usually just abstract levels." }
    ]
  },
  {
    id: 7, slug: "driftport", title: "Driftport", developerId: "salt-harbor",
    price: 19.99, genre: "Co-op", tags: ["Co-op", "Sailing", "4 Players", "Couch Co-op"],
    rating: 4.5, reviewCount: 176, unitsSold: 300, wishlistCount: 380, status: "published", color: "2dd4bf",
    releaseDate: "2025-12-05",
    description: "Crew a leaking cargo ship with up to three friends, splitting duties between navigation, repairs, and cargo balance while storms try to capsize you. Built for one couch and a lot of yelling.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050", Storage: "3 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i7 / Ryzen 7", Memory: "16 GB RAM", Graphics: "GTX 1660 / RX 5600", Storage: "3 GB available space" },
    reviews: [
      { user: "@saltyplayer", rating: 5, text: "Best couch co-op we've played all year. Chaotic in the best way." },
      { user: "@fourhandsonboard", rating: 4, text: "Needs online co-op honestly, but local is a blast with the right group." }
    ]
  },
  {
    id: 8, slug: "paperbound", title: "Paperbound", developerId: "inkwell",
    price: 6.99, genre: "Narrative", tags: ["Narrative", "Short Story", "Single-Player", "Slice of Life"],
    rating: 4.2, reviewCount: 88, unitsSold: 150, wishlistCount: 190, status: "published", color: "6c5ce7",
    releaseDate: "2025-10-30",
    description: "A quiet interactive short story about a letter carrier in a town where every envelope holds a small piece of someone's life. Two hours long, no combat, just choices that ripple through one afternoon.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3", Memory: "2 GB RAM", Graphics: "Integrated GPU", Storage: "300 MB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "300 MB available space" },
    reviews: [
      { user: "@quiethours", rating: 4.5, text: "Made me cry on a lunch break, which I was not prepared for." },
      { user: "@shortandsweet", rating: 4, text: "Short, but every choice actually matters. Replayed it twice already." }
    ]
  },
  {
    id: 9, slug: "static-fields", title: "Static Fields", developerId: "lanternfall",
    price: 9.99, genre: "Sci-Fi", tags: ["Sci-Fi", "Exploration"],
    rating: 0, reviewCount: 0, unitsSold: 0, wishlistCount: 64, status: "pending", color: "6c5ce7",
    releaseDate: "2026-09-01",
    description: "Lanternfall Interactive's second title: a slow sci-fi exploration game about mapping a dead orbital station by flashlight. Currently awaiting store review.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "2 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "2 GB available space" },
    reviews: []
  },
  {
    id: 10, slug: "untitled-project", title: "Untitled Project", developerId: "lanternfall",
    price: null, genre: "", tags: [],
    rating: 0, reviewCount: 0, unitsSold: 0, wishlistCount: 0, status: "draft", color: "2dd4bf",
    releaseDate: null,
    description: "",
    minSpec: {}, recSpec: {}, reviews: []
  },
  {
    id: 11, slug: "moss-and-mortar", title: "Moss & Mortar", developerId: "terra-firma",
    price: 13.99, genre: "Simulation", tags: ["Simulation", "Relaxing", "Single-Player", "Building"],
    rating: 4.6, reviewCount: 120, unitsSold: 220, wishlistCount: 275, status: "published", color: "2dd4bf",
    releaseDate: "2026-06-01",
    description: "Restore a crumbling stone cottage and the overgrown plot around it, one season at a time. No combat, no timers — just moss to clear, walls to rebuild, and a garden that slowly comes back to life.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "2.5 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "2.5 GB available space" },
    reviews: [
      { user: "@cottagecore_kim", rating: 5, text: "This is exactly the low-stakes building game I didn't know I needed." },
      { user: "@mossy_bricks", rating: 4.5, text: "Beautiful seasonal lighting changes. Very meditative." }
    ]
  },
  {
    id: 12, slug: "nightshift-diner", title: "Nightshift Diner", developerId: "late-owl",
    price: 8.49, genre: "Narrative", tags: ["Narrative", "Slice of Life", "Single-Player", "Cozy"],
    rating: 4.5, reviewCount: 140, unitsSold: 260, wishlistCount: 300, status: "published", color: "ff8a3d",
    releaseDate: "2026-07-20",
    description: "Run the graveyard shift at a diner where every 3am regular is carrying something they need to talk about. Pour coffee, take orders, and decide how much of yourself to share back.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "1.5 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5", Memory: "8 GB RAM", Graphics: "Integrated GPU", Storage: "1.5 GB available space" },
    reviews: [
      { user: "@thirdshift", rating: 5, text: "Every regular feels like a real person. Wrote actual notes about their stories." },
      { user: "@coffeepot_dev", rating: 4, text: "Cozy but not shallow — some of these conversations really sit with you." }
    ]
  },
  {
    id: 13, slug: "voltbound", title: "Voltbound", developerId: "circuit-break",
    price: 10.99, genre: "Platformer", tags: ["Platformer", "Difficult", "Single-Player", "Electric"],
    rating: 4.1, reviewCount: 76, unitsSold: 130, wishlistCount: 140, status: "published", color: "6c5ce7",
    releaseDate: "2026-08-12",
    description: "A brutally difficult platformer about a lightning-fast courier drone rerouting power through a collapsing grid. One hit resets the room — but every reset is instant, so the failure never really stops the run.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3 / Ryzen 3", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "800 MB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 / RX 560", Storage: "800 MB available space" },
    reviews: [
      { user: "@nodeath_runs", rating: 4.5, text: "Instant respawns make the difficulty feel fair instead of frustrating." },
      { user: "@sparkjumper", rating: 3.5, text: "Rough around the edges but the core movement tech is really satisfying once it clicks." }
    ]
  },
  {
    id: 14, slug: "cinder-choir", title: "Cinder Choir", developerId: "nightbloom",
    price: 14.49, genre: "Horror", tags: ["Horror", "Atmospheric", "Single-Player", "Slow Burn"],
    rating: 4.0, reviewCount: 64, unitsSold: 95, wishlistCount: 150, status: "published", color: "ff8a3d",
    releaseDate: "2026-08-30",
    description: "Nightbloom Games' latest: a slow-burn horror game set in a church choir that never stopped rehearsing after the town emptied out. Follow the singing, but never quite catch up to it.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "8 GB RAM", Graphics: "GTX 1050 Ti", Storage: "4 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i7 / Ryzen 7", Memory: "16 GB RAM", Graphics: "RTX 2060 / RX 5700", Storage: "4 GB available space" },
    reviews: [
      { user: "@quietchoir", rating: 4, text: "Slower than Hollow Static but the dread builds in a different, effective way." }
    ]
  },
  {
    id: 15, slug: "glass-orchard", title: "Glass Orchard", developerId: "loom-gear",
    price: 5.99, genre: "Puzzle", tags: ["Puzzle", "Minimalist", "Single-Player", "Short"],
    rating: 4.6, reviewCount: 102, unitsSold: 300, wishlistCount: 210, status: "published", color: "2dd4bf",
    releaseDate: "2026-01-05",
    description: "A minimalist glass-cutting puzzle game about growing an orchard of light through a single stained-glass window, one careful cut at a time.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i3", Memory: "2 GB RAM", Graphics: "Integrated GPU", Storage: "400 MB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i5", Memory: "4 GB RAM", Graphics: "Integrated GPU", Storage: "400 MB available space" },
    reviews: [
      { user: "@lightglass", rating: 5, text: "Short, gorgeous, and the puzzle logic clicks perfectly by the third level." }
    ]
  },
  {
    id: 16, slug: "wrecked-tide", title: "Wrecked Tide", developerId: "salt-harbor",
    price: 17.99, genre: "Co-op", tags: ["Co-op", "Survival", "2 Players", "Ocean"],
    rating: 4.3, reviewCount: 58, unitsSold: 90, wishlistCount: 130, status: "published", color: "6c5ce7",
    releaseDate: "2026-05-22",
    description: "Two shipwrecked survivors, one raft, and a tide that keeps trying to take back everything you've salvaged. Salt Harbor Studio's follow-up to Driftport, built for two.",
    minSpec: { OS: "Windows 10 64-bit", Processor: "Intel i5 / Ryzen 5", Memory: "6 GB RAM", Graphics: "GTX 1050", Storage: "2.5 GB available space" },
    recSpec: { OS: "Windows 11 64-bit", Processor: "Intel i7 / Ryzen 7", Memory: "12 GB RAM", Graphics: "GTX 1660", Storage: "2.5 GB available space" },
    reviews: [
      { user: "@raftlife", rating: 4.5, text: "Same great co-op tension as Driftport but the survival elements add a nice extra layer." }
    ]
  }
];

/* Demo promo codes for the cart page — front-end only, no real backend. */
const PROMO_CODES = {
  "FORGE10": { type: "percent", value: 10, label: "10% off your order" },
  "WELCOME5": { type: "flat", value: 5, label: "$5 off your order" },
  "INDIE20": { type: "percent", value: 20, label: "20% off your order (launch week)" }
};

const TAX_RATE = 0.08;
