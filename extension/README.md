# Press 浏览器扩展

Press 的浏览器扩展版本，可以直接读取页面已渲染的 DOM，绕过反爬虫限制。

## 功能特点

✅ **绕过反爬虫** — 直接读取浏览器已渲染的内容，无需 CORS 代理  
✅ **一键提取** — 点击扩展图标或右键菜单即可提取正文  
✅ **完整主题** — 支持所有 10 套打印主题  
✅ **离线可用** — 无需网络连接即可使用  
✅ **隐私保护** — 所有处理都在本地完成，不上传任何数据

## 安装方法

### Chrome / Edge / Brave

1. 下载或克隆本项目
2. 打开浏览器，进入扩展管理页面：
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择 `extension` 文件夹
6. 完成！扩展图标会出现在工具栏

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击「临时载入附加组件」
3. 选择 `extension/manifest.json`
4. 完成！

**注意**：Firefox 需要将 manifest.json 中的 `manifest_version` 改为 `2`，并调整部分配置。

## 使用方法

### 方法 1：工具栏图标
1. 打开任意网页（如 https://post.smzdm.com/p/a3gwlgek/）
2. 点击工具栏中的 Press 图标
3. 自动提取正文并在新标签页打开
4. 选择主题，点击「打印 / 保存 PDF」

### 方法 2：右键菜单
1. 在网页上右键
2. 选择「Press - 提取正文」
3. 自动提取并打开

## 支持的网站

扩展版本可以处理几乎所有网站，包括：

✅ **反爬虫网站**
- 什么值得买 (smzdm.com)
- 知乎部分内容
- 淘宝商品详情
- 小红书

✅ **JS 渲染网站**
- SPA 应用
- React/Vue 网站
- 动态加载内容

✅ **普通网站**
- 博客、新闻、文档
- 所有 Web 版本支持的网站

## 文件结构

```
extension/
├── manifest.json           # 扩展配置文件
├── background.js          # 后台服务工作者
├── content.js             # 内容脚本（注入到页面）
├── print-friendly.html    # 主界面（复用 Web 版本）
├── libs/
│   └── readability.js     # Mozilla Readability 库
├── themes/                # 所有主题 CSS 文件
│   ├── registry.js
│   ├── minimal.css
│   ├── classic.css
│   └── ...
└── icons/                 # 扩展图标
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 工作原理

1. **点击扩展图标** → 触发 `background.js`
2. **注入脚本** → 在当前页面执行 `extractAndOpen()` 函数
3. **提取正文** → 使用 Readability 解析页面 DOM
4. **存储数据** → 将提取的内容保存到 `chrome.storage.local`
5. **打开新标签** → 加载 `print-friendly.html?source=extension`
6. **渲染内容** → 从 storage 读取数据并渲染
7. **选择主题** → 用户选择打印主题
8. **打印/保存** → 生成 PDF

## 与 Web 版本的区别

| 特性 | Web 版本 | 扩展版本 |
|------|---------|---------|
| 安装 | 无需安装 | 需要安装扩展 |
| 反爬虫网站 | ❌ 无法访问 | ✅ 可以访问 |
| CORS 限制 | ❌ 受限 | ✅ 无限制 |
| 使用便捷性 | 需要复制 URL | ✅ 一键提取 |
| 离线使用 | ✅ 支持 | ✅ 支持 |
| 主题支持 | ✅ 10 套 | ✅ 10 套 |

## 隐私说明

Press 扩展：
- ✅ **不收集任何数据**
- ✅ **不上传任何内容**
- ✅ **不追踪用户行为**
- ✅ **所有处理都在本地完成**
- ✅ **开源代码，可审计**

所需权限说明：
- `activeTab` — 读取当前标签页内容（仅在点击扩展时）
- `scripting` — 注入内容提取脚本
- `storage` — 临时存储提取的内容（用于传递给新标签页）

## 开发计划

- [ ] 创建扩展图标（16/32/48/128px）
- [ ] 发布到 Chrome Web Store
- [ ] 发布到 Firefox Add-ons
- [ ] 发布到 Edge Add-ons
- [ ] 添加快捷键支持（如 Ctrl+Shift+P）
- [ ] 添加选中文本提取功能
- [ ] 支持批量提取（多标签页）

## 常见问题

### Q: 为什么需要「读取和更改网站上的所有数据」权限？
A: 这是 `activeTab` 权限的标准描述。实际上扩展只在你点击图标时读取当前页面，不会自动读取或修改任何内容。

### Q: 提取失败怎么办？
A: 部分页面可能不是标准的文章格式，Readability 无法识别。可以尝试：
1. 滚动到文章主体部分再点击提取
2. 使用 Web 版本的「强制简化模式」
3. 手动复制内容

### Q: 可以提取需要登录的内容吗？
A: 可以！扩展读取的是浏览器已渲染的内容，只要你能在浏览器中看到，就能提取。

### Q: 支持哪些浏览器？
A: 支持所有基于 Chromium 的浏览器（Chrome、Edge、Brave、Opera 等）和 Firefox。Safari 需要单独适配。

## 反馈与贡献

- 问题反馈：[GitHub Issues](https://github.com/your-repo/print-friendly/issues)
- 功能建议：欢迎提交 Issue 或 Pull Request
- 主题贡献：参考 [主题设计方案](../doc/theme-design-plan.md)

## License

MIT
