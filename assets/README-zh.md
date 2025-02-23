# OmmniSearches
[English](../README.md) | [简体中文](./README-zh.md) | [繁體中文](./README-zh-hk.md)

一个免费且开源的 AI 搜索引擎，**OmniSearches**，由 Google 的 Gemini 2.0 Flash 模型驱动。它利用 Google 搜索进行实时 grounding，并使用 Deepseek 推理模型提供由 AI 驱动的答案，并附带网络来源和引用。图像搜索由 Wikimedia Commons 提供支持。

由 [@qiyijiazhen](https://www.qiyijiazhen.com/) 创建

## 演示
### 搜索 "Hong Kong"
![ScreenStudio-2025-02-23-Search_for_HK](./assets/HongKong_en.gif)
### 图像搜索
![ScreenStudio-2025-02-23-Image_search](./assets/ImageSearch.gif)
### 推理模式
![ScreenStudio-2025-02-23-Reasoning_mode](./assets/ReasoningMode.gif)

## 特性

- **实时洞察：** 通过实时 Google 搜索集成获取最新信息。
- **生动的视觉效果：** 探索来自 Wikimedia Commons 的图像。
- **智能推理：** 体验由 Deepseek 模型提供支持的先进推理。
- **已验证的答案：** 答案附带清晰的来源引用和参考。
- **进一步探索：** AI 生成的相关问题，以扩展您的知识。
- **多功能模式：** 从 4 种模式（简洁、默认、详尽、推理）中选择以定制您的搜索。
- **媒体答案：** 提供与查询相关的维基百科图片。
- **免费 & 开源：** 免费使用和修改代码，没有任何限制。
- **模拟实时搜索：** 独特的查询模拟真实世界的搜索行为。

## 技术栈

- 前端：React + Vite + TypeScript + Tailwind CSS
- 后端：Express.js + TypeScript
- AI：Google Gemini 2.0 Flash API + OpenRouter Deepseek distilled llama 70b API
- 搜索：Google Search API 集成

## 使用的 API
### LLM APIs
- [Google's Gemini 2.0 Flash API](https://ai.google.dev/)
- [OpenRouter Deepseek distilled llama 70b API](https://openrouter.ai/deepseek/deepseek-r1-distill-llama-70b:free)

### 图像 APIs
当前的图像来源于 Wikimedia Commons，因此不保证图像的准确性。
- [Wikipedia API](https://commons.wikimedia.org)

## 部署到 Railway

项目已部署在 Railway 上，欢迎使用下面的按钮部署您自己的实例。

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/kiwigaze/OmniSearches)

## 设置

### 前提条件

- Node.js (建议 v18 或更高版本)
- npm 或 yarn
- 具有 Gemini API 访问权限的 Google API 密钥
- 具有 Deepseek distilled llama 70b API 访问权限的 OpenRouter API 密钥

### 安装

1. 克隆存储库：

  ```bash
  git clone https://github.com/kiwigaze/OmniSearches.git
  cd OmniSearches
  ```

2. 安装依赖项：

  ```bash
  npm install
  ```

3. 在根目录中创建一个 `.env` 文件：

  ```
  GOOGLE_API_KEY=your_api_key_here
  REASON_MODEL_API_KEY=your_openrouter_api_key_here
  REASON_MODEL_API_URL=https://openrouter.ai/api/v1
  REASON_MODEL=deepseek/deepseek-r1-distill-llama-70b:free
  ```

4. 启动开发服务器：

  ```bash
  npm run dev
  ```

5. 打开您的浏览器并导航到：
  ```
  http://localhost:3000
  ```

## 环境变量

- `GOOGLE_API_KEY`：您的 Google API 密钥，具有 Gemini API 的访问权限
- `NODE_ENV`：默认为 "development"，生产环境构建请使用 "production"
- `REASON_MODEL_API_KEY`：您的 OpenRouter API 密钥，具有 Deepseek distilled llama 70b API 的访问权限
- `REASON_MODEL_API_URL`：OpenRouter API 的基本 URL
- `REASON_MODEL`：OpenRouter API 的模型名称

## 开发

- `npm run dev`：启动开发服务器
- `npm run build`：构建生产版本
- `npm run start`：运行生产服务器
- `npm run check`：运行 TypeScript 类型检查

## 安全注意事项

- 永远不要提交您的 `.env` 文件或暴露您的 API 密钥
- `.gitignore` 文件已配置为排除敏感文件
- 如果您 fork 此存储库，请确保使用您自己的 API 密钥

## 许可证

MIT 许可证 - 随意使用此代码用于您自己的项目！

## 鸣谢

- 灵感来自 [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- 网站图标来自 [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- 使用 [Google's Gemini API](https://ai.google.dev/) 构建
- UI 组件来自 [shadcn/ui](https://ui.shadcn.com/)
