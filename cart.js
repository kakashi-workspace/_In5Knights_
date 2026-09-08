/* Cart page: line items are rendered by looping over CART_ITEMS (a
   list of game ids) against GAMES. Removing an item, applying a promo
   code, and submitting checkout all recompute totals live — nothing
   on this page is a static number. */
document.addEventListener("DOMContentLoaded", () => {
  let CART_ITEMS = DEMO_CART_STARTING_IDS.slice();
  let appliedPromo = null;

  const els = {
    itemsList: document.getElementById("cartItemsList"),
    countLabel: document.getElementById("cartCountLabel"),
    layout: document.getElementById("cartLayout"),
    emptyState: document.getElementById("cartEmptyState"),
    completeState: document.getElementById("orderCompleteState"),
    subtotal: document.getElementById("summarySubtotal"),
    discountRow: document.getElementById("summaryDiscountRow"),
    discountLabel: document.getElementById("summaryDiscountLabel"),
    discountAmount: document.getElementById("summaryDiscountAmount"),
    tax: document.getElementById("summaryTax"),
    total: document.getElementById("summaryTotal"),
    checkoutTotalLabel: document.getElementById("checkoutTotalLabel"),
    promoFeedback: document.getElementById("promoFeedback")
  };

  function render() {
    const isEmpty = CART_ITEMS.length === 0;
    els.emptyState.classList.toggle("d-none", !isEmpty || !els.completeState.classList.contains("d-none"));
    els.layout.classList.toggle("d-none", isEmpty);
    els.countLabel.textContent = CART_ITEMS.length + " item" + (CART_ITEMS.length === 1 ? "" : "s");
    updateCartBadge(CART_ITEMS.length);
    if (isEmpty) return;

    const items = CART_ITEMS.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
    els.itemsList.innerHTML = items.map((game) => {
      const dev = getDeveloper(game.developerId);
      return (
        '<div class="cart-item d-flex align-items-center gap-3 py-3">' +
          '<img src="' + getGameArtURL(game, "cover") + '" onerror="' + artErrorFallback(game, 160, 100, "cover") + '" alt="' + game.title + ' cover art">' +
          '<div class="flex-grow-1">' +
            '<a href="game-details.html?id=' + game.id + '" class="text-reset text-decoration-none"><h3 class="h6 mb-1">' + game.title + "</h3></a>" +
            '<p class="small text-muted-custom mb-0">' + dev.name + "</p>" +
          "</div>" +
          '<span class="price-tag">' + formatPrice(game.price) + "</span>" +
          '<button type="button" class="btn btn-sm btn-outline-forge remove-item-btn" data-remove-id="' + game.id + '" aria-label="Remove ' + game.title + ' from cart"><i class="bi bi-x-lg"></i></button>' +
        "</div>"
      );
    }).join("");

    const subtotal = items.reduce((sum, g) => sum + g.price, 0);
    let discount = 0;
    if (appliedPromo) {
      discount = appliedPromo.type === "percent" ? subtotal * (appliedPromo.value / 100) : appliedPromo.value;
      discount = Math.min(discount, subtotal);
    }
    const taxable = subtotal - discount;
    const tax = taxable * TAX_RATE;
    const total = taxable + tax;

    els.subtotal.textContent = formatPrice(subtotal);
    els.discountRow.classList.toggle("d-none", discount <= 0);
    if (discount > 0) {
      els.discountLabel.textContent = "Discount (" + appliedPromo.code + ")";
      els.discountAmount.textContent = "-" + formatPrice(discount);
    }
    els.tax.textContent = formatPrice(tax);
    els.total.textContent = formatPrice(total);
    els.checkoutTotalLabel.textContent = formatPrice(total);
  }

  els.itemsList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-item-btn");
    if (!btn) return;
    const id = Number(btn.dataset.removeId);
    const game = GAMES.find((g) => g.id === id);
    CART_ITEMS = CART_ITEMS.filter((itemId) => itemId !== id);
    render();
    if (game) showToast(game.title + " removed from cart.", "info");
  });

  /* ---- promo code ---- */
  document.getElementById("applyPromoBtn").addEventListener("click", () => {
    const input = document.getElementById("promoCode");
    const code = input.value.trim().toUpperCase();
    if (!code) {
      els.promoFeedback.innerHTML = '<span style="color: var(--accent-red);">Enter a code first.</span>';
      return;
    }
    if (PROMO_CODES[code]) {
      appliedPromo = { code, ...PROMO_CODES[code] };
      els.promoFeedback.innerHTML = '<span style="color: var(--accent-teal);"><i class="bi bi-check-circle me-1"></i>' + PROMO_CODES[code].label + " applied.</span>";
      showToast("Promo code " + code + " applied.", "success");
    } else {
      appliedPromo = null;
      els.promoFeedback.innerHTML = '<span style="color: var(--accent-red);"><i class="bi bi-x-circle me-1"></i>That code isn\u2019t valid.</span>';
    }
    render();
  });

  /* ---- checkout form: input formatting + custom validation ---- */
  const form = document.getElementById("checkoutForm");
  const cardNumberInput = document.getElementById("cardNumber");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCvcInput = document.getElementById("cardCvc");

  cardNumberInput.addEventListener("input", () => {
    let v = cardNumberInput.value.replace(/[^0-9]/g, "").slice(0, 19);
    cardNumberInput.value = v.replace(/(.{4})/g, "$1 ").trim();
  });
  cardExpiryInput.addEventListener("input", () => {
    let v = cardExpiryInput.value.replace(/[^0-9]/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    cardExpiryInput.value = v;
  });
  cardCvcInput.addEventListener("input", () => {
    cardCvcInput.value = cardCvcInput.value.replace(/[^0-9]/g, "").slice(0, 4);
  });

  function runCustomValidity() {
    const digits = cardNumberInput.value.replace(/\s+/g, "");
    cardNumberInput.setCustomValidity(/^[0-9]{13,19}$/.test(digits) ? "" : "Card number must be 13\u201319 digits.");

    const match = cardExpiryInput.value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    let expiryOk = false;
    if (match) {
      const month = parseInt(match[1], 10);
      const year = 2000 + parseInt(match[2], 10);
      const now = new Date();
      expiryOk = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
    }
    cardExpiryInput.setCustomValidity(expiryOk ? "" : "Enter a valid, non-expired MM/YY date.");

    cardCvcInput.setCustomValidity(/^[0-9]{3,4}$/.test(cardCvcInput.value.trim()) ? "" : "CVC must be 3\u20134 digits.");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runCustomValidity();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    /* NOTE: front-end demo only — nothing here is ever transmitted
       anywhere; this just simulates a completed purchase locally. */
    const email = document.getElementById("billingEmail").value;
    document.getElementById("orderCompleteReceiptLine").textContent = "A receipt was \"sent\" to " + email + " (demo only \u2014 no email is actually sent).";
    els.layout.classList.add("d-none");
    els.emptyState.classList.add("d-none");
    els.completeState.classList.remove("d-none");
    document.getElementById("cartCountLabel").textContent = "Order complete";

    CART_ITEMS = [];
    appliedPromo = null;
    updateCartBadge(0);
    showToast("Purchase complete \u2014 your games have unlocked.", "success");
    form.reset();
    form.classList.remove("was-validated");
  });

  render();
});
