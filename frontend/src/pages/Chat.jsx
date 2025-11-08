import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import useApi from '../hooks/useApi';
import HotelCard from '../components/HotelCard';
import { useAuth } from '@clerk/clerk-react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

export default function Chat() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 Hello! I\'m your AI travel assistant. I can help you find the perfect hotel, answer questions about destinations, provide local tips, and make personalized recommendations. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, message, icon) => {
    setToast({ type, message, icon });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const newHeight = Math.min(ta.scrollHeight, 220);
    ta.style.height = newHeight + 'px';
  }, [input]);

  async function send(e) {
    e?.preventDefault();
    if (!isSignedIn) {
      showToast('warning', 'Please sign in to use the AI chat', <AlertCircle />);
      return;
    }
    if (!input.trim()) return;
    
    setLoading(true);
    const query = input.trim();
    const userMessage = { role: 'user', text: query };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    
    try {
  const res = await api.sendChatMessage(query);
      if (res && res.success) {
        setMessages((m) => [...m, { role: 'assistant', text: res.response }]);
      } else {
        setMessages((m) => [...m, { 
          role: 'assistant', 
          text: '😕 I apologize, but I couldn\'t process your request right now. Please try again or rephrase your question.' 
        }]);
      }

      // Also fetch AI-backed hotel recommendations for the same query and show links
      try {
        const rec = await api.fetchRecommendations(query);
        if (rec && rec.success && Array.isArray(rec.data) && rec.data.length > 0) {
          setMessages((m) => [...m, { role: 'assistant', text: 'Here are some hotels you might like:', hotels: rec.data }]);
        }
      } catch (recErr) {
        console.warn('Recommendation lookup failed:', recErr);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((m) => [...m, { 
        role: 'assistant', 
        text: '⚠️ There was an error connecting to the AI service. Please check your connection and try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  }

  // handle Enter to send, Shift+Enter for newline
  const textareaRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // copy message text to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', 'Copied to clipboard', null);
    } catch (err) {
      showToast('error', 'Unable to copy', null);
    }
  };

  const suggestedQuestions = [
    '🏖️ Best beachfront hotels in Sri Lanka',
    '💑 Romantic getaways for couples',
    '👨‍👩‍👧‍👦 Family-friendly hotels with pools',
    '💼 Business hotels near Colombo',
    '🧘 Spa and wellness retreats'
  ];

  return (
    <>
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} icon={toast.icon} onClose={() => setToast(null)} />}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Travel Assistant
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get personalized hotel recommendations powered by artificial intelligence
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - desktop only */}
            <aside className="hidden md:flex md:flex-col w-72 bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100">
              <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setMessages([{ role: 'assistant', text: "👋 Hello! I'm your AI travel assistant. I can help you find the perfect hotel, answer questions about destinations, provide local tips, and make personalized recommendations. How can I assist you today?" }]); }} className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium hover:shadow transition">+ New chat</motion.button>
              <div className="mt-4 text-xs text-gray-500">Conversations</div>
              <div className="mt-3 overflow-y-auto flex-1 space-y-2">
                {messages.slice(0,5).map((m, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.01 }} className="px-3 py-2 bg-white rounded-lg border border-gray-100 text-sm text-gray-700 shadow-sm cursor-pointer">{m.text.slice(0,60)}{m.text.length>60? '...' : ''}</motion.div>
                ))}
              </div>
            </aside>

            {/* Main chat area */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[80vh] md:h-[640px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white" role="log" aria-live="polite">
                  {messages.map((m, i) => {
                    // If the assistant returned a hotels array, render a hotel-card grid inside the message
                    if (m.hotels && Array.isArray(m.hotels)) {
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, delay: i * 0.03 }}
                          className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            m.role === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                              : 'bg-gradient-to-br from-green-400 to-blue-500'
                          } shadow-lg`}>
                            {m.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                          </div>

                          <div className="flex-1 max-w-4xl">
                            {m.text && (
                              <div className="mb-4 text-sm text-gray-700">{m.text}</div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {m.hotels.map((hotel) => (
                                <div key={hotel._id} className="">
                                  <HotelCard hotel={hotel} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.03 }}
                        className={`flex gap-4 items-end ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                            : 'bg-gradient-to-br from-green-400 to-blue-500'
                        } shadow-lg`}> 
                          {m.role === 'user' ? (
                            <User className="w-6 h-6 text-white" />
                          ) : (
                            <Bot className="w-6 h-6 text-white" />
                          )}
                        </div>

                        <div className={`flex-1 max-w-3xl ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <motion.div whileHover={{ scale: 1.01 }} className={`relative inline-block px-6 py-4 rounded-2xl ${
                            m.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-50 border border-gray-100 text-gray-900'
                          }`}>
                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                              {m.text}
                            </p>
                          </motion.div>
                          <p className="text-xs text-gray-400 mt-2 px-2">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {loading && (
                    <div className="flex gap-4 animate-fade-in">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="inline-block px-6 py-4 rounded-2xl bg-white border border-gray-200 shadow-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions (Show when no user messages yet) */}
                {messages.filter(m => m.role === 'user').length === 0 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">💡 Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => setInput(question)}
                          whileHover={{ scale: 1.03 }}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area (sticky at bottom of card) */}
                <form onSubmit={send} className="p-6 bg-white border-t border-gray-200">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isSignedIn ? "Ask me anything about hotels... (Enter to send, Shift+Enter for newline)" : "Please sign in to chat"}
                        disabled={!isSignedIn || loading}
                        rows={1}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-base disabled:bg-gray-100 disabled:cursor-not-allowed resize-none max-h-40"
                        style={{ overflow: 'auto' }}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading || !input.trim() || !isSignedIn}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="hidden sm:inline">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span className="hidden sm:inline">Send</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {!isSignedIn && (
                    <p className="text-sm text-amber-600 mt-3 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Please sign in to use the AI chat feature</span>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

            {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">Get personalized hotel suggestions based on your preferences and mood</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-sm text-gray-600">Our AI assistant is always here to answer your travel questions</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Insights</h3>
              <p className="text-sm text-gray-600">Discover hidden gems and get expert local tips for your destination</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
