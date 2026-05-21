# Press 浏览器扩展 - 安装指南

## 快速安装（5 分钟）

### 步骤 1：生成图标

1. 用浏览器打开 `extension/icon-generator.html`
2. 右键点击每个 canvas，选择「图片另存为」
3. 保存为：
   - `icons/icon16.png`
   - `icons/icon32.png`
   - `icons/icon48.png`
   - `icons/icon128.png`

### 步骤 2：安装扩展

#### Chrome / Edge / Brave

1. 打开浏览器扩展管理页面：
   ```
   Chrome:  chrome://extensions/
   Edge:    edge://extensions/
   Brave:   brave://extensions/
   ```

2. 开启右上角的「开发者模式」开关

3. 点击「加载已解压的扩展程序」按钮

4. 选择 `extension` 文件夹

5. 完成！扩展图标会出现在工具栏

#### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`

2. 点击「临时载入附加组件」

3. 选择 `extension/manifest.json` 文件

4. 完成！

**注意**：Firefox 临时加载的扩展在浏览器重启后会失效，需要重新加载。

### 步骤 3：测试扩展

1. 打开测试页面：https://post.smzdm.com/p/a3gwlgek/

2. 点击工具栏中的 Press 图标（黑底白字 "P"）

3. 等待几秒，会自动打开新标签页显示提取的正文

4. 选择喜欢的主题，点击「打印 / 保存 PDF」

## 故障排除

### 问题 1：点击图标没反应

**原因**：可能是 Readability 库未加载

**解决**：
1. 检查 `extension/libs/readability.js` 是否存在
2. 如果不存在，手动下载：
   ```bash
   curl -o extension/libs/readability.js \
     https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.js
   ```
3. 重新加载扩展

### 问题 2：提示「无法提取正文」

**原因**：当前页面不是文章页面，或页面结构特殊

**解决**：
- 确保页面是文章/博客/新闻页面
- 滚动到文章主体部分再点击提取
- 尝试其他页面测试

### 问题 3：图标不显示

**原因**：图标文件未生成或路径错误

**解决**：
1. 按照「步骤 1」生成图标
2. 确保图标保存在 `extension/icons/` 目录下
3. 重新加载扩展

### 问题 4：主题样式不显示

**原因**：themes 文件夹未复制

**解决**：
```bash
cp -r themes extension/
```

### 问题 5：Firefox 提示 manifest 版本错误

**原因**：Firefox 不支持 Manifest V3

**解决**：修改 `manifest.json`：
```json
{
  "manifest_version": 2,
  "background": {
    "scripts": ["background.js"]
  }
}
```

## 权限说明

扩展需要以下权限：

| 权限 | 用途 | 何时使用 |
|------|------|----------|
| `activeTab` | 读取当前标签页内容 | 仅在点击扩展图标时 |
| `scripting` | 注入内容提取脚本 | 仅在点击扩展图标时 |
| `storage` | 临时存储提取的内容 | 传递数据给新标签页 |

**隐私保证**：
- ✅ 不收集任何数据
- ✅ 不上传任何内容
- ✅ 不追踪用户行为
- ✅ 所有处理都在本地完成

## 使用技巧

### 技巧 1：固定扩展图标

1. 点击工具栏右侧的「扩展」图标（拼图形状）
2. 找到 Press，点击「固定」图钉图标
3. Press 图标会固定显示在工具栏

### 技巧 2：使用右键菜单

在任意网页上右键 → 选择「Press - 提取正文」

### 技巧 3：快速打印

提取正文后，直接按 `Ctrl+P` (Windows) 或 `Cmd+P` (Mac) 打印

### 技巧 4：保存为 PDF

打印对话框中，选择「目标打印机」→「另存为 PDF」

## 下一步

- [ ] 发布到 Chrome Web Store（需要开发者账号，$5 一次性费用）
- [ ] 发布到 Firefox Add-ons（免费）
- [ ] 发布到 Edge Add-ons（免费）
- [ ] 添加快捷键支持
- [ ] 添加选项页面（自定义设置）

## 需要帮助？

- 查看 [README.md](README.md) 了解更多功能
- 查看 [主题设计方案](../doc/theme-design-plan.md) 了解主题系统
- 提交问题：[GitHub Issues](https://github.com/your-repo/print-friendly/issues)
