import { Router, Request, Response } from 'express';
import { GeminiServerService } from '../lib/gemini';
import { randomUUID } from 'crypto';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    const options = req.body.options ? JSON.parse(req.body.options) : {};
    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    // Gemini API 호출 (분석 타임아웃 30초)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let analysisResult;
    try {
      analysisResult = await GeminiServerService.analyzeArtwork(
        imageBase64,
        mimeType,
        options
      );
    } finally {
      clearTimeout(timeout);
    }

    // 분석 결과에 고유 ID 부여 (실제 DB 저장 전 임시)
    const result = {
      id: randomUUID(),
      imageUrl: `data:${mimeType};base64,${imageBase64}`,
      ...analysisResult,
      timestamp: Date.now(),
      university: options.university || '',
      major: options.major || '',
    };

    res.json(result);
  } catch (error) {
    console.error('[/api/analyze]', error);

    if ((error as Error).name === 'AbortError') {
      return res.status(408).json({ error: '분석 시간이 초과됐습니다.' });
    }

    res.status(500).json({ error: '작품 분석에 실패했습니다.' });
  }
});

export default router;
