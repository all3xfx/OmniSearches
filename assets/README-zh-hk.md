# OmmniSearches
[English](../README.md) | [简体中文](./README-zh.md) | [繁體中文](./README-zh-hk.md)

一個免費且開源的 AI 搜尋引擎，**OmniSearches**，由 Google 的 Gemini 2.0 Flash 模型驅動。它利用 Google 搜尋進行即時 grounding，並使用 Deepseek 推理模型提供由 AI 驅動的答案，並附有網頁來源和引用。圖片搜尋由 Wikimedia Commons 提供支持。

由 [@qiyijiazhen](https://www.qiyijiazhen.com/) 創建

## 演示
### 搜尋 "Hong Kong"
![ScreenStudio-2025-02-23-Search_for_HK](./HongKong_en.gif)
### 圖片搜尋
![ScreenStudio-2025-02-23-Image_search](./ImageSearch.gif)
### 推理模式
![ScreenStudio-2025-02-23-Reasoning_mode](./ReasoningMode.gif)

## 功能

- **即時洞察：** 透過即時 Google 搜尋整合，獲取最新的資訊。
- **生動的視覺效果：** 探索來自 Wikimedia Commons 的圖片。
- **智能推理：** 體驗由 Deepseek 模型驅動的進階推理。
- **已驗證的答案：** 答案附有清晰的來源引用和參考。
- **進一步探索：** AI 生成的相關問題，以擴展您的知識。
- **多功能模式：** 從 4 種模式（簡潔、預設、詳盡、推理）中選擇，以客製化您的搜尋。
- **媒體答案：** 提供與查詢相關的維基百科圖片。
- **免費且開源：** 無限制地使用和修改程式碼。
- **模擬即時搜尋：** 獨特的查詢模擬真實世界的搜尋行為。

## 技術堆疊

- 前端：React + Vite + TypeScript + Tailwind CSS
- 後端：Express.js + TypeScript
- AI：Google Gemini 2.0 Flash API + OpenRouter Deepseek distilled llama 70b API
- 搜尋：Google 搜尋 API 整合

## 使用的 API
### LLM APIs
- [Google's Gemini 2.0 Flash API](https://ai.google.dev/)
- [OpenRouter Deepseek distilled llama 70b API](https://openrouter.ai/deepseek/deepseek-r1-distill-llama-70b:free)

### 圖片 APIs
目前的圖片來自 Wikimedia Commons，因此不保證圖片的準確性。
- [Wikipedia API](https://commons.wikimedia.org)

## 部署到 Railway

專案已部署在 Railway 上，請隨時使用下面的按鈕部署您自己的實例。

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/)

## 設定

### 先決條件

- Node.js (建議 v18 或更高版本)
- npm 或 yarn
- 具有 Gemini API 存取權的 Google API 金鑰
- 具有 Deepseek distilled llama 70b API 存取權的 OpenRouter API 金鑰

### 安裝

1. 克隆儲存庫：

  ```bash
  git clone https://github.com/kiwigaze/OmniSearches.git
  cd OmniSearches
  ```

2. 安裝依賴項：

  ```bash
  npm install
  ```

3. 在根目錄中建立一個 `.env` 檔案：

  ```
  GOOGLE_API_KEY=your_api_key_here
  REASON_MODEL_API_KEY=your_openrouter_api_key_here
  REASON_MODEL_API_URL=https://openrouter.ai/api/v1
  REASON_MODEL=deepseek/deepseek-r1-distill-llama-70b:free
  ```

4. 啟動開發伺服器：

  ```bash
  npm run dev
  ```

5. 開啟您的瀏覽器並導航到：
  ```
  http://localhost:3000
  ```

## 環境變數

- `GOOGLE_API_KEY`：您的 Google API 金鑰，具有 Gemini API 存取權
- `NODE_ENV`：預設設定為 "development"，生產版本請使用 "production"
- `REASON_MODEL_API_KEY`：您的 OpenRouter API 金鑰，具有 Deepseek distilled llama 70b API 存取權
- `REASON_MODEL_API_URL`：OpenRouter API 的基本 URL
- `REASON_MODEL`：OpenRouter API 的模型名稱

## 開發

- `npm run dev`：啟動開發伺服器
- `npm run build`：建構生產版本
- `npm run start`：執行生產伺服器
- `npm run check`：執行 TypeScript 類型檢查

## 安全注意事項

- 永遠不要提交您的 `.env` 檔案或暴露您的 API 金鑰
- `.gitignore` 檔案已配置為排除敏感檔案
- 如果您 fork 這個儲存庫，請確保使用您自己的 API 金鑰

## 許可證

MIT 許可證 - 隨時可以使用此程式碼用於您自己的專案！

## 鳴謝

- 靈感來自 [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- 網站圖示來自 [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- 使用 [Google's Gemini API](https://ai.google.dev/) 構建
- UI 組件來自 [shadcn/ui](https://ui.shadcn.com/)
