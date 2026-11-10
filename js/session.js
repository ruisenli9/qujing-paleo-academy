import { tr } from "./locale.js?v=16";
import { loadState, pushWork, saveState, siteUrl } from "./storage.js?v=36";

const KEY = "qujing-student";
const MONTH = 30 * 24 * 60 * 60 * 1000;

export function student() {
  try {
    const person = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!person || !person.expires || person.expires < Date.now()) {
      localStorage.removeItem(KEY);
      return null;
    }
    return person;
  } catch {
    return null;
  }
}

export async function pullWork() {
  const person = student();
  if (!person) return;
  try {
    const response = await fetch(siteUrl("api/work?email=" + encodeURIComponent(person.email)));
    if (!response.ok) return;
    const data = await response.json();
    const remote = data.units || {};
    const state = loadState();
    state.units = state.units || {};
    const rich = (unit) => Object.entries(unit || {}).some(([key, value]) => !["at", "done", "badge"].includes(key) && value);
    const send = new Map();
    Object.entries(remote).forEach(([id, unit]) => {
      const local = state.units[id];
      const localWins = local && (local.at || 0) > (unit.at || 0) && (rich(local) || !rich(unit));
      if (localWins) send.set(id, local);
      else state.units[id] = { ...(local || {}), ...unit };
    });
    Object.entries(state.units).forEach(([id, local]) => {
      if (!remote[id]) send.set(id, local);
    });
    saveState(state);
    await Promise.all([...send.entries()].map(([id, patch]) => pushWork(id, patch)));
  } catch {
    /* Keep what is already on this browser. */
  }
}

export async function trace(event) {
  const who = student();
  if (!who) return;
  try {
    await fetch(siteUrl("api/trace"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: who.email, name: who.name, ...event })
    });
  } catch {
    /* The page still keeps the note in this browser if the server is offline. */
  }
}

export function mountSession(onReady) {
  window.__trace = trace;
  const gate = document.getElementById("signGate");
  const form = document.getElementById("signForm");
  const error = document.getElementById("signError");
  const who = document.getElementById("whoChip");
  const paintWho = () => {
    const person = student();
    if (who) who.textContent = person ? person.name : "";
    if (gate) gate.hidden = Boolean(person);
  };
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.hidden = false;
      error.textContent = tr(
        "Enter your real name and a full email address.",
        "请填写真实姓名和完整邮箱。",
        "실명과 전체 이메일 주소를 입력하세요."
      );
      return;
    }
    const signedAt = Date.now();
    const record = { name, email, signedAt, expires: signedAt + MONTH };
    localStorage.setItem(KEY, JSON.stringify(record));
    error.hidden = true;
    paintWho();
    await fetch(siteUrl("api/account"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }).catch(() => {});
    await pullWork();
    await trace({ type: "sign-in", signedAt, expires: record.expires });
    onReady();
  });
  document.getElementById("signOut")?.addEventListener("click", async () => {
    await trace({ type: "sign-out" });
    localStorage.removeItem(KEY);
    paintWho();
  });
  paintWho();
  if (student()) pullWork().then(onReady);
}

export async function ownTraces() {
  const person = student();
  if (!person) return [];
  try {
    const response = await fetch(siteUrl("api/traces?email=" + encodeURIComponent(person.email)));
    if (!response.ok) return [];
    const data = await response.json();
    return data.rows || [];
  } catch {
    return [];
  }
}
