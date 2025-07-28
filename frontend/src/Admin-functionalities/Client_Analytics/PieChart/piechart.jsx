import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import './piechart.css';
import axios from 'axios';

export const Piechart = () => {
  const [resolvedPercentage, setResolvedPercentage] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Fetch ticket data and calculate resolved vs unresolved
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_URL}/api/tickets`, {
          withCredentials: true,
        });
        console.log('Fetched tickets:', response.data);

        const tickets = response.data;
        const totalTickets = tickets.length;
        const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length;
        const unresolvedTickets = totalTickets - resolvedTickets;
        const percentage = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

        setResolvedCount(resolvedTickets);
        setUnresolvedCount(unresolvedTickets);
        setResolvedPercentage(percentage);
        setAnimate(true);

        // Reset animation after 600ms
        const timer = setTimeout(() => setAnimate(false), 600);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching tickets:', error.response?.data || error.message);
      }
    };

    fetchTickets();
  }, []);

  const dasharray = `${resolvedPercentage}, ${100 - resolvedPercentage}, 0, 0`;
  const unfilledRadius = 15.9154943092 - (7.9154943092 * resolvedPercentage) / 100;

  return (
    <div className="pie-chart-container">
      <div className="d-flex justify-content-center">
        <svg className="pie-chart" viewBox="0 0 63.6619772368 63.6619772368">
          {/* White center circle */}
          <circle
            cx="31.8309886184"
            cy="31.8309886184"
            r="8"
            fill="#fff"
          />
          {/* Unfilled circle (brown) */}
          <circle
            className="pie-unfilled"
            cx="31.8309886184"
            cy="31.8309886184"
            r={unfilledRadius}
            strokeDasharray="100, 0, 0, 0"
            strokeDashoffset="25"
            data-tooltip-id="unresolved"
            data-tooltip-content="Unresolved Queries"
          />
          {/* Filled circle (red) */}
          <circle
            className={`pie-filled ${animate ? 'animate' : ''}`}
            cx="31.8309886184"
            cy="31.8309886184"
            r="15.9154943092"
            strokeDasharray={dasharray}
            strokeDashoffset="25"
            style={{ '--dasharray': dasharray }}
            data-tooltip-id="resolved"
            data-tooltip-content="Resolved Queries"
          />
        </svg>
        <Tooltip id="unresolved" className="custom-tooltip" />
        <Tooltip id="resolved" className="custom-tooltip" />
      </div>
      <div className="mt-3 text-center">
        <p className="form-label">
         ( Resolved: {resolvedCount} {resolvedPercentage}% | Unresolved: {unresolvedCount} )
        </p>
      </div>
      <h2>Issue Resolved Pie Chart</h2>
    </div>
  );
};