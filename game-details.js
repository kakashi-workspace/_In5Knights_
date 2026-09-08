/* Game-details page: reads ?id= from the URL and renders one game's
   full detail view — screenshots, specs, reviews, related games — by
   looping over that game's data instead of this file being hard-coded
   to a single title. */

const SCREENSHOT_COLORS = ["ff8a3d", "6c5ce7", "2dd4bf"];

function buildSpecAccordionItem(idSuffix, label, specObj, expanded) {
  const rows = Object.entries(specObj).map(([key, val]) =>
    '<div class="d-flex justify-content-between py-1"><span>' + key + "</span><span>" + val + "</span></div>"
  ).join("");
  return (
    '<div class="accordion-item">' +
      '<h2 class="accordion-header">' +
        '<button class="accordion-button' + (expanded ? "" : " collapsed") + '" type="button" data-bs-toggle="collapse" data-bs-target="#spec' + idSuffix + '" aria-expanded="' + expanded + '" aria-controls="spec' + idSuffix + '">' +
          label +
        "</button>" +
      "</h2>" +
      '<div id="spec' + idSuffix + '" class="accordion-collapse collapse' + (expanded ? " show" : "") + '" data-bs-parent="#specsAccordion">' +
        '<div class="accordion-body mono small">' + (rows || '<p class="mb-0">Not specified.</p>') + "</div>" +
      "</div>" +
    "</div>"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const idParam = getQueryParam("id");
  const requestedId = idParam ? Number(idParam) : 1;
  const game = GAMES.find((g) => g.id === requestedId && g.status === "published");

  if (!game) {
    document.getElementById("notFoundState").classList.remove("d-none");
    updateCartBadge(__in5kCartCount);
    return;
  }

  document.getElementById("gameDetailContent").classList.remove("d-none");
  const dev = getDeveloper(game.developerId);

  document.title = game.title + " — In5kNights";
  document.getElementById("pageTitle").textContent = game.title + " — In5kNights";

  const breadcrumbGenre = document.getElementById("breadcrumbGenre");
  breadcrumbGenre.textContent = game.genre;
  breadcrumbGenre.href = "store.html?genre=" + encodeURIComponent(game.genre);
  document.getElementById("breadcrumbTitle").textContent = game.title;

  /* ---- screenshots (3, looped) + matching thumbnail rail ---- */
  let inner = "", thumbs = "";
  [1, 2, 3].forEach((screenshotIndex) => {
    const src = getGameArtURL(game, "screenshot", screenshotIndex);
    const fallback = placeholderArtURL(game, 900, 506, "screenshot", screenshotIndex);
    inner += '<div class="carousel-item' + (screenshotIndex === 1 ? " active" : "") + '"><img src="' + src + '" onerror="this.onerror=null;this.src=\'' + fallback + '\';" class="d-block w-100" alt="' + game.title + ' screenshot ' + screenshotIndex + '"></div>';
    thumbs += '<img src="' + src + '" onerror="this.onerror=null;this.src=\'' + fallback + '\';" class="' + (screenshotIndex === 1 ? "active" : "") + '" data-bs-target="#screenshotCarousel" data-bs-slide-to="' + (screenshotIndex - 1) + '" alt="Thumbnail ' + screenshotIndex + '">';
  });
  document.getElementById("screenshotInner").innerHTML = inner;
  document.getElementById("thumbStrip").innerHTML = thumbs;

  document.getElementById("gameDescription").textContent = game.description || "No description yet.";
  document.getElementById("gameTags").innerHTML = game.tags.map((tag) =>
    '<span class="badge rounded-pill" style="background-color: var(--bg-surface-alt); color: var(--text-muted); border: 1px solid var(--border-subtle);">' + tag + "</span>"
  ).join("");

  /* ---- system requirements accordion, built from minSpec/recSpec ---- */
  document.getElementById("specsAccordion").innerHTML =
    buildSpecAccordionItem("Min", "Minimum", game.minSpec, true) +
    buildSpecAccordionItem("Rec", "Recommended", game.recSpec, false);

  /* ---- reviews, looped ---- */
  const reviewsPanel = document.getElementById("reviewsPanel");
  if (game.reviews.length === 0) {
    reviewsPanel.innerHTML = '<p class="text-muted-custom mb-0">No reviews yet — be the first to play and share one.</p>';
  } else {
    reviewsPanel.innerHTML = game.reviews.map((r, i) =>
      '<div class="review-item ' + (i < game.reviews.length - 1 ? "pb-3 mb-3" : "") + '">' +
        '<div class="d-flex justify-content-between"><strong>' + r.user + "</strong>" + renderStars(r.rating) + "</div>" +
        '<p class="text-muted-custom small mb-0 mt-1">' + r.text + "</p>" +
      "</div>"
    ).join("");
  }

  /* ---- purchase panel ---- */
  document.getElementById("detailTitle").textContent = game.title;
  const devLink = document.getElementById("detailDevLink");
  devLink.textContent = dev.name;
  const detailKeyArt = document.getElementById("detailKeyArt");
  detailKeyArt.src = getGameArtURL(game, "cover");
  detailKeyArt.onerror = () => { detailKeyArt.src = placeholderArtURL(game, 500, 281, "cover"); };
  detailKeyArt.alt = game.title + " key art";
  document.getElementById("detailPrice").textContent = formatPrice(game.price);
  document.getElementById("detailRatingLine").innerHTML = game.rating
    ? renderStars(game.rating) + " " + game.rating + " (" + game.reviewCount + " reviews)"
    : "Not yet rated";

  document.getElementById("buyNowBtn").addEventListener("click", () => {
    addToCartById(game.id);
    window.location.href = "cart.html";
  });
  document.getElementById("addToCartBtn").dataset.addId = game.id;
  document.getElementById("wishlistBtn").dataset.wishlistId = game.id;

  /* ---- developer card ---- */
  document.getElementById("detailDevName").textContent = dev.name;
  document.getElementById("detailDevMeta").textContent = dev.teamSize + "-person indie studio, est. " + dev.founded;
  document.getElementById("detailDevBio").textContent = dev.bio;
  const otherGamesLink = document.getElementById("devOtherGamesLink");
  otherGamesLink.textContent = "Browse Similar Games";
  otherGamesLink.href = "store.html?genre=" + encodeURIComponent(game.genre);

  /* ---- related games: same genre first, backfilled with top-rated others ---- */
  const published = GAMES.filter((g) => g.status === "published" && g.id !== game.id);
  const sameGenre = published.filter((g) => g.genre === game.genre);
  const others = published.filter((g) => g.genre !== game.genre).sort((a, b) => b.rating - a.rating);
  const related = [...sameGenre, ...others].slice(0, 4);
  document.getElementById("relatedGrid").innerHTML = related.map((g) => gameCardHTML(g, { quickAdd: true })).join("");

  /* ---- nav search on this page still jumps into the store ---- */
  document.getElementById("navSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input[name="q"]').value.trim();
    window.location.href = "store.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
});
