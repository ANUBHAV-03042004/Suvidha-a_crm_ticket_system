import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


export const Reset_Password = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { id, token } = useParams();
  const navigate = useNavigate();
  const isAdmin = window.location.pathname.includes('/admin');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleValidation = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const endpoint = isAdmin ? `/api/admin/reset/${id}/${token}` : `/api/auth/reset/${id}/${token}`;
      console.log('Resetting password for:', { id, token, isAdmin, endpoint });
      const response = await axios.post(
        `${API_URL}${endpoint}`,
        { password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate(isAdmin ? '/login/admin' : '/login'), 2000);
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <StyledCard isAdmin={isAdmin}>
      <div className="container">
        <div className="card">
          <h2>Reset Password</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <form className="formField" onSubmit={handleValidation}>
            <div className="input-container-reset">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
            <div className="input-container-reset">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <span>Confirm Password</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="button">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ isAdmin }) => (isAdmin ? '#b782d8' : '#679ef8')};

    @media (min-width: 270px) and (max-width: 400px) {
      height: 150vh;
      width: 150vw;
    }
    @media (min-width: 0px) and (max-width: 270px) {
      height: 400vh;
      width: 400vw;
    }
  }

  .card {
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    background: white;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid black;
    position: relative;
  }

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: black;
    text-decoration: underline;
    text-decoration-thickness: 3px;
  }

  .input-container-reset {
    width: 100%;
    position: relative;
    margin-bottom: 20px;
  }

  .formField {
    margin: 10px;
  }

  input {
    width: 100%;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: white;
    color: black;
    font-size: 16px;
    font-weight: 550;
    transition: 0.3s ease-in-out;
    box-shadow: 0 0 0 5px transparent;
    border: 2px solid black;
  }

  input:hover,
  input:focus {
    box-shadow: 0 0 0 2px #333;
  }

  span {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    color: black;
    font-size: 16px;
    font-weight: 600;
    pointer-events: none;
    transition: 0.3s ease-in-out;
  }

  input:focus + span,
  input:valid + span {
    transform: translateY(-47px) translateX(-5px) scale(0.95);
  }

  .password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }

  .error,
  .success {
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    text-align: center;
    position: relative;
  }

  .error {
    color: #b00020;
    background-color: #ffdede;
  }

  .success {
    color: #2e7d32;
    background-color: #dcf8c6;
  }

  .button {
    background-color: black;
    color: white;
    border: 2px solid white;
    border-radius: 15px;
    width: 100%;
    padding: 10px;
    cursor: pointer;
  }
`;