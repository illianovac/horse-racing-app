'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

interface ChatComponentProps {
  raceId: string;
  userId: string;
  userName: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  raceId,
  userId,
  userName,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isConnected,
    isJoined,
    error,
    joinRaceChat,
    leaveRaceChat,
    sendMessage,
  } = useChat({ raceId, userId, userName });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-join race chat when connected
  useEffect(() => {
    if (isConnected && !isJoined) {
      joinRaceChat();
    }
    
    // Clean up on unmount
    return () => {
      if (isJoined) {
        leaveRaceChat();
      }
    };
  }, [isConnected, isJoined, joinRaceChat, leaveRaceChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Chat header */}
      <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 rounded-t-lg">
        <h3 className="text-lg font-semibold">Race Chat</h3>
        <div className="text-sm text-gray-500">
          {isConnected ? (
            <span className="text-green-500">Connected</span>
          ) : (
            <span className="text-red-500">Disconnected</span>
          )}
          {error && <span className="ml-2 text-red-500">{error}</span>}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.user.id === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    msg.user.id === userId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {msg.user.id === userId ? 'You' : msg.user.name}
                  </div>
                  <div className="mt-1">{msg.message}</div>
                  <div className="text-xs text-right mt-1 opacity-75">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="p-3 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected || !isJoined}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300"
            disabled={!isConnected || !isJoined || !message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
