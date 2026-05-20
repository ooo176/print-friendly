# Press · 网页转可打印正文

把任意网页地址变成一份**干净、可打印**的正文页——剥离广告、侧栏、导航，按你选的版式重新排版，一键打印或保存为 PDF。

20 套精心设计的版面，从传统报刊到雕版古籍，从瑞士国际主义到赛博朋克霓虹，每一套都拥有独立的版面结构与视觉语言。

零依赖、零安装、零后端：双击 `print-friendly.html` 即可在浏览器里运行。

---

## 快速上手

```
1. 双击打开 print-friendly.html
2. 在输入框粘贴网页 URL（例如 https://www.runoob.com/python3/python3-tutorial.html）
3. 点击「提取正文」
4. 从右上「主题」下拉里挑一套版式
5. 点击「打印 / 保存 PDF」
```

打印对话框里如果你想保留主题底色（如雕版古籍的米黄、终端的黑底绿字），需要勾选 **「背景图形 / Background graphics」**。

---

## 20 套版式一览

| 主题 | 风格 | 特征 |
|---|---|---|
| **报刊** Press | 传统报刊 | 双线分隔、首字下沉、Fraunces 衬线 |
| **极简** Mono | 学术单栏 | 居中无装饰、Garamond、60ch 行宽 |
| **炫彩** Vivid | 渐变 hero | Manrope 800、彩条 hero、电光感 |
| **粗野** Brutalist | 硬阴影 | Bebas Neue 大写、黑底反白块 |
| **手稿** Manuscript | 羊皮纸 | Caveat 手写、❦ 装饰花边 |
| **杂志** Editorial | 时尚双栏 | Playfair 斜体大字、§ 章节符 |
| **终端** Terminal | 命令行 | 黑底荧光绿、`$ cat` 前缀、扫描线 |
| **柔光** Pastel | 圆角粉调 | Fraunces 600、pill 形 byline |
| **黑金** Noir | Art Deco | 黑底金字、菱形装饰、Playfair 900 |
| **蓝图** Blueprint | 工程制图 | 蓝底网格、JetBrains Mono、虚线 NOTE |
| **瑞士** Swiss | 国际主义 | 4 列网格、红色自动编号、Space Grotesk |
| **牛皮** Kraft | zine 手作 | 牛皮纸、washi tape、波浪下划线 |
| **和风** Japanese | 宣纸朱印 | Rozha One、方形朱印章、・列表 |
| **维多利亚** Victorian | 古籍扉页 | UnifrakturCook 哥特、❦ 花饰、双线花边 |
| **霓虹** Neon | 赛博朋克 | 黑底辉光、色差 text-shadow、`//` 前缀 |
| **拓印** Risograph | Riso 双色 | 奶油纸、错位双色、mix-blend 图片 |
| **古籍** Woodblock | 宋刻雕版 | 鱼尾版心、线装外框、朱印章、宽字距 |
| **登机牌** Boarding | 机票 | 圆角票面、虚线撕口、✈ 前缀、条码 |
| **纹章** Monogram | 精装书 | 圆形纹章 kicker、Cormorant 细衬线 |
| **包豪斯** Bauhaus | 构成主义 | 三原色（● ■ ▲）几何、Space Grotesk |

---

## 工具栏选项

- **保留图片** — 是否在正文中显示图片
- **打印显示链接 URL** — 打印时是否在 `<a>` 后附加 `(https://…)`
- **字号** — 紧凑 / 标准 / 舒朗
- **主题** — 20 套版式下拉切换（自动记住选择）
- **彩色打印** — 勾选后保留主题色彩；不勾选则黑白省墨
- **强制简化模式** — 对 SPA / JS 渲染的网站（Elastic、Notion 等）启用

---

## 提取效果

工具基于 **Mozilla Readability**（Firefox 阅读模式同款）做正文提取，适用于绝大多数文章页、文档、博客。对于 SPA 站点会自动回退到 **Jina Reader**（带服务端 JS 渲染），通常也能拿到正文。

每页底部居中会显示页码（例如 `— 2 / 5 —`），方便装订。

---

## 添加自定义主题

只需两步即可扩展第 21、22…套主题：

```bash
# 1. 复制最简单的主题做模板
cp themes/mono.css themes/myname.css
# 2. 把 .t-mono 全部替换为 .t-myname，按需修改样式
```

```js
// 3. 在 themes/registry.js 数组里追加一行
{ id: "myname", label: "我的主题", tone: "light", tagline: "一句话描述" },
```

刷新页面，新主题自动出现在下拉菜单里。

---

## 项目结构

```
life-manage/
├── print-friendly.html      # 主页面（双击打开即可使用）
├── doc/
│   └── TECHNICAL.md         # 技术实现细节文档
└── themes/
    ├── registry.js          # 主题注册表
    └── *.css                # 20 个主题样式文件
```

---

## 文档

- 用户使用指南 — 当前文件
- [技术实现详解](doc/TECHNICAL.md) — 抓取链路、正文提取、主题系统设计、依赖说明等

---

## 已知限制

- 公共 CORS 代理偶尔限速，失败时会自动切换下一家
- 强反爬 / 登录后的页面无法抓取
- 浏览器需手动勾选「背景图形」才能打印彩色主题底色（代码块已做特殊处理，无需勾选也能看清）

---

## 浏览器兼容

需要支持 ES2020 与现代 CSS（`@page` margin box、`backdrop-filter`、CSS counters）的浏览器：Chrome / Edge / Safari / Firefox 近两年版本均可。
