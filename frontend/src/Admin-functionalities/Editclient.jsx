import React, { useState, useEffect } from 'react';
import { AdminHeader } from './Admin_header.jsx';
import { AdminFooter } from './Admin_footer.jsx';
import './Admin_dashboard.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const EditClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
    company: '',
    totalOrder: '',
    orderId: '',
    order_invoice: '',
  });
  const [orderInvoice, setOrderInvoice] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
 const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
  // Fetch client data on component mount
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/clients/${id}`, {
          withCredentials: true,
        });
        console.log('Fetched client:', response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
          mobileNumber: response.data.mobileNumber,
          company: response.data.company,
          totalOrder: response.data.totalOrder.toString(),
          orderId: response.data.orderId.toString(),
          order_invoice: response.data.order_invoice || '',
        });
      } catch (err) {
        console.error('Error fetching client:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load client data');
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPEG or PNG images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setOrderInvoice(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.name || !formData.address || !formData.mobileNumber || !formData.company || !formData.totalOrder || !formData.orderId) {
      setError('All fields are required');
      return;
    }
    if (formData.mobileNumber.length < 10) {
      setError('Mobile number must be at least 10 digits');
      return;
    }
    if (Number(formData.totalOrder) < 0) {
      setError('Total order cannot be negative');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('company', formData.company);
      data.append('totalOrder', Number(formData.totalOrder));
      data.append('orderId', Number(formData.orderId));
      if (orderInvoice) {
        data.append('order_invoice', orderInvoice);
      } else {
        data.append('order_invoice', formData.order_invoice);
      }

      console.log('Updating client:', Object.fromEntries(data));
      const response = await axios.put(`${API_URL}/api/clients/${id}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Client updated:', response.data);
      setSuccess('Client updated successfully!');
      setTimeout(() => navigate('/admin-dashboard'), 2000);
    } catch (err) {
      console.error('Error updating client:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update client');
    }
  };

  return (
    <div className="admin-add-new-client contain">
      <div className="client-form-container">
        <h2>Edit Client</h2>
        <form className="client-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div>
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Type your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Address
              <textarea
                name="address"
                placeholder="Enter Your Address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </label>
          </div>
          <div>
            <label>
              Mobile Number
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Type your Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Company
              <input
                type="text"
                name="company"
                placeholder="Type Company Name"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Total Order
              <input
                type="number"
                name="totalOrder"
                placeholder="Enter Total Order"
                value={formData.totalOrder}
                onChange={handleChange}
                required
                min="0"
              />
            </label>
          </div>
          <div>
            <label>
              Order Id
              <input
                type="number"
                name="orderId"
                placeholder="Enter Order Id"
                value={formData.orderId}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Order Invoice
              <input
                type="file"
                name="order_invoice"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
              />
              {formData.order_invoice && (
                <p className="current-invoice">Current: {formData.order_invoice}</p>
              )}
            </label>
          </div>
          <button type="submit">Update Client</button>
        </form>
      </div>
      <div className="main-admin">
        <AdminHeader />
        <AdminFooter />
      </div>
    </div>
  );
};