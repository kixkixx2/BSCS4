import React, { useState, useEffect, useRef } from 'react';
import { Message, SystemStatus } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Terminal, Cpu, Minimize2, ChevronUp } from 'lucide-react';

// Typing effect component
const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'system',
      text: 'NEXCS 4 SYSTEM CORE ONLINE. WAITING FOR INPUT...',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]); // Scroll when status changes (typing starts) or messages update

  const handleSendMessage = async () => {
    if (!inputValue.trim() || status === SystemStatus.ANALYZING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setStatus(SystemStatus.ANALYZING);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        isTyping: true // Flag to trigger typing effect
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setStatus(SystemStatus.IDLE);
    } catch (e) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: 'ERROR: COMMUNICATION LINK SEVERED.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      setStatus(SystemStatus.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-cyber-dark/90 backdrop-blur border border-cyber-primary text-cyber-primary p-3 rounded-tr-xl rounded-bl-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-110 transition-transform z-50 group"
      >
        <div className="absolute inset-0 bg-cyber-primary/20 animate-pulse rounded-tr-xl rounded-bl-xl"></div>
        <Cpu size={24} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm md:max-w-md bg-cyber-black/95 backdrop-blur-md border border-cyber-primary/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col z-50 h-[500px] rounded-tl-lg rounded-tr-3xl rounded-bl-3xl rounded-br-lg overflow-hidden transition-all duration-300">
      
      {/* Decorative HUD Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-primary pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-primary pointer-events-none"></div>

      {/* Header */}
      <div className="bg-cyber-slate/50 p-3 flex justify-between items-center border-b border-cyber-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-transparent animate-pulse pointer-events-none"></div>
        <div className="flex items-center gap-2 text-cyber-primary z-10">
          <Terminal size={18} />
          <span className="font-mono text-sm font-bold tracking-wider">SYSTEM CORE AI</span>
        </div>
        <div className="flex items-center gap-3 z-10">
           <div className="flex flex-col items-end">
             <span className="text-[8px] text-gray-400 font-mono leading-none">STATUS</span>
             <span className={`text-[10px] font-bold ${status === SystemStatus.ANALYZING ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
               {status === SystemStatus.ANALYZING ? 'COMPUTING' : 'ONLINE'}
             </span>
           </div>
           <button onClick={() => setIsOpen(false)} className="text-cyber-primary/70 hover:text-white transition-colors">
             <Minimize2 size={16} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-cyber-primary/20">
        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`
                max-w-[90%] p-3 rounded-sm border relative
                ${msg.role === 'user' 
                  ? 'bg-cyber-slate/80 text-white border-cyber-slate ml-8' 
                  : msg.role === 'system'
                    ? 'bg-red-900/20 text-red-400 border-red-500/50 mr-8'
                    : 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30 mr-8'
                }
              `}
            >
              {/* Message specific corner accents */}
              <div className={`absolute top-0 ${msg.role === 'user' ? 'right-0' : 'left-0'} w-1 h-1 bg-current opacity-50`}></div>
              <div className={`absolute bottom-0 ${msg.role === 'user' ? 'left-0' : 'right-0'} w-1 h-1 bg-current opacity-50`}></div>

              {msg.role === 'model' && msg.isTyping && index === messages.length - 1 ? (
                 <TypewriterText text={msg.text} />
              ) : (
                 msg.text
              )}
            </div>
            <span className="text-[9px] text-gray-500 mt-1 font-mono tracking-tighter uppercase">
              {msg.role === 'user' ? '>> USER_INPUT' : '<< CORE_RESPONSE'} [{msg.timestamp.toLocaleTimeString()}]
            </span>
          </div>
        ))}
        {status === SystemStatus.ANALYZING && (
           <div className="flex items-start animate-pulse">
             <div className="text-cyber-primary text-xs font-mono">
               _ THINKING...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-cyber-dark border-t border-cyber-primary/30 relative z-20">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-cyber-primary/5 rounded-sm skew-x-12 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="ENTER COMMAND OR QUERY..."
              className="w-full bg-cyber-black/50 border border-gray-700 text-white p-2 pl-3 text-sm font-mono focus:outline-none focus:border-cyber-primary rounded-sm placeholder-gray-600 transition-colors relative z-10"
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={status === SystemStatus.ANALYZING}
            className="bg-cyber-primary text-cyber-black p-2 rounded-sm border border-cyber-primary hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};