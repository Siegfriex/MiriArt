/**
 * MiriArt Cloud Run Server
 *
 * GCP Cloud Run 배포 대상 Express 서버.
 * GEMINI_API_KEY는 Cloud Run 환경변수 또는 Secret Manager로 주입.
 *
 * 로컬 실행: npm run dev (서버 디렉토리에서)
 * 빌드: npm run build
 * Docker: docker build -t miri-art-server .
 */

import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat';
import analyzeRouter from './routes/analyze';
import editImageRouter from './routes/edit-image';

const app = express();
const PORT = process.env.PORT || 8080;

// ─── 미들웨어 ─────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── 헬스체크 ──────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API 라우트 ───────────────────────────────────────────────────────────────

app.use('/api/chat', chatRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/edit-image', editImageRouter);

// ─── 에러 핸들러 ──────────────────────────────────────────────────────────────

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// ─── 서버 시작 ────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`MiriArt API server running on port ${PORT}`);
  console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ 설정됨' : '✗ 미설정'}`);
});

export default app;
