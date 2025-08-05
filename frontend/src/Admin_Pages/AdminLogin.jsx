import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Use login from context
  const successMessage = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Form submission values:', { email, password });
    if (!email || !password) {
      setError('Please fill in both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending admin login request with:', { email });
      await login(email.trim(), password.trim(), '03042004', '/admin-dashboard');
      console.log('Admin login successful, redirecting to /admin-dashboard');
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.error || err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <StyledWrapper $isAdmin={true}>
        <div className="container">
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
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: ${({ $isAdmin }) => ($isAdmin ? '#b782d8' : '#007bff')};
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 2em;
    background-color: white;
    border-radius: 25px;
    transition: 0.4s ease-in-out;
    border: 2px solid black;
    width: auto; /* Revert to auto to maintain original form width */
    max-width: 400px; /* Optional: cap max width to prevent overly wide forms */
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
    padding: 0.5em 2.3em;
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
    padding: 0.5em 2.3em;
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
    padding: 0.5em 2em;
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