import { Router, Request, Response } from 'express';
import { GeminiServerService } from '../lib/gemini';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: 'imageBase64와 prompt가 필요합니다.' });
    }

    const result = await GeminiServerService.editImage(imageBase64, prompt);
    res.json(result);
  } catch (error) {
    console.error('[/api/edit-image]', error);
    res.status(500).json({ error: '이미지 편집에 실패했습니다.' });
  }
});

export default router;
