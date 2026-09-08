/* Login/Signup page: password show/hide, a live strength meter on
   the signup password, real client-side validation on both forms,
   and a signup flow that actually routes you somewhere sensible
   based on the Player/Developer choice — all front-end only, no
   accounts are actually created. */
document.addEventListener("DOMContentLoaded", () => {

  /* ---- password show/hide (works for any field with a toggle button) ---- */
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      const icon = btn.querySelector("i");
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      icon.className = showing ? "bi bi-eye" : "bi bi-eye-slash";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  /* ---- password strength meter (signup only) ---- */
  const pwInput = document.getElementById("signupPassword");
  const pwFill = document.getElementById("pwStrengthFill");
  const pwLabel = document.getElementById("pwStrengthLabel");
  pwInput.addEventListener("input", () => {
    const val = pwInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { min: 0, width: "0%", color: "var(--border-subtle)", label: "Password strength" },
      { min: 1, width: "25%", color: "var(--accent-red)", label: "Weak" },
      { min: 2, width: "50%", color: "var(--accent-ember)", label: "Fair" },
      { min: 3, width: "75%", color: "var(--accent-violet)", label: "Good" },
      { min: 4, width: "100%", color: "var(--accent-teal)", label: "Strong" }
    ];
    const level = [...levels].reverse().find((l) => score >= l.min) || levels[0];
    pwFill.style.width = val ? level.width : "0%";
    pwFill.style.backgroundColor = level.color;
    pwLabel.textContent = val ? level.label : "Password strength";
  });

  /* ---- login form ---- */
  const loginForm = document.getElementById("loginForm");
  enableFormValidation(loginForm, () => {
    showToast("Welcome back! Redirecting you now\u2026", "success");
    setTimeout(() => { window.location.href = "index.html"; }, 1200);
  });

  /* ---- signup form ---- */
  const signupForm = document.getElementById("signupForm");
  enableFormValidation(signupForm, () => {
    const accountType = signupForm.querySelector('input[name="accountType"]:checked').value;
    const destination = accountType === "developer" ? "dashboard.html" : "store.html";
    const destinationLabel = accountType === "developer" ? "your Dashboard" : "the Store";
    showToast("Account created! Taking you to " + destinationLabel + "\u2026", "success");
    setTimeout(() => { window.location.href = destination; }, 1200);
  });

  /* ---- third-party auth placeholders: honest feedback instead of doing nothing ---- */
  document.getElementById("googleLoginBtn").addEventListener("click", () => {
    showToast("Google sign-in isn\u2019t wired up in this front-end demo.", "info");
  });
  document.getElementById("steamLoginBtn").addEventListener("click", () => {
    showToast("Steam sign-in isn\u2019t wired up in this front-end demo.", "info");
  });
});
