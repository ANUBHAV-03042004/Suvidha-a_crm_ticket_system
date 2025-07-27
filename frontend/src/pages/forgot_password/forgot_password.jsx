import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Forgot_Password = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/forgot', {
        email,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setError('');
      setSubmitted(true);
      alert(response.data.message); // "Password reset email sent"
      navigate('/login');
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send reset email. Please check your connection or try again.';
      alert(errorMessage);
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/forgot', {
        email,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      alert('Reset password link resent!');
    } catch (error) {
      console.error('Resend error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to resend reset email. Please check your connection or try again.';
      alert(errorMessage);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
      {error && <p className="error">{error}</p>}
        <div className="newsletter-form">
          <p className="heading">FORGOT PASSWORD</p>
          <p className="text">
            Enter Your Email Address To Get The Reset Password Link
          </p>
          {!submitted ? (
            <form className="form" onSubmit={handleSubmit}>
              <input
                required
                placeholder="Enter your email address"
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input defaultValue="Submit" type="submit" />
            </form>
          ) : (
            <div className="resend-container">
              <p className="success-message">Reset password link sent!</p>
              <button className="resend-button" onClick={handleResend}>
                Didn't receive the link? Resend
              </button>
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #679ef8;
    @media (min-width: 270px) and (max-width: 400px) {
      height: 150vh;
      width: 150vw;
    }
    @media (min-width: 0px) and (max-width: 270px) {
      height: 400vh;
      width: 400vw;
    }
  }

  .newsletter-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 16px;
    font-family: Arial, sans-serif;
    background: white;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 2px solid black;
  }

  .heading {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: #000;
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  .text {
    text-align: center;
    font-weight: bold;
    color: black;
  }

  .newsletter-form input[type='email'] {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid black;
    border-radius: 8px;
    background-color: white;
    color: black;

    &::placeholder {
      color: black;
    }
    &:focus {
      outline: none;
      border: 1px solid black;
    }
  }

  .newsletter-form input[type='submit'] {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background-color: black;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-form input[type='submit']:hover {
    transform: scale(1.05);
    background-color: black;
    color: white;
  }

  .resend-container {
    text-align: center;
  }

  .success-message {
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
  }

  .resend-button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #fff;
    color: #679ef8;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .resend-button:hover {
    background-color: #fff;
    color: #679ef8;
    transform: scale(1.1);
  }
`;