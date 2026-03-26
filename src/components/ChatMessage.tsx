import { Copy, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Message } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: Message;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export default function ChatMessage({ message, onRegenerate, isLast }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-surface text-foreground rounded-bl-md'
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Generated"
            className="rounded-xl mb-2 w-full max-w-xs"
          />
        )}
        <div className={`text-sm leading-relaxed ${isUser ? '' : 'prose prose-sm prose-invert max-w-none'}`}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-surface-hover transition-colors text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded-md hover:bg-surface-hover transition-colors text-muted-foreground hover:text-foreground"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
