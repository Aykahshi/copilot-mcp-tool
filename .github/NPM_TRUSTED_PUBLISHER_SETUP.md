# npm Trusted Publishers 設定指南

本專案已更新為使用 **npm Trusted Publishers**（基於 OIDC 的認證方式），不再需要傳統的 `NPM_TOKEN`。

---

## 📋 什麼是 Trusted Publishers？

Trusted Publishers 使用 OpenID Connect (OIDC) 讓你的 CI/CD 工作流程直接發佈 npm 套件，無需長期有效的 npm tokens。每次發佈都使用短期的、加密簽名的 token，大幅提升安全性。

**優點：**
- ✅ 不需要管理長期有效的 tokens
- ✅ 降低 token 洩漏風險
- ✅ 自動產生 provenance attestations
- ✅ 符合 OpenSSF 標準

---

## 🚀 設定步驟

### **步驟 1：在 npmjs.com 設定 Trusted Publisher**

1. 登入 [npmjs.com](https://npmjs.com)
2. 前往你的套件頁面：`https://www.npmjs.com/package/@aykahshi/copilot-mcp-server`
3. 點擊 **Settings** 標籤
4. 找到 **"Trusted Publisher"** 區塊
5. 點擊 **"GitHub Actions"** 按鈕

### **步驟 2：填寫 GitHub Actions 配置**

填寫以下欄位（**所有欄位都區分大小寫且必須完全匹配**）：

| 欄位 | 值 | 說明 |
|------|---|------|
| **Organization or user** | `Aykahshi` | 你的 GitHub 使用者名稱或組織名稱 |
| **Repository** | `copilot-mcp-tool` | 你的 repository 名稱 |
| **Workflow filename** | `main.yml` | workflow 檔案名稱（必須包含 `.yml` 副檔名） |
| **Environment name** | `release` | （選填）GitHub Environment 名稱 |

> ⚠️ **重要：** 
> - 只填寫檔案名稱（`main.yml`），不要填寫完整路徑（~~`.github/workflows/main.yml`~~）
> - 必須包含副檔名 `.yml`
> - 所有欄位都區分大小寫

### **步驟 3：儲存設定**

點擊 **"Add Trusted Publisher"** 或 **"Save"** 按鈕。

---

## ✅ 驗證設定

設定完成後：

1. **推送程式碼到 `main` 分支**
   ```bash
   git push origin main
   ```

2. **檢查 GitHub Actions**
   - 前往你的 repository：`https://github.com/Aykahshi/copilot-mcp-tool/actions`
   - 查看最新的 workflow run
   - 確認 "Publish to npm (Trusted Publishers)" 步驟成功

3. **確認發佈成功**
   - 前往 npmjs.com 檢查新版本是否已發佈
   - 檢查是否有 provenance attestation（自動產生）

---

## 🔒 增強安全性（建議）

設定 Trusted Publishers 後，強烈建議**限制傳統 token 存取**：

1. 前往套件的 **Settings** → **Publishing access**
2. 選擇 **"Require two-factor authentication and disallow tokens"**
3. 點擊 **"Update Package Settings"**

這樣做的好處：
- ✅ 只允許透過 Trusted Publishers 發佈
- ✅ 完全消除 token 洩漏風險
- ✅ Trusted Publishers 仍然正常運作

---

## 🛠️ Workflow 配置說明

我們的 `.github/workflows/main.yml` 已更新為使用 OIDC：

```yaml
permissions:
    contents: write
    id-token: write  # 這是啟用 OIDC 的關鍵權限

steps:
    # 確保使用 npm 11.5.1 或更新版本
    - name: Update npm to latest version
      run: npm install -g npm@latest

    # 發佈時不需要 NPM_TOKEN
    - name: Publish to npm (Trusted Publishers)
      run: npm publish --access public
      # 注意：沒有 NODE_AUTH_TOKEN 環境變數
```

**關鍵點：**
- ✅ `id-token: write` 權限讓 GitHub Actions 產生 OIDC token
- ✅ npm 11.5.1+ 自動偵測 OIDC 環境並使用它
- ✅ 不需要 `NODE_AUTH_TOKEN` 或 `NPM_TOKEN` secrets
- ✅ `--provenance` 自動產生（使用 OIDC 時預設啟用）

---

## ❌ 移除舊的 NPM_TOKEN Secret（選填）

如果你的 repository 中有舊的 `NPM_TOKEN` secret，可以移除它：

1. 前往 `https://github.com/Aykahshi/copilot-mcp-tool/settings/secrets/actions`
2. 找到 `NPM_TOKEN`
3. 點擊 **"Remove"**

> 💡 **提示：** 即使不移除，workflow 也不會使用它。但為了安全起見，建議移除未使用的 secrets。

---

## 🐛 疑難排解

### **問題 1：發佈時出現 "Unable to authenticate" 錯誤**

**可能原因：**
- ❌ Workflow filename 不匹配（例如填了 `.github/workflows/main.yml` 而不是 `main.yml`）
- ❌ Repository 或 Organization 名稱拼錯
- ❌ 使用 self-hosted runner（目前不支援）

**解決方法：**
1. 回到 npmjs.com 檢查 Trusted Publisher 設定
2. 確認所有欄位完全匹配（區分大小寫）
3. 確認使用 GitHub-hosted runner（`runs-on: ubuntu-latest`）

### **問題 2：npm 版本太舊**

**錯誤訊息：** `npm ERR! Trusted publishing is not supported`

**解決方法：**
確認 workflow 中有執行：
```yaml
- name: Update npm to latest version
  run: npm install -g npm@latest
```

### **問題 3：權限錯誤**

**錯誤訊息：** `Error: Unable to get ACTIONS_ID_TOKEN_REQUEST_URL`

**解決方法：**
確認 workflow 有正確的 permissions：
```yaml
permissions:
    contents: write
    id-token: write  # 必須有這個
```

---

## 📚 延伸閱讀

- [npm Trusted Publishers 官方文檔](https://docs.npmjs.com/trusted-publishers)
- [GitHub Actions OIDC 文檔](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [OpenSSF Trusted Publishers 標準](https://openssf.org/blog/2023/12/14/introducing-trusted-publishers-in-sigstore-and-pypi/)

---

## ✅ 檢查清單

在推送程式碼之前，確認：

- [ ] 已在 npmjs.com 設定 Trusted Publisher
- [ ] Organization: `Aykahshi`
- [ ] Repository: `copilot-mcp-tool`
- [ ] Workflow filename: `main.yml`
- [ ] Environment: `release`
- [ ] `.github/workflows/main.yml` 有 `id-token: write` 權限
- [ ] `.github/workflows/main.yml` 有更新 npm 到最新版本
- [ ] `.github/workflows/main.yml` 的發佈步驟沒有使用 `NODE_AUTH_TOKEN`
- [ ] （選填）已在 npmjs.com 限制 token 存取
- [ ] （選填）已移除 GitHub Secrets 中的 `NPM_TOKEN`

---

**🎉 設定完成後，你的套件將會自動透過安全的 OIDC 方式發佈到 npm！**