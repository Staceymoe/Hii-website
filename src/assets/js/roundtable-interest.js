const session = new URLSearchParams(window.location.search).get("session");
const select = document.querySelector("#preferred-session");

if (select && ["milwaukee", "zoom", "either"].includes(session)) {
  select.value = session;
}
