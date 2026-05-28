'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase/client';
import { Send, AlertTriangle, ShieldAlert, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [criticalWarning, setCriticalWarning] = useState(false);

  // Severe condition keywords for alert triggers
  const criticalKeywords = ['chest pain', 'heart attack', 'difficulty breathing', 'stroke', 'unconscious', 'severe bleeding'];

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      message: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setCriticalWarning(false);

    // Persist user prompt inside Supabase Chat Log
    await supabase.from('ai_conversations').insert({
      user_id: user.id,
      message: userMsg.message,
      sender: 'user',
    });

    // Check query for warning keywords
    const lowerInput = userMsg.message.toLowerCase();
    const isCritical = criticalKeywords.some((keyword) => lowerInput.includes(keyword));

    // Simulate AI clinical symptom parsing
    setTimeout(async () => {
      let responseText = '';
      if (isCritical) {
        setCriticalWarning(true);
        responseText = `⚠️ SEVERITY ALERT DETECTED. You typed symptoms consistent with a potential emergency. Please do not wait. Use our emergency dashboard dispatch or dial local emergency numbers (911/112) immediately! \n\nTemporary instructions: Sit upright, try to maintain stable breathing, and loosen any tight garments while professional responders mobilize.`;
      } else {
        responseText = `For general wellness advice: \n1. Stay fully hydrated by drinking clean fluids.\n2. Rest in a well-ventilated, quiet room.\n3. Monitor symptoms such as temperature or oxygen levels closely.\n\nPlease seek advice from a certified, physical physician if your symptoms persist or degrade.`;
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        message: responseText,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Log AI reply
      await supabase.from('ai_conversations').insert({
        user_id: user.id,
        message: aiMsg.message,
        sender: 'ai',
      });

      setLoading(false);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-150 dark:border-slate-700 overflow-hidden">
        
        {/* Chat Header and Disclaimer */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">AI Symptom Assistant</h2>
              <p className="text-xs text-slate-500">First-Aid Advice Protocols</p>
            </div>
          </div>
          <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 text-amber-850 dark:text-amber-250 p-3 rounded-lg flex items-start gap-2 border border-amber-200 dark:border-amber-950 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> This AI assistant is strictly designed for educational first-aid advice. It is not an alternative to professional clinical evaluation or active emergency dispatch channels.
            </p>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 min-h-[400px]">
          {messages.length === 0 ? (
            <div className="text-center text-slate-450 dark:text-slate-500 py-12">
              <p className="text-sm font-semibold">How are you feeling today?</p>
              <p className="text-xs mt-1 max-w-sm mx-auto">Input symptoms like "headache", "dehydration risk" or "basic fever care" to get temporary first-aid recommendations.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[80%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${m.sender === 'user' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-650'
                }`}>
                  {m.message}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Critical Red Banner */}
        {criticalWarning && (
          <div className="px-6 py-3 bg-red-650 text-white flex items-center justify-between text-xs font-bold gap-2 animate-pulse">
            <span className="flex items-center gap-1"><ShieldAlert className="h-4 w-4" /> EMERGENCY STATUS DETECTED: Go to our Emergency SOS or contact nearest ambulance!</span>
          </div>
        )}

        {/* Messaging input form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-emerald-500"
            placeholder="Type symptoms (e.g., 'fever instructions', 'how to clean a cut')..."
          />
          <button
            type="submit"
            className="p-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

      </div>
    </div>
  );
}