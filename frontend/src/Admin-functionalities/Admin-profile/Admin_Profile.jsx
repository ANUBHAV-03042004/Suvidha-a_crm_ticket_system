import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminHeader } from "../Admin_header.jsx";
import { AdminFooter } from "../Admin_footer.jsx";
import { Show_Hide } from "../show_hide.jsx";
import user_image from "../../assets/img/user_details.png";
import user_delete from "../../assets/img/user_delete.png";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AuthContext } from "../../context/Authcontext";
import './Admin-Profile.css';
import {Loader} from '../../home/Loader.jsx';

export const AdminProfile = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.isAdmin) {
        console.log('No admin user in AuthContext, redirecting to login');
        navigate("/login/admin", { replace: true });
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching admin profile with user:', user);
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_URL}/api/admin/me`, {
          withCredentials: true,
        });
        console.log('Admin fetched:', response.data);
        setName(response.data.username);
        setEmail(response.data.email);
        setOriginalEmail(response.data.email);
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
        setLoading(false);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          await logout();
          navigate("/login/admin", { replace: true });
        }
      }
    };
    fetchProfile();
  }, [user, logout, navigate]);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value.trim();
    setEmail(newEmail);
    setIsEmailChanged(newEmail !== originalEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      setLoading(true);
      const payload = isEmailChanged
        ? { username: name.trim(), pendingEmail: email }
        : { username: name.trim(), email };
      console.log('Sending update payload:', payload);
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.put(
        `${API_URL}/api/admin/me`,
        payload,
        { withCredentials: true }
      );
      console.log('Update response:', response.data);
      setOriginalEmail(email);
      setIsEmailChanged(false);
      setSuccessMessage(response.data.message);
      if (response.data.emailChanged) {
        navigate("/otp-verify", {
          state: { email, originalEmail, isProfileUpdate: true },
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.put(
        `${API_URL}/api/admin/password`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      setSuccessMessage(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.delete(`${API_URL}/api/admin/me`, {
        withCredentials: true,
      });
      setSuccessMessage("Miss you! Your account has been deleted.");
      setShowDeleteModal(false);
      await logout();
      setTimeout(() => navigate("/login/admin", { replace: true }), 2000);
    } catch (err) {
      console.error("Account delete error:", err);
      setError(err.response?.data?.error || "Failed to delete account");
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    // return <div>Loading...</div>; 
    return <Loader/>;
  }

  return (
    <div className="comp-profile-client">
      <div className="container-profile-client">
        {/* Error and Success Messages */}
        <div className="messages">
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>

        <div className="pro_img_container-client">
          <img src={user_image} id="user_img" alt="user_image" />
          <div className="profile-client">
            <form onSubmit={handleSubmit}>
              <h2>Profile Information</h2>
              <p>Update your account's profile information and email address.</p>
              <label htmlFor="name"><b>Name</b></label>
              <input
                className="input-profile-client"
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="email"><b>Email</b></label>
              <input
                className="input-profile-client"
                type="email"
                name="email"
                placeholder="Enter Your Email address"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
              />
              {isEmailChanged && <p>OTP verification required after saving.</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "SAVE"}
              </button>
            </form>
          </div>
        </div>
        <div className="pro_img_container-client">
          <DotLottieReact
            src="https://lottie.host/1d0d9219-887b-484b-99d7-6de194ae26dc/DMMxyjigsj.lottie"
            loop
            autoplay
            id="user_protected"
            alt="user_protected_animation"
            style={{ width: '300px', height: '300px' }}
          />
          <div className="profile-password-client">
            <form onSubmit={handleSubmitPassword}>
              <h2>Update Password</h2>
              <p>Ensure your account is using a long, random password to stay secure.</p>
              <label htmlFor="currentPassword"><b>Current Password</b></label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Enter Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-client hover-hide"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
              <label htmlFor="newPassword"><b>New Password</b></label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-client hover-hide"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              <label htmlFor="confirmPassword"><b>Confirm New Password</b></label>
              <div className="input-field-profile">
                <input
                  className="input-profile"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-client hover-hide"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "SAVE"}
              </button>
            </form>
          </div>
        </div>
        <div className="pro_img_container-client">
          <img src={user_delete} id="user_delete" alt="user_delete" />
          <div className="profile-delete-client">
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowDeleteModal(true);
            }}>
              <h2>Delete Account</h2>
              <p>Permanently delete your account.</p>
              <p>
                Once your account is deleted, all of its resources and data will be
                permanently deleted. Before deleting your account, please download
                any data or information that you wish to retain.
              </p>
              <button type="submit" id="delete" disabled={loading}>
                {loading ? "Deleting..." : "DELETE"}
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
        <div className="main-admin">
          <AdminHeader />
          <Show_Hide />
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};