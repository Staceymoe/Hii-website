(() => {
  const shareLinks = document.querySelectorAll("[data-share-invitation]");
  if (!shareLinks.length) return;

  const invitationUrl = new URL("/assets/media/care/hii-clinician-roundtable-invitation.webp", window.location.origin).href;
  const roundtableUrl = new URL("/mental-health/roundtable/", window.location.origin).href;
  const title = "Invitation: Hii Roundtable for Clinicians";
  const text = [
    "You’re invited to Hii Roundtable: When AI Enters the Therapy Room.",
    "",
    "A facilitated conversation for clinicians exploring how human-AI relationships are showing up in practice and what language, frameworks, and guidance we need together.",
    "",
    "Milwaukee in person: Wednesday, September 9, 2026, 6:00 to 7:00 PM CT.",
    "Live on Zoom: Thursday, September 10, 2026, 12:00 to 1:00 PM CT.",
    "",
    `Learn more and sign up: ${roundtableUrl}`
  ].join("\n");

  const setStatus = (message) => {
    document.querySelectorAll("[data-share-status]").forEach((node) => { node.textContent = message; });
  };

  shareLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      if (!navigator.share) return;
      event.preventDefault();

      try {
        const response = await fetch(invitationUrl);
        if (!response.ok) throw new Error("Invitation image unavailable");
        const blob = await response.blob();
        const file = new File([blob], "hii-clinician-roundtable-invitation.webp", { type: "image/webp" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title, text, url: roundtableUrl, files: [file] });
        } else {
          await navigator.share({ title, text, url: invitationUrl });
        }
      } catch (error) {
        if (error?.name === "AbortError") return;
        setStatus("Your email app will open with the invitation details and links filled in.");
        window.location.href = link.href;
      }
    });
  });
})();
