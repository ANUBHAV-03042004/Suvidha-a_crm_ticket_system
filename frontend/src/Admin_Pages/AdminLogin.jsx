// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || ''; // Get success message from state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Debug: Log the values before sending
    console.log('Form submission values:', { email, password });
    if (!email || !password) {
      setError('Please fill in both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending login request with:', { email, password }); // Debug log
      const response = await axios.post(
        'http://localhost:4000/api/auth/login/admin',
        { email, password },
        { withCredentials: true } // Ensure session cookies are sent
      );
      console.log('Login response:', response.data); // Debug log

      // Check if login was successful before navigating
      if (response.data.message === 'Admin login successful') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      }); // Detailed error log
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <StyledWrapper>
        <form className="form" onSubmit={handleSubmit}>
          <p id="heading"><b>ADMIN LOGIN</b></p>
          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
          <div className="field">
            <svg
              className="input-icon"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                  fill="#080341"
                />
              </g>
            </svg>
            <input
              placeholder="Email"
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
          <div className="field password-box">
            <svg
              className="input-icon"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
            <button
              type="button"
              className="password-toggle hover-hide"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="button4"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Submit'}
          </button>
          <div className="btn">
            <button className="button1" onClick={() => navigate('/login/admin')}>
              Login
            </button>
            <button className="button2" onClick={() => navigate('/register/admin')}>
              Register
            </button>
          </div>
          <button className="button3" onClick={() => navigate('/forgot')}>
            Forgot Password
          </button>
        </form>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: white;
    border-radius: 25px;
    transition: 0.4s ease-in-out;
    border: 2px solid black;
  }

  .form:hover {
    transform: scale(1.05);
    border: 2px solid black;
  }

  #heading {
    text-align: center;
    margin-top: 1em;
    color: black;
    font-size: 1.2em;
    font-weight: bold;
  }

  .form p b {
    font-size: 25px;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: 2px solid black;
    outline: none;
    color: black;
    background-color: white;
  }

  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: black;
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: black;
  }

  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  button a {
    text-decoration: none;
    color: black;
  }

  .button1 {
    padding: 0.5em;
    padding-left: 2.3em;
    padding-right: 2.3em;
    border-radius: 5px;
    margin-right: 0.5em;
    border: 2px solid black;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: white;
    color: black;
  }

  .button1:hover {
    background-color: white;
    color: black;
  }

  .button2 {
    padding: 0.5em;
    padding-left: 2.3em;
    padding-right: 2.3em;
    border-radius: 5px;
    border: 2px solid black;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: white;
    color: black;
  }

  .button2:hover {
    background-color: white;
    color: black;
  }

  .button3 {
    margin-bottom: 1em;
    padding: 0.5em;
    border-radius: 5px;
    border: 2px solid black;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: white;
    color: black;
  }

  .button3:hover {
    background-color: red;
    color: white;
  }

  .button4 {
    border-radius: 5px;
    border: 2px solid black;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: white;
    color: black;
    margin: 0 auto;
  }

  .button4:hover {
    background-color: green;
    color: white;
  }
    .error, .success {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
    margin-top: -1.5em;
}

.error {
  background-color: #ffdede;
  color: #b00020; 
}

.success {
  background-color: #dcf8c6; 
  color: #2e7d32; 
}
`;