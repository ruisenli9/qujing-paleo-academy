import { homePage, mountFront, playPage, qujingPage, watchPage } from "./front.js?v=36";
import { mountDrawBoard } from "./draw.js?v=15";
import { mountFossilStage } from "./fossil-stage.js?v=13";
import { lang, tr } from "./locale.js?v=16";
import { mountStrataCanvas } from "./scene.js?v=15";
import { loadState, recordUnit } from "./storage.js?v=36";

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function box(name, label) {
  return `<label>${label}<textarea name="${name}" rows="3"></textarea></label>`;
}

function sheet(title, body) {
  return `<section class="sheet"><h2>${title}</h2>${body}</section>`;
}

function fig(src, alt, caption) {
  return `<figure class="figure"><img src="${src}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>`;
}

function notes(items) {
  return `<div class="note-list">${items
    .map(
      ([title, body, href, link]) =>
        `<article class="note"><h3>${title}</h3><p>${body}</p>${href ? `<p><a href="${href}" target="_blank" rel="noopener noreferrer">${link}</a></p>` : ""}</article>`
    )
    .join("")}</div>`;
}

function saveRow(id) {
  return `<div class="cta-row"><button type="button" class="btn btn-primary" data-keep>${tr("Save", "保存", "저장")}</button><p class="caption" data-kept hidden></p></div>`;
}

function bindForm(id) {
  const form = document.querySelector(`[data-form="${id}"]`);
  if (!form) return;
  const saved = loadState().units?.[id] || {};
  form.querySelectorAll("[name]").forEach((el) => {
    if (saved[el.name] == null || saved[el.name] === "") return;
    if (el.type === "checkbox") el.checked = Boolean(saved[el.name]);
    else el.value = saved[el.name];
  });
  form.querySelector("[data-keep]")?.addEventListener("click", () => {
    const patch = {};
    form.querySelectorAll("[name]").forEach((el) => {
      patch[el.name] = el.type === "checkbox" ? el.checked : el.value.trim();
    });
    recordUnit(id, patch);
    const note = form.querySelector("[data-kept]");
    note.hidden = false;
    const checks = [...form.querySelectorAll("[type=checkbox]")];
    const open = checks.length && checks.some((item) => !item.checked);
    note.textContent = open
      ? tr(
          "Saved. Before the presentation, finish the five checks.",
          "已保存。展示前请完成五项自查。",
          "저장했습니다. 발표 전에 다섯 가지 점검을 마치세요."
        )
      : tr("Saved in My Work.", "已保存到我的成果。", "내 결과에 저장했습니다.");
  });
}

function learnPath(steps) {
  return `<ol class="learn-path">${steps
    .map(([title, body]) => `<li><strong>${title}</strong><small>${body}</small></li>`)
    .join("")}</ol>`;
}

function tripPage() {
  const say = (en, zh, ko) => {
    const text = tr(en, zh, ko);
    return lang() === "en" ? text : `${text}<span class="beside-en">${en}</span>`;
  };
  const days = [
    [tr("25 November", "11月25日", "11월 25일"), "day-a", [
      ["14:00–18:00", say("Arrive in Qujing and check in", "抵达曲靖，办理入住", "취징에 도착해 체크인합니다"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), say("Teachers are to arrive by 18:00. The table does not give a student arrival time.", "带队老师在 18:00 前到。学生的到达时间，这张表没有写。", "인솔 교사는 18:00 전에 도착합니다. 학생 도착 시각은 표에 없습니다.")],
      ["18:00–19:00", say("Dinner", "晚餐", "저녁 식사"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["19:30–20:30", say("Opening lecture", "开营讲座", "개강 강의"), say("Hotel meeting room", "酒店会议室", "호텔 회의실"), say("Led by CAS.", "由中国科学院主讲。", "중국과학원 진행.")]
    ]],
    [tr("26 November", "11月26日", "11월 26일"), "day-b", [
      ["07:00–07:30", say("Wake up", "起床", "기상"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["07:30–08:00", say("Breakfast", "早餐", "아침 식사"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["08:00–08:30", say("Transfer to the Xitun field station", "前往西屯野外考察站", "Xitun 야외 조사 기지로 이동"), "", say("This is a proposed travel window. The actual journey still has to be checked.", "这是预留的行车时间，实际路程还要核对。", "예정된 이동 시간입니다. 실제 소요 시간은 아직 확인 전입니다.")],
      ["08:30–09:00", say("Fieldwork briefing and collection instructions", "野外任务说明和采集要求", "야외 과제 설명과 채집 안내"), say("Xitun Fauna Field Station", "西屯动物群野外考察站", "Xitun 동물군 야외 조사 기지"), say("This briefing is on site. The 30-minute introductory lecture is in the evening.", "这是现场说明。三十分钟的入门讲座放在晚上。", "현장 설명입니다. 30분 입문 강의는 저녁에 있습니다.")],
      ["09:00–09:30", say("Visit the field station exhibition", "参观考察站的小展馆", "조사 기지의 작은 전시 관람"), say("Xitun Fauna Field Station", "西屯动物群野外考察站", "Xitun 동물군 야외 조사 기지"), say("Recognise the local fossils and the beds they come from.", "认识这里的化石，以及它们所在的地层。", "이곳의 화석과 그 화석이 나온 지층을 알아봅니다.")],
      ["09:30–10:15", say("Observe the strata and record what you see", "观察地层，记下看见的现象", "지층을 보고 본 것을 적습니다"), say("Xitun fossil site", "西屯化石遗址", "Xitun 화석 유적"), say("Use the fieldwork handbook.", "用研学手册。", "답사 교재를 사용합니다.")],
      ["10:15–11:30", say("Excavation and collection in the designated areas", "在指定区域发掘和采集", "지정 구역에서 발굴과 채집"), say("Designated areas at the Xitun fossil site", "西屯化石遗址的指定区域", "Xitun 화석 유적의 지정 구역"), say("Vertebrate fossils are generally not taken away. A fragment may leave only after it is identified and approved, or you record it with a mould or a rubbing. Tools are not all confirmed yet.", "脊椎动物化石原则上不带走。碎片要先鉴别并得到允许，才可以带走；也可以翻模或拓印。采集工具还没有全部备齐。", "척추동물 화석은 원칙적으로 가져가지 않습니다. 조각은 확인하고 허락받은 뒤에만 가져갈 수 있고, 거푸집이나 탁본으로 기록할 수도 있습니다. 도구는 아직 다 확정되지 않았습니다.")],
      ["11:30–13:00", say("Lunch, then transfer to the Ancient Fish Kingdom Museum", "午餐，然后前往古鱼王国博物院", "점심 후 고어왕국 박물관으로 이동"), "", say("If the drive takes longer, the afternoon starts later.", "如果车程更长，下午的开始时间往后推。", "이동이 더 걸리면 오후 시작도 늦춥니다.")],
      ["13:00–14:00", say("Museum visit", "博物院参观", "박물관 관람"), say("Ancient Fish Kingdom Museum, Qujing Normal University", "曲靖师范学院古鱼王国博物院", "취징사범대학 고어왕국 박물관"), say("Follow the exhibition through Earth history and the history of life. The early universe is not part of the fossil record.", "沿着展览看地球历史和生命的变化。早期宇宙不属于化石记录。", "전시를 따라 지구 역사와 생명의 변화를 봅니다. 초기 우주는 화석 기록에 속하지 않습니다.")],
      ["14:00–17:00", say("Two activities at the same time: a CT reconstruction demonstration with workstation turns, and fossil preparation, labelling and numbering", "两件事同时进行：CT 三维复原演示，大家轮流看工作站；同时做化石修理、编号和贴标签", "두 가지를 같이 합니다. CT 3차원 복원 시연과 워크스테이션 체험, 그리고 화석 수리·번호·라벨"), say("Ancient Fish Kingdom Museum", "古鱼王国博物院", "고어왕국 박물관"), say("Staff demonstrate. Students do not operate the CT scanner. Use only morning finds that have been identified and approved. Two extra microscopes are not confirmed.", "工作人员演示。学生不操作 CT 扫描仪。只用上午已经鉴别并允许使用的材料。另外两台显微镜还没有定。", "직원이 시연합니다. 학생은 CT 스캐너를 직접 다루지 않습니다. 오전에 확인하고 허락받은 것만 사용합니다. 현미경 두 대는 아직 확정되지 않았습니다.")],
      ["17:00–18:00", say("Return to the hotel and rest", "回酒店休息", "호텔로 돌아가 쉽니다"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["18:00–19:00", say("Dinner", "晚餐", "저녁 식사"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["19:00–20:30", say("Excursion to the South Gate", "去南城门", "남쪽 성문으로 나갑니다"), say("South Gate", "南城门", "남쪽 성문"), ""]
    ]],
    [tr("27 November", "11月27日", "11월 27일"), "day-c", [
      ["07:00–07:30", say("Wake up", "起床", "기상"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["07:30–08:00", say("Breakfast", "早餐", "아침 식사"), say("Hotel in Qujing", "曲靖的酒店", "취징의 호텔"), ""],
      ["08:00–09:20", say("Transfer to the Pearl River Source", "前往珠江源", "주강 발원지로 이동"), "", say("A proposed travel window, not a checked journey time.", "这是预留的行车时间，不是已经核对过的路程。", "예정된 이동 시간이며, 확인된 소요 시간은 아닙니다.")],
      ["09:20–10:30", say("Site 4: look for large pieces of fossil fish bone", "4 号点：寻找大型鱼类化石骨片", "4번 지점: 큰 어류 화석 뼈조각을 찾습니다"), say("Pearl River Source, Site 4", "珠江源 4 号点", "주강 발원지 4번 지점"), say("Record the bone and the rock around it. Follow the instructions on site.", "记下骨片和周围的岩石。采集听现场安排。", "뼈와 주변 암석을 적습니다. 채집은 현장 안내를 따릅니다.")],
      ["10:30–11:00", say("Transfer between the sites, and a rest", "两个点之间的转场和休息", "두 지점 사이 이동과 휴식"), "", say("This window is reserved. The route and the time are not fixed yet.", "这段时间先留着。路线和实际用时还没定。", "시간을 비워 둔 것입니다. 경로와 실제 시간은 아직 정해지지 않았습니다.")],
      ["11:00–12:00", say("Fieldwork at the Site 1 fossil locality", "1 号点化石遗址", "1번 지점 화석 유적"), say("Pearl River Source, Site 1", "珠江源 1 号点", "주강 발원지 1번 지점"), say("Compare what you saw at the two sites.", "把两个点看到的放在一起比较。", "두 지점에서 본 것을 비교합니다.")],
      ["12:00–13:00", say("Lunch break", "午餐和休息", "점심과 휴식"), "", ""],
      ["13:00–14:15", say("Visit the exhibition on the move from water to land", "参观从水生到陆生的展览", "물에서 육지로의 전시를 봅니다"), say("Exhibition in the Pearl River Source scenic area", "珠江源景区内的展馆", "주강 발원지 관광지의 전시"), say("Whether the hall is open, and whether there is a guide, is not confirmed.", "展馆开不开、有没有讲解，还没有确认。", "전시 개방과 해설은 아직 확인되지 않았습니다.")],
      ["14:15–16:00", say("Matoushan viewpoint, then a group discussion on the move to land, environmental change, and future survival", "马头山看环境，然后小组讨论登陆、环境变化和以后的生存", "마터우산에서 환경을 보고, 육지로의 이동·환경 변화·이후의 생존을 토론합니다"), say("Matoushan", "马头山", "마터우산"), say("Groups of two or three. Separate what the fossil shows, what you explain, and what you are only guessing. Do not treat evolution as a plan the animal made.", "每组 2 到 3 人。把化石上看得见的、你的解释、和仅仅是猜测分开。不要把演化说成动物自己的打算。", "2–3명입니다. 화석에서 보이는 것, 설명, 추측을 나누세요. 진화를 동물이 세운 계획으로 말하지 않습니다.")],
      ["16:00–18:00", say("Transfer, check in, and rest", "转场、入住、休息", "이동, 체크인, 휴식"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), say("An older draft named Xiake Caotang. This revision does not confirm that hotel.", "旧稿写的是霞客草堂。这一版没有确认那家酒店。", "예전 초안은 샤커차오탕이었습니다. 이번 개정은 그 호텔을 확인하지 않습니다.")],
      ["18:00–19:00", say("Dinner", "晚餐", "저녁 식사"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), ""],
      ["19:00–21:00", say("Workshop: the academic poster", "学术海报工作坊", "학술 포스터 작업"), say("Hotel meeting room", "酒店会议室", "호텔 회의실"), ""]
    ]],
    [tr("28 November", "11月28日", "11월 28일"), "day-d", [
      ["07:00–07:30", say("Wake up", "起床", "기상"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), ""],
      ["07:00–08:00", say("Breakfast", "早餐", "아침 식사"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), ""],
      ["08:00–09:00", say("Finish the academic poster and the presentation", "完成学术海报和汇报", "학술 포스터와 발표를 마칩니다"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), say("Groups of two or three. The template, the size, and how you hand it in are still to be confirmed.", "每组 2 到 3 人。海报的模板、尺寸和提交方式还要确认。", "2–3명입니다. 틀, 크기, 제출 방법은 아직 확인 전입니다.")],
      ["09:00–10:30", say("Group presentations and the closing ceremony. The Chongqing team leaves at 10:30.", "小组汇报和结营。重庆队 10:30 离开。", "모둠 발표와 폐회. 충칭 팀은 10:30에 떠납니다."), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), say("The block is about two hours. Each group’s speaking time depends on how many groups there are.", "这一段大约两小时。每组讲多久，要看一共有几组。", "전체는 약 두 시간입니다. 모둠별 시간은 모둠 수에 따라 정합니다.")],
      ["10:30–11:30", say("Visit to the ancient-fish fossil workstation", "参观古鱼化石工作站", "고어 화석 작업실 방문"), say("Ancient-fish fossil workstation, Pearl River Source", "珠江源古鱼化石工作站", "주강 발원지 고어 화석 작업실"), say("This visit is the earlier activity, and this revision has not confirmed it. If it is dropped, the time stays with the presentations.", "这是原先的活动，这一版还没有确认。如果取消，这段时间继续用于汇报。", "원래 일정이었고, 이번 개정에서는 확인되지 않았습니다. 취소되면 발표 시간으로 씁니다.")],
      ["11:30–12:30", say("Lunch", "午餐", "점심"), say("Dining place to be confirmed", "用餐地点未定", "식사 장소 미정"), ""],
      ["12:30–13:00", say("Check out", "退房", "체크아웃"), say("Hotel at the Pearl River Source", "珠江源的酒店", "주강 발원지의 호텔"), say("The meeting time follows the actual train or flight.", "集合时间按实际的火车或航班来。", "집결 시각은 실제 기차나 항공편을 따릅니다.")],
      ["about 13:00", say("Departure", "出发", "출발"), say("Airport", "机场", "공항"), say("Pearl River Source to Changshui Airport is about two and a half hours. Leaving at 13:00 would mean about 15:30, before traffic, check-in and security. Station transfers and the actual service are not confirmed.", "珠江源到长水机场大约两个半小时。13:00 出发大约 15:30 到，这里不含堵车、值机和安检。去车站的时间和具体班次还没有确认。", "주강 발원지에서 창수이 공항까지 약 2시간 30분입니다. 13:00에 떠나면 15:30쯤이며, 정체·탑승 수속·보안 검색은 포함하지 않습니다. 역 이동과 실제 편은 아직 확인 전입니다.")]
    ]]
  ];
  const head = `<tr><th>${tr("Time", "时间", "시간")}</th><th>${tr("Activity", "活动", "활동")}</th><th>${tr("Place", "地点", "장소")}</th><th>${tr("Note", "说明", "설명")}</th></tr>`;
  return `
    <p class="kicker">25–28 November 2026</p>
    <h1>${tr("Itinerary", "行程", "일정")}</h1>
    ${days.map(([when, tone, rows]) => `
      <table class="schedule ${tone}">
        <caption>${when}</caption>
        <thead>${head}</thead>
        <tbody>
          ${rows.map(([time, what, where, note]) => `<tr><td>${time}</td><td>${what}</td><td>${where}</td><td>${note}</td></tr>`).join("")}
        </tbody>
      </table>`).join("")}`;
}

function tasksPage() {
  const tasks = [
    ["01", tr("Read The Beds", "读懂岩层", "지층 읽기"), tr("Observe the beds, fossils, and environment clues. Check the place, the bed, and the age. Leave one field card.", "观察地层、化石及环境线索，核对地点、地层和年代。完成一张野外观察卡。", "지층, 화석, 환경 단서를 관찰하고 장소, 지층, 시대를 확인한다. 야외 관찰 카드 한 장을 남긴다."), "#/task/strata"],
    ["02", tr("Dissect Ancient Fishes", "解剖古鱼", "고대 어류 해부"), tr("Compare matching parts of the skull, jaw, or fin on the materials your teacher names. Leave one comparison drawing.", "按导师指定的材料比较头骨、颌或鳍等对应结构。完成一张解剖比较图。", "교사가 지정한 자료에서 머리뼈, 턱 또는 지느러미의 대응 구조를 비교한다. 해부 비교 그림 한 장을 남긴다."), "#/task/anatomy"],
    ["03", tr("Look Inside", "数字探秘", "디지털 탐구"), tr("Set a photograph, a CT slice, and a 3D model side by side. Mark what is preserved, what was segmented, and what was inferred. Leave one digital record.", "对照照片、CT 切片与三维模型，标出直接保存、分割识别和推测补全的部分。完成一份数字观察记录。", "사진, CT 단면, 3차원 모델을 나란히 놓고 직접 보존된 부분, 분할로 인식한 부분, 추정해 채운 부분을 표시한다. 디지털 관찰 기록을 남긴다."), "#/task/digital"],
    ["04", tr("Explain A Discovery", "解释发现", "발견 설명"), tr("Choose a question that your photographs, notes, slices, or models can answer. Leave the group science poster.", "选择一个能用现场照片、记录、切片或模型回答的问题，用观察结果和证据作出解释。完成小组科学海报。", "현장 사진, 기록, 단면 또는 모델로 답할 수 있는 질문을 고르고, 관찰과 증거로 설명한다. 모둠 과학 포스터를 남긴다."), "#/task/explain"]
  ];
  return `
    <p class="kicker">${tr("Four Field Tasks", "四项科考任务", "네 가지 탐사 과제")}</p>
    <h1>${tr("What You Investigate", "你要研究的四件事", "연구할 네 가지")}</h1>
    <p>${tr(
      "Keep what you saw separate from what you explain. Xitun and the Pearl River Source are places on the itinerary. The CT work belongs in Look Inside.",
      "把亲眼看到的和根据证据作出的解释分开。西屯和珠江源是行程中的地点。CT 和模型属于数字探秘。",
      "직접 본 것과 증거로 한 설명을 구분합니다. 시툰과 주강 발원지는 일정의 장소입니다. CT와 모델은 디지털 탐구에 속합니다."
    )}</p>
    <div class="task-list">
      ${tasks
        .map(
          ([n, title, body, href]) => `
          <a class="task-card" href="${href}"><span>${n}</span><strong>${title}</strong><small>${body}</small></a>`
        )
        .join("")}
    </div>`;
}

function strataPage() {
  return `
    <p class="kicker">02 · ${tr("Read The Beds", "读懂岩层", "지층 읽기")}</p>
    <h1>${tr("How Do Fossils And Beds Keep The Past?", "化石和岩层如何保存过去？", "화석과 지층은 과거를 어떻게 남기나?")}</h1>
    <p class="intro-band">${tr(
      "A fossil can be the body of an ancient organism, something it left behind, or a trace of what it did. Burial, preservation, the bed reaching the surface, and someone finding it are only a short version of a much longer story. Fossils are not all kept in the same way. The fossil record has gaps, so a restoration is not the same thing as the fossil it was drawn from.",
      "化石可以是古代生物遗体、遗物或活动痕迹。埋藏、保存、地层出露和发现只是简化过程；不同化石的保存方式可能不同。化石记录并不完整，因此复原图与原始化石不能等同。",
      "화석은 옛 생물의 몸일 수도 있고, 남긴 물건일 수도 있고, 활동한 흔적일 수도 있습니다. 묻히고, 남고, 지층이 드러나고, 사람이 발견하기까지는 긴 과정인데, 우리가 말하는 순서는 그중 짧은 요약입니다. 화석마다 남는 방식도 다릅니다. 화석 기록에는 빈자리가 많아서, 복원도는 원래의 화석과 같은 것이 아닙니다."
    )}</p>
    <figure class="figure">
      <img src="./public/assets/pack/p07-plants.jpg" alt="${tr("Plant fossils in a display case", "展柜里的植物化石", "진열장 안의 식물 화석")}" />
      <figcaption>${tr(
        "Plant fossils in a case. Not the fish on this trip.",
        "植物化石展柜。不是这次的鱼化石。",
        "진열장의 식물 화석. 이번 답사의 물고기가 아닙니다."
      )}</figcaption>
    </figure>
    <section class="sheet pack-links">
      <h2>${tr("Tables And Readings For The Beds", "岩层用的表和阅读", "지층에 쓰는 표와 읽기")}</h2>
      <p><a href="./public/assets/pack/r05-fossil-cycle.docx" target="_blank" rel="noopener noreferrer">${tr("Fossil Cycle Reading", "化石循环阅读", "화석 순환 읽기")}</a></p>
      <p><a href="./public/assets/pack/r02-xitun-table.xlsx" target="_blank" rel="noopener noreferrer">${tr("Xitun Table 1", "西屯表 1", "Xitun 표 1")}</a> · <a href="./public/assets/pack/r03-xitun-table.xlsx" target="_blank" rel="noopener noreferrer">${tr("Xitun Table 2", "西屯表 2", "Xitun 표 2")}</a> · <a href="./public/assets/pack/r04-xitun-table.xlsx" target="_blank" rel="noopener noreferrer">${tr("Xitun Table 3", "西屯表 3", "Xitun 표 3")}</a></p>
    </section>
    ${learnPath([
      [tr("From The Last Chapter", "上一章留下", "앞 장에서"), tr("The place and the age. A fossil without those two cannot be compared.", "地点和年代。没有这两项，化石不能拿来比较。", "장소와 시대. 이 둘이 없으면 화석을 비교할 수 없습니다.")],
      [tr("This Chapter", "这一章回答", "이 장이 답하는 것"), tr("What was kept in the rock, and what a fish fossil does not prove.", "岩石里留下了什么，以及一条鱼化石证明不了什么。", "암석에 무엇이 남았는지, 그리고 물고기 화석이 증명하지 못하는 것.")],
      [tr("You Leave With", "写下带走", "적어서 가져가기"), tr("One field card: rock first, then the guess, then the revision.", "一张野外观察卡：先写岩石，再写推测，再写修正。", "야외 관찰 카드 한 장. 암석을 먼저, 그다음 추정, 그다음 수정.")]
    ])}
    ${fig(
      "./public/assets/media/specimen-3d-head.webp",
      tr("A fish head still in the rock", "包在岩石里的鱼头化石", "아직 암석 속의 물고기 머리 화석"),
      tr("A fish head still in the rock. Lecture page 11.", "包在岩石里的鱼头化石。讲座第11页。", "아직 암석 속에 있는 물고기 머리 화석. 강의 11쪽.")
    )}
    ${notes([
      [
        tr("The Ages On The Chart", "年代表上的数字", "연대표의 숫자"),
        tr(
          "On the International Chronostratigraphic Chart updated through 2024, the Silurian begins at 443.1 ± 0.9 million years ago, the Devonian at 419.62 ± 1.36 million years ago, and the Eifelian, the start of the Middle Devonian, at 393.47 ± 0.99 million years ago. If the chart in the room is newer, copy that one.",
          "在更新到 2024 年的国际年代地层表上，志留纪开始于 443.1 ± 0.9 百万年前，泥盆纪开始于 419.62 ± 1.36 百万年前，中泥盆世的起点艾菲尔期开始于 393.47 ± 0.99 百万年前。如果现场的表更新，就抄现场的那一版。",
          "2024년까지 갱신된 국제 연대층서표에서 실루리아기는 4억 4310만 년 ± 90만 년 전, 데본기는 4억 1962만 년 ± 136만 년 전, 중기 데본기의 시작인 아이펠절은 3억 9347만 년 ± 99만 년 전에 시작합니다. 현장의 표가 더 새것이면 그 표를 베낍니다."
        ),
        "https://stratigraphy.org/chart/",
        tr("Open The International Chronostratigraphic Chart", "打开国际年代地层表", "국제 연대층서표 열기")
      ],
      [
        tr("What The Xitun Study Reports", "西屯研究报道了什么", "시툰 연구가 보고한 것"),
        tr(
          "Cai, Sun, Zhao, Wang and Zhu, Journal of the Geological Society, 2024, describe the Early Devonian Xitun Formation as a shallow sea, with three times when fresher water came in. The fishes they name include Youngolepis, Diabolepis, Psarolepis, Achoania and Styloichthys, from the Lochkovian. That is the paper’s conclusion. A fish fossil on its own does not show the sea. The journal PDF needs a subscription, so the link below opens the institute’s Chinese account of the same study.",
          "2024年，蔡嘉辰、孙浩然、赵文金、王建华、朱敏研究了西屯组。他们认为这里当时是浅海，中间有三次淡水进来。文中的鱼有杨氏鱼、奇异鱼、斑鳞鱼、无孔鱼、蝶柱鱼，时代是早泥盆世洛赫考夫期。这是论文的结论。只看到一条鱼化石，还不能说那里是海。期刊全文要订阅才能打开，下面这条链到古脊椎所的中文介绍。",
          "2024년 Cai, Sun, Zhao, Wang, Zhu는 Xitun층을 얕은 바다로 보았고, 그 사이에 민물이 세 번 들어왔다고 썼습니다. 논문의 물고기는 Youngolepis, Diabolepis, Psarolepis, Achoania, Styloichthys이고, 시대는 전기 데본기 로흐코프절입니다. 이것은 논문의 결론입니다. 물고기 화석 하나만 보고 바다였다고 할 수는 없습니다. 학술지 원문은 구독해야 열리므로, 아래 링크는 같은 연구를 소개한 연구소의 중국어 글입니다."
        ),
        "https://www.ivpp.ac.cn/xwdt/kyjz/202404/t20240416_7103775.html",
        tr("Read The Institute’s Account", "阅读古脊椎所的介绍", "연구소 소개 글 읽기")
      ],
      [
        tr("How To Read A Column", "怎样读一根地层柱", "층을 기둥으로 읽는 법"),
        tr(
          "A 2020 paper in Vertebrata PalAsiatica redefines the Kuanti Formation around the Xiaoxiang Reservoir and uses a measured section that includes Dongpo. It places the main fish beds of the Xiaoxiang vertebrate fauna in the Ludfordian, the later part of the Ludlow. The column on the lecture slide is a sketch of names. Copy the bed you can see, and cite the paper when you use its age.",
          "2020年《古脊椎动物学报》的论文重新整理了潇湘水库附近的关底组，剖面经过东坡。文中把潇湘动物群的主要含鱼层放在志留纪晚期。讲座上的柱子只标了名字。看见哪一层就写哪一层；用论文里的年代时，写上这篇论文。",
          "Vertebrata PalAsiatica 2020년 논문은 샤오샹 저수지 일대의 관디층을 다시 나누고, 둥포를 포함한 실측 단면을 사용합니다. 샤오샹 척추동물군의 주요 어류층은 러들로세 후반인 러드포디안으로 둡니다. 강의 슬라이드의 기둥은 이름의 스케치입니다. 보이는 층은 보이는 대로 적고, 그 연대를 쓰면 이 논문을 밝힙니다."
        ),
        "https://www.vertpala.ac.cn/EN/Y2020/V58/I4/249",
        tr("Open The Paper", "打开这篇论文", "논문 열기")
      ]
    ])}
    ${fig(
      "./public/assets/media/xitun-fauna-slide.webp",
      tr("A lecture slide with a stratigraphic column, a restoration, papers, and specimens", "有地层柱、复原、论文和标本的讲座页", "층서 기둥, 복원, 논문, 표본이 있는 강의 쪽"),
      tr(
        "Lecture page 29. Column, restoration, paper titles.",
        "讲座第29页。地层柱、复原、论文题目。",
        "강의 29쪽. 층서 기둥, 복원, 논문 제목."
      )
    )}
    ${sheet(
      tr("From What Is Left To What You Write", "从留下来的，到你写下的", "남은 것에서 당신이 적는 것까지"),
      `<p>${tr(
        "A fossil is a body, a remain, or a trace of an ancient organism kept in the rock record. Hard parts are kept more often than soft parts. Most organisms leave nothing you can find. The record is incomplete before you begin.",
        "化石是古代生物留在岩石里的身体、遗体或痕迹。骨头、牙齿和甲比肌肉更容易留下来。很多生物什么也没留下，所以岩石里的记录本来就不完整。",
        "화석은 암석 기록에 남은 옛 생물의 몸, 유해 또는 흔적입니다. 단단한 부분이 부드러운 부분보다 더 자주 남습니다. 대부분의 생물은 찾을 수 있는 것을 남기지 않습니다. 기록은 시작하기 전부터 불완전합니다."
      )}</p>
      <p>${tr(
        "On one specimen, separate three things: the fossil, the rock around it, and any label or restoration. The rock can show colour, grain, and bedding. The fossil can show a shape. The label is someone else’s sentence.",
        "一件标本上先分开三样东西：化石、围岩、标签或复原。围岩能告诉你颜色、颗粒和层理。化石能告诉你一个形状。标签是别人写的句子。",
        "표본 하나에서 세 가지를 나누세요. 화석, 주변 암석, 라벨 또는 복원. 암석은 색, 입자, 층리를 보여 줍니다. 화석은 모양을 보여 줍니다. 라벨은 다른 사람의 문장입니다."
      )}</p>
      <section id="sort-rock">
        <h3>${tr("Put Each Sentence Back", "把每句话放回去", "각 문장을 제자리로")}</h3>
        <p class="sort-path" data-sort-path></p>
        <p data-sort-prompt></p>
        <div class="cta-row" data-sort-choices></div>
        <p class="caption" data-sort-note></p>
      </section>`
    )}
    ${sheet(
      tr("Research Question", "研究问题", "연구 질문"),
      `<p>${tr(
        "What do the beds, the fossils, and the other environment clues show at the place you are observing? A fish fossil by itself does not prove the sea. Fishes live in the sea and in fresh water. You also need the rock, the sedimentary structures, the fossil assemblage, and published geochemical or regional studies.",
        "你观察的地方，地层、化石和其他环境线索说明什么？鱼化石本身不能证明那里是海。鱼类既生活在海洋，也生活在淡水。还要看岩性、沉积构造、化石组合，以及已发表的地球化学或区域研究。",
        "관찰하는 장소에서 지층, 화석, 다른 환경 단서는 무엇을 보여 주는가? 물고기 화석만으로 바다였다고 할 수 없습니다. 물고기는 바다와 민물에 모두 삽니다. 암석, 퇴적 구조, 화석 군집, 발표된 지구화학 또는 지역 연구가 더 필요합니다."
      )}</p>
      <p>${tr(
        "Published work reads the Xitun Formation as generally marine, with episodes when the water became less salty. That is a research conclusion. It is not something you can claim from a fish fossil alone.",
        "已有研究认为西屯组总体形成于海洋环境，并记录了海水变淡的过程。这是研究结论，不是单凭一条鱼化石就能说出的话。",
        "발표된 연구는 시툰층을 대체로 바다에서 쌓였고, 물이 덜 짠 시기들이 있었다고 읽습니다. 이것은 연구 결론이며, 물고기 화석 하나만으로 말할 수 있는 것이 아닙니다."
      )}</p>`
    )}
    ${sheet(
      tr("Materials You Can Use", "可用材料", "쓸 수 있는 자료"),
      `<p>${tr(
        "Fill the card from the place the teacher shows you. On the time chart, mark the Silurian, the Early Devonian, and the Middle Devonian, and copy the ages from the chart in the room.",
        "按老师带去的地点填写下面的卡片。在年代表上标出志留纪、早泥盆世和中泥盆世，年代数字抄现场的表。",
        "교사가 안내한 장소에서 아래 카드를 적습니다. 연대표에 실루리아기, 전기 데본기, 중기 데본기를 표시하고, 연대 숫자는 현장의 표에서 베낍니다."
      )}</p>`
    )}
    ${sheet(
      tr("What To Do", "操作步骤", "하는 방법"),
      `<p>${tr(
        "At the safe place your teacher names, look at the beds. Take a wide photograph first, then a close photograph with a scale. Do not hammer, collect, or move a fossil. The safety notes are on Terms And Safety.",
        "在导师指定的安全位置观察岩层。先拍全景，再拍带比例尺的局部。不得敲击、采集或移动化石。安全要求写在“术语与安全”。",
        "교사가 지정한 안전한 자리에서 지층을 봅니다. 먼저 전경을 찍고, 그다음 축척이 있는 가까운 사진을 찍습니다. 화석을 두드리거나 채집하거나 옮기지 않습니다. 안전은 “용어와 안전”에 있습니다."
      )}</p>
      <div id="strata-game"></div>`
    )}
    <form class="sheet" data-form="field">
      <h2>${tr("Field Card", "野外观察卡", "야외 관찰 카드")}</h2>
      ${box("m1", tr("Specimen Or Group, Place And Bed, Age, Feature Worth Seeing", "标本或类群、地点与地层、年代、最值得观察的特征", "표본 또는 분류군, 장소와 지층, 시대, 볼 만한 특징"))}
      ${box("m2", tr("Second Material", "第二件材料", "두 번째 자료"))}
      ${box("m3", tr("Third Material", "第三件材料", "세 번째 자료"))}
      ${box("place", tr("Place, Date, Weather", "地点、日期、天气", "장소, 날짜, 날씨"))}
      ${box("rock", tr("Colour, Grain, And Bedding", "岩层颜色、颗粒、层理", "색깔, 입자, 층리"))}
      ${box("horizon", tr("Which Bed The Fossil Is In, Or Where The Display Came From", "化石所在层位，或展品来源", "화석이 있는 층, 또는 전시품의 출처"))}
      ${box("photo", tr("Photograph Number, Direction, And Scale", "照片编号、方向和比例尺", "사진 번호, 방향, 축척"))}
      ${box("unsure", tr("What You Cannot Yet Tell", "不能确定的地方", "아직 알 수 없는 것"))}
      <h2>${tr("Evidence And Explanation", "证据与解释", "증거와 설명")}</h2>
      ${box("guess", tr("From The Fish Fossil Alone, What Would You Suggest?", "仅看鱼化石时，你的推测是什么？", "물고기 화석만 보았을 때의 추정"))}
      ${box("revised", tr("After The Rock And The Other Evidence, How Do You Change That?", "加入岩层或其他证据后，你如何修正？", "암석과 다른 증거를 더한 뒤 어떻게 고치는가"))}
      ${saveRow()}
    </form>
    <div id="draw-field"></div>
    <p><a class="btn btn-primary" href="#/body">${tr("Next: The Fish Body", "下一章：古鱼的身体", "다음: 고대 어류의 몸")}</a> <a class="btn btn-ghost" href="#/mine">${tr("See This Card In My Work", "在我的成果中查看这张卡", "내 결과에서 이 카드 보기")}</a></p>`;
}

function anatomyPage() {
  return `
    <p class="kicker">03 · ${tr("Dissect Ancient Fishes", "解剖古鱼", "고대 어류 해부")}</p>
    <h1>${tr("What Changed In The Ancient Fish Body?", "古鱼身体发生了哪些演化变化？", "고대 어류의 몸에서는 어떤 변화가 있었나?")}</h1>
    <p class="intro-band">${tr(
      "Vertebrate evolution is not a line from “lower” animals to “higher” ones. Each branch kept some structures, changed others, and lost others. When you compare ancient fishes, first find the parts that match, either because they are the same structure or because they sit in the same place. Only then ask what a difference might mean.",
      "脊椎动物演化不是从“低级”走向“高级”的直线。不同谱系保留、改变或失去不同结构。比较古鱼时，先找同源或位置相对应的结构，再讨论差异可能意味着什么。",
      "척추동물의 진화는 ‘하등’에서 ‘고등’으로 올라가는 직선이 아닙니다. 갈래마다 어떤 구조는 남고, 어떤 구조는 바뀌고, 어떤 구조는 사라집니다. 고대 어류를 비교할 때는 같은 구조인지, 아니면 같은 자리에 있는 부분인지를 먼저 찾으세요. 그다음에 그 차이가 무엇을 뜻할 수 있는지 이야기합니다."
    )}</p>
    <figure class="figure">
      <img src="./public/assets/pack/p02-plates.png" alt="${tr("Published plates of an Entelognathus model, with a 5 mm scale", "已发表的初始全颌鱼模型图版，带 5 毫米比例尺", "발표된 Entelognathus 모델 도판, 5mm 축척")}" />
      <figcaption>${tr(
        "Entelognathus plates, 5 mm scale. Not a fossil from this trip.",
        "初始全颌鱼图版，5 毫米比例尺。不是这次采的化石。",
        "Entelognathus 도판, 5mm 축척. 이번 답사의 화석이 아닙니다."
      )}</figcaption>
    </figure>
    <div class="pair">
      ${fig("./public/assets/pack/p03.png", tr("Entelognathus plate", "初始全颌鱼图版", "Entelognathus 도판"), tr("Another published plate. Not this trip’s fossil.", "另一张已发表图版。不是这次的化石。", "발표된 다른 도판. 이번 답사의 화석이 아닙니다."))}
      ${fig("./public/assets/pack/p04.png", tr("Entelognathus plate", "初始全颌鱼图版", "Entelognathus 도판"), tr("Another published plate. Not this trip’s fossil.", "另一张已发表图版。不是这次的化石。", "발표된 다른 도판. 이번 답사의 화석이 아닙니다."))}
    </div>
    <p class="pack-links"><a href="./public/assets/pack/r01-entelognathus.pdf" target="_blank" rel="noopener noreferrer">${tr("The Entelognathus Paper", "初始全颌鱼论文", "Entelognathus 논문")}</a></p>
    <figure class="figure"><img class="fit" src="./public/assets/external/bothriolepis-canadensis.jpg" alt="${tr("A restoration of Bothriolepis canadensis, a different species", "加拿大沟鳞鱼的复原，不是珠江源的种", "Bothriolepis canadensis의 복원. 주강 발원지의 종이 아님")}" /><figcaption>${tr("Bothriolepis canadensis, another species. The box-like armour. CC BY-SA 3.0.", "加拿大沟鳞鱼，另一个种。看箱形的甲。CC BY-SA 3.0。", "Bothriolepis canadensis, 다른 종. 상자형 갑옷. CC BY-SA 3.0.")} <a href="https://commons.wikimedia.org/wiki/File:Bothriolepis_canadensis.jpg" target="_blank" rel="noopener noreferrer">${tr("File Page", "文件页", "파일 페이지")}</a></figcaption></figure>
    ${learnPath([
      [tr("From The Last Chapter", "上一章留下", "앞 장에서"), tr("The bed and the age of each specimen. Do not mix Xitun with the Pearl River Source.", "每件标本的地层和年代。不要把西屯和珠江源混在一起。", "각 표본의 지층과 시대. Xitun과 주강 발원지를 섞지 않습니다.")],
      [tr("This Chapter", "这一章回答", "이 장이 답하는 것"), tr("Which parts correspond, and which sentence is only a story about purpose.", "哪些部位彼此对应，哪一句话只是关于用途的故事。", "어떤 부위가 서로 대응하는지, 어떤 문장이 용도에 대한 이야기인지.")],
      [tr("You Leave With", "写下带走", "적어서 가져가기"), tr("One comparison drawing with names, direction, and the limit of the claim.", "一张写明名称、方向和结论限度的比较图。", "이름, 방향, 결론의 한계를 적은 비교 그림 한 장.")]
    ])}
    <div class="pair">
      ${fig(
        "./public/assets/media/parayunnanolepis-compare.webp",
        tr("Preserved Parayunnanolepis beside a restoration", "副云南鱼的保存状态和复原", "파라윈난올레피스의 보존 상태와 복원"),
        tr(
          "Lecture page 23. Parayunnanolepis xitunensis. The upper picture is what is preserved. The lower picture is a restoration.",
          "讲座第23页。西屯副云南鱼。上面是保存下来的部分，下面是复原。",
          "강의 23쪽. Parayunnanolepis xitunensis. 위는 보존된 부분이고 아래는 복원입니다."
        )
      )}
      ${fig(
        "./public/assets/media/early-osteichthyan.webp",
        tr("Figure of an early osteichthyan", "早期硬骨鱼的图", "초기 경골어류 그림"),
        tr(
          "Lecture page 9. Use it to compare outlines. One picture is not a direct ancestor.",
          "讲座第9页。用来比较轮廓。一张图不是直接祖先。",
          "강의 9쪽. 윤곽을 비교하는 데 씁니다. 그림 한 장이 직접 조상은 아닙니다."
        )
      )}
    </div>
    ${notes([
      [
        tr("A Complete Fossil Can Be Read Again", "完整的化石也可以重读", "완전한 화석도 다시 읽을 수 있다"),
        tr(
          "The IVPP account of Parayunnanolepis xitunensis says an earlier reading of the girdle was revised after CT. Preserved and restored parts stay separate, and a matching outline is not a behaviour.",
          "古脊椎所对西屯副云南鱼的介绍说，腰带的一种早期读法在 CT 之后被修正。保存的部分和复原的部分要分开。轮廓相似不是行为。",
          "IVPP의 Parayunnanolepis xitunensis 소개는 허리띠에 대한 이전 읽기가 CT 뒤에 수정되었다고 합니다. 보존된 부분과 복원된 부분은 나눕니다. 윤곽이 비슷하다고 행동이 같은 것은 아닙니다."
        ),
        "https://ivpp.cas.cn/xwdt/kyjz/202301/t20230105_6596074.html",
        tr("Open The IVPP Note", "打开古脊椎所的介绍", "IVPP 소개 열기")
      ],
      [
        tr("A Published Comparison", "一个已经发表的比较", "이미 발표된 비교"),
        tr(
          "Bothriolepis zhujiangyuanensis is described from the Eifelian Shangshuanghe Formation at the Pearl River Source. The IVPP account uses seven well-preserved specimens. A slender proximal segment of the appendage places it as sister to Bothriolepis babichevi from Kazakhstan. That is a comparison of structures, then a biogeographic reading. It is not the same age as the Xitun Formation.",
          "珠江源沟鳞鱼描述于珠江源的艾菲尔期上双河组。古脊椎所的介绍使用了七件保存较好的标本。细长的附肢近节使它与哈萨克斯坦的巴氏沟鳞鱼构成姐妹群。这是先比较结构，再谈生物地理。它和西屯组不是同一时代。",
          "Bothriolepis zhujiangyuanensis는 주강 발원지의 아이펠절 쌍쌍허층에서 기재되었습니다. IVPP 소개는 잘 보존된 표본 7점을 사용합니다. 가느다란 부속지 근위 마디가 카자흐스탄의 Bothriolepis babichevi와 자매군이 되게 합니다. 구조를 비교한 다음 생물지리를 읽은 것입니다. 시툰층과 같은 시대가 아닙니다."
        ),
        "http://www.ivpp.cas.cn/xwdt/kyjz/202502/t20250219_7529514.html",
        tr("Open The IVPP Note", "打开古脊椎所的介绍", "IVPP 소개 열기")
      ],
      [
        tr("A Jaw From The Silurian", "志留纪的一块颌", "실루리아기의 턱"),
        tr(
          "Zhu and colleagues, Nature, 2013. Entelognathus primordialis is a three-dimensionally preserved placoderm from the Kuanti Formation near the Xiaoxiang Reservoir, Qujing, late Ludlow, about 419 million years ago in that paper. The paper describes a premaxilla and maxilla on the upper jaw and a dentary on the lower jaw. Those bones had been treated as an osteichthyan pattern. This is their comparison. It is not a bone you can point to in the Dongpo photograph, and it is not an Xitun fish. The television episode says about 420 million years. When you cite, name which source you used.",
          "朱敏等，《自然》，2013。初始全颌鱼是曲靖潇湘水库附近关底组的一件三维保存的盾皮鱼，论文放在罗德洛世晚期，约 4.19 亿年前。论文描述上颌的前上颌骨和上颌骨，以及下颌的齿骨。这些骨头过去被当作硬骨鱼的式样。这是他们的比较。你不能在东坡照片里指着它，它也不是西屯的鱼。电视节目说约 4.2 亿年。引用时写明你用的是哪一份。",
          "Zhu 등, Nature, 2013. Entelognathus primordialis는 취징 샤오샹 저수지 근처 관디층의 입체 보존 판피어로, 논문은 후기 러들로, 약 4억 1900만 년 전으로 둡니다. 논문은 위턱의 전상악골과 상악골, 아래턱의 치골을 기술합니다. 이 뼈들은 경골어류의 양식으로 여겨져 왔습니다. 이것은 그들의 비교입니다. 둥포 사진에서 가리킬 수 없고, 시툰의 물고기도 아닙니다. 텔레비전은 약 4억 2천만 년이라고 합니다. 인용할 때는 어느 자료를 썼는지 밝히세요."
        ),
        "https://doi.org/10.1038/nature12617",
        tr("Open The Paper", "打开这篇论文", "논문 열기")
      ],
      [
        tr("One Fish Can Mix Characters", "一条鱼可以混着不同的性状", "한 물고기가 서로 다른 형질을 섞을 수 있다"),
        tr(
          "Zhu and colleagues, Nature, 2009. Guiyu oneiros, from the late Silurian of Qujing, is described as the oldest near-complete articulated jawed vertebrate then reported. The paper says the pectoral girdle and a median fin spine look like those of jawed fishes that are not osteichthyans, while the large scales look like those of crown osteichthyans. Later discoveries can change a sentence that says “oldest”. Write the year of the paper. A mix of characters is not a ladder, and it is not a plan for life on land.",
          "朱敏等，《自然》，2009。曲靖志留纪晚期的梦幻鬼鱼，在当时被描述为已知最完整的有关节有颌脊椎动物。论文说它的胸带和中鳍棘像非硬骨鱼的有颌类，而大块鳞片像冠群硬骨鱼。后来的发现可以改写“最古老”这样的句子。写上论文的年份。性状混在一起不是阶梯，也不是为上岸做的计划。",
          "Zhu 등, Nature, 2009. 취징 후기 실루리아기의 Guiyu oneiros는 당시 가장 완전한 관절이 있는 악구류로 기술되었습니다. 논문은 가슴띠와 중앙 지느러미 가시가 경골어류가 아닌 악구류와 닮았고, 큰 비늘은 왕관군 경골어류와 닮았다고 합니다. 나중의 발견은 “가장 오래됨”이라는 문장을 바꿀 수 있습니다. 논문의 연도를 적으세요. 형질이 섞인 것은 사다리도 아니고, 육지를 위한 계획도 아닙니다."
        ),
        "https://doi.org/10.1038/nature07855",
        tr("Open The Paper", "打开这篇论文", "논문 열기")
      ],
      [
        tr("Scales Change Along One Fish", "同一条鱼身上，鳞并不一样", "같은 물고기의 비늘도 같지 않다"),
        tr(
          "Wang and Zhu, eLife, 2022, used CT on the articulated Parayunnanolepis xitunensis. They sort the scales into thirteen shapes, and the shape changes with the place on the body. The flank rows are not the same number on the left and the right. The paper offers an old injury as one reading of that difference. That reading is theirs. On your drawing, mark where a scale sits before you say what the difference means.",
          "王雅婧和朱敏，eLife，2022。他们用 CT 看关节仍在一起的西屯副云南鱼，把鳞分成十三种形态，形态随身体位置改变。身体侧面左右两边的鳞列数目不一样。论文把这种差别的一种读法写成旧伤。那是他们的读法。你在图上先标鳞的位置，再写差别可能说明什么。",
          "Wang와 Zhu, eLife, 2022. 관절이 남아 있는 Parayunnanolepis xitunensis를 CT로 보고, 비늘을 열세 가지 모양으로 나누었습니다. 모양은 몸의 위치에 따라 달라집니다. 옆면의 비늘 줄 수는 왼쪽과 오른쪽이 다릅니다. 논문은 그 차이의 한 읽기로 오래된 상처를 제시합니다. 그것은 그들의 읽기입니다. 그림에는 비늘의 위치를 먼저 표시하고, 그다음 차이가 무엇을 뜻할 수 있는지 적습니다."
        ),
        "https://doi.org/10.7554/eLife.76661",
        tr("Open The Paper", "打开这篇论文", "논문 열기")
      ]
    ])}
    ${fig(
      "./public/assets/media/restoration-head-detail.webp",
      tr("A restored ancient fish head", "复原的古鱼头部", "복원한 고대 어류의 머리"),
      tr(
        "Lecture page 18. Restored head.",
        "讲座第18页。头部复原。",
        "강의 18쪽. 머리 복원."
      )
    )}
    <section class="sheet" id="sort-body">
      <h2>${tr("Which Sentence Can You Defend?", "哪一句话你守得住？", "어느 문장을 지킬 수 있나?")}</h2>
      <p class="sort-path" data-sort-path></p>
      <p data-sort-prompt></p>
      <div class="cta-row" data-sort-choices></div>
      <p class="caption" data-sort-note></p>
    </section>
    ${sheet(
      tr("Research Question", "研究问题", "연구 질문"),
      `<p>${tr(
        "Which difference between two real specimens is worth studying further, and why? Vertebrate evolution is not a straight line from “lower” to “higher”. Different lineages kept, changed, or lost different structures. Find parts that correspond, then ask what a difference might mean. Do not treat a difference in shape as a proven behaviour.",
        "两件真实材料之间，哪一个结构差异最值得继续研究？为什么？脊椎动物的演化不是从“低级”走向“高级”的直线。不同谱系保留、改变或失去了不同的结构。先找位置相对应的结构，再讨论差异可能意味着什么。不要把形态差异直接当成已经确定的行为功能。",
        "두 실물 자료의 어떤 구조 차이가 더 연구할 가치가 있는가? 척추동물의 진화는 “하등”에서 “고등”으로 가는 직선이 아닙니다. 계열마다 지킨 구조, 바뀐 구조, 잃은 구조가 다릅니다. 서로 대응하는 부분을 먼저 찾고, 차이가 무엇을 뜻할 수 있는지 묻습니다. 모양의 차이를 확정된 행동으로 보지 않습니다."
      )}</p>
      <p>${tr(
        "Tetrapodomorphs include tetrapods and the fishes most closely related to them. Finding a tetrapodomorph fossil does not mean the animal had already come onto land. Some structures were already present in aquatic relatives and later did different work. Evolution is not an animal designing its body for a future goal.",
        "四足形类包括四足动物，以及与它们亲缘关系最近的鱼类。找到四足形类化石，并不等于发现了已经上岸的动物。有些结构可能在水生近亲中已经出现，后来在新的环境里承担不同的工作。演化不是生物为了未来的目标而设计身体。",
        "사지형류는 사지동물과, 그들과 가장 가까운 물고기를 포함합니다. 사지형류 화석을 찾았다고 그 동물이 이미 육지에 올라온 것은 아닙니다. 어떤 구조는 물속 친척에게 이미 있었고, 나중에 다른 일을 맡기도 합니다. 진화는 미래의 목표를 위해 몸이 설계되는 일이 아닙니다."
      )}</p>`
    )}
    ${sheet(
      tr("Materials You Can Use", "可用材料", "쓸 수 있는 자료"),
      `<p>${tr(
        "Your teacher names two fossils, casts, or models that can be compared. You may look at the jaw, the braincase, a fin, or the way bones connect.",
        "导师指定两件可以比较的化石、复制品或三维模型。可以看颌、脑颅、鳍，或骨骼的连接方式。",
        "교사가 비교할 화석, 복제품 또는 모델 두 점을 지정합니다. 턱, 뇌머리뼈, 지느러미, 또는 뼈가 연결되는 방식을 볼 수 있습니다."
      )}</p>`
    )}
    ${sheet(
      tr("What To Do", "操作步骤", "하는 방법"),
      `<p>${tr(
        "Name each material, where it came from, and its age. Say which side you are looking at. Draw the corresponding parts and label the names and the direction.",
        "写下每件材料的名称、来源和年代，以及你观察的方向。把相对应的结构画出来，标明名称和方向。",
        "각 자료의 이름, 출처, 시대와 관찰 방향을 적습니다. 대응하는 구조를 그리고 이름과 방향을 표시합니다."
      )}</p>`
    )}
    <form class="sheet" data-form="anatomy">
      <h2>${tr("Comparison Table", "解剖比较表", "해부 비교표")}</h2>
      <div class="grid grid-2">
        <div><h3>${tr("Material A", "材料 A", "자료 A")}</h3>
          ${box("aName", tr("Name, Source, Age", "名称、来源、年代", "이름, 출처, 시대"))}
          ${box("aPart", tr("Part And Direction", "观察部位与方向", "부위와 방향"))}
          ${box("aShape", tr("Shape And Connections You Can See", "可见的形状与连接", "보이는 모양과 연결"))}
        </div>
        <div><h3>${tr("Material B", "材料 B", "자료 B")}</h3>
          ${box("bName", tr("Name, Source, Age", "名称、来源、年代", "이름, 출처, 시대"))}
          ${box("bPart", tr("Part And Direction", "观察部位与方向", "부위와 방향"))}
          ${box("bShape", tr("Shape And Connections You Can See", "可见的形状与连接", "보이는 모양과 연결"))}
        </div>
      </div>
      ${box("same", tr("What Matches", "相似之处", "비슷한 점"))}
      ${box("different", tr("What Does Not Match", "不同之处", "다른 점"))}
      <h2>${tr("Evidence And Explanation", "证据与解释", "증거와 설명")}</h2>
      ${box("claim", tr("Your Suggestion, And How Strong The Evidence Is", "推测，以及证据有多强", "추정과 증거의 세기"))}
      ${box("next", tr("Which Difference Is Worth Studying Next, And Why?", "哪一个差异最值得继续研究？为什么？", "어떤 차이를 다음에 연구할 가치가 있나? 왜?"))}
      <h2>${tr("What Is Still Uncertain", "不确定性", "아직 불확실한 점")}</h2>
      ${box("limit", tr("What You Cannot Yet Say", "还不能下的结论", "아직 말할 수 없는 것"))}
      ${saveRow()}
    </form>
    <div id="draw-anatomy"></div>
    <p><a class="btn btn-primary" href="#/ct">${tr("Next: Inside With CT", "下一章：用 CT 看见内部", "다음: CT로 안을 보기")}</a></p>`;
}

function digitalPage() {
  return `
    <p class="kicker">04 · ${tr("Look Inside", "数字探秘", "디지털 탐구")}</p>
    <h1>${tr("Seeing Inside A Fossil With CT", "用 CT 看见化石内部", "CT로 화석의 안을 보기")}</h1>
    <p class="intro-band">${tr(
      "The work goes in this order: the fossil or specimen, a CT scan of the inside, segmentation that picks out the structures, a 3D reconstruction that turns those structures into a model, a restoration that says how missing or crushed parts were handled, and then comparison. A digital model is not a finished truth that the computer produces on its own.",
      "研究流程：化石或标本 → CT扫描（获取内部影像）→ 图像分割（辨认目标结构）→ 三维重建（获得空间模型）→ 科学复原（明确处理缺失或变形的依据）→ 比较与分析。数字模型不是自动生成的“完整真相”。",
      "순서는 이렇습니다. 화석이나 표본을 보고, CT로 내부를 찍고, 영상에서 볼 구조를 나누고, 그 구조로 3차원 모델을 만든 다음, 없거나 찌그러진 부분을 어떻게 다루었는지 밝혀 복원하고, 다른 자료와 비교합니다. 디지털 모델은 컴퓨터가 알아서 만들어 주는 완전한 실물이 아닙니다."
    )}</p>
    ${learnPath([
      [tr("From The Last Chapter", "上一章留下", "앞 장에서"), tr("A part you can find on two specimens. CT asks what that part looks like inside.", "两件标本上都能找到的一个部位。CT 问的是这个部位里面是什么样。", "두 표본에서 찾을 수 있는 부위. CT는 그 부위의 안이 어떤지 묻습니다.")],
      [tr("This Chapter", "这一章回答", "이 장이 답하는 것"), tr("What a photograph, a slice, and a model each show, and what a person added.", "照片、切片和模型各自显示什么，以及哪些是人加上的。", "사진, 단면, 모델이 각각 무엇을 보여 주는지, 그리고 사람이 더한 것.")],
      [tr("You Leave With", "写下带走", "적어서 가져가기"), tr("Three marks: preserved, segmented, inferred.", "三种标记：保存、分割、推测。", "세 가지 표시: 보존, 분할, 추정.")]
    ])}
    ${fig(
      "./public/assets/media/ct-workflow.webp",
      tr("A CT scanner and slices through a fish head", "CT 扫描仪和鱼头切片", "CT 스캐너와 물고기 머리 단면"),
      tr("Lecture page 12. Scanner and slices.", "讲座第12页。扫描仪和切片。", "강의 12쪽. 스캐너와 단면.")
    )}
    ${fig(
      "./public/assets/media/digital-pipeline.webp",
      tr("From a specimen to a restoration", "从标本到复原", "표본에서 복원까지"),
      tr("Lecture page 16. From preparation to restoration.", "讲座第16页。从修理到复原。", "강의 16쪽. 처리에서 복원까지.")
    )}
    ${fig(
      "./public/assets/media/ct-lab-rebuild.webp",
      tr("One fish head as a fossil, a scan, and a coloured model", "同一件鱼头的化石、扫描和彩色模型", "같은 물고기 머리의 화석, 스캔, 색 모델"),
      tr("The same head: fossil, scan, coloured model.", "同一件头骨：化石、扫描、分色模型。", "같은 머리: 화석, 스캔, 색 모델.")
    )}
    <section class="sheet" id="sort-ct">
      <h2>${tr("Put The Path In Order", "把这条路径按顺序排好", "경로를 순서대로")}</h2>
      <p class="sort-path" data-sort-path></p>
      <p data-sort-prompt></p>
      <div class="cta-row" data-sort-choices></div>
      <p class="caption" data-sort-note></p>
    </section>
    ${notes([
      [
        tr("The Scan Is The First Step", "扫描只是第一步", "스캔은 첫 단계"),
        tr(
          "A 2023 account of Lu Jing’s work says the pictures have to be segmented and rebuilt before a structure can be studied. The same account recalls that the Parayunnanolepis girdle looked different after CT than it had from the outside.",
          "2023 年关于卢静工作的介绍说：图像要经过分割和重建，结构才能被研究。同一篇介绍也写到，副云南鱼的腰带在 CT 之后与外部观察不同。",
          "루징의 작업에 대한 2023년 글은 구조를 연구하려면 영상을 분할하고 다시 구성해야 한다고 합니다. 같은 글은 파라윈난올레피스의 허리띠가 CT 뒤에 겉과 달라 보였다고 합니다."
        ),
        "https://www.ivpp.ac.cn/kxcb/kpdt/202305/t20230522_6760357.html",
        tr("Open The Article", "打开这篇介绍", "글 열기")
      ]
    ])}
    ${sheet(
      tr("Research Question", "研究问题", "연구 질문"),
      `<p>${tr(
        "What can a photograph, a CT slice, and a 3D model each show about the same part? A digital model is not an automatically complete truth.",
        "同一部位上，照片、CT 切片和三维模型分别能显示什么？数字模型不是自动生成的完整真相。",
        "같은 부위에 대해 사진, CT 단면, 3차원 모델은 각각 무엇을 보여 주는가? 디지털 모델은 저절로 완성된 진실이 아닙니다."
      )}</p>
      <p>${tr(
        "The path is: fossil or specimen, CT scan, segmentation, 3D reconstruction, scientific restoration that states how missing or deformed parts were handled, then comparison. If there is no CT data you can operate, use the prepared slices and model views.",
        "研究顺序是：化石或标本，CT 扫描，图像分割，三维重建，写明缺失或变形如何处理的科学复原，然后比较。如果现场没有可以操作的 CT 数据，就用准备好的切片图和模型截图。",
        "순서는 화석 또는 표본, CT 스캔, 영상 분할, 3차원 재구성, 없거나 변형된 부분을 어떻게 다루었는지 밝힌 과학적 복원, 그리고 비교입니다. 직접 다룰 CT 데이터가 없으면 준비된 단면과 모델 화면을 사용합니다."
      )}</p>`
    )}
    ${sheet(
      tr("Materials You Can Use", "可用材料", "쓸 수 있는 자료"),
      `<p>${tr(
        "Use the fish data your teacher provides and has permission to use. Pick one part you can find in the photograph, the slice, and the model. The models below are for practice. They are not the fossils from this trip.",
        "使用导师提供并且已经获得使用许可的古鱼数据。选择一个能在照片、切片和模型里对上的部位。下面的模型是练习材料，不是这次考察的化石。",
        "교사가 제공하고 사용 허락이 있는 고대 어류 자료를 사용합니다. 사진, 단면, 모델에서 서로 찾을 수 있는 부위 하나를 고릅니다. 아래 모델은 연습 자료이며 이번 답사의 화석이 아닙니다."
      )}</p>
      <div id="fossil-room"></div>`
    )}
    ${sheet(
      tr("What To Do", "操作步骤", "하는 방법"),
      `<p>${tr(
        "For the same structure, write what you actually see and what you still cannot judge. On the sketch, use three kinds of marks: preserved in the fossil, recognised by segmentation, and filled in from comparative anatomy.",
        "对同一结构，写下你实际看到的，以及还不能判断的。草图上用三种标记区分：化石里直接保存的、分割时识别出来的、根据比较解剖补上的。",
        "같은 구조에 대해 실제로 본 것과 아직 판단할 수 없는 것을 적습니다. 스케치에는 세 가지 표시를 씁니다. 화석에 직접 보존된 것, 분할로 인식한 것, 비교해부학으로 채운 것."
      )}</p>`
    )}
    <form class="sheet" data-form="digital">
      <h2>${tr("Digital Observation Record", "数字观察记录", "디지털 관찰 기록")}</h2>
      ${box("photoSee", tr("Photograph: What You See", "标本照片：我实际看到了什么", "표본 사진: 실제로 본 것"))}
      ${box("photoLimit", tr("Photograph: What You Cannot Yet Judge", "标本照片：还不能判断什么", "표본 사진: 아직 판단할 수 없는 것"))}
      ${box("sliceSee", tr("CT Slice: What You See", "CT 切片：我实际看到了什么", "CT 단면: 실제로 본 것"))}
      ${box("sliceLimit", tr("CT Slice: What You Cannot Yet Judge", "CT 切片：还不能判断什么", "CT 단면: 아직 판단할 수 없는 것"))}
      ${box("modelSee", tr("3D Model: What You See", "三维模型：我实际看到了什么", "3차원 모델: 실제로 본 것"))}
      ${box("modelLimit", tr("3D Model: What You Cannot Yet Judge", "三维模型：还不能判断什么", "3차원 모델: 아직 판단할 수 없는 것"))}
      <h2>${tr("Evidence And Explanation", "证据与解释", "증거와 설명")}</h2>
      ${box("direct", tr("Preserved In The Fossil", "直接保存的结构", "화석에 직접 보존된 구조"))}
      ${box("segmented", tr("Recognised By Segmentation", "分割识别的结构", "분할로 인식한 구조"))}
      ${box("inferred", tr("Filled In From Other Evidence", "根据比较等依据补全的部分", "다른 증거로 채운 부분"))}
      <h2>${tr("What Is Still Uncertain", "不确定性", "아직 불확실한 점")}</h2>
      ${box("basis", tr("Why You Judged It This Way, And What Is Still Uncertain", "判断依据，以及仍不确定的地方", "이렇게 판단한 이유와 아직 불확실한 점"))}
      ${saveRow()}
    </form>
    <div id="draw-digital"></div>
    <p><a class="btn btn-primary" href="#/explain">${tr("Next: Explain A Discovery", "下一章：解释发现", "다음: 발견 설명")}</a> <a class="btn btn-ghost" href="#/watch">${tr("Watch The CT Films", "去看 CT 影片", "CT 영상 보기")}</a></p>`;
}

function explainPage() {
  return `
    <p class="kicker">04</p>
    <h1>${tr("Explain A Discovery", "解释发现", "발견 설명")}</h1>
    ${sheet(
      tr("Research Question", "研究问题", "연구 질문"),
      `<p>${tr(
        "A useful question can be answered with the photographs, notes, slices, or models you actually have. It is not a question you can answer only by imagining.",
        "一个好的问题，应当能用你现场得到的照片、记录、切片或模型来回答，而不是只能靠想象。",
        "좋은 질문은 실제로 가진 사진, 기록, 단면 또는 모델로 답할 수 있어야 합니다. 상상만으로 답하는 질문이 아닙니다."
      )}</p>
      <ul>
        <li>${tr("What can the outside photograph and the CT slice of one fish show that the other cannot?", "某件古鱼的外部照片和 CT 切片，分别能显示哪些不同的解剖信息？", "한 물고기의 겉 사진과 CT 단면은 서로 다른 어떤 해부 정보를 보여 주는가?")}</li>
        <li>${tr("What differences can you see in the shape or the connections of the same bone in two fishes?", "两种古鱼的同一块骨骼，在形状或连接方式上有哪些看得见的差异？", "두 물고기의 같은 뼈는 모양이나 연결에서 어떤 차이가 보이는가?")}</li>
        <li>${tr("Can a fish fossil alone tell you the environment? What other evidence would you need?", "仅凭鱼化石能否判断沉积环境？还需要哪些其他证据？", "물고기 화석만으로 퇴적 환경을 판단할 수 있는가? 다른 어떤 증거가 필요한가?")}</li>
      </ul>`
    )}
    ${sheet(
      tr("Materials You Can Use", "可用材料", "쓸 수 있는 자료"),
      `<p>${tr(
        "Use the field card, the comparison drawing, and the digital record you have already saved.",
        "使用你已经保存的野外观察卡、解剖比较图和数字观察记录。",
        "이미 저장한 야외 관찰 카드, 해부 비교 그림, 디지털 관찰 기록을 사용합니다."
      )}</p>`
    )}
    ${sheet(
      tr("What To Do", "操作步骤", "하는 방법"),
      `<p>${tr(
        "An observation says what is there: “There is a curved boundary on the model.” An explanation says what you think it means: “This may be the contact between two bones.” The explanation has to say why, and what else it might be.",
        "观察写那里有什么：“模型上有一条弧形边界。”解释写你认为它意味着什么：“这可能是两块骨骼之间的接触边界。”解释必须说明为什么这样判断，以及还可能是什么。",
        "관찰은 있는 것을 말합니다. “모델에 굽은 경계가 있다.” 설명은 그것이 뜻한다고 생각하는 것을 말합니다. “두 뼈가 만나는 경계일 수 있다.” 설명에는 이유와 다른 가능성이 있어야 합니다."
      )}</p>`
    )}
    <form class="sheet" data-form="explain">
      <h2>${tr("Question Table", "研究问题表", "연구 질문표")}</h2>
      ${box("question", tr("The Question Your Group Chooses", "小组选择的问题", "모둠이 고른 질문"))}
      ${box("materials", tr("What Materials Do You Have?", "我们有什么材料？", "어떤 자료가 있나?"))}
      ${box("method", tr("How Will You Compare Them?", "准备如何比较？", "어떻게 비교할 것인가?"))}
      ${box("result", tr("What Did You Actually Observe?", "实际观察结果", "실제 관찰 결과"))}
      <h2>${tr("Evidence And Explanation", "证据与解释", "증거와 설명")}</h2>
      ${box("explanation", tr("Your Explanation, And The Evidence For It", "解释，以及支持它的证据", "설명과 그것을 받치는 증거"))}
      <h2>${tr("What Is Still Uncertain", "不确定性", "아직 불확실한 점")}</h2>
      ${box("uncertainty", tr("What Is Still Uncertain?", "仍有哪些不确定性？", "아직 불확실한 것은?"))}
      ${saveRow()}
    </form>
    <p><a class="btn btn-primary" href="#/output">${tr("Take This To The Record And Poster", "把这些带到记录与海报", "이것을 기록과 포스터로")}</a></p>`;
}

function recordPage() {
  const line = (name, label) => box(name, label);
  const day = (n, title) => `
    <h3>${title}</h3>
    ${line(`d${n}a`, tr("What is the most important piece of evidence you observed today?", "今天最重要的一条观察证据是什么？", "오늘 가장 중요한 관찰 증거는 무엇인가?"))}
    ${line(`d${n}b`, tr("What idea did you change today?", "今天修正了什么想法？", "오늘 어떤 생각을 고쳤는가?"))}
    ${line(`d${n}c`, tr("What do you still need to check?", "还要查证什么？", "아직 무엇을 확인해야 하는가?"))}`;
  return `
    <p class="kicker">${tr("One Record For The Whole Trip", "整个行程用同一份记录", "답사 전체의 한 기록")}</p>
    <h1>${tr("Record And Poster", "记录与海报", "기록과 포스터")}</h1>
    <p class="lede">${tr(
      "The same page holds the trip. First the observation sheet and the three sentences for each day. Then the six parts of the poster. What you save here is what My Work shows.",
      "这一页把整个行程收在一起。先写观察表和每天三句话，再写海报的六个板块。这里保存的，就是我的成果里看到的。",
      "이 페이지가 답사 전체를 모읍니다. 먼저 관찰표와 매일 세 문장, 그다음 포스터의 여섯 칸. 여기에 저장한 것이 내 결과에 나타납니다."
    )}</p>
    <form class="sheet" data-form="log">
      <h2>${tr("Record Sheet", "记录表", "기록표")}</h2>
      ${box("who", tr("Group, Recorder, Date", "小组、记录人、日期", "모둠, 기록한 사람, 날짜"))}
      ${box("place", tr("Place, Bed, Display, Or Data Source", "地点、岩层、展品或资料来源", "장소, 지층, 전시품 또는 자료 출처"))}
      ${box("number", tr("Specimen Number, Bed, And Age If Known", "材料编号、地层、年代（知道时再写）", "자료 번호, 지층, 시대(알 때만)"))}
      ${box("kind", tr("Bed, Specimen, Cast, Photograph, CT, Or 3D Model", "岩层、标本、复制品、照片、CT 或三维模型", "지층, 표본, 복제품, 사진, CT 또는 3차원 모델"))}
      ${box("scale", tr("Direction, Scale, And File Number", "观察方向、比例尺、文件编号", "방향, 축척, 파일 번호"))}
      <h2>${tr("Observation Only", "只写观察", "관찰만")}</h2>
      ${box("observation", tr("Shape, Position, Boundary, Texture, Or Connection", "形状、位置、边界、纹理或连接关系", "모양, 위치, 경계, 질감 또는 연결"))}
      <h2>${tr("Evidence And Explanation", "证据与解释", "증거와 설명")}</h2>
      ${box("explanation", tr("What might these observations mean, and what is the evidence?", "这些观察可能说明什么？证据是什么？", "이 관찰은 무엇을 뜻할 수 있으며, 증거는 무엇인가?"))}
      <h2>${tr("What Is Still Uncertain", "不确定性", "아직 불확실한 점")}</h2>
      ${box("unsure", tr("What you are not sure about, or what an expert needs to confirm", "不确定的内容，或需要专家确认的问题", "확실하지 않은 것, 또는 전문가가 확인해 주어야 할 질문"))}
      ${box("sources", tr("Sources of the photographs, models, and papers", "照片、模型和论文的来源", "사진, 모델, 논문의 출처"))}
      ${day(1, tr("Day 1", "第 1 天", "1일"))}
      ${day(2, tr("Day 2", "第 2 天", "2일"))}
      ${day(3, tr("Day 3", "第 3 天", "3일"))}
      ${saveRow()}
    </form>
    <div id="draw-log"></div>
    ${posterForm()}`;
}

function posterPage() {
  return recordPage();
}

function posterForm() {
  const check = (name, label) => `<label class="check"><input type="checkbox" name="${name}" /> ${label}</label>`;
  return `
    <h2>${tr("From The Record To The Poster", "从记录到海报", "기록에서 포스터로")}</h2>
    <p>${tr(
      "Six parts. The results say what you found. The interpretation says how you read the results. If you use someone else’s conclusion, name the source.",
      "六个板块。结果写你实际发现了什么。解释写你如何理解这些结果。引用别人的研究结论时，必须写出来源。",
      "여섯 칸입니다. 결과는 실제로 발견한 것을 적습니다. 해석은 그 결과를 어떻게 읽었는지 적습니다. 다른 사람의 결론을 쓰면 출처를 밝힙니다."
    )}</p>
    <form class="sheet" data-form="poster">
      <h2>${tr("The Six Parts", "六个板块", "여섯 칸")}</h2>
      ${box("q", tr("Title And Research Question", "题目与研究问题", "제목과 연구 질문"))}
      ${box("source", tr("Materials And Sources", "材料与来源", "자료와 출처"))}
      ${box("method", tr("How You Observed, Measured, Or Compared", "观察方法", "관찰 방법"))}
      ${box("result", tr("Results: Photographs, Sketches, Tables, And What You Saw", "结果：照片、草图、比较表和直接看到的事实", "결과: 사진, 스케치, 비교표, 직접 본 사실"))}
      ${box("conclusion", tr("Interpretation And Limits", "解释与结论，以及局限", "해석과 결론, 그리고 한계"))}
      ${box("refs", tr("Papers, Labels, Your Teacher’s Notes, And Picture Sources", "参考资料：论文、展签、导师说明和图片来源", "참고 자료: 논문, 전시 라벨, 교사 설명, 그림 출처"))}
      <h2>${tr("Check Before You Present", "展示前自查", "발표 전 점검")}</h2>
      ${check("ck1", tr("Our conclusion has direct evidence.", "我们的结论有直接证据支持。", "우리 결론에는 직접 증거가 있다."))}
      ${check("ck2", tr("We separated our own observations from published conclusions.", "我们区分了自己的观察和别人发表的结论。", "우리 관찰과 발표된 결론을 구분했다."))}
      ${check("ck3", tr("Each figure names what it shows, where it came from, and the scale where one is needed.", "每张图都有对象、来源，以及需要的比例信息。", "각 그림에 대상, 출처, 필요한 축척이 있다."))}
      ${check("ck4", tr("We stated at least one uncertainty.", "我们说明了至少一项不确定性。", "불확실한 점을 적어도 하나 적었다."))}
      ${check("ck5", tr("Every member can explain one core piece of evidence.", "每位成员都能解释一条核心证据。", "모든 구성원이 핵심 증거 하나를 설명할 수 있다."))}
      <h2>${tr("A Question From Another Group", "听完其他小组后想继续研究的问题", "다른 모둠을 들은 뒤 계속 연구하고 싶은 질문")}</h2>
      ${box("peer", tr("The question you want to keep investigating", "我想继续研究的问题", "계속 연구하고 싶은 질문"))}
      <div class="work-zones">
        <section class="zone zone-save">
          <h3>${tr("Save Here", "保存在这里", "여기에 저장")}</h3>
          <p>${tr("This keeps the draft in My Work on this browser, and writes a trace on the study server.", "草稿留在这台浏览器的「我的成果」里，同时在学习服务器留下一条记录。", "초안은 이 브라우저의 내 결과에 남고, 학습 서버에 기록이 남습니다.")}</p>
          <button type="button" class="btn btn-primary" data-keep>${tr("Save", "保存", "저장")}</button>
          <p class="caption" data-kept hidden></p>
        </section>
        <section class="zone zone-file">
          <h3>${tr("Download A File", "下载成文件", "파일로 내려받기")}</h3>
          <p>${tr("This makes a text file on your computer. It does not change the saved draft.", "在你的电脑上生成一份文字文件。不会改动已保存的草稿。", "컴퓨터에 글 파일을 만듭니다. 저장한 초안은 바뀌지 않습니다.")}</p>
          <button type="button" class="btn btn-ghost" data-download>${tr("Download The Text", "下载文字", "글 내려받기")}</button>
        </section>
        <section class="zone zone-canva">
          <h3>${tr("Lay Out In Canva", "去 Canva 排版", "Canva에서 배치")}</h3>
          <p>${tr("In Canva you may change the colour, the type size, and the pictures. Copy the six parts from the saved text. Canva does not write back to this page.", "在 Canva 里可以改颜色、字号和图片。六个板块从已保存的文字抄过去。Canva 不会写回这个页面。", "Canva에서는 색, 글자 크기, 그림을 바꿀 수 있습니다. 여섯 칸은 저장한 글에서 옮깁니다. Canva는 이 페이지에 다시 쓰지 않습니다.")}</p>
          <a class="btn btn-ghost" href="https://www.canva.com/posters/templates/science/" target="_blank" rel="noopener noreferrer">${tr("Open Canva Science Posters", "打开 Canva 科学海报", "Canva 과학 포스터 열기")}</a>
        </section>
      </div>
    </form>`;
}

function termsPage() {
  const terms = [
    ["Fossil", "化石 fossil", "화석 fossil", "The preserved remains, traces, or marks of an ancient organism.", "古代生物的遗体、遗迹或活动痕迹在地质历史中保存下来的记录。", "고대 생물의 몸, 흔적 또는 활동 자국이 지질 시대에 남아 있는 기록."],
    ["Outcrop", "露头", "노두 outcrop", "Rock that you can see at the surface, without digging it out.", "岩石露出地面、可以直接看见的地方。野外说的“露头”就是这个。", "파지 않고 지표에서 바로 볼 수 있는 암석."],
    ["Stratum / Strata", "地层 stratum / strata", "지층 stratum / strata", "A bed, or a set of beds, formed in a particular span of geological time and with particular features.", "在一定地质时期形成、具有特定特征的岩层或岩层组合。", "특정 지질 시대에 만들어지고 특정한 특징을 가진 암석층 또는 암석층의 묶음."],
    ["Matrix", "围岩 matrix", "모암 matrix", "The rock or sediment around a fossil.", "包围或包裹化石的岩石或沉积物。", "화석을 둘러싼 암석 또는 퇴적물."],
    ["Gnathostomes", "有颌类 gnathostomes", "악구류 gnathostomes", "Vertebrates with upper and lower jaws, including most living fishes, all tetrapods, and many extinct fishes.", "具有上下颌的脊椎动物，包括绝大多数现生鱼类、所有四足动物，以及许多已经灭绝的古鱼。", "위아래 턱이 있는 척추동물. 대부분의 현생 어류, 모든 사지동물, 그리고 멸종한 많은 고대 어류를 포함한다."],
    ["Osteichthyans", "硬骨鱼类 osteichthyans", "경골어류 osteichthyans", "A major branch of jawed vertebrates, including ray-finned fishes, lobe-finned fishes, their common ancestors, and related fossils. Humans belong to this branch.", "有颌类的一个重要分支，包括辐鳍鱼类、肉鳍鱼类、它们的共同祖先和相关化石。人类也属于这一分支。", "턱이 있는 척추동물의 큰 갈래. 조기어류, 육기어류, 그들의 공통 조상과 관련 화석을 포함한다. 사람도 이 갈래에 속한다."],
    ["Actinopterygians", "辐鳍鱼类 actinopterygians", "조기어류 actinopterygians", "One of the two main osteichthyan branches. The fins are supported mainly by fin rays. Most living fishes, including carp and goldfish, belong here.", "硬骨鱼类的两大分支之一。鳍主要由鳍条支撑。鲤鱼、鲫鱼、金鱼等绝大多数现生鱼类属于这里。", "경골어류의 두 큰 갈래 중 하나. 지느러미는 주로 지느러미 줄기로 받쳐진다. 잉어, 붕어, 금붕어를 포함한 대부분의 현생 어류가 여기 속한다."],
    ["Sarcopterygians", "肉鳍鱼类 sarcopterygians", "육기어류 sarcopterygians", "The other main osteichthyan branch, including coelacanths, lungfish, tetrapods, and their fossil relatives. Early members had paired fins with substantial internal skeletons.", "硬骨鱼类的另一主要分支，包括空棘鱼、肺鱼、四足动物及其化石近亲。早期鱼类成员的成对鳍有发达的内部骨骼。", "경골어류의 다른 큰 갈래. 실러캔스, 폐어, 사지동물과 그 화석 친척을 포함한다. 초기 어류의 짝지느러미에는 발달한 속뼈가 있었다."],
    ["Tetrapodomorphs", "四足形类 tetrapodomorphs", "사지형류 tetrapodomorphs", "A sarcopterygian branch that includes tetrapods and some ancient fishes more closely related to them. They matter for the study of the move from water to land. A tetrapodomorph is not already an animal on land.", "肉鳍鱼类中的一个分支，包括四足动物，以及与四足动物亲缘关系更近的部分古老鱼类。研究从水到陆时会用到它们。四足形类不等于已经上岸的动物。", "육기어류의 한 갈래로, 사지동물과 그들에 더 가까운 일부 고대 어류를 포함한다. 물에서 육지로의 이동을 연구할 때 중요하다. 사지형류가 곧 이미 육지에 있는 동물은 아니다."],
    ["CT Slice", "CT 切片 CT slice", "CT 단면 CT slice", "An image from X-ray computed tomography that shows one internal section of a fossil.", "用 X 射线计算机断层扫描得到的图像，显示化石内部的一个截面。", "X선 컴퓨터 단층 촬영으로 얻은 영상. 화석 내부의 한 단면을 보여 준다."],
    ["Segmentation", "三维分割 segmentation", "분할 segmentation", "Recognising, marking, and extracting a structure, such as bone, teeth, or a brain cavity, in CT or similar images.", "在 CT 等图像里识别、标记并提取特定结构，例如骨骼、牙齿或脑腔。", "CT 같은 영상에서 뼈, 이, 뇌강 같은 구조를 알아보고 표시하고 골라내는 일."],
    ["3D Reconstruction", "三维重建 3D reconstruction", "3차원 재구성 3D reconstruction", "Building a digital model from CT or similar data so the inside or outside of a fossil can be turned, measured, and examined.", "利用 CT 等数据，把化石内部或外部重建成可以旋转、测量和观察的三维数字模型。", "CT 같은 자료로 화석의 안이나 밖을 돌려 보고 측정하고 관찰할 수 있는 디지털 모델로 만드는 일."],
    ["Digital Restoration", "数字复原 digital restoration", "디지털 복원 digital restoration", "Repairing breaks, shifts, or deformation in a digital fossil, and rebuilding missing parts from scientific evidence.", "用数字方法处理模型中的破损、错位或变形，并根据科学证据重建缺失的结构。", "디지털 화석의 파손, 어긋남, 변형을 다루고, 과학적 증거로 없는 구조를 다시 구성하는 일."],
    ["Scientific Reconstruction", "科学复原 scientific reconstruction", "과학적 복원 scientific reconstruction", "A suggestion of the original body or outline, based on the fossil and comparative anatomy, which keeps the preserved parts distinct from the inferred parts.", "根据化石证据和比较解剖学，推测古生物原来的身体结构或外形，并明确区分真实保存的部分和推测的部分。", "화석 증거와 비교해부학으로 원래의 몸 구조나 외형을 추정하되, 보존된 부분과 추정한 부분을 분명히 구분하는 일."],
    ["Natural Selection", "自然选择 natural selection", "자연선택 natural selection", "In a given environment, individuals with different heritable traits may survive and reproduce at different rates, so the share of those traits in the population can change over generations.", "在一定环境下，具有不同可遗传特征的个体，生存和繁殖的成功率可能不同，使相关特征在种群中的比例经过许多代发生变化。", "주어진 환경에서 서로 다른 유전 형질을 가진 개체의 생존과 번식 성공이 다를 수 있고, 여러 세대에 걸쳐 그 형질의 비율이 개체군에서 달라질 수 있다."],
    ["Bedding", "层理 bedding", "층리 bedding", "The layering visible in sedimentary rock. It is part of what you record on the field card.", "沉积岩里看得见的成层现象。野外观察卡要记下它。", "퇴적암에서 보이는 층상 구조. 야외 관찰 카드에 적습니다."],
    ["Assemblage", "化石组合 assemblage", "화석 군집 assemblage", "The fossils found together. One fish is not the whole assemblage.", "一起发现的化石。一条鱼不是整个组合。", "함께 발견된 화석들. 물고기 한 마리가 군집 전체는 아닙니다."],
    ["Scale", "比例尺 scale", "축척 scale", "A bar or object in a photograph that lets someone else judge size. Write it with the direction you were looking from.", "照片里用来让别人判断大小的尺子或参照物。和观察方向一起写下。", "다른 사람이 크기를 판단하도록 사진에 넣은 자 또는 기준. 보던 방향과 함께 적습니다."],
    ["Antiarch", "胴甲鱼 antiarch", "갑주어 antiarch", "A placoderm group with a box-like trunk armour. Bothriolepis and Parayunnanolepis are antiarchs. The armour is a structure you can compare. It is not a behaviour.", "盾皮鱼中躯甲呈箱形的一类。沟鳞鱼和副云南鱼都是胴甲鱼。躯甲是可以比较的结构，不是行为。", "몸통 갑옷이 상자 모양인 판피어 무리. Bothriolepis와 Parayunnanolepis가 갑주어입니다. 갑옷은 비교할 수 있는 구조이며 행동이 아닙니다."],
    ["Lochkovian", "洛赫考夫阶 Lochkovian", "로흐코프절 Lochkovian", "The earliest stage of the Devonian. The Xitun vertebrate fauna in the 2024 study is Lochkovian.", "泥盆纪最早的一个阶。2024 年研究里的西屯脊椎动物群属于洛赫考夫阶。", "데본기에서 가장 이른 절. 2024년 연구의 Xitun 척추동물군은 로흐코프절입니다."],
    ["Eifelian", "艾菲尔阶 Eifelian", "아이펠절 Eifelian", "The earlier stage of the Middle Devonian. Bothriolepis zhujiangyuanensis is reported from the Eifelian Shangshuanghe Formation.", "中泥盆世前一个阶。珠江源沟鳞鱼报道于艾菲尔阶上双河组。", "중기 데본기의 앞선 절. Bothriolepis zhujiangyuanensis는 아이펠절 Shangshuanghe층에서 보고되었습니다."],
    ["Formation", "组 formation", "층 formation", "A named body of rock, such as the Xitun Formation or the Kuanti Formation. A formation is not a moment in time by itself. You still write the stage.", "有名称的一套岩石，例如西屯组、关底组。组本身不等于一个时刻，还要写下阶。", "이름이 있는 암석 단위. Xitun층, Kuanti층이 그 예입니다. 층 자체가 시각은 아니므로 절도 적습니다."],
    ["Superposition", "地层叠覆律 superposition", "지층 누중의 법칙 superposition", "In a stack that has not been turned over, the lower bed is older than the bed above it.", "没有被翻转的地层里，下面的一层比上面的一层更老。", "뒤집히지 않은 층에서 아래층이 위층보다 오래되었습니다."],
    ["Holotype", "正型标本 holotype", "정기준표본 holotype", "The single specimen that fixes the name of a species. Parayunnanolepis xitunensis has a named holotype. A picture of another fish is not that specimen.", "用来固定一个种名的那一件标本。西屯副云南鱼有指定的正型标本。另一条鱼的图片不是那一件。", "종의 이름을 고정하는 한 점의 표본. Parayunnanolepis xitunensis에는 정기준표본이 있습니다. 다른 물고기의 그림은 그 표본이 아닙니다."],
    ["Dermal Bone", "膜质骨 dermal bone", "막질골 dermal bone", "Bone that forms in the skin. The plates of an antiarch are dermal bone. They are not the same as the internal skeleton.", "在皮肤里形成的骨。胴甲鱼的骨片是膜质骨，不是内骨骼。", "피부에서 만들어지는 뼈. 갑주어의 골판은 막질골이며 내골격과 다릅니다."],
    ["Endoskeleton", "内骨骼 endoskeleton", "내골격 endoskeleton", "The skeleton inside the body. An earlier reading treated part of the Parayunnanolepis girdle as endoskeleton. CT read those pieces as more dermal bone.", "身体内部的骨骼。副云南鱼腰带的一种早期读法把一部分当成内骨骼。CT 把那些骨片改读为膜质骨。", "몸 안의 골격. Parayunnanolepis 허리띠의 이전 읽기는 일부를 내골격으로 보았습니다. CT는 그 골편을 막질골로 다시 읽었습니다."],
    ["Pelvic Fin", "腹鳍 pelvic fin", "배지느러미 pelvic fin", "The paired fin toward the back of the belly. The 2023 restudy found no room for pelvic fins behind the Parayunnanolepis plates.", "靠后的一对偶鳍。2023 年的再研究认为，副云南鱼那些骨片的后面没有腹鳍的位置。", "배 뒤쪽의 짝지느러미. 2023년 재연구는 Parayunnanolepis 골판 뒤에 배지느러미가 있을 자리가 없다고 봅니다."],
    ["Placoderm", "盾皮鱼类 placoderm", "판피어 placoderm", "An extinct grade of jawed fishes with armour plates. Antiarchs, including Bothriolepis and Parayunnanolepis, are placoderms. Entelognathus is also described as a placoderm.", "已经灭绝的一类有甲的有颌鱼类。沟鳞鱼和副云南鱼所属的胴甲鱼是盾皮鱼类。初始全颌鱼也被描述为盾皮鱼。", "갑옷 골판을 가진 멸종한 악구류. Bothriolepis와 Parayunnanolepis가 속한 갑주어는 판피어입니다. Entelognathus도 판피어로 기술됩니다."],
    ["Crown Group", "冠群 crown group", "왕관군 crown group", "The last common ancestor of the living members of a group, and all of its descendants. A fossil can sit outside that crown and still belong to the wider branch.", "一个类群现生成员的最后共同祖先，以及它的全部后代。一件化石可以在冠群之外，仍属于更大的那一支。", "한 무리의 현생 구성원이 공유하는 마지막 공통 조상과 그 모든 후손. 화석이 왕관군 밖에 있어도 더 큰 갈래에 속할 수 있습니다."],
    ["Stem Group", "干群 stem group", "줄기군 stem group", "Fossil forms closer to a living crown than to other living groups, but outside that crown. A stem fish is not a failed attempt to become the living form.", "比其他现生类群更接近某个冠群、但还在冠群之外的化石。干群不是“没有进化成功”的生物。", "다른 현생 무리보다 어떤 왕관군에 가깝지만 그 왕관군 밖에 있는 화석. 줄기군은 실패한 진화가 아닙니다."],
    ["Ludlow", "罗德洛世 Ludlow", "러들로세 Ludlow", "A later epoch of the Silurian. The 2013 paper places Entelognathus in the late Ludlow. The television programme’s “about 420 million years” is not the same sentence as the paper’s “about 419 million years”.", "志留纪后段的一个世。2013 年的论文把初始全颌鱼放在罗德洛世晚期。电视节目的“约 4.2 亿年”和论文的“约 4.19 亿年”不是同一句话。", "실루리아기 후반의 세. 2013년 논문은 Entelognathus를 후기 러들로에 둡니다. 텔레비전의 “약 4억 2천만 년”과 논문의 “약 4억 1900만 년”은 같은 문장이 아닙니다."],
    ["Kuanti Formation", "关底组 Kuanti Formation", "Kuanti층", "The rock unit near the Xiaoxiang Reservoir in which the 2013 paper places Entelognathus. It is Silurian. It is not the Xitun Formation.", "2013 年论文放置初始全颌鱼的岩石单位，在潇湘水库一带。它属于志留纪，不是西屯组。", "2013년 논문이 Entelognathus를 둔 암석 단위. 샤오샹 저수지 일대입니다. 실루리아기이며 Xitun층이 아닙니다."]
  ];
  return `
    <p class="kicker">${tr("Words And Rules For The Trip", "这次考察用到的词和规则", "이번 답사의 말과 규칙")}</p>
    <h1>${tr("Terms And Safety", "术语与安全", "용어와 안전")}</h1>
    <section class="sheet">
      <h2>${tr("In The Field And In The Laboratory", "野外与实验室", "야외와 실험실")}</h2>
      <p>${tr(
        "Stay in the areas your teacher allows. Do not go near unstable slopes, pits, or loose rock. Follow the arrangements for traffic and weather. Use tools, preparation equipment, and electrical equipment only with a qualified person. Do not collect, take away, swap, or damage a fossil on your own. When you use a photograph or a data file, name the source and the permission.",
        "只在导师允许的区域活动。不靠近危险边坡、采坑和松动的岩体。遵守交通和天气的应急安排。工具、修理设备和电气设备只在专业人员指导下使用。不擅自采集、带走、交换或损坏化石。使用照片和数据时，写明来源和授权。",
        "교사가 허용한 구역에만 있습니다. 위험한 사면, 채굴 구덩이, 느슨한 암석에 가까이 가지 않습니다. 교통과 날씨에 대한 안내를 따릅니다. 도구, 표본 처리 장비, 전기 장비는 자격 있는 사람과 함께만 사용합니다. 화석을 마음대로 채집하거나 가져가거나 바꾸거나 손상하지 않습니다. 사진과 데이터를 쓸 때는 출처와 허락을 밝힙니다."
      )}</p>
    </section>
    <section class="sheet">
      <h2>${tr("Terms", "术语速查", "용어")}</h2>
      <dl class="terms">
        ${terms
          .map(
            ([en, zh, ko, den, dzh, dko]) =>
              `<dt>${tr(en, zh, ko)}</dt><dd>${tr(den, dzh, dko)}</dd>`
          )
          .join("")}
      </dl>
    </section>`;
}

function showUnit(title, id, fields) {
  const data = loadState().units?.[id] || {};
  const lines = fields
    .filter(([key]) => data[key])
    .map(([key, label]) => `<p><strong>${label}</strong><br>${esc(data[key])}</p>`)
    .join("");
  const image = data.drawing ? `<img class="summary-draw" alt="" src="${data.drawing}" />` : "";
  const empty = !lines && !image;
  return `<article class="sheet"><h2>${title}</h2>${
    empty ? `<p>${tr("Nothing saved here yet.", "这里还没有保存的内容。", "아직 저장된 내용이 없습니다.")}</p>` : lines + image
  }</article>`;
}

function minePage() {
  return `
    <p class="kicker">${tr("Saved Work Only", "只显示已保存的成果", "저장된 결과만")}</p>
    <h1>${tr("My Work", "我的成果", "내 결과")}</h1>
    ${showUnit(tr("Field Card", "野外观察卡", "야외 관찰 카드"), "field", [
      ["m1", tr("Material", "材料", "자료")],
      ["place", tr("Place, Date, Weather", "地点、日期、天气", "장소, 날짜, 날씨")],
      ["rock", tr("Rock", "岩层", "암석")],
      ["horizon", tr("Horizon", "层位", "층")],
      ["photo", tr("Photographs", "照片", "사진")],
      ["guess", tr("From The Fish Alone", "仅看鱼化石", "물고기 화석만")],
      ["revised", tr("After More Evidence", "加入其他证据之后", "다른 증거를 더한 뒤")],
      ["unsure", tr("Still Uncertain", "仍不确定", "아직 불확실")]
    ])}
    ${showUnit(tr("Anatomy Comparison", "解剖比较图", "해부 비교"), "anatomy", [
      ["aName", tr("Material A", "材料 A", "자료 A")],
      ["bName", tr("Material B", "材料 B", "자료 B")],
      ["same", tr("Matches", "相似", "비슷함")],
      ["different", tr("Differences", "不同", "차이")],
      ["claim", tr("Explanation", "解释", "설명")],
      ["limit", tr("Uncertainty", "不确定性", "불확실성")]
    ])}
    ${showUnit(tr("Digital Record", "数字观察记录", "디지털 관찰 기록"), "digital", [
      ["photoSee", tr("Photograph", "照片", "사진")],
      ["sliceSee", tr("CT Slice", "CT 切片", "CT 단면")],
      ["modelSee", tr("3D Model", "三维模型", "3차원 모델")],
      ["direct", tr("Preserved", "直接保存", "직접 보존")],
      ["segmented", tr("Segmented", "分割识别", "분할")],
      ["inferred", tr("Inferred", "推测补全", "추정")],
      ["basis", tr("Uncertainty", "不确定性", "불확실성")]
    ])}
    ${showUnit(tr("Group Science Poster", "小组科学海报", "모둠 과학 포스터"), "poster", [
      ["q", tr("Question", "研究问题", "연구 질문")],
      ["source", tr("Materials", "材料与来源", "자료")],
      ["method", tr("Method", "观察方法", "방법")],
      ["result", tr("Results", "结果", "결과")],
      ["conclusion", tr("Interpretation", "解释与局限", "해석")],
      ["refs", tr("Sources", "参考资料", "참고 자료")]
    ])}
    <section class="sheet">
      <h2>${tr("Lay Out The Poster", "排版海报", "포스터 배치")}</h2>
      <p>${tr(
        "The six parts above stay in your saved poster. In Canva you may change the colour, the type size, and the pictures. Copy the question, the materials, the method, the results, the interpretation, and the sources from the saved text. Do not drop any of those six parts.",
        "上面六个板块留在你保存的海报里。在 Canva 中可以改颜色、字号和图片。研究问题、材料、方法、结果、解释和参考资料要从已保存的文字抄过去，这六项都要保留。",
        "위 여섯 칸은 저장한 포스터에 남습니다. Canva에서는 색, 글자 크기, 그림을 바꿀 수 있습니다. 질문, 자료, 방법, 결과, 해석, 출처는 저장한 글에서 옮기고, 여섯 칸을 빼지 않습니다."
      )}</p>
      <p>${tr(
        "Save on the poster page keeps the draft in My Work. Download makes a text file. Canva does not change the draft saved here.",
        "在海报页保存，草稿会留在我的成果里。下载会生成一份文字文件。Canva 不会改动这里保存的草稿。",
        "포스터 페이지에서 저장하면 초안이 내 결과에 남습니다. 내려받기는 글 파일을 만듭니다. Canva는 여기에 저장된 초안을 바꾸지 않습니다."
      )}</p>
      <p><a class="btn btn-primary" href="https://www.canva.com/posters/templates/science/" target="_blank" rel="noopener noreferrer">${tr("Open Canva Science Posters", "打开 Canva 科学海报", "Canva 과학 포스터 열기")}</a></p>
    </section>`;
}

export const pages = {
  "": homePage,
  home: homePage,
  qujing: qujingPage,
  rock: strataPage,
  body: anatomyPage,
  ct: digitalPage,
  play: playPage,
  watch: watchPage,
  trip: tripPage,
  explain: explainPage,
  "task/strata": strataPage,
  "task/anatomy": anatomyPage,
  "task/digital": digitalPage,
  "task/explain": explainPage,
  record: recordPage,
  poster: recordPage,
  output: recordPage,
  terms: termsPage,
  mine: minePage,
  tasks: homePage,
  map: homePage,
  train: strataPage,
  xitun: strataPage,
  compare: anatomyPage,
  lab: digitalPage,
  zhujiang: tripPage,
  sites: tripPage,
  kit: termsPage,
  work: minePage
};

export function mountHandbook(route) {
  mountFront(route);
  if (route === "task/strata" || route === "train" || route === "xitun" || route === "rock") {
    bindForm("field");
    mountStrataCanvas(document.getElementById("strata-game"), {
      title: tr("Mark The Time Sketch", "标出这段时间", "시간 스케치 표시"),
      why: tr(
        "In an undisturbed stack, the lower bed is older. Start at the bottom: Silurian, then Early Devonian, then Middle Devonian. This is a time sketch, not a measured outcrop.",
        "岩层没有被翻过来的时候，下面的一层更老。从最下面点起：志留纪，早泥盆世，然后是中泥盆世。这是时间示意图。",
        "뒤집히지 않은 층에서는 아래층이 더 오래되었습니다. 맨 아래부터 실루리아기, 전기 데본기, 중기 데본기입니다. 이것은 시간 스케치이며 측정한 노두가 아닙니다."
      ),
      wrong: tr(
        "Start with the lowest bed. When the stack has not been turned over, the lower bed is older.",
        "先点最下面的一层。地层没有被翻转时，下面的一层更老。",
        "가장 아래층부터 시작하세요. 층이 뒤집히지 않았다면 아래층이 더 오래되었습니다."
      ),
      done: tr(
        "Silurian, Early Devonian, then Middle Devonian. Do not call every ancient fish a Devonian fish. A tetrapodomorph is not an animal that has already come onto land.",
        "志留纪，早泥盆世，然后是中泥盆世。不要把所有古鱼都称为泥盆纪鱼类。四足形类不等于已经上岸的动物。",
        "실루리아기, 전기 데본기, 그다음 중기 데본기입니다. 모든 고대 물고기를 데본기 물고기라고 부르지 마세요. 사지형류는 이미 육지에 올라온 동물이 아닙니다."
      ),
      resetLabel: tr("Clear And Mark Again", "清空后重标", "지우고 다시 표시"),
      bands: [
        { id: "silurian", label: tr("Silurian", "志留纪", "실루리아기"), color: "#d7c4a3" },
        { id: "early", label: tr("Early Devonian", "早泥盆世", "전기 데본기"), color: "#b7c4a1" },
        { id: "middle", label: tr("Middle Devonian", "中泥盆世", "중기 데본기"), color: "#8fb3ad" }
      ]
    });
    mountDrawBoard(document.getElementById("draw-field"), "field");
  }
  if (route === "task/anatomy" || route === "compare" || route === "body") {
    bindForm("anatomy");
    mountDrawBoard(document.getElementById("draw-anatomy"), "anatomy");
  }
  if (route === "task/digital" || route === "lab" || route === "ct") {
    bindForm("digital");
    mountFossilStage(document.getElementById("fossil-room"));
    mountDrawBoard(document.getElementById("draw-digital"), "digital");
  }
  if (route === "qujing") bindForm("wonder");
  if (route === "watch") bindForm("watch");
  if (route === "task/explain" || route === "explain") bindForm("explain");
  if (route === "record" || route === "poster" || route === "output") {
    bindForm("log");
    mountDrawBoard(document.getElementById("draw-log"), "log");
  }
  if (route === "record" || route === "poster" || route === "output") {
    bindForm("poster");
    const form = document.querySelector('[data-form="poster"]');
    form?.querySelector("[data-download]")?.addEventListener("click", () => {
      const labels = [...form.querySelectorAll("textarea")].map((el) => {
        const name = el.previousElementSibling ? "" : "";
        return el.closest("label")?.childNodes[0]?.textContent?.trim() || el.name;
      });
      const text = [...form.querySelectorAll("textarea")]
        .map((el, index) => `${labels[index]}\n${el.value}\n`)
        .join("\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "group-science-poster.txt";
      link.click();
    });
  }
}
