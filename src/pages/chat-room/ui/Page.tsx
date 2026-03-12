/**
 * @fileoverview 채팅방 페이지. sessionKey = SSOT. 세션 메타·메시지 병렬 로드. history는 최근 8턴만 FastAPI 전달.
 * @참조 AppRouter, FE_CHAT_STAGE2_SPEC.md
 * @라우팅 /chat/:sessionKey
 */

import React, { useRef, useEffect, useState } from 'react';
import { Message, Sender, MessageType, AIModelType, Grade } from '../../../shared/model/types';
import { MessageBubble, ChatInput } from '../../../features/chat';
import { StickyContextCard } from '../../../widgets/chat/StickyContextCard';
import { H2 } from '../../../shared/ui/Typography';
import { Menu } from 'lucide-react';
import { ArtifactViewer, ArtifactData } from '../../../widgets/artifact/ui/ArtifactViewer';
import { useParams, useNavigate } from 'react-router-dom';
import { useSideGNBStore } from '../../../shared/model/sideGNBStore';
import { useNavStore } from '../../../shared/model/navStore';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';
import { ChatApi, ChatSessionApi, AnalysisApi, fileToBase64, handleApiError } from '../../../shared/api/miriartApi';
import { useToastStore } from '../../../shared/model/toastStore';
import { AiThinkingDots } from '@/shared/ui/ai';
import type { AnalysisResult } from '../../../shared/model/types';
import { SignedImage } from '../../../shared/ui/SignedImage';
import type { ChatSessionDto } from '../../../shared/api/schemas/chatSession';
import type { StickyContext } from '../../../shared/api/schemas/chat';
import { shouldLoadSessionByKey } from '../../../shared/lib/chatRouteParam';
import { buildSummaryText } from '../../../shared/lib/stickyContextSummary';
import { debugStickyContext } from '../../../shared/lib/debugStickyContext';

/**
 * analysis + sessionMeta로 StickyContext 구성. summaryText는 buildSummaryText로 생성.
 * handleSend에서는 이 함수만 호출해 grade/score/fixScope 등을 직접 조합하지 않음.
 */
function buildStickyContext(
  analysis: AnalysisResult | null,
  sessionMeta: ChatSessionDto | null
): StickyContext | undefined {
  const summaryText = buildSummaryText(analysis, sessionMeta);

  if (analysis) {
    const ctx: StickyContext = {
      grade: String(analysis.grade),
      score: analysis.totalScore,
      fixScope: analysis.fixScope,
      radarData: analysis.radarData as Record<string, number>,
      ...(analysis.universityPredictions?.length
        ? { universityPredictions: analysis.universityPredictions }
        : {}),
      ...((analysis.summaryComment ?? analysis.comment)
        ? { analysisComment: analysis.summaryComment ?? analysis.comment }
        : {}),
      ...(analysis.targetMajor ? { targetMajor: analysis.targetMajor } : {}),
      ...(analysis.targetUniversity ? { targetUniversity: analysis.targetUniversity } : {}),
      ...(summaryText ? { summaryText } : {}),
    };
    debugStickyContext('buildStickyContext (analysis)', ctx);
    return ctx;
  }

  if (sessionMeta && (sessionMeta.grade != null || sessionMeta.totalScore != null)) {
    const ctx: StickyContext = {
      grade: sessionMeta.grade ?? '',
      score: sessionMeta.totalScore ?? 0,
      fixScope: sessionMeta.fixScope ?? 'DetailTuning',
      ...(summaryText ? { summaryText } : {}),
    };
    debugStickyContext('buildStickyContext (sessionMeta)', ctx);
    return ctx;
  }

  return undefined;
}

/** StickyContextCard 표시용 grade/score/fixScope. API payload가 아닌 UI 전용. */
function getStickyContextDisplay(
  analysis: AnalysisResult | null,
  session: ChatSessionDto | null
): { grade: Grade; score: number; fixScope: string } {
  return {
    grade: (analysis?.grade ?? (session?.grade as Grade) ?? Grade.A) as Grade,
    score: analysis?.totalScore ?? session?.totalScore ?? 88,
    fixScope: analysis?.fixScope ?? session?.fixScope ?? 'DetailTuning',
  };
}

const DEFAULT_GREETING: Message = {
  id: 'greeting',
  sender: Sender.AI,
  type: MessageType.TEXT,
  content: STRINGS.CHATROOM_GREETING,
  timestamp: Date.now(),
};

/**
 * history: 최근 8턴(최대 16메시지)만 FastAPI에 전달. 1턴 = user + model 한 쌍.
 * 엣지: (1) USER/AI만 포함하므로 연속 USER 2개 등 비정형 순서면 8턴 미만이 될 수 있음.
 * (2) IMAGE 타입은 content가 blob URL이므로 빈 문자열로 보냄(API는 텍스트만 사용).
 * (3) slice(-16)으로 최대 16개만 보내므로 항상 8턴 이하로 제한됨.
 */
function buildBackendHistory(messages: Message[], maxTurns = 8): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  const filtered = messages.filter((m) => m.sender === Sender.USER || m.sender === Sender.AI);
  const last = filtered.slice(-maxTurns * 2);
  return last.map((m) => ({
    role: m.sender === Sender.USER ? ('user' as const) : ('model' as const),
    parts: [{ text: typeof m.content === 'string' ? m.content : '' }],
  }));
}

export const ChatRoom: React.FC = () => {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const navigate = useNavigate();
  const { open: openSideGNB } = useSideGNBStore();
  const { hide: hideNav, show: showNav } = useNavStore();
  const { show: showToast } = useToastStore();

  useEffect(() => {
    hideNav();
    return () => showNav();
  }, [hideNav, showNav]);

  const [messages, setMessages] = useState<Message[]>([DEFAULT_GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<ChatSessionDto | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [sessionLoadError, setSessionLoadError] = useState(false);

  // sessionKey 기준 로딩. (URL param은 analysisId로 쓰지 않음 — shouldLoadSessionByKey 참고)
  useEffect(() => {
    if (!shouldLoadSessionByKey(sessionKey)) {
      setSession(null);
      setAnalysis(null);
      setMessages([DEFAULT_GREETING]);
      setSessionLoadError(false);
      setRoomLoading(false);
      return;
    }
    setRoomLoading(true);
    setSessionLoadError(false);
    Promise.all([
      ChatSessionApi.getSession(sessionKey),
      ChatSessionApi.getMessages(sessionKey).catch(() => []),
    ])
      .then(([sessionRes, messagesRes]) => {
        setSession(sessionRes);
        setMessages(messagesRes.length > 0 ? messagesRes : [DEFAULT_GREETING]);
        if (sessionRes.analysisId != null) {
          return AnalysisApi.getById(String(sessionRes.analysisId))
            .then(setAnalysis)
            .catch(() => setAnalysis(null));
        }
        setAnalysis(null);
      })
      .catch(() => {
        setSessionLoadError(true);
        setSession(null);
        setAnalysis(null);
        setMessages([DEFAULT_GREETING]);
        showToast('세션을 찾을 수 없습니다.', 'error');
      })
      .finally(() => setRoomLoading(false));
  }, [sessionKey, showToast]);

  const sessionTitle =
    !sessionKey || sessionKey === 'new-session'
      ? STRINGS.CHATROOM_NEW_SESSION
      : session
        ? session.title || STRINGS.CHATROOM_NEW_SESSION
        : analysis
          ? `${analysis.university} ${analysis.major}`
          : roomLoading
            ? '불러오는 중...'
            : STRINGS.CHATROOM_NEW_SESSION;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 컴포넌트 언마운트 시 IMAGE 타입 메시지의 blob URL revoke
  useEffect(() => {
    return () => {
      messages.forEach((msg) => {
        if (msg.type === MessageType.IMAGE && msg.content.startsWith('blob:')) {
          URL.revokeObjectURL(msg.content);
        }
      });
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const shouldCollapse = e.currentTarget.scrollTop > 50;
    if (shouldCollapse !== isContextCollapsed) setIsContextCollapsed(shouldCollapse);
  };

  const handleSend = async (text: string, modelType: AIModelType, image?: File) => {
    const imageUrl = image ? URL.createObjectURL(image) : undefined;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: image ? MessageType.IMAGE : MessageType.TEXT,
      content: imageUrl ?? text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const imageBase64 = image ? await fileToBase64(image) : undefined;
      const imageMimeType = image?.type;
      const stickyContext = buildStickyContext(analysis, session ?? null);
      const history = buildBackendHistory([...messages, userMsg], 8);

      const requestBody = {
        modelType,
        message: text,
        sessionId: sessionKey,
        sessionKey: sessionKey !== 'new-session' ? sessionKey : undefined,
        ...(stickyContext ? { stickyContext } : {}),
        ...(history.length > 0 ? { history } : {}),
        ...(imageBase64 ? { imageBase64, imageMimeType } : {}),
      };
      debugStickyContext('POST /api/chat body.stickyContext', requestBody.stickyContext ?? null);

      // URL/라우팅은 sessionKey만 사용. new-session일 때 sessionKey 미전달 → BE가 새 세션 생성. sessionId는 BE 하위호환용(일부 BE가 기대할 수 있음).
      const response = await ChatApi.sendMessage(requestBody);

      // new-session일 때 첫 응답 수신 후 URL을 sessionKey(UUID)로 교체 — BE가 생성한 세션으로 고정
      const nextKey = response.sessionKey ?? response.sessionId;
      if (sessionKey === 'new-session' && nextKey) {
        navigate(ROUTES.CHAT_ROOM(nextKey), { replace: true });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: Sender.AI,
          type: MessageType.TEXT,
          content: response.text,
          timestamp: Date.now(),
          groundingUrls: response.groundingUrls,
          quickReplies: response.quickReplies ?? ['구도 분석 요청', '색감 피드백', '합격 확률 보기'],
        },
      ]);
    } catch {
      // ApiService 내부에서 Toast 처리됨
      // 실패한 메시지 표시 (이미 userMsg가 추가된 상태)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      {/* 아티팩트 오버레이 */}
      {activeArtifact && (
        <ArtifactViewer artifact={activeArtifact} onClose={() => setActiveArtifact(null)} />
      )}

      {/* 헤더 */}
      <div className="absolute top-0 left-0 w-full z-sticky bg-surface-alt/95 backdrop-blur-md border-b border-border-default h-14 flex items-center justify-between px-page-x">
        <div className="flex items-center gap-3">
          <button
            onClick={() => openSideGNB('partial')}
            className="text-text-primary p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <H2 className="text-base">{sessionTitle}</H2>
        </div>
        {/* 우측: 분석 연결 시 작품 썸네일 → ResultDetail, 아니면 나가기 */}
        <div className="flex items-center gap-2">
          {analysis ? (
            <button
              onClick={() => navigate(ROUTES.RESULT(analysis.id))}
              className="w-8 h-8 rounded-lg overflow-hidden border border-border-subtle hover:border-primary-lime/50 transition-colors flex-shrink-0"
            >
              <SignedImage
                analysisId={analysis.id}
                alt="작품"
                className="w-full h-full object-cover"
                placeholderClassName="bg-surface-tertiary flex items-center justify-center text-text-low text-[10px]"
              />
            </button>
          ) : (
            <button
              onClick={() => navigate(ROUTES.APP.CHAT)}
              className="text-xs bg-surface-tertiary px-3 py-1 rounded-full text-text-primary hover:bg-black/5 transition-colors"
            >
              나가기
            </button>
          )}
        </div>
      </div>

      {/* 세션 로드 실패 시 안내 */}
      {sessionLoadError && (
        <div className="absolute top-14 left-0 right-0 z-10 px-page-x py-4 bg-surface-tertiary/90 border-b border-border-default flex flex-col gap-2">
          <span className="text-tiny text-text-mid">세션을 찾을 수 없습니다.</span>
          <button
            type="button"
            onClick={() => navigate(ROUTES.APP.CHAT)}
            className="text-sm text-primary-lime hover:underline self-start"
          >
            채팅 목록으로
          </button>
        </div>
      )}

      {/* 분석 미연결 세션 안내 뱃지 */}
      {!sessionLoadError && analysis === null && sessionKey && sessionKey !== 'new-session' && !roomLoading && session && (
        <div className="absolute top-14 left-0 right-0 z-10 px-page-x py-2 bg-surface-tertiary/90 border-b border-border-default">
          <span className="text-tiny text-text-mid">
            분석 결과와 연결되지 않은 일반 채팅 세션입니다.
          </span>
        </div>
      )}

      {/* 스티키 컨텍스트 카드 (세션 메타 또는 분석에서). 표시값은 getStickyContextDisplay로 통일. */}
      <StickyContextCard
        {...getStickyContextDisplay(analysis, session)}
        isCollapsed={isContextCollapsed}
      />

      {/* 채팅 영역 */}
      <div
        className="flex-1 overflow-y-auto pt-44 pb-page-y px-page-x no-scrollbar scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onQuickReply={(replyText) => handleSend(replyText, AIModelType.CHAT_PRO)}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-text-mid text-xs ml-4 mb-4">
            <AiThinkingDots />
            <span>AI가 생각 중...</span>
          </div>
        )}
      </div>

      {/* 입력 */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};
