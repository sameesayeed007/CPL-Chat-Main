import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { fetchMessages } from '../api';
import '../styles/Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const getMessages = async () => {
      const data = await fetchMessages();
      setMessages(data);
    };
    getMessages();
  }, []);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('send_message', { text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className='chat-room'>
      <h1 className='text-3xl font-bold mb-4'>Chat Room</h1>
      <div className='messages bg-gray-100 p-4 rounded-lg mb-4'>
        {messages.map((msg, index) => (
          <div key={index} className='message mb-2'>
            <strong className='text-blue-600'>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type='text'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder='Type a message...'
        className='border rounded p-2 mb-2 w-full'
      />
      <button
        onClick={sendMessage}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
      >
        Send
      </button>
    </div>
  );
}

export default Chat;