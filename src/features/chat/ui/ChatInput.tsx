/**
 * @fileoverview 채팅 입력. AI 모델 선택, 텍스트/이미지 입력, 전송. onSend(message, modelType, image?).
 * @참조 chat-room Page
 * @라우팅 /chat/:sessionId
 * @상태 useState (message, modelType, selectedImage, previewUrl)
 */

import React, { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Zap, Brain, Globe, Edit3, MessageCircle } from 'lucide-react';
import { AIModelType } from '../../../shared/model/types';
import { AI_MODELS } from '../../../shared/config/aiModels';
import { STRINGS } from '../../../shared/config/strings';

const ICON_MAP = {
  MessageCircle,
  Zap,
  Brain,
  Globe,
  Edit3,
};

interface ChatInputProps {
  onSend: (message: string, modelType: AIModelType, image?: File) => void;
  isLoading: boolean;
}

/** 채팅 입력. onSend, isLoading. @참조 ChatRoom Page @상태 message, modelType, selectedImage, previewUrl */
export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [modelType, setModelType] = useState<AIModelType>(AIModelType.CHAT_PRO);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // blob URL 메모리 누수 방지
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const handleSend = () => {
    if ((!message.trim() && !selectedImage) || isLoading) return;
    onSend(message, modelType, selectedImage || undefined);
    setMessage('');
    setSelectedImage(null);
  };

  const isEditMode = modelType === AIModelType.IMAGE_EDIT;

  return (
    <div className="p-4 bg-surface-alt border-t border-border-default pb-safe">
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
        {AI_MODELS.map((m) => {
          const Icon = ICON_MAP[m.iconName];
          const isActive = modelType === m.type;
          return (
            <button
              key={m.type}
              onClick={() => setModelType(m.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${
                isActive
                  ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                  : 'bg-surface-tertiary border-border-default text-text-mid hover:border-border-subtle'
              }`}
            >
              <Icon size={12} />
              {m.label}
            </button>
          );
        })}
      </div>

      {previewUrl && (
        <div className="mb-2 relative inline-block">
          <img
            src={previewUrl}
            alt="첨부 미리보기"
            className="h-16 w-16 object-cover rounded-lg border border-border-default"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-1 -right-1 bg-semantic-error rounded-full w-4 h-4 flex items-center justify-center text-micro text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="p-2 text-text-mid hover:text-text-primary cursor-pointer transition-colors">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
            }}
          />
          <ImageIcon size={24} />
        </label>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isEditMode ? STRINGS.CHATROOM_PLACEHOLDER_EDIT : STRINGS.CHATROOM_PLACEHOLDER_CHAT}
            className="w-full bg-surface-alt text-text-primary rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime placeholder-text-low pr-12 border border-border-default"
            maxLength={500}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-micro text-text-low pointer-events-none">
            {message.length}/500
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || (!message.trim() && !selectedImage)}
          className={`p-3 rounded-full transition-colors ${
            !message.trim() && !selectedImage
              ? 'bg-surface-tertiary text-text-low'
              : 'bg-primary-lime text-text-inverse shadow-glow'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
};
