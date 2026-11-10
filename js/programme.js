import { tr } from "./locale.js?v=10";

const DAYS = [
  {
    date: ["25 Nov 2026, Wednesday", "2026年11月25日（星期三）"],
    rows: [
      ["14:00–18:00", ["Arrive in Qujing and check in", "抵达曲靖并办理入住"], ["Atour Hotel, South Gate", "南城门亚朵酒店"], ["Yew Chung Yew Wah", "耀中耀华"]],
      ["18:00–19:00", ["Dinner", "晚餐"], ["", ""], ["", ""]],
      ["19:30–20:30", ["Opening lecture", "开幕讲座"], ["Meeting room, Atour Hotel, South Gate", "南城门亚朵酒店会议室"], ["Chinese Academy of Sciences", "中国科学院（CAS）"]]
    ]
  },
  {
    date: ["26 Nov 2026, Thursday", "2026年11月26日（星期四）"],
    rows: [
      ["07:00–07:30", ["Wake up", "起床"], ["", ""], ["", ""]],
      ["07:30–08:00", ["Breakfast", "早餐"], ["", ""], ["", ""]],
      ["08:00–08:30", ["Coach to the Xitun field station", "乘车前往西屯野外考察站"], ["", ""], ["", ""]],
      ["08:30–09:00", ["Field briefing and collection rules", "野外工作说明与化石采集要求"], ["Xitun Fauna Field Station", "西屯动物群野外考察站"], ["Understand designated areas and specimen handling. Resource: field task list.", "了解指定采集区域及标本处理要求。资源：野外任务清单。"]],
      ["09:00–09:30", ["Visit the station exhibition", "参观野外考察站展馆"], ["", ""], ["Recognise the local fossils and geological setting.", "认识当地化石与地质背景。"]],
      ["09:30–10:15", ["Observe strata and write a field record", "地层观察与野外记录"], ["Xitun fossil site", "西屯化石遗址"], ["Record stratigraphic features and ask a question. Handbook.", "记录地层特征并提出问题。野外科考手册。"]],
      ["10:15–11:30", ["Excavation and collection in designated areas", "在指定区域开展化石发掘与采集"], ["Designated area, Xitun fossil site", "西屯化石遗址指定区域"], ["Record provenance. Handling must follow the permission given on site.", "在指导下采集并记录标本来源。化石采集及标本处置须遵守现场许可和管理规定。"]],
      ["11:30–13:00", ["Lunch and transfer to the Ancient Fish Kingdom Museum", "午餐并前往古鱼王国博物院"], ["", ""], ["", ""]],
      ["13:00–14:00", ["Museum visit", "参观古鱼王国博物院"], ["Ancient Fish Kingdom Museum, Qujing Normal University", "曲靖师范学院古鱼王国博物院"], ["Earth history and the evolution of life. Bilingual notes and handbook.", "了解地球历史与生命演化。双语讲解材料与研学手册。"]],
      ["14:00–15:00", ["Demonstration: 3D reconstruction from CT data", "活动一：基于CT数据的三维重建演示"], ["Ancient Fish Kingdom Museum", "古鱼王国博物院"], ["See how CT data support a reconstruction. CT data and workstations.", "了解CT数据如何支持化石三维重建。CT三维资料与工作站。"]],
      ["15:00–16:00", ["Rotation: CT reconstruction and fossil preparation", "CT三维重建与化石修理分组轮换：第二轮"], ["", ""], ["Museum staff and expert mentors. Two stereomicroscopes on site and two from YCYW; 3D workstations. Groups swap. Preparation uses only material identified and approved for this session.", "博物院工作人员及专家导师。体视显微镜：现场2台，耀中耀华自备2台；三维工作站。两组交换。化石修理仅使用经鉴别并获准用于本环节的材料。"]],
      ["16:00–17:00", ["Organise, number, and label specimens", "标本整理、编号与标签制作"], ["", ""], ["Dr Yan is listed as present throughout this block. Link each specimen to its record.", "颜博士（全程参加）。将标本与采集记录对应。"]],
      ["17:00–18:00", ["Return to the hotel and rest", "返回酒店并休息"], ["", ""], ["Dining venue still to be confirmed in the sheet.", "用餐地点待确认。"]]
    ]
  },
  {
    date: ["27 Nov 2026, Friday", "2026年11月27日（星期五）"],
    rows: [
      ["07:00–08:00", ["Breakfast and departure preparation", "早餐及出发准备"], ["", ""], ["", ""]],
      ["08:00–09:00", ["Coach to the Pearl River Source field area", "乘车前往珠江源野外考察区域"], ["", ""], ["", ""]],
      ["09:00–12:00", ["Sites 4 and 1, the river source, and an optional Matoushan viewpoint", "珠江源4号点与1号点考察；参观珠江源头；马头山观景与环境观察（可选）"], ["Pearl River Source", "珠江源"], ["Record large fish-bone fragments and their context, and compare the two sites. Collection follows on-site instructions.", "记录大型鱼类骨骼化石碎片及其所在环境，比较两处考察点。采集及标本处置按现场指导执行。"]],
      ["12:00–13:00", ["Lunch and rest", "午餐及休息"], ["", ""], ["", ""]],
      ["13:00–14:15", ["Visit the small themed exhibition", "参观主题小展馆"], ["Pearl River Source scenic area", "珠江源景区"], ["Use the exhibition to discuss the move from water to land. Bilingual notes.", "结合展览探讨脊椎动物从水生向陆生的演化。双语讲解材料。"]],
      ["14:15–15:15", ["Fossil preparation under guidance", "化石修理"], ["Ancient-fish fossil hall, Pearl River Source", "珠江源古鱼化石展厅"], ["Expert mentors. Two stereomicroscopes at the workstation and two from YCYW.", "专家导师。在指导下继续观察与修理化石。体视显微镜：工作站2台，耀中耀华自备2台。"]],
      ["15:15–16:00", ["Group discussion: coming ashore, environmental change, and future survival", "小组研究讨论：登陆、环境变化与未来生存"], ["", ""], ["Separate evidence, interpretation, and speculation, and draft a poster question. Handbook and notes.", "区分化石证据、解释与推测，并提出海报研究问题。"]],
      ["16:00–18:00", ["Transfer, check in, and rest", "转场、办理入住及休息"], ["Xiake Caotang, Pearl River Source", "珠江源霞客草堂"], ["Groups of 2–3. Treat agency, environmental pressure, and climate as questions. Do not assume evolution has a conscious purpose.", "每组2–3人。围绕能动性、对环境压力的响应和气候变化提出问题；不预设演化具有有意识的目的。"]]
    ]
  },
  {
    date: ["28 Nov 2026, Saturday", "2026年11月28日（星期六）"],
    rows: [
      ["—", ["Breakfast and presentation preparation. The cleaned sheet does not give this clock time.", "早餐及展示准备。清理后的表未写这一项的钟点。"], ["", ""], ["", ""]],
      ["—", ["Groups submit academic posters", "各组提交学术海报"], ["Meeting room, Xiake Caotang", "珠江源霞客草堂会议室"], ["Submit a poster grounded in field evidence. Groups of 2–3.", "提交基于野外证据的研究海报。每组2–3人。"]],
      ["08:30–10:30", ["Poster presentations, discussion, and feedback", "学术海报展示、讨论与反馈"], ["", ""], ["Explain how evidence supports a conclusion, and what the past does not yet tell us about the future.", "说明证据如何支持结论，并讨论过去对未来的启示。"]],
      ["10:30–11:30", ["Visit the ancient-fish fossil workstation", "参观古鱼化石工作站"], ["Ancient-fish fossil workstation, Pearl River Source", "珠江源古鱼化石工作站"], ["", ""]],
      ["11:30–12:15", ["Lunch", "午餐"], ["", ""], ["", ""]],
      ["12:15–13:00", ["Collect luggage, assemble, and prepare to leave", "领取行李、集合并准备返程"], ["", ""], ["", ""]],
      ["about 13:00", ["Depart", "启程返程"], ["High-speed rail station or airport", "高铁站或机场"], ["", ""]]
    ]
  }
];

export function programmeTable() {
  const i = langIndex();
  const head = tr(
    ["Time", "Activity", "Place", "Note from the sheet"],
    ["时间", "活动", "地点", "表中的备注"]
  );
  const body = DAYS.map((day) => {
    const rows = day.rows
      .map(
        (row) => `<tr>
          <td>${row[0]}</td>
          <td>${row[1][i]}</td>
          <td>${row[2][i]}</td>
          <td>${row[3][i]}</td>
        </tr>`
      )
      .join("");
    return `<tbody><tr class="day"><th colspan="4">${day.date[i]}</th></tr>${rows}</tbody>`;
  }).join("");
  return `<div class="table-wrap"><table class="schedule">
    <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    ${body}
  </table></div>`;
}

const TASKS = [
  ["25 Nov · 19:30–20:30", "11月25日 · 19:30–20:30", "#/train", "Opening lecture: read time, rock, and the difference between observation and explanation. Leave one research question.", "开幕讲座：读时间、岩石，并区分观察和解释。留下一个研究问题。"],
  ["26 Nov · 08:30–09:00", "11月26日 · 08:30–09:00", "#/kit", "Field briefing: safety, the task list, and the rule that you do not collect alone.", "野外说明：安全、任务清单，以及不得独自采集。"],
  ["26 Nov · 09:30–10:15", "11月26日 · 09:30–10:15", "#/xitun", "Xitun strata: decide whether a fish fossil is enough to claim an ancient sea.", "西屯地层：判断一块鱼化石是否足以说明曾经是海。"],
  ["26 Nov · 13:00–14:00", "11月26日 · 13:00–14:00", "#/compare", "Museum visit: compare corresponding structures. Do not call one fossil a direct ancestor.", "博物院：比较对应结构。不要把一件化石写成直接祖先。"],
  ["26 Nov · 14:00–16:00", "11月26日 · 14:00–16:00", "#/lab", "CT demonstration and rotation: label photo, slice, segmentation, and restoration.", "CT 演示与轮换：标出照片、切片、分割和复原。"],
  ["26 Nov · 16:00–17:00", "11月26日 · 16:00–17:00", "#/kit", "Number the record: material, layer, and what still needs an expert.", "给记录编号：材料、层位，以及仍需专家确认的地方。"],
  ["27 Nov · 09:00–12:00", "11月27日 · 09:00–12:00", "#/zhujiang", "Pearl River Source sites: separate material, method, and conclusion. Do not mix these rocks with Xitun.", "珠江源两个点：把材料、方法和结论分开。不要和西屯混记。"],
  ["27 Nov · 15:15–16:00", "11月27日 · 15:15–16:00", "#/compare", "Discussion: rewrite “fish grew limbs in order to walk”. Evolution has no plan.", "讨论：改写“鱼为了上岸长出四肢”。演化没有目的。"],
  ["27 Nov evening", "11月27日晚", "#/work", "Draft the poster from the day’s evidence, limits, and sources.", "用当天的证据、限制和来源起草海报。"],
  ["28 Nov · 08:30–10:30", "11月28日 · 08:30–10:30", "#/work", "Present the poster. Say what the evidence supports and what it does not.", "展示海报。说明证据支持什么，以及还不支持什么。"]
];

export function taskPlan() {
  const i = langIndex();
  return `<ol class="task-plan">${TASKS.map(
    (row) => `<li><a href="${row[2]}"><time>${row[i]}</time><span>${row[i + 3]}</span></a></li>`
  ).join("")}</ol>`;
}

function langIndex() {
  return tr(0, 1);
}
