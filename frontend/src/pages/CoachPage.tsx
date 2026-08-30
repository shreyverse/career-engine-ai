import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { coachApi } from '../services/coachApi';
import { CoachConversation, CoachMessage } from '../types/coach.types';
import {
  Bot,
  User,
  Send,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

export const CoachPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt');

  const [conversations, setConversations] = useState<CoachConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<CoachConversation | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'What should I focus on this week?',
    'Explain my biggest skill gap and how to practice it.',
    'How can I improve my resume for my target role?',
    'Why is system design high priority for me?',
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, sending]);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await coachApi.listConversations();
      setConversations(list);
      if (list.length > 0) {
        const detailed = await coachApi.getConversation(list[0].id);
        setActiveConversation(detailed);
      } else {
        const newConv = await coachApi.createConversation(
          'Career Strategy Session',
          initialPrompt || undefined
        );
        setConversations([newConv]);
        setActiveConversation(newConv);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      const detailed = await coachApi.getConversation(id);
      setActiveConversation(detailed);
    } catch (err: any) {
      setError(err.message || 'Failed to select conversation.');
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await coachApi.createConversation('New Consultation');
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv);
    } catch (err: any) {
      setError(err.message || 'Failed to create new conversation.');
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await coachApi.deleteConversation(id);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeConversation?.id === id) {
        if (remaining.length > 0) {
          handleSelectConversation(remaining[0].id);
        } else {
          handleNewConversation();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete conversation.');
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || sending) return;

    if (!activeConversation) return;

    setInputMessage('');
    setSending(true);
    setError(null);

    const tempUserMsg: CoachMessage = {
      id: 'temp-' + Date.now(),
      conversationId: activeConversation.id,
      role: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setActiveConversation((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...(prev.messages || []), tempUserMsg],
      };
    });

    try {
      const res = await coachApi.sendMessage(activeConversation.id, textToSend);

      setActiveConversation((prev) => {
        if (!prev) return prev;
        const existingMessages = (prev.messages || []).filter((m) => m.id !== tempUserMsg.id);
        return {
          ...prev,
          messages: [...existingMessages, res.userMessage, res.assistantMessage],
        };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout maxWidth="wide">
      <div className="w-full space-y-6 text-left flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Full-Width Page Header with Actions */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>AI Career Coach</span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Context-Aware
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8D96AA] mt-0.5">
                Ask questions about your career trajectory, skill gaps, roadmap tasks, and resume optimization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/weekly-plan"
              className="h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold text-white transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>This Week Plan</span>
            </Link>
            <button
              onClick={handleNewConversation}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Full-Screen Workspace Grid: 280px Sidebar + Expansive Chat Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0 overflow-hidden">
          
          {/* Left Panel: Conversations List (3 of 12 cols on desktop) */}
          <div className="hidden md:flex md:col-span-3 flex-col bg-[#0B1020] border border-white/[0.08] rounded-3xl p-5 space-y-4 overflow-hidden shadow-xl">
            <div className="text-[11px] font-mono text-[#8D96AA] uppercase font-bold tracking-wider flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span>Conversations</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white text-[10px]">
                {conversations.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConversation(c.id)}
                  className={
                    'p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between text-xs group ' +
                    (activeConversation?.id === c.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white font-semibold border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'text-[#8D96AA] hover:bg-white/[0.03] hover:text-white border border-transparent')
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#8D96AA] hover:text-rose-400 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Main Panel: Expansive Chat Thread (9 of 12 cols on desktop) */}
          <div className="md:col-span-9 flex flex-col bg-[#0B1020] border border-white/[0.08] rounded-3xl p-6 overflow-hidden shadow-2xl relative">
            
            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-3 custom-scrollbar">
              {(!activeConversation?.messages || activeConversation.messages.length === 0) && (
                <div className="py-16 text-center space-y-6 max-w-2xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">How can I assist your career today?</h3>
                    <p className="text-sm text-[#8D96AA]">
                      Select a starter question or ask anything about your engineering trajectory, roadmap, or resume.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.04] text-xs sm:text-sm text-slate-300 hover:text-white transition-all text-left group flex items-center justify-between"
                      >
                        <span>{prompt}</span>
                        <ArrowRight className="w-4 h-4 text-[#8D96AA] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeConversation?.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    'flex gap-4 ' +
                    (msg.role === 'USER' ? 'justify-end' : 'justify-start')
                  }
                >
                  {msg.role === 'ASSISTANT' && (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1 shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={
                      'p-5 rounded-3xl max-w-3xl space-y-4 text-sm leading-relaxed shadow-lg ' +
                      (msg.role === 'USER'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none ml-12'
                        : 'bg-[#0E1528] border border-white/[0.08] text-slate-200 rounded-bl-none')
                    }
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Assistant Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="pt-2 border-t border-white/[0.08] space-y-2">
                        {msg.actions.map((act, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 group"
                          >
                            <div className="text-xs">
                              <strong className="text-white block">{act.title}</strong>
                              <span className="text-[#8D96AA] text-[11px]">{act.reason}</span>
                            </div>
                            <Link
                              to={act.actionUrl || '/dashboard'}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
                            >
                              <span>Open</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Followups */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {msg.suggestedFollowUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fu)}
                            className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all text-left"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Copy Snippet Control */}
                    {msg.role === 'ASSISTANT' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="text-[#8D96AA] hover:text-white text-xs flex items-center gap-1"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'USER' && (
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex items-center space-x-3 text-xs text-[#8D96AA] py-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Spinner size="sm" />
                  </div>
                  <span className="font-mono">Analyzing trajectory and compiling response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Area */}
            <div className="pt-4 mt-2 border-t border-white/[0.08] relative">
              <div className="flex items-center gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your roadmap, skill gaps, or career direction..."
                  rows={2}
                  className="flex-1 bg-[#07090D] border border-white/[0.08] rounded-2xl p-3.5 text-sm text-white placeholder-[#8D96AA] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none shadow-inner custom-scrollbar"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputMessage.trim() || sending}
                  className="h-14 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};
