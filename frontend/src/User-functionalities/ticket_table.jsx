import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ticket_table.css';
import axios from 'axios';

export const Ticket_table = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProductImageModal, setShowProductImageModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedProductImage, setSelectedProductImage] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionResponse = await axios.get('http://localhost:4000/api/auth/check', {
        withCredentials: true,
        timeout: 5000,
      });
      console.log('Session check response:', sessionResponse.data);

      const response = await axios.get('http://localhost:4000/api/tickets', {
        withCredentials: true,
        timeout: 5000,
      });
      console.log('Fetched tickets:', response.data);
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      const errorMessage = error.response?.data?.error || 'Failed to fetch tickets. Please try again later.';
      setError(errorMessage);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received. Check if backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTickets(tickets);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tickets.filter((ticket) =>
        ticket.issue.toLowerCase().includes(query)
      );
      setFilteredTickets(filtered);
    }
  }, [searchQuery, tickets]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/tickets/${selectedIssue._id}`, {
        withCredentials: true,
      });
      const updatedTickets = tickets.filter((ticket) => ticket._id !== selectedIssue._id);
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);
      console.log('Issue deleted:', selectedIssue);
    } catch (error) {
      console.error('Error deleting ticket:', error.message);
      setError('Failed to delete ticket. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
    setShowModal(false);
    setSelectedIssue(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  const openInvoiceModal = (issue) => {
    setSelectedInvoice(issue.invoice);
    setShowInvoiceModal(true);
  };

  const openProductImageModal = (issue) => {
    setSelectedProductImage(issue.product_image);
    setShowProductImageModal(true);
  };

  return (
    <div className="homepage">
      <div className="input-container-wrapper">
        <div className="input-container">
          <input
            type="text"
            name="text"
            className="input"
            placeholder="Search by issue..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="icon">
            <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
              <g id="SVGRepo_iconCarrier">
                <path opacity={1} d="M14 5H20" stroke="#679ef8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity={1} d="M14 8H17" stroke="#679ef8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                  stroke="#679ef8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path opacity={1} d="M22 22L20 20" stroke="#679ef8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </span>
        </div>
      </div>
      <div className="table-container">
        {loading && <p>Loading tickets...</p>}
        {error && (
          <p className="error">
            {error} <button onClick={fetchTickets}>Retry</button>
          </p>
        )}
        {!loading && !error && filteredTickets.length === 0 && <p>No tickets found.</p>}
        {filteredTickets.length > 0 && (
          <table className="issue-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SUBJECT / ISSUE</th>
                <th>STATUS</th>
                <th>LAST UPDATED ON</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((issue, index) => (
                <tr className="hov" key={issue._id}>
                  <td>{index + 1}.</td>
                  <td>{issue.issue.toUpperCase()}</td>
                  <td className={issue.status === 'resolved' ? 'resolved' : 'not-resolved'}>
                    {issue.status.toUpperCase()}
                  </td>
                  <td>
                    {new Date(issue.updatedAt).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).toUpperCase()}
                  </td>
                  <td>
                    {issue.status !== 'resolved' && (
                      <>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=mitram.email75@gmail.com&su=${encodeURIComponent(
                            issue.issue.toUpperCase()
                          )}&body=${encodeURIComponent('Write us Your Problem 😊')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action email"
                        >
                          EMAIL
                        </a>
                        <Link
                          to={`/chat/${issue._id}`}
                          className="action chat"
                          onClick={() => console.log('Navigating to chat with ticketId:', issue._id)}
                        >
                          CHAT
                        </Link>
                        <Link
                          to={`/edit-ticket/${issue._id}`}
                          onClick={() => console.log('edit ticket', issue._id)}
                          className="action edit"
                        >
                          EDIT
                        </Link>
                      </>
                    )}
                    <span onClick={() => handleDeleteClick(issue)} className="action delete">
                      DELETE
                    </span>
                    {issue.invoice && (
                      <span
                        className="action view-invoice"
                        onClick={() => openInvoiceModal(issue)}
                      >
                        VIEW INVOICE
                      </span>
                    )}
                    {issue.product_image && (
                      <span
                        className="action view-product-image"
                        onClick={() => openProductImageModal(issue)}
                      >
                        VIEW PRODUCT
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showModal && (
          <>
            {console.log('Modal Visible:', showModal)}
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete the ticket "{selectedIssue?.issue}"?</p>
                <div className="modal-actions">
                  <button onClick={handleConfirmDelete} className="confirm-btn">
                    Confirm
                  </button>
                  <button onClick={handleCancelDelete} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {showInvoiceModal && (
          <div className="image-modal">
            <div className="image-modal-content">
              <span className="close-modal" onClick={() => setShowInvoiceModal(false)}>
                ×
              </span>
              <h3>Invoice Image</h3>
              <img
                src={`http://localhost:4000${selectedInvoice}`}
                alt="Invoice"
                className="modal-image"
                onError={(e) => console.error('Error loading invoice image:', e)}
              />
            </div>
          </div>
        )}
        {showProductImageModal && (
          <div className="image-modal">
            <div className="image-modal-content">
              <span className="close-modal" onClick={() => setShowProductImageModal(false)}>
                ×
              </span>
              <h3>Product Image</h3>
              <img
                src={`http://localhost:4000${selectedProductImage}`}
                alt="Product"
                className="modal-image"
                onError={(e) => console.error('Error loading product image:', e)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};