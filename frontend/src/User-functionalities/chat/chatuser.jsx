// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './chat.css';
// import { Header_user_dashboard } from '../header.jsx';
// import { Footer_all } from '../../home/footer_all.jsx';
// import { Loader } from '../../home/Loader.jsx';

// export const Chatuser = () => {
//   const { ticketId } = useParams();
//   const navigate = useNavigate();
//   const [ticket, setTicket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 3;
// const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
//   // Debug ticketId
//   useEffect(() => {
//     console.log('Received ticketId from useParams:', ticketId);
//     if (!ticketId) {
//       setError('Invalid ticket ID');
//       setLoading(false);
//       navigate('/user-dashboard');
//     }
//   }, [ticketId, navigate]);

//   // Fetch ticket details
//   const fetchTicket = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/tickets`, {
//         credentials: 'include',
//       });
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
//       navigate('/user-dashboard');
//     }
//   }, [ticketId, navigate]);

//   // Fetch messages
//   const fetchMessages = useCallback(async () => {
//     if (!ticketId) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/messages/${ticketId}`, {
//         credentials: 'include',
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         if (response.status === 404 && retryCount < maxRetries) {
//           console.log(`Chat not found for ticket ${ticketId}, retrying (${retryCount + 1}/${maxRetries})`);
//           setRetryCount(prev => prev + 1);
//           setTimeout(fetchMessages, 2000);
//           return;
//         }
//         throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
//       }
//       const data = await response.json();
//       console.log('Fetched messages:', data);
//       setMessages(data);
//       setError(null);
//       setRetryCount(0);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setError(`Failed to load messages: ${error.message}`);
//     }
//   }, [ticketId, retryCount]);

//   // Fetch on mount and poll
//   useEffect(() => {
//     if (ticketId) {
//       fetchTicket();
//       const initFetch = async () => {
//         await fetchMessages();
//         setTimeout(fetchMessages, 1000);
//       };
//       initFetch();
//       const interval = setInterval(fetchMessages, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [fetchTicket, fetchMessages, ticketId]);

//   // Send message
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ text: input }),
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to send message: ${response.status} ${errorText}`);
//       }
//       setInput('');
//       fetchMessages();
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError(`Failed to send message: ${error.message}`);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   // Clear chat
//   const clearChat = async () => {
//     if (window.confirm('Are you sure you want to clear this chat?')) {
//       try {
//         const response = await fetch(`${API_URL}/api/tickets/delete/${ticketId}`, {
//           method: 'DELETE',
//           credentials: 'include',
//         });
//         if (!response.ok) {
//           throw new Error(`Failed to clear chat: ${response.status}`);
//         }
//         setMessages([]);
//         fetchMessages();
//         alert('Chat cleared successfully');
//       } catch (error) {
//         console.error('Error clearing chat:', error);
//         alert(`Failed to clear chat: ${error.message}`);
//       }
//     }
//   };

//   if (loading) {
//     return <Loader/>;
//   }

//   if (!ticket) {
//     return <div>Issue not found</div>;
//   }

//   return (
//     <div className="homepage">
//       <Header_user_dashboard />
//       <div className="chat-user">
//         <div className="chat-container">
//           <h1 className="chat-header">{ticket.issue}</h1>
//           {error && <div className="chat-error">{error}</div>}
//           <div className="chat-messages">
//             {messages.length === 0 ? (
//               <div>Write us Your Problem 😊</div>
//             ) : (
//               messages.map((msg, index) => (
//                 <div key={index} className={`chat-message ${msg.isAdmin ? 'admin' : 'user'}`}>
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
//               placeholder="Type a message..."
//               className="chat-input"
//             />
//             <button onClick={sendMessage} className="chat-send-button">
//               Send
//             </button>
//           </div>
//           <button onClick={clearChat} className="chat-clear-button">
//             Clear Chat
//           </button>
//         </div>
//       </div>
//       <Footer_all />
//     </div>
//   );
// };










// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './chat.css';
// import { Header_user_dashboard } from '../header.jsx';
// import { Footer_all } from '../../home/footer_all.jsx';
// import { Loader } from '../../home/Loader.jsx';
// import { AuthContext } from '../../context/AuthContext';

// export const Chatuser = () => {
//   const { ticketId } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
//   const [ticket, setTicket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 3;
//   const lastMessageIdRef = useRef('');
//   const messagesEndRef = useRef(null);
//   const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setError('Please log in to access the chat');
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     console.log('Received ticketId from useParams:', ticketId);
//     if (!ticketId) {
//       setError('Invalid ticket ID');
//       setLoading(false);
//       navigate('/user-dashboard');
//     }
//   }, [ticketId, navigate]);

//   const fetchTicket = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/tickets`, {
//         credentials: 'include',
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           setIsAuthenticated(false);
//           navigate('/login');
//           return;
//         }
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
//       navigate('/user-dashboard');
//     }
//   }, [ticketId, navigate, setIsAuthenticated]);

//   const fetchMessages = useCallback(async () => {
//     if (!ticketId) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/messages/${ticketId}`, {
//         credentials: 'include',
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           setIsAuthenticated(false);
//           navigate('/login');
//           return;
//         }
//         if (response.status === 404 && retryCount < maxRetries) {
//           console.log(`Chat not found for ticket ${ticketId}, retrying (${retryCount + 1}/${maxRetries})`);
//           setRetryCount(prev => prev + 1);
//           setTimeout(fetchMessages, 2000);
//           return;
//         }
//         throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
//       }
//       const data = await response.json();
//       console.log('Fetched messages:', data);
//       const newMessages = data || [];

//       const lastMessage = newMessages[newMessages.length - 1];
//       if (lastMessage) {
//         // Fallback ID: use text + timestamp or index if createdAt is missing
//         const messageId = lastMessage.createdAt || `${lastMessage.text}-${Date.now()}`;
//         if (lastMessage.isAdmin && messageId !== lastMessageIdRef.current) {
//           console.log('Toast triggered: New message from admin');
//           toast.warning(`New message from admin: ${lastMessage.text.substring(0, 30)}...`, {
//             position: 'top-right',
//             autoClose: 5000,
//           });
//           lastMessageIdRef.current = messageId;
//         }
//       }

//       setMessages(newMessages);
//       setError(null);
//       setRetryCount(0);
//     } catch (error) {
//       console.error('Error fetching messages:', error.message);
//       setError(`Failed to load messages: ${error.message}`);
//       toast.error(`Failed to load messages: ${error.message}`, {
//         position: 'top-right',
//         autoClose: 5000,
//       });
//     }
//   }, [ticketId, retryCount, setIsAuthenticated, navigate]);

//   useEffect(() => {
//     if (ticketId && isAuthenticated) {
//       fetchTicket();
//       fetchMessages();
//       const interval = setInterval(fetchMessages, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [fetchTicket, fetchMessages, ticketId, isAuthenticated]);

//   const sendMessage = async () => {
//     if (!input.trim() || !ticketId) return;
//     try {
//       const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ text: input, isAdmin: false }),
//       });
//       if (!response.ok) {
//         if (response.status === 401) {
//           setIsAuthenticated(false);
//           navigate('/login');
//           return;
//         }
//         const errorText = await response.text();
//         throw new Error(`Failed to send message: ${response.status} ${errorText}`);
//       }
//       setInput('');
//       console.log('Toast triggered: Message sent successfully');
//       toast.success('Message sent successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       fetchMessages();
//     } catch (error) {
//       console.error('Error sending message:', error.message);
//       toast.error(`Failed to send message: ${error.message}`, {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = async () => {
//     if (window.confirm('Are you sure you want to clear this chat?')) {
//       try {
//         const response = await fetch(`${API_URL}/api/tickets/delete/${ticketId}`, {
//           method: 'DELETE',
//           credentials: 'include',
//         });
//         if (!response.ok) {
//           if (response.status === 401) {
//             setIsAuthenticated(false);
//             navigate('/login');
//             return;
//           }
//           throw new Error(`Failed to clear chat: ${response.status} ${response.statusText}`);
//         }
//         setMessages([]);
//         toast.success('Chat cleared successfully!', {
//           position: 'top-right',
//           autoClose: 3000,
//         });
//         fetchMessages();
//       } catch (error) {
//         console.error('Error clearing chat:', error.message);
//         toast.error(`Failed to clear chat: ${error.message}`, {
//           position: 'top-right',
//           autoClose: 3000,
//         });
//       }
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   if (!ticket) {
//     return <div>Issue not found</div>;
//   }

//   return (
//     <div className="homepage">
//       <Header_user_dashboard />
//       <div className="chat-user">
//         <div className="chat-container">
//           <ToastContainer />
//           <h1 className="chat-header">{ticket.issue}</h1>
//           {error && <div className="chat-error">{error}</div>}
//           <div className="chat-messages">
//             {messages.length === 0 ? (
//               <div>Write us Your Problem 😊</div>
//             ) : (
//               messages.map((msg, index) => (
//                 <div key={index} className={`chat-message ${msg.isAdmin ? 'admin' : 'user'}`}>
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
//               placeholder="Type a message..."
//               className="chat-input"
//             />
//             <button onClick={sendMessage} className="chat-send-button">
//               Send
//             </button>
//           </div>
//           <button onClick={clearChat} className="chat-clear-button">
//             Clear Chat
//           </button>
//         </div>
//       </div>
//       <Footer_all />
//     </div>
//   );
// };









import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './chat.css';
import { Header_user_dashboard } from '../header.jsx';
import { Footer_all } from '../../home/footer_all.jsx';
import { Loader } from '../../home/Loader.jsx';
import { AuthContext } from '../../context/AuthContext';

export const Chatuser = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const lastMessageIdRef = useRef(''); // Store the last processed message ID
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to access the chat');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    console.log('Received ticketId from useParams:', ticketId);
    if (!ticketId) {
      setError('Invalid ticket ID');
      setLoading(false);
      navigate('/user-dashboard');
    }
  }, [ticketId, navigate]);

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
      navigate('/user-dashboard');
    }
  }, [ticketId, navigate, setIsAuthenticated]);

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

      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage) {
        // Use createdAt as the stable ID, fallback to text + index if missing
        const messageId = lastMessage.createdAt || `${lastMessage.text}-${newMessages.indexOf(lastMessage)}`;
        if (lastMessage.isAdmin && messageId !== lastMessageIdRef.current) {
          console.log('Toast triggered: New message from admin');
          toast.warning(`New message from admin: ${lastMessage.text.substring(0, 30)}...`, {
            position: 'top-right',
            autoClose: 5000,
          });
          lastMessageIdRef.current = messageId;
        }
      }

      setMessages(newMessages);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      setError(`Failed to load messages: ${error.message}`);
      toast.error(`Failed to load messages: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  }, [ticketId, retryCount, setIsAuthenticated, navigate]);

  useEffect(() => {
    if (ticketId && isAuthenticated) {
      fetchTicket();
      fetchMessages();
      const interval = setInterval(() => {
        // Only fetch if the last fetch was successful or retry count is reset
        if (retryCount === 0) fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchTicket, fetchMessages, ticketId, isAuthenticated, retryCount]);

  const sendMessage = async () => {
    if (!input.trim() || !ticketId) return;
    try {
      const response = await fetch(`${API_URL}/api/tickets/send/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: input, isAdmin: false }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${response.status} ${errorText}`);
      }
      setInput('');
      console.log('Toast triggered: Message sent successfully');
      toast.success('Message sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error.message);
      toast.error(`Failed to send message: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
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
        toast.success('Chat cleared successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchMessages();
      } catch (error) {
        console.error('Error clearing chat:', error.message);
        toast.error(`Failed to clear chat: ${error.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!ticket) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="homepage">
      <Header_user_dashboard />
      <div className="chat-user">
        <div className="chat-container">
          <ToastContainer />
          <h1 className="chat-header">{ticket.issue}</h1>
          {error && <div className="chat-error">{error}</div>}
          <div className="chat-messages" ref={messagesEndRef}>
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