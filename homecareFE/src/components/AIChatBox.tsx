import React, { useState } from 'react';

interface AIChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatBox: React.FC<AIChatBoxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello! I am your HomeCare AI assistant. How can I help you care for your family members today?' }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: `Thank you for reaching out! Regarding "${userMsg}", our certified caregivers are fully trained to support your specific home care needs. Feel free to explore our services or message us for specific help.` }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[480px] bg-white dark:bg-stone-950 border border-teal-50 dark:border-stone-800 rounded-3xl shadow-2xl z-[99] flex flex-col overflow-hidden animate-fade-in-up font-manrope">
      {/* Header */}
      <div className="bg-[#0d8ca5] text-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">support_agent</span>
          <div>
            <h3 className="font-extrabold text-sm leading-tight">HomeCare AI</h3>
            <span className="text-[10px] opacity-75">Ready to assist</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-stone-50/50 dark:bg-stone-900/10">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#0d8ca5] text-white rounded-br-none shadow-sm shadow-[#0d8ca5]/10'
                  : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-teal-50/30 dark:border-stone-800 flex gap-2 bg-white dark:bg-stone-950">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="submit" className="w-10 h-10 bg-[#0d8ca5] hover:bg-[#0a7d94] text-white rounded-2xl flex items-center justify-center shadow-md transition-colors shrink-0">
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
};

export default AIChatBox;
