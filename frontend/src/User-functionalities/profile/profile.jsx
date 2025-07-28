import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header_user_dashboard } from '../header';
import { Footer_all } from '../../home/footer_all';
import { Show_Hide } from '../show_hide.jsx';
import './profile.css';
import user_image from '../../assets/img/user_details.png';
import user_delete from '../../assets/img/user_delete.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AuthContext } from '../../context/Authcontext';
import axios from 'axios';
import { Loader } from '../../home/Loader';

export const Profile = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for profile form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [isEmailChanged, setIsEmailChanged] = useState(false);

  // State for password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for delete modal and messages
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user with AuthContext:', { user }); // Debug
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_URL}/api/users/me`, {
          withCredentials: true,
        });
        console.log('User fetched:', response.data); // Debug
        const { username, email } = response.data;
        setUsername(username);
        setEmail(email);
        setOriginalEmail(email);
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          await logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Failed to load user details.');
        }
      }
    };
    if (user) {
      fetchUser();
    } else {
      console.log('No user in AuthContext, redirecting to login');
      navigate('/login');
    }
  }, [user, logout, navigate]);

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailChanged(newEmail !== originalEmail);
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = { username };
      if (isEmailChanged) {
        updateData.pendingEmail = email;
      } else {
        updateData.email = email;
      }
      console.log('Sending update data:', updateData); // Debug
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.put(`${API_URL}/api/users/me`, updateData, {
        withCredentials: true,
      });

      if (isEmailChanged) {
        setSuccessMessage('OTP sent to new email. Please verify.');
        navigate('/otp-verify', {
          state: { email, originalEmail, isProfileUpdate: true },
        });
      } else {
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  // Handle password form submission
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.put(
        `${API_URL}/api/users/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setSuccessMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  // Handle account deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(`${API_URL}/api/users/me`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      await logout();
      setSuccessMessage('Miss you! Your account has been deleted.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.response?.data?.error || 'Failed to delete account.');
      setShowDeleteModal(false);
    }
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="comp-profile">
      <div className="container-profile">
        {/* Error and Success Messages */}
        <div className="messages">
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>

        {/* Profile Information */}
        <div className="pro_img_container">
          <img src={user_image} id="user_img" alt="user_image" />
          <div className="profile">
            <form onSubmit={handleSubmit}>
              <h2>Profile Information</h2>
              <p>Update your account's profile information and email address.</p>

              <label htmlFor="username">
                <b>Username</b>
              </label>
              <input
                className="input-profile"
                type="text"
                name="username"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="email">
                <b>Email</b>
              </label>
              <input
                className="input-profile"
                type="email"
                name="email"
                placeholder="Enter Your Email address"
                value={email}
                onChange={handleEmailChange}
                required
              />

              {isEmailChanged && <p>OTP verification required after saving.</p>}
              <button type="submit">SAVE</button>
            </form>
          </div>
        </div>

        {/* Update Password */}
        <div className="pro_img_container">
          <DotLottieReact
            src="https://lottie.host/1d0d9219-887b-484b-99d7-6de194ae26dc/DMMxyjigsj.lottie"
            loop
            autoplay
            id="user_protected"
            alt="user_protected_animation"
            style={{ width: '300px', height: '300px' }}
          />
          <div className="profile-password">
            <form onSubmit={handleSubmitPassword}>
              <h2>Update Password</h2>
              <p>Ensure your account is using a long, random password to stay secure.</p>

              <label htmlFor="currentPassword">
                <b>Current Password</b>
              </label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Enter Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-user hover-hide"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <label htmlFor="newPassword">
                <b>New Password</b>
              </label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-user hover-hide"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <label htmlFor="confirmPassword">
                <b>Confirm New Password</b>
              </label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-user hover-hide"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button type="submit">SAVE</button>
            </form>
          </div>
        </div>

        {/* Delete Account */}
        <div className="pro_img_container">
          <img src={user_delete} id="user_delete" alt="user_delete" />
          <div className="profile-delete">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
              }}
            >
              <h2>Delete Account</h2>
              <p>Permanently delete your account.</p>
              <p>
                Once your account is deleted, all of its resources and data will be
                permanently deleted. Before deleting your account, please download
                any data or information that you wish to retain.
              </p>
              <button type="submit" id="delete">
                DELETE
              </button>
            </form>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Do you really want to delete your account?</h2>
              <p>It’s an irreversible process.</p>
              <div className="modal-buttons">
                <button
                  className="button-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No
                </button>
                <button className="button-delete" onClick={handleDelete}>
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>{' '}
                  Delete it
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="homepage">
          <Header_user_dashboard />
          <Footer_all />
          <Show_Hide />
        </div>
      </div>
    </div>
  );
};