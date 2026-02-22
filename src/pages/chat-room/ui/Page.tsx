/**
 * @fileoverview 채팅방 페이지. MessageBubble, ChatInput, StickyContextCard, ApiService.chat. sessionId로 artwork/세션 조회.
 * @참조 AppRouter
 * @라우팅 /chat/:sessionId
 * @상태 useSideGNBStore, useNavStore, useToastStore, useState (messages, isLoading, activeArtifact, isContextCollapsed)
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
import { getArtworkById } from '../../../entities/artwork/model';
import { MOCK_SESSIONS } from '../../../entities/session/model';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';
import { ApiService, fileToBase64 } from '../../../shared/api/gemini';
import { useToastStore } from '../../../shared/model/toastStore';

/** 채팅방 페이지. @참조 AppRouter @상태 useSideGNBStore, useNavStore, useToastStore, messages 등 */
export const ChatRoom: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { open: openSideGNB } = useSideGNBStore();
  const { hide: hideNav, show: showNav } = useNavStore();
  const { show: showToast } = useToastStore();

  // BottomNav 진입 시 숨김, 퇴장 시 복구
  useEffect(() => {
    hideNav();
    return () => {
      showNav();
    };
  }, [hideNav, showNav]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: Sender.AI,
      type: MessageType.TEXT,
      content: STRINGS.CHATROOM_GREETING,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // sessionId = artworkId (ResultDetail에서 result.id를 직접 전달)
  // 이전 'session-{id}' 형식에도 하위 호환 처리
  const normalizedSessionId = sessionId?.startsWith('session-')
    ? sessionId.replace('session-', '')
    : sessionId;
  const artwork = normalizedSessionId ? getArtworkById(normalizedSessionId) : null;

  // 세션 데이터에서 타이틀 동적 조회 (session.id = artworkId)
  const session = MOCK_SESSIONS.find((s) => s.id === normalizedSessionId);
  const sessionTitle =
    sessionId === 'new-session' || normalizedSessionId === 'new-session'
      ? STRINGS.CHATROOM_NEW_SESSION
      : session
        ? `${session.university} ${session.major}`
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
    // 이미지 blob URL 생성 (렌더용, 후 revoke는 언마운트 시)
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
      // 이미지를 base64로 변환 (API 전송용)
      const imageBase64 = image ? await fileToBase64(image) : undefined;
      const imageMimeType = image?.type;

      const response = await ApiService.chat({
        modelType,
        message: text,
        sessionId,
        stickyContext: {
          grade: 'A',
          score: 88,
          fixScope: 'DetailTuning',
          radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
        },
        ...(imageBase64 ? { imageBase64, imageMimeType } : {}),
      });

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
    <div className="flex flex-col h-full bg-black relative">
      {/* 아티팩트 오버레이 */}
      {activeArtifact && (
        <ArtifactViewer artifact={activeArtifact} onClose={() => setActiveArtifact(null)} />
      )}

      {/* 헤더 */}
      <div className="absolute top-0 left-0 w-full z-sticky bg-dark-900/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => openSideGNB('partial')}
            className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <H2 className="text-white text-base">{sessionTitle}</H2>
        </div>
        {/* 우측: 작품 썸네일 → ResultDetail 이동 */}
        <div className="flex items-center gap-2">
          {artwork ? (
            <button
              onClick={() => navigate(ROUTES.RESULT(artwork.id))}
              className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 hover:border-primary-lime/50 transition-colors"
            >
              <img src={artwork.imageUrl} alt="작품" className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={() => navigate(ROUTES.APP.CHAT)}
              className="text-xs bg-white/10 px-3 py-1 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              나가기
            </button>
          )}
        </div>
      </div>

      {/* 스티키 컨텍스트 카드 */}
      <StickyContextCard
        grade={Grade.A}
        score={88}
        fixScope="DetailTuning"
        isCollapsed={isContextCollapsed}
      />

      {/* 채팅 영역 */}
      <div
        className="flex-1 overflow-y-auto pt-44 pb-4 px-5 no-scrollbar scroll-smooth"
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
            <div className="w-2 h-2 bg-primary-lime rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary-lime rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-primary-lime rounded-full animate-bounce delay-200" />
            AI가 생각 중...
          </div>
        )}
      </div>

      {/* 입력 */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};
