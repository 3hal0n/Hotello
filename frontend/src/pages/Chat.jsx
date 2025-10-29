import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';

export default function Chat() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!isSignedIn) return alert('Sign in to chat');
    if (!input) return;
    setLoading(true);
    const userMessage = { role: 'user', text: input };
    setMessages((m) => [...m, userMessage]);
    try {
      const res = await api.sendChatMessage(input);
      if (res && res.success) {
        setMessages((m) => [...m, { role: 'assistant', text: res.response }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I could not get a response.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: 'assistant', text: 'Error contacting AI.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
          <div className="h-96 overflow-y-auto border rounded p-4 mb-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded ${m.role === 'user' ? 'bg-blue-50 text-right' : 'bg-gray-100'}`}>
                <div className="text-sm">{m.text}</div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500">Ask the AI about hotels, recommendations or local tips.</p>}
          </div>

          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded" />
            <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Sending...' : 'Send'}</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
