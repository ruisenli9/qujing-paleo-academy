import { completeModule, loadState, patchState, recordUnit } from "./storage.js?v=12";

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function figureBlock(fig) {
  return `
    <figure class="figure">
      <img src="${fig.src}" alt="${fig.alt}" loading="lazy" />
      <div class="badge-row">
        <span class="tag ${fig.type}">${fig.typeLabel}</span>
      </div>
      <figcaption class="caption">${fig.caption}</figcaption>
    </figure>
  `;
}

export function knowledge(items) {
  return `<div class="knowledge">${items
    .map((item, i) => {
      const body = item.keep
        ? `<p><strong>Keep:</strong> ${item.keep}</p><p><strong>Do not claim:</strong> ${item.limit}</p>`
        : `<p>${item.body}</p>`;
      return `
    <details ${i === 0 ? "open" : ""}>
      <summary>${item.title}</summary>
      ${body}
    </details>`;
    })
    .join("")}</div>`;
}

function selectedClass(el, on) {
  el.style.outline = on ? "2px solid var(--fluoro)" : "";
}

export function mountSort(root, { id, prompt, items, answer, why, nextHint }) {
  root.innerHTML = `
    <div class="interact" id="${id}">
      <h3>${prompt}</h3>
      <p class="caption">Use the buttons to move a row up or down.</p>
      <ol class="sort-list">${items
        .map(
          (item, i) => `
        <li data-id="${item.id}">
          <span>${item.label}</span>
          <span>
            <button type="button" class="btn btn-ghost" data-act="up" aria-label="Move up">Up</button>
            <button type="button" class="btn btn-ghost" data-act="down" aria-label="Move down">Down</button>
          </span>
        </li>`
        )
        .join("")}</ol>
      <button type="button" class="btn btn-primary" data-check>Check the order</button>
      <div class="feedback" hidden></div>
    </div>`;
  const list = root.querySelector(".sort-list");
  list.style.display = "grid";
  list.style.gap = "8px";
  list.querySelectorAll("li").forEach((li) => {
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.background = "#102830";
    li.style.padding = "10px 12px";
    li.style.borderRadius = "12px";
  });
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const li = btn.closest("li");
    if (btn.dataset.act === "up" && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
    if (btn.dataset.act === "down" && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
    if (btn.dataset.check !== undefined) {
      const order = [...list.querySelectorAll("li")].map((n) => n.dataset.id);
      const ok = order.join() === answer.join();
      const box = root.querySelector(".feedback");
      box.hidden = false;
      box.className = "feedback " + (ok ? "" : "warn");
      box.innerHTML = ok
        ? `<strong>The order holds.</strong> ${why}`
        : `<strong>Try again.</strong> The standard order is: ${answer
            .map((a) => items.find((i) => i.id === a).label)
            .join(" → ")}. ${why}${nextHint ? " " + nextHint : ""}`;
      if (ok) completeModule(id, { badge: "Timeline observer", order });
    }
  });
}

export function mountClassify(root, { id, prompt, items, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>${prompt}</h3>
      <p class="caption">Select a sentence, then choose Observation or Explanation. A wrong choice does not lock the page.</p>
      <div class="options">${items
        .map((item) => `<button type="button" class="chip" data-id="${item.id}">${item.text}</button>`)
        .join("")}</div>
      <div class="cta-row">
        <button type="button" class="btn btn-sand" data-bin="observe">Observation</button>
        <button type="button" class="btn btn-ghost" data-bin="explain">Explanation</button>
      </div>
      <div class="grid grid-2">
        <div class="dropzone" data-bin="observe"><strong>What you can see</strong></div>
        <div class="dropzone" data-bin="explain"><strong>An explanation from evidence</strong></div>
      </div>
      <button type="button" class="btn btn-primary" data-check>Check the sort</button>
      <div class="feedback" hidden></div>
    </div>`;
  let current = null;
  const placed = {};
  root.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) {
      root.querySelectorAll(".chip").forEach((c) => selectedClass(c, false));
      current = chip.dataset.id;
      selectedClass(chip, true);
    }
    const binBtn = e.target.closest("button[data-bin]");
    if (binBtn && current) {
      const item = items.find((i) => i.id === current);
      placed[current] = binBtn.dataset.bin;
      const zone = root.querySelector(`.dropzone[data-bin="${binBtn.dataset.bin}"]`);
      zone.querySelectorAll(`[data-placed="${current}"]`).forEach((n) => n.remove());
      zone.insertAdjacentHTML("beforeend", `<p data-placed="${current}">${esc(item.text)}</p>`);
      root.querySelector(`.chip[data-id="${current}"]`)?.remove();
      current = null;
    }
    if (e.target.dataset.check !== undefined) {
      const misses = items.filter((i) => placed[i.id] && placed[i.id] !== i.bin);
      const missing = items.filter((i) => !placed[i.id]);
      const box = root.querySelector(".feedback");
      box.hidden = false;
      if (!misses.length && !missing.length) {
        box.className = "feedback";
        box.innerHTML = `<strong>The line is clear.</strong> ${why}`;
        completeModule(id, { badge: "Observation line" });
      } else {
        box.className = "feedback warn";
        box.innerHTML = `${misses
          .map((m) => `"${m.text}" belongs with ${m.bin === "observe" ? "observation" : "explanation"}.`)
          .join(" ")} ${missing.length ? "Some sentences are still unplaced." : ""} ${why}`;
      }
    }
  });
}

export function mountPair(root, { id, prompt, left, right, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>${prompt}</h3>
      <p class="caption">Choose a label on the left, then its match on the right. Tab and Enter work too.</p>
      <div class="grid grid-2">
        <div class="options" id="left-${id}">${left
          .map((x) => `<button type="button" class="chip" data-side="L" data-id="${x.id}">${x.label}</button>`)
          .join("")}</div>
        <div class="options" id="right-${id}">${right
          .map((x) => `<button type="button" class="chip" data-side="R" data-id="${x.id}">${x.label}</button>`)
          .join("")}</div>
      </div>
      <ul class="pairs"></ul>
      <div class="feedback" hidden></div>
    </div>`;
  let pickL = null;
  const pairs = {};
  const ul = root.querySelector(".pairs");
  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    if (btn.dataset.side === "L") {
      pickL = btn.dataset.id;
      root.querySelectorAll("[data-side=L]").forEach((b) => selectedClass(b, b === btn));
    } else if (pickL) {
      pairs[pickL] = btn.dataset.id;
      const L = left.find((x) => x.id === pickL);
      const R = right.find((x) => x.id === btn.dataset.id);
      ul.insertAdjacentHTML("beforeend", `<li>${L.label} → ${R.label}</li>`);
      pickL = null;
      const done = Object.keys(pairs).length === left.length;
      if (done) {
        const ok = left.every((x) => pairs[x.id] === x.match);
        const box = root.querySelector(".feedback");
        box.hidden = false;
        box.className = "feedback " + (ok ? "" : "warn");
        box.innerHTML = ok
          ? `<strong>The pairs hold.</strong> ${why}`
          : `<strong>Some matches can be reconsidered.</strong> ${left
              .map((x) => {
                const r = right.find((y) => y.id === x.match);
                return `${x.label} matches “${r.label}”`;
              })
              .join("; ")}. ${why}`;
        if (ok) completeModule(id, { badge: "Evidence pairs" });
      }
    }
  });
}

export function mountEvidencePicker(root, { id, prompt, cards, minNeed, whyEnough, whyWeak }) {
  root.innerHTML = `
    <div class="interact">
      <h3>${prompt}</h3>
      <p class="caption">Choose a combination you think is enough. One card is usually not enough.</p>
      <div class="options">${cards
        .map(
          (c) => `
        <label class="chip" style="cursor:pointer">
          <input type="checkbox" value="${c.id}" /> ${c.label}
        </label>`
        )
        .join("")}</div>
      <p class="meter-label" data-meter-label>Evidence strength: nothing selected yet. Read this line, not only the colour.</p>
      <div class="meter" role="meter" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0" data-meter>
        <span></span>
      </div>
      <label><span>In one sentence: why is this set stronger than “a fish fossil alone”?</span>
        <textarea data-why></textarea>
      </label>
      <button type="button" class="btn btn-primary" data-check>Is the evidence enough?</button>
      <div class="feedback" hidden></div>
    </div>`;
  const neededIds = cards.filter((c) => c.needed).map((c) => c.id);
  const refreshMeter = () => {
    const chosen = [...root.querySelectorAll("input:checked")].map((i) => i.value);
    const hit = neededIds.filter((n) => chosen.includes(n)).length;
    const meter = root.querySelector("[data-meter]");
    meter.setAttribute("aria-valuenow", String(hit));
    meter.setAttribute("aria-valuemax", String(neededIds.length));
    meter.querySelector("span").style.width = `${(hit / neededIds.length) * 100}%`;
    const fishOnly = chosen.length === 1 && chosen[0] === "fish";
    root.querySelector("[data-meter-label]").textContent = fishOnly
      ? "Evidence strength: a fish fossil only. Fish live in more than one kind of water, so this card is not enough."
      : `Evidence strength: ${hit} / ${neededIds.length} required lines. Discuss it once you have ${minNeed} and have written a limit.`;
  };
  root.addEventListener("change", refreshMeter);
  refreshMeter();
  root.querySelector("[data-check]").addEventListener("click", () => {
    const chosen = [...root.querySelectorAll("input:checked")].map((i) => i.value);
    const needed = neededIds;
    const hasCore = needed.filter((n) => chosen.includes(n)).length >= minNeed;
    const onlyFish = chosen.length === 1 && chosen[0] === "fish";
    const note = root.querySelector("[data-why]").value.trim();
    const box = root.querySelector(".feedback");
    box.hidden = false;
    if (onlyFish) {
      box.className = "feedback bad";
      box.innerHTML = whyWeak;
      return;
    }
    if (hasCore && note.length > 12) {
      box.className = "feedback";
      box.innerHTML = whyEnough;
      completeModule(id, { badge: "Environment evidence", chosen, note });
      patchState((s) => {
        s.evidencePack.push({ id, chosen, note, at: Date.now() });
      });
    } else {
      box.className = "feedback warn";
      box.innerHTML = `Not steady yet. Include more than one of rock type, bedding, the fossil assemblage, or stratigraphic position, and write the limit in your own words. ${whyWeak}`;
    }
  });
}

export function mountFixer(root, { id, sentences, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>Rewrite the sentence so it can be tested</h3>
      ${sentences
        .map(
          (s, i) => `
        <div class="panel" style="margin-bottom:10px">
          <p>Original: ${s.bad}</p>
          <div class="options">${s.parts
            .map((p) => `<button type="button" class="chip" data-i="${i}" data-part="${p.id}">${p.text}</button>`)
            .join("")}</div>
          <p>My rewrite: <span data-out="${i}"></span></p>
        </div>`
        )
        .join("")}
      <button type="button" class="btn btn-primary" data-check>Check the rewrite</button>
      <div class="feedback" hidden></div>
    </div>`;
  const chosen = sentences.map(() => []);
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-part]");
    if (btn) {
      const i = Number(btn.dataset.i);
      const part = btn.dataset.part;
      const at = chosen[i].indexOf(part);
      if (at >= 0) chosen[i].splice(at, 1);
      else chosen[i].push(part);
      btn.setAttribute("aria-pressed", chosen[i].includes(part) ? "true" : "false");
      root.querySelector(`[data-out="${i}"]`).textContent = chosen[i]
        .map((pid) => sentences[i].parts.find((p) => p.id === pid).text)
        .join("");
    }
    if (e.target.dataset.check !== undefined) {
      const ok = sentences.every((s, i) => s.ok.join() === chosen[i].join());
      const box = root.querySelector(".feedback");
      box.hidden = false;
      box.className = "feedback " + (ok ? "" : "warn");
      box.innerHTML = ok
        ? `<strong>The rewrite names a mechanism.</strong> ${why}`
        : `You can still change it. Click a selected piece to remove it. A workable order is: ${sentences
            .map((s) => s.parts.filter((p) => s.ok.includes(p.id)).map((p) => p.text).join(""))
            .join(" / ")}. ${why}`;
      if (ok) completeModule(id, { badge: "Not a purpose" });
    }
  });
}

export function mountHotspots(root, { id, img, alt, spots, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>Mark the corresponding structures</h3>
      <div class="hotspots figure">
        <img src="${img}" alt="${alt}" />
        ${spots
          .map(
            (s) =>
              `<button type="button" style="left:${s.x}%;top:${s.y}%" data-spot="${s.id}" aria-label="${s.label}">${s.n}</button>`
          )
          .join("")}
      </div>
      <p data-spot-out class="caption">Click a number to read the note. The targets are large enough to tap.</p>
      <div class="feedback" hidden></div>
    </div>`;
  const seen = new Set();
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-spot]");
    if (!b) return;
    const s = spots.find((x) => x.id === b.dataset.spot);
    seen.add(s.id);
    root.querySelector("[data-spot-out]").textContent = s.note;
    if (seen.size === spots.length) {
      const box = root.querySelector(".feedback");
      box.hidden = false;
      box.innerHTML = why;
      completeModule(id, { badge: "Matching structures" });
    }
  });
}

export function mountSlider(root, { id, a, b, aLabel, bLabel, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>Compare preservation and restoration</h3>
      <p class="caption">${aLabel} / ${bLabel}</p>
      <div class="compare">
        <img src="${b}" alt="${bLabel}" />
        <div class="top-layer"><img src="${a}" alt="${aLabel}" /></div>
      </div>
      <label><span>Drag to compare what is preserved with what is restored</span>
        <input type="range" min="5" max="95" value="50" />
      </label>
      <button type="button" class="btn btn-primary" data-check>I can tell preservation from restoration</button>
      <div class="feedback" hidden></div>
    </div>`;
  const layer = root.querySelector(".top-layer");
  root.querySelector("input").addEventListener("input", (e) => {
    layer.style.width = e.target.value + "%";
  });
  root.querySelector("[data-check]").addEventListener("click", () => {
    const box = root.querySelector(".feedback");
    box.hidden = false;
    box.innerHTML = why;
    completeModule(id, { badge: "Layered reading" });
  });
}

export function mountLayers(root, { id, steps, why }) {
  root.innerHTML = `
    <div class="interact">
      <h3>CT, model, restoration: which evidence level is this?</h3>
      <div class="layer-switch">
        ${steps.map((s, i) => `<button type="button" class="btn ${i === 0 ? "btn-primary" : "btn-ghost"}" data-step="${i}">${s.title}</button>`).join("")}
      </div>
      <div data-layer-body></div>
      <fieldset>
        <legend>What can this image be used as?</legend>
        <label><input type="radio" name="lvl" value="raw" /> Directly visible source</label>
        <label><input type="radio" name="lvl" value="processed" /> Processed or segmented data</label>
        <label><input type="radio" name="lvl" value="infer" /> Restoration or inference</label>
      </fieldset>
      <button type="button" class="btn btn-primary" data-check>Check this level</button>
      <div class="feedback" hidden></div>
    </div>`;
  let idx = 0;
  const body = root.querySelector("[data-layer-body]");
  const render = () => {
    const s = steps[idx];
    body.innerHTML = figureBlock(s.fig) + `<ul><li>It can add: ${s.gain}</li><li>It cannot prove: ${s.limit}</li><li>Who made the judgement: ${s.who}</li><li>How to cite it: ${s.cite}</li></ul>`;
    root.querySelectorAll("[data-step]").forEach((b, i) => {
      b.className = "btn " + (i === idx ? "btn-primary" : "btn-ghost");
    });
  };
  render();
  root.addEventListener("click", (e) => {
    const st = e.target.closest("[data-step]");
    if (st) {
      idx = Number(st.dataset.step);
      render();
    }
    if (e.target.dataset.check !== undefined) {
      const val = root.querySelector("input[name=lvl]:checked")?.value;
      const box = root.querySelector(".feedback");
      box.hidden = false;
      const expect = steps[idx].level;
      box.className = "feedback " + (val === expect ? "" : "warn");
      box.innerHTML =
        (val === expect ? "The level matches." : `This step is closer to “${expect === "raw" ? "a directly visible source" : expect === "processed" ? "processed or segmented data" : "a restoration or an inference"}”. You can change the choice and check again.`) +
        " " +
        why;
      if (val === expect) completeModule(id, { badge: "Evidence level", idx, val });
    }
  });
}

export function mountFieldCard(root) {
  const saved = loadState().fieldCard || {};
  root.innerHTML = `
    <form class="interact form-grid">
      <h3>Practice field card</h3>
      <p class="caption">The fields follow the student handbook. Saving stays on this device.</p>
      <label><span>Group / recorder / date</span><input type="text" name="who" value="${esc(saved.who)}" /></label>
      <label><span>Place, outcrop, exhibit, or data source</span><input type="text" name="place" value="${esc(saved.place)}" placeholder="Fill this in the field. Do not publish precise coordinates here." /></label>
      <label><span>Specimen number, rock unit, and age if already known</span><input type="text" name="code" value="${esc(saved.code)}" /></label>
      <label><span>Material type</span>
        <select name="type">
          ${["Outcrop", "Specimen", "Cast", "Photograph", "CT", "3D model"]
            .map((t) => `<option ${saved.type === t ? "selected" : ""}>${t}</option>`)
            .join("")}
        </select>
      </label>
      <label><span>Viewing direction, scale, or file number</span><input type="text" name="scale" value="${esc(saved.scale)}" /></label>
      <label><span>Observation only: shape, position, boundary, texture, or connection</span><textarea name="observe">${esc(saved.observe)}</textarea></label>
      <label><span>Explanation: what might these observations mean, and what is the evidence?</span><textarea name="explain">${esc(saved.explain)}</textarea></label>
      <label><span>What I am not sure about / what needs an expert</span><textarea name="unknown">${esc(saved.unknown)}</textarea></label>
      <label><span>Source of the photo, model, or paper</span><input type="text" name="source" value="${esc(saved.source)}" /></label>
      <div class="cta-row">
        <button class="btn btn-primary" type="submit">Save on this device</button>
        <button class="btn btn-ghost" type="button" data-export>Download as text</button>
      </div>
      <div class="feedback" hidden></div>
    </form>`;
  const form = root.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    patchState((s) => {
      s.fieldCard = data;
    });
    const box = root.querySelector(".feedback");
    box.hidden = false;
    if ((data.observe || "").trim().length < 8) {
      box.className = "feedback warn";
      box.innerHTML = "Saved for now, but the observation is still too short. Write a shape, a position, or a texture before this station counts.";
      return;
    }
    recordUnit("kit", { observation: data.observe, explanation: data.explain, note: data.unknown });
    completeModule("kit", { badge: "Field card ready" });
    box.className = "feedback";
    box.innerHTML = "Stored in this browser only. It is not sent to a teacher and it does not sync to another device.";
  });
  root.querySelector("[data-export]").addEventListener("click", () => {
    const data = Object.fromEntries(new FormData(form).entries());
    const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qujing-field-card.txt";
    a.click();
  });
}

export function mountPoster(root) {
  const saved = loadState().poster || {};
  const slots = [
    ["q", "Title and research question"],
    ["m", "Material and source"],
    ["method", "How you observed it"],
    ["r", "Results (only what you actually saw)"],
    ["c", "Interpretation and limits"],
    ["ref", "References"]
  ];
  root.innerHTML = `
    <div class="interact">
      <h3>Academic Poster</h3>
      <p class="zone-fixed">Programme Frame. These six headings stay. They are part of the expedition poster and are not a student drawing.</p>
      <p>Student Edit. Write in the boxes. Save On This Device keeps the draft here. The same save also writes your name, email, and this text to the server record.</p>
      <div class="poster">
        ${slots
          .map(
            ([k, title]) => `
          <div class="poster-slot">
            <h4>${title}</h4>
            <textarea name="${k}">${esc(saved[k])}</textarea>
          </div>`
          )
          .join("")}
      </div>
      <fieldset>
        <legend>Check before you present</legend>
        <label><input type="checkbox" name="ck1" /> The conclusion is supported by direct evidence</label>
        <label><input type="checkbox" name="ck2" /> Your observation is separate from a published conclusion</label>
        <label><input type="checkbox" name="ck3" /> Each figure names its subject, source, and scale where needed</label>
        <label><input type="checkbox" name="ck4" /> At least one uncertainty is stated</label>
        <label><input type="checkbox" name="ck5" /> Every member can explain one core piece of evidence</label>
      </fieldset>
      <div class="cta-row">
        <button type="button" class="btn btn-primary" data-save>Save On This Device And On The Server</button>
        <button type="button" class="btn btn-ghost" data-download>Download Poster Text</button>
      </div>
      <div class="feedback" hidden></div>
    </div>`;
  root.querySelector("[data-save]").addEventListener("click", () => {
    const poster = {};
    slots.forEach(([k]) => (poster[k] = root.querySelector(`[name="${k}"]`).value));
    const checks = [...root.querySelectorAll("[type=checkbox]")].filter((c) => c.checked).length;
    patchState((s) => {
      s.poster = poster;
    });
    recordUnit("poster", { question: poster.q, result: poster.r, limit: poster.c, sources: poster.ref, note: poster.method });
    const weak = !poster.q || !poster.r || !poster.c || !poster.ref;
    const box = root.querySelector(".feedback");
    box.hidden = false;
    if (weak || checks < 4) {
      box.className = "feedback warn";
      box.innerHTML = "The evidence is not strong enough yet. The question, results, interpretation, and sources all need text, and most of the checks need to be done. A poster is not a travel note.";
    } else {
      box.className = "feedback";
      box.innerHTML = "The draft has the six blocks. Results say what you found. The interpretation says how you read it. Every citation needs a source.";
      completeModule("poster", { badge: "Poster structure" });
    }
  });
  root.querySelector("[data-download]").addEventListener("click", () => {
    const lines = slots.map(([key, title]) => `${title}\n${root.querySelector(`[name="${key}"]`).value}\n`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "paleontology-research-expedition-poster.txt";
    link.click();
  });
}

export function mountReflection(root) {
  const days = ["Day 1", "Day 2", "Day 3"];
  const saved = loadState().reflections || {};
  root.innerHTML = `
    <div class="interact">
      <h3>Daily reflection</h3>
      ${days
        .map(
          (d) => `
        <div class="panel" style="margin-bottom:8px">
          <strong>${d}</strong>
          <label><span>The most important observation today</span><textarea data-d="${d}-a">${esc(saved[d + "-a"])}</textarea></label>
          <label><span>Which idea changed today</span><textarea data-d="${d}-b">${esc(saved[d + "-b"])}</textarea></label>
          <label><span>What still needs checking</span><textarea data-d="${d}-c">${esc(saved[d + "-c"])}</textarea></label>
        </div>`
        )
        .join("")}
      <button class="btn btn-primary" type="button" data-save>Save the reflection</button>
      <div class="feedback" hidden></div>
    </div>`;
  root.querySelector("[data-save]").addEventListener("click", () => {
    const reflections = {};
    root.querySelectorAll("[data-d]").forEach((el) => (reflections[el.dataset.d] = el.value));
    patchState((s) => {
      s.reflections = reflections;
    });
    completeModule("reflect", { badge: "Daily reflection" });
    root.querySelector(".feedback").hidden = false;
    root.querySelector(".feedback").innerHTML = "Saved on this device. You can keep writing after the trip starts.";
  });
}

export function mountCompareTable(root) {
  const saved = loadState().compareTable || {};
  const rows = [
    ["name", "Name, source, and age"],
    ["part", "Part observed, and the direction of view"],
    ["shape", "Shape and connection you can see"],
    ["same", "What is similar"],
    ["diff", "What is different"],
    ["strength", "Inference, and how strong the evidence is"]
  ];
  root.innerHTML = `
    <form class="interact">
      <h3>Comparison table</h3>
      <p class="caption">The fields follow the student handbook. Write what you can see before you rate the inference.</p>
      <div class="compare-table">
        <div></div><strong>Material A</strong><strong>Material B</strong>
        ${rows
          .map(
            ([k, label]) => `
          <span>${label}</span>
          <textarea name="${k}A">${esc(saved[k + "A"])}</textarea>
          <textarea name="${k}B">${esc(saved[k + "B"])}</textarea>`
          )
          .join("")}
      </div>
      <button class="btn btn-primary" type="submit">Save the table</button>
      <div class="feedback" hidden></div>
    </form>`;
  root.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    patchState((s) => {
      s.compareTable = data;
    });
    const box = root.querySelector(".feedback");
    box.hidden = false;
    const filled = ["shapeA", "shapeB", "diffA", "strengthA"].every((k) => (data[k] || "").trim().length > 2);
    if (!filled) {
      box.className = "feedback warn";
      box.innerHTML = "Write the visible shape on both sides, at least one difference, and how strong the evidence is. A difference in shape is not a proven behaviour.";
      return;
    }
    box.className = "feedback";
    box.innerHTML = "The table stays on this device. Do not call any single shape a direct ancestor.";
    completeModule("compare-table", { badge: "Comparison table" });
  });
}

export function mountDigitalNote(root) {
  const saved = loadState().digitalNote || {};
  const rows = [
    ["photo", "Specimen photograph"],
    ["slice", "CT slice"],
    ["model", "3D model"]
  ];
  root.innerHTML = `
    <form class="interact">
      <h3>Digital observation</h3>
      <div class="compare-table">
        <div></div><strong>What I can actually see</strong><strong>What I still cannot decide</strong>
        ${rows
          .map(
            ([k, label]) => `
          <span>${label}</span>
          <textarea name="${k}See">${esc(saved[k + "See"])}</textarea>
          <textarea name="${k}Not">${esc(saved[k + "Not"])}</textarea>`
          )
          .join("")}
      </div>
      <button class="btn btn-primary" type="submit">Save the note</button>
      <div class="feedback" hidden></div>
    </form>`;
  root.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    patchState((s) => {
      s.digitalNote = data;
    });
    const box = root.querySelector(".feedback");
    box.hidden = false;
    if ((data.sliceNot || "").trim().length < 4) {
      box.className = "feedback warn";
      box.innerHTML = "In the CT-slice row, write what you still cannot decide, such as a species name or a habitat.";
      return;
    }
    box.className = "feedback";
    box.innerHTML = "The note is saved. A photograph, a slice, and a model do not replace one another.";
  });
}

export function mountChecklist(root) {
  const saved = loadState().checklist || {};
  const items = [
    ["pano", "A wide photograph, and a close view with a scale"],
    ["rock", "Rock type, bedding, and the layer that holds the fossil"],
    ["id", "Material type and number"],
    ["split", "Observation written apart from explanation"],
    ["ask", "One question for an expert"]
  ];
  root.innerHTML = `
    <form class="interact">
      <h3>Field task list</h3>
      ${items
        .map(
          ([k, label]) => `
        <label class="check-line"><input type="checkbox" name="${k}" ${saved[k] ? "checked" : ""} /> ${label}</label>`
        )
        .join("")}
      <button class="btn btn-primary" type="submit">Save the list</button>
      <div class="feedback" hidden></div>
    </form>`;
  root.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    items.forEach(([k]) => {
      data[k] = Boolean(e.target.elements[k].checked);
    });
    patchState((s) => {
      s.checklist = data;
    });
    const box = root.querySelector(".feedback");
    box.hidden = false;
    box.className = "feedback";
    box.innerHTML = "The list is saved on this device. You can keep ticking it in the field. It is not permission to collect.";
  });
}

export function mountAiCase(root) {
  root.innerHTML = `
    <div class="interact">
      <h3>Which sentence can go on the poster?</h3>
      <p class="caption">A tool labelled one dense area on a slice as a “jaw”. Decide which sentence you may quote.</p>
      <div class="options">
        <button type="button" class="chip" data-ai="bad">The AI has proved this is a jaw, so the species name is settled.</button>
        <button type="button" class="chip" data-ai="ok">The AI marked a dense area. I still need the original slice, the surrounding rock, and the literature before I discuss what structure it might be.</button>
      </div>
      <div class="feedback" hidden></div>
    </div>`;
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ai]");
    if (!btn) return;
    const box = root.querySelector(".feedback");
    box.hidden = false;
    if (btn.dataset.ai === "ok") {
      box.className = "feedback";
      box.innerHTML = "Yes. An AI label is a mark still to be checked. It is not the original record, and it does not replace the literature or an expert.";
      completeModule("ai-case", { badge: "AI boundary" });
    } else {
      box.className = "feedback bad";
      box.innerHTML = "No. A segmentation label includes a human or algorithmic judgement. It does not show a species name, and it does not skip the source data or the uncertainty.";
    }
  });
}
