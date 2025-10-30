import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send(e) {
    e?.preventDefault();
    if (!isSignedIn) {
      alert('Please sign in to use the AI chat');
      return;
    }
    if (!input.trim()) return;
    
    setLoading(true);
    const userMessage = { role: 'user', text: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    
    try {
      const res = await api.sendChatMessage(input);
      if (res && res.success) {
        setMessages((m) => [...m, { role: 'assistant', text: res.response }]);
      } else {
        setMessages((m) => [...m, { 
          role: 'assistant', 
          text: '😕 I apologize, but I couldn\'t process your request right now. Please try again or rephrase your question.' 
        }]);
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
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

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Chat Container */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                >
                  {/* Avatar */}
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

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-3xl ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-6 py-4 rounded-2xl shadow-md ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {m.text}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-2">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
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
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={send} className="p-6 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isSignedIn ? "Ask me anything about hotels..." : "Please sign in to chat"}
                    disabled={!isSignedIn || loading}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim() || !isSignedIn}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
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
                </button>
              </div>
              
              {!isSignedIn && (
                <p className="text-sm text-amber-600 mt-3 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Please sign in to use the AI chat feature</span>
                </p>
              )}
            </form>
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
