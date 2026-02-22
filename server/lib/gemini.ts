/**
 * MiriArt Gemini SDK Service (서버 사이드)
 * Cloud Run 환경에서 실행. API 키는 환경변수로 관리.
 */

import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { injectContext, SystemPromptKey } from './prompts';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  return new GoogleGenAI({ apiKey });
};

const MODELS = {
  CHAT_PRO: 'gemini-2.5-flash-latest',
  FAST: 'gemini-2.0-flash-lite',
  THINKING: 'gemini-2.5-pro-latest',
  SEARCH: 'gemini-2.0-flash',
  IMAGE_EDIT: 'gemini-2.0-flash-exp',
  ANALYSIS: 'gemini-2.5-flash-latest',
} as const;

export interface ServerChatParams {
  modelType: string;
  message: string;
  systemPromptKey?: SystemPromptKey;
  stickyContext?: Record<string, unknown>;
  imageBase64?: string;
  imageMimeType?: string;
  history?: { role: string; parts: { text: string }[] }[];
}

export interface ServerChatResponse {
  text: string;
  groundingUrls?: string[];
  quickReplies?: string[];
}

export const GeminiServerService = {
  /**
   * 채팅 응답 생성
   */
  chat: async (params: ServerChatParams): Promise<ServerChatResponse> => {
    const ai = getClient();
    const modelName = MODELS[params.modelType as keyof typeof MODELS] ?? MODELS.CHAT_PRO;

    const systemInstruction = params.systemPromptKey
      ? injectContext(
          params.systemPromptKey,
          params.stickyContext as Parameters<typeof injectContext>[1]
        )
      : undefined;

    const parts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];

    if (params.imageBase64 && params.imageMimeType) {
      parts.push({
        inlineData: { data: params.imageBase64, mimeType: params.imageMimeType },
      });
    }
    parts.push({ text: params.message });

    let config: Record<string, unknown> = {};

    if (params.modelType === 'THINKING') {
      config = { thinkingConfig: { thinkingBudget: 8192 } };
    }
    if (params.modelType === 'SEARCH') {
      config = { tools: [{ googleSearch: {} }] };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { role: 'user', parts },
      config: systemInstruction
        ? { ...config, systemInstruction }
        : config,
    });

    let groundingUrls: string[] = [];
    if (params.modelType === 'SEARCH') {
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: { web?: { uri?: string } }) => {
          if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
        });
      }
    }

    return {
      text: response.text || '응답을 생성하지 못했습니다.',
      groundingUrls,
    };
  },

  /**
   * 작품 이미지 분석 → JSON 구조화 응답
   */
  analyzeArtwork: async (
    imageBase64: string,
    mimeType: string,
    options: { type: string; problemText?: string }
  ) => {
    const ai = getClient();
    const systemInstruction = injectContext('ANALYSIS');

    const problemContext = options.problemText
      ? `\n\n제시된 문제/주제: ${options.problemText}\n분석 유형: ${options.type === 'basic' ? '기초디자인' : '기초소양'}`
      : `\n\n분석 유형: ${options.type === 'basic' ? '기초디자인' : '기초소양'}`;

    const response = await ai.models.generateContent({
      model: MODELS.ANALYSIS,
      contents: {
        role: 'user',
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: `위 작품을 분석해주세요.${problemContext}` },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    return JSON.parse(raw);
  },

  /**
   * 이미지 편집
   */
  editImage: async (imageBase64: string, prompt: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODELS.IMAGE_EDIT,
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/png' } },
          { text: prompt },
        ],
      },
    });

    let generatedImageUrl: string | undefined;
    let outputText = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ((part as { inlineData?: { data?: string } }).inlineData?.data) {
          const data = (part as { inlineData: { data: string } }).inlineData.data;
          generatedImageUrl = `data:image/png;base64,${data}`;
        } else if ((part as { text?: string }).text) {
          outputText += (part as { text: string }).text;
        }
      }
    }

    return { text: outputText || '이미지 편집이 완료됐습니다.', imageUrl: generatedImageUrl };
  },
};
