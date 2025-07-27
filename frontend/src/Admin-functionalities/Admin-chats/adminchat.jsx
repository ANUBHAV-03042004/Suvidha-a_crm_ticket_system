import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './admin-chat.css';
import { AdminHeader } from '../Admin_header.jsx';
import { AdminFooter } from '../Admin_footer.jsx';
import { Loader } from '../../home/Loader.jsx';
export const AdminChat = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug ticketId
  useEffect(() => {
    console.log('Received ticketId from useParams:', ticketId);
    if (!ticketId) {
      setError('Invalid ticket ID');
      setLoading(false);
      navigate('/admin-chats');
    }
  }, [ticketId, navigate]);

  // Fetch ticket details
  const fetchTicket = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/tickets');
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
      navigate('/admin-chats');
    }
  }, [ticketId, navigate]);

  // Fetch messages with retry logic
  const fetchMessages = useCallback(async (retryCount = 0, maxRetries = 3) => {
    if (!ticketId) return;
    try {
      const response = await fetch(`http://localhost:4000/api/tickets/messages/${ticketId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched messages:', data);
      setMessages(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.message.includes('ECONNRESET') && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying fetchMessages in ${delay}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
        setTimeout(() => fetchMessages(retryCount + 1, maxRetries), delay);
      } else {
        setError(`Failed to load messages: ${error.message}`);
      }
    }
  }, [ticketId]);

  // Fetch on mount and poll
  useEffect(() => {
    if (ticketId) {
      fetchTicket();
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchTicket, fetchMessages, ticketId]);

  // Send reply
  const sendReply = async () => {
    if (!input.trim()) return;
    try {
      const response = await fetch(`http://localhost:4000/api/tickets/send/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, isAdmin: true }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send reply: ${response.status} ${errorText}`);
      }
      setInput('');
      fetchMessages();
    } catch (error) {
      console.error(`Error sending reply for ticket ${ticketId}:`, error);
      setError(`Failed to send reply: ${error.message}`);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission or page refresh
      sendReply();
    }
  };

  

  // Clear chat
  const clearChat = async () => {
    if (window.confirm(`Are you sure you want to clear the chat for ticket ${ticketId}?`)) {
      try {
        const response = await fetch(`http://localhost:4000/api/tickets/delete/${ticketId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to clear chat: ${response.status} ${response.statusText}`);
        }
        setMessages([]);
        fetchMessages();
        alert('Chat cleared successfully');
      } catch (error) {
        console.error(`Error clearing chat for ticket ${ticketId}:`, error);
        alert(`Failed to clear chat: ${error.message}`);
      }
    }
  };

  if (loading) {
    // return <div>Loading...</div>;
    return <Loader/>;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="main-admin">
      <AdminHeader />
      <div className="chat-admin">
        <div className="admin-chat-container">
          <h1 className="admin-chat-header">{ticket.issue}</h1>
          {error && <div className="chat-error">{error}</div>}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p>No messages for this ticket.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="chat-message">
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
              placeholder="Type your reply..."
              className="chat-input"
            />
            <button onClick={sendReply} className="chat-send-button">
              Send
            </button>
          </div>
          <button onClick={clearChat} className="chat-clear-button">
            Clear Chat
          </button>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};