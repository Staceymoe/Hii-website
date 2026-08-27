(() => {
  const select = document.querySelector("#inquiry-topic");
  if (!select) return;

  const requestedTopic = new URLSearchParams(window.location.search).get("topic");
  const aliases = {
    advisory: "advisory",
    adaptation: "adaptation",
    care: "care",
    general: "general",
    media: "speaking-media",
    public: "public-session",
    research: "research",
    workshop: "workshop",
    "work-with-hii": "work-with-hii"
  };
  const value = aliases[requestedTopic] || requestedTopic;
  if (value && select.querySelector(`option[value="${value}"]`)) select.value = value;
})();
