/* Upload/Edit Game form:
   - Tag chips (add/remove, capped at 6)
   - Live preview card that mirrors the real store card component
   - Drag-and-drop + file-picker screenshot thumbnails via object URLs
   - Cover image preview
   - ?edit=<id> pre-fills every field from GAMES (except files, which
     can't be reconstructed from stored data in a front-end demo)
   Submitting (or saving a draft) never sends anything anywhere — it
   simulates success and returns to the Dashboard. */
document.addEventListener("DOMContentLoaded", () => {
  let tags = [];
  let screenshotFiles = [];
  const MAX_TAGS = 6;

  const els = {
    title: document.getElementById("gameTitle"),
    tagline: document.getElementById("gameTagline"),
    taglineCounter: document.getElementById("taglineCounter"),
    description: document.getElementById("gameDescription"),
    genre: document.getElementById("gameGenre"),
    price: document.getElementById("gamePrice"),
    tagInput: document.getElementById("tagInput"),
    tagChipList: document.getElementById("tagChipList"),
    coverInput: document.getElementById("coverImage"),
    coverPreview: document.getElementById("coverPreview"),
    coverDropZone: document.getElementById("coverDropZone"),
    screenshotsInput: document.getElementById("screenshots"),
    screenshotsDropZone: document.getElementById("screenshotsDropZone"),
    screenshotThumbs: document.getElementById("screenshotThumbs"),
    livePreviewCard: document.getElementById("livePreviewCard"),
    form: document.getElementById("uploadGameForm"),
    submitBtn: document.getElementById("submitBtn"),
    saveDraftBtn: document.getElementById("saveDraftBtn")
  };
  const specEls = {
    minOS: document.getElementById("minOS"), minCPU: document.getElementById("minCPU"), minRAM: document.getElementById("minRAM"),
    recOS: document.getElementById("recOS"), recCPU: document.getElementById("recCPU"), recRAM: document.getElementById("recRAM")
  };

  /* ---- tag chips ---- */
  function renderTagChips() {
    els.tagChipList.innerHTML = tags.map((tag, i) =>
      '<span class="tag-chip">' + tag + ' <button type="button" data-tag-index="' + i + '" aria-label="Remove tag ' + tag + '">&times;</button></span>'
    ).join("");
  }
  els.tagInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const value = els.tagInput.value.trim().replace(/,$/, "");
    if (!value) return;
    if (tags.length >= MAX_TAGS) { showToast("You can add up to " + MAX_TAGS + " tags.", "info"); return; }
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) { els.tagInput.value = ""; return; }
    tags.push(value);
    els.tagInput.value = "";
    renderTagChips();
    updatePreview();
  });
  els.tagChipList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tag-index]");
    if (!btn) return;
    tags.splice(Number(btn.dataset.tagIndex), 1);
    renderTagChips();
    updatePreview();
  });

  /* ---- tagline counter ---- */
  els.tagline.addEventListener("input", () => {
    els.taglineCounter.textContent = els.tagline.value.length + " / 90";
  });

  /* ---- cover image preview ---- */
  els.coverInput.addEventListener("change", () => {
    const file = els.coverInput.files[0];
    if (!file) { els.coverPreview.classList.add("d-none"); updatePreview(); return; }
    const url = URL.createObjectURL(file);
    els.coverPreview.src = url;
    els.coverPreview.classList.remove("d-none");
    updatePreview(url);
  });

  /* ---- screenshots: file picker + real drag-and-drop ---- */
  function renderScreenshotThumbs() {
    els.screenshotThumbs.innerHTML = screenshotFiles.map((file, i) =>
      '<div class="position-relative">' +
        '<img src="' + URL.createObjectURL(file) + '" class="thumb-preview" alt="Screenshot ' + (i + 1) + ' preview">' +
        '<button type="button" class="btn-close btn-close-white position-absolute top-0 end-0" style="transform: translate(30%,-30%); background-color: var(--bg-surface); border-radius: 50%; padding: 3px;" data-shot-index="' + i + '" aria-label="Remove screenshot"></button>' +
      "</div>"
    ).join("");
  }
  function addScreenshotFiles(fileList) {
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    screenshotFiles = screenshotFiles.concat(incoming).slice(0, 8);
    renderScreenshotThumbs();
  }
  els.screenshotsInput.addEventListener("change", () => addScreenshotFiles(els.screenshotsInput.files));
  els.screenshotThumbs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shot-index]");
    if (!btn) return;
    screenshotFiles.splice(Number(btn.dataset.shotIndex), 1);
    renderScreenshotThumbs();
  });
  ["dragover", "dragenter"].forEach((evt) => {
    els.screenshotsDropZone.addEventListener(evt, (e) => { e.preventDefault(); els.screenshotsDropZone.classList.add("drag-over"); });
  });
  ["dragleave", "dragend"].forEach((evt) => {
    els.screenshotsDropZone.addEventListener(evt, () => els.screenshotsDropZone.classList.remove("drag-over"));
  });
  els.screenshotsDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    els.screenshotsDropZone.classList.remove("drag-over");
    if (e.dataTransfer.files.length) addScreenshotFiles(e.dataTransfer.files);
  });

  /* ---- live preview card (mirrors the store card, no dead links) ---- */
  function updatePreview(coverUrlOverride) {
    const title = els.title.value.trim() || "Your Game Title";
    const price = els.price.value !== "" ? Number(els.price.value) : null;
    const genre = els.genre.value || "Genre";
    const coverUrl = coverUrlOverride || (els.coverInput.files[0] ? URL.createObjectURL(els.coverInput.files[0]) : "https://placehold.co/400x225/14161d/6c5ce7?text=" + encodeURIComponent(title));
    els.livePreviewCard.innerHTML =
      '<div class="col"><div class="game-card">' +
        '<div class="card-img-wrap">' +
          (els.genre.value ? '<span class="cartridge-badge">' + genre + "</span>" : "") +
          '<img src="' + coverUrl + '" class="card-img-top" alt="' + title + ' cover art preview">' +
        "</div>" +
        '<div class="card-body p-3">' +
          '<h3 class="card-title mb-1">' + title + "</h3>" +
          '<p class="small text-muted-custom mb-2">' + getDeveloper(CURRENT_DEVELOPER_ID).name + "</p>" +
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<span class="price-tag">' + formatPrice(price) + "</span>" +
            '<span class="small text-muted-custom">Not yet rated</span>' +
          "</div>" +
          (tags.length ? '<div class="d-flex flex-wrap gap-1">' + tags.map((t) => '<span class="badge rounded-pill" style="background-color: var(--bg-surface-alt); color: var(--text-muted); border: 1px solid var(--border-subtle); font-size: 0.7rem;">' + t + "</span>").join("") + "</div>" : "") +
        "</div>" +
      "</div></div>";
  }
  ["input", "change"].forEach((evt) => {
    els.title.addEventListener(evt, () => updatePreview());
    els.price.addEventListener(evt, () => updatePreview());
    els.genre.addEventListener(evt, () => updatePreview());
  });

  /* ---- ?edit=<id> pre-fill ---- */
  const editId = getQueryParam("edit");
  if (editId) {
    const game = GAMES.find((g) => g.id === Number(editId));
    if (game) {
      document.getElementById("pageTitle").textContent = "Edit " + game.title + " — In5kNights";
      document.getElementById("pageEyebrow").textContent = "For developers";
      document.getElementById("pageHeading").textContent = "Edit " + game.title;
      document.getElementById("pageSubheading").textContent = "Update your listing's details below.";
      els.submitBtn.textContent = "Save Changes";

      els.title.value = game.title;
      els.description.value = game.description || "";
      if (game.genre) els.genre.value = game.genre;
      if (game.price !== null) els.price.value = game.price;
      tags = (game.tags || []).slice(0, MAX_TAGS);
      renderTagChips();

      Object.keys(specEls).forEach((key) => {
        const specSource = key.startsWith("min") ? game.minSpec : game.recSpec;
        const specKey = key.endsWith("OS") ? "OS" : key.endsWith("CPU") ? "Processor" : "Memory";
        if (specSource && specSource[specKey]) specEls[key].value = specSource[specKey];
      });

      const note = document.createElement("div");
      note.className = "alert mb-4";
      note.style.cssText = "background-color: var(--bg-surface-alt); border: 1px solid var(--border-subtle); color: var(--text-muted);";
      note.innerHTML = '<i class="bi bi-info-circle me-1"></i> Editing an existing listing. Screenshots, cover image, and build files aren\u2019t reloaded in this demo \u2014 re-upload them if you want to change them.';
      els.form.prepend(note);

      updatePreview();
    }
  } else {
    updatePreview();
  }

  /* ---- submit / save as draft ---- */
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!els.form.checkValidity()) {
      els.form.classList.add("was-validated");
      return;
    }
    const verb = editId ? "Changes saved" : "Submitted for review";
    showToast(verb + " for \u201c" + els.title.value.trim() + "\u201d (demo only \u2014 not sent to a server).", "success");
    els.submitBtn.disabled = true;
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1400);
  });

  els.saveDraftBtn.addEventListener("click", () => {
    if (!els.title.value.trim()) {
      els.title.classList.add("is-invalid");
      els.title.focus();
      return;
    }
    els.title.classList.remove("is-invalid");
    showToast("\u201c" + els.title.value.trim() + "\u201d saved as a draft (demo only).", "info");
    els.saveDraftBtn.disabled = true;
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1400);
  });

  /* ---- nav search ---- */
  document.getElementById("navSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input[name="q"]').value.trim();
    window.location.href = "store.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
});
