import React, { useState, useEffect, useRef } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  sendChatMessageToN8n,
  ChatMessage,
  getOrCreateSessionId,
  resetSessionId,
} from '../services/n8nChatService';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const CampusAiChatWidget: React.FC = () => {
  const { studentProfile, activeTab, setActiveTab } = useCampus();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('campusai_chat_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Welcome back.\n\nConnected to your n8n campus agent for **Student ${studentProfile.studentId}**. Ask me anything about your timetable, assignments, exam halls, or attendance safety!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = getOrCreateSessionId();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      try {
        localStorage.setItem('campusai_chat_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessageToN8n(query, sessionId);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        try {
          localStorage.setItem('campusai_chat_history', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unknown communication error';
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `⚠️ **Connection Error:** \`${errorText}\`. Please verify your n8n cloud webhook.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    const newSession = resetSessionId();
    const initMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: 'Starting a fresh conversation with your n8n campus agent. How can I assist you?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initMsg]);
    try {
      localStorage.setItem('campusai_chat_history', JSON.stringify([initMsg]));
    } catch {
      // ignore
    }
  };

  // If the user is already on the dedicated assistant tab, we can hide the floating bubble to avoid redundancy
  if (activeTab === 'assistant') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer group"
          aria-label="Open Campus AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight">AI Assistant</span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-700 text-indigo-200">
            n8n
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50 w-auto h-auto'
              : 'w-[92vw] sm:w-[420px] h-[550px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">CampusAI Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-300 font-mono">
                  n8n: sailakshmi.app.n8n.cloud
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition"
                title="New session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition hidden sm:block"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'user'
                        ? 'text-indigo-200 text-right'
                        : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-[10px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 font-mono ml-1">
                    thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSendMessage('What are my imminent deadlines?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 whitespace-nowrap"
            >
              Deadlines
            </button>
            <button
              onClick={() => handleSendMessage('Check my attendance safety')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 whitespace-nowrap"
            >
              Attendance
            </button>
            <button
              onClick={() => handleSendMessage('Next exam details')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 whitespace-nowrap"
            >
              Exams
            </button>
          </div>

          {/* Input Area */}
          <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Message Campus Agent..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none resize-none max-h-24"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
