/* =========================================================
   In5kNights - Shared Site JavaScript
   ========================================================= */


/* ---------------------------------------------------------
   BASIC HELPERS
--------------------------------------------------------- */

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}


/* ---------------------------------------------------------
   IMAGE PATHS
   Images are stored in the ROOT of the repository.
--------------------------------------------------------- */

function placeholderArtURL(game, width, height, variant, index) {
  const title = game && game.title ? game.title : "In5kNights";

  return `https://placehold.co/${width}x${height}?text=${encodeURIComponent(title)}`;
}


function getGameArtURL(game, variant, index) {

  if (!game || !game.slug) {
    return placeholderArtURL(game, 400, 225, variant, index);
  }

  /*
    Example:

    slug = "ember-wake"

    Cover:
    ember-wake-cover.png

    Screenshots:
    ember-wake-1.png
    ember-wake-2.png
    ember-wake-3.png
  */

  // IMPORTANT:
  // Images are in the ROOT of the GitHub repository.
  const basePath = game.slug;

  if (variant === "screenshot") {
    return `${basePath}-${index}.png`;
  }

  return `${basePath}-cover.png`;
}


/* ---------------------------------------------------------
   ESCAPE HTML
--------------------------------------------------------- */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/
