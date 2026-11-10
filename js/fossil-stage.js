import * as THREE from "three";
import { DragControls } from "../public/vendor/DragControls.js";
import { OrbitControls } from "../public/vendor/OrbitControls.js";
import { STLLoader } from "../public/vendor/STLLoader.js";
import { tr } from "./locale.js?v=16";
import { completeModule } from "./storage.js";

const MODELS = [
  {
    id: "cleoniceras",
    url: "./public/models/cleoniceras.stl",
    color: 0xd7c4a2,
    x: -2.15,
    title: ["Cleoniceras besairiei", "Cleoniceras besairiei"],
    body: [
      "Cretaceous ammonoid, not a fish and not from this trip. Scan of PRI 70601 by Emily Hauf, CC0. The source note gives a width of about 12 cm.",
      "白垩纪菊石，不是鱼，也不是这次考察的标本。Emily Hauf 扫描的 PRI 70601，CC0。来源说明宽度约 12 厘米。",
      "백악기 암모나이트입니다. 물고기가 아니고 이번 답사 표본도 아닙니다. Emily Hauf의 PRI 70601 스캔, CC0. 출처 설명의 너비는 약 12 cm입니다."
    ],
    href: "https://commons.wikimedia.org/wiki/File:Cleoniceras_besairiei_(PRI_70601).stl"
  },
  {
    id: "taramelliceras",
    url: "./public/models/taramelliceras.stl",
    color: 0xc4a36a,
    x: -0.7,
    title: ["Taramelliceras sp.", "Taramelliceras sp."],
    body: [
      "Ammonite, not a fish. Wikimedia Commons lists this file as public domain. The file page gives no Qujing locality.",
      "菊石，不是鱼。维基共享资源将该文件标为公有领域。文件页没有曲靖产地。",
      "암모나이트이며 물고기가 아닙니다. 위키미디어 공용은 이 파일을 퍼블릭 도메인으로 표시합니다. 파일 페이지에 취징 산지는 없습니다."
    ],
    href: "https://commons.wikimedia.org/wiki/File:Taramelliceras_sp.stl"
  },
  {
    id: "dunkleosteus",
    url: "./public/models/dunkleosteus.stl",
    color: 0x8d9a90,
    x: 0.75,
    title: ["Dunkleosteus restoration", "邓氏鱼复原"],
    body: [
      "Life restoration by EvolutionIncarnate, CC0. It is not a fossil scan and not a specimen from this trip.",
      "EvolutionIncarnate 的生活复原，CC0。不是化石扫描，也不是这次考察的标本。",
      "EvolutionIncarnate의 생활 복원, CC0. 화석 스캔이 아니고 이번 답사 표본도 아닙니다."
    ],
    href: "https://commons.wikimedia.org/wiki/File:Dunkliferecon.stl"
  },
  {
    id: "claw",
    color: 0x6a5648,
    x: 2.15,
    title: ["Therizinosaurus Claw", "镰刀龙爪", "테리지노사우루스 발톱"],
    body: [
      "A Cretaceous dinosaur claw for comparison. It is not a CT scan and not a fish from this trip.",
      "白垩纪恐龙的爪子，用来比较。不是 CT 扫描，也不是这次考察的鱼。",
      "비교용 백악기 공룡 발톱입니다. CT 스캔이 아니고 이번 답사의 물고기도 아닙니다."
    ],
    href: ""
  }
];

function placeGeometry(geometry, spec, scene, objects) {
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  geometry.boundingBox.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.62, metalness: 0.04 })
  );
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  mesh.scale.setScalar(1.45 / maxDim);
  mesh.position.set(spec.x, 0, 0);
  mesh.userData = { id: spec.id, title: tr(...spec.title) };
  scene.add(mesh);
  objects.push(mesh);
  return mesh;
}

function clawMesh(image, spec, scene, objects) {
  const sample = document.createElement("canvas");
  const step = 7;
  sample.width = image.width;
  sample.height = image.height;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data;
  const cells = [];
  for (let y = 0; y < sample.height; y += step) {
    for (let x = 0; x < sample.width; x += step) {
      const i = (y * sample.width + x) * 4;
      if (pixels[i + 3] < 40) continue;
      const lum = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      if (lum > 78) continue;
      cells.push({ x, y, depth: Math.max(1, Math.round((78 - lum) / 22)) });
    }
  }
  if (!cells.length) return null;
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.72 }),
    cells.length
  );
  const matrix = new THREE.Matrix4();
  const unit = 1.5 / sample.width;
  cells.forEach((cell, index) => {
    matrix.makeScale(step * unit, step * unit, cell.depth * step * unit);
    matrix.setPosition((cell.x - sample.width / 2) * unit, (sample.height / 2 - cell.y) * unit, 0);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.position.set(spec.x, 0, 0);
  mesh.userData = { id: spec.id, title: tr(...spec.title) };
  scene.add(mesh);
  objects.push(mesh);
  return mesh;
}

export function mountFossilStage(root) {
  if (!root) return;
  if (window.__fossilCleanup) {
    window.__fossilCleanup();
    window.__fossilCleanup = null;
  }
  const cards = MODELS.map(
    (model) => `
      <article data-model="${model.id}">
        <h3>${tr(...model.title)}</h3>
        <p>${tr(...model.body)}</p>
        ${
          model.href
            ? `<p><a href="${model.href}" rel="noopener noreferrer">${tr("File page", "文件页")}</a></p>`
            : ""
        }
      </article>`
  ).join("");
  root.innerHTML = `
    <div class="fossil-room interact">
      <h2>${tr("Compare The Models", "对照这些模型", "모델을 비교한다")}</h2>
      <p class="caption">${tr(
        "Drag a model to move it. Drag empty space to look around. These models are practice materials. They are not the fossils from this trip, and a model is not the fossil itself.",
        "拖动模型可以移动，拖空白处可以转动查看。这些是练习材料，不是这次考察的化石。模型也不等于化石本身。",
        "모델을 끌면 움직이고, 빈 곳을 끌면 둘러볼 수 있습니다. 이것은 연습 자료이며 이번 답사의 화석이 아닙니다. 모델은 화석 그 자체가 아닙니다."
      )}</p>
      <div class="fossil-view" tabindex="0" role="application" aria-label="${tr("Fossil models you can drag", "可拖拽的化石模型")}">
        <canvas></canvas>
      </div>
      <p data-fossil-status class="meter-label">${tr("The models are loading.", "模型正在载入。", "모델을 불러오는 중입니다.")}</p>
      <div class="cta-row">
        <button type="button" class="btn btn-ghost" data-turn="-1">${tr("Turn left", "左转")}</button>
        <button type="button" class="btn btn-ghost" data-turn="1">${tr("Turn right", "右转")}</button>
      </div>
      <div class="model-cards">${cards}</div>
      <h3>${tr("Is Any Model Here A Fish Fossil From This Trip?", "这里有这次考察的鱼化石吗？", "여기 모델 중에 이번 답사의 어류 화석이 있나?")}</h3>
      <div class="cta-row">
        <button type="button" class="btn btn-ghost" data-answer="dunk">${tr("Yes, the placoderm", "有，盾皮鱼那个")}</button>
        <button type="button" class="btn btn-ghost" data-answer="claw">${tr("Yes, the claw", "有，爪子那个")}</button>
        <button type="button" class="btn btn-primary" data-answer="none">${tr("None of them", "都不是")}</button>
      </div>
      <div class="feedback" data-fossil-feedback hidden></div>
    </div>`;

  const view = root.querySelector(".fossil-view");
  const canvas = view.querySelector("canvas");
  const status = root.querySelector("[data-fossil-status]");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (error) {
    status.textContent = tr("This browser could not start a 3D view.", "这个浏览器没能启动三维视图。");
    return;
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x102028, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 1.15, 6.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const key = new THREE.DirectionalLight(0xfff4e0, 1.15);
  key.position.set(3, 5, 4);
  scene.add(key);
  scene.add(new THREE.GridHelper(8, 16, 0x3dffc0, 0x1d3a44));
  const objects = [];
  const drag = new DragControls(objects, camera, view);
  const orbit = new OrbitControls(camera, view);
  orbit.enableDamping = true;
  orbit.target.set(0, 0, 0);
  drag.addEventListener("dragstart", () => {
    orbit.enabled = false;
  });
  drag.addEventListener("dragend", () => {
    orbit.enabled = true;
  });

  const labels = new Map();
  const meshes = new Map();
  let selected = null;
  const mark = (id) => {
    selected = meshes.get(id) || null;
    root.querySelectorAll("[data-model]").forEach((card) => {
      card.classList.toggle("picked", card.dataset.model === id);
    });
  };
  const addLabel = (mesh) => {
    const label = document.createElement("div");
    label.className = "fossil-label";
    label.textContent = mesh.userData.title;
    view.appendChild(label);
    labels.set(mesh, label);
    meshes.set(mesh.userData.id, mesh);
  };

  const loader = new STLLoader();
  let pending = MODELS.filter((model) => model.url).length;
  MODELS.filter((model) => model.url).forEach((spec) => {
    loader.load(
      spec.url,
      (geometry) => {
        addLabel(placeGeometry(geometry, spec, scene, objects));
        pending -= 1;
        if (!pending) status.textContent = tr("Meshes ready. Drag one.", "网格已就绪，拖一个试试。");
      },
      undefined,
      () => {
        pending -= 1;
        status.textContent = tr(
          "One comparison mesh did not load. The others stay available.",
          "有一个对照网格没有载入，其余模型仍可使用。"
        );
      }
    );
  });

  const claw = new Image();
  claw.src = "./public/assets/media/therizinosaurus-claw.png";
  claw.onload = () => {
    const mesh = clawMesh(claw, MODELS[3], scene, objects);
    if (mesh) addLabel(mesh);
  };

  const resize = () => {
    const rect = view.getBoundingClientRect();
    const width = Math.max(280, rect.width);
    const height = Math.max(240, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(view);
  resize();

  const scratch = new THREE.Vector3();
  const spin = (direction) => {
    const offset = camera.position.clone().sub(orbit.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += direction * 0.35;
    offset.setFromSpherical(spherical);
    camera.position.copy(orbit.target).add(offset);
    orbit.update();
  };
  root.querySelectorAll("[data-turn]").forEach((button) => {
    button.addEventListener("click", () => spin(Number(button.dataset.turn)));
  });
  root.querySelectorAll("[data-model]").forEach((card) => {
    card.addEventListener("click", () => {
      mark(card.dataset.model);
      view.focus();
    });
  });
  view.addEventListener("keydown", (event) => {
    const keyName = event.key;
    if (keyName >= "1" && keyName <= "4") {
      mark(MODELS[Number(keyName) - 1].id);
      event.preventDefault();
      return;
    }
    if (!selected) return;
    const step = event.shiftKey ? 0.28 : 0.12;
    if (keyName === "ArrowLeft") selected.position.x -= step;
    else if (keyName === "ArrowRight") selected.position.x += step;
    else if (keyName === "ArrowUp") selected.position.y += step;
    else if (keyName === "ArrowDown") selected.position.y -= step;
    else if (keyName === "q" || keyName === "Q") selected.rotation.y -= 0.2;
    else if (keyName === "e" || keyName === "E") selected.rotation.y += 0.2;
    else return;
    event.preventDefault();
  });

  const feedback = root.querySelector("[data-fossil-feedback]");
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (!button) return;
    const ok = button.dataset.answer === "none";
    feedback.hidden = false;
    feedback.className = "feedback" + (ok ? "" : " bad");
    feedback.textContent = ok
      ? tr(
          "None of these is a fish fossil from this trip. The two ammonoids are shelled animals from other places. The placoderm is a life restoration, not a scan of a specimen. The claw is a Cretaceous dinosaur, not a fish. A digital model is not the complete fossil.",
          "这些都不是这次考察的鱼化石。两件菊石是其他地方的有壳动物。盾皮鱼是生活复原，不是标本扫描。爪子是白垩纪恐龙，不是鱼。数字模型不是完整的化石。",
          "이것들은 이번 답사의 어류 화석이 아닙니다. 암모나이트 둘은 다른 곳의 껍질 있는 동물입니다. 판피어는 생활 복원이지 표본 스캔이 아닙니다. 발톱은 백악기 공룡이며 물고기가 아닙니다. 디지털 모델은 완전한 화석이 아닙니다."
        )
      : tr(
          "Read that model’s card. A familiar shape does not mean the model came from this trip.",
          "先看这个模型的说明。形状眼熟，并不说明它来自这次考察。",
          "그 모델의 설명을 읽으세요. 모양이 익숙하다고 이번 답사에서 온 것은 아닙니다."
        );
    if (ok) completeModule("fossil-room", { badge: tr("Model labels", "看清模型来源") });
  });

  let frame = 0;
  const tick = () => {
    frame = requestAnimationFrame(tick);
    orbit.update();
    const rect = view.getBoundingClientRect();
    labels.forEach((label, mesh) => {
      scratch.copy(mesh.position);
      scratch.y += 0.95;
      scratch.project(camera);
      const visible = scratch.z < 1;
      label.hidden = !visible;
      label.style.left = `${(scratch.x * 0.5 + 0.5) * rect.width}px`;
      label.style.top = `${(-scratch.y * 0.5 + 0.5) * rect.height}px`;
    });
    renderer.render(scene, camera);
  };
  tick();

  window.__fossilCleanup = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    drag.dispose();
    orbit.dispose();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      const material = object.material;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else if (material) material.dispose();
    });
    renderer.dispose();
  };
}
