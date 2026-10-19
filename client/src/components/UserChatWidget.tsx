'use client';

import { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';

export default function UserChatWidget({ user }: { user: { _id: string; name: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen; // Keep ref updated to avoid stale closures in socket listener

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit('join_room', user._id);

    // Load initial message history
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/chat/messages/${user._id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));

    // Listen for incoming messages in real-time
    socket.on('receive_message', (newMsg) => {
      setMessages(prev => [...prev, newMsg]);

      // Robust check: If the message sender is NOT the current user, it's from support/admin
      const isFromAdmin = newMsg.senderId !== user._id && newMsg.sender !== user._id;

      if (!isOpenRef.current && isFromAdmin) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [user._id]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0); // Reset unread count when opened
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('send_message', {
      userId: user._id,
      senderId: user._id,
      senderRole: 'user',
      message: input.trim()
    });

    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {!isOpen ? (
        <button 
          onClick={handleOpen}
          className="relative bg-black text-white px-4 py-3 rounded-full shadow-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          💬 Live Support
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white w-80 h-96 rounded-2xl border shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-3 flex justify-between items-center text-xs font-bold">
            <span>Support Chat</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {/* support message*/}
          <div className='bg-white font-mono w-full flex items-center justify-center'>
            <p className='text-sm text-gray-500'>Need help? send us a message, we usually reply within minutes.</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`max-w-[75%] p-2.5 rounded-lg ${
                  msg.senderRole === 'user' 
                    ? 'bg-black text-white ml-auto rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 mr-auto rounded-bl-none'
                }`}
              >
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
            />
            <button type="submit" className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}