# 發佈流程指南

本專案使用**手動 tag** 來觸發發佈流程，確保對每次發佈有完全的控制。

---

## 📋 發佈流程總覽

1. 更新程式碼和版本號
2. 提交並推送到 `main` 分支
3. 建立並推送 tag
4. GitHub Actions 自動發佈到 npm

---

## 🚀 詳細步驟

### **步驟 1：更新版本號**

編輯 `package.json`，更新 `version` 欄位：

```bash
# 使用 npm version 命令（推薦）
npm version patch   # 2.0.0 -> 2.0.1
npm version minor   # 2.0.0 -> 2.1.0
npm version major   # 2.0.0 -> 3.0.0

# 或手動編輯 package.json
```

**Semantic Versioning 指南：**
- **Patch** (`x.x.1`) - Bug 修復、小改進
- **Minor** (`x.1.0`) - 新功能（向後相容）
- **Major** (`1.0.0`) - Breaking changes

---

### **步驟 2：提交變更**

```bash
# Stage 所有變更
git add .

# 提交（使用語意化 commit message）
git commit -m "chore: bump version to 2.0.1"

# 推送到 main
git push origin main
```

**💡 提示：** 推送到 `main` 只會執行 CI（build/test/lint），**不會發佈到 npm**。

---

### **步驟 3：建立並推送 Tag**

```bash
# 建立 tag（必須以 'v' 開頭）
git tag v2.0.1

# 推送 tag 到 remote（這會觸發發佈流程）
git push origin v2.0.1
```

**⚠️ 重要：**
- Tag 格式必須是 `vX.Y.Z`（例如：`v2.0.1`）
- Tag 版本號必須與 `package.json` 的 `version` 一致
- 如果不一致，workflow 會失敗並顯示錯誤訊息

---

### **步驟 4：驗證發佈**

推送 tag 後：

1. **查看 GitHub Actions**
   - 前往：`https://github.com/Aykahshi/copilot-mcp-tool/actions`
   - 確認 "CI/CD Pipeline" workflow 正在執行
   - 檢查 "release-and-publish" job 狀態

2. **檢查 GitHub Release**
   - 前往：`https://github.com/Aykahshi/copilot-mcp-tool/releases`
   - 確認新版本的 Release 已建立

3. **確認 npm 發佈**
   - 前往：`https://www.npmjs.com/package/@aykahshi/copilot-mcp-server`
   - 確認新版本已出現
   - 檢查是否有 provenance badge（安全認證）

---

## 🔄 完整範例

### **範例 1：Patch 版本更新（Bug 修復）**

```bash
# 1. 修復 bug，更新版本
npm version patch
# package.json: 2.0.0 -> 2.0.1

# 2. 提交
git add .
git commit -m "fix: correct model parameter handling"

# 3. 推送到 main（執行 CI，但不發佈）
git push origin main

# 4. 建立並推送 tag（觸發發佈）
git tag v2.0.1
git push origin v2.0.1

# 5. 等待 GitHub Actions 完成並驗證
```

---

### **範例 2：Minor 版本更新（新功能）**

```bash
# 1. 開發新功能，更新版本
npm version minor
# package.json: 2.0.1 -> 2.1.0

# 2. 提交
git add .
git commit -m "feat: add new AI model support"

# 3. 推送到 main
git push origin main

# 4. 建立並推送 tag
git tag v2.1.0
git push origin v2.1.0
```

---

### **範例 3：Major 版本更新（Breaking Changes）**

```bash
# 1. 重大更新，更新版本
npm version major
# package.json: 2.1.0 -> 3.0.0

# 2. 提交
git add .
git commit -m "feat!: redesign API with breaking changes

BREAKING CHANGE: Model parameter format has changed"

# 3. 推送到 main
git push origin main

# 4. 建立並推送 tag
git tag v3.0.0
git push origin v3.0.0
```

---

## ⚙️ CI/CD 觸發條件

| 操作 | CI (build/test/lint) | 發佈 (npm publish) |
|------|---------------------|-------------------|
| `git push origin main` | ✅ 執行 | ❌ 不執行 |
| `git push origin v2.0.1` | ✅ 執行 | ✅ 執行 |
| Pull Request | ✅ 執行 | ❌ 不執行 |

---

## 🛡️ 安全檢查

Workflow 會自動執行以下檢查：

### **1. 版本一致性檢查**
```yaml
# 確保 package.json 版本與 tag 一致
if package.json version != tag version:
    ❌ 失敗並顯示錯誤
```

**範例錯誤訊息：**
```
❌ Error: package.json version (2.0.0) does not match tag version (2.0.1)
Please update package.json version to match the tag before creating the release.
```

### **2. npm 版本重複檢查**
```yaml
# 檢查版本是否已在 npm 存在
if version exists on npm:
    ⚠️  跳過發佈（不是錯誤）
else:
    ✅ 發佈到 npm
```

---

## 🐛 疑難排解

### **問題 1：Tag 與 package.json 版本不一致**

**錯誤訊息：**
```
❌ Error: package.json version (2.0.0) does not match tag version (2.0.1)
```

**解決方法：**
```bash
# 1. 刪除錯誤的 tag
git tag -d v2.0.1
git push origin :refs/tags/v2.0.1

# 2. 更新 package.json
npm version 2.0.1

# 3. 提交並推送
git add package.json package-lock.json
git commit -m "chore: bump version to 2.0.1"
git push origin main

# 4. 重新建立正確的 tag
git tag v2.0.1
git push origin v2.0.1
```

---

### **問題 2：版本已存在於 npm**

**訊息：**
```
⚠️  Skipping npm publish: version already exists on npm registry
```

**這不是錯誤！** 這表示該版本已經發佈過了。

**解決方法：**
```bash
# 更新到新版本
npm version patch
git add .
git commit -m "chore: bump version to 2.0.2"
git push origin main

# 建立新 tag
git tag v2.0.2
git push origin v2.0.2
```

---

### **問題 3：忘記推送 tag**

```bash
# 檢查本地 tags
git tag

# 檢查遠端 tags
git ls-remote --tags origin

# 推送缺少的 tag
git push origin v2.0.1
```

---

### **問題 4：需要刪除錯誤的 tag**

```bash
# 刪除本地 tag
git tag -d v2.0.1

# 刪除遠端 tag
git push origin :refs/tags/v2.0.1

# 或使用更新的語法
git push origin --delete v2.0.1
```

---

## 📝 Commit Message 規範

使用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**常用 Types：**
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文檔更新
- `style`: 代碼格式（不影響功能）
- `refactor`: 重構
- `perf`: 性能優化
- `test`: 測試相關
- `chore`: 構建/工具相關
- `ci`: CI/CD 相關

**範例：**
```bash
git commit -m "feat: add support for GPT-5 models"
git commit -m "fix: resolve memory leak in session management"
git commit -m "docs: update README with new examples"
git commit -m "chore: bump version to 2.0.1"
```

---

## ✅ 發佈前檢查清單

在建立 tag 之前，確認：

- [ ] 所有變更已提交並推送到 `main`
- [ ] `package.json` 版本號已更新
- [ ] `npm run build` 本地執行成功
- [ ] `npm test` 本地執行成功
- [ ] `npm run lint` 無錯誤
- [ ] Tag 格式正確（`vX.Y.Z`）
- [ ] Tag 版本與 `package.json` 一致
- [ ] 已在 npmjs.com 設定 Trusted Publisher（首次發佈）

---

## 🔗 相關連結

- [GitHub Releases](https://github.com/Aykahshi/copilot-mcp-tool/releases)
- [GitHub Actions](https://github.com/Aykahshi/copilot-mcp-tool/actions)
- [npm Package](https://www.npmjs.com/package/@aykahshi/copilot-mcp-server)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**🎉 現在你可以安全且有條理地發佈新版本了！**
