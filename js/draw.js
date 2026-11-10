import { tr } from "./locale.js?v=16";
import { recordUnit } from "./storage.js";

export function mountDrawBoard(root, unitId) {
  if (!root) return;
  root.innerHTML = `
    <div class="interact draw-board">
      <h2>${tr("Sketch", "草图", "스케치")}</h2>
      <p class="caption">${tr(
        "Mark the direction and a scale. Save keeps this sketch with the record.",
        "标明方向和比例尺。保存后，这张草图留在这条记录里。",
        "방향과 축척을 표시하세요. 저장하면 이 스케치가 기록에 남습니다."
      )}</p>
      <canvas class="draw-canvas" width="960" height="420" aria-label="${tr("Drawing board", "绘图板", "그림판")}"></canvas>
      <div class="cta-row">
        <label>${tr("Ink", "笔色", "색")} <input type="color" value="#1c2430" data-ink /></label>
        <button type="button" class="btn btn-ghost" data-eraser>${tr("Eraser", "橡皮", "지우개")}</button>
        <button type="button" class="btn btn-ghost" data-clear>${tr("Clear", "清空", "지우기")}</button>
        <button type="button" class="btn btn-primary" data-save>${tr("Save Drawing", "保存绘图", "그림 저장")}</button>
      </div>
      <p class="meter-label" data-draw-status></p>
    </div>`;
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem("qujing-investigator-v1") || "{}");
  } catch {
    saved = {};
  }
  const prior = saved.units?.[unitId]?.drawing;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (prior) {
    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = prior;
  }
  let drawing = false;
  let erasing = false;
  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };
  const start = (event) => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    const p = point(event);
    ctx.lineCap = "round";
    ctx.strokeStyle = erasing ? "#fffdf8" : root.querySelector("[data-ink]").value;
    ctx.lineWidth = erasing ? 28 : 3;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
  canvas.addEventListener("pointerup", () => {
    drawing = false;
  });
  root.querySelector("[data-eraser]").addEventListener("click", () => {
    erasing = !erasing;
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    erasing = false;
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
  root.querySelector("[data-save]").addEventListener("click", () => {
    const url = canvas.toDataURL("image/png");
    recordUnit(unitId, { drawing: url, drawingAt: Date.now() });
    root.querySelector("[data-draw-status]").textContent = tr(
      "Sketch saved with this record.",
      "草图已保存在这条记录里。",
      "스케치를 이 기록에 저장했습니다."
    );
  });
}
