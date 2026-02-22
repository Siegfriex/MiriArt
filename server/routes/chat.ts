import { Router, Request, Response } from 'express';
import { GeminiServerService } from '../lib/gemini';
import { SystemPromptKey } from '../lib/prompts';

const router = Router();

const MODEL_TO_PROMPT: Record<string, SystemPromptKey> = {
  CHAT_PRO: 'CHAT_ASK',
  FAST: 'CHAT_ASK',
  THINKING: 'CHAT_CRITIC',
  SEARCH: 'CHAT_INFERENCE',
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      modelType = 'CHAT_PRO',
      message,
      stickyContext,
      imageBase64,
      imageMimeType,
      history,
    } = req.body;

    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'message 또는 imageBase64가 필요합니다.' });
    }

    const systemPromptKey = MODEL_TO_PROMPT[modelType] ?? 'CHAT_ASK';

    const response = await GeminiServerService.chat({
      modelType,
      message: message || '',
      systemPromptKey,
      stickyContext,
      imageBase64,
      imageMimeType,
      history,
    });

    res.json(response);
  } catch (error) {
    console.error('[/api/chat]', error);
    res.status(500).json({ error: 'AI 응답 생성에 실패했습니다.' });
  }
});

export default router;
