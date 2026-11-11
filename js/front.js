import { tr } from "./locale.js?v=20";
import { recordUnit } from "./storage.js?v=38";

export function homePage() {
  const steps = [
    ["01", "tone-qujing", tr("Into Qujing", "走进曲靖", "취징으로"), tr("First learn the place and the time. Silurian, Early Devonian, and Middle Devonian are not the same moment.", "先认识地点和时间。志留纪、早泥盆世和中泥盆世不是同一时刻。", "먼저 장소와 시간을 알아봅니다. 실루리아기, 전기 데본기, 중기 데본기는 같은 때가 아닙니다."), "#/qujing"],
    ["02", "tone-rock", tr("Fossils And Beds", "化石与岩层", "화석과 지층"), tr("Then ask how the past was kept. A fossil, the rock around it, and a fish bone are not the same kind of evidence.", "再问过去是怎样留下来的。化石、围岩和一块鱼骨不是同一种证据。", "그다음 과거가 어떻게 남았는지 묻습니다. 화석, 주변 암석, 물고기 뼈는 같은 증거가 아닙니다."), "#/rock"],
    ["03", "tone-body", tr("The Fish Body", "古鱼的身体", "고대 어류의 몸"), tr("Only after the time and the rock are clear do you compare jaws, skulls, or fins.", "时间和岩层清楚之后，才比较颌、头骨或鳍。", "시간과 지층이 분명해진 다음에 턱, 머리뼈, 지느러미를 비교합니다."), "#/body"],
    ["04", "tone-ct", tr("Inside With CT", "用 CT 看见内部", "CT로 안을 보기"), tr("A photograph, a slice, and a model answer different questions. A model is not the fossil.", "照片、切片和模型回答的是不同的问题。模型不是化石。", "사진, 단면, 모델은 서로 다른 것을 보여 줍니다. 모델은 화석이 아닙니다."), "#/ct"]
  ];
  const tasks = [
    ["01", tr("Read The Beds", "读懂岩层", "지층 읽기"), tr("Leave one field card.", "留下一张野外观察卡。", "야외 관찰 카드 한 장을 남깁니다."), "#/rock"],
    ["02", tr("Dissect Ancient Fishes", "解剖古鱼", "고대 어류 해부"), tr("Leave one comparison drawing.", "留下一张解剖比较图。", "해부 비교 그림 한 장을 남깁니다."), "#/body"],
    ["03", tr("Look Inside", "数字探秘", "디지털 탐구"), tr("Leave one digital record.", "留下一份数字观察记录。", "디지털 관찰 기록 한 부를 남깁니다."), "#/ct"],
    ["04", tr("Explain A Discovery", "解释发现", "발견 설명"), tr("Turn the records into the group science poster.", "把这些记录写成小组科学海报。", "이 기록들을 모둠 과학 포스터로 옮깁니다."), "#/explain"]
  ];
  const photos = [
    "./public/assets/media/field-dongpo-panorama.webp",
    "./public/assets/pack/p07-plants.jpg",
    "./public/assets/pack/p02-plates.png",
    "./public/assets/media/ct-workflow.webp"
  ];
  return `
    <section class="cover">
      <img src="./public/assets/media/field-dongpo-panorama.webp" alt="${tr("Beds at Dongpo village, Qujing", "曲靖东坡村的岩层", "취징 둥포촌의 지층")}" />
      <div class="cover-copy">
        <p class="kicker">Yew Chung Yew Wah · ${tr("25–28 November 2026", "2026年11月25日至28日", "2026년 11월 25–28일")}</p>
        <h1>${tr("From What You See To What You Can Defend", "从看见的，到能说明的", "본 것에서 설명할 수 있는 것으로")}</h1>
        <p class="cover-saw">${tr("What you saw.", "我看见了什么。", "무엇을 보았는지.")}</p>
        <p class="cover-mean">${tr("What you think it means.", "我认为它说明什么。", "그것이 무엇을 뜻하는지.")}</p>
      </div>
      <ol class="cover-index">
        ${steps.map(([n]) => `<li>${n}</li>`).join("")}
      </ol>
    </section>
    <section class="home-block">
      <p class="kicker">${tr("Read In This Order", "按这个顺序读", "이 순서로 읽기")}</p>
      <h2>${tr("Four Chapters", "四个章节", "네 개의 장")}</h2>
      <div class="tour-grid">
        ${steps
          .map(
            ([n, , title, body, href], index) =>
              `<a class="tour-card" href="${href}" style="background-image:url('${photos[index]}')"><span>${n}</span><strong>${title}</strong><small>${body}</small></a>`
          )
          .join("")}
      </div>
    </section>
    <section class="home-block">
      <p class="kicker">${tr("What You Hand In", "你要交出来的", "제출할 것")}</p>
      <h2>${tr("Four Field Tasks", "四项科考任务", "네 가지 탐사 과제")}</h2>
      <div class="task-stage">
        ${tasks
          .map(
            ([n, title, body, href]) =>
              `<a href="${href}"><span>${n}</span><strong>${title}</strong><small>${body}</small></a>`
          )
          .join("")}
      </div>
    </section>
    <section class="film-band">
      <div>
        <p class="kicker">${tr("Lead Film", "先导片", "선도 영상")}</p>
        <h2>${tr("From The Quarry To A Prepared Fish", "从采石场到清修出来的鱼", "채석장에서 정리된 물고기까지")}</h2>
        <p>${tr(
          "Play it here. Then read the four chapters in order.",
          "就在这里播放。看完再按顺序读四章。",
          "여기서 재생하세요. 본 다음 네 장을 순서대로 읽습니다."
        )}</p>
      </div>
      <video controls playsinline preload="metadata" poster="./public/assets/media/field-dongpo-panorama.webp" src="./public/assets/pack/lead.mp4"></video>
    </section>
    <section class="home-out">
      <a href="#/output"><strong>${tr("Record And Poster", "记录与海报", "기록과 포스터")}</strong><span>${tr("The sheet, the three daily sentences, then the six poster parts.", "观察表、每天三句话，然后是海报的六个板块。", "관찰표, 매일 세 문장, 그다음 포스터의 여섯 칸.")}</span></a>
      <a href="#/play"><strong>${tr("Try It", "试一试", "해 보기")}</strong><span>${tr("Sort time, evidence, and explanation. Then open an outside game and keep it separate.", "先分时间、证据和解释。再打开外面的游戏，并把它和这次考察分开。", "시간, 증거, 설명을 먼저 나누고, 바깥 게임을 열 때는 이번 답사와 구분합니다.")}</span></a>
      <a href="#/watch"><strong>${tr("Watch", "看一看", "보기")}</strong><span>${tr("Public films and the papers beside them. A film is not your field note.", "公开影片和旁边的论文。影片不是你的野外记录。", "공개 영상과 그 옆의 논문. 영상은 당신의 야외 기록이 아닙니다.")}</span></a>
      <a href="#/trip"><strong>${tr("Itinerary", "行程", "일정")}</strong><span>${tr("What you bring, what you do, and what you leave on each day.", "每一天带进去的、做的、留下来的。", "매일 가져가는 것, 하는 일, 남기는 것.")}</span></a>
    </section>`;
}

export function qujingPage() {
  return `
    <p class="kicker">01 · ${tr("Before The Field", "去野外之前", "야외로 나가기 전에")}</p>
    <h1>${tr("Into Qujing, More Than Four Hundred Million Years Ago", "走进四亿多年前的曲靖", "4억 년보다 더 전인 취징으로")}</h1>
    <p class="intro-band">${tr(
      "Qujing is called the kingdom of ancient fishes because of the fossils found here. Silurian and Devonian fossils from this area are key evidence for how early jawed vertebrates, bony fishes, and their relatives evolved. Fossils from different places and different beds did not live at the same time. Check where a fossil came from, and how old that bed is, before you compare it with another.",
      "曲靖因丰富而重要的古鱼化石而被称为“古鱼类王国”。这里的志留纪—泥盆纪化石记录，为研究早期有颌类、硬骨鱼类及相关脊椎动物的演化提供了重要证据。不同地点、不同地层的化石并非生活在同一时间，比较之前必须核对产地和年代。",
      "취징은 이곳에서 나온 중요한 물고기 화석 때문에 ‘고대 어류의 왕국’이라고 불립니다. 이 지역의 실루리아기와 데본기 화석은 턱이 있는 초기 척추동물과 경골어류가 어떻게 진화했는지 보여주는 중요한 증거입니다. 장소와 지층이 다르면 살던 시대도 다릅니다. 비교하기 전에 어디서 나왔는지, 그 지층이 얼마나 오래된 것인지를 먼저 확인하세요."
    )}</p>
    <figure class="figure">
      <img src="./public/assets/pack/p08-display.jpg" alt="${tr("A museum wall of fish fossils beside a model of a living fish", "展墙上的许多鱼化石，旁边有一条现生鱼的模型", "물고기 화석이 걸린 전시 벽과 현생 물고기 모형")}" />
      <figcaption>${tr(
        "Museum wall of fish fossils, plus a living-fish model. Not this trip’s specimen.",
        "展墙上的鱼化石和现生鱼模型。不是这次的标本。",
        "물고기 화석 전시 벽과 현생 모형. 이번 답사의 표본이 아닙니다."
      )}</figcaption>
    </figure>
    <ol class="learn-path">
      <li><strong>${tr("Three Times", "三个时代", "세 시대")}</strong><small>${tr("Silurian, then Early Devonian, then Middle Devonian. They are not the same age.", "先是志留纪，然后是早泥盆世，再是中泥盆世。不是同一个时代。", "실루리아기, 그다음 전기 데본기, 그다음 중기 데본기. 같은 시대가 아닙니다.")}</small></li>
      <li><strong>${tr("Place First", "先写地点", "장소를 먼저")}</strong><small>${tr("Write the place and the bed before you compare any bones.", "先写地点和地层，再比较骨头。", "뼈를 비교하기 전에 장소와 지층을 적습니다.")}</small></li>
      <li><strong>${tr("One Question", "一个问题", "질문 하나")}</strong><small>${tr("Leave a question you can check with a photograph or a specimen.", "留下一个能用照片或标本核对的问题。", "사진이나 표본으로 확인할 수 있는 질문을 남깁니다.")}</small></li>
    </ol>
    <p>${tr(
      "Keep the three days apart. Dongpo is Silurian, the oldest of the three. Guiyu and Entelognathus come from that time. On 26 November you go to Xitun, in the Early Devonian. Fishes published from the Xitun Formation include Parayunnanolepis, Youngolepis, Diabolepis and Psarolepis. On 27 November you go to the Pearl River Source, in the Middle Devonian. The Bothriolepis found there is younger than the Xitun fishes. A tetrapodomorph has some features later seen in animals with legs, but it was still a fish living in water. It had not moved onto land.",
      "按三天来记就清楚了。东坡最早，是志留纪，梦幻鬼鱼和初始全颌鱼属于这里。26日去西屯，西屯组是早泥盆世，这里发表过副云南鱼、杨氏鱼、奇异鱼和斑鳞鱼。27日去珠江源，是中泥盆世，那里的沟鳞鱼比西屯的鱼晚。四足形类的身体有一点像后来长了腿的动物，但它还是生活在水里的鱼，不是已经上岸的动物。",
      "사흘로 나눠 기억하면 됩니다. 둥포가 가장 이르고 실루리아기입니다. Guiyu와 Entelognathus는 이 시대의 물고기입니다. 26일에는 Xitun으로 갑니다. Xitun층은 전기 데본기이고, 여기서 발표된 물고기에는 Parayunnanolepis, Youngolepis, Diabolepis, Psarolepis가 있습니다. 27일에는 주강 발원지로 갑니다. 중기 데본기이고, 이곳의 Bothriolepis는 Xitun의 물고기보다 늦습니다. 사지형류는 나중에 다리가 있는 동물과 비슷한 점이 조금 있지만, 아직 물속에 살던 물고기입니다. 이미 육지로 올라온 동물이 아닙니다."
    )}</p>
    <figure class="figure"><img src="./public/assets/media/field-dongpo-panorama.webp" alt="${tr("Beds at Dongpo village, Qujing", "曲靖东坡村的岩层", "취징 둥포촌의 지층")}" /><figcaption>${tr("Dongpo village. Silurian beds. Lecture page 10.", "东坡村，志留纪岩层。讲座第10页。", "둥포촌, 실루리아기 지층. 강의 10쪽.")}</figcaption></figure>
    <figure class="figure"><img src="./public/assets/external/guiyu-bw.jpg" alt="${tr("Restoration of Guiyu oneiros", "梦幻鬼鱼复原图", "Guiyu oneiros 복원도")}" /><figcaption>${tr("Guiyu restoration, late Silurian. Not the fossil. CC BY 3.0.", "梦幻鬼鱼复原，志留纪晚期。不是化石。CC BY 3.0。", "Guiyu 복원, 후기 실루리아기. 화석이 아닙니다. CC BY 3.0.")} <a href="https://commons.wikimedia.org/wiki/File:Guiyu_BW.jpg" target="_blank" rel="noopener noreferrer">${tr("Source", "来源", "출처")}</a></figcaption></figure>
    <div class="time-stack">
      <article><span>${tr("Older", "更早", "더 이전")}</span><strong>${tr("Silurian", "志留纪", "실루리아기")}</strong><p>${tr("Qujing already had jawed fishes. Do not call every ancient fish a Devonian fish.", "曲靖这时已经有长着上下颌的鱼。不要把所有古鱼都叫成泥盆纪的鱼。", "이때 취징에는 이미 턱이 있는 물고기가 있었습니다. 모든 고대 물고기를 데본기 물고기라고 부르지 마세요.")}</p></article>
      <article><span>${tr("Then", "然后", "그다음")}</span><strong>${tr("Early Devonian", "早泥盆世", "전기 데본기")}</strong><p>${tr("The fishes at Xitun belong here. Write the name of the bed, not only “Devonian”.", "西屯的鱼在这一段。要写下地层的名字，不能只写“泥盆纪”。", "Xitun의 물고기는 이 시대입니다. “데본기”만 쓰지 말고 지층 이름을 적으세요.")}</p></article>
      <article><span>${tr("Later", "更晚", "더 나중")}</span><strong>${tr("Middle Devonian", "中泥盆世", "중기 데본기")}</strong><p>${tr("The Pearl River Source is later. A tetrapodomorph fossil is not an animal that already lived on land.", "珠江源更晚。找到四足形类化石，不等于那只动物已经住在陆地上。", "주강 발원지는 더 나중입니다. 사지형류 화석을 찾았다고 그 동물이 이미 육지에 살았던 것은 아닙니다.")}</p></article>
    </div>
    <div class="note-list">
      <article class="note"><h3>${tr("Two Silurian Fishes, Two Papers", "两条志留纪的鱼，两篇论文", "실루리아기 물고기 둘, 논문 둘")}</h3><p>${tr(
        "Two fishes from the late Silurian at Qujing, both older than Xitun. Guiyu, Zhu and others, Nature, 2009: some bones look like older jawed fishes, and the big scales look like later bony fishes. Entelognathus, Zhu and others, Nature, 2013: a placoderm from the Kuanti Formation. That paper says about 419 million years ago, and describes jaw bones that bony fishes also have. A later discovery can change a sentence that says “the oldest”. Neither fish is from Xitun.",
        "这两条鱼都生活在曲靖的志留纪晚期，比西屯更早。梦幻鬼鱼，朱敏等，《自然》，2009：它有的骨头像更早的有颌鱼，大鳞片又像后来的硬骨鱼。初始全颌鱼，朱敏等，《自然》，2013：关底组的盾皮鱼。论文写的是大约 4.19 亿年前，并写到硬骨鱼也有的颌骨。以后如果有新发现，“最古老”这种话就要改。这两条都不是西屯的鱼。",
        "둘 다 취징의 후기 실루리아기 물고기로, Xitun보다 이릅니다. Guiyu, Zhu 등, Nature, 2009: 어떤 뼈는 더 이른 악구류와 닮고, 큰 비늘은 나중 경골어류와 닮습니다. Entelognathus, Zhu 등, Nature, 2013: Kuanti층의 판피어. 논문은 약 4억 1900만 년 전이라고 하고, 경골어류도 가진 턱뼈를 적습니다. 나중 발견은 “가장 오래됨”이라는 말을 바꿀 수 있습니다. 둘 다 Xitun의 물고기가 아닙니다."
      )}</p><p><a href="https://doi.org/10.1038/nature07855" rel="noopener noreferrer">${tr("Guiyu, 2009", "鬼鱼，2009", "Guiyu, 2009")}</a> · <a href="https://doi.org/10.1038/nature12617" rel="noopener noreferrer">${tr("Entelognathus, 2013", "初始全颌鱼，2013", "Entelognathus, 2013")}</a></p></article>
    </div>
    <section class="sheet" id="place-game">
      <h2>${tr("Match The Place To The Time", "把地点和时代对上", "장소와 시대를 맞추기")}</h2>
      <p data-place-prompt></p>
      <div class="cta-row" data-place-choices></div>
      <p class="caption" data-place-note></p>
    </section>
    <form class="sheet" data-form="wonder">
      <h2>${tr("One Question You Want To Follow", "你想追问的一个问题", "따라가고 싶은 질문 하나")}</h2>
      <p>${tr(
        "Make it a question you can test with a photograph, a note, a slice, or a model.",
        "把它写成一个能用照片、记录、切片或模型来检验的问题。",
        "사진, 기록, 단면 또는 모델로 확인할 수 있는 질문으로 만드세요."
      )}</p>
      <label>${tr("The question", "这个问题", "질문")}<textarea name="question" rows="3"></textarea></label>
      <button type="button" class="btn btn-primary" data-keep>${tr("Save", "保存", "저장")}</button>
      <p class="caption" data-kept hidden></p>
    </form>
    <p><a class="btn btn-primary" href="#/rock">${tr("Next: How The Past Was Kept", "下一章：过去怎样被保存", "다음: 과거가 어떻게 남았나")}</a></p>`;
}

export function playPage() {
  return `
    <p class="kicker">${tr("Practice Before You Claim", "下结论之前先练一练", "말하기 전에 연습")}</p>
    <h1>${tr("Try It", "试一试", "해 보기")}</h1>
    <section class="sheet" id="sentence-game">
      <h2>${tr("Observation Or Explanation", "观察还是解释", "관찰인가 설명인가")}</h2>
      <p data-sentence></p>
      <div class="cta-row">
        <button type="button" class="btn btn-ghost" data-kind="see">${tr("I Can See This", "这是我能看见的", "이것은 보이는 것")}</button>
        <button type="button" class="btn btn-ghost" data-kind="mean">${tr("This Is A Reading", "这是一种解释", "이것은 해석")}</button>
      </div>
      <p class="caption" data-sentence-note></p>
    </section>
    <section class="sheet" id="time-game">
      <h2>${tr("Stack The Fishes By Time", "按时间把鱼叠起来", "시간 순서로 물고기를 쌓기")}</h2>
      <p>${tr(
        "Two of these fishes are both late Silurian. Either of those two may come first. Then the Early Devonian fish, then the Middle Devonian fish. Putting them in time does not make one the ancestor of the next.",
        "其中两条都是志留纪晚期的鱼，这两条谁先谁后都可以。然后是早泥盆世的鱼，再是中泥盆世的鱼。按时间排好，并不等于前一条是后一条的祖先。",
        "둘은 모두 후기 실루리아기입니다. 그 둘의 순서는 어느 쪽이든 됩니다. 그다음 전기 데본기, 그리고 중기 데본기입니다. 시간 순서가 조상이 되는 것은 아닙니다."
      )}</p>
      <div class="card-game" data-time-choices></div>
      <p data-time-stack></p>
      <p class="caption" data-time-note></p>
    </section>
    <section class="sheet">
      <h2>${tr("Dinosaurs, Much Later", "恐龙是很久以后的事", "공룡은 훨씬 나중입니다")}</h2>
      <p>${tr(
        "Mesoris is a free guide to Mesozoic life, mostly dinosaurs. Dinosaurs lived long after every fish on this trip. Open it if you are curious. Do not take a dinosaur fact from it and write it onto a fish from Qujing.",
        "Mesoris 是一份中生代生物图鉴，里面主要是恐龙。恐龙生活的时代比这次要看的鱼晚很多。想看可以打开。不要把恐龙的说法写到曲靖的鱼身上。",
        "Mesoris는 중생대 생물을 모아 둔 도감이고, 대부분은 공룡입니다. 공룡이 살던 때는 이번 답사의 물고기보다 훨씬 뒤입니다. 궁금하면 열어서 보세요. 거기서 본 공룡 이야기를 취징의 물고기에 옮겨 적지는 마세요."
      )}</p>
      <p><a class="btn btn-primary" href="https://mesoris.com" target="_blank" rel="noopener noreferrer">${tr("Open Mesoris", "打开 Mesoris", "Mesoris 열기")}</a></p>
      <p><a class="btn btn-ghost" href="./public/assets/pack/r06-fossil-dice.pdf" target="_blank" rel="noopener noreferrer">${tr("Fossil Dice Sheet", "化石骰子", "화석 주사위")}</a></p>
    </section>
    <p><a href="#/ct">${tr("Or return to the models in Look Inside.", "或者回到数字探秘里的模型。", "또는 디지털 탐구의 모델로 돌아갑니다.")}</a></p>`;
}

export function watchPage() {
  const films = [
    [
      tr("Entelognathus, From Qujing", "曲靖的初始全颌鱼", "취징의 엔텔로그나투스"),
      tr(
        "China Central Television, January 2025, episode 4 of Life’s Miracle in the Rocks. The programme places Entelognathus in Qujing about 420 million years ago, in the Silurian, and describes a flat body and a small eye. The sentence about what it ate is the programme’s narration. It is not your observation.",
        "中央电视台，2025年1月，《5亿年 岩石里的生命奇迹》第4集。节目把初始全颌鱼放在约4.2亿年前的曲靖，属于志留纪，并描述扁平的身体和很小的眼睛。关于它吃什么的句子是节目的解说，不是你的观察。",
        "중국중앙텔레비전, 2025년 1월, 《5억 년, 바위 속의 생명》 4회. 프로그램은 엔텔로그나투스를 약 4억 2천만 년 전 취징의 실루리아기에 두고, 납작한 몸과 작은 눈을 설명합니다. 먹이에 대한 문장은 프로그램의 내레이션이며 당신의 관찰이 아닙니다."
      ),
      "https://tv.cctv.com/2025/01/12/VIDETFTLqADTA71rDiav8wkg250112.shtml",
      tr("Open The Episode", "打开这一集", "이 회 열기")
    ],
    [
      tr("CT Of Parayunnanolepis", "副云南鱼的 CT", "파라윈난올레피스의 CT"),
      tr(
        "The IVPP page on the 2023 girdle restudy includes two films: the fossil CT beside a three-dimensional restoration, and a life restoration. The page credits 拟石科技. Watch for the difference between the scan and the restored outline. That account places the fish in the Early Devonian Xitun Formation, about 410 million years ago.",
        "古脊椎所 2023 年关于腰带再研究的页面里有两段影片：化石 CT 与三维复原对照，以及生活复原。页面写明由拟石科技制作。看的时候区分扫描和复原出的轮廓。该文把这条鱼放在早泥盆世西屯组，约 4.1 亿年前。",
        "2023년 허리띠 재연구에 대한 IVPP 페이지에는 영상 두 편이 있습니다. 화석 CT와 3차원 복원의 대조, 그리고 생활 복원. 페이지는 拟石科技가 만들었다고 밝힙니다. 스캔과 복원한 윤곽의 차이를 보세요. 그 글은 이 물고기를 약 4억 1천만 년 전 전기 데본기 시툰층에 둡니다."
      ),
      "http://ivpp.cas.cn/xwdt/kyjz/202301/t20230105_6596074.html",
      tr("Open The IVPP Page", "打开古脊椎所页面", "IVPP 페이지 열기")
    ],
    [
      tr("What CT Does Not Hand You", "CT 不会直接交给你的东西", "CT가 바로 주지 않는 것"),
      tr(
        "A 2023 account of Lu Jing’s work says a CT scan is only the first step. The pictures have to be segmented and rebuilt before a structure can be studied. The same account recalls that the Parayunnanolepis girdle looked different after CT than it had from the outside.",
        "2023 年关于卢静工作的一篇介绍说：CT 扫描只是第一步。图像还要经过分割和重建，结构才能被研究。同一篇介绍也回顾了副云南鱼的腰带在 CT 之后与外部观察不同。",
        "루징의 작업에 대한 2023년 글은 CT 스캔이 첫 단계일 뿐이라고 합니다. 구조를 연구하려면 영상을 분할하고 다시 구성해야 합니다. 같은 글은 파라윈난올레피스의 허리띠가 CT 뒤에 겉모습과 달라 보였다고 회고합니다."
      ),
      "https://www.ivpp.ac.cn/kxcb/kpdt/202305/t20230522_6760357.html",
      tr("Open The Article", "打开这篇介绍", "글 열기")
    ],
    [
      tr("Read The Paper Beside The Film", "看影片时对照论文", "영상을 볼 때 논문과 대조"),
      tr(
        "The Nature paper on Entelognathus is Zhu and colleagues, 2013. It places the fish in the Kuanti Formation, late Ludlow, about 419 million years ago, and describes the jaw bones. The 2009 Nature paper on Guiyu is the one that discusses the mix of girdle, fin spine, and scales. A film can say about 420 million years. Write down which number came from which source.",
        "初始全颌鱼的《自然》论文是朱敏等，2013。论文把它放在关底组、罗德洛世晚期、约 4.19 亿年前，并描述了颌骨。2009 年关于梦幻鬼鱼的《自然》论文讨论胸带、鳍棘和鳞片怎样混在一起。影片可以说约 4.2 亿年。写下哪个数字来自哪一份材料。",
        "Entelognathus의 Nature 논문은 Zhu 등, 2013입니다. 관디층, 후기 러들로, 약 4억 1900만 년 전으로 두고 턱뼈를 기술합니다. Guiyu에 대한 2009년 Nature 논문이 가슴띠, 지느러미 가시, 비늘의 섞임을 다룹니다. 영상은 약 4억 2천만 년이라고 할 수 있습니다. 어느 숫자가 어느 자료에서 왔는지 적으세요."
      ),
      "https://doi.org/10.1038/nature12617",
      tr("Open The 2013 Paper", "打开 2013 年的论文", "2013년 논문 열기")
    ]
  ];
  return `
    <p class="kicker">${tr("Public Films", "公开影片", "공개 영상")}</p>
    <h1>${tr("Watch, Then Come Back To Your Own Record", "看完，再回到你自己的记录", "보고 나서 자신의 기록으로")}</h1>
    <figure class="figure film-card">
      <video class="fit" controls preload="metadata" src="./public/assets/external/entelognathus-recon.webm"></video>
      <figcaption>${tr(
        "Entelognathus model, 2023. Not the fossil. CC BY-SA 4.0.",
        "初始全颌鱼模型，2023。不是化石。CC BY-SA 4.0。",
        "Entelognathus 모델, 2023. 화석이 아닙니다. CC BY-SA 4.0."
      )} <a href="https://commons.wikimedia.org/wiki/File:Video_of_the_3D_reconstruction_of_Entelognathus_primordialis.webm" target="_blank" rel="noopener noreferrer">${tr("File Page", "文件页", "파일 페이지")}</a></figcaption>
    </figure>
    <figure class="figure film-card">
      <video class="fit" controls playsinline preload="metadata" src="./public/assets/pack/v01-entelognathus.mp4"></video>
      <figcaption>${tr(
        "Entelognathus model from the student pack. Not the fossil.",
        "资源包里的初始全颌鱼模型。不是化石。",
        "학생 자료의 Entelognathus 모델. 화석이 아닙니다."
      )}</figcaption>
    </figure>
    <p class="lede">${tr(
      "Next, open the institute page. It has two films about the Xitun fish Parayunnanolepis, made by 拟石科技. Film 1 puts the CT next to a restoration. Film 2 shows the fish as if it were alive. Colour and swimming were added by the makers. They are not what you see at the outcrop.",
      "接着打开古脊椎所的页面。上面有两段西屯副云南鱼的影片，拟石科技制作。第一段把 CT 和复原放在一起。第二段是鱼活着时可能的样子。颜色和游动是制作时加上的，不是露头上能看见的。",
      "이어서 연구소 페이지를 여세요. Xitun의 Parayunnanolepis 영상 두 편이 있고, 拟石科技가 만들었습니다. 첫째는 CT와 복원을 나란히 두고, 둘째는 살아 있을 때의 모습입니다. 색과 헤엄은 만든 사람이 넣은 것이며, 노두에서 보이는 것이 아닙니다."
    )}</p>
    <div class="film-list">
      <article class="film-card">
        <h2>${tr("Two Films On The Institute Page", "研究所页面上的两段影片", "연구소 페이지의 영상 두 편")}</h2>
        <p>${tr(
          "Film 1 places the CT beside the restoration. Look for edges that exist in the scan and edges that appear only on the restored fish. Film 2 is the life restoration. Colour, swimming, and the water around the fish belong to that restoration. They are not observations from the Xitun outcrop. The films open on the institute page.",
          "影片 1 把 CT 和复原放在一起。找扫描里有的边界，以及只出现在复原鱼上的边界。影片 2 是生活复原。颜色、游动和周围的水都属于这次复原，不是西屯露头上的观察。两段影片在研究所的页面里播放。",
          "영상 1은 CT와 복원을 나란히 둡니다. 스캔에 있는 경계와, 복원한 물고기에만 나타나는 경계를 찾으세요. 영상 2는 생활 복원입니다. 색, 헤엄, 주변의 물은 그 복원에 속하며 시툰 노두의 관찰이 아닙니다. 두 영상은 연구소 페이지에서 재생됩니다."
        )}</p>
        <p><a class="btn btn-primary" href="https://www.ivpp.ac.cn/xwdt/kyjz/202301/t20230105_6596074.html" rel="noopener noreferrer">${tr("Play The Two Films", "播放这两段影片", "두 영상 재생")}</a></p>
      </article>
    </div>
    <form class="sheet" data-form="watch">
      <h2>${tr("After The Film", "看完以后", "본 다음")}</h2>
      <label>${tr("What I can point to in the film", "影片里我能指出来的", "영상에서 가리킬 수 있는 것")}<textarea name="saw" rows="3"></textarea></label>
      <label>${tr("What is narration or restoration, not my observation", "解说或复原，不是我的观察", "내레이션이나 복원이며, 내 관찰이 아닌 것")}<textarea name="told" rows="3"></textarea></label>
      <label>${tr("What I will check on a specimen, a slice, or a paper", "我要在标本、切片或论文里核对的", "표본, 단면 또는 논문에서 확인할 것")}<textarea name="check" rows="3"></textarea></label>
      <button type="button" class="btn btn-primary" data-keep>${tr("Save", "保存", "저장")}</button>
      <p class="caption" data-kept hidden></p>
    </form>
    <div class="film-list">
      ${films
        .map(
          ([title, body, href, link]) => `
          <article class="film-card">
            <h2>${title}</h2>
            <p>${body}</p>
            <p><a class="btn btn-primary" href="${href}" target="_blank" rel="noopener noreferrer">${link}</a></p>
          </article>`
        )
        .join("")}
    </div>`;
}

export function mountFront(route) {
  if (route === "trip" || route === "sites" || route === "zhujiang") mountDayGame();
  if (route === "qujing") mountPlaceGame();
  if (route === "play") {
    mountSentenceGame();
    mountTimeGame();
  }
  if (route === "rock" || route === "task/strata" || route === "train" || route === "xitun") mountSort("sort-rock", rockRounds());
  if (route === "body" || route === "task/anatomy" || route === "compare") mountSort("sort-body", bodyRounds());
  if (route === "ct" || route === "task/digital" || route === "lab") mountSort("sort-ct", ctRounds());
}

function mountSort(id, rounds) {
  const root = document.getElementById(id);
  if (!root || !rounds.length) return;
  let index = 0;
  const chosen = [];
  const path = root.querySelector("[data-sort-path]");
  const prompt = root.querySelector("[data-sort-prompt]");
  const note = root.querySelector("[data-sort-note]");
  const box = root.querySelector("[data-sort-choices]");
  const writePath = () => {
    if (!path) return;
    const lead = tr("So far: ", "已经排上：", "지금까지: ");
    path.textContent = chosen.length ? lead + chosen.join(" → ") : "";
  };
  const show = () => {
    const round = rounds[index];
    prompt.textContent = round.prompt;
    note.textContent = "";
    box.innerHTML = round.choices
      .map(([key, label]) => `<button type="button" class="btn btn-ghost" data-pick="${key}">${label}</button>`)
      .join("");
    writePath();
  };
  box.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pick]");
    if (!button || index >= rounds.length) return;
    const round = rounds[index];
    if (button.dataset.pick !== round.answer) {
      note.textContent = round.wrong;
      button.classList.add("pick-no");
      return;
    }
    chosen.push(button.textContent.trim());
    writePath();
    index += 1;
    if (index < rounds.length) show();
    else {
      prompt.textContent = round.done;
      box.innerHTML = "";
      note.textContent = "";
      writePath();
      recordUnit(id, { done: "yes" });
    }
  });
  show();
}

function rockRounds() {
  const choices = [
    ["see", tr("I Can See This", "这是我能看见的", "이것은 보이는 것")],
    ["paper", tr("This Comes From A Paper Or A Label", "这来自论文或标签", "이것은 논문이나 라벨")],
    ["guess", tr("This Is My Explanation", "这是我的解释", "이것은 나의 설명")]
  ];
  const wrong = tr(
    "A colour or a bed you can point to is an observation. A sentence from a paper stays a citation. A sea, a behaviour, or a purpose is an explanation.",
    "能指出来的颜色或层理是观察。论文里的句子仍然是引用。海、行为或用途是解释。",
    "가리킬 수 있는 색이나 층리는 관찰입니다. 논문의 문장은 인용으로 남습니다. 바다, 행동, 용도는 설명입니다."
  );
  return [
    { prompt: tr("The rock is grey and splits into thin beds.", "岩石是灰色的，并裂成薄层。", "암석은 회색이고 얇은 층으로 갈라진다."), choices, answer: "see", wrong, done: "" },
    { prompt: tr("The 2024 paper reads the Xitun Formation as a shallow sea.", "2024 年的论文把西屯组读成浅海。", "2024년 논문은 시툰층을 얕은 바다로 읽는다."), choices, answer: "paper", wrong, done: "" },
    { prompt: tr("This one fish shows that the place was the sea.", "这一条鱼说明那里是海。", "이 물고기 한 마리가 그곳이 바다였음을 보여 준다."), choices, answer: "guess", wrong, done: tr("Three sentences, three different jobs. Take the observation to the field card.", "三句话，三种不同的工作。把观察写进野外观察卡。", "세 문장, 세 가지 일. 관찰은 야외 관찰 카드에 적습니다.") }
  ];
}

function bodyRounds() {
  const choices = [
    ["see", tr("A Comparison I Can Draw", "我能画出来的比较", "그릴 수 있는 비교")],
    ["paper", tr("A Published Reading", "已经发表的读法", "이미 발표된 읽기")],
    ["no", tr("A Sentence I Should Not Use", "一句不该用的话", "쓰면 안 되는 문장")]
  ];
  const wrong = tr(
    "Draw a shape you can see. Cite a paper when the sentence is theirs. Do not use a ladder, a future purpose, or land as a fact the fossil did not show.",
    "画你看得见的形状。句子是论文的，就引用论文。阶梯、未来的目的、化石没有显示的陆地，都不要当成事实。",
    "보이는 모양을 그리세요. 문장이 논문의 것이면 논문을 밝히세요. 사다리, 미래의 목적, 화석이 보여 주지 않은 육지는 사실로 쓰지 않습니다."
  );
  return [
    { prompt: tr("Both specimens have a curved plate. I mark the left side and the direction I am looking from.", "两件标本都有一块弯曲的骨片。我标出左侧，以及我观察的方向。", "두 표본에 굽은 판이 있다. 왼쪽과 내가 보는 방향을 표시한다."), choices, answer: "see", wrong, done: "" },
    { prompt: tr("The 2013 paper describes a premaxilla, a maxilla, and a dentary in Entelognathus.", "2013 年的论文描述了初始全颌鱼的前上颌骨、上颌骨和齿骨。", "2013년 논문은 Entelognathus의 전상악골, 상악골, 치골을 기술한다."), choices, answer: "paper", wrong, done: "" },
    { prompt: tr("The fish grew limbs in order to walk on land.", "这条鱼为了上岸走路而长出四肢。", "이 물고기는 육지에서 걷기 위해 다리를 길렀다."), choices, answer: "no", wrong, done: tr("Keep the drawable comparison. Cite the paper. Leave the purpose sentence out of the poster.", "留下能画的比较。引用论文。用途那一句不要写进海报。", "그릴 수 있는 비교는 남기고, 논문은 밝히고, 목적의 문장은 포스터에 넣지 않습니다.") }
  ];
}

function ctRounds() {
  const steps = [
    ["fossil", tr("The fossil in the rock", "岩石里的化石", "암석 속의 화석")],
    ["scan", tr("The CT scan", "CT 扫描", "CT 스캔")],
    ["segment", tr("Segmentation", "图像分割", "영상 분할")],
    ["model", tr("The 3D model", "三维模型", "3차원 모델")],
    ["restore", tr("A restoration that says what was missing", "写明缺失部分的复原", "없는 부분을 밝힌 복원")],
    ["compare", tr("Comparison with another specimen", "和另一件标本比较", "다른 표본과 비교")]
  ];
  const rounds = steps.map((step, index) => ({
    prompt: tr(`Step ${index + 1} of 6. Which comes next?`, `第 ${index + 1} 步，共 6 步。接下来是哪一步？`, `${index + 1}/6단계. 다음은 어느 것입니까?`),
    choices: steps.filter((_, choice) => choice >= index).reverse(),
    answer: step[0],
    wrong: tr(
      "The fossil comes before the scan. The scan comes before the colours. The colours come before the model. The model is still not the restoration.",
      "化石在扫描之前。扫描在上色之前。颜色在模型之前。模型仍然不是复原。",
      "화석이 스캔보다 앞섭니다. 스캔이 색보다 앞섭니다. 색이 모델보다 앞섭니다. 모델은 아직 복원이 아닙니다."
    ),
    done: ""
  }));
  rounds[rounds.length - 1].done = tr(
    "That is the path. On your sketch, mark preserved, segmented, and inferred with three different marks.",
    "这就是那条路径。草图上用三种不同的标记分出保存、分割和推测。",
    "이것이 경로입니다. 스케치에는 보존, 분할, 추정을 서로 다른 표시로 나누세요."
  );
  return rounds;
}

function mountPlaceGame() {
  const root = document.getElementById("place-game");
  if (!root) return;
  const rounds = [
    {
      prompt: tr("Dongpo village, Xiaoxiang vertebrate fauna", "东坡村，潇湘脊椎动物群", "둥포촌, 샤오샹 척추동물군"),
      answer: "silurian"
    },
    {
      prompt: tr("Xitun Formation fishes", "西屯组的鱼", "시툰층의 어류"),
      answer: "early"
    },
    {
      prompt: tr("Bothriolepis at the Pearl River Source", "珠江源的沟鳞鱼", "주강 발원지의 보트리올레피스"),
      answer: "middle"
    }
  ];
  const choices = [
    ["silurian", tr("Silurian", "志留纪", "실루리아기")],
    ["early", tr("Early Devonian", "早泥盆世", "전기 데본기")],
    ["middle", tr("Middle Devonian", "中泥盆世", "중기 데본기")]
  ];
  let index = 0;
  const prompt = root.querySelector("[data-place-prompt]");
  const note = root.querySelector("[data-place-note]");
  const box = root.querySelector("[data-place-choices]");
  const show = () => {
    prompt.textContent = rounds[index].prompt;
    note.textContent = "";
    box.innerHTML = choices
      .map(([id, label]) => `<button type="button" class="btn btn-ghost" data-age="${id}">${label}</button>`)
      .join("");
  };
  box.addEventListener("click", (event) => {
    const button = event.target.closest("[data-age]");
    if (!button) return;
    if (button.dataset.age !== rounds[index].answer) {
      note.textContent = tr(
        "Look again at which bed is older. Dongpo’s Silurian fauna is older than Xitun. Xitun is older than the Pearl River Source fish.",
        "再看哪一层更老。东坡的志留纪动物群早于西屯。西屯早于珠江源的鱼。",
        "어느 층이 더 오래된지 다시 보세요. 둥포의 실루리아기 동물군이 시툰보다 이릅니다. 시툰은 주강 발원지의 어류보다 이릅니다."
      );
      return;
    }
    index += 1;
    if (index < rounds.length) show();
    else {
      prompt.textContent = tr("The three places are in order.", "三个地点的时代已经按顺序对上。", "세 장소의 시대를 순서대로 맞췄습니다.");
      box.innerHTML = "";
      note.textContent = tr(
        "You can take this order to the field card. The chart in the room is the one to copy if it is newer.",
        "这个顺序可以带到野外观察卡。如果现场的年代表更新，就抄现场的那一版。",
        "이 순서를 야외 관찰 카드로 가져갈 수 있습니다. 현장의 연대표가 더 새것이면 그 표를 베낍니다."
      );
      recordUnit("wonder", { places: "silurian-early-middle" });
    }
  });
  show();
}

function mountDayGame() {
  const root = document.getElementById("day-game");
  if (!root) return;
  const rounds = [
    [tr("Write one question a photograph or a model can test.", "写一个能用照片或模型检验的问题。", "사진이나 모델로 확인할 질문 하나를 적는다."), "25"],
    [tr("At Xitun, leave a field card and an anatomy card.", "在西屯留下野外观察卡和解剖卡。", "시툰에서 야외 카드와 해부 카드를 남긴다."), "26"],
    [tr("Keep the Pearl River Source apart from Xitun, then mark preserved, segmented, and inferred.", "把珠江源和西屯分开，再标出保存、分割和推测。", "주강 발원지와 시툰을 구분하고, 보존·분할·추정을 표시한다."), "27"],
    [tr("Six poster parts, then the five checks.", "海报六个板块，然后五项自查。", "포스터 여섯 칸, 그다음 다섯 가지 점검."), "28"]
  ];
  const choices = [
    ["25", tr("25 November, Evening", "11月25日晚", "11월 25일 저녁")],
    ["26", tr("26 November", "11月26日", "11월 26일")],
    ["27", tr("27 November", "11月27日", "11월 27일")],
    ["28", tr("28 November", "11月28日", "11월 28일")]
  ];
  let index = 0;
  const prompt = root.querySelector("[data-day-prompt]");
  const note = root.querySelector("[data-day-note]");
  const box = root.querySelector("[data-day-choices]");
  const show = () => {
    prompt.textContent = rounds[index][0];
    note.textContent = "";
    box.innerHTML = choices.map(([id, label]) => `<button type="button" class="btn btn-ghost" data-day="${id}">${label}</button>`).join("");
  };
  box.addEventListener("click", (event) => {
    const button = event.target.closest("[data-day]");
    if (!button) return;
    if (button.dataset.day !== rounds[index][1]) {
      note.textContent = tr(
        "Read the day again. The question comes first. Xitun is the field card and the anatomy card. The Pearl River Source is the next day. The poster is last.",
        "再读这一天。问题在最前面。西屯留下观察卡和解剖卡。珠江源是下一天。海报在最后。",
        "그날을 다시 읽으세요. 질문이 먼저입니다. 시툰은 관찰 카드와 해부 카드입니다. 주강 발원지는 다음 날입니다. 포스터가 마지막입니다."
      );
      return;
    }
    index += 1;
    if (index < rounds.length) show();
    else {
      prompt.textContent = tr("The four days are in order.", "四天已经按顺序对上。", "나흘을 순서대로 맞췄습니다.");
      box.innerHTML = "";
      note.textContent = tr(
        "Take the question into the first chapter. Take the cards into the beds and the body. Take the two places into the CT chapter. Take all of that into the record and the poster.",
        "把问题带进第一章。把两张卡带进岩层和身体。把两个地点带进 CT 这一章。最后全部带进记录与海报。",
        "질문은 첫 장으로, 두 카드는 지층과 몸으로, 두 장소는 CT 장으로, 마지막에는 기록과 포스터로 가져가세요."
      );
      recordUnit("wonder", { days: "25-26-27-28" });
    }
  });
  show();
}

function mountTimeGame() {
  const root = document.getElementById("time-game");
  if (!root) return;
  const cards = [
    { id: "guiyu", group: 0, label: tr("Guiyu, late Silurian, Qujing", "梦幻鬼鱼，志留纪晚期，曲靖", "Guiyu, 후기 실루리아기, 취징") },
    { id: "ente", group: 0, label: tr("Entelognathus, late Silurian, Kuanti Formation", "初始全颌鱼，志留纪晚期，关底组", "Entelognathus, 후기 실루리아기, 관디층") },
    { id: "para", group: 1, label: tr("Parayunnanolepis, Early Devonian, Xitun", "副云南鱼，早泥盆世，西屯", "Parayunnanolepis, 전기 데본기, 시툰") },
    { id: "both", group: 2, label: tr("Bothriolepis, Middle Devonian, Pearl River Source", "沟鳞鱼，中泥盆世，珠江源", "Bothriolepis, 중기 데본기, 주강 발원지") }
  ];
  const box = root.querySelector("[data-time-choices]");
  const stack = root.querySelector("[data-time-stack]");
  const note = root.querySelector("[data-time-note]");
  let expect = 0;
  const picked = [];
  const draw = () => {
    const left = cards.filter((card) => !picked.includes(card.id));
    box.innerHTML = left
      .map((card) => `<button type="button" class="btn btn-ghost" data-fish="${card.id}">${card.label}</button>`)
      .join("");
    stack.textContent = picked.length
      ? picked.map((id, index) => `${index + 1}. ${cards.find((card) => card.id === id).label}`).join("  ·  ")
      : "";
  };
  box.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fish]");
    if (!button) return;
    const card = cards.find((item) => item.id === button.dataset.fish);
    if (card.group !== expect) {
      note.textContent = tr(
        "The Silurian fishes come before Xitun. Xitun comes before the Pearl River Source. The two Silurian fishes may swap with each other.",
        "志留纪的鱼在西屯之前。西屯在珠江源之前。两条志留纪的鱼可以互换。",
        "실루리아기 어류가 시툰보다 앞섭니다. 시툰은 주강 발원지보다 앞섭니다. 실루리아기 어류 둘은 서로 바꿔도 됩니다."
      );
      return;
    }
    picked.push(card.id);
    note.textContent = "";
    if (!cards.some((item) => item.group === expect && !picked.includes(item.id))) expect += 1;
    if (picked.length === cards.length) {
      box.innerHTML = "";
      note.textContent = tr(
        "The times are in order. None of these fishes is the ancestor of the next one just because it is older.",
        "时间已经按顺序排好。一条鱼更老，并不等于它是下一条的祖先。",
        "시간은 순서대로입니다. 더 오래되었다는 이유만으로 다음 물고기의 조상은 아닙니다."
      );
      recordUnit("wonder", { stack: picked.join("-") });
      return;
    }
    draw();
  });
  draw();
}

function mountSentenceGame() {
  const root = document.getElementById("sentence-game");
  if (!root) return;
  const rounds = [
    [tr("There is a curved boundary on the model.", "模型上有一条弧形边界。", "모델에 굽은 경계가 있다."), "see"],
    [tr("This may be the contact between two bones.", "这可能是两块骨骼相接的地方。", "이것은 두 뼈가 만나는 곳일 수 있다."), "mean"],
    [tr("The close photograph includes a scale.", "近景照片里有比例尺。", "가까운 사진에 축척이 있다."), "see"],
    [tr("The fish grew limbs in order to walk.", "这条鱼为了走路而长出四肢。", "이 물고기는 걷기 위해 다리를 길렀다."), "mean"]
  ];
  let index = 0;
  const line = root.querySelector("[data-sentence]");
  const note = root.querySelector("[data-sentence-note]");
  const show = () => {
    line.textContent = rounds[index][0];
    note.textContent = "";
  };
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button || index >= rounds.length) return;
    if (button.dataset.kind !== rounds[index][1]) {
      note.textContent = tr(
        "If you can point to it in the photograph or on the model, it is an observation. If it says what the thing is for, or what it means, it is an explanation.",
        "如果能在照片或模型上指出来，那是观察。如果是在说它用来做什么，或它意味着什么，那是解释。",
        "사진이나 모델에서 가리킬 수 있으면 관찰입니다. 무엇에 쓰이는지, 무엇을 뜻하는지를 말하면 설명입니다."
      );
      return;
    }
    index += 1;
    if (index < rounds.length) show();
    else {
      line.textContent = tr("You separated the four sentences.", "四句话已经分开。", "네 문장을 나누었습니다.");
      note.textContent = tr(
        "The last one is an explanation, and it is not a mechanism. Natural selection is about heritable differences and which individuals leave offspring.",
        "最后一句是解释，而且它不是机制。自然选择说的是可遗传的差异，以及哪些个体留下后代。",
        "마지막 문장은 설명이며, 메커니즘이 아닙니다. 자연선택은 유전되는 차이와, 어떤 개체가 자손을 남기는지에 대한 것입니다."
      );
    }
  });
  show();
}
