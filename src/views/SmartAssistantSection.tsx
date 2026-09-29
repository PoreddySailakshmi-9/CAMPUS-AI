import React, { useState, useEffect, useRef } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  sendChatMessageToN8n,
  ChatMessage,
  getOrCreateSessionId,
  resetSessionId,
  getWebhookUrl,
  setWebhookUrl,
  DEFAULT_N8N_WEBHOOK_URL,
} from '../services/n8nChatService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  Cpu,
  Calendar,
  CheckSquare,
  Clock,
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Terminal,
} from 'lucide-react';

export const SmartAssistantSection: React.FC = () => {
  const { studentProfile } = useCampus();

  // Chat message state
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
        text: `Welcome back.\n\nCampusAI Operating System is connected live to your academic n8n cloud agent and synced to your academic profile (**Student ${studentProfile.studentId}** · CSE, Semester 6 · CGPA: 3.84).\n\nHow can I assist you with your class timetable, assignment priorities, exam readiness, or attendance threshold today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(getOrCreateSessionId);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState(getWebhookUrl);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    try {
      localStorage.setItem('campusai_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
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
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unknown communication error';
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `⚠️ **Connection Alert:** Unable to complete response from the n8n agent.\n\n*Error details:* \`${errorText}\`\n\nPlease check your n8n workflow active status or test the webhook URL in settings.`,
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

  const handleNewSession = () => {
    const newId = resetSessionId();
    setSessionId(newId);
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Starting a fresh session with your n8n Campus Agent.\n\nSession ID: \`${newId.slice(0, 8)}...\`\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookUrl(webhookUrlInput);
    setSavedSettingsNotice(true);
    setTimeout(() => {
      setSavedSettingsNotice(false);
      setSettingsOpen(false);
    }, 1500);
  };

  const quickPrompts = [
    'What are my imminent deadlines this week?',
    'Analyze my attendance safety margins',
    'Create an exam revision schedule for AI310 and CS301',
    'What room is CS301 in today?',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live n8n Agent Connected
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Smart Campus AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connected to your live n8n autonomous agent to reason across timetable, assignments, exams, and attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer shadow-xs"
            title="Start new chat session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer shadow-xs"
            title="Webhook Settings"
          >
            <Settings className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Main Live Chat Console */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat top status bar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold truncate max-w-xs sm:max-w-md">
              n8n Cloud: sailakshmi.app.n8n.cloud
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Session: {sessionId.slice(0, 8)}...
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100/80 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <MarkdownRenderer content={msg.text} />
                )}
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user'
                      ? 'text-indigo-200 text-right'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1 font-mono">
                  n8n reasoning...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            Suggestions:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask your n8n Campus Agent anything (e.g. deadlines, attendance cushions, syllabus scope)..."
                className="w-full pl-3.5 pr-10 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none max-h-32"
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition cursor-pointer shadow-sm shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Agent Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            1. Knowledge Retriever
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Retrieves timetable room schedules, examination rules, and verified course syllabus scope.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <CheckSquare className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            2. Priority Reasoner
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Weighs assignment weightage, urgency decay, and remaining days to prioritize coursework.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            3. Schedule Optimizer
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Synthesizes personalized revision blocks and checks 75% institutional attendance safety cushions.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            4. Live n8n Dispatcher
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Connected to <code className="font-mono text-[10px]">sailakshmi.app.n8n.cloud</code> webhook endpoint.
          </p>
        </div>
      </div>

      {/* Webhook Configuration Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                n8n Webhook Configuration
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Active n8n Chat Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrlInput}
                  onChange={e => setWebhookUrlInput(e.target.value)}
                  required
                  placeholder="https://sailakshmi.app.n8n.cloud/webhook/.../chat"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Default: <span className="font-mono">{DEFAULT_N8N_WEBHOOK_URL}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Webhook Contract:</p>
                <p>• Method: <code className="font-mono text-[11px]">POST</code></p>
                <p>• Payload: <code className="font-mono text-[11px]">{`{"action":"sendMessage","sessionId":"...","chatInput":"..."}`}</code></p>
                <p>• Expected Output: <code className="font-mono text-[11px]">{`{"output":"..."}`}</code></p>
              </div>

              {savedSettingsNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Webhook URL updated successfully!</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setWebhookUrlInput(DEFAULT_N8N_WEBHOOK_URL)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Reset to User URL
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
