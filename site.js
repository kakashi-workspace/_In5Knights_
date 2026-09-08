/* =====================================================================
   IN5KNIGHTS — SHARED SITE UTILITIES
   Loaded on every page, after games-data.js and before the page's own
   script. Anything reused by 2+ pages lives here so there is exactly
   one implementation of each behavior (one star-renderer, one toast
   system, one card template, etc.) instead of copies drifting apart.
   ===================================================================== */

/* ---------- small helpers ---------- */
function formatPrice(value) {
  if (value === null || value === undefined) return "TBD";
  return "$" + Number(value).toFixed(2);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getDeveloper(developerId) {
  return DEVELOPERS[developerId] || {
    name: "Unknown Developer",
    bio: "",
    founded: "",
    teamSize: ""
  };
}

function placeholderArtURL(game, width, height, variant, index) {
  const title = (game && game.title) ? game.title : "Game";
  const color = (game && game.color) ? game.color : "6c5ce7";
  const label = variant === "screenshot"
    ? "Screenshot " + index
    : title;

  return "https://placehold.co/" +
    width + "x" + height +
    "/14161d/" + color +
    "?text=" + encodeURIComponent(label);
}

/* ---------- game artwork ---------- */
function getGameArtURL(game, variant, index) {
  if (!game || !game.slug) {
    return placeholderArtURL(game, 400, 225, variant, index);
  }

  /*
     Images are stored in the ROOT of the GitHub repository,
     not inside an "Images" folder.

     Example:
     ember-wake-cover.png
     ember-wake-1.png
     ember-wake-2.png
  */
  const basePath = game.slug;

  if (variant === "screenshot") {
    return basePath + "-" + index + ".png";
  }

  return basePath + "-cover.png";
}

function artErrorFallback(game, width, height, variant, index) {
  return "this.onerror=null;this.src='" +
    placeholderArtURL(game, width, height, variant, index) +
    "';";
}

/* Turns a 0–5 numeric rating into full/half/empty Bootstrap-icon stars.
   Used on store cards, the homepage grid, details page, and reviews —
   one function, so every star anywhere on the site is generated the
   same way instead of hand-typed per page. */
function renderStars(rating) {
  if (!rating) {
    return '<span class="text-muted-custom small">Not yet rated</span>';
  }

  let html = '<
