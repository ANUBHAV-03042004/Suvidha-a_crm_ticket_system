// import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import styled from 'styled-components';
// import './ticket_table.css';
// import { Header_user_dashboard } from './header.jsx';
// import { Footer_all } from '../home/footer_all.jsx';
// import { Ticket_table } from './ticket_table.jsx';
// import { Profile } from '../User-functionalities/profile/profile.jsx';
// import { Feedback } from '../User-functionalities/feedback/feedback.jsx';
// import { Add_new_ticket } from '../User-functionalities/add_new_ticket/Add_new_ticket.jsx';
// import { Chatuser } from './chat/chatuser.jsx';
// import { AuthContext } from '../context/AuthContext';

// export const User_dashboard = () => {
//   const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const navigateRef = useRef(navigate);
//   const lastMessageIdsRef = useRef({});
//   const hasPromptedNotification = useRef(false);
//   const [fetchError, setFetchError] = useState(null);
//   const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

//   useEffect(() => {
//     navigateRef.current = navigate;
//   }, [navigate]);

//   useEffect(() => {
//     // Force notification prompt for testing (remove localStorage.setItem in production for one-time prompt)
//     localStorage.removeItem('hasPromptedNotification');
//     if ('Notification' in window && !localStorage.getItem('hasPromptedNotification')) {
//       localStorage.setItem('hasPromptedNotification', 'true');
//       hasPromptedNotification.current = true;
//       toast.info('Would you like to enable notifications for new messages?', {
//         position: 'top-right',
//         autoClose: 10000,
//         closeOnClick: false,
//         draggable: false,
//         onClick: () => {
//           Notification.requestPermission().then(permission => {
//             console.log('Notification permission:', permission);
//             if (permission !== 'granted') {
//               toast.warn('Notifications disabled. Enable in browser settings.', {
//                 position: 'top-right',
//                 autoClose: 5000,
//               });
//             } else {
//               toast.success('Notifications enabled!', {
//                 position: 'top-right',
//                 autoClose: 3000,
//               });
//             }
//           });
//         },
//       });
//     }
//   }, []);

//   const fetchAllMessages = useCallback(async () => {
//     if (!isAuthenticated) {
//       console.log('Skipping fetch: User not authenticated');
//       return;
//     }
//     try {
//       setFetchError(null);
//       const ticketResponse = await fetch(`${API_URL}/api/tickets`, {
//         credentials: 'include',
//       });
//       if (!ticketResponse.ok) {
//         if (ticketResponse.status === 401) {
//           console.log('Unauthorized: Redirecting to login');
//           setIsAuthenticated(false);
//           navigate('/login');
//           return;
//         }
//         if (ticketResponse.status === 500) {
//           console.error('Server error (500) on /api/tickets');
//           setFetchError('Server error, please try again later.');
//           return;
//         }
//         const errorText = await ticketResponse.text();
//         throw new Error(`Failed to fetch tickets: ${ticketResponse.status} ${errorText}`);
//       }
//       const tickets = await ticketResponse.json();
//       console.log('Fetched tickets for dashboard:', tickets);

//       if (!tickets.length) {
//         console.log('No tickets found for user');
//         return;
//       }

//       for (const ticket of tickets) {
//         const response = await fetch(`${API_URL}/api/tickets/messages/${ticket._id}`, {
//           credentials: 'include',
//         });
//         if (!response.ok) {
//           if (response.status === 401) {
//             console.log('Unauthorized: Redirecting to login');
//             setIsAuthenticated(false);
//             navigate('/login');
//             return;
//           }
//           if (response.status === 404) {
//             console.log(`No messages for ticket ${ticket._id}`);
//             continue;
//           }
//           if (response.status === 500) {
//             console.error(`Server error (500) on /api/tickets/messages/${ticket._id}`);
//             continue;
//           }
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch messages for ticket ${ticket._id}: ${response.status} ${errorText}`);
//         }
//         const messages = await response.json();
//         console.log(`Fetched messages for ticket ${ticket._id}:`, messages);
//         const lastMessage = messages[messages.length - 1];

//         if (lastMessage) {
//           // Stable fallback ID: use message index or text if createdAt is missing
//           const messageId = lastMessage.createdAt || `${lastMessage.text}-${messages.indexOf(lastMessage)}`;
//           console.log(`Last message for ticket ${ticket._id}:`, {
//             id: lastMessage.id,
//             _id: lastMessage._id,
//             isAdmin: lastMessage.isAdmin,
//             text: lastMessage.text,
//             createdAt: lastMessage.createdAt,
//             messageId,
//             storedId: lastMessageIdsRef.current[ticket._id],
//           });

//           if (
//             lastMessage.isAdmin &&
//             lastMessageIdsRef.current[ticket._id] !== messageId
//           ) {
//             console.log(`New admin message detected for ticket ${ticket._id}:`, lastMessage);
//             toast.warning(
//               `New message for ${ticket.issue}: ${lastMessage.text.substring(0, 30)}...`,
//               {
//                 position: 'top-right',
//                 autoClose: 5000,
//                 onClick: () => {
//                   if (window.confirm('View new message?')) {
//                     navigate(`/chat/${ticket._id}`);
//                   }
//                 },
//               }
//             );
//             lastMessageIdsRef.current[ticket._id] = messageId;
//           } else {
//             console.log(`No new admin message for ticket ${ticket._id}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching messages in dashboard:', error.message);
//       setFetchError(error.message);
//       toast.error(`Failed to check for new messages: ${error.message}`, {
//         position: 'top-right',
//         autoClose: 5000,
//       });
//     }
//   }, [isAuthenticated, setIsAuthenticated, navigate]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchAllMessages();
//       const interval = setInterval(fetchAllMessages, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [fetchAllMessages, isAuthenticated]);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       toast.error('Please log in to access the dashboard', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={{ zIndex: 2147483647 }} // Maximum z-index to ensure it appears above the fixed header
//       />
//       <StyledWrapper>
//         <div className="homepage">
//           <Header_user_dashboard />
//           <div className="content-user">
//             {fetchError && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>Error: {fetchError}</div>}
//             <Routes>
//               <Route path="/" element={<Ticket_table navigateRef={navigateRef} />} />
//               <Route path="/add_new_ticket" element={<Add_new_ticket navigateRef={navigateRef} />} />
//               <Route path="/profile" element={<Profile navigateRef={navigateRef} />} />
//               <Route path="/feedback" element={<Feedback navigateRef={navigateRef} />} />
//               <Route path="/chat/:ticketId" element={<Chatuser navigateRef={navigateRef} />} />
//               <Route path="*" element={<Ticket_table navigateRef={navigateRef} />} />
//             </Routes>
//           </div>
//           <Footer_all />
//         </div>
//       </StyledWrapper>
//     </>
//   );
// };

// const StyledWrapper = styled.div`
//   @media (min-width: 0px) and (max-width: 90px) {
//     .input-container-wrapper {
//       display: none !important;
//     }
//   }
//   @media (min-height: 0px) and (max-height: 90px) {
//     .input-container-wrapper {
//       display: none !important;
//     }
//   }
//   @media (min-width: 90px) and (max-width: 330px) {
//     .input-container-wrapper {
//       width: 50vw !important;
//       margin-left: 4vw !important;
//     }
//   }
//   @media (min-width: 330px) and (max-width: 700px) {
//     .input-container-wrapper {
//       width: 35vw !important;
//     }
//   }
//   @media (min-width: 330px) and (max-width: 1100px) {
//     .input-container-wrapper {
//       margin-left: 3.5vw !important;
//     }
//   }
//   @media (min-width: 1100px) and (max-width: 1260px) {
//     .input-container-wrapper {
//       margin-left: 2.5vw !important;
//     }
//   }
//   @media (max-width: 1300px) {
//     .input-container-wrapper {
//       margin-left: 1.7vw;
//     }
//   }
//   .input-container-wrapper {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 35vh;
//     width: 20vw;
//   }
//   .input-container {
//     width: 220px;
//     position: relative;
//   }
//   .icon {
//     position: absolute;
//     right: 10px;
//     top: calc(50% + 5px);
//     transform: translateY(calc(-50% - 5px));
//   }
//   .input {
//     width: 100%;
//     height: 40px;
//     padding: 10px;
//     transition: 0.2s linear;
//     border: 2.5px solid #679ef8;
//     font-size: 14px;
//     text-transform: uppercase;
//     letter-spacing: 2px;
//   }
//   .input::placeholder {
//     color: black;
//     font-weight: bold;
//   }
//   .input:focus {
//     outline: none;
//     border: 0.5px solid #679ef8;
//     box-shadow: -5px -5px 0px #679ef8;
//   }
//   .input-container:hover > .icon {
//     animation: anim 1s linear infinite;
//   }
//   @keyframes anim {
//     0%, 100% {
//       transform: translateY(calc(-50% - 5px)) scale(1);
//     }
//     50% {
//       transform: translateY(calc(-50% - 5px)) scale(1.1);
//     }
//   }
// `;








import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import './ticket_table.css';
import { Header_user_dashboard } from './header.jsx';
import { Footer_all } from '../home/footer_all.jsx';
import { Ticket_table } from './ticket_table.jsx';
import { Profile } from '../User-functionalities/profile/profile.jsx';
import { Feedback } from '../User-functionalities/feedback/feedback.jsx';
import { Add_new_ticket } from '../User-functionalities/add_new_ticket/Add_new_ticket.jsx';
import { Chatuser } from './chat/chatuser.jsx';
import { AuthContext } from '../context/AuthContext';

export const User_dashboard = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const lastMessageIdsRef = useRef({});
  const hasPromptedNotification = useRef(false);
  const notificationPermission = useRef('default'); // Track notification permission status
  const [fetchError, setFetchError] = useState(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    // Force notification prompt for testing (remove localStorage.setItem in production for one-time prompt)
    localStorage.removeItem('hasPromptedNotification');
    if ('Notification' in window && !localStorage.getItem('hasPromptedNotification')) {
      localStorage.setItem('hasPromptedNotification', 'true');
      hasPromptedNotification.current = true;
      toast.info('Would you like to enable notifications for new messages?', {
        position: 'top-right',
        autoClose: 10000,
        closeOnClick: false,
        draggable: false,
        onClick: () => {
          Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
            notificationPermission.current = permission; // Update permission status
            if (permission !== 'granted') {
              // No toast for denied permission as per requirement
            } else {
              toast.success('Notifications enabled!', {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          });
        },
      });
    }
  }, []);

  const fetchAllMessages = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Skipping fetch: User not authenticated');
      return;
    }
    try {
      setFetchError(null);
      const ticketResponse = await fetch(`${API_URL}/api/tickets`, {
        credentials: 'include',
      });
      if (!ticketResponse.ok) {
        if (ticketResponse.status === 401) {
          console.log('Unauthorized: Redirecting to login');
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
        if (ticketResponse.status === 500) {
          console.error('Server error (500) on /api/tickets');
          setFetchError('Server error, please try again later.');
          return;
        }
        const errorText = await ticketResponse.text();
        throw new Error(`Failed to fetch tickets: ${ticketResponse.status} ${errorText}`);
      }
      const tickets = await ticketResponse.json();
      console.log('Fetched tickets for dashboard:', tickets);

      if (!tickets.length) {
        console.log('No tickets found for user');
        return;
      }

      for (const ticket of tickets) {
        const response = await fetch(`${API_URL}/api/tickets/messages/${ticket._id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized: Redirecting to login');
            setIsAuthenticated(false);
            navigate('/login');
            return;
          }
          if (response.status === 404) {
            console.log(`No messages for ticket ${ticket._id}`);
            continue;
          }
          if (response.status === 500) {
            console.error(`Server error (500) on /api/tickets/messages/${ticket._id}`);
            continue;
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch messages for ticket ${ticket._id}: ${response.status} ${errorText}`);
        }
        const messages = await response.json();
        console.log(`Fetched messages for ticket ${ticket._id}:`, messages);
        const lastMessage = messages[messages.length - 1];

        if (lastMessage) {
          // Stable fallback ID: use message index or text if createdAt is missing
          const messageId = lastMessage.createdAt || `${lastMessage.text}-${messages.indexOf(lastMessage)}`;
          console.log(`Last message for ticket ${ticket._id}:`, {
            id: lastMessage.id,
            _id: lastMessage._id,
            isAdmin: lastMessage.isAdmin,
            text: lastMessage.text,
            createdAt: lastMessage.createdAt,
            messageId,
            storedId: lastMessageIdsRef.current[ticket._id],
          });

          if (
            lastMessage.isAdmin &&
            lastMessageIdsRef.current[ticket._id] !== messageId &&
            notificationPermission.current === 'granted' // Only show toast if permission is granted
          ) {
            console.log(`New admin message detected for ticket ${ticket._id}:`, lastMessage);
            toast.warning(
              `New message for ${ticket.issue}: ${lastMessage.text.substring(0, 30)}...`,
              {
                position: 'top-right',
                autoClose: 5000,
                onClick: () => {
                  if (window.confirm('View new message?')) {
                    navigate(`/chat/${ticket._id}`);
                  }
                },
              }
            );
            lastMessageIdsRef.current[ticket._id] = messageId;
          } else {
            console.log(`No new admin message for ticket ${ticket._id} or permission not granted`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages in dashboard:', error.message);
      if (notificationPermission.current === 'granted') { // Only show error toast if permission is granted
        setFetchError(error.message);
        toast.error(`Failed to check for new messages: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  }, [isAuthenticated, setIsAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMessages();
      const interval = setInterval(fetchAllMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchAllMessages, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (notificationPermission.current === 'granted') { // Only show login toast if permission is granted
        toast.error('Please log in to access the dashboard', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/login');
      } else {
        navigate('/login'); // Redirect without toast if permission not granted
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 2147483647 }} // Ensure toast appears above fixed header
      />
      <StyledWrapper>
        <div className="homepage">
          <Header_user_dashboard />
          <div className="content-user">
            {fetchError && notificationPermission.current === 'granted' && ( // Only show error div if permission is granted
              <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>Error: {fetchError}</div>
            )}
            <Routes>
              <Route path="/" element={<Ticket_table navigateRef={navigateRef} />} />
              <Route path="/add_new_ticket" element={<Add_new_ticket navigateRef={navigateRef} />} />
              <Route path="/profile" element={<Profile navigateRef={navigateRef} />} />
              <Route path="/feedback" element={<Feedback navigateRef={navigateRef} />} />
              <Route path="/chat/:ticketId" element={<Chatuser navigateRef={navigateRef} />} />
              <Route path="*" element={<Ticket_table navigateRef={navigateRef} />} />
            </Routes>
          </div>
          <Footer_all />
        </div>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  @media (min-width: 0px) and (max-width: 90px) {
    .input-container-wrapper {
      display: none !important;
    }
  }
  @media (min-height: 0px) and (max-height: 90px) {
    .input-container-wrapper {
      display: none !important;
    }
  }
  @media (min-width: 90px) and (max-width: 330px) {
    .input-container-wrapper {
      width: 50vw !important;
      margin-left: 4vw !important;
    }
  }
  @media (min-width: 330px) and (max-width: 700px) {
    .input-container-wrapper {
      width: 35vw !important;
    }
  }
  @media (min-width: 330px) and (max-width: 1100px) {
    .input-container-wrapper {
      margin-left: 3.5vw !important;
    }
  }
  @media (min-width: 1100px) and (max-width: 1260px) {
    .input-container-wrapper {
      margin-left: 2.5vw !important;
    }
  }
  @media (max-width: 1300px) {
    .input-container-wrapper {
      margin-left: 1.7vw;
    }
  }
  .input-container-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35vh;
    width: 20vw;
  }
  .input-container {
    width: 220px;
    position: relative;
  }
  .icon {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
  }
  .input {
    width: 100%;
    height: 40px;
    padding: 10px;
    transition: 0.2s linear;
    border: 2.5px solid #679ef8;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .input::placeholder {
    color: black;
    font-weight: bold;
  }
  .input:focus {
    outline: none;
    border: 0.5px solid #679ef8;
    box-shadow: -5px -5px 0px #679ef8;
  }
  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }
  @keyframes anim {
    0%, 100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }
    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
`;