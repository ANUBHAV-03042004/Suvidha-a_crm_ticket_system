// src/components/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || ''; // Success message from OTP verification

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/login',
        {
          email,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setError('');
      console.log('Login response:', response.data);
      // Navigate to user-dashboard on success
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Login failed');
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="forgot">
            <p>Forgot Your Password?</p>
            <a href="/forgot">Sorry I Forgot</a>
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
    transform: translate(15px, 25px);
  }

  .forgot a {
    color: black;
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
  position: relative; /* add this */
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
  }

  .submit-btn:disabled {
    background: #666;
    cursor: not-allowed;
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
.error, .success {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
}

.error {
  background-color: #ffdede; /* light red background */
  color: #b00020; /* dark red text */
}

.success {
  background-color: #dcf8c6; /* light green background */
  color: #2e7d32; /* dark green text */
}
`;