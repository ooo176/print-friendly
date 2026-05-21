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
  { id: "naruto",   label: "火影 Naruto",     tone: "light", tagline: "火影忍者风格，白底淡水印，橙色点缀" },
  { id: "notebook", label: "笔记本 Notebook", tone: "light", tagline: "横线笔记本，红色页边线，螺旋装订" },
  { id: "minimal",  label: "极简 Minimal",    tone: "light", tagline: "纯白无装饰，最大留白，专注内容" },
];

window.PRESS_DEFAULT_THEME = "naruto";
