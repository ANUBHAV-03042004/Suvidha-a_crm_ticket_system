import React, { useState, useEffect } from 'react';
import { AdminHeader } from './Admin_header.jsx';
import { AdminFooter } from './Admin_footer.jsx';
import { Dashboard_Table } from './dashboard_table.jsx';
import './Admin_dashboard.css';
import axios from 'axios';

export const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch clients from MongoDB
  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:4000/api/clients', {
        withCredentials: true,
      });
      console.log('Fetched clients:', response.data);
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to fetch clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.company.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="main-admin">
      <AdminHeader />
      <div className="input-container-wrapper-admin">
        <div className="input-container">
          <input
            type="text"
            name="text"
            className="input"
            placeholder="Search by name or company..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span className="icon">
            <svg
              width="19px"
              height="19px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
              <g id="SVGRepo_iconCarrier">
                <path
                  opacity={1}
                  d="M14 5H20"
                  stroke="#679ef8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity={1}
                  d="M14 8H17"
                  stroke="#679ef8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                  stroke="#679ef8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity={1}
                  d="M22 22L20 20"
                  stroke="#679ef8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        </div>
      </div>
      {loading && <p>Loading clients...</p>}
      {error && <p className="error">{error}</p>}
      <Dashboard_Table clients={filteredClients} fetchClients={fetchClients} />
      <AdminFooter />
    </div>
  );
};