import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Admin_dashboard.css';
import '../User-functionalities/logout.css';
import logo from '../assets/img/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../context/AuthContext';

export const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const authContext = useContext(AuthContext);

  // Safeguard against undefined context
  if (!authContext) {
    console.error('AuthContext is not provided');
    return <div>Error: Authentication context not available</div>;
  }

  const { logout } = authContext;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      setShowLogoutModal(false);
      authContext.setIsAuthenticated(false);
      authContext.setUser(null);
      alert('Logout failed on server, but client state cleared. Please try again if issues persist.');
    }
  };

  return (
    <div className="homepage">
      <nav className="custom-nav-admin">
        <div className="nav-container">
          <div className="brand">
            <a href="#home">
              <img src={logo} alt="logo" className="hlogo" />
            </a>
          </div>
          <button
            className="toggle-btn togbtn"
            onClick={handleToggle}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <ul className={`nav-links-admin ${isOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" id="cap">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-dashboard" id="cap">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/add_new_client" id="cap">Add New Client</Link>
            </li>
            <li className="nav-item">
              <Link to="/client_analytics" id="cap">Client Analytics</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-chats" id="cap">Chats</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin-profile" id="cap">Profile</Link>
            </li>
            <li className="nav-item">
              <a
                href="#logout"
                id="cap"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutModal(true);
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure?</h2>
            <p>Do you really want to logout?</p>
            <div className="modal-buttons">
              <button
                className="button-no"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
              <button className="button-yes" onClick={handleLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};