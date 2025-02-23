import { response, type Express } from "express";
import { createServer, type Server } from "http";
import {
  GoogleGenerativeAI,
  type ChatSession,
  type GenerateContentResult,
} from "@google/generative-ai";
import { marked } from "marked";
import { setupEnvironment } from "./env";
import { getImageUrlFromSource } from "@/lib/ImageUtils";
import OpenAI from "openai";
import { systemPrompts } from "@/lib/prompts";

interface UserImage {
  data: string;
  mimeType: string;
}

const env = setupEnvironment();
const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY || '');
const REASON_MODEL = env.REASON_MODEL // or "google/gemini-2.0-flash-thinking-exp:free"


// Store chat sessions in memory
const chatSessions = new Map<string, ChatSession>();

// Format raw text into proper markdown
async function formatResponseToMarkdown(
  text: string | Promise<string>
): Promise<string> {
  // Ensure we have a string to work with
  const resolvedText = await Promise.resolve(text);

  // First, ensure consistent newlines
  let processedText = resolvedText.replace(/\r\n/g, "\n");

  // Process main sections (lines that start with word(s) followed by colon)
  processedText = processedText.replace(
    /^([A-Za-z][A-Za-z\s]+):(\s*)/gm,
    "## $1$2"
  );

  // Process sub-sections (any remaining word(s) followed by colon within text)
  processedText = processedText.replace(
    /(?<=\n|^)([A-Za-z][A-Za-z\s]+):(?!\d)/gm,
    "### $1"
  );

  // Process bullet points
  processedText = processedText.replace(/^[•●○]\s*/gm, "* ");

  // Split into paragraphs
  const paragraphs = processedText.split("\n\n").filter(Boolean);

  // Process each paragraph
  const formatted = paragraphs
    .map((p) => {
      // If it's a header or list item, preserve it
      if (p.startsWith("#") || p.startsWith("*") || p.startsWith("-")) {
        return p;
      }
      // Add proper paragraph formatting
      return `${p}\n`;
    })
    .join("\n\n");

  // Configure marked options for better header rendering
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Convert markdown to HTML using marked
  return marked.parse(formatted);
}

interface WebSource {
  uri: string;
  title: string;
}

interface GroundingChunk {
  web?: WebSource;
}

interface TextSegment {
  startIndex: number;
  endIndex: number;
  text: string;
}

interface GroundingSupport {
  segment: TextSegment;
  groundingChunkIndices: number[];
  confidenceScores: number[];
}

interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports: GroundingSupport[];
  searchEntryPoint?: any;
  webSearchQueries?: string[];
}

// Add this after the other interface definitions
// @ts-ignore
const RELATED_QUESTIONS_REGEX = /RELATED_QUESTIONS:\s*1\.\s*(.+?)\s*2\.\s*(.+?)\s*3\.\s*(.+)/s;

// Update the IMAGES_REGEX constant
// @ts-ignore
const IMAGES_REGEX = /IMAGES:\s*((?:\d+\.\s*\[([^\]]+)\]\[([^\]]+)\]\[([^\]]+)\]\[([^\]]+)\]\s*\n*)*)/s;

// Update the helper function to handle async image processing
async function extractAndRemoveRelatedQuestionsAndImages(text: string): Promise<{
  cleanText: string;
  relatedQuestions: string[];
  images: Array<{ url: string; caption: string; alt: string }>;
}> {
  const matches = text.match(RELATED_QUESTIONS_REGEX);
  const relatedQuestions = matches ? [matches[1], matches[2], matches[3]] : [];
  
  const imageMatches = text.match(IMAGES_REGEX);
  const images: Array<{ url: string; caption: string; alt: string }> = [];
  
  if (imageMatches) {
    const imageSection = imageMatches[1];
    const imageLines = imageSection.split('\n').filter(line => line.trim());
    
    // Process all image URLs concurrently
    const imagePromises = imageLines.map(async (line) => {
      const parts = line.match(/\d+\.\s*\[(.*?)\]\[(.*?)\]\[(.*?)\]\[(.*?)\]/);
      if (parts) {
        const [_, searchTitle, source, caption, alt] = parts;
        const url = await getImageUrlFromSource({ 
          searchTitle,
          source, 
          caption, 
          alt 
        });
        if (url != '') {
          return { url, caption, alt };
        }
      }
      return null;
    });

    // Wait for all image URLs to be processed
    const resolvedImages = await Promise.all(imagePromises);
    images.push(...resolvedImages.filter((img): img is { url: string; caption: string; alt: string } => img !== null));
  }
  
  let cleanText = text
    .replace(RELATED_QUESTIONS_REGEX, '')
    .replace(IMAGES_REGEX, '')
    .trim();
  
  return { cleanText, relatedQuestions, images };
}

export function registerRoutes(app: Express): Server {
  // Search endpoint - creates a new chat session
  app.route("/api/search")
    .get(async (req, res) => {
      try {
        const query = req.query.q as string;
        const mode = req.query.mode as 'concise' | 'default' | 'exhaustive' | 'search' | 'reasoning';

        if (!query) {
          return res.status(400).json({
            message: "Query parameter 'q' is required",
          });
        }

        // Validate mode and set default if invalid
        const validModes = ['concise', 'default', 'exhaustive', 'search', 'reasoning'] as const;
        const searchMode = validModes.includes(mode as any) ? mode : 'default';

        // Adjust system instruction based on mode
        let model;
        switch (searchMode) {
          case 'concise':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.1,
                topP: 1,
                topK: 1,
                maxOutputTokens: 150,
              },
              systemInstruction: systemPrompts.concise_mode,
            });
            break;
          case 'exhaustive':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.8,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.exhaustive_mode,
            });
            break;
          case 'search':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.4,
                topP: 1,
                topK: 1,
                maxOutputTokens: 1024,
              },
              systemInstruction: systemPrompts.search_mode,
            });
            break;
          case 'reasoning':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 1.0,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.reasoning_mode,
            });
            break;
          default:
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 1.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.default_mode,
            });
            break;
        }

        // Create a new chat session with search capability
        const chat = model.startChat({
          tools: [
            {
              // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
              google_search: {},
            },
          ],
        });

        
        // Generate content with search tool
        const result = await chat.sendMessage(query);
        const response = await result.response;
        const text = response.text();
        const { cleanText, relatedQuestions, images } = await extractAndRemoveRelatedQuestionsAndImages(text);

        // Format the response text to proper markdown/HTML
        const formattedText = await formatResponseToMarkdown(cleanText);

        // Extract sources from grounding metadata
        const sourceMap = new Map<
          string,
          { title: string; url: string; snippet: string }
        >();

        // Get grounding metadata from response
        const metadata = response.candidates?.[0]?.groundingMetadata as any;
        if (metadata) {
          const chunks = metadata.groundingChunks || [];
          const supports = metadata.groundingSupports || [];

          chunks.forEach((chunk: any, index: number) => {
            if (chunk.web?.uri && chunk.web?.title) {
              const url = chunk.web.uri;
              if (!sourceMap.has(url)) {
                // Find snippets that reference this chunk
                const snippets = supports
                  .filter((support: any) =>
                    support.groundingChunkIndices.includes(index)
                  )
                  .map((support: any) => support.segment.text)
                  .join(" ");

                sourceMap.set(url, {
                  title: chunk.web.title,
                  url: url,
                  snippet: snippets || "",
                });
              }
            }
          });
        }

        const sources = Array.from(sourceMap.values());

        // Generate a session ID and store the chat
        const sessionId = Math.random().toString(36).substring(7);
        chatSessions.set(sessionId, chat);

        res.json({
          sessionId,
          summary: formattedText,
          sources,
          relatedQuestions,
          images,
        });
      } catch (error: any) {
        console.error("Search error:", error);
        res.status(500).json({
          message:
            error.message || "An error occurred while processing your search",
        });
      }
    })
    .post(async (req, res) => {
      try {
        const { query, mode, reasoning, language, user_images } = req.body;

        if (!query) {
          return res.status(400).json({
            message: "Query is required in request body",
          });
        }

        // Validate mode and set default if invalid
        const validModes = ['concise', 'default', 'exhaustive', 'search', 'reasoning'] as const;
        const searchMode = validModes.includes(mode as any) ? mode : 'default';

        // Adjust system instruction based on mode
        let model;
        switch (searchMode) {
          case 'concise':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.1,
                topP: 1,
                topK: 1,
                maxOutputTokens: 150,
              },
              systemInstruction: systemPrompts.concise_mode,
            });
            break;
          case 'exhaustive':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.8,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.exhaustive_mode,
            });
            break;
          case 'search':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 0.4,
                topP: 1,
                topK: 1,
                maxOutputTokens: 1024,
              },
              systemInstruction: systemPrompts.search_mode,
            });
            break;
          case 'reasoning':
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 1.0,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.reasoning_mode,
            });
            break;
          default:
            model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash",
              generationConfig: {
                temperature: 1.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 65536,
              },
              systemInstruction: systemPrompts.default_mode,
            });
            break;
        }

        // Create a new chat session with search capability
        let chat;
        if (user_images && user_images.length > 0) {
          chat = model.startChat({
            // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
            tools: [{ google_search: {} }],
            history: [
              {
                role: "user",
                parts: [
                  ...user_images.map((img: UserImage) => ({
                    inlineData: {
                      data: img.data,
                      mimeType: img.mimeType
                    }
                  })),
                  { text: 'Use uploaded images to search for information' }
                ]
              }
            ]
          });
        } else {
          chat = model.startChat({
            // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
            tools: [{ google_search: {} }]
          });
        }

        const queryWithLanguage = language ? `${query} (Please respond in ${language}` : query;

        // If reasoning is provided, include it in the search context
        const searchPrompt = reasoning 
          ? `Following reasoning analysis:\n${reasoning}\n\n to search and answer Query: ${queryWithLanguage}`
          : `${queryWithLanguage}`;
        
        // Generate content with search tool
        const result = await chat.sendMessage(searchPrompt);
        const response = await result.response;
        const text = response.text();
        const { cleanText, relatedQuestions, images } = await extractAndRemoveRelatedQuestionsAndImages(text);

        // Format the response text to proper markdown/HTML
        const formattedText = await formatResponseToMarkdown(cleanText);

        // Extract sources from grounding metadata
        const sourceMap = new Map<
          string,
          { title: string; url: string; snippet: string }
        >();

        // Get grounding metadata from response
        const metadata = response.candidates?.[0]?.groundingMetadata as any;
        if (metadata) {
          const chunks = metadata.groundingChunks || [];
          const supports = metadata.groundingSupports || [];

          chunks.forEach((chunk: any, index: number) => {
            if (chunk.web?.uri && chunk.web?.title) {
              const url = chunk.web.uri;
              if (!sourceMap.has(url)) {
                // Find snippets that reference this chunk
                const snippets = supports
                  .filter((support: any) =>
                    support.groundingChunkIndices.includes(index)
                  )
                  .map((support: any) => support.segment.text)
                  .join(" ");

                sourceMap.set(url, {
                  title: chunk.web.title,
                  url: url,
                  snippet: snippets || "",
                });
              }
            }
          });
        }

        const sources = Array.from(sourceMap.values());

        // Generate a session ID and store the chat
        const sessionId = Math.random().toString(36).substring(7);
        chatSessions.set(sessionId, chat);

        res.json({
          sessionId,
          summary: formattedText,
          sources,
          relatedQuestions,
          images,
        });
      } catch (error: any) {
        console.error("Search error:", error);
        res.status(500).json({
          message:
            error.message || "An error occurred while processing your search",
        });
      }
    });

  app.get("/api/reasoning", async (req, res) => {
    try {
      const query = req.query.q as string;
      const language = req.query.language as string;

      if (!query) {
        return res.status(400).json({
          message: "Query parameter 'q' is required",
        });
      }

      const deepseek = new OpenAI({
        baseURL: process.env.REASON_MODEL_API_URL,
        apiKey: process.env.REASON_MODEL_API_KEY,
      });

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial response
      const reasoningResponse = await deepseek.chat.completions.create({
        model: REASON_MODEL || "deepseek-reasoner",
        messages: [
          {"role": "system",
            "content": `
            You are a helpful reasoner, acting as the **initial explorer** for a Search Agent. Your role is to **define the search strategy**, not to find the answer itself.
   
            Your task is to think like a search expert and determine:
   
            1. **Information Needs:**  What specific types of information, facts, or data are absolutely necessary to fully understand and answer the user's query?  Think about the *categories* of information we need to search for.
            2. **Explanation Strategy:** Once we have all the necessary information, how should we structure our explanation to clearly and comprehensively answer the user's query?  Outline the *key points* or *logical steps* of the explanation.
   
            Remember, your output should be a **search and explanation plan**, not the answer. Focus on *how* we will search and *how* we will explain, rather than *what* the answer is.  Only provide ideas and plans, do not attempt to answer the user's query.
            
            Please use the language: ${language} for your reasoning.
            `},
           {
               "role": "user",
               "content": `The user query is: ${query}.  Please provide your search strategy and explanation plan, focusing on the *how* and *why* of search and explanation, not the answer itself. Your answer should start with <think> and end with </think>`
           }
        ],
        stream: true,
      });

      let reasoning = "";

      for await (const chunk of reasoningResponse) {
        const reasoningContent = (
          chunk.choices?.[0]?.delta.content as string)

        if (reasoningContent !== undefined && reasoningContent !== null) {
          const content = reasoningContent;
          reasoning += content;
          
          // Print to terminal
          process.stdout.write(content);
          
          // Send to client
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        } else {
          if (reasoningResponse.controller) {
            reasoningResponse.controller.abort();
          }
          break;
        }
      }

      // Send the complete reasoning at the end
      res.write(`data: ${JSON.stringify({ complete: true, reasoning })}\n\n`);
      res.end();
    }
    catch (error: any) {
      console.error("Reasoning error:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while processing your reasoning",
      });
    }
  });

  // Follow-up endpoint - continues existing chat session
  app.post("/api/follow-up", async (req, res) => {
    try {
      const { sessionId, query } = req.body;

      if (!sessionId || !query) {
        return res.status(400).json({
          message: "Both sessionId and query are required",
        });
      }

      const chat = chatSessions.get(sessionId);
      if (!chat) {
        return res.status(404).json({
          message: "Chat session not found",
        });
      }

      // Send follow-up message in existing chat
      const result = await chat.sendMessage(query);
      const response = await result.response;
      const text = response.text();

      // Format the response text to proper markdown/HTML
      const formattedText = await formatResponseToMarkdown(text);

      // Extract sources from grounding metadata
      const sourceMap = new Map<
        string,
        { title: string; url: string; snippet: string }
      >();

      // Get grounding metadata from response
      const metadata = response.candidates?.[0]?.groundingMetadata as any;
      if (metadata) {
        const chunks = metadata.groundingChunks || [];
        const supports = metadata.groundingSupports || [];

        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            const url = chunk.web.uri;
            if (!sourceMap.has(url)) {
              // Find snippets that reference this chunk
              const snippets = supports
                .filter((support: any) =>
                  support.groundingChunkIndices.includes(index)
                )
                .map((support: any) => support.segment.text)
                .join(" ");

              sourceMap.set(url, {
                title: chunk.web.title,
                url: url,
                snippet: snippets || "",
              });
            }
          }
        });
      }

      const sources = Array.from(sourceMap.values());

      res.json({
        summary: formattedText,
        sources,
      });
    } catch (error: any) {
      console.error("Follow-up error:", error);
      res.status(500).json({
        message:
          error.message ||
          "An error occurred while processing your follow-up question",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
