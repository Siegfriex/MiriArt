/**
 * @fileoverview 채팅 메시지 말풍선. 사용자/AI 구분, 이미지, 출처 링크, 퀵리플라이 표시. Structured Chat v3: sectionType별 스타일.
 * @참조 chat-room Page (features/chat/index.ts 경유)
 * @라우팅 /chat/:sessionId
 * @상태 (부모에서 message, onQuickReply 전달)
 */

import React from 'react';
import { Message, Sender } from '../../../shared/model/types';
import { BodyText } from '../../../shared/ui/Typography';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onQuickReply?: (text: string) => void;
}

/** Structured Chat v3: 섹션 타입별 스타일. 말풍선 div에만 wrapperClass 적용, groundingUrls/quickReplies는 말풍선 밖 형제 유지 */
const SECTION_STYLE: Record<
  'strength' | 'improvement' | 'action' | 'summary',
  { wrapperClass: string; iconEmoji: string; titleClass: string }
> = {
  summary: {
    wrapperClass: 'border-l-4 border-border-default bg-surface-tertiary',
    iconEmoji: '💬',
    titleClass: 'text-text-mid text-xs font-medium',
  },
  strength: {
    wrapperClass: 'border-l-4 border-primary-lime/50 bg-primary-lime/10',
    iconEmoji: '✅',
    titleClass: 'text-primary-lime text-xs font-semibold uppercase',
  },
  improvement: {
    wrapperClass:
      'border-l-4 border-semantic-error ring-1 ring-semantic-error/20 bg-semantic-error/5',
    iconEmoji: '🔴',
    titleClass: 'text-semantic-error text-xs font-bold uppercase',
  },
  action: {
    wrapperClass: 'border-l-4 border-semantic-info/50 bg-semantic-info/5',
    iconEmoji: '📋',
    titleClass: 'text-semantic-info text-xs font-semibold uppercase',
  },
};

/** 메시지 말풍선. message, onQuickReply. @참조 ChatRoom Page */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onQuickReply }) => {
  const isUser = message.sender === Sender.USER;
  const sectionStyle =
    message.sectionType && message.sectionType in SECTION_STYLE
      ? SECTION_STYLE[message.sectionType as keyof typeof SECTION_STYLE]
      : null;

  const mbClass =
    message.sectionType != null
      ? message.isLastSection
        ? 'mb-6'
        : 'mb-2'
      : 'mb-6';

  return (
    <div className={`flex w-full ${mbClass} ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-lime/20 flex items-center justify-center mr-3 flex-shrink-0 border border-primary-lime/30">
          <Bot size={16} className="text-primary-lime" />
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={[
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary-lime text-text-inverse rounded-tr-sm'
              : sectionStyle
                ? `bg-surface-alt ${sectionStyle.wrapperClass} text-text-primary rounded-tl-sm`
                : 'bg-surface-alt border border-border-default text-text-primary rounded-tl-sm',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {sectionStyle && message.sectionTitle && (
            <div className={`flex items-center gap-1 mb-2 ${sectionStyle.titleClass}`}>
              <span>{sectionStyle.iconEmoji}</span>
              <span>{message.sectionTitle}</span>
            </div>
          )}
          {message.content.startsWith('data:image') || message.content.startsWith('http') ? (
            <img src={message.content} alt="첨부 이미지" className="rounded-lg max-w-full" />
          ) : (
            <BodyText className={isUser ? 'text-text-inverse' : 'text-text-primary'}>
              {message.content}
            </BodyText>
          )}
        </div>

        {!isUser && message.groundingUrls && message.groundingUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.groundingUrls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary-lime underline hover:opacity-80 truncate max-w-[200px]"
              >
                출처 {idx + 1}
              </a>
            ))}
          </div>
        )}

        {!isUser && message.quickReplies && message.quickReplies.length > 0 && onQuickReply && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => onQuickReply(reply)}
                className="px-3 py-1.5 text-xs rounded-full border border-primary-lime/30 text-primary-lime bg-primary-lime/5 hover:bg-primary-lime/15 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {!isUser && (
          <span className="text-micro text-text-mid mt-1">
            {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center ml-3 flex-shrink-0 border border-border-default">
          <User size={16} className="text-text-mid" />
        </div>
      )}
    </div>
  );
};
