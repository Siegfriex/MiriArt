import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIModelType } from "../model/types";

// Initialize the client
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for Model Names based on strict guidelines
const MODELS = {
  [AIModelType.CHAT_PRO]: 'gemini-3-pro-preview',
  [AIModelType.FAST]: 'gemini-2.5-flash-lite-latest', // "gemini lite" alias mapping
  [AIModelType.THINKING]: 'gemini-3-pro-preview',
  [AIModelType.SEARCH]: 'gemini-3-flash-preview',
  [AIModelType.IMAGE_EDIT]: 'gemini-2.5-flash-image', // "nano banana" alias mapping
};

interface ChatParams {
  modelType: AIModelType;
  history: { role: string; parts: { text: string }[] }[];
  message: string;
  imagePart?: { inlineData: { data: string; mimeType: string } };
}

interface ImageEditParams {
  imageBase64: string;
  prompt: string;
}

export const GeminiService = {
  /**
   * General Chat Generation with support for Thinking, Fast, and Search modes
   */
  generateChatResponse: async (params: ChatParams): Promise<{ text: string; groundingUrls?: string[] }> => {
    const ai = getClient();
    const modelName = MODELS[params.modelType];
    
    // Base configuration
    let config: any = {};

    // 1. Thinking Mode Configuration
    if (params.modelType === AIModelType.THINKING) {
      config = {
        thinkingConfig: { thinkingBudget: 32768 }, // Max for 3 Pro
        // Explicitly NOT setting maxOutputTokens as per requirement
      };
    }

    // 2. Search Grounding Configuration
    if (params.modelType === AIModelType.SEARCH) {
      config = {
        tools: [{ googleSearch: {} }],
      };
    }

    // Construct content parts
    const parts: any[] = [];
    
    // Add image if exists (Multimodal)
    if (params.imagePart) {
      parts.push(params.imagePart);
    }
    
    // Add text message
    parts.push({ text: params.message });

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: {
           role: 'user',
           parts: parts
        },
        config: config,
      });

      // Handle Grounding (Search)
      let groundingUrls: string[] = [];
      if (params.modelType === AIModelType.SEARCH) {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    groundingUrls.push(chunk.web.uri);
                }
            });
        }
      }

      return {
        text: response.text || "No response generated.",
        groundingUrls
      };

    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "Sorry, I encountered an error connecting to the AI mentor." };
    }
  },

  /**
   * Image Editing using Nano Banana (Gemini 2.5 Flash Image)
   */
  editImage: async (params: ImageEditParams): Promise<{ text: string; imageUrl?: string }> => {
    const ai = getClient();
    const modelName = MODELS[AIModelType.IMAGE_EDIT];

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                data: params.imageBase64,
                mimeType: 'image/png', // Assuming PNG for this demo, usually detected
              },
            },
            {
              text: params.prompt,
            },
          ],
        },
      });

      // Parse response for image
      let generatedImageUrl: string | undefined;
      let outputText = "";

      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            } else if (part.text) {
                outputText += part.text;
            }
          }
      }

      return {
        text: outputText || "Here is your edited image.",
        imageUrl: generatedImageUrl
      };

    } catch (error) {
      console.error("Image Edit Error:", error);
      return { text: "Failed to edit image." };
    }
  }
};