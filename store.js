/* Store page engine: search, genre/price/rating filters, sort, and
   pagination are all computed from GAMES + the current filter state,
   then re-rendered by looping over the result — nothing here is a
   fixed, hand-typed list. */
document.addEventListener("DOMContentLoaded", () => {
  const PAGE_SIZE = 6;
  const published = GAMES.filter((g) => g.status === "published");
  const maxCatalogPrice = Math.ceil(Math.max(...published.map((g) => g.price || 0)) / 5) * 5;

  const state = {
    search: "",
    genres: new Set(),
    maxPrice: maxCatalogPrice,
    minRating: 0,
    sort: "popular",
    page: 1
  };

  const els = {
    filterSearch: document.getElementById("filterSearch"),
    genreFilterList: document.getElementById("genreFilterList"),
    priceRange: document.getElementById("priceRange"),
    priceRangeLabel: document.getElementById("priceRangeLabel"),
    ratingFilter: document.getElementById("ratingFilter"),
    sortSelect: document.getElementById("sortSelect"),
    grid: document.getElementById("storeGrid"),
    emptyState: document.getElementById("emptyState"),
    resultsCountLabel: document.getElementById("resultsCountLabel"),
    pagination: document.getElementById("storePagination")
  };

  /* ---- build genre checkboxes by looping over unique genres ---- */
  const genreCounts = {};
  published.forEach((g) => { genreCounts[g.genre] = (genreCounts[g.genre] || 0) + 1; });
  const genres = Object.keys(genreCounts).sort();
  els.genreFilterList.innerHTML = genres.map((genre) => {
    const id = "genre-" + genre.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
      '<div class="form-check mb-2">' +
        '<input class="form-check-input genre-checkbox" type="checkbox" id="' + id + '" value="' + genre + '">' +
        '<label class="form-check-label d-flex justify-content-between" for="' + id + '">' +
          "<span>" + genre + "</span><span class=\"text-muted-custom\">" + genreCounts[genre] + "</span>" +
        "</label>" +
      "</div>"
    );
  }).join("");

  els.priceRange.max = maxCatalogPrice;
  els.priceRange.value = maxCatalogPrice;
  els.priceRangeLabel.textContent = "$" + maxCatalogPrice;

  /* ---- read ?q=, ?genre=, ?sort= from the URL (links from index.html) ---- */
  const qParam = getQueryParam("q");
  const genreParam = getQueryParam("genre");
  const sortParam = getQueryParam("sort");
  if (qParam) { state.search = qParam; els.filterSearch.value = qParam; }
  if (genreParam && genres.includes(genreParam)) {
    state.genres.add(genreParam);
    const cb = els.genreFilterList.querySelector('input[value="' + genreParam + '"]');
    if (cb) cb.checked = true;
  }
  if (sortParam) { state.sort = sortParam; els.sortSelect.value = sortParam; }

  function getFilteredSorted() {
    let list = published.filter((g) => {
      const term = state.search.trim().toLowerCase();
      const dev = getDeveloper(g.developerId).name.toLowerCase();
      const matchesSearch = !term || g.title.toLowerCase().includes(term) || dev.includes(term) || g.genre.toLowerCase().includes(term);
      const matchesGenre = state.genres.size === 0 || state.genres.has(g.genre);
      const matchesPrice = (g.price || 0) <= state.maxPrice;
      const matchesRating = g.rating >= state.minRating;
      return matchesSearch && matchesGenre && matchesPrice && matchesRating;
    });

    const sorters = {
      popular: (a, b) => b.unitsSold - a.unitsSold,
      newest: (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
      "price-asc": (a, b) => (a.price || 0) - (b.price || 0),
      "price-desc": (a, b) => (b.price || 0) - (a.price || 0),
      rating: (a, b) => b.rating - a.rating
    };
    return list.sort(sorters[state.sort] || sorters.popular);
  }

  function render() {
    const full = getFilteredSorted();
    const totalPages = Math.max(1, Math.ceil(full.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = full.slice(start, start + PAGE_SIZE);

    els.grid.innerHTML = pageItems.map((g) => gameCardHTML(g, { quickAdd: true })).join("");
    els.emptyState.classList.toggle("d-none", full.length > 0);

    els.resultsCountLabel.textContent = full.length === 0
      ? "No games match your filters"
      : "Showing " + (start + 1) + "\u2013" + Math.min(start + PAGE_SIZE, full.length) + " of " + full.length + " games";

    /* ---- pagination buttons, looped from totalPages ---- */
    let pagHTML = '<li class="page-item' + (state.page === 1 ? " disabled" : "") + '"><a class="page-link" href="#" data-page="' + (state.page - 1) + '" tabindex="-1">Previous</a></li>';
    for (let p = 1; p <= totalPages; p++) {
      pagHTML += '<li class="page-item' + (p === state.page ? " active" : "") + '" aria-current="' + (p === state.page ? "page" : "false") + '"><a class="page-link" href="#" data-page="' + p + '">' + p + "</a></li>";
    }
    pagHTML += '<li class="page-item' + (state.page === totalPages ? " disabled" : "") + '"><a class="page-link" href="#" data-page="' + (state.page + 1) + '">Next</a></li>';
    els.pagination.innerHTML = pagHTML;
  }

  function resetFilters() {
    state.search = ""; state.genres.clear(); state.maxPrice = maxCatalogPrice; state.minRating = 0; state.sort = "popular"; state.page = 1;
    els.filterSearch.value = "";
    els.genreFilterList.querySelectorAll(".genre-checkbox").forEach((cb) => { cb.checked = false; });
    els.priceRange.value = maxCatalogPrice;
    els.priceRangeLabel.textContent = "$" + maxCatalogPrice;
    els.ratingFilter.value = "0";
    els.sortSelect.value = "popular";
    render();
  }

  els.filterSearch.addEventListener("input", () => { state.search = els.filterSearch.value; state.page = 1; render(); });
  els.genreFilterList.addEventListener("change", (e) => {
    if (!e.target.classList.contains("genre-checkbox")) return;
    if (e.target.checked) state.genres.add(e.target.value); else state.genres.delete(e.target.value);
    state.page = 1; render();
  });
  els.priceRange.addEventListener("input", () => {
    state.maxPrice = Number(els.priceRange.value);
    els.priceRangeLabel.textContent = "$" + state.maxPrice;
    state.page = 1; render();
  });
  els.ratingFilter.addEventListener("change", () => { state.minRating = Number(els.ratingFilter.value); state.page = 1; render(); });
  els.sortSelect.addEventListener("change", () => { state.sort = els.sortSelect.value; render(); });
  document.getElementById("applyFiltersBtn").addEventListener("click", render);
  document.getElementById("resetFiltersBtn").addEventListener("click", resetFilters);
  document.getElementById("emptyStateResetBtn").addEventListener("click", resetFilters);
  els.pagination.addEventListener("click", (e) => {
    e.preventDefault();
    const link = e.target.closest("a[data-page]");
    if (!link || link.parentElement.classList.contains("disabled")) return;
    state.page = Number(link.dataset.page);
    render();
    document.querySelector(".toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---- nav search bar also drives this same page's filters ---- */
  const navSearchForm = document.getElementById("navSearchForm");
  navSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = navSearchForm.querySelector('input[name="q"]').value.trim();
    state.search = q; els.filterSearch.value = q; state.page = 1; render();
  });

  render();
});
