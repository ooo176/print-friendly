/**
 * Press · Theme Registry
 *
 * Adding a new theme:
 *   1) Drop `themes/<id>.css` next to this file. Scope ALL rules under
 *      `body.t-<id>` so they only apply when active.
 *   2) Add an entry below.
 *
 * Each entry:
 *   id     — body class suffix; the active body gets `t-<id>`.
 *   label  — text shown in the picker.
 *   tone   — "light" | "dark"; affects the screen background fallback
 *            so the masthead chrome adapts before the CSS loads.
 *   tagline— short description shown in the picker / print mode preview.
 *
 * The CSS file is loaded lazily on first use (and cached). The default
 * theme is loaded eagerly to avoid a flash of unstyled content.
 */
window.PRESS_THEMES = [
  // ── Batch 1 ──
  { id: "press",      label: "报刊 Press",       tone: "light", tagline: "传统报刊版面，双线分隔与首字下沉" },
  { id: "mono",       label: "极简 Mono",        tone: "light", tagline: "学术单栏，留白与衬线，无装饰" },
  { id: "vivid",      label: "炫彩 Vivid",       tone: "light", tagline: "渐变巨幅标题，色块与电光感" },
  { id: "brutal",     label: "粗野 Brutalist",   tone: "light", tagline: "黑色横条、硬阴影、无衬线大写" },
  { id: "manuscript", label: "手稿 Manuscript",  tone: "light", tagline: "羊皮纸、手写体标题、装饰花边" },
  { id: "editorial",  label: "杂志 Editorial",   tone: "light", tagline: "时尚杂志封面，飘带与节符" },
  { id: "terminal",   label: "终端 Terminal",    tone: "dark",  tagline: "命令行界面，扫描线与提示符" },
  { id: "pastel",     label: "柔光 Pastel",      tone: "light", tagline: "圆角粉调卡片，柔和阴影" },
  { id: "noir",       label: "黑金 Noir",        tone: "dark",  tagline: "Art Deco 黑底金字，菱形装饰" },
  { id: "blueprint",  label: "蓝图 Blueprint",   tone: "dark",  tagline: "工程蓝底网格，制图标题栏" },

  // ── Batch 2 ──
  { id: "swiss",      label: "瑞士 Swiss",       tone: "light", tagline: "国际主义网格，Helvetica 式严谨排版" },
  { id: "kraft",      label: "牛皮 Kraft",       tone: "light", tagline: "牛皮纸 zine，邮票、贴纸与胶带" },
  { id: "japanese",   label: "和风 Japanese",    tone: "light", tagline: "宣纸朱印，明朝竖排意象，落款方印" },
  { id: "victorian",  label: "维多利亚 Victorian", tone: "light", tagline: "古籍扉页，花体装饰，对称繁复" },
  { id: "neon",       label: "霓虹 Neon",        tone: "dark",  tagline: "赛博朋克霓虹，紫粉青三色辉光" },
  { id: "risograph",  label: "拓印 Risograph",   tone: "light", tagline: "Riso 双色错位，颗粒与重影印刷" },
  { id: "woodblock",  label: "古籍 Woodblock",   tone: "light", tagline: "宋刻本雕版，鱼尾版心、线装外框、朱印" },
  { id: "boardingpass", label:"登机牌 Boarding", tone: "light", tagline: "机票排版，虚线撕口与条码" },
  { id: "monogram",   label: "纹章 Monogram",    tone: "light", tagline: "象牙白书籍，圆形纹章，铜版蚀刻" },
  { id: "bauhaus",    label: "包豪斯 Bauhaus",   tone: "light", tagline: "三原色几何，圆方三角构成" },
];

window.PRESS_DEFAULT_THEME = "press";
