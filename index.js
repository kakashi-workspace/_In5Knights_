/* Homepage-only logic: category pills, featured carousel, new
   releases grid — all rendered by looping over GAMES. */
document.addEventListener("DOMContentLoaded", () => {
  const published = GAMES.filter((g) => g.status === "published");

  /* ---- category pills (loop over unique genres in the data) ---- */
  const genres = [...new Set(published.map((g) => g.genre).filter(Boolean))].sort();
  const pillsEl = document.getElementById("categoryPills");
  let pillsHTML = '<a href="store.html" class="category-pill active">All</a>';
  genres.forEach((genre) => {
    pillsHTML += '<a href="store.html?genre=' + encodeURIComponent(genre) + '" class="category-pill">' + genre + "</a>";
  });
  pillsEl.innerHTML = pillsHTML;

  /* ---- featured carousel: top 3 rated published games ---- */
  const featured = [...published].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const indicatorsEl = document.getElementById("featuredIndicators");
  const innerEl = document.getElementById("featuredInner");
  let indicatorsHTML = "";
  let innerHTML = "";
  featured.forEach((game, i) => {
    const dev = getDeveloper(game.developerId);
    indicatorsHTML +=
      '<button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="' + i + '"' +
      (i === 0 ? ' class="active" aria-current="true"' : "") + ' aria-label="Slide ' + (i + 1) + '"></button>';
    innerHTML +=
      '<div class="carousel-item' + (i === 0 ? " active" : "") + '">' +
        '<img src="' + getGameArtURL(game, "cover") + '" onerror="' + artErrorFallback(game, 1200, 450, "cover") + '" class="d-block w-100" alt="' + game.title + ' key art">' +
        '<div class="carousel-caption d-none d-md-block text-start" style="left: 5%; bottom: 15%; background: rgba(11,12,16,0.7); padding: 1.5rem; border-radius: 12px; max-width: 420px;">' +
          '<h3 class="brand-font">' + game.title + "</h3>" +
          '<p class="mb-1">' + game.description.slice(0, 110) + (game.description.length > 110 ? "…" : "") + "</p>" +
          '<span class="price-tag fs-5">' + formatPrice(game.price) + "</span>" +
          ' <a href="game-details.html?id=' + game.id + '" class="btn btn-outline-forge btn-sm ms-2">View</a>' +
        "</div>" +
      "</div>";
  });
  indicatorsEl.innerHTML = indicatorsHTML;
  innerEl.innerHTML = innerHTML;

  /* ---- new releases grid: 4 most recently released, published games ---- */
  const newest = [...published].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 4);
  document.getElementById("newReleasesGrid").innerHTML = newest.map((g) => gameCardHTML(g, { quickAdd: true })).join("");

  /* ---- nav search: send the query straight into the store page ---- */
  const searchForm = document.getElementById("navSearchForm");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchForm.querySelector('input[name="q"]').value.trim();
    window.location.href = "store.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  /* ---- newsletter form validation + toast ---- */
  const newsletterForm = document.getElementById("newsletterForm");
  enableFormValidation(newsletterForm, () => {
    showToast("You're subscribed! Watch your inbox for new releases.", "success");
    newsletterForm.reset();
    newsletterForm.classList.remove("was-validated");
  });

  /* ---- starting demo cart badge ---- */
  updateCartBadge(DEMO_CART_STARTING_IDS.length);
});
