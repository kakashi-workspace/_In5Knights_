/* Developer dashboard: stat cards, status chips, and the games table
   are all derived from — and re-derived after every change to — one
   in-memory array built by filtering GAMES down to this developer's
   listings. Deleting a row updates the stats in the same render pass,
   so the numbers can never drift out of sync with the table. */
document.addEventListener("DOMContentLoaded", () => {
  let devGames = GAMES.filter((g) => g.developerId === CURRENT_DEVELOPER_ID).slice();
  const dev = getDeveloper(CURRENT_DEVELOPER_ID);
  document.getElementById("welcomeHeading").textContent = "Welcome back, " + dev.name;

  const state = { statusFilter: "all", sortKey: null, sortDir: 1, pendingDeleteId: null };
  const STATUS_LABELS = { all: "All", published: "Published", pending: "Pending Review", draft: "Draft" };

  function renderStatCards() {
    const published = devGames.filter((g) => g.status === "published");
    const revenue = published.reduce((sum, g) => sum + g.price * g.unitsSold, 0);
    const units = published.reduce((sum, g) => sum + g.unitsSold, 0);
    const wishlist = devGames.reduce((sum, g) => sum + g.wishlistCount, 0);
    const rated = devGames.filter((g) => g.rating > 0);
    const avgRating = rated.length ? (rated.reduce((s, g) => s + g.rating, 0) / rated.length).toFixed(1) : "—";

    const cards = [
      { label: "Total Revenue", value: "$" + revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), sub: "From " + published.length + " published game" + (published.length === 1 ? "" : "s") },
      { label: "Units Sold", value: units.toLocaleString(), sub: "Across your published games" },
      { label: "Wishlisted", value: wishlist.toLocaleString(), sub: "Total across all listings" },
      { label: "Avg. Rating", value: avgRating, sub: rated.length ? "Across " + rated.length + " rated game" + (rated.length === 1 ? "" : "s") : "No ratings yet" }
    ];
    document.getElementById("statCardsRow").innerHTML = cards.map((c) =>
      '<div class="col"><div class="stat-card p-4">' +
        '<p class="text-muted-custom small mb-1">' + c.label + "</p>" +
        '<p class="stat-value mb-1">' + c.value + "</p>" +
        '<span class="stat-delta small text-muted-custom">' + c.sub + "</span>" +
      "</div></div>"
    ).join("");
  }

  function renderStatusChips() {
    const counts = { all: devGames.length, published: 0, pending: 0, draft: 0 };
    devGames.forEach((g) => { counts[g.status] = (counts[g.status] || 0) + 1; });
    document.getElementById("statusChips").innerHTML = Object.keys(STATUS_LABELS).map((key) =>
      '<button type="button" class="status-chip' + (state.statusFilter === key ? " active" : "") + '" data-status-chip="' + key + '">' +
        STATUS_LABELS[key] + " (" + counts[key] + ")" +
      "</button>"
    ).join("");
  }

  function statusPillHTML(status) {
    const labels = { published: "Published", pending: "Pending Review", draft: "Draft" };
    return '<span class="status-pill status-' + status + '">' + labels[status] + "</span>";
  }

  function renderTable() {
    document.getElementById("listingsCountLabel").textContent = devGames.length + " listing" + (devGames.length === 1 ? "" : "s");

    const isEmpty = devGames.length === 0;
    document.getElementById("dashboardEmptyState").classList.toggle("d-none", !isEmpty);
    document.querySelector(".table-responsive").classList.toggle("d-none", isEmpty);
    document.getElementById("statusChips").classList.toggle("d-none", isEmpty);
    if (isEmpty) return;

    let rows = state.statusFilter === "all" ? devGames.slice() : devGames.filter((g) => g.status === state.statusFilter);

    if (state.sortKey) {
      rows.sort((a, b) => {
        const valueOf = (g) => {
          if (state.sortKey === "revenue") return g.status === "published" ? g.price * g.unitsSold : 0;
          if (state.sortKey === "unitsSold") return g.status === "published" ? g.unitsSold : 0;
          return g[state.sortKey] || 0;
        };
        return (valueOf(a) - valueOf(b)) * state.sortDir;
      });
    }

    document.getElementById("gamesTableBody").innerHTML = rows.map((g) => {
      const revenue = g.status === "published" ? formatPrice(g.price * g.unitsSold) : "—";
      const units = g.status === "published" ? g.unitsSold : "—";
      const price = g.price !== null ? formatPrice(g.price) : "—";
      return (
        "<tr>" +
          "<td><div class=\"d-flex align-items-center gap-3\">" +
            '<img src="' + getGameArtURL(g, "cover") + '" onerror="' + artErrorFallback(g, 120, 75, "cover") + '" class="game-thumb" alt="' + g.title + ' thumbnail">' +
            '<span class="fw-semibold">' + g.title + "</span>" +
          "</div></td>" +
          "<td>" + statusPillHTML(g.status) + "</td>" +
          '<td class="mono">' + price + "</td>" +
          '<td class="mono">' + units + "</td>" +
          '<td class="mono">' + revenue + "</td>" +
          '<td class="text-end">' +
            '<a href="upload-game.html?edit=' + g.id + '" class="btn btn-sm btn-outline-forge me-1" aria-label="Edit ' + g.title + '"><i class="bi bi-pencil"></i></a>' +
            '<button type="button" class="btn btn-sm btn-outline-forge delete-btn" data-delete-id="' + g.id + '" data-delete-title="' + g.title + '" aria-label="Delete ' + g.title + '"><i class="bi bi-trash"></i></button>' +
          "</td>" +
        "</tr>"
      );
    }).join("");

    document.querySelectorAll("th[data-sort-key]").forEach((th) => {
      const active = th.dataset.sortKey === state.sortKey;
      th.classList.toggle("sort-active", active);
      th.querySelector(".bi").className = active ? (state.sortDir === 1 ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill") : "bi bi-arrow-down-up";
    });
  }

  function renderAll() { renderStatCards(); renderStatusChips(); renderTable(); }

  document.getElementById("statusChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-status-chip]");
    if (!chip) return;
    state.statusFilter = chip.dataset.statusChip;
    renderStatusChips();
    renderTable();
  });

  document.querySelectorAll("th[data-sort-key]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sortKey;
      state.sortDir = state.sortKey === key ? state.sortDir * -1 : 1;
      state.sortKey = key;
      renderTable();
    });
  });

  const deleteModalEl = document.getElementById("deleteConfirmModal");
  const deleteModal = new bootstrap.Modal(deleteModalEl);
  document.getElementById("gamesTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;
    state.pendingDeleteId = Number(btn.dataset.deleteId);
    document.getElementById("deleteConfirmGameName").textContent = btn.dataset.deleteTitle;
    deleteModal.show();
  });
  document.getElementById("deleteConfirmBtn").addEventListener("click", () => {
    const deleted = devGames.find((g) => g.id === state.pendingDeleteId);
    devGames = devGames.filter((g) => g.id !== state.pendingDeleteId);
    deleteModal.hide();
    renderAll();
    if (deleted) showToast(deleted.title + " was deleted from your dashboard.", "info");
  });

  renderAll();
  updateCartBadge(__in5kCartCount);
});
