import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  CornerDownLeft,
} from 'lucide-react';
import { ChatMessage, FootprintRecord } from '../types';
import { sendChatMessage } from '../services/api';
import { motion } from 'motion/react';

interface Props {
  currentRecord: FootprintRecord | null;
}

const SUGGESTED_QUESTIONS = [
  'What is a carbon footprint?',
  'How can I reduce my transportation emissions?',
  'Why is electricity usage important?',
  'What are simple eco-friendly habits for students?',
];

export const AIChatPage: React.FC<Props> = ({ currentRecord }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text:
        'Hello! I am EcoTrack AI, your student environmental mentor. I can help explain carbon emissions, give dorm sustainability advice, or suggest small everyday changes to lower your climate impact. What would you like to explore today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await sendChatMessage(
        text,
        messages,
        currentRecord ? currentRecord.breakdown : null
      );

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: res.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'model',
          text:
            'I experienced a brief connection hiccup, but remember: the fastest ways to cut emissions as a student are active transit (walking/cycling), turning off unused electronics, and carrying a refillable water flask!',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'model',
        text:
          'Chat history cleared. Feel free to ask about your emissions breakdown or student sustainability tips!',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto pb-16 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Environmental Q&A Assistant
            </h1>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
              <Bot className="w-3 h-3 text-emerald-600" />
              <span>Student Mentor</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time environmental mentoring backed by Google Gemini GenAI.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions */}
      <div>
        <span className="text-xs font-bold text-slate-500 block mb-2">
          Suggested Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isSending}
              className="text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 px-3 py-1.5 rounded-xl transition-all text-left shadow-2xs disabled:opacity-60"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-50/90 border border-slate-100 text-slate-800'
                      : 'bg-emerald-600 text-white shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 font-medium ${
                      isBot ? 'text-slate-400' : 'text-emerald-100'
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium">Synthesizing environmental answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an environmental or campus sustainability question..."
              className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs sm:text-sm"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            EcoTrack AI offers educational guidance. Metrics are practical estimates.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
