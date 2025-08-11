import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin_dashboard.css';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
export const Dashboard_Table = ({ clients, fetchClients }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/clients/${selectedClient._id}`, {
        withCredentials: true,
      });
      console.log('Client deleted:', selectedClient);
      fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client. Please try again.');
    }
    setShowModal(false);
    setSelectedClient(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const openImageModal = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    } else {
      alert('No order invoice available for this client.');
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="table-container">
{
  clients.length === 0 && (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#555'
    }}>
      <DotLottieReact
          src="https://lottie.host/36feb794-a79e-447f-ae48-01bbd03b0d71/MBCsmFkWXj.lottie"
        loop
        autoplay
        style={{ width: '300px', height: '300px' }}
      />
      <h3>No Clients Found</h3>
      <p>It looks like there are no clients in your system yet.</p>
    </div>
  )
}
      {clients.length > 0 && (
        <table className="issue-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Mobile Number</th>
              <th>Company</th>
              <th>Total Order</th>
              <th>Order Id</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client._id} className="hov">
                <td>{index + 1}</td>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.mobileNumber}</td>
                <td>{client.company}</td>
                <td>{client.totalOrder}</td>
                <td>{client.orderId}</td>
                <td>
                  <Link to={`/edit/${client._id}`} className="action chat">
                    EDIT
                  </Link>
                  <span
                    onClick={() => openImageModal(client.order_invoice)}
                    className="action view-invoice"
                  >
                    VIEW INVOICE
                  </span>
                  <span
                    onClick={() => handleDeleteClick(client)}
                    className="action delete"
                  >
                    DELETE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the client "{selectedClient?.name}"?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageModal && (
        <div className="image-modal">
          <div className="image-modal-content">
            <span className="close-modal" onClick={closeImageModal}>
              ×
            </span>
            <h3>Order Invoice</h3>
            {selectedImage ? (
              <img src={selectedImage} alt="Order Invoice" className="modal-image" />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};