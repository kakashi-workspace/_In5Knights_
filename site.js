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
  return DEVELOPERS[developerId] || { name: "Unknown Developer", bio: "", founded: "", teamSize: "" };
}

function placeholderArtURL(game, width, height, variant, index) {
  const title = (game && game.title) ? game.title : "Game";
  const color = (game && game.color) ? game.color : "6c5ce7";
  const label = variant === "screenshot" ? "Screenshot " + index : title;
  return "https://placehold.co/" + width + "x" + height + "/14161d/" + color + "?text=" + encodeURIComponent(label);
}

function getGameArtURL(game, variant, index) {
  if (!game || !game.slug) {
    return placeholderArtURL(game, 400, 225, variant, index);
  }

  const basePath = "Images/" + game.slug;
  if (variant === "screenshot") return basePath + "-" + index + ".png";
  return basePath + "-cover.png";
}

function artErrorFallback(game, width, height, variant, index) {
  return "this.onerror=null;this.src='" + placeholderArtURL(game, width, height, variant, index) + "';";
}

/* Turns a 0–5 numeric rating into full/half/empty Bootstrap-icon stars.
   Used on store cards, the homepage grid, details page, and reviews —
   one function, so every star anywhere on the site is generated the
   same way instead of hand-typed per page. */
function renderStars(rating) {
  if (!rating) return '<span class="text-muted-custom small">Not yet rated</span>';
  let html = '<span class="star-rating" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i - 0.25) html += '<i class="bi bi-star-fill"></i>';
    else if (rating >= i - 0.75) html += '<i class="bi bi-star-half"></i>';
    else html += '<i class="bi bi-star"></i>';
  }
  html += '</span>';
  return html;
}

/* ---------- toast notification system (feature) ---------- */
function ensureToastContainer() {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = 1080;
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, variant) {
  variant = variant || "success";
  const icons = { success: "bi-check-circle-fill", error: "bi-x-circle-fill", info: "bi-info-circle-fill" };
  const colors = { success: "var(--accent-teal)", error: "var(--accent-red)", info: "var(--accent-violet)" };
  const container = ensureToastContainer();
  const el = document.createElement("div");
  el.className = "toast align-items-center border-0";
  el.setAttribute("role", "status");
  el.innerHTML =
    '<div class="d-flex">' +
      '<div class="toast-body"><i class="bi ' + icons[variant] + ' me-2" style="color:' + colors[variant] + ';"></i>' + message + '</div>' +
      '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
    '</div>';
  container.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 3200 });
  toast.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* ---------- cart badge (in-memory, per page-load) ----------
   There is no backend/localStorage in this demo, so the badge reflects
   the current page's own in-memory cart state rather than a value
   persisted across navigation — see cart.js / game-details.js. Every
   page still starts from the same 2-item demo cart shown on cart.html
   so the number is consistent with what a fresh visitor would see. */
const DEMO_CART_STARTING_IDS = [1, 2]; // Ember Wake, Signal Loss

function updateCartBadge(count) {
  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = String(count);
    badge.style.display = count > 0 ? "" : "none";
  });
}

/* ---------- shared in-memory cart counter ----------
   Tracks the badge count for the current page only (see note above
   DEMO_CART_STARTING_IDS) — cart.html manages the actual line-item
   array separately since it needs full item detail, not just a count. */
let __in5kCartCount = DEMO_CART_STARTING_IDS.length;

function addToCartById(id) {
  const game = GAMES.find((g) => g.id === id);
  if (!game) return;
  __in5kCartCount += 1;
  updateCartBadge(__in5kCartCount);
  showToast(game.title + " added to cart.", "success");
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".quick-add-btn");
  if (!btn) return;
  addToCartById(Number(btn.dataset.addId));
});

/* ---------- theme toggle (light/dark, session-only) ---------- */
function initThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const icon = btn.querySelector("i");
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      icon.className = "bi bi-moon-stars";
    } else {
      document.documentElement.removeAttribute("data-theme");
      icon.className = "bi bi-sun";
    }
  }
  applyTheme(window.__in5kTheme || "dark");
  btn.addEventListener("click", () => {
    window.__in5kTheme = window.__in5kTheme === "light" ? "dark" : "light";
    applyTheme(window.__in5kTheme);
  });
}

/* ---------- back-to-top button ---------- */
function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "backToTopBtn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- generic Bootstrap validation enabler ----------
   Applies to any <form class="needs-validation"> on the page: blocks
   submission, adds the was-validated styling, and calls onValid(form)
   only once every required/pattern check passes. */
function enableFormValidation(formEl, onValid) {
  formEl.addEventListener("submit", (event) => {
    if (!formEl.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if (typeof onValid === "function") onValid(formEl);
    }
    formEl.classList.add("was-validated");
  }, false);
}

/* ---------- game card template (used by index/store/related/dashboard preview) ----------
   One template, looped over an array of games, is the "use looping"
   requirement in practice: rendering N games costs the same one
   function call whether N is 3 or 300. */
function gameCardHTML(game, opts) {
  opts = opts || {};
  const dev = getDeveloper(game.developerId);
  const wishlisted = opts.wishlistedIds && opts.wishlistedIds.has(game.id);
  return (
    '<div class="col">' +
      '<div class="game-card">' +
        '<a href="game-details.html?id=' + game.id + '" class="text-decoration-none text-reset">' +
          '<div class="card-img-wrap">' +
            (game.genre ? '<span class="cartridge-badge">' + game.genre + '</span>' : "") +
            '<img src="' + getGameArtURL(game, "cover") + '" onerror="' + artErrorFallback(game, 400, 225, "cover") + '" class="card-img-top" alt="' + game.title + ' cover art">' +
          '</div>' +
        '</a>' +
        '<button type="button" class="card-wishlist-btn' + (wishlisted ? " active" : "") + '" data-wishlist-id="' + game.id + '" aria-pressed="' + (wishlisted ? "true" : "false") + '" aria-label="Toggle wishlist for ' + game.title + '">' +
          '<i class="bi ' + (wishlisted ? "bi-heart-fill" : "bi-heart") + '"></i>' +
        '</button>' +
        '<a href="game-details.html?id=' + game.id + '" class="text-decoration-none text-reset">' +
          '<div class="card-body p-3">' +
            '<h3 class="card-title mb-1">' + game.title + '</h3>' +
            '<p class="small text-muted-custom mb-2">' + dev.name + '</p>' +
            '<div class="d-flex justify-content-between align-items-center">' +
              '<span class="price-tag">' + formatPrice(game.price) + '</span>' +
              '<span class="small text-muted-custom">' + renderStars(game.rating) + ' ' + (game.rating || "—") + '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
        (opts.quickAdd ? (
          '<div class="card-quick-add">' +
            '<button type="button" class="btn btn-forge btn-sm w-100 quick-add-btn" data-add-id="' + game.id + '">' +
              '<i class="bi bi-cart-plus me-1"></i> Add to Cart' +
            '</button>' +
          '</div>'
        ) : "") +
      '</div>' +
    '</div>'
  );
}

/* Delegated wishlist-toggle handler — works for any card rendered by
   gameCardHTML on any page, current or future, without rebinding. */
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".card-wishlist-btn");
  if (!btn) return;
  const id = Number(btn.dataset.wishlistId);
  const game = GAMES.find((g) => g.id === id);
  const nowActive = btn.classList.toggle("active");
  btn.setAttribute("aria-pressed", nowActive ? "true" : "false");
  const icon = btn.querySelector("i");
  icon.className = nowActive ? "bi bi-heart-fill" : "bi bi-heart";
  const label = btn.querySelector(".wishlist-label");
  if (label) label.textContent = nowActive ? "Wishlisted" : "Add to Wishlist";
  if (game) showToast((nowActive ? "Added " : "Removed ") + game.title + (nowActive ? " to" : " from") + " your wishlist.", "info");
});

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initBackToTop();
  updateCartBadge(__in5kCartCount);
});
