import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ conversationId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    newSocket.auth = { token: localStorage.getItem('token') };
    newSocket.connect();

    newSocket.on('connect', () => {
      newSocket.emit('join-chat', conversationId);
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId,
      senderId: user.id,
      receiverId: receiver._id,
      message: newMessage.trim(),
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-2xl shadow-xl border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <img src={receiver.avatar} alt={receiver.firstName} className="w-10 h-10 rounded-xl" />
        <div>
          <h3 className="font-bold">{receiver.firstName} {receiver.lastName}</h3>
          <span className="text-xs text-green-500">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.senderId === user.id 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}>
              <p>{message.message}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-all disabled:opacity-50 flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

