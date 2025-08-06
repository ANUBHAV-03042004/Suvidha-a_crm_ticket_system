// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './admin-chat.css';
// import { AdminHeader } from '../Admin_header.jsx';
// import { AdminFooter } from '../Admin_footer.jsx';
// import axios from 'axios';

// export const AdminChats = () => {
//   const [tickets, setTickets] = useState([]);
//   const [error, setError] = useState(null);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageType, setImageType] = useState(''); // 'invoice' or 'product'
//  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
//   // Fetch all tickets
//   const fetchTickets = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/tickets`, {
//         withCredentials: true,
//       });
//       console.log('Fetched tickets:', response.data);
//       setTickets(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching tickets:', error.response?.data || error.message);
//       setError(`Failed to load tickets: ${error.message}`);
//     }
//   };

//   // Fetch on mount
//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   // Toggle ticket status
//   const toggleStatus = async (ticketId, currentStatus) => {
//     const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
//     try {
//       const response = await axios.put(
//         `${API_URL}/api/tickets/${ticketId}`,
//         { status: newStatus },
//         { withCredentials: true }
//       );
//       console.log('Updated ticket status:', response.data);
//       fetchTickets();
//       alert(`Ticket status changed to ${newStatus}`);
//     } catch (error) {
//       console.error(`Error updating ticket ${ticketId} status:`, error.response?.data || error.message);
//       alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   // Clear chat for a specific ticket
//   const clearChat = async (ticketId) => {
//     if (window.confirm(`Are you sure you want to clear the chat for ticket ${ticketId}?`)) {
//       try {
//         const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
//         const response = await axios.delete(`${API_URL}/api/tickets/${ticketId}`, {
//           withCredentials: true,
//         });
//         console.log('Cleared chat:', response.data);
//         fetchTickets();
//         alert('Chat cleared successfully');
//       } catch (error) {
//         console.error(`Error clearing chat for ticket ${ticketId}:`, error.response?.data || error.message);
//         alert(`Failed to clear chat: ${error.response?.data?.error || error.message}`);
//       }
//     }
//   };

//   // Open image modal
//   const openImageModal = (imageUrl, type) => {
//     if (imageUrl) {
//       const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
//       setSelectedImage(`${API_URL}${imageUrl}`);
//       setImageType(type);
//       setShowImageModal(true);
//     } else {
//       alert(`No ${type} image available for this ticket.`);
//     }
//   };

//   // Close image modal
//   const closeImageModal = () => {
//     setShowImageModal(false);
//     setSelectedImage(null);
//     setImageType('');
//   };

//   return (
//     <div className="main-admin">
//       <AdminHeader />
//       <div className="admin-chats-container table-container">
//         <h1 className="admin-chats-header">Admin Chats</h1>
//         {error && <div className="chat-error">{error}</div>}
//         {tickets.length === 0 ? (
//           <p>No tickets available.</p>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-striped table-hover table-bordered issue-table pending">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Issue</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tickets.map((ticket, index) => (
//                   <tr key={ticket._id} className="hov">
//                     <td>{index + 1}</td>
//                     <td>{ticket.issue}</td>
//                     <td>
//                       <span
//                         onClick={() => toggleStatus(ticket._id, ticket.status)}
//                         className={`btn btn-sm ${
//                           ticket.status === 'resolved' ? 'btn-success resolved' : 'btn-warning not-resolved'
//                         } action-btn status-btn`}
//                       >
//                         {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         {ticket.status.toLowerCase() !== 'resolved' && (
//                           <Link
//                             to={`/admin-chats/${ticket._id}`}
//                             className="action chat"
//                             onClick={() => console.log('Navigating to admin chat with ticketId:', ticket._id)}
//                           >
//                             CHAT
//                           </Link>
//                         )}
//                         <span
//                           onClick={() => openImageModal(ticket.invoice, 'invoice')}
//                           className="action view-invoice"
//                         >
//                           VIEW INVOICE
//                         </span>
//                         <span
//                           onClick={() => openImageModal(ticket.product_image, 'product image')}
//                           className="action view-product-image"
//                         >
//                           VIEW PRODUCT
//                         </span>
//                         <span onClick={() => clearChat(ticket._id)} className="action delete">
//                           DELETE
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         {showImageModal && (
//           <div className="image-modal">
//             <div className="image-modal-content">
//               <span className="close-modal" onClick={closeImageModal}>
//                 &times;
//               </span>
//               <h3>{imageType.charAt(0).toUpperCase() + imageType.slice(1)}</h3>
//               {selectedImage ? (
//                 <img src={selectedImage} alt={imageType} className="modal-image" />
//               ) : (
//                 <p>No image available</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <AdminFooter />
//     </div>
//   );
// };






import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin-chat.css';
import { AdminHeader } from '../Admin_header.jsx';
import { AdminFooter } from '../Admin_footer.jsx';
import axios from 'axios';

export const AdminChats = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageType, setImageType] = useState('');
  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets`, {
        withCredentials: true,
      });
      console.log('Fetched tickets:', response.data);
      setTickets(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tickets:', error.response?.data || error.message);
      setError(`Failed to load tickets: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
      alert(`Ticket status changed to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating ticket ${ticketId} status:`, error.response?.data || error.message);
      alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
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
        alert('Chat cleared successfully');
      } catch (error) {
        console.error(`Error clearing chat for ticket ${ticketId}:`, error.response?.data || error.message);
        alert(`Failed to clear chat: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const openImageModal = (imageUrl, type) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageType(type);
      setShowImageModal(true);
    } else {
      alert(`No ${type} image available for this ticket.`);
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
        {error && <div className="chat-error">{error}</div>}
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