import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChats, saveChats, type Chat } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setChats(getChats());
  }, []);

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    saveChats(updated);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-xl font-semibold mb-1">Chat History</h1>
      <p className="text-sm text-muted-foreground mb-6">Your recent conversations</p>

      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <MessageSquare size={40} className="opacity-30" />
          <p className="text-sm">No conversations yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {chats.map(chat => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-surface rounded-2xl p-4 flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-primary" />
                </div>
                <button onClick={() => navigate('/')} className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {chat.messages.length} messages · {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={14} className="text-muted-foreground" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
