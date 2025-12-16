# copilot-flow

[![Plugin Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

AI 協作工作流程插件 - 透過 Copilot MCP 實現 Claude 與 Copilot 的自動化協作開發流程

## ✨ 功能

- 🔄 **自動化 5 階段開發流程**（需求分析 → 架構設計 → 實現 → 審查 → 交付）
- 🤖 **智能模型選擇**（根據任務類型自動選擇最適合的 Copilot 模型）
- 👀 **預覽模式**（執行前先展示計劃，確認後執行）
- 🎯 **職責分離**（Copilot 提供建議，Claude 執行代碼修改）
- 🛠️ **錯誤處理**（MCP 不可用時明確提示）
- 📊 **狀態管理**（支持中斷恢復）
- 💡 **可選記憶功能**（建議使用 claude-mem 插件進行進階會話追蹤）

## 🔧 前置需求

### 必需

1. **Claude Code CLI**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Copilot CLI 認證**
   ```bash
   npm install -g @github/copilot
   copilot /login
   ```



## 🚀 安裝

### 快速安裝
```bash
# 添加插件市場
/plugin marketplace add Aykahshi/copilot-flow-plugin

# 安裝插件
/plugin install copilot-flow
```

## 使用方法

### 執行完整工作流程
```
請 Copilot 協助我實現用戶認證功能
```

### 分階段執行
```
/copilot-flow:analyze   # 需求分析
/copilot-flow:design    # 架構設計
/copilot-flow:implement # 實現
/copilot-flow:review    # 審查
/copilot-flow:deliver   # 交付
```

### 快捷方式
```
c-flow:analyze   # 分析需求
c-flow:design    # 設計架構
c-flow:implement # 實現代碼
c-flow:review    # 審查代碼
c-flow:deliver   # 交付成果
```

## 模型選擇規則

- **架構設計與代碼問題** → `claude-sonnet-4.5`
- **Google 生態系** (Flutter/Angular/GCP/Firebase) → `gemini-3-pro-preview`
- **代碼快速 QA** → `claude-haiku-4.5`
- **非代碼快速 QA** → `gpt-5-mini`
- **高難度複雜任務** → `gpt-5.1-codex`

## 工作流程

1. **預覽模式**：Claude 提出初步計劃
2. **確認後執行**：進入 Copilot 交互流程
3. **自動上下文**：利用 Claude 原生記憶維持對話連續性
4. **恢復機制**：可透過會話上下文恢復中斷的工作流程

## 📝 會話記錄（可選）

copilot-flow 專注於工作流程自動化，不包含內建的會話記錄功能。如果您需要進階的記憶和上下文管理，我們建議使用：

### 💡 推薦：claude-mem 插件

[claude-mem](https://github.com/thedotmack/claude-mem) 插件提供強大的記憶功能：

- **自動記憶**：自動捕獲和存儲對話上下文
- **語義搜尋**：查找相關的過往對話
- **長期上下文**：跨多個會話維持上下文

**安裝方式**：
```
/plugin marketplace add thedotmack/claude-mem

/plugin install claude-mem
```

**對 copilot-flow 的好處**：
- 自動記住您的工作流程決策
- 回憶過往的實現和模式
- 為多會話專案提供更好的上下文
- 無需手動管理會話

## ⚠️ 注意事項

- 🎯 **職責分離**：Copilot 僅提供建議，不直接修改代碼
- 💻 **代碼執行**：所有代碼修改由 Claude 根據 Copilot 建議執行
- 🔗 **MCP 依賴**：確保 Copilot MCP 服務器可用
- 💾 **狀態持久化**：工作流程狀態保存在 `.claude/workflow-state.json`
- 📝 **記憶功能**：使用 claude-mem 插件進行進階會話記錄（可選）
- 🔄 **最小依賴**：核心功能開箱即用

## 🛠️ 故障排除

### 驗證 MCP 連接
```bash
node scripts/check-mcp.js
```

### 常見問題

**Q: 命令不顯示在 help 中？**
A: 檢查插件是否正確安裝，重啟 Claude Code

**Q: MCP 連接失敗？**
A: 運行 `node scripts/check-mcp.js` 診斷

**Q: 工作流程卡住？**
A: 刪除 `.claude/workflow-state.json` 重置

## 📚 相關文檔

- [更新日誌](CHANGELOG.md) - 版本更新記錄
- [插件結構](skills/copilot-flow-integration/SKILL.md) - 技術文檔
- [MCP 工具詳解](skills/copilot-mcp-server/SKILL.md) - Copilot MCP 使用指南

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 許可證

MIT License - 見 [LICENSE](LICENSE) 文件