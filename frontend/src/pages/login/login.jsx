
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || '';
  const { setAuthAfterLogin } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('User login attempt:', { email });
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email: email.trim(), password: password.trim() },
        { withCredentials: true }
      );
      console.log('Login response:', response.data);
      await setAuthAfterLogin(response.data.redirect, response.data.user, false);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error;
      const details = error.response?.data?.details || '';
      if (errorMsg === 'Email or password is incorrect') {
        setError('Incorrect email or password. Please try again or reset your password.');
      } else if (errorMsg === 'Please verify your email first') {
        setError('Your email is not verified. Please check your email for the OTP.');
      } else {
        setError(`Login failed: ${errorMsg}${details ? ` (${details})` : ''}. Please try again later.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form-control-login" onSubmit={handleLoginSubmit}>
          <p className="title">Login</p>
          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
          <div className="input-field-user">
            <input
              required
              className="input-user"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label className="label" htmlFor="email">
              Enter Email
            </label>
          </div>
          <div className="input-field-user">
            <input
              required
              className="input-user"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <label className="label" htmlFor="password">
              Enter Password
            </label>
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span>
                <span className="loader" /> Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
          <div className="forgot">
            <span>Forgot Your Password?</span>
            <a href="/forgot" className="forgot-link">Sorry I Forgot</a>
          </div>
          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    width: 100%;
    height: 100vh;
    background: #679ef8;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 270px) and (max-width: 400px) {
      height: 150vh;
      width: 150vw;
    }
    @media (min-width: 0px) and (max-width: 270px) {
      height: 400vh;
      width: 400vw;
    }
  }

  .forgot {
    display: flex;
    gap: 5px;
    font-weight: bold;
    align-items: center;
    transform: translate(35px, 25px);
  }

  .forgot a {
    color: black;
    text-decoration: underline;
  }

  .forgot-link {
    text-decoration: underline;
  }

  .form-control-login {
    width: 400px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    padding: 25px;
    border-radius: 12px;
    background: white;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgb(11, 11, 11);
    position: relative;
  }

  .title {
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    transform: translateY(20px);
  }

  .input-field-user {
    position: relative;
    width: 100%;
  }

  .input-user {
    margin-top: 15px;
    width: 100%;
    outline: none;
    border-radius: 8px;
    height: 45px;
    border: 1.5px solid black;
    background: white;
    padding-left: 10px;
  }

  .input-user:focus {
    border: 1.5px solid white;
  }

  .input-field-user .label {
    position: absolute;
    top: 25px;
    left: 15px;
    color: black;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 2;
  }

  .input-field-user .input-user:focus ~ .label,
  .input-field-user .input-user:valid ~ .label {
    top: 5px;
    left: 5px;
    font-size: 12px;
    color: white;
    background-color: black;
    padding-left: 5px;
    padding-right: 5px;
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    top: 22px;
    background: black;
    color: white;
    border-radius: 5px;
    height: 30px;
    width: 70px;
    cursor: pointer;
    font-size: 14px;
    outline: none;
    padding: 2px 5px;
    &:hover {
      border: 1px solid white;
    }
  }

  .submit-btn {
    margin-top: 30px;
    height: 55px;
    border-radius: 11px;
    border: 0;
    outline: none;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(180deg, #363636 0%, #1b1b1b 50%, #000000 100%);
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .submit-btn:disabled {
    background: #666;
    cursor: not-allowed;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .register-link {
    text-align: center;
    margin-top: 15px;
    color: black;
    font-weight: bold;
  }

  .register-link a {
    color: black;
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
`;