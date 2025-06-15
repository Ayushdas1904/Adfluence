'use client';

import { socket } from '@/lib/socketClient';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get("creatorId");
  const brandId = searchParams.get("brandId");

  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userType, setUserType] = useState<'creator' | 'brand' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedType = localStorage.getItem('userType') as 'creator' | 'brand' | null;
    setUserType(storedType);
  }, []);

  useEffect(() => {
    if (creatorId && brandId && userType) {
      const generatedRoom = `${creatorId}_${brandId}`;
      setRoom(generatedRoom);
      socket.emit('join-room', generatedRoom, creatorId, brandId);

      fetch(`/api/chat/getMessages?room=${generatedRoom}&senderId=${creatorId}&receiverId=${brandId}`)
        .then((response) => response.json())
        .then((data) => {
          setMessages(data.messages);
        });
    }
  }, [creatorId, brandId, userType]);

  useEffect(() => {
    socket.on('receive-message', ({ sender, message }: { sender: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && userType && creatorId && brandId) {
      const senderId = userType === 'creator' ? creatorId : brandId;
      const receiverId = userType === 'creator' ? brandId : creatorId;

      socket.emit('send-message', {
        room,
        message: inputMessage,
        senderId,
        receiverId,
      });

      setMessages((prev) => [...prev, { sender: senderId, message: inputMessage }]);
      setInputMessage('');
    }
  };

  const getLoggedInUserId = () => {
    return userType === 'creator' ? creatorId : brandId;
  };

  return (
    <div className="flex justify-center w-full p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-[#1a1a1a] shadow-md rounded-lg flex flex-col overflow-hidden border border-gray-300 dark:border-gray-700">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">CHAT</h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-[#121212]">
          {messages.map((msg, index) => {
            const isSentByMe = msg.sender === getLoggedInUserId();
            return (
              <div key={index} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    isSentByMe
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]">
          <input
            type="text"
            value={inputMessage}
            placeholder="Type a message..."
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2a] text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
