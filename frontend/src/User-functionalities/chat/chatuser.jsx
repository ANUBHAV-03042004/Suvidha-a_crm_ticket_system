import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './chat.css';
import { Header_user_dashboard } from '../header.jsx';
import { Footer_all } from '../../home/footer_all.jsx';
import { Loader } from '../../home/Loader.jsx';

export const Chatuser = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
  // Debug ticketId
  useEffect(() => {
    console.log('Received ticketId from useParams:', ticketId);
    if (!ticketId) {
      setError('Invalid ticket ID');
      setLoading(false);
      navigate('/user-dashboard');
    }
  }, [ticketId, navigate]);

  // Fetch ticket details
  const fetchTicket = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.status}`);
      }
      const tickets = await response.json();
      console.log('Fetched tickets:', tickets);
      const foundTicket = tickets.find(t => t._id === ticketId);
      if (!foundTicket) {
        throw new Error('Ticket not found');
      }
      setTicket(foundTicket);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError(`Failed to load ticket: ${error.message}`);
      setLoading(false);
      navigate('/user-dashboard');
    }
  }, [ticketId, navigate]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;
    try {
      const response = await fetch(`${API_URL}/api/tickets/messages/${ticketId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404 && retryCount < maxRetries) {
          console.log(`Chat not found for ticket ${ticketId}, retrying (${retryCount + 1}/${maxRetries})`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchMessages, 2000);
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log('Fetched messages:', data);
      setMessages(data);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(`Failed to load messages: ${error.message}`);
    }
  }, [ticketId, retryCount]);

  // Fetch on mount and poll
  useEffect(() => {
    if (ticketId) {
      fetchTicket();
      const initFetch = async () => {
        await fetchMessages();
        setTimeout(fetchMessages, 1000);
      };
      initFetch();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [fetchTicket, fetchMessages, ticketId]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${response.status} ${errorText}`);
      }
      setInput('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  // Clear chat
  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      try {
        const response = await fetch(`${API_URL}/api/tickets/delete/${ticketId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to clear chat: ${response.status}`);
        }
        setMessages([]);
        fetchMessages();
        alert('Chat cleared successfully');
      } catch (error) {
        console.error('Error clearing chat:', error);
        alert(`Failed to clear chat: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <Loader/>;
  }

  if (!ticket) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="homepage">
      <Header_user_dashboard />
      <div className="chat-user">
        <div className="chat-container">
          <h1 className="chat-header">{ticket.issue}</h1>
          {error && <div className="chat-error">{error}</div>}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div>Write us Your Problem 😊</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.isAdmin ? 'admin' : 'user'}`}>
                  <span className="chat-user">{msg.userId}: </span>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button onClick={sendMessage} className="chat-send-button">
              Send
            </button>
          </div>
          <button onClick={clearChat} className="chat-clear-button">
            Clear Chat
          </button>
        </div>
      </div>
      <Footer_all />
    </div>
  );
};