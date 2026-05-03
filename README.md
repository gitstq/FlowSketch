<p align="center">
  <b>🇨🇳 <a href="#简体中文">简体中文</a> | 🇹🇼 <a href="#繁體中文">繁體中文</a> | 🇺🇸 <a href="#english">English</a></b>
</p>

---

<h1 align="center">FlowSketch</h1>

<p align="center">
  <strong>轻量级在线图表编辑器</strong><br>
  基于 HTML5 Canvas + TypeScript + Vite 构建<br>
  <a href="https://github.com/gitstq/FlowSketch">GitHub</a> | MIT License
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.1+-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Dependencies-0-blue?style=flat-square" alt="Zero Dependencies">
</p>

<!-- 截图占位 -->
<p align="center">
  <img src="https://via.placeholder.com/800x450?text=FlowSketch+Demo+Screenshot" alt="FlowSketch Demo" width="800">
</p>

---

<a id="简体中文"></a>

## 🎉 简体中文

### 🎉 项目介绍

**FlowSketch** 是一款轻量级的在线图表编辑器，专为追求简洁与效率的用户而设计。

在当今的工具生态中，主流的图表编辑器要么功能臃肿、加载缓慢，要么依赖大量第三方库导致体积膨胀。FlowSketch 正是为了解决这些痛点而生——它以 **零运行时依赖** 的极致轻量架构，提供了从基础流程图到自由手绘的完整绘图能力。

**核心价值：**
- 🪶 **极致轻量** —— 零外部运行时依赖，构建产物体积极小，加载即用
- 🎨 **双模编辑** —— 拖拽式可视化编辑 + Mermaid 风格代码编辑，随心切换
- ⚡ **开箱即用** —— 无需注册、无需安装，打开浏览器即可开始创作
- 🌙 **主题切换** —— 深色 / 浅色主题一键切换，适配不同工作环境

**灵感来源：** FlowSketch 的设计灵感来自 Mermaid 的简洁语法与 Excalidraw 的流畅手绘体验，旨在将两者的优势融合为一个轻量、高效的在线绘图工具。

---

### ✨ 核心功能

- 📐 **6 种基础图形** —— 矩形、椭圆、菱形、文本、线条/箭头、自由手绘
- 🖱️ **拖拽式编辑** —— 直观的可视化操作，所见即所得
- 💻 **代码编辑模式** —— 类 Mermaid 语法，用代码定义图表结构
- 🌙 **深色 / 浅色主题** —— 一键切换，保护你的眼睛
- 📤 **多格式导出** —— 支持 **PNG**、**SVG**、**JSON** 三种导出格式
- 💾 **自动保存** —— 编辑内容自动保存至 **localStorage**，关闭浏览器也不丢失
- 🗺️ **小地图导航** —— 画布缩略图，快速定位与导航
- ⌨️ **丰富的快捷键** —— 键盘操作流，大幅提升编辑效率
- 📦 **零运行时依赖** —— 不依赖任何第三方运行时库，极致轻量

---

### 🚀 快速开始

#### 环境要求

| 依赖 | 最低版本 |
|------|---------|
| **Node.js** | >= 18 |
| **npm** | >= 9 |

#### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/gitstq/FlowSketch.git
cd FlowSketch

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

启动开发服务器后，在浏览器中打开终端输出的地址（默认为 `http://localhost:5173`）即可开始使用。

---

### 📖 详细使用指南

#### 工具栏与图形工具

FlowSketch 提供 6 种图形工具，可通过左侧工具栏或快捷键切换：

| 工具 | 快捷键 | 说明 |
|------|--------|------|
| 选择工具 | `V` | 选中、移动、缩放图形 |
| 矩形 | `R` | 绘制矩形/方框 |
| 椭圆 | `E` | 绘制椭圆/圆形 |
| 菱形 | `D` | 绘制菱形（常用于决策节点） |
| 文本 | `T` | 添加文本标注 |
| 线条/箭头 | `L` | 绘制连接线与箭头 |
| 自由手绘 | `F` | 自由绘制任意形状 |

#### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `V` | 选择工具 |
| `R` | 矩形工具 |
| `E` | 椭圆工具 |
| `D` | 菱形工具 |
| `T` | 文本工具 |
| `L` | 线条/箭头工具 |
| `F` | 自由手绘工具 |
| `Delete` / `Backspace` | 删除选中图形 |
| `Ctrl + Z` | 撤销 |
| `Ctrl + Y` / `Ctrl + Shift + Z` | 重做 |
| `Ctrl + A` | 全选 |
| `Ctrl + C` | 复制 |
| `Ctrl + V` | 粘贴 |
| `Ctrl + S` | 保存到文件 |
| `Space + 拖拽` | 平移画布 |
| `Ctrl + 滚轮` | 缩放画布 |
| `Ctrl + Shift + E` | 切换代码编辑器 |

#### 代码编辑器语法

通过 `Ctrl + Shift + E` 切换到代码编辑模式，使用简洁的文本语法定义图表：

```
[开始] --> [处理数据]
{是否通过?} -->|是| [保存结果]
{是否通过?} -->|否| [重新处理]
(开始) --> [流程步骤]
```

**语法规则：**
- `[文本]` —— 矩形节点
- `(文本)` —— 椭圆节点（起止点）
- `{文本}` —— 菱形节点（判断/决策）
- `-->` —— 带箭头的连接线
- `-->|标签|` —— 带标签的连接线

#### 典型使用场景

- 🏗️ **软件架构设计** —— 绘制系统架构图、模块关系图
- 🔄 **业务流程梳理** —— 梳理业务流程、决策逻辑
- 📝 **技术文档配图** —— 为技术文档快速生成流程图
- 🎓 **教学演示** —— 课堂教学中实时绘制示意图
- 💡 **头脑风暴** —— 快速记录和整理创意想法

---

### 💡 设计理念与路线图

#### 设计理念

FlowSketch 遵循以下核心设计原则：

1. **极简主义** —— 不追求功能的大而全，而是聚焦核心绘图体验，做到每个功能都精雕细琢
2. **零依赖哲学** —— 运行时不依赖任何第三方库，确保加载速度和长期可维护性
3. **双模融合** —— 可视化编辑与代码编辑并非对立，而是互补。让用户自由选择最适合的工作方式
4. **渐进增强** —— 核心功能稳定可靠，在此基础上逐步添加高级特性

#### 技术栈选择

| 技术 | 选择理由 |
|------|---------|
| **HTML5 Canvas** | 高性能 2D 渲染，适合图形密集型应用 |
| **TypeScript** | 类型安全，提升代码质量与开发体验 |
| **Vite** | 极速的开发体验与优化的生产构建 |

#### 未来计划

- [ ] 🔗 **协同编辑** —— 支持多人实时协作
- [ ] 📚 **模板库** —— 内置常用图表模板
- [ ] 🎨 **自定义样式** —— 支持图形颜色、边框、阴影等样式自定义
- [ ] 📐 **对齐与辅助线** —— 智能对齐与吸附功能
- [ ] 🔌 **插件系统** —— 支持第三方扩展

欢迎社区贡献！如果你有好的想法，欢迎提交 Issue 或 PR。

---

### 📦 构建与部署指南

#### 构建命令

```bash
# 构建生产版本（输出到 dist/ 目录）
npm run build

# 本地预览构建结果
npm run preview
```

#### 部署选项

**Vercel**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 一键部署
vercel
```

**Netlify**

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 构建并部署
netlify deploy --prod --dir=dist
```

**GitHub Pages**

```bash
# 安装 gh-pages
npm i -g gh-pages

# 构建后部署
npm run build
gh-pages -d dist
```

**Docker**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
# 构建并运行 Docker 容器
docker build -t flowsketch .
docker run -p 8080:80 flowsketch
```

> **环境要求：** 生产部署仅需一个支持静态文件服务的 Web 服务器（Nginx、Apache、CDN 等），无需 Node.js 运行环境。

---

### 🤝 参与贡献

我们欢迎并感谢每一位贡献者！无论是提交 Bug 报告、改进文档，还是贡献代码，都是对项目的宝贵支持。

#### 提交 Pull Request

1. **Fork** 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "feat: 添加某某功能"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 **Pull Request**

#### 提交规范

请遵循 [Angular 提交约定](https://conventionalcommits.org/)：

| 前缀 | 用途 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | Bug 修复 |
| `docs:` | 文档更新 |
| `style:` | 代码格式调整 |
| `refactor:` | 代码重构 |
| `test:` | 测试相关 |
| `chore:` | 构建/工具变更 |

#### 报告 Issue

提交 Bug 报告时，请尽量包含以下信息：

- 🖥️ 操作系统与浏览器版本
- 📋 复现问题的详细步骤
- ❓ 期望行为 vs 实际行为
- 📸 相关截图（如有）

---

### 📄 许可证

FlowSketch 基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

Copyright (c) 2026 [gitstq](https://github.com/gitstq)

---

<a id="繁體中文"></a>

## 🎉 繁體中文

### 🎉 專案介紹

**FlowSketch** 是一款輕量級的線上圖表編輯器，專為追求簡潔與效率的使用者而設計。

在當今的工具生態中，主流的圖表編輯器要麼功能臃腫、載入緩慢，要麼依賴大量第三方函式庫導致體積膨脹。FlowSketch 正是為了解決這些痛點而生——它以 **零執行期依賴** 的極致輕量架構，提供了從基礎流程圖到自由手繪的完整繪圖能力。

**核心價值：**
- 🪶 **極致輕量** —— 零外部執行期依賴，建構產物體積極小，載入即用
- 🎨 **雙模編輯** —— 拖曳式視覺化編輯 + Mermaid 風格程式碼編輯，隨心切換
- ⚡ **開箱即用** —— 無需註冊、無需安裝，打開瀏覽器即可開始創作
- 🌙 **主題切換** —— 深色 / 淺色主題一鍵切換，適配不同工作環境

**靈感來源：** FlowSketch 的設計靈感來自 Mermaid 的簡潔語法與 Excalidraw 的流暢手繪體驗，旨在將兩者的優勢融合為一個輕量、高效的線上繪圖工具。

---

### ✨ 核心功能

- 📐 **6 種基礎圖形** —— 矩形、橢圓、菱形、文字、線條/箭頭、自由手繪
- 🖱️ **拖曳式編輯** —— 直觀的視覺化操作，所見即所得
- 💻 **程式碼編輯模式** —— 類 Mermaid 語法，用程式碼定義圖表結構
- 🌙 **深色 / 淺色主題** —— 一鍵切換，保護你的雙眼
- 📤 **多格式匯出** —— 支援 **PNG**、**SVG**、**JSON** 三種匯出格式
- 💾 **自動儲存** —— 編輯內容自動儲存至 **localStorage**，關閉瀏覽器也不遺失
- 🗺️ **小地圖導航** —— 畫布縮圖，快速定位與導航
- ⌨️ **豐富的快捷鍵** —— 鍵盤操作流，大幅提升編輯效率
- 📦 **零執行期依賴** —— 不依賴任何第三方執行期函式庫，極致輕量

---

### 🚀 快速開始

#### 環境需求

| 依賴 | 最低版本 |
|------|---------|
| **Node.js** | >= 18 |
| **npm** | >= 9 |

#### 安裝與執行

```bash
# 複製仓库
git clone https://github.com/gitstq/FlowSketch.git
cd FlowSketch

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽建構結果
npm run preview
```

啟動開發伺服器後，在瀏覽器中打開終端輸出的網址（預設為 `http://localhost:5173`）即可開始使用。

---

### 📖 詳細使用指南

#### 工具列與圖形工具

FlowSketch 提供 6 種圖形工具，可透過左側工具列或快捷鍵切換：

| 工具 | 快捷鍵 | 說明 |
|------|--------|------|
| 選擇工具 | `V` | 選取、移動、縮放圖形 |
| 矩形 | `R` | 繪製矩形/方框 |
| 橢圓 | `E` | 繪製橢圓/圓形 |
| 菱形 | `D` | 繪製菱形（常用於決策節點） |
| 文字 | `T` | 新增文字標註 |
| 線條/箭頭 | `L` | 繪製連接線與箭頭 |
| 自由手繪 | `F` | 自由繪製任意形狀 |

#### 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `V` | 選擇工具 |
| `R` | 矩形工具 |
| `E` | 橢圓工具 |
| `D` | 菱形工具 |
| `T` | 文字工具 |
| `L` | 線條/箭頭工具 |
| `F` | 自由手繪工具 |
| `Delete` / `Backspace` | 刪除選取圖形 |
| `Ctrl + Z` | 復原 |
| `Ctrl + Y` / `Ctrl + Shift + Z` | 重做 |
| `Ctrl + A` | 全選 |
| `Ctrl + C` | 複製 |
| `Ctrl + V` | 貼上 |
| `Ctrl + S` | 儲存至檔案 |
| `Space + 拖曳` | 平移畫布 |
| `Ctrl + 滾輪` | 縮放畫布 |
| `Ctrl + Shift + E` | 切換程式碼編輯器 |

#### 程式碼編輯器語法

透過 `Ctrl + Shift + E` 切換到程式碼編輯模式，使用簡潔的文字語法定義圖表：

```
[開始] --> [處理資料]
{是否通過?} -->|是| [儲存結果]
{是否通過?} -->|否| [重新處理]
(開始) --> [流程步驟]
```

**語法規則：**
- `[文字]` —— 矩形節點
- `(文字)` —— 橢圓節點（起止點）
- `{文字}` —— 菱形節點（判斷/決策）
- `-->` —— 帶箭頭的連接線
- `-->|標籤|` —— 帶標籤的連接線

#### 典型使用情境

- 🏗️ **軟體架構設計** —— 繪製系統架構圖、模組關係圖
- 🔄 **業務流程梳理** —— 梳理業務流程、決策邏輯
- 📝 **技術文件配圖** —— 為技術文件快速生成流程圖
- 🎓 **教學演示** —— 課堂教學中即時繪製示意圖
- 💡 **腦力激盪** —— 快速記錄和整理創意想法

---

### 💡 設計理念與路線圖

#### 設計理念

FlowSketch 遵循以下核心設計原則：

1. **極簡主義** —— 不追求功能的大而全，而是聚焦核心繪圖體驗，做到每個功能都精雕細琢
2. **零依賴哲學** —— 執行期不依賴任何第三方函式庫，確保載入速度和長期可維護性
3. **雙模融合** —— 視覺化編輯與程式碼編輯並非對立，而是互補。讓使用者自由選擇最適合的工作方式
4. **漸進增強** —— 核心功能穩定可靠，在此基礎上逐步新增進階特性

#### 技術棧選擇

| 技術 | 選擇理由 |
|------|---------|
| **HTML5 Canvas** | 高效能 2D 渲染，適合圖形密集型應用 |
| **TypeScript** | 型別安全，提升程式碼品質與開發體驗 |
| **Vite** | 極速的開發體驗與最佳化的生產建構 |

#### 未來計畫

- [ ] 🔗 **協同編輯** —— 支援多人即時協作
- [ ] 📚 **範本庫** —— 內建常用圖表範本
- [ ] 🎨 **自訂樣式** —— 支援圖形顏色、邊框、陰影等樣式自訂
- [ ] 📐 **對齊與輔助線** —— 智慧對齊與吸附功能
- [ ] 🔌 **外掛系統** —— 支援第三方擴充

歡迎社群貢獻！如果你有好的想法，歡迎提交 Issue 或 PR。

---

### 📦 建構與部署指南

#### 建構指令

```bash
# 建構生產版本（輸出至 dist/ 目錄）
npm run build

# 本機預覽建構結果
npm run preview
```

#### 部署選項

**Vercel**

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 一鍵部署
vercel
```

**Netlify**

```bash
# 安裝 Netlify CLI
npm i -g netlify-cli

# 建構並部署
netlify deploy --prod --dir=dist
```

**GitHub Pages**

```bash
# 安裝 gh-pages
npm i -g gh-pages

# 建構後部署
npm run build
gh-pages -d dist
```

**Docker**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
# 建構並執行 Docker 容器
docker build -t flowsketch .
docker run -p 8080:80 flowsketch
```

> **環境需求：** 生產部署僅需一個支援靜態檔案服務的 Web 伺服器（Nginx、Apache、CDN 等），無需 Node.js 執行環境。

---

### 🤝 參與貢獻

我們歡迎並感謝每一位貢獻者！無論是提交 Bug 回報、改進文件，還是貢獻程式碼，都是對專案的寶貴支持。

#### 提交 Pull Request

1. **Fork** 本倉庫
2. 建立特性分支：`git checkout -b feature/your-feature`
3. 提交變更：`git commit -m "feat: 新增某某功能"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 **Pull Request**

#### 提交規範

請遵循 [Angular 提交約定](https://conventionalcommits.org/)：

| 前綴 | 用途 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | Bug 修復 |
| `docs:` | 文件更新 |
| `style:` | 程式碼格式調整 |
| `refactor:` | 程式碼重構 |
| `test:` | 測試相關 |
| `chore:` | 建構/工具變更 |

#### 回報 Issue

提交 Bug 回報時，請盡量包含以下資訊：

- 🖥️ 作業系統與瀏覽器版本
- 📋 重現問題的詳細步驟
- ❓ 期望行為 vs 實際行為
- 📸 相關截圖（如有）

---

### 📄 授權條款

FlowSketch 基於 [MIT License](https://opensource.org/licenses/MIT) 開源。

Copyright (c) 2026 [gitstq](https://github.com/gitstq)

---

<a id="english"></a>

## 🎉 English

### 🎉 Introduction

**FlowSketch** is a lightweight online diagram editor designed for users who value simplicity and efficiency.

In today's tooling landscape, mainstream diagram editors are either bloated with features and slow to load, or they depend on heavy third-party libraries that inflate bundle size. FlowSketch was born to solve these pain points — it delivers a complete diagramming experience, from basic flowcharts to freehand sketches, with a **zero runtime dependency** architecture that is incredibly lightweight.

**Core Value:**
- 🪶 **Ultra Lightweight** —— Zero external runtime dependencies, minimal bundle size, ready to use instantly
- 🎨 **Dual-Mode Editing** —— Drag-and-drop visual editor + Mermaid-style code editor, switch freely
- ⚡ **Ready Out of the Box** —— No sign-up, no installation — just open your browser and start creating
- 🌙 **Theme Toggle** —— Dark / Light theme with one click, adapting to any work environment

**Inspiration:** FlowSketch draws inspiration from Mermaid's concise syntax and Excalidraw's fluid freehand experience, aiming to combine the best of both worlds into a lightweight, efficient online diagramming tool.

---

### ✨ Core Features

- 📐 **6 Shape Types** —— Rectangle, Ellipse, Diamond, Text, Line/Arrow, Freehand
- 🖱️ **Drag-and-Drop Editing** —— Intuitive visual operations, WYSIWYG
- 💻 **Code Editor Mode** —— Mermaid-like syntax to define diagram structure with code
- 🌙 **Dark / Light Theme** —— One-click toggle to protect your eyes
- 📤 **Multi-Format Export** —— Export to **PNG**, **SVG**, and **JSON**
- 💾 **Auto-Save** —— Edits are automatically saved to **localStorage**, never lose your work
- 🗺️ **Minimap Navigation** —— Canvas thumbnail for quick orientation and navigation
- ⌨️ **Rich Keyboard Shortcuts** —— Keyboard-driven workflow for maximum productivity
- 📦 **Zero Runtime Dependencies** —— No third-party runtime libraries, truly lightweight

---

### 🚀 Quick Start

#### Prerequisites

| Dependency | Minimum Version |
|------------|----------------|
| **Node.js** | >= 18 |
| **npm** | >= 9 |

#### Installation & Running

```bash
# Clone the repository
git clone https://github.com/gitstq/FlowSketch.git
cd FlowSketch

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the build output
npm run preview
```

After starting the dev server, open the URL shown in your terminal (default: `http://localhost:5173`) in your browser.

---

### 📖 Detailed Usage Guide

#### Toolbar & Shape Tools

FlowSketch provides 6 shape tools, accessible via the left sidebar or keyboard shortcuts:

| Tool | Shortcut | Description |
|------|----------|-------------|
| Select | `V` | Select, move, and resize shapes |
| Rectangle | `R` | Draw rectangles / boxes |
| Ellipse | `E` | Draw ellipses / circles |
| Diamond | `D` | Draw diamonds (commonly used for decisions) |
| Text | `T` | Add text labels |
| Line/Arrow | `L` | Draw connection lines and arrows |
| Freehand | `F` | Draw freely with your mouse |

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `V` | Select tool |
| `R` | Rectangle tool |
| `E` | Ellipse tool |
| `D` | Diamond tool |
| `T` | Text tool |
| `L` | Line/Arrow tool |
| `F` | Freehand tool |
| `Delete` / `Backspace` | Delete selected shape |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |
| `Ctrl + A` | Select all |
| `Ctrl + C` | Copy |
| `Ctrl + V` | Paste |
| `Ctrl + S` | Save to file |
| `Space + Drag` | Pan canvas |
| `Ctrl + Scroll` | Zoom canvas |
| `Ctrl + Shift + E` | Toggle code editor |

#### Code Editor Syntax

Press `Ctrl + Shift + E` to switch to code editing mode. Define your diagram using a concise text syntax:

```
[Start] --> [Process Data]
{Passed?} -->|Yes| [Save Result]
{Passed?} -->|No| [Retry]
(Start) --> [Process Step]
```

**Syntax Rules:**
- `[text]` —— Rectangle node
- `(text)` —— Ellipse node (start/end points)
- `{text}` —— Diamond node (decision/condition)
- `-->` —— Arrow connection
- `-->|label|` —— Labeled arrow connection

#### Typical Use Cases

- 🏗️ **Software Architecture** —— Design system architecture and module relationship diagrams
- 🔄 **Business Process Mapping** —— Map out workflows and decision logic
- 📝 **Technical Documentation** —— Quickly generate flowcharts for docs and specs
- 🎓 **Teaching & Presentations** —— Draw diagrams in real-time during lectures
- 💡 **Brainstorming** —— Rapidly capture and organize creative ideas

---

### 💡 Design Philosophy & Roadmap

#### Design Philosophy

FlowSketch follows these core design principles:

1. **Minimalism** —— Rather than chasing feature completeness, we focus on delivering a polished core diagramming experience where every feature is thoughtfully crafted
2. **Zero-Dependency Philosophy** —— No third-party runtime libraries, ensuring fast load times and long-term maintainability
3. **Dual-Mode Synergy** —— Visual editing and code editing are not opposites — they complement each other. Users should freely choose the workflow that suits them best
4. **Progressive Enhancement** —— A rock-solid core with advanced features added incrementally over time

#### Tech Stack

| Technology | Rationale |
|------------|-----------|
| **HTML5 Canvas** | High-performance 2D rendering, ideal for graphics-intensive applications |
| **TypeScript** | Type safety for better code quality and developer experience |
| **Vite** | Blazing-fast development server and optimized production builds |

#### Roadmap

- [ ] 🔗 **Real-Time Collaboration** —— Multi-user editing support
- [ ] 📚 **Template Gallery** —— Built-in templates for common diagram types
- [ ] 🎨 **Custom Styling** —— Colors, borders, shadows, and more for shapes
- [ ] 📐 **Smart Alignment** —— Alignment guides and snap-to-grid functionality
- [ ] 🔌 **Plugin System** —— Third-party extension support

Community contributions are welcome! If you have ideas, feel free to open an Issue or submit a PR.

---

### 📦 Build & Deploy Guide

#### Build Commands

```bash
# Build for production (output to dist/ directory)
npm run build

# Preview the build locally
npm run preview
```

#### Deployment Options

**Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with one command
vercel
```

**Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=dist
```

**GitHub Pages**

```bash
# Install gh-pages
npm i -g gh-pages

# Build and deploy
npm run build
gh-pages -d dist
```

**Docker**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
# Build and run the Docker container
docker build -t flowsketch .
docker run -p 8080:80 flowsketch
```

> **Requirements:** For production deployment, you only need a static file server (Nginx, Apache, CDN, etc.). No Node.js runtime is required.

---

### 🤝 Contributing

We welcome and appreciate every contributor! Whether it's filing a bug report, improving documentation, or contributing code, every contribution matters.

#### Submitting a Pull Request

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add some feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a **Pull Request**

#### Commit Convention

Please follow the [Angular Commit Convention](https://conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation updates |
| `style:` | Code formatting changes |
| `refactor:` | Code refactoring |
| `test:` | Test additions or modifications |
| `chore:` | Build process or tooling changes |

#### Reporting Issues

When filing a bug report, please include:

- 🖥️ Operating system and browser version
- 📋 Detailed steps to reproduce the issue
- ❓ Expected behavior vs. actual behavior
- 📸 Relevant screenshots (if applicable)

---

### 📄 License

FlowSketch is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).

Copyright (c) 2026 [gitstq](https://github.com/gitstq)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq">gitstq</a>
</p>
