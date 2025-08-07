import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin-chat.css';
import { AdminHeader } from '../Admin_header.jsx';
import { AdminFooter } from '../Admin_footer.jsx';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminChats = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const notificationPermission = useRef('default'); // Track notification permission status
  const lastStatusRef = useRef({}); // Track last status per ticket
  const lastMessageIdRef = useRef({}); // Track last message ID per ticket
  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets`, {
        withCredentials: true,
      });
      console.log('Fetched tickets:', response.data);
      const updatedTickets = response.data.map(ticket => {
        const lastStatus = lastStatusRef.current[ticket._id] || ticket.status;
        if (ticket.status !== lastStatus && notificationPermission.current === 'granted') {
          toast.info(`Ticket ${ticket._id} status changed to ${ticket.status}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
        lastStatusRef.current[ticket._id] = ticket.status;
        // Initialize lastMessageIdRef for new tickets
        if (!lastMessageIdRef.current[ticket._id]) {
          lastMessageIdRef.current[ticket._id] = '';
        }
        return ticket;
      });
      setTickets(updatedTickets);
      setError(null);
    } catch (error) {
      console.error('Error fetching tickets:', error.response?.data || error.message);
      if (notificationPermission.current === 'granted') {
        setError(`Failed to load tickets: ${error.message}`);
        toast.error(`Failed to load tickets: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  // Fetch messages for all tickets
  const fetchMessagesForTickets = async () => {
    if (tickets.length === 0) return; // Skip if no tickets
    try {
      const promises = tickets.map(async ticket => {
        const response = await axios.get(`${API_URL}/api/tickets/messages/${ticket._id}`, {
          withCredentials: true,
        });
        console.log(`Fetched messages for ticket ${ticket._id}:`, response.data);
        return { ticketId: ticket._id, messages: response.data || [] };
      });
      const results = await Promise.all(promises);
      results.forEach(({ ticketId, messages }) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          const messageId = lastMessage.createdAt || `${lastMessage.text}-${messages.indexOf(lastMessage)}`;
          const lastKnownId = lastMessageIdRef.current[ticketId] || '';
          // Trigger toast for user messages (not isAdmin)
          if (!lastMessage.isAdmin && messageId !== lastKnownId && notificationPermission.current === 'granted') {
            const ticket = tickets.find(t => t._id === ticketId);
            if (ticket) {
              toast.warning(`New message for ${ticket.issue}: ${lastMessage.text.substring(0, 30)}...`, {
                position: 'top-right',
                autoClose: 5000,
              });
            }
            lastMessageIdRef.current[ticketId] = messageId;
          }
        } else {
          console.log(`No messages for ticket ${ticketId}`);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      if (notificationPermission.current === 'granted') {
        toast.error(`Failed to check messages: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  // Initial fetch and interval setup
  useEffect(() => {
    // Force notification prompt for testing (remove in production)
    localStorage.removeItem('hasPromptedNotification'); // Remove for testing only
    fetchTickets();
    const interval = setInterval(() => {
      fetchTickets();
      fetchMessagesForTickets();
    }, 5000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only on mount

  // Notification permission prompt (run once on mount)
  useEffect(() => {
    if ('Notification' in window && !localStorage.getItem('hasPromptedNotification') && notificationPermission.current === 'default') {
      localStorage.setItem('hasPromptedNotification', 'true');
      toast.info('Would you like to enable notifications for ticket updates?', {
        position: 'top-right',
        autoClose: 10000,
        closeOnClick: false,
        draggable: false,
        onClick: () => {
          Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
            notificationPermission.current = permission;
            if (permission !== 'granted') {
              // No toast for denied permission
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
  }, []); // Empty dependency array to run only once

  // Fetch messages when tickets are updated
  useEffect(() => {
    if (tickets.length > 0) {
      fetchMessagesForTickets();
    }
  }, [tickets]); // Run when tickets change

  const toggleStatus = async (ticketId, currentStatus) => {
    const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
    try {
      const response = await axios.put(
        `${API_URL}/api/tickets/${ticketId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      console.log('Updated ticket status:', response.data);
      fetchTickets();
      if (notificationPermission.current === 'granted') {
        toast.success(`Ticket ${ticketId} status changed to ${newStatus}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(`Error updating ticket ${ticketId} status:`, error.response?.data || error.message);
      if (notificationPermission.current === 'granted') {
        alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
        toast.error(`Failed to update status: ${error.response?.data?.error || error.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  const clearChat = async (ticketId) => {
    if (window.confirm(`Are you sure you want to clear the chat for ticket ${ticketId}?`)) {
      try {
        const response = await axios.delete(`${API_URL}/api/tickets/${ticketId}`, {
          withCredentials: true,
        });
        console.log('Cleared chat:', response.data);
        fetchTickets();
        if (notificationPermission.current === 'granted') {
          toast.success('Chat cleared successfully', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error(`Error clearing chat for ticket ${ticketId}:`, error.response?.data || error.message);
        if (notificationPermission.current === 'granted') {
          alert(`Failed to clear chat: ${error.response?.data?.error || error.message}`);
          toast.error(`Failed to clear chat: ${error.response?.data?.error || error.message}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      }
    }
  };

  const openImageModal = (imageUrl, type) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageType(type);
      setShowImageModal(true);
    } else {
      if (notificationPermission.current === 'granted') {
        alert(`No ${type} image available for this ticket.`);
      }
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setImageType('');
  };

  return (
    <div className="main-admin">
      <AdminHeader />
      <div className="admin-chats-container table-container">
        <h1 className="admin-chats-header">Admin Chats</h1>
        {error && notificationPermission.current === 'granted' && <div className="chat-error">{error}</div>}
        {tickets.length === 0 ? (
          <p>No tickets available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered issue-table pending">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket._id} className="hov">
                    <td>{index + 1}</td>
                    <td>{ticket.issue}</td>
                    <td>
                      <span
                        onClick={() => toggleStatus(ticket._id, ticket.status)}
                        className={`btn btn-sm ${
                          ticket.status === 'resolved' ? 'btn-success resolved' : 'btn-warning not-resolved'
                        } action-btn status-btn`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {ticket.status.toLowerCase() !== 'resolved' && (
                          <Link
                            to={`/admin-chats/${ticket._id}`}
                            className="action chat"
                            onClick={() => console.log('Navigating to admin chat with ticketId:', ticket._id)}
                          >
                            CHAT
                          </Link>
                        )}
                        <span
                          onClick={() => openImageModal(ticket.invoice, 'invoice')}
                          className="action view-invoice"
                        >
                          VIEW INVOICE
                        </span>
                        <span
                          onClick={() => openImageModal(ticket.product_image, 'product image')}
                          className="action view-product-image"
                        >
                          VIEW PRODUCT
                        </span>
                        <span onClick={() => clearChat(ticket._id)} className="action delete">
                          DELETE
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        {showImageModal && (
          <div className="image-modal">
            <div className="image-modal-content">
              <span className="close-modal" onClick={closeImageModal}>
                &times;
              </span>
              <h3>{imageType.charAt(0).toUpperCase() + imageType.slice(1)}</h3>
              {selectedImage ? (
                <img src={selectedImage} alt={imageType} className="modal-image" />
              ) : (
                <p>No image available</p>
              )}
            </div>
          </div>
        )}
      </div>
      <AdminFooter />
    </div>
  );
};