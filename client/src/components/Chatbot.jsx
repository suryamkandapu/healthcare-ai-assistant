import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you with your healthcare today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful healthcare assistant. Provide accurate medical information and encourage users to consult with healthcare professionals for serious concerns. Keep responses concise and friendly.',
            },
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            {
              role: 'user',
              content: inputValue,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      const botMessage = {
        id: messages.length + 2,
        text: data.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: `Sorry, I encountered an error. ${error.message}. Please make sure the backend server is running.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatbotOverlay} onClick={onClose}>
      <div className={styles.chatbotPopup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.chatbotHeader}>
          <h3>Healthcare Assistant</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageBubble}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageBubble}>
                <span className={styles.typing}>typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
            disabled={loading}
          />
          <button type="submit" className={styles.sendButton} disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
