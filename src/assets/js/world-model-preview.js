const copyButton = document.querySelector("[data-copy-link]");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "Preview link copied";
    } catch {
      copyButton.textContent = "Copy the address from your browser";
    }
  });
}
