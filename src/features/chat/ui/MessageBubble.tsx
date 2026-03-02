/**
 * @fileoverview 채팅 메시지 말풍선. 사용자/AI 구분, 이미지, 출처 링크, 퀵리플라이 표시.
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

/** 메시지 말풍선. message, onQuickReply. @참조 ChatRoom Page */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onQuickReply }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-lime/20 flex items-center justify-center mr-3 flex-shrink-0 border border-primary-lime/30">
          <Bot size={16} className="text-primary-lime" />
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary-lime text-text-inverse rounded-tr-sm'
              : 'bg-surface-alt border border-border-default text-text-primary rounded-tl-sm'
          }`}
        >
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
                className="text-[10px] text-primary-lime bg-primary-lime/10 px-2 py-1 rounded-md border border-primary-lime/20 hover:bg-primary-lime/20 truncate max-w-[200px]"
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

        <span className="text-[10px] text-text-mid mt-1">
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center ml-3 flex-shrink-0 border border-border-default">
          <User size={16} className="text-text-mid" />
        </div>
      )}
    </div>
  );
};
