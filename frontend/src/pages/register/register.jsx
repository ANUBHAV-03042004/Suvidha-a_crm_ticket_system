import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import './Register.css';
import { Loader } from '../../home/Loader';
import { Show_Hide } from '../../home/show_hide';

export const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('User registration attempt:', { username, email });
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setTimeout(() => navigate('/otp-verify', { state: { email, isAdmin: false } }), 500);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="comp">
          <div className="card">
            <h5 className="register">Register</h5>
            {error && <p className="error">Error: {error}</p>}
            {success && <p className="success">Success: {success}</p>}
            <div className="inputBox1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                required
              />
              <span className="user">Email</span>
            </div>
            <div className="inputBox">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                required
              />
              <span>Username</span>
            </div>
            <div className="inputBox password-box">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
                required
              />
              <span>Password</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="button" className="enter" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="loglink">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
        {loading && (
          <LoaderOverlay>
            <RegisterLoader>
              <Loader/>
            </RegisterLoader>
          </LoaderOverlay>
        )}
      </div>
      <Show_Hide />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    width: 100%;
    height: 100vh;
    background-color: #679ef8;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 25px;
    width: 350px;
    min-height: 450px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgb(11, 10, 10);
    padding: 20px;
    position: relative;
  }

  .error,
  .success {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
  }

  .error {
    background-color: #ffdede;
    color: #b00020;
  }

  .success {
    background-color: #dcf8c6;
    color: #2e7d32;
  }

  .enter:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const RegisterLoader = styled.div`
  .earth p {
    color: white !important;
  }
`;