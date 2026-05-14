import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';


const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "Welcome to Property Cameroon. I am your AI assistant. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // --- LOGIQUE D'URL DYNAMIQUE ---
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/chat' 
    : 'https://property-cameroon-j32j.vercel.app/api/chat';
  // -------------------------------

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const renderMessageContent = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkUrl = match[2];

      // Vérifier si c'est un lien interne ou externe
      const isInternal = linkUrl.startsWith('/') || linkUrl.includes(window.location.hostname);

      if (isInternal) {
        // Nettoyer l'URL pour ne garder que le chemin (ex: /real-estate)
        const path = linkUrl.includes('://') 
          ? new URL(linkUrl).pathname 
          : linkUrl;

        parts.push(
          <Link 
            key={match.index} 
            to={path} 
            className="text-amber-500 underline font-black hover:text-amber-600 transition-colors mx-1"
          >
            {linkText}
          </Link>
        );
      } else {
        // Garder target="_blank" seulement pour les sites externes (ex: WhatsApp, Google)
        parts.push(
          <a 
            key={match.index} 
            href={linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-500 underline font-black hover:text-amber-600 transition-colors mx-1"
          >
            {linkText}
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const handleSend = async (text = input) => {
    const messageToSend = typeof text === 'string' ? text : input;
    if (!messageToSend.trim() || isTyping) return;

    const userMsg = { id: Date.now(), type: 'user', text: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Utilisation de l'API_URL dynamique
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageToSend,
          history: messages.slice(-6).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await response.json();
      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: data.response || "Désolé, je rencontre une petite difficulté technique."
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: "Connection error. Please check your internet or if the server is live." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    "Available Lands",
    "Livestock Investment",
    "CAPEF Partnership"
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-20 sm:mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[75vh] sm:h-[600px] bg-[#fdfcf0] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-emerald-950 p-5 sm:p-7 flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-950 shadow-lg shadow-amber-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest">PC Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-amber-500/80 uppercase font-black tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-amber-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-emerald-900/5 to-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium ${
                    msg.type === 'user' 
                      ? 'bg-emerald-900 text-amber-100 rounded-tr-none shadow-md' 
                      : 'bg-white text-emerald-950 shadow-sm border border-emerald-900/5 rounded-tl-none'
                  }`}>
                    {renderMessageContent(msg.text)}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-emerald-900/5">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-[9px] font-black uppercase text-emerald-900/40 tracking-widest ml-1">Suggested Inquiries</p>
                  {quickActions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(action)}
                      className="text-left w-fit px-3 py-1.5 bg-white border border-emerald-900/10 rounded-full text-[11px] font-bold text-emerald-900 hover:border-amber-500 hover:text-amber-600 transition-all flex items-center gap-2 group shadow-sm"
                    >
                      {action} <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-emerald-900/5">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about properties..."
                  disabled={isTyping}
                  className="w-full pl-4 pr-12 py-3 sm:py-4 bg-emerald-900/5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-emerald-950 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-emerald-900/30 disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-950 text-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-all shadow-lg disabled:opacity-30"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-950 text-amber-500 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_rgba(6,78,59,0.3)] flex items-center justify-center border-2 border-amber-500/30 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <div className="relative z-10 group-hover:text-emerald-950 transition-colors duration-500">
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </div>
      </motion.button>
    </div>
  );
};

export default ChatAssistant;