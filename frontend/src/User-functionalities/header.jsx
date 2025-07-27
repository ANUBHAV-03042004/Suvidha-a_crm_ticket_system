import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { AuthContext } from '../context/Authcontext';
import { Loader } from '../home/Loader';
import './ticket_table.css';

export const Header_user_dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout, loading } = useContext(AuthContext);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const signout = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      window.location.href = '/login'; // Direct redirect after logout
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
            <Link to="/user-dashboard">
              <img src={logo} alt="logo" className="logo" />
            </Link>
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
              <Link id="cap" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link id="cap" to="/user-dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link id="cap" to="/add_new_ticket">
                Add New Ticket
              </Link>
            </li>
            <li className="nav-item left-side">
              <Link id="cap" to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link id="cap" onClick={signout}>
                Logout
              </Link>
            </li>
            <li className="nav-item">
              <Link id="cap" to="/feedback">
                Feedback
              </Link>
            </li>
          </ul>
        </div>
      </nav>
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