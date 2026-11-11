const KEY = "qujing-lang";

const BADGES = {
  "时间线观察员": "Timeline Observer",
  "观察解释分界": "Observation Line",
  "环境证据员": "Environment Evidence",
  "证据配对": "Evidence Pairs",
  "反目的论": "Not A Purpose",
  "结构对照": "Matching Structures",
  "分层阅读": "Layered Reading",
  "数字证据层级": "Evidence Level",
  "AI 边界": "AI Boundary",
  "观察卡已备": "Field Card Ready",
  "海报结构": "Poster Structure",
  "每日反思": "Daily Reflection",
  "结构比较表": "Comparison Table",
  "先点最老": "Oldest First",
  "看清模型来源": "Model Labels"
};

export function lang() {
  const value = localStorage.getItem(KEY);
  return value === "zh" || value === "ko" ? value : "en";
}

export function setLang(code) {
  localStorage.setItem(KEY, code === "zh" || code === "ko" ? code : "en");
}

export function tr(en, zh, ko) {
  if (lang() === "zh") return zh ?? en;
  if (lang() === "ko") return ko ?? en;
  return en;
}

export function badgeLabel(name) {
  return BADGES[name] || name;
}

const CHROME = {
  en: {
    skip: "Skip To Content",
    brand: "Paleontology Research Expedition Programme",
    brandSub: "古生物科学研究 · Yew Chung Yew Wah",
    menu: "Menu",
    nav: ["Itinerary", "Into Qujing", "Fossils And Beds", "Ancient Fish Bodies", "Inside With CT", "Record And Poster", "Try It", "Watch"],
    bottom: ["Home", "Days", "Time", "Beds", "Fish", "CT", "Record", "Try", "Watch"],
    terms: "Terms And Safety",
    mine: "My Work",
    privacy: "",
    foot: "Yew Chung Yew Wah · Paleontology Research Expedition Programme",
    teacher: "",
    sources: "",
    privacyLink: "",
    fossil: "",
    docTitle: "Paleontology Research Expedition Programme",
    signTitle: "Write Your Name",
    signNote: "Use your real name and email. This sign-in stays on this browser for 30 days, and the site keeps a record of it.",
    signName: "Real Name",
    signEmail: "Email",
    signGo: "Enter",
    adminToggle: "Admin Sign In",
    studentToggle: "Student Sign In",
    adminTitle: "Admin Sign In",
    adminNote: "This sign-in is checked by the server and kept with the other accounts.",
    adminUser: "Username",
    adminPass: "Password",
    adminGo: "Enter"
  },
  zh: {
    skip: "跳到主要内容",
    brand: "古生物科学研究",
    brandSub: "Paleontology Research Expedition Programme",
    menu: "菜单",
    nav: ["行程", "走进曲靖", "化石与岩层", "古鱼的身体", "用 CT 看见内部", "记录与海报", "趣味练习", "影片"],
    bottom: ["主页", "行程", "时代", "岩层", "身体", "CT", "记录", "练习", "影片"],
    terms: "术语与安全",
    mine: "我的成果",
    privacy: "",
    foot: "耀中耀华 · 古生物科学研究",
    teacher: "",
    sources: "",
    privacyLink: "",
    fossil: "",
    docTitle: "古生物科学研究",
    signTitle: "填写姓名",
    signNote: "填写真实姓名和邮箱。登录会记下来，在这台浏览器上 30 天内不用再填。",
    signName: "真实姓名",
    signEmail: "邮箱",
    signGo: "进入",
    adminToggle: "管理员登录",
    studentToggle: "学生登录",
    adminTitle: "管理员登录",
    adminNote: "用户名和密码由服务器核对，登录会计入后台账户。",
    adminUser: "用户名",
    adminPass: "密码",
    adminGo: "进入"
  },
  ko: {
    skip: "본문으로 이동",
    brand: "고생물학 연구 탐사 프로그램",
    brandSub: "古生物科学研究 · Paleontology Research Expedition Programme",
    menu: "메뉴",
    nav: ["일정", "취징", "화석과 지층", "고대 어류의 몸", "CT로 내부 보기", "기록과 포스터", "연습", "영상"],
    bottom: ["처음", "일정", "시대", "지층", "몸", "CT", "기록", "연습", "영상"],
    terms: "용어와 안전",
    mine: "내 결과",
    privacy: "",
    foot: "Yew Chung Yew Wah · 고생물학 연구 탐사 프로그램",
    teacher: "",
    sources: "",
    privacyLink: "",
    fossil: "",
    docTitle: "고생물학 연구 탐사 프로그램",
    signTitle: "이름 쓰기",
    signNote: "실명과 이메일을 적으세요. 로그인은 기록되고, 이 브라우저에서는 30일 동안 다시 적지 않아도 됩니다.",
    signName: "실명",
    signEmail: "이메일",
    signGo: "들어가기",
    adminToggle: "관리자 로그인",
    studentToggle: "학생 로그인",
    adminTitle: "관리자 로그인",
    adminNote: "아이디와 비밀번호는 서버에서 확인하며, 로그인은 계정 기록에 남습니다.",
    adminUser: "아이디",
    adminPass: "비밀번호",
    adminGo: "들어가기"
  }
};

export function applyChrome() {
  const c = CHROME[lang()];
  document.documentElement.lang = lang() === "zh" ? "zh-CN" : lang() === "ko" ? "ko" : "en";
  document.title = c.docTitle;
  const skip = document.querySelector(".skip-link");
  if (skip) skip.textContent = c.skip;
  const brand = document.querySelector(".brand strong");
  const sub = document.querySelector(".brand small");
  if (brand) brand.textContent = c.brand;
  if (sub) sub.textContent = c.brandSub;
  const menu = document.getElementById("navToggle");
  if (menu) menu.textContent = c.menu;
  const out = document.getElementById("signOut");
  if (out) out.textContent = tr("Sign Out", "退出", "로그아웃");
  document.querySelectorAll(".primary-nav a").forEach((a, i) => {
    if (c.nav[i]) a.textContent = c.nav[i];
  });
  document.querySelectorAll(".bottom-nav a").forEach((a, i) => {
    if (c.bottom[i]) a.textContent = c.bottom[i];
  });
  const terms = document.getElementById("termsLink");
  if (terms) terms.textContent = c.terms;
  const mine = document.getElementById("mineLink");
  if (mine) mine.textContent = c.mine;
  const foot = document.querySelector(".site-foot p");
  if (foot) foot.textContent = c.foot;
  const signTitle = document.getElementById("signTitle");
  if (signTitle) signTitle.textContent = c.signTitle;
  const signNote = document.getElementById("signNote");
  if (signNote) signNote.textContent = c.signNote;
  const signName = document.querySelector("#signName span");
  if (signName) signName.textContent = c.signName;
  const signEmail = document.querySelector("#signEmail span");
  if (signEmail) signEmail.textContent = c.signEmail;
  const signGo = document.getElementById("signGo");
  if (signGo) signGo.textContent = c.signGo;
  const adminToggle = document.getElementById("adminToggle");
  if (adminToggle) adminToggle.textContent = c.adminToggle;
  const studentToggle = document.getElementById("studentToggle");
  if (studentToggle) studentToggle.textContent = c.studentToggle;
  const adminTitle = document.getElementById("adminTitle");
  if (adminTitle) adminTitle.textContent = c.adminTitle;
  const adminNote = document.getElementById("adminNote");
  if (adminNote) adminNote.textContent = c.adminNote;
  const adminUser = document.querySelector("#adminUser span");
  if (adminUser) adminUser.textContent = c.adminUser;
  const adminPass = document.querySelector("#adminPass span");
  if (adminPass) adminPass.textContent = c.adminPass;
  const adminGo = document.getElementById("adminGo");
  if (adminGo) adminGo.textContent = c.adminGo;
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang()));
  });
}
