import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header_user_dashboard } from '../User-functionalities/header.jsx';
import { Footer_all } from '../home/footer_all.jsx';
import './add_new_ticket/add_new_ticket.css';
import { Show_Hide } from './show_hide.jsx';
import axios from 'axios';

export const Edit_New_Ticket = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState({
    issue: '',
    description: '',
    invoice: null,
    product_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceInputKey, setInvoiceInputKey] = useState(Date.now());
  const [productImageInputKey, setProductImageInputKey] = useState(Date.now());
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProductImageModal, setShowProductImageModal] = useState(false);

  // Define API_URL at component scope
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';

  useEffect(() => {
    const checkSessionAndFetchTicket = async () => {
      try {
        console.log('Checking session for ticketId:', ticketId);
        const sessionResponse = await axios.get(`${API_URL}/api/auth/check`, {
          withCredentials: true,
        });
        console.log('Session check response:', sessionResponse.data);

        setLoading(true);
        const ticketResponse = await axios.get(`${API_URL}/api/tickets/${ticketId}`, {
          withCredentials: true,
        });
        console.log('Fetched ticket:', ticketResponse.data);
        setTicket({
          issue: ticketResponse.data.issue || '',
          description: ticketResponse.data.description || '',
          invoice: ticketResponse.data.invoice || null,
          product_image: ticketResponse.data.product_image || null,
        });
      } catch (err) {
        console.error('Error in session check or ticket fetch:', err.response?.data || err);
        const errorMessage = err.response?.data?.error || 'Failed to load ticket. Please try again.';
        setError(errorMessage);
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to edit this ticket. It may belong to another user.');
          setTimeout(() => navigate('/user-dashboard'), 3000);
        } else {
          navigate('/user-dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    checkSessionAndFetchTicket();
  }, [navigate, ticketId, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file && !/image\/(jpeg|jpg|png)/.test(file.type)) {
      setError('Only JPEG, JPG, or PNG images are allowed.');
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }
    setError(null);
    setTicket((prev) => ({ ...prev, [name]: file }));
    if (name === 'invoice') setInvoiceInputKey(Date.now());
    if (name === 'product_image') setProductImageInputKey(Date.now());
  };

  const updateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!ticket.issue || !ticket.description) {
      setError('Please fill in all required fields (Issue and Description).');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('issue', ticket.issue);
      formData.append('description', ticket.description);
      if (ticket.invoice && ticket.invoice instanceof File) {
        formData.append('invoice', ticket.invoice);
      }
      if (ticket.product_image && ticket.product_image instanceof File) {
        formData.append('product_image', ticket.product_image);
      }

      const response = await axios.put(`${API_URL}/api/tickets/${ticketId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Ticket updated:', response.data);
      setLoading(false);
      alert('Ticket updated successfully!');
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error updating ticket:', error.response?.data || error);
      const errorMessage = error.response?.data?.error || 'Failed to update ticket. Please try again.';
      setError(errorMessage);
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to edit this ticket. It may belong to another user.');
        setTimeout(() => navigate('/user-dashboard'), 3000);
      } else {
        setTimeout(() => navigate('/user-dashboard'), 3000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <Header_user_dashboard />
      <div className="contain-edit-user">
        <div className="form-container-edit-user">
          <h2>Edit Ticket</h2>
          {loading && <div className="loading-message">Loading ticket...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && (
            <form onSubmit={updateTicket} className="ticket-edit-form">
              <div>
                <label>
                  Subject / Issue:
                  <input
                    type="text"
                    name="issue"
                    value={ticket.issue}
                    onChange={handleInputChange}
                    placeholder="Type your issue"
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={ticket.description}
                    onChange={handleInputChange}
                    placeholder="Description of issue"
                    required
                  ></textarea>
                </label>
              </div>
              <div>
                <label>
                  Upload Product Image:
                  <input
                    type="file"
                    name="product_image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    key={productImageInputKey}
                  />
                  {ticket.product_image && !(ticket.product_image instanceof File) && (
                    <div>
                      <button
                        type="button"
                        className="view-image-button"
                        onClick={() => setShowProductImageModal(true)}
                      >
                        View Product Image
                      </button>
                    </div>
                  )}
                </label>
              </div>
              <div>
                <label>
                  Upload Invoice:
                  <input
                    type="file"
                    name="invoice"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    key={invoiceInputKey}
                  />
                  {ticket.invoice && !(ticket.invoice instanceof File) && (
                    <div>
                      <button
                        type="button"
                        className="view-image-button"
                        onClick={() => setShowInvoiceModal(true)}
                      >
                        View Invoice
                      </button>
                    </div>
                  )}
                </label>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating Ticket...' : 'Update Ticket'}
              </button>
            </form>
          )}
        </div>
        <Show_Hide />
      </div>
      <Footer_all />

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="image-modal">
          <div className="image-modal-content">
            <span className="close-modal" onClick={() => setShowInvoiceModal(false)}>
              &times;
            </span>
            <h3>Invoice Image</h3>
            {ticket.invoice ? (
              <img
                src={`${API_URL}${ticket.invoice.startsWith('/') ? ticket.invoice : `/${ticket.invoice}`}`}
                alt="Invoice"
                className="modal-image"
                onError={(e) => {
                  console.error('Error loading invoice image:', { url: e.target.src, error: e.message });
                  alert('Failed to load invoice image. It may not exist or is inaccessible.');
                  setShowInvoiceModal(false);
                }}
              />
            ) : (
              <p>No invoice image available</p>
            )}
          </div>
        </div>
      )}

      {/* Product Image Modal */}
      {showProductImageModal && (
        <div className="image-modal">
          <div className="image-modal-content">
            <span className="close-modal" onClick={() => setShowProductImageModal(false)}>
              &times;
            </span>
            <h3>Product Image</h3>
            {ticket.product_image ? (
              <img
                src={`${API_URL}${ticket.product_image.startsWith('/') ? ticket.product_image : `/${ticket.product_image}`}`}
                alt="Product"
                className="modal-image"
                onError={(e) => {
                  console.error('Error loading product image:', { url: e.target.src, error: e.message });
                  alert('Failed to load product image. It may not exist or is inaccessible.');
                  setShowProductImageModal(false);
                }}
              />
            ) : (
              <p>No product image available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};