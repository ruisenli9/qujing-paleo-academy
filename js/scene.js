import { loadState, patchState } from "./storage.js";

function wrapLines(ctx, text, maxWidth) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const words = clean.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = trial;
  });
  if (line) lines.push(line);
  return lines;
}

export function mountRecordCanvas(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="interact">
      <h2>Notes on the strata board</h2>
      <p class="caption">This board paints the field card, digital note, and poster text already saved in this browser. The line you type is drawn with them and saved in the same record.</p>
      <canvas class="record-canvas" width="960" height="680" aria-label="Strata board with your saved notes"></canvas>
      <label><span>Add a line to the board</span>
        <textarea data-board-note rows="3"></textarea>
      </label>
      <div class="cta-row">
        <button type="button" class="btn btn-primary" data-board-save>Save onto the board</button>
        <button type="button" class="btn btn-ghost" data-board-png>Download the board</button>
      </div>
      <p class="meter-label" data-board-status></p>
    </div>`;
  const canvas = root.querySelector("canvas");
  const note = root.querySelector("[data-board-note]");
  const status = root.querySelector("[data-board-status]");
  note.value = loadState().boardNote || "";
  const sections = (state, draft) => {
    const card = state.fieldCard || {};
    const poster = state.poster || {};
    const digital = state.digitalNote || {};
    const evidence = (state.evidencePack || []).map((item) => item.note).filter(Boolean).slice(-1)[0];
    return [
      ["Field observation", card.observe],
      ["Field explanation", card.explain],
      ["What a photograph shows", digital.photoSee],
      ["What a CT slice still cannot decide", digital.sliceNot],
      ["Poster question", poster.q],
      ["Poster result", poster.r],
      ["Poster limit", poster.c],
      ["Environment note", evidence],
      ["Board line", draft]
    ].filter((pair) => String(pair[1] || "").trim());
  };
  const paint = () => {
    const state = loadState();
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#073044");
    sky.addColorStop(1, "#1a140c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const colors = ["#8d6b45", "#c4a36a", "#d7c4a2"];
    colors.forEach((color, index) => {
      const top = 36 + index * 46;
      ctx.fillStyle = color;
      ctx.fillRect(28, top, w - 56, 40);
    });
    ctx.fillStyle = "#102018";
    ctx.font = "18px Segoe UI, Microsoft YaHei, sans-serif";
    ctx.fillText("Silurian  ·  older", 44, 62);
    ctx.fillText("Early Devonian  ·  Xitun", 44, 108);
    ctx.fillText("Middle Devonian  ·  Pearl River Source", 44, 154);
    ctx.fillStyle = "#e8efe8";
    ctx.font = "22px Segoe UI, Microsoft YaHei, sans-serif";
    ctx.fillText("Your evidence, drawn on the sketch", 28, 214);
    ctx.font = "16px Segoe UI, Microsoft YaHei, sans-serif";
    const rows = sections(state, note.value);
    let y = 248;
    if (!rows.length) {
      ctx.fillStyle = "#c9ae7c";
      wrapLines(ctx, "No saved notes yet. Write the field card, the digital note, or the poster, or add a line below. This sketch is not a measured section.", w - 72).forEach((line) => {
        ctx.fillText(line, 36, y);
        y += 24;
      });
    }
    rows.forEach(([label, text]) => {
      if (y > h - 36) return;
      ctx.fillStyle = "#3dffc0";
      ctx.fillText(label, 36, y);
      y += 24;
      ctx.fillStyle = "#e8efe8";
      wrapLines(ctx, text, w - 72).slice(0, 3).forEach((line) => {
        if (y > h - 28) return;
        ctx.fillText(line, 36, y);
        y += 22;
      });
      y += 10;
    });
    ctx.fillStyle = "rgba(232,239,232,0.7)";
    ctx.font = "13px Segoe UI, Microsoft YaHei, sans-serif";
    ctx.fillText("Schematic strata. Not a photograph and not a field log.", 28, h - 18);
  };
  paint();
  note.addEventListener("input", paint);
  const onProgress = () => paint();
  window.addEventListener("progress-updated", onProgress);
  root.querySelector("[data-board-save]").addEventListener("click", () => {
    patchState((state) => {
      state.boardNote = note.value;
    });
    status.textContent = "Saved with the other notes in this browser. It is not sent to a teacher.";
    paint();
  });
  root.querySelector("[data-board-png]").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qujing-evidence-board.png";
    link.click();
  });
  window.__recordStop = () => window.removeEventListener("progress-updated", onProgress);
}

export function mountHeroCanvas(canvas) {
  if (!canvas) return;
  if (window.__heroTimer) clearInterval(window.__heroTimer);
  const ctx = canvas.getContext("2d");
  let frame = 0;
  const draw = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(420, Math.floor(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#073044");
    sky.addColorStop(0.45, "#0c4a52");
    sky.addColorStop(1, "#1a140c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const bands = [
      ["#c4a36a", 0.18],
      ["#8d6b45", 0.1],
      ["#d7c4a2", 0.14],
      ["#5e6a62", 0.12],
      ["#b08958", 0.16]
    ];
    let y = h * 0.42;
    bands.forEach(([color, portion], index) => {
      const bh = h * portion;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 24) {
        const wave = Math.sin(x * 0.02 + index + frame * 0.004) * 6;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(w, y + bh);
      ctx.lineTo(0, y + bh);
      ctx.fill();
      y += bh * 0.82;
    });
    ctx.save();
    ctx.translate(w * 0.72, h * 0.58);
    ctx.rotate(-0.4);
    ctx.fillStyle = "#1b2428";
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.16, h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.12, 0);
    ctx.quadraticCurveTo(w * 0.2, -h * 0.04, w * 0.22, 0);
    ctx.quadraticCurveTo(w * 0.2, h * 0.03, w * 0.12, 0);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(232, 239, 232, 0.85)";
    ctx.font = "12px Segoe UI, Microsoft YaHei, sans-serif";
    ctx.fillText("schematic strata · not a photograph", 16, h - 18);
    frame += 1;
  };
  draw();
  window.__heroTimer = window.setInterval(draw, 80);
}

export function stopScenes() {
  if (window.__heroTimer) {
    clearInterval(window.__heroTimer);
    window.__heroTimer = 0;
  }
  if (window.__fossilCleanup) {
    window.__fossilCleanup();
    window.__fossilCleanup = null;
  }
  if (window.__recordStop) {
    window.__recordStop();
    window.__recordStop = null;
  }
}

export function mountStrataCanvas(root, { title, bands, why, wrong, done, resetLabel }) {
  if (!root) return;
  root.innerHTML = `
    <div class="interact">
      <h2>${title}</h2>
      <p class="caption">${why}</p>
      <canvas class="strata-canvas" width="760" height="300" tabindex="0" role="application" aria-label="${title}"></canvas>
      <p data-strata-out class="meter-label"></p>
      <button type="button" class="btn btn-ghost" data-strata-reset>${resetLabel}</button>
    </div>`;
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const out = root.querySelector("[data-strata-out]");
  const order = [];
  const bandTop = (index, h) => {
    const gap = 10;
    const bh = (h - 20 - gap * (bands.length - 1)) / bands.length;
    return { top: h - 10 - (index + 1) * bh - index * gap, bh };
  };
  const paint = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#071820";
    ctx.fillRect(0, 0, w, h);
    bands.forEach((band, i) => {
      const { top, bh } = bandTop(i, h);
      ctx.fillStyle = band.color;
      ctx.fillRect(28, top, w - 56, bh);
      ctx.fillStyle = "#102018";
      ctx.font = "18px Segoe UI, Microsoft YaHei, sans-serif";
      ctx.fillText(band.label, 44, top + bh * 0.62);
      const picked = order.indexOf(band.id);
      if (picked >= 0) ctx.fillText(String(picked + 1), w - 72, top + bh * 0.62);
    });
  };
  const choose = (index) => {
    const band = bands[index];
    if (!band || order.includes(band.id) || order.length >= bands.length) return;
    if (band.id !== bands[order.length].id) {
      out.textContent = wrong;
      return;
    }
    order.push(band.id);
    paint();
    out.textContent = order.length < bands.length ? "" : done;
    root.dispatchEvent(new CustomEvent("strata-done", { bubbles: true }));
  };
  paint();
  out.textContent = "";
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const index = bands.findIndex((_, i) => {
      const { top, bh } = bandTop(i, canvas.height);
      return y >= top && y <= top + bh;
    });
    choose(index);
  });
  canvas.addEventListener("keydown", (event) => {
    const n = Number(event.key);
    if (n >= 1 && n <= bands.length) choose(n - 1);
  });
  root.querySelector("[data-strata-reset]").addEventListener("click", () => {
    order.splice(0, order.length);
    out.textContent = "";
    paint();
  });
}

export function mountClawStage(root, { title, note, img, question, yes, no, whyYes, whyNo }) {
  root.innerHTML = `
    <div class="interact">
      <h3>${title}</h3>
      <p class="caption">${note}</p>
      <canvas class="claw-canvas" width="760" height="420" aria-label="${title}"></canvas>
      <p class="caption">${question}</p>
      <div class="cta-row">
        <button type="button" class="btn btn-ghost" data-claw="yes">${yes}</button>
        <button type="button" class="btn btn-primary" data-claw="no">${no}</button>
      </div>
      <div class="feedback" hidden></div>
    </div>`;
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = img;
  let angle = 0.4;
  let drag = null;
  const project = (x, y, z) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const xr = x * c - z * s;
    const zr = x * s + z * c;
    const scale = 280 / (280 + zr);
    return [canvas.width / 2 + xr * scale, canvas.height / 2 + y * scale];
  };
  const paint = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#102028";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const pts = [
      [-180, -20, 0],
      [-40, -70, 30],
      [150, -30, 10],
      [200, 10, 0],
      [120, 40, -20],
      [-80, 30, -10]
    ];
    ctx.strokeStyle = "#3dffc0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const [x, y] = project(p[0], p[1], p[2]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
    if (image.complete && image.naturalWidth) {
      const [x, y] = project(-20, 20, 40);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(Math.max(0.35, Math.cos(angle)), 1);
      ctx.drawImage(image, -160, -70, 320, 140);
      ctx.restore();
    }
  };
  image.onload = paint;
  paint();
  canvas.addEventListener("pointerdown", (event) => {
    drag = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (drag == null) return;
    angle += (event.clientX - drag) * 0.01;
    drag = event.clientX;
    paint();
  });
  canvas.addEventListener("pointerup", () => {
    drag = null;
  });
  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") angle -= 0.15;
    if (event.key === "ArrowRight") angle += 0.15;
    paint();
  });
  root.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-claw]");
    if (!btn) return;
    const box = root.querySelector(".feedback");
    box.hidden = false;
    const ok = btn.dataset.claw === "no";
    box.className = "feedback " + (ok ? "" : "bad");
    box.textContent = ok ? whyNo : whyYes;
    if (ok) root.dispatchEvent(new CustomEvent("claw-done", { bubbles: true }));
  });
}
