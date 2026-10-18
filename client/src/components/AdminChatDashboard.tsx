'use client';

import { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';

export default function AdminChatDashboard({ adminUser }: { adminUser: { _id: string; name: string } }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch all chat threads on mount and setup socket listeners
  useEffect(() => {
    socket.connect();

    // Fetch initial threads list
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http:localhost:5000'
    fetch(`${backendUrl}/api/chat/admin/threads`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setThreads(data);
          if (data.length > 0) setSelectedThread(data[0]); // Select first thread by default
        }
      });

    // Listen for new incoming messages across any thread to update thread list ordering
    socket.on('thread_updated', (updatedThread) => {
      setThreads(prev => {
        const index = prev.findIndex(t => t._id === updatedThread._id);
        if (index !== -1) {
          const newThreads = [...prev];
          newThreads[index] = { ...newThreads[index], ...updatedThread };
          return newThreads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        } else {
          return [updatedThread, ...prev];
        }
      });
    });

    return () => {
      socket.off('thread_updated');
      socket.disconnect();
    };
  }, []);

  // 2. When a thread is selected, join user room and fetch messages
  useEffect(() => {
    if (!selectedThread || !selectedThread.user) return;

    const targetUserId = selectedThread.user._id || selectedThread.user;
    socket.emit('join_room', targetUserId);

    // Fetch messages for this thread
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http:localhost:5000'
    fetch(`${backendUrl}/api/chat/messages/${targetUserId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));

    // Listen for real-time messages in this specific room
    const handleReceiveMessage = (newMsg: any) => {
      setMessages(prev => [...prev, newMsg]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [selectedThread]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Handle sending admin reply
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedThread) return;

    const targetUserId = selectedThread.user._id || selectedThread.user;

    socket.emit('send_message', {
      userId: targetUserId,
      senderId: adminUser._id,
      senderRole: 'admin',
      message: input.trim()
    });

    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm h-[600px] flex overflow-hidden font-mono">
      
      {/* Sidebar: Thread List */}
      <div className="w-1/3 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Support Inboxes</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Active user conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y">
          {threads.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">No support chats yet.</div>
          ) : (
            threads.map((thread) => {
              const isSelected = selectedThread?._id === thread._id;
              const userName = thread.user?.name || 'Unknown User';
              const userEmail = thread.user?.email || '';

              return (
                <div 
                  key={thread._id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs truncate">{userName}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {thread.lastMessage || userEmail}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h4 className="text-xs font-bold text-gray-900">{selectedThread.user?.name || 'User'}</h4>
                <p className="text-[10px] text-gray-500">{selectedThread.user?.email}</p>
              </div>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedThread.status || 'Active'}
              </span>
            </div>

            {/* Messages Box */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50/50">
              {messages.map((msg, i) => {
                const isAdmin = msg.senderRole === 'admin';
                return (
                  <div 
                    key={i} 
                    className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                      isAdmin 
                        ? 'bg-black text-white ml-auto rounded-br-none' 
                        : 'bg-white border text-gray-800 mr-auto rounded-bl-none'
                    }`}
                  >
                    <p className="text-[9px] font-bold mb-1 opacity-60">
                      {isAdmin ? 'Admin Support' : selectedThread.user?.name}
                    </p>
                    <p>{msg.message}</p>
                    <span className="text-[8px] opacity-50 block text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Type your reply as admin..."
                className="flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button 
                type="submit" 
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Send Reply
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
            Select a conversation from the sidebar to start messaging.
          </div>
        )}
      </div>

    </div>
  );
}