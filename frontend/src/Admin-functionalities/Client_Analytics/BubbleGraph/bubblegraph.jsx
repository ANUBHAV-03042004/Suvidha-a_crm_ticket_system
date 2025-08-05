import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bubble.css';

export const Bubblegraph = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
        const response = await axios.get(`${API_URL}/api/clients`, {
          withCredentials: true,
        });
        console.log('Fetched clients for bubble graph:', response.data);
        setClients(response.data);
      } catch (err) {
        console.error('Error fetching clients:', err.response?.data || err.message);
        setError('Failed to load clients for bubble graph');
      }
    };
    fetchClients();
  }, []);

  // Bubble graph dimensions and constants
  const minOrder = clients.length > 0 ? Math.min(...clients.map(client => client.totalOrder)) : 0;
  const maxOrder = clients.length > 0 ? Math.max(...clients.map(client => client.totalOrder)) : 100;
  const minRadius = 25;
  const maxRadius = 80;
  const width = 1000;
  const height = 800;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate bubble positions
  const positionedBubbles = [];
  const bubbles = clients.map((client, index) => {
    const radius = minRadius + (maxRadius - minRadius) * (client.totalOrder - minOrder) / (maxOrder - minOrder || 1);
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      x = radius + Math.random() * (width - 2 * radius);
      y = radius + Math.random() * (height - 2 * radius);
      attempts++;
    } while (
      attempts < maxAttempts &&
      positionedBubbles.some(b => b.x && b.y && Math.hypot(x - b.x, y - b.y) < radius + b.radius + 10)
    );

    const orbitRadius = 50 + index * 15;
    const animationDuration = 10 + index * 2;

    const bubble = { ...client, id: client._id, x, y, radius, orbitRadius, animationDuration };
    positionedBubbles.push(bubble);
    return bubble;
  });

  return (
    <div className="bubble-graph-container">
      {error && <p className="error">{error}</p>}
      {clients.length === 0 && !error && <p>No clients available</p>}
      {clients.length > 0 && (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="bubble-graph">
          {bubbles.map(client => (
            <g
              key={client.id}
              className="bubble-group"
              style={{
                animation: `revolve ${client.animationDuration}s linear infinite`,
                '--orbit-radius': `${client.orbitRadius}px`,
                transformOrigin: `${centerX}px ${centerY}px`,
              }}
            >
              <circle
                cx={client.x}
                cy={client.y}
                r={client.radius}
                className="bubble-circle"
              />
              <text
                x={client.x}
                y={client.y - 10}
                textAnchor="middle"
                className="bubble-total-order"
              >
                {client.totalOrder}
              </text>
              <text
                x={client.x}
                y={client.y + 10}
                textAnchor="middle"
                className="bubble-company"
              >
                {client.company}
              </text>
              {/* <text
                x={client.x}
                y={client.y + client.radius + 20}
                textAnchor="middle"
                className="bubble-label"
              >
                {client.name}
              </text> */}
            </g>
          ))}
        </svg>
      )}
      <h2>Company Orders Bubble Graph</h2>
    </div>
  );
};
