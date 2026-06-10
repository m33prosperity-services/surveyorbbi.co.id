(function () {
  const brandLogoUrl = "/assets/brand/bbi-logo-dark.png";
  let overlay;

  function removeOverlay() {
    if (!overlay) return;
    overlay.classList.add("is-leaving");
    window.setTimeout(() => {
      overlay?.remove();
      overlay = undefined;
    }, 420);
  }

  window.__bbiClearLoading = removeOverlay;

  if (document.readyState === "complete") return;

  const timer = window.setTimeout(() => {
    if (document.body.classList.contains("splash-active")) return;

    overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = `
      <div class="loading-overlay__mark">
        <img src="${brandLogoUrl}" alt="Buana Bahtera Inspectindo logo">
        <span>Loading survey data</span>
      </div>
    `;
    document.body.append(overlay);
  }, 700);

  window.addEventListener(
    "load",
    () => {
      window.clearTimeout(timer);
      removeOverlay();
    },
    { once: true }
  );
})();
