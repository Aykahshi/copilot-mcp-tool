# GitHub Copilot MCP Server

<div align="center">

[![npm version](https://img.shields.io/npm/v/@aykahshi/copilot-mcp-server.svg)](https://www.npmjs.com/package/@aykahshi/copilot-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org)

</div>

一個將 GitHub Copilot CLI 與 MCP 客戶端整合的 Model Context Protocol (MCP) 伺服器。

> **📣 重要聲明**
>
> 感謝 [@leonardommello](https://github.com/leonardommello/copilot-mcp-tool) 的原始創作。這是一個積極維護的分支，以保持專案與最新的 Copilot 功能和支援的模型同步。

## 功能特色

- **9 個工具** - 用於編碼協助的互動式 Copilot 命令
- **2 個資源** - 會話歷史與管理
- **完整 MCP 支援** - 相容 Claude Desktop、Claude Code、Cline 等
- **Claude Code 插件** - 內建完整 AI 協作流程的 Claude Plugin
- **快速命令** - 快速工作流程的捷徑命令（見下方）

---

## 快速開始

### 使用方式：

新增到你的配置檔案：

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**可選：指定模型偏好**

你可以使用 `--prefer` 標誌在 Claude 或 GPT 模型之間選擇作為預設值：

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server", "--prefer", "gpt"]
    }
  }
}
```

可用的偏好設定：
 `--prefer claude` (預設)：所有工具預設都使用 `claude-sonnet-4.6`。可用 Claude 模型：Sonnet 4.6、Sonnet 4.5、Haiku 4.5、Opus 4.7、Sonnet 4
 `--prefer gpt`：所有工具預設都使用 `gpt-5.4`。可用 GPT 模型：gpt-5.4、gpt-5.3-codex、gpt-5.2-codex、gpt-5.2、gpt-5.4-mini、gpt-5-mini、gpt-4.1

**依偏好設定的模型預設值：**

| 工具 | `--prefer claude` | `--prefer gpt` |
|------|-------------------|----------------|
| ask-copilot | claude-sonnet-4.6 | gpt-5.4 |
| copilot-explain | claude-sonnet-4.6 | gpt-5.4 |
| copilot-suggest | claude-sonnet-4.6 | gpt-5.4 |
| copilot-debug | claude-sonnet-4.6 | gpt-5.4 |
| copilot-refactor | claude-sonnet-4.6 | gpt-5.4 |
| copilot-review | claude-sonnet-4.6 | gpt-5.4 |
| copilot-test-generate | claude-sonnet-4.6 | gpt-5.4 |

> **注意：** 你仍然可以在個別工具呼叫中透過指定 `model` 參數來覆蓋預設模型。

### 前置需求

你需要安裝並認證 GitHub Copilot CLI：

```bash
npm install -g @github/copilot
copilot /login
```

---

## Hello World 範例

配置完成後，以下是一個簡單的開始方式：

**在 Claude Desktop（或你的 MCP 客戶端）中：**

```
使用 ask-copilot，提示為「用 JavaScript 寫一個簡單的 Hello World 程式」
```

**回應：**
```javascript
console.log("Hello, World!");
```

就是這樣！你現在可以透過你的 AI 客戶端使用所有 Copilot 工具了。

**更多範例：**
```
使用 copilot-explain 解釋這段代碼：console.log("Hello, World!");

使用 copilot-suggest，任務為「列出當前目錄的檔案」

使用 copilot-debug，代碼為「console.log(messge);」，錯誤為「ReferenceError: messge is not defined」
```

---

## 工具

| 工具 | 描述 | 參數 |
|------|-------------|------------|
| **ask-copilot** | 向 Copilot 詢問編碼協助、除錯、架構 | `prompt`, `context`, `model`, `allowAllTools` |
| **copilot-explain** | 獲得詳細的程式碼解釋 | `code`, `model` |
| **copilot-suggest** | 獲得 CLI 命令建議 | `task`, `model` |
| **copilot-debug** | 除錯程式碼錯誤 | `code`, `error`, `context` |
| **copilot-refactor** | 獲得重構建議 | `code`, `goal` |
| **copilot-test-generate** | 生成單元測試 | `code`, `framework` |
| **copilot-review** | 獲得帶反饋的程式碼審查 | `code`, `focusAreas` |
| **copilot-session-start** | 啟動新的對話會話 | - |
| **copilot-session-history** | 獲取會話歷史 | `sessionId` |

---

## 資源

| 資源 | URI | 描述 |
|----------|-----|-------------|
| **session-history** | `copilot://session/{sessionId}/history` | 存取會話的對話歷史 |
| **sessions-list** | `copilot://sessions` | 列出所有活動會話 |

---

## 🧩 插件

此儲存庫包含可立即使用的插件，擴展功能：

### copilot-flow

**AI 協作工作流程插件** - 在 Claude 與 GitHub Copilot 之間自動化結構化的 5 階段開發流程。

**功能特色：**
- 🔄 **5 階段工作流程**：分析 → 設計 → 實現 → 審查 → 交付
- 🤖 **智能模型選擇**：根據任務類型自動選擇最佳 Copilot 模型
- 👀 **預覽模式**：執行前顯示執行計劃
- 🔄 **恢復機制**：透過會話 ID 恢復中斷的工作流程

**快速安裝：**
```bash
/plugin marketplace add Poorgramer-Zack/copilot-mcp-tool
/plugin install copilot-flow
```

**了解更多**：[copilot-flow 文檔](plugins/copilot-flow/README-zh.md)

---

## 🔌 AI 客戶端整合

此 MCP 伺服器可與**任何 MCP 相容的客戶端**配合使用。以下是熱門 AI 編碼助手的詳細設定說明。

### 📘 Claude Desktop（推薦）

Claude Desktop 是此 MCP 伺服器最受測試且推薦的客戶端。

**配置路徑：**
- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**：`~/.config/Claude/claude_desktop_config.json`

**方法 1：NPX（無需安裝）**
```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**方法 2：全域安裝**
```bash
npm install -g @aykahshi/copilot-mcp-server
```

然後新增到配置：
```json
{
  "mcpServers": {
    "copilot": {
      "command": "copilot-mcp-server"
    }
  }
}
```

**方法 3：本地開發**
```json
{
  "mcpServers": {
    "copilot": {
      "command": "node",
      "args": ["/absolute/path/to/copilot-mcp-tool/dist/esm/copilot/index.js"]
    }
  }
}
```

**設定後：**
1. 重啟 Claude Desktop
2. 查看右下角的 🔌 圖示
3. 點擊它以在已連接的伺服器列表中看到「copilot」

---

### 🖥️ Claude Code（CLI）

Claude Code 透過 CLI 提供最快的設定體驗。

**快速設定：**
```bash
# 使用 npx（無需安裝）
claude mcp add copilot -- npx -y @aykahshi/copilot-mcp-server

# 或使用全域安裝
npm install -g @aykahshi/copilot-mcp-server
claude mcp add copilot copilot-mcp-server
```

**從 Claude Desktop 匯入：**
```bash
# 如果你已經配置了 Claude Desktop
claude mcp add-from-claude-desktop
```

**驗證連接：**
```bash
claude mcp list
# 應該顯示：copilot (connected)
```

**在聊天中使用：**
```bash
/mcp  # 檢查伺服器狀態
```

---

### 🎯 Cursor

Cursor 支援一鍵安裝和手動安裝。

**方法 1：手動配置**

編輯 `~/.cursor/mcp.json`（如果不存在則建立）：

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**方法 2：設定介面**
1. 開啟 Cursor 設定（Cmd/Ctrl + ,）
2. 搜尋「MCP」
3. 點擊「Add MCP Server」
4. 名稱：`copilot`
5. 命令：`npx -y @aykahshi/copilot-mcp-server`

---

### 🔧 VS Code 與 Cline 擴充功能

[Cline](https://github.com/cline/cline) 是一個熱門的 MCP 相容 VS Code 擴充功能。

**設定：**

1. 從 VS Code 市集安裝 Cline 擴充功能
2. 開啟 Cline 設定（Cline 面板中的齒輪圖示）
3. 導航到「MCP Servers」區段
4. 新增伺服器：

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**或者**，編輯 VS Code 的 `settings.json`：
```json
{
  "cline.mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

---

### ⚡ Zed Editor

Zed 內建原生 MCP 支援。

**配置檔案：** `~/.config/zed/mcp.json`

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**或使用 Zed 的介面：**
1. 開啟 Zed 設定（Cmd/Ctrl + ,）
2. 前往「Extensions」→「MCP」
3. 使用命令新增伺服器：`npx -y @aykahshi/copilot-mcp-server`

---

### 🔮 Windsurf

**配置路徑：** `~/.windsurf/mcp.json`

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

---

### 🚀 其他 MCP 客戶端

此伺服器與**任何符合 MCP 標準的客戶端**相容。通用配置：

```json
{
  "mcpServers": {
    "copilot": {
      "command": "npx",
      "args": ["-y", "@aykahshi/copilot-mcp-server"]
    }
  }
}
```

**其他相容客戶端：**
- **Amp** - 配置在 `~/.amp/mcp.json`
- **Augment Code** - IDE 中的 MCP 設定
- **Roo Code** - 透過設定面板
- **Qwen Coder** - CLI：`qwen mcp add copilot`
- **Gemini CLI** - 專案與全域支援
- **JetBrains AI Assistant** - 所有 JetBrains IDE

---

## ✅ 相容性矩陣

| 客戶端 | 狀態 | 安裝方式 | 備註 |
|--------|--------|-------------------|-------|
| [Claude Desktop](https://claude.ai/download) | ✅ **已測試** | JSON 配置 | 最穩定，推薦使用 |
| [Claude Code](https://docs.claude.com/en/docs/claude-code) | ✅ **已測試** | CLI 命令 | 最快設定 |
| [Cursor](https://cursor.sh/) | ✅ 相容 | JSON / UI | 多種設定選項 |
| [Cline (VS Code)](https://github.com/cline/cline) | ✅ 相容 | 擴充功能設定 | VS Code 整合 |
| [Zed](https://zed.dev/) | ✅ 相容 | 原生 MCP 支援 | 內建介面 |
| [Windsurf](https://windsurf.ai/) | ✅ 相容 | JSON 配置 | 簡單設定 |
| 其他 MCP 客戶端 | ✅ 相容 | 標準 MCP 協定 | 通用支援 |

---

## 運作原理

此 MCP 伺服器作為 MCP 客戶端與 GitHub Copilot CLI 之間的橋樑：

1. **MCP 客戶端**（Claude Desktop）→ 透過 MCP 協定呼叫工具
2. **MCP 伺服器**（本套件）→ 轉換為 Copilot CLI 命令
3. **GitHub Copilot CLI** → 處理請求並返回回應
4. **MCP 伺服器** → 將格式化的回應返回給客戶端

**優點：**
- 直接在 Claude 對話中使用 Copilot 的 AI 模型
- 跨交互維護會話歷史
- 存取專門的 Copilot 功能（解釋、除錯、審查等）
- 無需在工具之間切換

---

## AI 模型

從可用模型中選擇：
- `auto`
- `gpt-5.4`（目前 Copilot CLI picker 預設）
- `gpt-5.3-codex`
- `gpt-5.2-codex`
- `gpt-5.2`
- `gpt-5.4-mini`
- `gpt-5-mini`
- `gpt-4.1`
- `claude-sonnet-4.6`（本 MCP 的 Claude 預設）
- `claude-sonnet-4.5`
- `claude-haiku-4.5`
- `claude-opus-4.7`
- `claude-sonnet-4`

你可以透過 copilot cli 的 `/model` 命令查看所有可用模型。

**無限制模型（0x cost in usage）**：`gpt-5-mini` 和 `gpt-4.1` 可在 GitHub Copilot Pro 及以上訂閱中無限使用。

範例：
```
使用 ask-copilot，模型為「claude-sonnet-4.6」，提示為「解釋 async/await」
使用 ask-copilot，模型為「gpt-5-mini」，提示為「快速程式碼審查」
```

---

## 系統需求

- **Node.js**：>= 22.0.0
- **npm**：>= 10.0.0
- **GitHub Copilot 訂閱**：必需（[取得 Copilot](https://github.com/features/copilot)）
- **GitHub Copilot CLI**：必須安裝並認證
  ```bash
  npm install -g @github/copilot
  copilot /login
  ```

---

## 故障排除

### 常見問題

**❌ 「copilot 命令找不到」**
```bash
# 安裝 GitHub Copilot CLI
npm install -g @github/copilot

# 驗證安裝
copilot --version
```

**❌ 「未認證」**
```bash
# 登入 GitHub Copilot
copilot /login

# 在瀏覽器中跟隨認證流程
```

**❌ 「Node.js 版本太舊」**
```bash
# 檢查你的 Node.js 版本
node --version  # 必須 >= 22.0.0

# 更新 Node.js
# 使用 nvm（推薦）
nvm install 22
nvm use 22

# 或從 nodejs.org 下載
```

**❌ 「MCP 伺服器無回應」**
```bash
# 直接測試伺服器
npx -y @aykahshi/copilot-mcp-server

# 檢查 Claude Desktop 日誌
# macOS：~/Library/Logs/Claude/
# Windows：%APPDATA%\Claude\logs\
```

---

## 常見問題

**Q：我需要 GitHub Copilot 訂閱嗎？**
A：是的，此 MCP 伺服器需要有效的 GitHub Copilot 訂閱和已安裝的 Copilot CLI。

**Q：我可以在 Claude Desktop 上使用嗎？**
A：可以！這是主要使用場景。只需將配置新增到 `claude_desktop_config.json`。

**Q：這能與 VS Code 配合使用嗎？**
A：可以，透過 Cline 擴充功能或任何其他 MCP 相容的 VS Code 擴充功能。

**Q：這與直接使用 Copilot 有什麼不同？**
A：這允許你在 Claude 對話中使用 Copilot 的功能，結合兩個 AI 助手。

**Q：我的程式碼會同時發送到 GitHub 和 Anthropic 嗎？**
A：你在對話中分享的程式碼會透過 Claude 的 MCP 協定傳送到 Copilot CLI，由其根據 GitHub 的隱私政策處理。

---

## 開發

### 從原始碼建置

```bash
# 複製儲存庫
git clone https://github.com/Poorgramer-Zack/copilot-mcp-tool.git
cd copilot-mcp-tool

# 安裝依賴
npm install

# 建置專案
npm run build

# 本地執行
npm start

# 執行測試
npm test
```

### 貢獻

歡迎貢獻！請：

1. Fork 儲存庫
2. 建立功能分支（`git checkout -b feature/amazing-feature`）
3. 提交你的變更（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 開啟 Pull Request

---

## 什麼是 MCP？

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) 是一個開放協定，使 AI 應用程式能夠安全地從不同來源存取資料和工具。可以將其視為 AI 助手的通用連接器。

**關鍵概念：**
- **伺服器**（如本套件）：提供工具、資源和提示
- **客戶端**（如 Claude Desktop）：在對話中使用這些功能
- **工具**：AI 可以執行的動作（如呼叫 GitHub Copilot）
- **資源**：AI 可以存取的資料（如會話歷史）
- **提示**：常見工作流程的模板

在 [modelcontextprotocol.io](https://modelcontextprotocol.io) 了解更多

---

## 連結

- 📦 **npm 套件**：https://www.npmjs.com/package/@aykahshi/copilot-mcp-server
- 💻 **GitHub 儲存庫**：https://github.com/Poorgramer-Zack/copilot-mcp-tool
- 🐛 **回報問題**：https://github.com/Poorgramer-Zack/copilot-mcp-tool/issues
- 🤖 **GitHub Copilot**：https://github.com/features/copilot
- 🔗 **Model Context Protocol**：https://modelcontextprotocol.io

---

## 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 作者

原始創建者：**Leonardo M. Mello** ([@leonardommello](https://github.com/leonardommello))
Fork 與維護者：**Aykahshi** ([@Aykahshi](https://github.com/Aykahshi))

---

<div align="center">

Made with ❤️ for the AI coding community

</div>
