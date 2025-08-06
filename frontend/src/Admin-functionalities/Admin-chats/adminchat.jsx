// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './admin-chat.css';
// import { AdminHeader } from '../Admin_header.jsx';
// import { AdminFooter } from '../Admin_footer.jsx';
// import { Loader } from '../../home/Loader.jsx';
// export const AdminChat = () => {
//   const { ticketId } = useParams();
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
//   // Debug ticketId
//   useEffect(() => {
//     console.log('Received ticketId from useParams:', ticketId);
//     if (!ticketId) {
//       setError('Invalid ticket ID');
//       setLoading(false);
//       navigate('/admin-chats');
//     }
//   }, [ticketId, navigate]);

//   // Fetch ticket details
//   const fetchTicket = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/tickets`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch tickets: ${response.status}`);
//       }
//       const tickets = await response.json();
//       console.log('Fetched tickets:', tickets);
//       const foundTicket = tickets.find(t => t._id === ticketId);
//       if (!foundTicket) {
//         throw new Error('Ticket not found');
//       }
//       setTicket(foundTicket);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching ticket:', error);
//       setError(`Failed to load ticket: ${error.message}`);
//       setLoading(false);
//       navigate('/admin-chats');
//     }
//   }, [ticketId, navigate]);

//   // Fetch messages with retry logic
//   const fetchMessages = useCallback(async (retryCount = 0, maxRetries = 3) => {
//     if (!ticketId) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/messages/${ticketId}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
//       }
//       const data = await response.json();
//       console.log('Fetched messages:', data);
//       setMessages(data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       if (error.message.includes('ECONNRESET') && retryCount < maxRetries) {
//         const delay = Math.pow(2, retryCount) * 1000;
//         console.log(`Retrying fetchMessages in ${delay}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
//         setTimeout(() => fetchMessages(retryCount + 1, maxRetries), delay);
//       } else {
//         setError(`Failed to load messages: ${error.message}`);
//       }
//     }
//   }, [ticketId]);

//   // Fetch on mount and poll
//   useEffect(() => {
//     if (ticketId) {
//       fetchTicket();
//       fetchMessages();
//       const interval = setInterval(fetchMessages, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [fetchTicket, fetchMessages, ticketId]);

//   // Send reply
//   const sendReply = async () => {
//     if (!input.trim()) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: input, isAdmin: true }),
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to send reply: ${response.status} ${errorText}`);
//       }
//       setInput('');
//       fetchMessages();
//     } catch (error) {
//       console.error(`Error sending reply for ticket ${ticketId}:`, error);
//       setError(`Failed to send reply: ${error.message}`);
//     }
//   };
//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault(); // Prevent form submission or page refresh
//       sendReply();
//     }
//   };

  

//   // Clear chat
//   const clearChat = async () => {
//     if (window.confirm(`Are you sure you want to clear the chat for ticket ${ticketId}?`)) {
//       try {
//         const response = await fetch(`${API_URL}/api/tickets/delete/${ticketId}`, {
//           method: 'DELETE',
//         });
//         if (!response.ok) {
//           throw new Error(`Failed to clear chat: ${response.status} ${response.statusText}`);
//         }
//         setMessages([]);
//         fetchMessages();
//         alert('Chat cleared successfully');
//       } catch (error) {
//         console.error(`Error clearing chat for ticket ${ticketId}:`, error);
//         alert(`Failed to clear chat: ${error.message}`);
//       }
//     }
//   };

//   if (loading) {

//     return <Loader/>;
//   }

//   if (!ticket) {
//     return <div>Ticket not found</div>;
//   }

//   return (
//     <div className="main-admin">
//       <AdminHeader />
//       <div className="chat-admin">
//         <div className="admin-chat-container">
//           <h1 className="admin-chat-header">{ticket.issue}</h1>
//           {error && <div className="chat-error">{error}</div>}
//           <div className="chat-messages">
//             {messages.length === 0 ? (
//               <p>No messages for this ticket.</p>
//             ) : (
//               messages.map((msg, index) => (
//                 <div key={index} className="chat-message">
//                   <span className="chat-user">{msg.userId}: </span>
//                   <span>{msg.text}</span>
//                 </div>
//               ))
//             )}
//           </div>
//           <div className="chat-input-container">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your reply..."
//               className="chat-input"
//             />
//             <button onClick={sendReply} className="chat-send-button">
//               Send
//             </button>
//           </div>
//           <button onClick={clearChat} className="chat-clear-button">
//             Clear Chat
//           </button>
//         </div>
//       </div>
//       <AdminFooter />
//     </div>
//   );
// };







import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './admin-chat.css';
import { AdminHeader } from '../Admin_header.jsx';
import { AdminFooter } from '../Admin_footer.jsx';
import { Loader } from '../../home/Loader.jsx';
import { AuthContext } from '../../context/AuthContext';

export const AdminChat = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const lastMessageIdRef = useRef('');
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to access the chat');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
      const response = await fetch(`${API_URL}/api/tickets`, {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
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
  }, [ticketId, navigate, setIsAuthenticated]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;
    try {
      const response = await fetch(`${API_URL}/api/tickets/messages/${ticketId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
        if (response.status === 404 && retryCount < maxRetries) {
          console.log(`Chat not found for ticket ${ticketId}, retrying (${retryCount + 1}/${maxRetries})`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchMessages, 2000);
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched messages:', data);
      const newMessages = data || [];

      // Check for new user messages
      const lastMessage = newMessages[newMessages.length - 1];
      console.log('Last message check:', {
        lastMessage,
        lastMessageId: lastMessageIdRef.current,
        messagesLength: newMessages.length,
        prevMessagesLength: messages.length,
      });
      if (
        lastMessage &&
        (lastMessage.id !== lastMessageIdRef.current || lastMessage._id !== lastMessageIdRef.current) &&
        !lastMessage.isAdmin &&
        newMessages.length > messages.length
      ) {
        console.log('Toast triggered: New message from user');
        toast.info(`New message from user: ${lastMessage.text.substring(0, 30)}...`, {
          position: 'top-right',
          autoClose: 5000,
        });
        lastMessageIdRef.current = lastMessage.id || lastMessage._id || '';
      }

      setMessages(newMessages);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      setError(`Failed to load messages: ${error.message}`);
    }
  }, [ticketId, retryCount, messages.length, setIsAuthenticated, navigate]);

  // Fetch on mount and poll
  useEffect(() => {
    if (ticketId && isAuthenticated) {
      fetchTicket();
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchTicket, fetchMessages, ticketId, isAuthenticated]);

  // Send reply
  const sendReply = async () => {
    if (!input.trim() || !ticketId) return;
    try {
      const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input, isAdmin: true }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
        const errorText = await response.text();
        throw new Error(`Failed to send reply: ${response.status} ${errorText}`);
      }
      setInput('');
      console.log('Toast triggered: Message sent successfully');
      toast.success('Message sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error.message);
      console.log('Toast triggered: Failed to send reply');
      toast.error(`Failed to send reply: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendReply();
    }
  };

  // Clear chat
  const clearChat = async () => {
    if (window.confirm(`Are you sure you want to clear the chat for ticket ${ticketId}?`)) {
      try {
        const response = await fetch(`${API_URL}/api/tickets/delete/${ticketId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            navigate('/login');
            return;
          }
          throw new Error(`Failed to clear chat: ${response.status} ${response.statusText}`);
        }
        setMessages([]);
        console.log('Toast triggered: Chat cleared successfully');
        toast.success('Chat cleared successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchMessages();
      } catch (error) {
        console.error('Error clearing chat:', error.message);
        console.log('Toast triggered: Failed to clear chat');
        toast.error(`Failed to clear chat: ${error.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <Loader />;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="main-admin">
      <AdminHeader />
      <div className="chat-admin">
        <div className="admin-chat-container">
          <ToastContainer />
          <h1 className="admin-chat-header">{ticket.issue}</h1>
          {error && <div className="chat-error">{error}</div>}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p>No messages for this ticket.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`chat-message-admin ${msg.isAdmin ? 'admin' : 'user'}`}>
                  <span className="chat-user">{msg.userId}: </span>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
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