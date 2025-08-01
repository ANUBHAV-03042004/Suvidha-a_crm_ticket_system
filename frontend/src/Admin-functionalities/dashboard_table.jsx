import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin_dashboard.css';
import axios from 'axios';

export const Dashboard_Table = ({ clients, fetchClients }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/clients/${selectedClient._id}`, {
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
      setSelectedImage(`http://localhost:4000${imageUrl}`);
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
      {clients.length === 0 && <p>No clients found.</p>}
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