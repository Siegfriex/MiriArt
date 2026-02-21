import React, { useState } from 'react';
import { Send, Image as ImageIcon, Zap, Brain, Globe, Edit3 } from 'lucide-react';
import { AIModelType } from '../../shared/model/types';

interface ChatInputProps {
  onSend: (message: string, modelType: AIModelType, image?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [modelType, setModelType] = useState<AIModelType>(AIModelType.CHAT_PRO);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSend = () => {
    if ((!message.trim() && !selectedImage) || isLoading) return;
    onSend(message, modelType, selectedImage || undefined);
    setMessage('');
    setSelectedImage(null);
  };

  const models = [
    { type: AIModelType.CHAT_PRO, icon: MessageCircleIcon, label: 'Chat' },
    { type: AIModelType.FAST, icon: Zap, label: 'Fast' },
    { type: AIModelType.THINKING, icon: Brain, label: 'Think' },
    { type: AIModelType.SEARCH, icon: Globe, label: 'Search' },
    { type: AIModelType.IMAGE_EDIT, icon: Edit3, label: 'Edit Img' },
  ];

  function MessageCircleIcon(props: any) {
      return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
  }

  return (
    <div className="p-4 bg-dark-900 border-t border-white/10 pb-8 relative">
      {/* Model Selector */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
        {models.map((m) => (
          <button
            key={m.type}
            onClick={() => setModelType(m.type)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${
              modelType === m.type
                ? 'bg-lime-400/10 border-lime-400 text-lime-400'
                : 'bg-dark-800 border-white/10 text-gray-400'
            }`}
          >
            <m.icon size={12} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="mb-2 relative inline-block">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            className="h-16 w-16 object-cover rounded-lg border border-white/10" 
          />
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="flex items-center gap-2 relative">
        <label className="p-2 text-gray-400 hover:text-white cursor-pointer">
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
            placeholder={modelType === AIModelType.IMAGE_EDIT ? "Describe edit (e.g. 'Add a retro filter')..." : "Ask your AI mentor..."}
            className="w-full bg-dark-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 pr-12"
            maxLength={500}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 pointer-events-none">
             {message.length}/500
          </div>
        </div>
        
        <button
          onClick={handleSend}
          disabled={isLoading || (!message.trim() && !selectedImage)}
          className={`p-3 rounded-full transition-colors ${
            !message.trim() && !selectedImage 
              ? 'bg-dark-800 text-gray-600' 
              : 'bg-lime-400 text-dark-900 shadow-lg shadow-lime-400/20'
          }`}
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
};