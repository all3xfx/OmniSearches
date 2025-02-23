# OmmniSearches

[English](./README.md) | [简体中文](./assets/README-zh.md) | [繁體中文](./assets/README-zh-hk.md)

A free and open-source AI search engine, **OmniSearches**, powered by Google's Gemini 2.0 Flash model. It leverages Google Search for real-time grounding and the Deepseek reasoning model to provide AI-powered answers with web sources and citations. The image search is powered by Wikimedia Commons.

Created by [@qiyijiazhen](https://www.qiyijiazhen.com/)

## Demo
### Search for "Hong Kong"
![ScreenStudio-2025-02-23-Search_for_HK](./assets/HongKong_en.gif)
### Image Search
![ScreenStudio-2025-02-23-Image_search](./assets/ImageSearch.gif)
### Reasoning Mode
![ScreenStudio-2025-02-23-Reasoning_mode](./assets/ReasoningMode.gif)

## Features

- **Real-time Insights:** Get up-to-the-minute information with live google search integration.
- **Vibrant Visuals:** Explore images sourced from Wikimedia Commons.
- **Intelligent Reasoning:** Experience advanced reasoning powered by the Deepseek model.
- **Verified Answers:** Answers come with clear source citations and references.
- **Explore Further:** AI-generated related questions to expand your knowledge.
- **Versatile Modes:** Choose from 4 modes (concise, default, exhaustive, reasoning) to tailor your search.
- **Media Answer:** Provide wikipedia images related to query.
- **Free & Open Source:** Use and modify the code without restrictions.
- **Simulated Real-time Search:** Unique queries mimic real-world search behavior.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- AI: Google Gemini 2.0 Flash API + OpenRouter Deepseek distilled llama 70b API
- Search: Google Search API integration

## APIs Used
### LLM APIs
- [Google's Gemini 2.0 Flash API](https://ai.google.dev/)
- [OpenRouter Deepseek distilled llama 70b API](https://openrouter.ai/deepseek/deepseek-r1-distill-llama-70b:free)

### Image APIs
Current images are sourced from Wikimedia Commons, therefore the accuracy of the images is not guaranteed.
- [Wikipedia API](https://commons.wikimedia.org)

## Deploy to Railway

Project is deployed on Railway, feel free to deploy your own instance with the button below.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/kiwigaze/OmniSearches)


## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Google API key with access to Gemini API
- An OpenRouter API key with access to Deepseek distilled llama 70b API

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kiwigaze/OmniSearches.git
   cd OmniSearches
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   GOOGLE_API_KEY=your_api_key_here
   REASON_MODEL_API_KEY=your_openrouter_api_key_here
   REASON_MODEL_API_URL=https://openrouter.ai/api/v1
   REASON_MODEL=deepseek/deepseek-r1-distill-llama-70b:free
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Environment Variables

- `GOOGLE_API_KEY`: Your Google API key with access to Gemini API
- `NODE_ENV`: Set to "development" by default, use "production" for production builds
- `REASON_MODEL_API_KEY`: Your OpenRouter API key with access to Deepseek distilled llama 70b API
- `REASON_MODEL_API_URL`: The base URL for the OpenRouter API
- `REASON_MODEL`: The model name for the OpenRouter API

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run start`: Run the production server
- `npm run check`: Run TypeScript type checking

## Security Notes

- Never commit your `.env` file or expose your API keys
- The `.gitignore` file is configured to exclude sensitive files
- If you fork this repository, make sure to use your own API keys

## License

MIT License - feel free to use this code for your own projects!

## Acknowledgments

- Inspired by [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- Website icons from [@ammarreshi/Gemini-Search](https://github.com/ammaarreshi/Gemini-Search)
- Built with [Google's Gemini API](https://ai.google.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
