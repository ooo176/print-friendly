<div align="center">

# 📖 Press

### 网页转可打印正文 · Web to Print-Friendly

把任意网页地址变成一份**干净、可打印**的正文页
剥离广告、侧栏、导航，按你选的版式重新排版，一键打印或保存为 PDF

[**🚀 立即在线体验 →**](http://39.101.172.168:8181/other/print/print-friendly.html)

[安装浏览器扩展](extension/INSTALL.md) · [扩展使用文档](extension/README.md) · [主题设计方案](doc/theme-design-plan.md) · [技术实现](doc/TECHNICAL.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Themes](https://img.shields.io/badge/themes-10-orange.svg)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)
![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Edge%20%7C%20Safari%20%7C%20Firefox-lightgrey.svg)

</div>

---

## ✨ 项目简介

**Press** 是一款轻量级网页正文提取与打印工具。10 套精心设计的打印主题，涵盖黑白省墨和彩色美观两大类，从经典书籍到学术论文，从日式和风到海洋日落，每一套都拥有独立的版面结构与视觉语言。

> **零依赖、零安装、零后端** — 双击 `print-friendly.html` 即可在浏览器里运行。
>
> 🆕 **浏览器扩展版本**支持反爬虫网站（如什么值得买、知乎等），一键提取正文。

---

## 🚀 快速开始

### 🌐 方式一：在线体验（最快）

无需任何安装，点击下方按钮立即在浏览器中打开：

> 👉 [**点击这里打开在线版本**](http://39.101.172.168:8181/other/print/print-friendly.html)

### 💻 方式二：本地 Web 版本

```bash
# 1. 双击打开 print-friendly.html
# 2. 粘贴网页 URL
# 3. 点击「提取正文」
# 4. 选择主题并打印
```

✅ 无需安装，双击即用 · ✅ 适合大多数网站 · ❌ 无法访问反爬虫网站

### 🔌 方式三：浏览器扩展（推荐）

```bash
# 1. 安装扩展（2 分钟）
# 2. 打开任意网页
# 3. 点击扩展图标
# 4. 自动提取并打开
```

✅ 一键提取 · ✅ 支持反爬虫网站 · ✅ 支持 JS 渲染页面 · ⚠️ 需要安装

> 📦 [安装扩展指南 →](extension/INSTALL.md)

---

## 🎨 10 套主题一览

### 🖤 黑白主题（省墨水，适合日常打印）

| 主题 | 风格 | 特征 | 适用场景 |
|:---:|:---:|---|---|
| **极简** Minimal | 现代极简 | 大量留白、无衬线、超大标题 | 演讲稿、要点总结 |
| **经典** Classic | 传统书籍 | 首字下沉、衬线字体、居中标题 | 长文阅读、小说散文 |
| **学术** Academic | 论文格式 | 标题编号(1.1)、引用标注、双栏可选 | 研究论文、技术文档 |
| **报纸** Newspaper | 报刊专栏 | 多栏窄版、粗黑标题、紧凑排版 | 新闻文章、专栏评论 |
| **技术** Technical | 开发文档 | 代码突出、等宽字体、侧边目录 | 技术手册、API 文档 |

### 🌈 彩色主题（视觉美观，适合展示收藏）

| 主题 | 风格 | 特征 | 适用场景 |
|:---:|:---:|---|---|
| **笔记本** Notebook | 手写笔记 | 横线背景、红色边线、螺旋装订孔 | 学习笔记、读书摘要 |
| **火影** Naruto | 动漫主题 | 橙色点缀、主题水印、特色字体 | 粉丝内容、主题收藏 |
| **樱花** Sakura | 日式和风 | 樱花粉配色、和纸纹理、🌸 装饰 | 文学作品、诗歌散文 |
| **海洋** Ocean | 深海宁静 | 蓝色渐变、波浪装饰、清爽配色 | 旅行游记、散文随笔 |
| **日落** Sunset | 暖色温馨 | 橙紫渐变、金色点缀、温暖氛围 | 生活随笔、情感文章 |

---

## 🛠️ 工具栏选项

| 选项 | 说明 |
|---|---|
| 🖼️ **保留图片** | 是否在正文中显示图片 |
| 🔗 **打印显示链接 URL** | 打印时是否在 `<a>` 后附加 `(https://…)` |
| 🔤 **字号** | 紧凑 / 标准 / 舒朗（笔记本主题为 36px 行高） |
| 🎭 **主题** | 10 套版式下拉切换（自动记住选择） |
| 🌈 **彩色打印** | 勾选后保留主题色彩；不勾选则黑白省墨 |
| ⚡ **强制简化模式** | 对 SPA / JS 渲染的网站（Elastic、Notion 等）启用 |

---

## 🔍 提取效果

工具基于 **Mozilla Readability**（Firefox 阅读模式同款）做正文提取，适用于绝大多数文章页、文档、博客。对于 SPA 站点会自动回退到 **Jina Reader**（带服务端 JS 渲染），通常也能拿到正文。

> 📑 每页底部居中会显示页码（例如 `— 2 / 5 —`），方便装订。

---

## 💡 主题设计理念

<table>
<tr>
<td width="50%" valign="top">

### 🖤 黑白主题
- **目标**：节省墨水，清晰易读，适合日常打印
- **特点**：纯黑白或灰度，无彩色元素，高对比度
- **墨水消耗**：⭐ 极低 ~ ⭐⭐ 低

</td>
<td width="50%" valign="top">

### 🌈 彩色主题
- **目标**：视觉美观，情感表达，适合展示收藏
- **特点**：丰富配色，装饰元素，品牌感强
- **墨水消耗**：⭐⭐⭐ 中 ~ ⭐⭐⭐⭐ 高

</td>
</tr>
</table>

---

## 🎨 添加自定义主题

只需三步即可扩展第 11、12… 套主题：

```bash
# 1. 复制最简单的主题做模板
cp themes/minimal.css themes/myname.css

# 2. 把 .t-minimal 全部替换为 .t-myname，按需修改样式
```

```js
// 3. 在 themes/registry.js 数组里追加一行
{ id: "myname", label: "我的主题", tone: "light", tagline: "一句话描述" },
```

刷新页面，新主题自动出现在下拉菜单里。

> 📐 详细的主题设计方案和规范请参考 [doc/theme-design-plan.md](doc/theme-design-plan.md)

---

## 📂 项目结构

```
print-friendly/
├── 📄 print-friendly.html      # 主页面（双击打开即可使用）
├── 📘 README.md                # 用户使用指南（当前文件）
├── 🔌 extension/               # Chrome 扩展版本
│   ├── manifest.json           # 扩展配置文件
│   ├── background.js           # 后台脚本
│   ├── content.js              # 内容脚本
│   ├── app.js                  # 主应用逻辑
│   ├── print-friendly.html     # 扩展版页面
│   ├── icons/                  # 扩展图标
│   ├── libs/                   # 本地库文件
│   ├── themes/                 # 主题文件（复制自主项目）
│   ├── INSTALL.md              # 安装指南
│   ├── README.md               # 扩展使用文档
│   └── DEVELOPMENT.md          # 开发文档
├── 📚 doc/
│   ├── theme-design-plan.md    # 主题设计方案
│   └── TECHNICAL.md            # 技术实现细节文档
└── 🎨 themes/
    ├── registry.js             # 主题注册表
    ├── minimal.css             # 极简主题
    ├── classic.css             # 经典书籍主题
    ├── academic.css            # 学术论文主题
    ├── newspaper.css           # 报纸专栏主题
    ├── technical.css           # 技术手册主题
    ├── notebook.css            # 笔记本主题
    ├── naruto.css              # 火影主题
    ├── sakura.css              # 樱花主题
    ├── ocean.css               # 海洋主题
    ├── sunset.css              # 日落主题
    └── naruto-bg.png           # 火影主题背景图
```

---

## 📚 文档

| 文档 | 说明 |
|---|---|
| 📘 **用户使用指南** | 当前文件 |
| 🔧 [扩展安装指南](extension/INSTALL.md) | Chrome 扩展安装步骤（5 分钟） |
| 📖 [扩展使用文档](extension/README.md) | 扩展功能说明和使用技巧 |
| 🎨 [主题设计方案](doc/theme-design-plan.md) | 10 套主题的设计理念、配色方案、实现优先级 |
| ⚙️ [技术实现详解](doc/TECHNICAL.md) | 抓取链路、正文提取、主题系统设计、依赖说明等 |
| 🛠️ [扩展开发文档](extension/DEVELOPMENT.md) | 扩展开发和调试指南 |

---

## ⚠️ 已知限制

<table>
<tr>
<td width="50%" valign="top">

### 🌐 Web 版本
- 公共 CORS 代理偶尔限速，失败时会自动切换下一家
- 强反爬 / 登录后的页面无法抓取（**建议使用扩展版本**）
- 浏览器需手动勾选「背景图形」才能打印彩色主题底色
- 笔记本主题的横线对齐在有图片或特殊元素时可能出现偏差

</td>
<td width="50%" valign="top">

### 🔌 扩展版本
- 需要手动安装（约 5 分钟）
- Firefox 需要每次重启后重新加载（临时扩展限制）
- 部分特殊页面结构可能无法识别

</td>
</tr>
</table>

---

## 🌍 浏览器兼容

需要支持 **ES2020** 与现代 CSS（`@page` margin box、`backdrop-filter`、CSS counters）的浏览器：

> Chrome / Edge / Safari / Firefox 近两年版本均可

---

## ✨ 特性亮点

- ✅ **零依赖** — 单个 HTML 文件，无需安装任何依赖
- ✅ **双模式** — Web 版本和浏览器扩展，满足不同需求
- ✅ **反爬虫支持** — 扩展版可提取反爬虫网站（什么值得买、知乎等）
- ✅ **主题丰富** — 10 套精心设计的打印主题，黑白彩色兼顾
- ✅ **自动适配** — 自动检测 JS 渲染页面，智能切换提取模式
- ✅ **打印优化** — 专为 A4 打印设计，支持页码、页眉页脚
- ✅ **可扩展** — 简单的主题系统，轻松添加自定义样式
- ✅ **离线可用** — 扩展版完全离线，无需网络连接

---

<div align="center">

## 📜 License

**MIT**

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持

[**🚀 立即体验在线版本**](http://39.101.172.168:8181/other/print/print-friendly.html)

</div>
