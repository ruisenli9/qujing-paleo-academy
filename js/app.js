import { stopScenes } from "./scene.js?v=15";
import { applyChrome, setLang } from "./locale.js?v=33";
import { mountHandbook, pages } from "./handbook.js?v=36";
import { mountSession, student, trace } from "./session.js?v=37";

const NAV = [
  { href: "#/trip", on: ["trip", "sites", "zhujiang"] },
  { href: "#/qujing", on: ["qujing"] },
  { href: "#/rock", on: ["rock", "task/strata", "train", "xitun"] },
  { href: "#/body", on: ["body", "task/anatomy", "compare"] },
  { href: "#/ct", on: ["ct", "task/digital", "lab"] },
  { href: "#/output", on: ["output", "record", "poster"] },
  { href: "#/play", on: ["play"] },
  { href: "#/watch", on: ["watch"] }
];

function routeName() {
  const hash = location.hash.replace(/^#\/?/, "");
  return hash.split("?")[0] || "";
}

function updateChrome() {
  const name = routeName();
  document.querySelectorAll(".primary-nav a, .bottom-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const item = NAV.find((entry) => href === entry.href);
    const home = href === "#/" && (name === "" || name === "home");
    if (home || (item && item.on.includes(name))) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const mine = document.getElementById("mineLink");
  if (mine) {
    if (name === "mine" || name === "work") mine.setAttribute("aria-current", "page");
    else mine.removeAttribute("aria-current");
  }
}

function render() {
  if (!student()) return;
  stopScenes();
  const name = routeName();
  const view = pages[name] || pages.home;
  const main = document.getElementById("main");
  const part = name.startsWith("qujing") ? "part-qujing"
    : ["rock", "task/strata", "train", "xitun"].includes(name) ? "part-rock"
    : ["body", "task/anatomy", "compare"].includes(name) ? "part-body"
    : ["ct", "task/digital", "lab"].includes(name) ? "part-ct"
    : ["output", "record", "poster", "explain"].includes(name) ? "part-out"
    : name === "trip" ? "part-trip"
    : name === "play" ? "part-play"
    : name === "watch" ? "part-watch"
    : "part-home";
  main.className = part;
  main.innerHTML = view();
  mountHandbook(name);
  applyChrome();
  updateChrome();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  trace({ type: "page", route: name || "home" });
}

document.getElementById("navToggle").addEventListener("click", () => {
  const nav = document.getElementById("primary-nav");
  const open = nav.classList.toggle("open");
  document.getElementById("navToggle").setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (!button) return;
  setLang(button.dataset.lang);
  applyChrome();
  render();
});

window.addEventListener("hashchange", render);
if (!location.hash || location.hash === "#") location.hash = "#/";
mountSession(render);
