import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header_user_dashboard } from '../header';
import { Footer_all } from '../../home/footer_all';
import './add_new_ticket.css';
import { Show_Hide } from '../show_hide.jsx';

export const Add_new_ticket = () => {
  const navigate = useNavigate();
  const [newTicket, setNewTicket] = useState({
    issue: '',
    description: '',
    invoice: null,
    product_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceInputKey, setInvoiceInputKey] = useState(Date.now());
  const [productImageInputKey, setProductImageInputKey] = useState(Date.now());

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/check', {
          credentials: 'include',
        });
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          const errorText = contentType?.includes('application/json')
            ? (await response.json()).error
            : await response.text();
          console.error('Session check failed:', response.status, errorText);
          setError('Please log in to add a ticket.');
          navigate('/login');
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to verify session. Please log in.');
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes with validation
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
    setNewTicket((prev) => ({ ...prev, [name]: file }));
  };

  // Function to add a new ticket
  const addTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newTicket.issue || !newTicket.description) {
      setError('Please fill in all required fields (Issue and Description).');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('issue', newTicket.issue);
      formData.append('description', newTicket.description);
      if (newTicket.invoice) formData.append('invoice', newTicket.invoice);
      if (newTicket.product_image) formData.append('product_image', newTicket.product_image);

      const response = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Failed to save ticket (Status: ${response.status})`;
        
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text.slice(0, 200));
          errorMessage = `Server returned invalid response. Check if backend is running.`;
        }
        
        throw new Error(errorMessage);
      }

      const savedTicket = await response.json();
      console.log('Ticket saved:', savedTicket);
      setNewTicket({
        issue: '',
        description: '',
        invoice: null,
        product_image: null,
      });
      setInvoiceInputKey(Date.now());
      setProductImageInputKey(Date.now());
      setLoading(false);
      alert('Ticket added successfully!');
      navigate('/user-dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error saving ticket:', error);
      setError(error.message || 'An error occurred while saving the ticket.');
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <Header_user_dashboard />
      <div className="contain-user">
        <div className="form-container-user">
          <h2>Add New Ticket</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={addTicket} className="ticket-form">
            <div>
              <label>
                Subject / Issue:
                <input
                  type="text"
                  name="issue"
                  value={newTicket.issue}
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
                  value={newTicket.description}
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
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding Ticket...' : 'Add Ticket'}
            </button>
          </form>
        </div>
        <Show_Hide />
      </div>
      <Footer_all />
    </div>
  );
};