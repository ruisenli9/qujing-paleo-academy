export const MODULE_ORDER = [
  "train-rock",
  "xitun",
  "zhujiang",
  "compare",
  "lab",
  "kit",
  "poster"
];

export const NAV = [
  { href: "#/map", match: "map", label: "Task map" },
  { href: "#/train", match: "train", label: "Pre-trip training" },
  { href: "#/sites", match: "sites", label: "Xitun & Pearl River" },
  { href: "#/lab", match: "lab", label: "Digital lab" },
  { href: "#/kit", match: "kit", label: "Field kit" },
  { href: "#/work", match: "work", label: "My work" }
];

export const FIGURES = {
  hero: {
    src: "./public/assets/media/restoration-head-detail.webp",
    alt: "Close view of a scientific restoration of an ancient fish head, with scales, an eye, and jaw texture",
    type: "infer",
    typeLabel: "Scientific restoration",
    caption: "Source: embedded figure, page 18, Lu Jing, lecture on reconstructing the ancient-fish kingdom, IVPP, 14 March 2026. The shape is inferred from fossils, CT, and comparative anatomy. It is not a photograph of the fossil. Confirm permission before a public launch."
  },
  field: {
    src: "./public/assets/media/field-dongpo-panorama.webp",
    alt: "Panorama of an outcrop and rock piles near Dongpo village, Qujing",
    type: "raw",
    typeLabel: "Field photograph",
    caption: "Source: embedded figure, page 10 of the same lecture. The slide title is Dongpo village, Qujing: Silurian Xiaoxiang vertebrate fauna. Access and photography follow the arrangements on site."
  },
  specimen: {
    src: "./public/assets/media/specimen-3d-head.webp",
    alt: "Photograph of a three-dimensionally preserved fish-head fossil and its surrounding rock",
    type: "raw",
    typeLabel: "Specimen photograph",
    caption: "Source: lecture page 11. A fish head preserved in three dimensions, reported as found in 2015, with related specimen photographs. Separate the rock, the fossil outline, and the label. Do not copy a display caption as your own observation."
  },
  ct: {
    src: "./public/assets/media/ct-workflow.webp",
    alt: "CT scanner and slice images of a fish-head fossil",
    type: "processed",
    typeLabel: "Processed data / CT slice",
    caption: "Source: lecture page 12. The scanner is on the left; flat-panel CT slices are in the centre and on the right. A slice shows an internal section. It does not name a species or prove a habitat by itself."
  },
  segmented: {
    src: "./public/assets/media/segmented-skull.webp",
    alt: "Colour-segmented three-dimensional skull structures",
    type: "processed",
    typeLabel: "Processed data / segmentation",
    caption: "Source: embedded figure, lecture page 13. Colours mark structures a researcher selected and segmented. Segmentation includes judgement and must be checked against the original slices."
  },
  pipeline: {
    src: "./public/assets/media/digital-pipeline.webp",
    alt: "Flow from specimen preparation and segmentation to reconstruction, restoration, and analysis",
    type: "processed",
    typeLabel: "Diagram",
    caption: "Source: lecture page 16. It explains a research sequence. Promotional rankings on the slide are not scientific conclusions of this site."
  },
  restore: {
    src: "./public/assets/media/restoration-head-detail.webp",
    alt: "Close view of a restored ancient-fish head with scale texture",
    type: "infer",
    typeLabel: "Scientific restoration",
    caption: "Source: embedded figure, lecture page 18. The outline is restored from fossils, CT, and comparative anatomy, and it includes inference."
  },
  para: {
    src: "./public/assets/media/parayunnanolepis-compare.webp",
    alt: "Preserved fossil of Parayunnanolepis xitunensis compared with a three-dimensional restoration",
    type: "infer",
    typeLabel: "Preservation beside a restoration",
    caption: "Source: embedded figure, lecture page 23. The species is Parayunnanolepis xitunensis. The upper part shows preservation; the lower part is a restoration. What is preserved can be observed. Completed outlines are inference. An IVPP CT restudy revised an earlier reading of the girdle."
  },
  xitun: {
    src: "./public/assets/media/xitun-fauna-slide.webp",
    alt: "Composite slide of the Early Devonian Xitun fauna: a column, specimens, and paper titles",
    type: "processed",
    typeLabel: "Lecture composite",
    caption: "Source: lecture page 29. A stratigraphic sketch, a habitat restoration, specimen photographs, and published titles are combined. The habitat picture is not primary evidence. Rock-unit names follow the site and the literature."
  },
  map: {
    src: "./public/assets/media/qujing-distribution-slide.webp",
    alt: "Schematic composite of where the main ancient-fish fossils around Qujing are discussed",
    type: "processed",
    typeLabel: "Diagram / lecture composite",
    caption: "Source: lecture page 28. It is here so that material from different places is not mixed. Promotional counts on the slide are not data cited by this site. Coordinates and unpublished localities are not published here."
  },
  oste: {
    src: "./public/assets/media/early-osteichthyan.webp",
    alt: "Fossil or reconstruction related to an early osteichthyan",
    type: "processed",
    typeLabel: "Research figure",
    caption: "Source: embedded figure, lecture page 9. Use it to compare outlines. One picture is not a direct ancestor."
  }
};

export const TERMS = [
  ["Fossil", "A record of an ancient organism’s body, remains, or trace, preserved in the geological record."],
  ["Outcrop", "A place where rock is exposed at the surface and can be observed."],
  ["Stratum / strata", "A rock layer, or a set of layers, formed in a particular interval and with particular features."],
  ["Matrix", "The rock or sediment that surrounds a fossil."],
  ["Gnathostomes", "Vertebrates with upper and lower jaws."],
  ["Osteichthyans", "A major jawed lineage that includes ray-finned fishes, lobe-finned fishes, and related fossils."],
  ["Actinopterygians", "Fishes whose fins are supported mainly by fin rays, including most living fishes."],
  ["Sarcopterygians", "Coelacanths, lungfishes, tetrapods, and their fossil relatives. Early members have paired fins with substantial internal bone."],
  ["Tetrapodomorphs", "Tetrapods and the fossil fishes most closely related to them. Finding a tetrapodomorph is not the same as finding an animal that already lived on land."],
  ["Natural selection", "Heritable differences among individuals can change how many offspring they leave, so the share of those traits in a population can change over generations."],
  ["CT slice", "A cross-section image from X-ray computed tomography."],
  ["Segmentation", "Identifying, labelling, and extracting a chosen structure in an image."],
  ["Scientific restoration", "A reconstruction that must keep the preserved parts separate from the parts that are inferred."]
];

export const SOURCES = [
  {
    id: "handbook",
    title: "Qujing palaeontology student handbook (revision 1)",
    use: "Main text for the tasks, observation fields, poster structure, terms, and safety rules."
  },
  {
    id: "brainstorm",
    title: "Pre-trip briefing framework",
    use: "The two guiding questions, field-card fields, poster template, and the four-stage chain."
  },
  {
    id: "schedule",
    title: "Qujing_Programme_CN_EN.xlsx",
    use: "Schedule used to place the tasks. Times, people, and rooms follow the organiser’s final notice. This site does not treat unconfirmed details as settled."
  },
  {
    id: "protect",
    title: "Regulations on the protection of palaeontological fossils (State Council Order No. 580) and the SVP ethics statement",
    use: "Fossils are owned by the state, excavation needs permission, and students do not collect on their own."
  },
  {
    id: "ivpp-xitun",
    title: "IVPP note on the Xitun Formation habitat study, 2024",
    href: "https://www.ivpp.ac.cn/xwdt/kyjz/202404/t20240416_7103775.html",
    use: "The published reading is a generally marine Xitun Formation with three freshening episodes, and the main fish beds linked to the first freshening. That is a research conclusion, not something a single fish fossil proves."
  },
  {
    id: "ivpp-gouyu",
    title: "Bothriolepis zhujiangyuanensis, Pearl River Source",
    href: "http://www.ivpp.cas.cn/xwdt/kyjz/202502/t20250219_7529514.html",
    use: "Middle Devonian, Eifelian, Shangshuanghe Formation. Keep material, phylogeny, and palaeogeography in separate layers."
  },
  {
    id: "ivpp-para",
    title: "CT restudy of the Parayunnanolepis girdle",
    href: "https://ivpp.cas.cn/xwdt/kyjz/202301/t20230105_6596074.html",
    use: "A complete fossil can still be reread. CT revised an earlier interpretation."
  },
  {
    id: "ics",
    title: "International Chronostratigraphic Chart",
    href: "https://stratigraphy.org/chart/",
    use: "Names and order of the Silurian and the Devonian."
  },
  {
    id: "lecture",
    title: "Lu Jing lecture: reconstructing the ancient-fish kingdom with 3D restoration",
    use: "Image set for CT, segmentation, reconstruction, and restoration. Each figure keeps its page number. Promotional rankings are not cited as facts."
  },
  {
    id: "cleoniceras",
    title: "Cleoniceras besairiei PRI 70601, model by Emily Hauf",
    href: "https://commons.wikimedia.org/wiki/File:Cleoniceras_besairiei_(PRI_70601).stl",
    use: "Cretaceous ammonoid scan from the Paleontological Research Institution. CC0 on Wikimedia Commons. Comparison model, not a Qujing fish."
  },
  {
    id: "taramelliceras",
    title: "Taramelliceras sp. STL",
    href: "https://commons.wikimedia.org/wiki/File:Taramelliceras_sp.stl",
    use: "Ammonite mesh listed as public domain on Wikimedia Commons. The file page does not give a Qujing locality. Not a Qujing fish."
  },
  {
    id: "dunkleosteus",
    title: "Dunkleosteus life reconstruction by EvolutionIncarnate",
    href: "https://commons.wikimedia.org/wiki/File:Dunkliferecon.stl",
    use: "CC0 life reconstruction, not a fossil scan and not a Qujing specimen."
  }
];
