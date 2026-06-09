import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, Paperclip, Info, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithAI } from '../services/gemini';
import { Message } from '../types';
import { cn } from '../lib/utils';
import { useDocuments } from '../context/DocumentContext';

export default function Chat() {
  const { documents } = useDocuments();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Protocol EduVault-AI initialized. My neural networks are synced with your document vault. How can I assist your academic strategy today?",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Neural paths reset. Document vault remains secure. What's our next objective?",
        timestamp: Date.now(),
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));
      history.push({ role: 'user', parts: [{ text: input }] });

      const response = await chatWithAI(history, documents);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that query within standard security parameters.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "ERROR: Secure link disrupted. Please verify your connection and attempt re-initialization.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4 md:p-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-accent-purple/20 p-3 rounded-2xl border border-accent-purple/30 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            <Sparkles className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary tracking-tighter">Gemini Intelligence</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
              </span>
              <p className="text-[10px] text-accent-green font-black uppercase tracking-[0.2em]">Neural Link Active</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleClearChat}
            className="text-text-muted hover:text-accent-coral transition-colors p-3 glass rounded-xl border-white/5"
            title="Purge Memory"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="text-text-muted hover:text-text-primary transition-colors p-3 glass rounded-xl border-white/5">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5",
                m.role === 'user' ? "bg-accent-green text-bg-primary" : "bg-bg-secondary text-accent-purple"
              )}>
                {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-5 rounded-[1.5rem] leading-relaxed relative overflow-hidden",
                m.role === 'user' 
                  ? "bg-accent-green text-bg-primary rounded-tr-none font-bold" 
                  : "glass text-text-primary border-white/5 rounded-tl-none font-medium"
              )}>
                {m.role === 'assistant' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl -z-10" />
                )}
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mr-auto"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-secondary text-accent-purple flex items-center justify-center shadow-inner border border-white/5">
              <Bot className="w-6 h-6" />
            </div>
            <div className="glass border-white/5 p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-purple ml-2">Analyzing Vault...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-8 relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button className="text-text-muted hover:text-accent-green transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Command Gemini AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full pl-14 pr-16 py-5 bg-bg-secondary border border-white/10 rounded-2xl focus:outline-none focus:border-accent-green/50 focus:ring-4 focus:ring-accent-green/10 transition-all font-bold text-sm text-text-primary placeholder:text-text-muted/30"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-[1rem] transition-all font-black text-[10px] uppercase tracking-widest",
            input.trim() && !isLoading 
              ? "bg-accent-green text-bg-primary shadow-lg shadow-accent-green/20 hover:scale-105 active:scale-95" 
              : "bg-white/5 text-text-muted cursor-not-allowed"
          )}
        >
          Execute
        </button>
      </div>
    </div>
  );
}
