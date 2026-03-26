import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BugLogo from '@/components/BugLogo';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import {
  type Message, type Chat, getChats, saveChats, generateId,
  getDailyUsage, incrementUsage, FREE_DAILY_LIMIT, isPro
} from '@/lib/store';

const SUGGESTED = [
  "Explain quantum computing simply",
  "Write a Python sorting algorithm",
  "Debug my React useEffect",
  "Create a marketing strategy",
];

// Simple local AI response simulation
function simulateAI(prompt: string): string {
  const responses: Record<string, string> = {
    default: `Great question! Here's what I think about "${prompt}":\n\n**Key Points:**\n- This is a fascinating topic that touches on several important concepts\n- Let me break it down step by step for clarity\n- The approach depends on your specific use case\n\nWould you like me to dive deeper into any particular aspect?`,
  };
  return responses.default;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const prompt = text || input.trim();
    if (!prompt) return;

    if (!isPro() && getDailyUsage() >= FREE_DAILY_LIMIT) {
      const limitMsg: Message = {
        id: generateId(), role: 'assistant',
        content: '⚡ You\'ve reached your daily free limit. Upgrade to **Bug AI Pro** for unlimited prompts!',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMsg: Message = { id: generateId(), role: 'user', content: prompt, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    incrementUsage();

    // Simulate streaming delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const aiResponse = simulateAI(prompt);
    const aiMsg: Message = { id: generateId(), role: 'assistant', content: aiResponse, timestamp: Date.now() };
    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);

    // Save to local storage
    const chatId = currentChatId || generateId();
    if (!currentChatId) setCurrentChatId(chatId);
    const chats = getChats();
    const existing = chats.find(c => c.id === chatId);
    if (existing) {
      existing.messages = [...messages, userMsg, aiMsg];
      saveChats(chats);
    } else {
      const newChat: Chat = {
        id: chatId, title: prompt.slice(0, 40), messages: [userMsg, aiMsg],
        createdAt: Date.now(), mode: 'text',
      };
      saveChats([newChat, ...chats]);
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(prev => prev.slice(0, -1));
      handleSend(lastUserMsg.content);
    }
  };

  const hasMessages = messages.length > 0;
  const usage = getDailyUsage();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto">
      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-6 ambient-glow"
            >
              <BugLogo size="lg" />
              <p className="text-muted-foreground text-sm text-center max-w-xs">
                Your AI-powered assistant. Ask anything — code, ideas, debugging, creativity.
              </p>

              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="bg-surface hover:bg-surface-hover glow-border rounded-xl px-3 py-2.5 text-xs text-left text-foreground/80 transition-all hover:glow-sm"
                  >
                    <Sparkles size={12} className="text-primary mb-1" />
                    {s}
                  </button>
                ))}
              </div>

              {!isPro() && (
                <p className="text-[11px] text-muted-foreground">
                  {usage}/{FREE_DAILY_LIMIT} free prompts used today
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isLast={i === messages.length - 1 && msg.role === 'assistant'}
            onRegenerate={handleRegenerate}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 bg-surface rounded-2xl px-4 py-2 glow-border focus-within:glow-sm transition-shadow">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Bug AI anything…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
