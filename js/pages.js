import { FIGURES, MODULE_ORDER, SOURCES, TERMS } from "./content.js?v=10";
import { mountDrawBoard } from "./draw.js?v=12";
import { compareCards, labCards, trainCards, xitunCards, zhujiangCards } from "./knowledge.js?v=12";
import { badgeLabel, tr } from "./locale.js?v=12";
import { programmeTable, taskPlan } from "./programme.js?v=10";
import { mountFossilStage } from "./fossil-stage.js?v=10";
import { mountHeroCanvas, mountRecordCanvas, mountStrataCanvas } from "./scene.js?v=11";
import { completeModule, loadState, moduleDone, progressSummary } from "./storage.js?v=12";
import {
  figureBlock,
  knowledge,
  mountAiCase,
  mountChecklist,
  mountClassify,
  mountCompareTable,
  mountDigitalNote,
  mountEvidencePicker,
  mountFieldCard,
  mountFixer,
  mountHotspots,
  mountLayers,
  mountPair,
  mountPoster,
  mountReflection,
  mountSlider,
  mountSort
} from "./widgets.js?v=12";

const nextBtn = (href, label) =>
  `<div class="next-row"><a class="btn btn-ghost" href="#/map">${tr("Back To The Map", "返回地图", "지도로")}</a><a class="btn btn-primary" href="${href}">${label}</a></div>`;

export function unitSummary() {
  const units = loadState().units || {};
  const rows = [
    ["train-rock", tr("Pre-Trip Training", "出发前训练", "출발 전 훈련")],
    ["xitun", tr("Xitun", "西屯", "시툰")],
    ["zhujiang", tr("Pearl River Source", "珠江源", "주강 발원지")],
    ["compare", tr("Comparison", "比较", "비교")],
    ["lab", tr("Digital Lab", "数智实验室", "디지털 실험실")],
    ["kit", tr("Field Kit", "田野工具包", "현장 도구")],
    ["poster", tr("Poster", "海报", "포스터")]
  ];
  const body = rows
    .map(([id, label]) => {
      const unit = units[id] || {};
      const bits = [
        unit.observation,
        unit.explanation,
        unit.question,
        unit.result,
        unit.limit,
        unit.note
      ].filter(Boolean);
      const picture = unit.drawing ? `<img class="summary-draw" src="${unit.drawing}" alt="" />` : "";
      return `<article class="panel"><h3>${label}</h3><p>${bits.length ? bits.map((bit) => String(bit)).join(" · ") : tr("Nothing saved from this unit yet.", "这个单元还没有保存内容。", "이 단원에서 저장된 내용이 아직 없습니다.")}</p>${picture}</article>`;
    })
    .join("");
  return `<section><h2>${tr("Unit Record", "单元汇总", "단원 기록")}</h2><p class="caption">${tr("Each unit keeps its saved text and drawing here.", "每个单元保存的文字和绘图都汇总在这里。", "각 단원에 저장한 글과 그림이 여기에 모입니다.")}</p><div class="grid">${body}</div></section>`;
}

export function home() {
  return `
    <section class="hero hero-drawn">
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-copy">
        <div class="kicker">${tr("Paleontology Research Expedition Programme", "古生物科学研究", "고생물학 연구 탐사 프로그램")}</div>
        <h1>${tr("Is This A Stone, Or Evidence From Four Hundred Million Years Ago?", "你看到的是一块石头，还是四亿年前的证据？", "이것은 돌인가, 아니면 사억 년 전의 증거인가?")}</h1>
        <p class="lede">${tr("You are a fish investigator preparing for Qujing. The work is to observe, compare, and judge evidence, then keep a record you can take into the field and onto a poster.", "你是即将进入曲靖科考的古鱼调查员。任务不是背结论，而是观察、比较、判断证据，并留下可以带到田野和海报里的记录。")}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#/train">${tr("Start The First Task", "开始第一个任务", "첫 과제 시작")}</a>
          <a class="btn btn-ghost" href="#/map">${tr("Open The Task Map", "打开任务地图", "과제 지도 열기")}</a>
        </div>
        <p class="caption">${tr("The strata behind this text are drawn for the site. They are not a photograph, not a lecture slide, and not a field record. The clickable stack is below.", "背后的地层是本站绘制的示意，不是照片，不是讲座幻灯片，也不是野外记录。可点击的地层在下面。")}</p>
      </div>
    </section>
    <div id="strata-game"></div>
    <div id="draw-home"></div>
    <ol class="journey">
      <li><a href="#/train"><span>01</span><strong>${tr("Read Rock And Fossil", "学会看岩层与化石", "암석과 화석 읽기")}</strong><small>${tr("25 Nov Evening, Before And After The Opening Lecture", "11月25日晚，开幕讲座前后", "11월 25일 저녁, 개막 강연 전후")}</small></a></li>
      <li><a href="#/xitun"><span>02</span><strong>${tr("Xitun Evidence", "走进西屯", "시툰 증거")}</strong><small>${tr("26 Nov, 09:30–10:15 Strata Record", "11月26日 09:30–10:15 地层记录", "11월 26일 09:30–10:15 지층 기록")}</small></a></li>
      <li><a href="#/zhujiang"><span>03</span><strong>${tr("Pearl River Source", "走进珠江源", "주장위안")}</strong><small>${tr("27 Nov, 09:00–12:00 Two Sites", "11月27日 09:00–12:00 两个点", "11월 27일 09:00–12:00 두 지점")}</small></a></li>
      <li><a href="#/compare"><span>04</span><strong>${tr("Compare Structures", "古鱼比较室", "구조 비교")}</strong><small>${tr("26 Nov Museum, And 27 Nov Land Discussion", "26日博物院，27日登陆讨论", "11월 26일 박물관, 11월 27일 토론")}</small></a></li>
      <li><a href="#/lab"><span>05</span><strong>${tr("Digital Lab", "数智实验室", "디지털 실험실")}</strong><small>${tr("26 Nov, 14:00–16:00 CT Demonstration", "11月26日 14:00–16:00 CT演示", "11월 26일 14:00–16:00 CT 시연")}</small></a></li>
      <li><a href="#/work"><span>06</span><strong>${tr("Academic Poster", "整理证据，准备海报", "학술 포스터")}</strong><small>${tr("27 Nov Evening Draft, 28 Nov 08:30 Presentation", "27日晚起草，28日 08:30 展示", "11월 27일 저녁 초안, 11월 28일 08:30 발표")}</small></a></li>
    </ol>
  `;
}

export function mapPage() {
  const { done, total } = progressSummary(MODULE_ORDER);
  const nodes = [
    ["train-rock", "#/train", tr("Before departure: rock and fossil", "出发前：岩层与化石"), tr("25 Nov evening", "11月25日晚")],
    ["xitun", "#/xitun", tr("Xitun station", "西屯任务站"), tr("26 Nov, 09:30–10:15", "11月26日 09:30–10:15")],
    ["zhujiang", "#/zhujiang", tr("Pearl River Source", "珠江源任务站"), tr("27 Nov, 09:00–12:00", "11月27日 09:00–12:00")],
    ["compare", "#/compare", tr("Comparison room", "古鱼比较室"), tr("26 Nov museum and 27 Nov discussion", "26日博物院与27日讨论")],
    ["lab", "#/lab", tr("Digital lab", "数智实验室"), tr("26 Nov, 14:00–16:00", "11月26日 14:00–16:00")],
    ["kit", "#/kit", tr("Field kit", "田野工具包"), tr("26 Nov briefing and labelling", "26日说明与编号")],
    ["poster", "#/work", tr("Poster desk", "成果制作台"), tr("27 Nov draft, 28 Nov presentation", "27日起草，28日展示")]
  ];
  return `
    <h1>${tr("Task map", "任务地图")}</h1>
    <p>${tr("Every station stays open. A wrong answer explains the gap and does not lock you out. A badge does not replace evidence.", "站点均可进入。答错会解释缺口，不会锁死。徽章不能代替证据。")}</p>
    <div class="progress-bar" aria-label="${tr("Progress", "进度")}"><span style="width:${(done / total) * 100}%"></span></div>
    <p class="caption">${tr(`Finished ${done} / ${total} stations. Times below come from the cleaned schedule dated 4 Nov 2026.`, `已完成 ${done} / ${total} 个主站。下面的钟点来自 2026年11月4日清理后的日程表。`)}</p>
    <h2>${tr("Which task happens when", "任务安排")}</h2>
    ${taskPlan()}
    <p class="caption">${tr("You still may not collect, move, or prepare a fossil on your own. The sheet allows handling only in a designated area, with permission and a qualified person.", "学生仍不得自行采集、移动或处理化石。表中的采集只发生在指定区域，并须有现场许可和具备资质的人员。")}</p>
    <h2>${tr("Cleaned schedule", "清理后的行程")}</h2>
    ${programmeTable()}
    <div class="map-board">
      <div class="route">
        ${nodes
          .map(([id, href, title, sub]) => {
            const st = moduleDone(id) ? "done" : "now";
            return `<a class="route-node" href="${href}"><span class="dot ${st}"></span><span><strong>${title}</strong><br><span class="caption">${sub}</span></span><span>${moduleDone(id) ? tr("Evidence saved", "已留下证据") : tr("Enter", "进入")}</span></a>`;
          })
          .join("")}
      </div>
      <div>
        ${figureBlock(FIGURES.map)}
      </div>
    </div>
  `;
}

export function trainPage() {
  return `
    <p class="kicker">${tr("Scheduled: 25 Nov, 19:30–20:30 opening lecture", "安排：11月25日 19:30–20:30 开幕讲座")}</p>
    <h1>${tr("Read The Rock And The Fossil", "读懂岩层与化石", "암석과 화석을 읽기")}</h1>
    <p>${tr("Goal: separate a fossil, the surrounding rock, the stratum, and a clue about age. Then write one observation you can take to the outcrop.", "目标：能区分化石、围岩、地层和年代线索，并写下一条可带到现场的观察。")}</p>
    ${figureBlock(FIGURES.field)}
    ${knowledge(trainCards())}
    <div id="draw-train"></div>
    <div id="w-sort"></div>
    <div id="w-class"></div>
    ${nextBtn("#/xitun", tr("Next: Xitun", "下一站：西屯"))}
  `;
}

export function xitunPage() {
  return `
    <p class="kicker">${tr("Scheduled: 26 Nov, 09:30–10:15", "安排：11月26日 09:30–10:15")}</p>
    <h1>${tr("Does A Fish Fossil Prove This Place Was Once A Sea?", "鱼化石能证明这里曾经是海吗？", "물고기 화석이 이곳이 바다였다는 증거가 되나?")}</h1>
    <p>${tr("Move from a first guess, to the limits of that guess, to a list of evidence, to a conclusion that says what is still missing.", "目标：走完直觉、限制、证据清单，再到有边界的结论。不要背“西屯就是海”，而要能说出依据和缺口。")}</p>
    <p><a href="https://www.ivpp.ac.cn/xwdt/kyjz/202404/t20240416_7103775.html" rel="noopener noreferrer">${tr("IVPP source for the Xitun study", "西屯研究的古脊椎所原文")}</a></p>
    ${figureBlock(FIGURES.xitun)}
    <div class="panel">
      <h3>Place and rock unit</h3>
      <p>The Xitun vertebrate fauna comes mainly from the Lower Devonian Xitun Formation at Qujing. Published accounts describe galeaspids, yunnanolepid antiarchs, and early sarcopterygians and actinopterygians. What you can see, where you may walk, and whether you may photograph or handle a specimen follow the arrangements on site.</p>
    </div>
    ${knowledge(xitunCards())}
    <div id="draw-xitun"></div>
    <div id="w-evidence"></div>
    ${nextBtn("#/zhujiang", tr("Next: Pearl River Source"))}
  `;
}

export function zhujiangPage() {
  return `
    <p class="kicker">${tr("Scheduled: 27 Nov, 09:00–12:00", "安排：11月27日 09:00–12:00")}</p>
    <h1>${tr("How A Study Moves From Material To A Conclusion", "一条研究是怎样从材料走到结论的", "연구는 자료에서 결론으로 어떻게 가는가")}</h1>
    <p>${tr("Do not reduce the report to “someone found a fish”. Keep the material, the rock unit, the comparison, and the family tree in separate layers.", "不要把报道简化成“发现一条鱼”。看清材料、地层、比较和系统发育如何形成科学问题。")}</p>
    <p><a href="https://ivpp.cas.cn/xwdt/kyjz/202502/t20250219_7529514.html" rel="noopener noreferrer">${tr("IVPP source for Bothriolepis zhujiangyuanensis", "珠江源沟鳞鱼的古脊椎所原文")}</a></p>
    ${figureBlock(FIGURES.specimen)}
    ${knowledge(zhujiangCards())}
    <div id="draw-zhujiang"></div>
    <div id="w-pair"></div>
    ${nextBtn("#/compare", tr("Next: comparison room"))}
  `;
}

export function comparePage() {
  return `
    <p class="kicker">${tr("Comparison room")}</p>
    <h1>${tr("Compare Structures, Not A General Likeness", "比较结构，而不是只看像不像", "비슷함이 아니라 구조를 비교한다")}</h1>
    <p>${tr("Find structures that correspond in position before you discuss a difference. A difference in shape is not a proven behaviour, and one shape is not a direct ancestor.")}</p>
    ${figureBlock(FIGURES.para)}
    ${knowledge(compareCards())}
    <div id="draw-compare"></div>
    <div id="w-slider"></div>
    <div id="w-hot"></div>
    <div id="w-compare-table"></div>
    <div id="w-fix"></div>
    ${nextBtn("#/lab", tr("Next: digital lab"))}
  `;
}

export function labPage() {
  return `
    <p class="kicker">${tr("Scheduled: 26 Nov, 14:00–16:00", "安排：11月26日 14:00–16:00")}</p>
    <h1>${tr("From A Specimen To A Restoration", "从一块标本到一张复原图", "표본에서 복원까지")}</h1>
    <div id="fossil-stage"></div>
    ${knowledge(labCards())}
    <div id="draw-lab"></div>
    <p>${tr("The path is specimen, CT scan, slice, segmentation, 3D reconstruction, scientific restoration, then communication. AI can help with segmentation or notes. It does not replace the original record, the literature, or an expert judgement.")}</p>
    ${figureBlock(FIGURES.pipeline)}
    <div id="w-layers"></div>
    <div id="w-digital"></div>
    <div id="w-ai"></div>
    ${nextBtn("#/kit", tr("Next: field kit"))}
  `;
}

export function kitPage() {
  return `
    <p class="kicker">${tr("Field kit")}</p>
    <h1>${tr("What you can use before departure")}</h1>
    <div class="grid grid-2">
      <div class="panel">
        <h3>${tr("Safety and protection")}</h3>
        <ul>
          <li>${tr("Stay in the allowed area. Keep away from slopes, pits, and loose rock.")}</li>
          <li>${tr("Follow the transport plan and the weather plan.")}</li>
          <li>${tr("Tools, preparation equipment, and electrical equipment are used only with a qualified person.")}</li>
          <li>${tr("Do not collect, trade, or damage a fossil on your own.")}</li>
          <li>${tr("Name the source and the permission when you use a photograph or a dataset.")}</li>
        </ul>
      </div>
      <div id="w-check"></div>
    </div>
    <div id="draw-kit"></div>
    <div id="w-card"></div>
    ${nextBtn("#/work", tr("Next: my work"))}
  `;
}

export function workPage() {
  const state = loadState();
  return `
    <p class="kicker">${tr("Scheduled: draft on 27 Nov evening, present 28 Nov 08:30–10:30", "安排：11月27日晚起草，11月28日 08:30–10:30 展示")}</p>
    <h1>${tr("Turn Evidence Into An Explanation You Can Present", "把证据变成可以展示的解释", "증거를 발표할 수 있는 설명으로")}</h1>
    <div id="record-board"></div>
    ${unitSummary()}
    <section class="panel poster-zones">
      <h2>${tr("Academic Poster In Canva", "Canva 学术海报", "Canva 학술 포스터")}</h2>
      <ul>
        <li><strong>${tr("Programme Frame.", "项目固定框。", "프로그램 고정 틀.")}</strong> ${tr("The programme title and the six headings stay fixed. Students do not delete them.", "项目名称和六个标题是固定的，学生不能删掉。", "프로그램 이름과 여섯 개의 제목은 고정이며 학생이 지우지 않습니다.")}</li>
        <li><strong>${tr("Student Edit.", "学生可改。", "학생 수정.")}</strong> ${tr("The six text boxes and the drawing boards are yours to change.", "六个文字框和绘图板可以由你修改。", "여섯 개의 글칸과 그림판은 학생이 바꿀 수 있습니다.")}</li>
        <li><strong>${tr("Download.", "下载。", "다운로드.")}</strong> ${tr("Download makes a picture for the presentation. It does not change the saved record.", "下载只生成展示用的图片，不改变已保存的记录。", "다운로드는 발표용 그림만 만들며 저장된 기록을 바꾸지 않습니다.")}</li>
        <li><strong>${tr("Save On This Device.", "保存在这台设备。", "이 기기에 저장.")}</strong> ${tr("Save keeps the draft in this browser.", "保存把草稿留在这个浏览器里。", "저장은 초안을 이 브라우저에 남깁니다.")}</li>
        <li><strong>${tr("Server Record.", "服务器记录。", "서버 기록.")}</strong> ${tr("Your name, email, text, and the time are written on the temporary server. Canva’s own cloud is separate and does not write back here.", "你的姓名、邮箱、文字和时间会写进临时服务器。Canva 自己的云是另一处，不会写回这里。", "이름, 이메일, 글, 시간이 임시 서버에 기록됩니다. Canva 클라우드와는 별개이며 여기로 다시 쓰이지 않습니다.")}</li>
      </ul>
      <p><a class="btn btn-primary" href="https://www.canva.com/posters/templates/science/" target="_blank" rel="noopener noreferrer">${tr("Open Canva Science Posters", "打开 Canva 科学海报", "Canva 과학 포스터 열기")}</a></p>
      <p class="caption">${tr("In Canva you may change colour, type size, and pictures. Copy the question, result, limit, and sources from the boxes below. Do not remove those four parts.", "在 Canva 里可以改颜色、字号和图片。研究问题、结果、限制和来源要从下面的框里抄过去，这四项不能删。", "Canva에서는 색, 글자 크기, 그림을 바꿀 수 있습니다. 질문, 결과, 한계, 출처는 아래 칸에서 옮기며 이 네 부분은 지우지 않습니다.")}</p>
    </section>
    <p>${state.badges.length ? tr("Badges on this device: ") + state.badges.map(badgeLabel).join(", ") : tr("No badges yet. Finish a station to light one. A badge does not replace evidence.")}</p>
    <div id="w-poster"></div>
    <div id="w-reflect"></div>
    <div class="panel">
      <h3>${tr("The two questions, in your own words")}</h3>
      <p>${tr("1. A fish fossil alone does not prove an ancient sea. You need rock type, sedimentary structures, stratigraphic position, the fossil assemblage, and a published regional or geochemical study, and you need to write the limit.")}</p>
      <p>${tr("2. “The fish grew limbs in order to walk” is not a mechanism. Talk about heritable variation in a population, the conditions, differences in reproductive success, and change over many generations.")}</p>
    </div>
  `;
}

export function sitesPage() {
  return `
    <h1>${tr("Xitun and the Pearl River Source")}</h1>
    <p>${tr("Two separate stations. The material is not the same age, so do not mix the notes.")}</p>
    <div class="grid grid-2">
      <a class="station-card" href="#/xitun"><h3>${tr("Xitun")}</h3><p>${tr("Early Devonian · environmental evidence")}</p></a>
      <a class="station-card" href="#/zhujiang"><h3>${tr("Pearl River Source")}</h3><p>${tr("Middle Devonian · how a study is built")}</p></a>
    </div>
  `;
}

export function teacherPage() {
  return `
    <h1>${tr("Teacher notes (no management tools in this version)")}</h1>
    <p>${tr("Reserved later: class lists, completion, site access, weather changes, poster review, and image permission. There is no server, so the site will not show “approved” or progress on another device.")}</p>
    <p>${tr("Sign-in: the school OIDC provider is not configured. If it is added, tokens stay on the server and the client secret stays out of this page. Roles would be Student and Staff. A pretend login is not offered.")}</p>
    <p>${tr("Schedule updates belong in the programme notes and the content data. Do not print an unconfirmed clock time on the student home page.")}</p>
  `;
}

const OFFICIAL = [
  ["IVPP: Xitun habitat study, 2024", "中科院古脊椎所：西屯脊椎动物群生境，2024", "https://www.ivpp.ac.cn/xwdt/kyjz/202404/t20240416_7103775.html"],
  ["IVPP paper record, Journal of the Geological Society", "古脊椎所论文条目：Journal of the Geological Society", "https://www.ivpp.ac.cn/sourcedb/zw/lwk/202404/t20240430_7150764.html"],
  ["Paper: Cai et al. 2024, doi:10.1144/jgs2023-146", "论文：Cai 等，2024，doi:10.1144/jgs2023-146", "https://doi.org/10.1144/jgs2023-146"],
  ["IVPP: Bothriolepis zhujiangyuanensis, 2025", "古脊椎所：珠江源沟鳞鱼，2025", "https://ivpp.cas.cn/xwdt/kyjz/202502/t20250219_7529514.html"],
  ["Paper: Acta Geologica Sinica, doi:10.1111/1755-6724.15269", "论文：《地质学报（英文版）》，doi:10.1111/1755-6724.15269", "https://doi.org/10.1111/1755-6724.15269"],
  ["IVPP ADMorph: Parayunnanolepis xitunensis restoration", "古脊椎所数字形态库：西屯副云南鱼复原", "http://admorph.ivpp.ac.cn/client/nice/learnMoreDetails/5"],
  ["IVPP: CT restudy of the Parayunnanolepis girdle", "古脊椎所：西屯副云南鱼腰带的 CT 再研究", "https://ivpp.cas.cn/xwdt/kyjz/202301/t20230105_6596074.html"],
  ["International Chronostratigraphic Chart", "国际年代地层表", "https://stratigraphy.org/chart/"],
  ["IVPP English site", "古脊椎所英文站点", "https://english.ivpp.cas.cn/"]
];

export function sourcesPage() {
  return `
    <h1>${tr("Sources and permission", "来源与授权")}</h1>
    <h2>${tr("Institution pages for the two cases", "两个案例的机构原文")}</h2>
    <ul>${OFFICIAL.map(
      (row) => `<li><a href="${row[2]}" rel="noopener noreferrer">${tr(row[0], row[1])}</a></li>`
    ).join("")}</ul>
    <p class="caption">${tr("These pages are the sources for the Xitun and Pearl River Source stations. Field coordinates printed in the papers are not copied here.", "西屯站和珠江源站的科学说法以这些页面为准。论文里的野外坐标不抄到本站。")}</p>
    <ul>${SOURCES.map(
      (s) =>
        `<li><strong>${s.title}</strong> — ${s.use}${s.href ? ` <a href="${s.href}" rel="noopener noreferrer">${tr("Open", "链接")}</a>` : ""}</li>`
    ).join("")}</ul>
    <h2>${tr("Terms")}</h2>
    <ul>${TERMS.map((t) => `<li><strong>${t[0]}</strong>: ${t[1]}</li>`).join("")}</ul>
    <p>${tr("Figures used on the stations come from the 14 March 2026 lecture and keep a page number in the caption. They are for this study page. Field coordinates from the papers are not copied here. Confirm permission before reusing the lecture figures elsewhere.")}</p>
  `;
}

export function privacyPage() {
  return `
    <h1>${tr("Privacy")}</h1>
    <ul>
      <li>${tr("With no login, progress stays in this browser under the localStorage key qujing-investigator-v1.")}</li>
      <li>${tr("The site does not collect a student’s name, photograph, or location for publication.")}</li>
      <li>${tr("Unpublished specimens, internal links, and precise field coordinates are not published here.")}</li>
      <li>${tr("The site does not pretend that a teacher has reviewed the work or that a submission succeeded.")}</li>
    </ul>
  `;
}

export function mountPageWidgets(route) {
  if (route === "" || route === "home") {
    mountHeroCanvas(document.getElementById("hero-canvas"));
    mountDrawBoard(document.getElementById("draw-home"), "home");
    const strata = document.getElementById("strata-game");
    mountStrataCanvas(strata, {
      title: tr("Click the beds from oldest to youngest", "按从老到新点击地层"),
      why: tr(
        "In an undisturbed stack the lower bed is older, so start at the bottom. Key 1 is the bottom bed. A wrong click explains the gap and does not lock the page. This is a time sketch for Silurian, Early Devonian Xitun, and Middle Devonian Pearl River Source material. It is not a measured Qujing outcrop.",
        "未倒转的地层通常下面更老，所以从底部点起。数字键 1 是最下面一层。点错会说明缺口，不会锁住页面。这是志留纪、早泥盆世西屯、中泥盆世珠江源的时间示意，不是实测的曲靖剖面。"
      ),
      wrong: tr(
        "That bed is younger than the one you still need. In this sketch the bottom bed is oldest. This drawing is not a field log.",
        "这一层比你还没点的那层更年轻。在这张示意图里，最下面最老。它不是野外实测记录。"
      ),
      done: tr(
        "Order kept: Silurian, then Early Devonian Xitun material, then Middle Devonian Pearl River Source material. The sketch still does not replace a measured section.",
        "顺序成立：志留纪，然后早泥盆世西屯材料，然后中泥盆世珠江源材料。示意图仍然不能代替实测剖面。"
      ),
      resetLabel: tr("Clear and try again", "清空再试"),
      bands: [
        { id: "sil", label: tr("1 · Silurian · older", "1 · 志留纪 · 更老"), color: "#8d6b45" },
        { id: "early", label: tr("2 · Early Devonian · Xitun", "2 · 早泥盆世 · 西屯"), color: "#c4a36a" },
        { id: "middle", label: tr("3 · Middle Devonian · Pearl River Source", "3 · 中泥盆世 · 珠江源"), color: "#d7c4a2" }
      ]
    });
    strata?.addEventListener("strata-done", () => {
      completeModule("strata-sketch", { badge: tr("Oldest first", "先点最老") });
    });
  }
  if (route === "train") {
    mountDrawBoard(document.getElementById("draw-train"), "train-rock");
    mountSort(document.getElementById("w-sort"), {
      id: "train-rock",
      prompt: "Order geological time from older to younger",
      items: [
        { id: "s", label: "Silurian (background for early jawed vertebrates and osteichthyans)" },
        { id: "e", label: "Early Devonian (Xitun Formation and related fishes)" },
        { id: "m", label: "Middle Devonian (Pearl River Source material)" },
        { id: "l", label: "Late Devonian (later than the Middle Devonian; not the focus of this handbook)" }
      ],
      answer: ["s", "e", "m", "l"],
      why: "The Silurian is older than the Devonian. Within the Devonian, Early, Middle, and Late get younger in that order. Xitun and the Pearl River Source are not the same time."
    });
    mountClassify(document.getElementById("w-class"), {
      id: "obs-exp",
      prompt: "Sort each sentence as an observation or an explanation",
      items: [
        { id: "a", text: "The rock surface has a nearly horizontal band.", bin: "observe" },
        { id: "b", text: "So this place must have been a calm shallow sea.", bin: "explain" },
        { id: "c", text: "In the photograph a dark mass is surrounded by lighter material.", bin: "observe" },
        { id: "d", text: "The dark mass is a complete ancient fish.", bin: "explain" }
      ],
      why: "A band and a colour contrast can be seen. A habitat or a species name is an explanation and needs more evidence."
    });
  }
  if (route === "xitun") {
    mountDrawBoard(document.getElementById("draw-xitun"), "xitun");
    mountEvidencePicker(document.getElementById("w-evidence"), {
      id: "xitun",
      prompt: "Choose enough evidence to discuss the ancient environment",
      minNeed: 3,
      cards: [
        { id: "fish", label: "One fish fossil", needed: false },
        { id: "bed", label: "Bedding and sedimentary structures", needed: true },
        { id: "matrix", label: "Rock type around the fossil", needed: true },
        { id: "asso", label: "The associated fossil assemblage", needed: true },
        { id: "pos", label: "Stratigraphic position", needed: true },
        { id: "geo", label: "A published geochemical or regional study", needed: true }
      ],
      whyWeak:
        "A fish fossil is not enough. Fish live in more than one kind of water, and a fossil can be moved. You need rock type, sedimentary structures, stratigraphic position, the assemblage, and a sourced regional study. “Generally marine, with freshening episodes” comes from the IVPP 2024 account. It is not something the outcrop shows at a glance.",
      whyEnough:
        "You did not stop at one fish fossil. On site you can record rock type and bedding. An environmental conclusion still needs the published study and a note of what is missing."
    });
  }
  if (route === "zhujiang") {
    mountDrawBoard(document.getElementById("draw-zhujiang"), "zhujiang");
    mountPair(document.getElementById("w-pair"), {
      id: "zhujiang",
      prompt: "Match material, method, and conclusion for Bothriolepis zhujiangyuanensis",
      left: [
        { id: "mat", label: "Material", match: "spec" },
        { id: "meth", label: "Method", match: "phylo" },
        { id: "con", label: "Conclusion, with a limit", match: "geo" }
      ],
      right: [
        { id: "phylo", label: "Morphology, a character matrix, and a phylogenetic analysis" },
        { id: "geo", label: "A relationship is used to discuss biogeographic links between regions" },
        { id: "spec", label: "Well-preserved Bothriolepis specimens from the Shangshuanghe Formation" }
      ],
      why: "Finding a specimen is only the start. The method decides which question you can ask. The conclusion has to lead back to the material and the tree."
    });
  }
  if (route === "compare") {
    mountDrawBoard(document.getElementById("draw-compare"), "compare");
    mountSlider(document.getElementById("w-slider"), {
      id: "compare-slide",
      a: FIGURES.para.src,
      b: FIGURES.restore.src,
      aLabel: "Preservation beside a restoration (lecture figure)",
      bLabel: "Another scientific restoration",
      why: "Both sides of the slider can include inference. Treat only the outline preserved on the fossil as source material. Eyes, scales, and soft tissue that were filled in are restoration."
    });
    mountHotspots(document.getElementById("w-hot"), {
      id: "compare",
      img: FIGURES.para.src,
      alt: FIGURES.para.alt,
      spots: [
        { id: "h", n: "1", x: 20, y: 38, label: "Preserved head shield", note: "On the dark specimen, the left side is the head-shield outline. Trace the boundary you can see before you write about behaviour." },
        { id: "t", n: "2", x: 56, y: 30, label: "How the tail is preserved", note: "The right side of the upper specimen keeps only scattered scale-like remains. The complete slender tail on the lower model is a restoration." },
        { id: "f", n: "3", x: 34, y: 72, label: "Paired appendages", note: "The side appendages on the grey model are restored. A CT study revised the girdle reading of Parayunnanolepis xitunensis. “It looks like a fin” is not pelvic-fin evidence." },
        { id: "c", n: "4", x: 84, y: 86, label: "Printed habitat text", note: "The habitat sentence in the corner belongs to the lecture figure. It is not your observation at the outcrop. Cite the paper, and label it as a caption." }
      ],
      why: "Corresponding structures matter more than “it looks like a fish”. Opening every spot leaves a comparison note."
    });
    mountFixer(document.getElementById("w-fix"), {
      id: "teleology",
      sentences: [
        {
          bad: "The fish grew limbs on purpose so that it could walk on land.",
          parts: [
            { id: "a", text: "The population already had heritable variation, " },
            { id: "b", text: "in order to live on land in the future, " },
            { id: "c", text: "under particular conditions, " },
            { id: "d", text: "some traits made individuals more likely to leave offspring, " },
            { id: "e", text: "so an individual decided to grow limbs. " },
            { id: "f", text: "Over many generations those traits became more common in the population." }
          ],
          ok: ["a", "c", "d", "f"]
        }
      ],
      why: "The mechanism is variation, inheritance, conditions, and differences in reproductive success. An individual does not rebuild its body for a future goal."
    });
  }
  if (route === "compare") mountCompareTable(document.getElementById("w-compare-table"));
  if (route === "lab") {
    mountFossilStage(document.getElementById("fossil-stage"));
    mountDrawBoard(document.getElementById("draw-lab"), "lab");
    mountLayers(document.getElementById("w-layers"), {
      id: "lab",
      why: "A photograph, a CT slice, a segmented model, and a restoration sit at different evidence levels. The poster has to name the level.",
      steps: [
        {
          title: "Specimen",
          level: "raw",
          fig: FIGURES.specimen,
          gain: "External preservation, the relationship to the rock, and label information.",
          limit: "It does not show the inside, and it does not give the environment by itself.",
          who: "The finder, the preparator, and the collection staff.",
          cite: "Name the specimen or photograph, and separate fossil from rock."
        },
        {
          title: "CT slice",
          level: "processed",
          fig: FIGURES.ct,
          gain: "An internal section, density differences, and structures still inside the rock.",
          limit: "A slice is not the three-dimensional object, and it does not identify a species on its own.",
          who: "The person who scanned it and the person who interprets it.",
          cite: "Label it as a CT slice and note the instrument and processing."
        },
        {
          title: "Segmentation",
          level: "processed",
          fig: FIGURES.segmented,
          gain: "Selected structures shown as a shape you can turn in space.",
          limit: "Colour regions include judgement. Parts can be missed or over-selected.",
          who: "The person who segmented it.",
          cite: "Call it a segmentation or reconstruction, not a photograph of the fossil."
        },
        {
          title: "Restoration",
          level: "infer",
          fig: FIGURES.restore,
          gain: "A way to think about a possible outline and how parts may have connected.",
          limit: "Soft tissue, colour, and a complete outline often include inference.",
          who: "A team using the fossil and comparative anatomy.",
          cite: "Mark it as a restoration. It is not a field discovery."
        }
      ]
    });
    mountDigitalNote(document.getElementById("w-digital"));
    mountAiCase(document.getElementById("w-ai"));
  }
  if (route === "kit") {
    mountChecklist(document.getElementById("w-check"));
    mountDrawBoard(document.getElementById("draw-kit"), "kit");
    mountFieldCard(document.getElementById("w-card"));
  }
  if (route === "work") {
    mountRecordCanvas(document.getElementById("record-board"));
    mountPoster(document.getElementById("w-poster"));
    mountReflection(document.getElementById("w-reflect"));
  }
}
