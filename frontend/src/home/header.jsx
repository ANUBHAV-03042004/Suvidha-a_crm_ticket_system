import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homepage.css';
import logo from '../assets/img/logo.png';
import { AuthContext } from '../context/Authcontext';
import { Loader } from './Loader';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Safeguard against undefined context
  if (!authContext) {
    console.error('AuthContext is not provided');
    return <div>Error: Authentication context not available</div>;
  }

  const { isAuthenticated, isAdminAuthenticated, user, logout, loading } = authContext;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setShowLogoutModal(false);
      alert('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <nav className="custom-nav">
        <div className="nav-container">
          <div className="brand">
            <a href="#home">
              <img src={logo} alt="logo" className="logo" />
            </a>
          </div>
          <button
            className="toggle-btn togbtn"
            onClick={handleToggle}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" id="cap">
                Home
              </Link>
            </li>
            {isAuthenticated || isAdminAuthenticated ? (
          <>
            {isAdminAuthenticated ? (
              <li className="nav-item">
                <Link to="/admin-dashboard" id="cap" className="nav-link">
                  Admin Dashboard
                </Link>
              </li>
            ) : isAuthenticated ? (
              <li className="nav-item">
                <Link to="/user-dashboard" id="cap" className="nav-link">
                  User Dashboard
                </Link>
              </li>
            ) : null}
            <li className="nav-item">
              <Link id="cap" onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </Link>
            </li>
          </>
        ) : (
              <>
                <li className="nav-item dropdown">
                  <Link
                    id="cap"
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    User
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
                    <li>
                      <Link to="/register" className="dropdown-item">
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link to="/login" className="dropdown-item">
                        Login
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    id="cap"
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
                    <li>
                      <Link to="/register/admin" className="dropdown-item">
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link to="/login/admin" className="dropdown-item">
                        Login
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
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
              <button className="button-yes" onClick={confirmLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};