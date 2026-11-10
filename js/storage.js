const KEY = "qujing-investigator-v1";

const empty = () => ({
  version: 1,
  startedAt: Date.now(),
  modules: {},
  badges: [],
  fieldCard: {},
  reflections: {},
  poster: {},
  evidencePack: [],
  localOnly: true,
  units: {}
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("progress-updated"));
}

export function pushWork(id, patch) {
  let person = null;
  try {
    person = JSON.parse(localStorage.getItem("qujing-student") || "null");
  } catch {
    return;
  }
  if (!person || !person.email) return;
  return fetch("/api/work", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: person.email, name: person.name, id, patch })
  }).catch(() => {});
}

export function recordUnit(id, patch) {
  const state = loadState();
  state.units = state.units || {};
  const previous = state.units[id] || {};
  state.units[id] = { ...previous, ...patch, at: Date.now() };
  saveState(state);
  pushWork(id, state.units[id]);
  if (window.__trace) {
    const keys = Object.keys(patch).filter((key) => key !== "drawing");
    window.__trace({ type: "unit", id, keys, hasDrawing: Boolean(patch.drawing) });
  }
  return state;
}

export function completeModule(id, extra = {}) {
  const state = loadState();
  state.modules[id] = { done: true, at: Date.now(), ...extra };
  if (extra.badge && !state.badges.includes(extra.badge)) state.badges.push(extra.badge);
  state.units = state.units || {};
  state.units[id] = { ...(state.units[id] || {}), done: true, badge: extra.badge || state.units[id]?.badge, at: Date.now() };
  saveState(state);
  if (window.__trace) window.__trace({ type: "module", id, badge: extra.badge || "" });
  return state;
}

export function patchState(fn) {
  const state = loadState();
  fn(state);
  saveState(state);
  return state;
}

export function moduleDone(id) {
  return Boolean(loadState().modules[id]?.done);
}

export function progressSummary(moduleIds) {
  const state = loadState();
  const done = moduleIds.filter((id) => state.modules[id]?.done).length;
  return { done, total: moduleIds.length, badges: state.badges };
}
