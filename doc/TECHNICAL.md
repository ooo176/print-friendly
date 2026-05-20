# Press · 网页转可打印正文

一个**单页前端工具**，把任意网页 URL 提取为干净的正文，并以可选的 10 套版式排版后直接打印（或保存为 PDF）。

零构建、零后端、零依赖安装：双击 `print-friendly.html` 即可在浏览器里运行。

```
life-manage/
├── print-friendly.html      # 主页面：UI 框架 + 提取逻辑 + 主题装载器
└── themes/
    ├── registry.js          # 主题清单（增删主题改此处）
    │
    │  ── Batch 1 ──
    ├── press.css            # 主题 01 · 报刊
    ├── mono.css             # 主题 02 · 极简学术
    ├── vivid.css            # 主题 03 · 渐变炫彩
    ├── brutal.css           # 主题 04 · 粗野
    ├── manuscript.css       # 主题 05 · 羊皮纸手稿
    ├── editorial.css        # 主题 06 · 双栏杂志
    ├── terminal.css         # 主题 07 · 终端
    ├── pastel.css           # 主题 08 · 柔光
    ├── noir.css             # 主题 09 · 黑金 Art Deco
    ├── blueprint.css        # 主题 10 · 蓝图
    │
    │  ── Batch 2 ──
    ├── swiss.css            # 主题 11 · 瑞士国际主义
    ├── kraft.css            # 主题 12 · 牛皮纸 zine
    ├── japanese.css         # 主题 13 · 和風宣纸
    ├── victorian.css        # 主题 14 · 维多利亚扉页
    ├── neon.css             # 主题 15 · 霓虹赛博朋克
    ├── risograph.css        # 主题 16 · Riso 双色拓印
    ├── memo.css             # 主题 17 · 横线便笺
    ├── boardingpass.css     # 主题 18 · 登机牌
    ├── monogram.css         # 主题 19 · 纹章书籍
    └── bauhaus.css          # 主题 20 · 包豪斯构成
```

---

## 一、整体流程

```
用户输入 URL
     │
     ▼
[1] CORS 代理抓取 HTML  ──失败/空壳──▶ [1b] 简化模式 (jina reader, 带 JS 渲染)
     │                                            │
     ▼                                            ▼
[2] Mozilla Readability 提取正文              [2b] marked.js 解析 markdown
     │                                            │
     └────────────────┬───────────────────────────┘
                      ▼
            [3] DOMPurify 清洗 HTML
                      ▼
            [4] 解析相对链接 / 图片绝对化
                      ▼
            [5] 注入到 .article 容器
                      ▼
            [6] 当前主题 CSS 接管版式
                      ▼
            [7] window.print() — 主题各自的 @media print 规则生效
```

---

## 二、关键技术点

### 2.1 跨域抓取（CORS Proxy 回退链）

纯前端无后端的最大障碍是浏览器同源策略。方案：用一组公共 CORS 代理依次尝试，任一返回有效响应即停止。

```js
const PROXIES = [
  (u) => `https://r.jina.ai/http://${u.replace(/^https?:\/\//, "")}`, // jina reader（兜底）
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];
```

- **2/3/4 号** 是普通透传代理，返回原始 HTML。
- **1 号 jina reader** 比较特殊：服务端会执行 JavaScript 渲染，把页面转换为 markdown 文本输出。它是 SPA / 强反爬站点的最后兜底。

抓取顺序：先尝试普通代理（保留原始 HTML 信息最多），全失败后再用 jina。

### 2.2 SPA 检测与自动降级

Elastic Docs、Notion 等 Next.js / Nuxt 的页面，普通代理拿到的是几乎空的 HTML 壳，Readability 无法提取出有效正文。处理：

```js
// Readability 解析后做一次质量检测
const textLen = article ? (article.textContent || "").trim().length : 0;
if (!article || textLen < 400) {
  // 自动切换到 jina reader（带 JS 渲染）
  ...
}
```

同时工具栏提供「**强制简化模式**」复选框，对已知的 JS 渲染站点直接走 jina 路径，跳过 Readability 失败的尝试。

### 2.3 正文提取（双引擎）

- **Mozilla Readability**：浏览器引擎之外最权威的正文提取器（Firefox Reader View 同款）。
  - 输入 `Document` 对象（用 `DOMParser` 解析 HTML 字符串得到）
  - 调用前手动注入 `<base href="sourceUrl">` 让相对路径解析到原站
  - 返回 `{ title, byline, content, textContent, length }`

- **marked.js（jina 路径）**：jina reader 返回的是 markdown，用 marked 转 HTML（GFM 模式开启），完整支持链接、加粗、斜体、行内代码、图片、表格。这是早期手写解析器只识别块级元素、丢失 inline 标记的 bug 的根治方案。

### 2.4 jina 输出的导航噪声清理

jina reader 会把页面顶部的导航菜单也转成 markdown，导致提取的正文前面常常糊着一大段 `[菜单项](url)` 列表。`stripLeadingNav()` 用启发式规则裁掉：

```
1. 按空行切块
2. 找到第一段 plaintext 长度 ≥ 120 字符的段落（视为正文起点）
3. 从该段往前回溯到最近的 #/##/### 标题，从那里开始保留
4. 否则就直接从该段开始保留
```

### 2.5 安全：DOMPurify 清洗

抓回的 HTML 不可信，注入 DOM 前一律用 DOMPurify 过一遍：禁用 `script / style / iframe / form / button / input` 等标签，去掉所有 `onload / onclick / style` 内联属性，杜绝 XSS 与样式污染。

### 2.6 资源路径绝对化

抓取后的 `<a>` 和 `<img>` 大量是相对路径，直接挂在本地 file:// 上是 404。注入 DOM 后遍历一遍：

- `<a>`：`new URL(href, sourceUrl)` 转绝对，并加 `target="_blank"` `rel="noreferrer noopener"`
- `<img>`：同上，并加 `loading="lazy"` `referrerpolicy="no-referrer"`（很多站要求 referrer 才会出图，no-referrer 反而能绕过 hotlink 防护）

---

## 三、主题系统（可扩展）

10 套主题不仅是「换皮」，每套都拥有**完全不同的版面结构**——背景、边框、运行栏、kicker、标题、署名、正文、版尾的形态都由各自的 CSS 文件接管。

### 3.1 设计约定

主 HTML 里的「版面骨架」是固定的数据槽位：

```html
<article class="sheet">
  <div class="runner">…</div>     <!-- 报头/版次/日期 -->
  <div class="kicker">…</div>     <!-- 题图栏 -->
  <h1 class="title">…</h1>
  <div class="byline">…</div>     <!-- 署名/来源/字数 -->
  <div class="article">…</div>    <!-- 正文 -->
  <div class="colophon">…</div>   <!-- 版尾 -->
</article>
```

基础 CSS（`print-friendly.html` 的 `<style>` 块）**只**负责通用控件（masthead、composer、toolbar、status、stage 居中等），**不**给上面的槽位定任何视觉样式。每个主题的 CSS 用 `body.t-<id>` 作用域接管所有槽位的呈现。

这意味着主题甚至可以**隐藏部分槽位**或**改变它们的语义**：
- mono 隐藏 runner、把 byline 改成居中斜体注脚
- terminal 把 runner 变成「窗口栏」（带 ●●● 红绿灯），把标题前缀改成 `$ cat`
- editorial 把 kicker 做成 ribbon 形（带斜切的彩色尾巴），正文双栏排版
- blueprint 把 byline 改成「制图标签栏」（用 `data-label` 属性显示字段名）
- swiss 用 CSS counter 给 h2 自动编号，runner 变成 4 列网格
- kraft 用 ::before/::after 模拟 washi tape 贴纸
- japanese 用绝对定位方形朱印章 + 竖线分隔
- victorian 用 UnifrakturCook 哥特体 + 双线花边 + ❦ 花饰
- neon 用 text-shadow 模拟色差辉光 + Major Mono Display
- boardingpass 用 ::before 虚线撕口 + 圆角半圆缺口
- monogram 隐藏 runner，kicker 变成圆形纹章
- bauhaus 用 ::before/::after 画黄圆红三角几何装饰

### 3.2 注册表 + 懒加载

```js
// themes/registry.js
window.PRESS_THEMES = [
  { id: "press",     label: "报刊 Press",   tone: "light", tagline: "…" },
  { id: "mono",      label: "极简 Mono",    tone: "light", tagline: "…" },
  …
];
window.PRESS_DEFAULT_THEME = "press";
```

主页面启动时：

1. 读取 `PRESS_THEMES` 填充下拉框
2. 读取 `localStorage.press.theme`（用户上次的选择）
3. 调用 `applyTheme(id)`：动态注入 `<link rel="stylesheet" href="themes/<id>.css">`，并切换 `body` 的 `t-<id>` class
4. 已加载的主题缓存到 `loadedThemes` Set，切换时不会重复加载

切换主题不需要重新提取正文，只是切换 class。

### 3.3 添加新主题

两步：

```bash
# 1. 复制最简单的主题做模板
cp themes/mono.css themes/myname.css
# 2. 把所有 .t-mono 替换为 .t-myname，按需修改
```

```js
// 3. themes/registry.js 中追加
{ id: "myname", label: "我的主题", tone: "light", tagline: "…" },
```

刷新页面，下拉里就出现新主题。无须修改任何其他文件。

### 3.4 打印行为

每个主题文件都自带 `@media print` 规则，分两档：

- **默认（黑白）**：`body:not(.print-color)` ——把彩色背景、彩色文字、阴影剥掉，得到 ink-on-paper 省墨版本。
- **彩色打印**：用户勾选「彩色打印」复选框时启用 `body.print-color`，主题保留自己的色调（浏览器需在打印对话框中勾选 Background graphics）。深色主题（terminal / noir / blueprint）只在勾选时才会输出深色纸面，避免误打全黑。

基础 `@media print`（`print-friendly.html` 中）负责通用项：
- `@page` A4 与边距
- 隐藏 masthead / composer / toolbar / status
- 防止图、表、代码块、引用块在分页处被截断（`page-break-inside: avoid`）
- 链接 URL 内联打印开关：勾选「打印显示链接 URL」时，`<a>` 之后会附加 `(href)` 字符串

---

## 四、字体策略

通过单次 Google Fonts 请求合并加载所有主题需要的字体，避免切换主题的 FOUT：

| 字体 | 用于 |
|---|---|
| Fraunces | press / pastel 标题 |
| Noto Serif SC | 所有主题的中文衬线 fallback |
| EB Garamond | mono / manuscript / editorial / noir 正文 |
| Manrope | vivid / pastel / editorial 系统字 |
| Caveat | manuscript 标题手写体 |
| Playfair Display | editorial / noir 标题 |
| Bebas Neue | brutal 大写标题 |
| JetBrains Mono | brutal / terminal / blueprint 等宽 |
| Inconsolata | terminal / blueprint 等宽备选 |
| DM Mono | 各主题运行栏 / 元数据条 |

---

## 五、依赖（CDN）

| 库 | 版本 | 作用 |
|---|---|---|
| `@mozilla/readability` | 0.5.0 | 主路径正文提取 |
| `dompurify` | 3.1.6 | XSS 清洗 |
| `marked` | 12.0.2 | jina markdown → HTML |

所有依赖通过 `cdn.jsdelivr.net` 加载，无 npm install。

---

## 六、本地运行

直接用浏览器打开 `print-friendly.html` 即可。注意：

- 现代浏览器对 `file://` 协议下的 `<link rel="stylesheet">` 加载相对路径是允许的，所以主题懒加载能正常工作。
- CORS 代理是公共服务，可能限速或偶尔不可用——失败时会自动切到下一家，最终回退到 jina。
- 「彩色打印」需要在浏览器打印对话框勾选 **「背景图形 / Background graphics」**，否则深色主题的纸面颜色不会输出。

---

## 七、已知限制

- 强反爬站点（Cloudflare 高级模式、人机验证）所有代理都拿不到，只能贴源 HTML 进来手动提取（暂未提供该入口）。
- 公共代理无身份认证，私域 / 登录后页面无法抓取。
- jina reader 路径丢失 HTML 的 `class` / `id`，因此这条路径下没法做更精细的 noise 剥离，目前用启发式 `stripLeadingNav` 兜底。
- 长代码块在打印分页时虽设了 `page-break-inside: avoid`，但若超过整页仍会被截，没有更优解。

---

## 八、扩展方向（未实现）

- 自有后端代理（Node/Go 几十行），稳定性远高于公共代理
- 用户自定义 CSS 注入（粘贴一段覆盖样式）
- 多文章合订打印（队列 + 自动分页）
- 主题预览缩略图
- 离线 PWA 化
