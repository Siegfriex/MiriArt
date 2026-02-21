import React from 'react';
import { Message, Sender } from '../../shared/model/types';
import { BodyText } from '../../shared/ui/Typography';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center mr-3 flex-shrink-0 border border-lime-400/30">
          <Bot size={16} className="text-lime-400" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Content */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-lime-400 text-dark-900 rounded-tr-sm'
              : 'bg-dark-800 border border-white/5 text-gray-100 rounded-tl-sm'
          }`}
        >
          {message.content.startsWith('data:image') || message.content.startsWith('http') ? (
             <img src={message.content} alt="Content" className="rounded-lg max-w-full" />
          ) : (
             <BodyText className={isUser ? 'text-dark-900' : 'text-gray-200'}>
               {message.content}
             </BodyText>
          )}
        </div>

        {/* Search Grounding Links */}
        {!isUser && message.groundingUrls && message.groundingUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.groundingUrls.map((url, idx) => (
              <a 
                key={idx} 
                href={url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-lime-400 bg-lime-400/10 px-2 py-1 rounded-md border border-lime-400/20 hover:bg-lime-400/20 truncate max-w-[200px]"
              >
                Source {idx + 1}
              </a>
            ))}
          </div>
        )}
        
        <span className="text-[10px] text-gray-600 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
         <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center ml-3 flex-shrink-0 border border-white/10">
           <User size={16} className="text-gray-400" />
         </div>
      )}
    </div>
  );
};