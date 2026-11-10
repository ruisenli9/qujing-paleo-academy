import { tr } from "./locale.js?v=12";

const card = (title, keep, limit) => ({ title: tr(...title), keep: tr(...keep), limit: tr(...limit) });

export function trainCards() {
  return [
    card(
      ["A Fossil Is Not The Whole Story", "化石不是完整故事", "화석은 전체 이야기가 아니다"],
      ["A fossil can be a body, a part, or a trace. Burial, preservation, exposure, and discovery are a shortened path, and the record is incomplete.", "化石可以是遗体、部分或痕迹。埋藏、保存、出露和发现只是缩短了的过程，记录并不完整。", "화석은 몸, 일부, 또는 흔적일 수 있습니다. 매몰과 보존, 노출, 발견은 짧아진 과정이며 기록은 완전하지 않습니다."],
      ["A restoration is the same object as the fossil.", "复原图就是化石本身。", "복원도가 화석 그 자체라고 말하지 않습니다."]
    ),
    card(
      ["Start With The Sedimentary Rock", "先看沉积岩", "퇴적암부터 본다"],
      ["Grain size, bedding, and the fossils in the rock are the closest clues. An outcrop is rock you can see at the surface. If the stack has not been turned over, the lower bed is usually older.", "颗粒、层理和所含化石是最近的线索。露头是地表能看见的岩石。岩层若没有倒转，下面的通常更老。", "입자, 층리, 암석 속 화석이 가장 가까운 단서입니다. 노두는 지표에서 보이는 암석입니다. 지층이 뒤집히지 않았다면 아래층이 보통 더 오래되었습니다."],
      ["Lower always means older, even when the rocks have been turned over.", "岩层倒转了也仍然下面更老。", "지층이 뒤집혀도 아래가 항상 더 오래되었다고 말하지 않습니다."]
    ),
    card(
      ["Read The Time First", "先读时间", "시간을 먼저 읽는다"],
      ["The Silurian is older than the Devonian. Inside the Devonian the order is Early, Middle, Late. Xitun Formation fishes are Early Devonian. The Pearl River Source tetrapodomorph material in the handbook is Middle Devonian. Use the International Chronostratigraphic Chart.", "志留纪早于泥盆纪。泥盆纪内部是早、中、晚。西屯组的鱼是早泥盆世。手册里的珠江源四足形类材料是中泥盆世。用国际年代地层表。", "실루리아기가 데본기보다 이릅니다. 데본기 안에서는 전기, 중기, 후기 순서입니다. 시툰층의 어류는 전기 데본기입니다. 핸드북의 주강 발원지 사지형류 자료는 중기 데본기입니다. 국제 연대층서표를 사용합니다."],
      ["Every ancient fish is a Devonian fish, or the two Qujing stations are the same age.", "所有古鱼都是泥盆纪鱼，或两个曲靖站点是同一年代。", "모든 고대 어류가 데본기 어류이거나 취징의 두 지점이 같은 시대라고 말하지 않습니다."]
    ),
    card(
      ["Observation Is Not An Explanation", "观察不是解释", "관찰은 해석이 아니다"],
      ["“There is a curved boundary on the model” is an observation. “This may be where two bones meet” is an explanation, and it needs a reason plus another possible reading.", "“模型上有一条弧形边界”是观察。“这可能是两块骨骼相接的地方”是解释，必须说明理由，并承认还有别的读法。", "“모형에 굽은 경계가 있다”는 관찰입니다. “두 뼈가 만나는 곳일 수 있다”는 해석이며, 이유와 다른 가능성을 함께 써야 합니다."],
      ["The explanation is the only possible one.", "这个解释是唯一可能。", "그 해석이 유일한 가능이라고 말하지 않습니다."]
    ),
    card(
      ["A Scale Makes Size Checkable", "比例尺让大小可核对", "축척이 있어야 크기를 확인할 수 있다"],
      ["A scale bar or a familiar object in the photograph lets someone else judge size. Write the direction you were looking from.", "照片里的比例尺或熟悉的参照物，让别人能判断大小。写下你的观察方向。", "사진의 축척 막대나 익숙한 물체가 있어야 다른 사람이 크기를 판단할 수 있습니다. 어느 방향에서 보았는지도 적습니다."],
      ["A size, a species name, or a behaviour from a photograph that has no scale and no source.", "没有比例尺、没有来源的照片就能写出大小、种名或行为。", "축척과 출처가 없는 사진으로 크기, 종 이름, 행동을 단정하지 않습니다."]
    ),
    card(
      ["Safety And The Law", "安全与法律", "안전과 법"],
      ["Stay where the mentor allows. Palaeontological fossils in China are owned by the state. Excavation needs legal permission.", "只待在导师允许的区域。中国的古生物化石属于国家所有。发掘需要法律许可。", "멘토가 허용한 곳에만 머뭅니다. 중국의 고생물 화석은 국가 소유입니다. 발굴에는 법적 허가가 필요합니다."],
      ["You may hammer, collect, remove, or prepare a fossil on your own.", "可以自行敲打、采集、拿走或修理化石。", "혼자 망치질하거나 채집하거나 옮기거나 수리해도 된다고 말하지 않습니다."]
    )
  ];
}

export function xitunCards() {
  return [
    card(
      ["The First Guess", "第一个猜测", "첫 추측"],
      ["“A fish fossil means this was a sea” is a common first reaction. Write it down, then test it.", "“有鱼化石就说明这里曾经是海”是常见的第一反应。先写下，再检验。", "“물고기 화석이 있으니 바다였다”는 흔한 첫 반응입니다. 적고 나서 검증합니다."],
      ["The first reaction is already a conclusion.", "第一反应已经是结论。", "첫 반응이 이미 결론이라고 말하지 않습니다."]
    ),
    card(
      ["What One Fossil Cannot Do", "一件化石做不到的事", "화석 한 점이 할 수 없는 일"],
      ["Fishes live in the sea and in fresh water. A fossil can be moved after death. Preservation changes what you can see.", "鱼既生活在海里，也生活在淡水。化石死后可能被搬运。保存方式会改变你能看见的东西。", "어류는 바다와 민물에 모두 삽니다. 화석은 죽은 뒤 옮겨질 수 있습니다. 보존 상태가 보이는 것을 바꿉니다."],
      ["One fish fossil is enough to prove an ancient sea.", "一件鱼化石就足以证明古代的海。", "물고기 화석 한 점으로 고대의 바다를 증명할 수 있다고 말하지 않습니다."]
    ),
    card(
      ["What The 2024 Study Says", "2024 年研究实际说了什么", "2024년 연구가 실제로 말한 것"],
      ["The IVPP account says sections and geochemical indicators together read the Xitun Formation as generally marine, with three freshening episodes. The main fish beds are linked to the first freshening and to more sediment from land. Cite that source.", "古脊椎所 2024 年的介绍说：剖面和地球化学指标合在一起，把西屯组读成总体海洋环境，并有三次淡化。主要含鱼层与第一次淡化以及更多陆源碎屑有关。要引用这个来源。", "IVPP 2024년 소개는 단면과 지구화학 지표를 합쳐 시툰층을 전반적으로 해양 환경으로 읽고, 담수화 사건이 세 번 있었다고 합니다. 주요 어류층은 첫 담수화와 육지에서 온 퇴적물 증가에 연결됩니다. 그 출처를 밝힙니다."],
      ["You saw the sea in the outcrop, or a fish fossil by itself produced that result.", "你在露头上看见了海，或单凭鱼化石就得出了这个结果。", "노두에서 바다를 보았거나, 물고기 화석만으로 그 결과가 나왔다고 말하지 않습니다."]
    ),
    card(
      ["The Published Assemblage", "已发表的动物群", "발표된 동물군"],
      ["Published accounts describe galeaspids, yunnanolepid antiarchs, and early sarcopterygians and actinopterygians from the Lower Devonian Xitun Formation at Qujing.", "已发表介绍把曲靖下泥盆统西屯组的动物群描述为盔甲鱼、云南鱼类胴甲鱼，以及早期肉鳍鱼和辐鳍鱼。", "발표된 소개는 취징 하부 데본계 시툰층의 동물군을 갈레아스피드, 윈난올레피드 갑주어, 초기 육기어류와 조기어류로 설명합니다."],
      ["That list is permission to collect, or a label you may copy onto a specimen you have not compared.", "这份名单就是采集许可，或可以抄到你还没有比较过的标本上。", "그 목록이 채집 허가이거나, 비교하지 않은 표본에 그대로 붙여도 된다고 말하지 않습니다."]
    ),
    card(
      ["What You Can Record On Site", "现场可以记录什么", "현장에서 기록할 수 있는 것"],
      ["A wide photograph, then a close view with a scale. Colour, grain size, bedding, and which layer holds the fossil.", "先拍全景，再拍带比例尺的近景。记录颜色、颗粒、层理，以及化石在哪一层。", "넓은 사진을 찍고, 축척이 있는 가까운 사진을 찍습니다. 색, 입자, 층리, 화석이 있는 층을 기록합니다."],
      ["Collecting a specimen because you noticed it.", "因为看见了就自行采集。", "보였다는 이유로 표본을 채집하지 않습니다."]
    ),
    card(
      ["Separate The Stations", "两个站点分开记", "두 지점을 나누어 적는다"],
      ["Xitun is Early Devonian. The Pearl River Source fish material used on the next station is Middle Devonian. A note must say which one.", "西屯是早泥盆世。下一站使用的珠江源鱼类材料是中泥盆世。笔记必须写明是哪一个。", "시툰은 전기 데본기입니다. 다음 지점에서 쓰는 주강 발원지 어류 자료는 중기 데본기입니다. 기록에는 어느 쪽인지 밝혀야 합니다."],
      ["A fossil from one day can be filed under the other place.", "把一天的化石记到另一个地点名下。", "어느 날의 화석을 다른 장소 이름으로 적지 않습니다."]
    )
  ];
}

export function zhujiangCards() {
  return [
    card(
      ["A Different Time Slice", "另一个时间切片", "다른 시간 조각"],
      ["Bothriolepis zhujiangyuanensis is reported from the Eifelian, Middle Devonian, Shangshuanghe Formation at Qujing. The Eifelian is a stage inside the Middle Devonian.", "珠江源沟鳞鱼报道于曲靖中泥盆世艾菲尔期上双河组。艾菲尔期是中泥盆世里面的一个期。", "Bothriolepis zhujiangyuanensis는 취징의 중기 데본기 아이펠절 쌍쌍허층에서 보고되었습니다. 아이펠절은 중기 데본기 안의 절입니다."],
      ["It is the same age as the Early Devonian Xitun Formation.", "它和早泥盆世西屯组是同一年代。", "전기 데본기 시툰층과 같은 시대라고 말하지 않습니다."]
    ),
    card(
      ["From A Find To A Paper", "从发现到论文", "발견에서 논문까지"],
      ["The IVPP account says scattered fish fossils were noticed on a path during a 2019 conference excursion. Stratigraphic work, characters from well-preserved specimens, a character matrix, and a tree came after that.", "古脊椎所的介绍说：2019 年会议考察时在步道上注意到分散的鱼化石。之后才有地层工作、从保存较好的标本提取特征、特征矩阵和系统树。", "IVPP 소개에 따르면 2019년 학회 답사 중 길 위에서 흩어진 어류 화석이 보였습니다. 그 다음에 층서 조사, 잘 보존된 표본의 형질, 형질 행렬, 계통수가 이어졌습니다."],
      ["A place name inside the species name means the research is finished.", "种名里有地名，就说明研究已经结束。", "종 이름에 지명이 있으면 연구가 끝났다고 말하지 않습니다."]
    ),
    card(
      ["Three Layers Of The Argument", "论证的三层", "논증의 세 층"],
      ["Material includes seven well-preserved specimens. The method is morphology plus a phylogenetic analysis. One bounded conclusion uses characters such as a slender proximal appendage segment to place it as sister to a Bothriolepis from Kazakhstan, and then discusses Middle Devonian biogeographic links.", "材料包括七件保存较好的标本。方法是形态观察加上系统发育分析。一个有边界的结论是：细长的附肢近节等特征使它与哈萨克斯坦的一种沟鳞鱼构成姐妹群，并据此讨论中泥盆世生物地理联系。", "자료에는 잘 보존된 표본 7점이 포함됩니다. 방법은 형태 관찰과 계통 분석입니다. 경계가 있는 결론 하나는, 가느다란 부속지 근위 마디 같은 형질로 카자흐스탄의 보트리올레피스와 자매군이 되고, 그 결과로 중기 데본기 생물지리 연결을 논의한다는 것입니다."],
      ["That sister-group result proves the whole history of the region.", "这个姐妹群结果证明了该地区的全部历史。", "그 자매군 결과가 지역 전체의 역사를 증명한다고 말하지 않습니다."]
    ),
    card(
      ["Tetrapodomorph Is Not Already On Land", "四足形类不等于已经上岸", "사지형류는 이미 육지에 오른 동물이 아니다"],
      ["The handbook’s Middle Devonian example says the outside can resemble known material while CT still shows internal differences. Tetrapodomorphs include tetrapods and related fishes.", "手册里的中泥盆世例子说：外部可以像已知材料，CT 仍能显示内部差异。四足形类包括四足动物和与它们关系近的鱼类。", "핸드북의 중기 데본기 예는 겉모습이 알려진 자료와 비슷해도 CT는 내부 차이를 보여줄 수 있다고 합니다. 사지형류에는 네발동물과 그에 가까운 어류가 포함됩니다."],
      ["Finding a tetrapodomorph means the animal had already come ashore.", "找到四足形类就说明这种动物已经上岸。", "사지형류를 찾으면 그 동물이 이미 육지에 올랐다고 말하지 않습니다."]
    ),
    card(
      ["Keep The Chain Visible", "把链条留在笔记里", "사슬을 기록에 남긴다"],
      ["On the poster, write material, method, and conclusion on separate lines so a reader can see which sentence depends on which evidence.", "海报上把材料、方法和结论分成三行，让读者看见哪一句话依靠哪一项证据。", "포스터에는 자료, 방법, 결론을 따로 써서 어떤 문장이 어떤 증거에 기대는지 보이게 합니다."],
      ["“Someone found a fish” is a full account of the study.", "“有人发现了一条鱼”就是这项研究的完整说明。", "“누군가 물고기를 발견했다”가 연구의 전부라고 말하지 않습니다."]
    ),
    card(
      ["Do Not Mix The Two Sites", "不要把两个地点混写", "두 장소를 섞지 않는다"],
      ["A sentence about Xitun needs the words Early Devonian and Xitun Formation. A sentence about this fish needs Middle Devonian and Shangshuanghe Formation.", "写西屯必须出现“早泥盆世”和“西屯组”。写这种沟鳞鱼必须出现“中泥盆世”和“上双河组”。", "시툰을 쓸 때는 전기 데본기와 시툰층이 들어가야 합니다. 이 보트리올레피스를 쓸 때는 중기 데본기와 쌍쌍허층이 들어가야 합니다."],
      ["One rock unit name can stand for every Qujing fish.", "一个地层名称可以代表曲靖所有的鱼。", "지층 이름 하나로 취징의 모든 어류를 대표하지 않습니다."]
    )
  ];
}

export function compareCards() {
  return [
    card(
      ["A Complete Fossil Can Still Be Revised", "完整化石仍可被修正", "완전한 화석도 다시 읽을 수 있다"],
      ["The IVPP account describes Parayunnanolepis xitunensis as one of the most complete early antiarchs. A girdle and pelvic-fin reading made from the outside was revised after high-resolution CT.", "古脊椎所的介绍把西屯副云南鱼描述为保存极完整的早期胴甲鱼之一。根据外部作出的腰带和腹鳍解释，在高精度 CT 之后被修正。", "IVPP 소개는 Parayunnanolepis xitunensis를 매우 완전하게 보존된 초기 갑주어 가운데 하나로 설명합니다. 겉모습으로 한 허리띠와 배지느러미 해석은 고해상도 CT 뒤에 수정되었습니다."],
      ["Complete preservation means the first reading is final.", "保存完整就说明第一次解释已经定论。", "보존이 완전하면 첫 해석이 최종이라고 말하지 않습니다."]
    ),
    card(
      ["Compare Position Before Behaviour", "先比位置，再谈行为", "행동보다 위치를 먼저 비교한다"],
      ["Match structures that sit in corresponding places, then describe the difference you can see. On the lecture figure, scattered scales are preservation and a complete slender tail is restoration.", "先找位置对应的结构，再描述看得见的差异。讲座图里，分散的鳞片是保存下来的，完整的细长尾巴是复原。", "같은 위치에 있는 구조를 맞춘 다음, 보이는 차이를 적습니다. 강의 그림에서 흩어진 비늘은 보존이고, 완전한 가느다란 꼬리는 복원입니다."],
      ["A difference in shape is a proven behaviour, or one fossil is a direct ancestor.", "形态不同就证明了某种行为，或一件化石是直接祖先。", "형태 차이가 증명된 행동이거나, 화석 하나가 직접 조상이라고 말하지 않습니다."]
    ),
    card(
      ["Coming Ashore Is Not A Plan", "上岸不是一个计划", "육지로 올라가는 일은 계획이 아니다"],
      ["Some structures were already present in aquatic relatives and later did different work. The mechanism is heritable variation, conditions, and which individuals left offspring.", "有些结构在水生近亲中已经存在，后来在新环境里承担了不同的工作。机制是可遗传变异、环境条件，以及哪些个体留下了后代。", "어떤 구조는 물속 친척에게 이미 있었고, 나중 환경에서 다른 일을 했습니다. 메커니즘은 유전되는 변이, 조건, 그리고 누가 자손을 남겼는지입니다."],
      ["A fish grew limbs in order to walk, or a tetrapodomorph fossil is itself the move onto land.", "鱼为了走路而长出四肢，或一件四足形类化石本身就是登陆事件。", "물고기가 걷기 위해 다리를 기르거나, 사지형류 화석 자체가 육지 상륙이라고 말하지 않습니다."]
    ),
    card(
      ["The Printed Habitat Line", "图上印着的栖息地句子", "그림에 인쇄된 서식지 문장"],
      ["A habitat sentence in the corner of a lecture figure is the author’s caption. Quote it as a caption and go back to the paper.", "讲座图角落里的栖息地句子是作者的图注。引用时要标明是图注，并回到论文。", "강의 그림 구석의 서식지 문장은 저자의 캡션입니다. 캡션으로 인용하고 논문으로 돌아갑니다."],
      ["That printed sentence is your own observation at the outcrop.", "那句印刷文字是你在露头上的观察。", "그 인쇄된 문장이 노두에서 한 자신의 관찰이라고 말하지 않습니다."]
    ),
    card(
      ["Two Labels For Every Picture", "每张图两个标签", "그림마다 두 개의 이름"],
      ["Say whether the picture is preserved fossil, a CT slice, a segmentation, or a restoration before you describe it.", "描述之前，先说明这张图是保存下来的化石、CT 切片、分割，还是复原。", "설명하기 전에 그 그림이 보존된 화석인지, CT 단면인지, 분할인지, 복원인지 말합니다."],
      ["A grey model and a dark fossil are the same kind of evidence.", "灰色模型和深色化石是同一种证据。", "회색 모형과 어두운 화석이 같은 종류의 증거라고 말하지 않습니다."]
    ),
    card(
      ["What The Comparison Table Must Hold", "比较表必须留下什么", "비교표에 남아야 하는 것"],
      ["Visible shape on both sides, at least one difference, and a sentence on how strong the evidence is.", "两侧看得见的形状、至少一处差异，以及证据有多强的一句话。", "양쪽에서 보이는 형태, 적어도 하나의 차이, 그리고 증거가 얼마나 강한지 한 문장입니다."],
      ["A single similar outline is enough to name an ancestor.", "一个相似的轮廓就足以写成祖先。", "비슷한 윤곽 하나만으로 조상을 정하지 않습니다."]
    )
  ];
}

export function labCards() {
  return [
    card(
      ["Four Levels, Four Jobs", "四种资料，四种工作", "네 층은 네 가지 일이다"],
      ["A specimen photo shows the outside and the rock. A CT slice shows a section. A segmentation is a judged 3D shape. A restoration adds inferred outline. The poster must name the level.", "标本照片显示外部和围岩。CT 切片显示一个截面。分割是经过判断的三维形状。复原加入了推断的轮廓。海报必须写明层级。", "표본 사진은 겉과 주변 암석을 보여 줍니다. CT 단면은 한 단면을 보여 줍니다. 분할은 판단이 들어간 입체 형태입니다. 복원은 추론한 윤곽을 더합니다. 포스터에는 층을 밝혀야 합니다."],
      ["Any of these pictures can be captioned “the fossil itself”.", "这些图都可以写成“化石本身”。", "이 그림들을 모두 “화석 그 자체”라고 설명하지 않습니다."]
    ),
    card(
      ["None Of The Room Models Is A Qujing Fish", "房间里的模型都不是曲靖的鱼", "방 안의 모형은 취징의 물고기가 아니다"],
      ["Cleoniceras is a Cretaceous ammonoid scan. Taramelliceras is an ammonite mesh with no Qujing locality on its file page. The Dunkleosteus file is a life restoration. The claw is a Photoshop preview turned into boxes.", "Cleoniceras 是白垩纪菊石扫描。Taramelliceras 是菊石网格，文件页没有曲靖产地。邓氏鱼文件是生活复原。爪子是把 Photoshop 预览堆成方块。", "Cleoniceras는 백악기 암모나이트 스캔입니다. Taramelliceras는 파일 페이지에 취징 산지가 없는 암모나이트 메쉬입니다. 둔클레오스테우스 파일은 생활 복원입니다. 발톱은 포토샵 미리보기를 상자로 만든 것입니다."],
      ["A familiar animal shape means the file came from this expedition.", "形状眼熟就说明文件来自这次科考。", "익숙한 동물 모양이면 그 파일이 이번 탐사에서 왔다고 말하지 않습니다."]
    ),
    card(
      ["What A Slice Still Cannot Decide", "切片仍然不能决定什么", "단면이 아직 결정할 수 없는 것"],
      ["Write, in the digital note, what the slice does not settle: species name, habitat, or a boundary you have not checked on the original image.", "在数字笔记里写下切片还不能确定的事：种名、栖息地，或你还没有在原始图像上核对的边界。", "디지털 노트에 단면이 아직 정하지 못한 것을 적습니다. 종 이름, 서식지, 또는 원본 이미지에서 확인하지 않은 경계입니다."],
      ["A dense area on a slice is automatically a named bone.", "切片上的高密度区域自动就是某块有名字的骨头。", "단면의 짙은 영역이 자동으로 이름이 있는 뼈라고 말하지 않습니다."]
    ),
    card(
      ["An AI Label Is A Mark To Check", "AI 标签是待核对的标记", "AI 라벨은 확인할 표시다"],
      ["You may write: the tool marked a dense area, and you still need the slice, the rock, and the literature.", "可以这样写：工具标出了一块高密度区域，你仍需要切片、围岩和文献。", "이렇게 쓸 수 있습니다. 도구가 짙은 영역을 표시했고, 여전히 단면과 암석과 문헌이 필요합니다."],
      ["The tool has proved a species name.", "工具已经证明了种名。", "도구가 종 이름을 증명했다고 말하지 않습니다."]
    ),
    card(
      ["Who Made The Judgement", "判断是谁作出的", "누가 판단했는가"],
      ["Name the finder or preparator for a specimen, the scanner for a slice, the person who segmented a model, and the restoration team for a restoration.", "标本要写发现者或修理者，切片要写扫描的人，模型要写做分割的人，复原要写复原团队。", "표본에는 발견자나 수리한 사람, 단면에는 스캔한 사람, 모형에는 분할한 사람, 복원에는 복원팀을 적습니다."],
      ["The picture made the judgement by itself.", "图片自己作出了判断。", "그림이 스스로 판단했다고 말하지 않습니다."]
    ),
    card(
      ["The Path In Order", "按顺序走这条路径", "순서를 지킨 경로"],
      ["Specimen, CT scan, slice, segmentation, reconstruction, restoration, then a sentence for other people. Each step can add something and each step can be wrong.", "标本、CT 扫描、切片、分割、重建、复原，然后才是讲给别人的句子。每一步都能增加信息，每一步也都可能出错。", "표본, CT 스캔, 단면, 분할, 재구성, 복원, 그 다음에 다른 사람을 위한 문장입니다. 각 단계는 정보를 더할 수 있고, 각 단계는 틀릴 수도 있습니다."],
      ["Skipping to the restoration is the same as having seen the specimen.", "直接跳到复原，就等于看见了标本。", "복원으로 건너뛰면 표본을 본 것과 같다고 말하지 않습니다."]
    )
  ];
}
