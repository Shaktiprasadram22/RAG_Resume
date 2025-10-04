import React, { useState, useEffect } from 'react';
import { sendChatMessage, getChatGreeting } from '../api/api';

/**
 * RAGChatbot Component
 * Interactive chat interface for resume queries
 */
const RAGChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load greeting on mount
  useEffect(() => {
    loadGreeting();
  }, []);

  const loadGreeting = async () => {
    try {
      const response = await getChatGreeting();
      if (response.success) {
        setMessages([{ 
          id: 1, 
          text: response.data.message, 
          sender: 'bot' 
        }]);
      }
    } catch (err) {
      // Fallback greeting
      setMessages([{ 
        id: 1, 
        text: 'Hello! I\'m your ResumeRAG assistant. How can I help you today?', 
        sender: 'bot' 
      }]);
    }
  };

  // Handle sending message
  const handleSend = async (event) => {
    event.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = { id: messages.length + 1, text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentMessage = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Send to backend
      const response = await sendChatMessage(currentMessage, conversationHistory);
      
      if (response.success) {
        const botMessage = { 
          id: messages.length + 2, 
          text: response.data.response.message,
          sender: 'bot' 
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = { 
        id: messages.length + 2, 
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rag-chatbot" className="section">
      <div className="section-header">
        <h2 className="section-title">RAG Chatbot</h2>
        <p className="section-subtitle">Ask questions about resumes and get AI-powered answers</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">💬</div>
          <div>
            <h3 className="card-title">Chat Assistant</h3>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <div className="chat-container">
            {/* Messages Area */}
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.sender}`}>
                  <div className={`chat-avatar ${message.sender}`}>
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className={`chat-bubble ${message.sender}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about resumes..."
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()}>
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RAGChatbot;
