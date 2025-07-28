import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

export const Otp_Verify = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || ''; // pendingEmail
  const originalEmail = state?.originalEmail || ''; // original email
  const isProfileUpdate = state?.isProfileUpdate || false;

  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer, isResendDisabled]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
      }
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!isResendDisabled) {
      try {
        console.log('Resending OTP for:', { originalEmail, pendingEmail: email }); // Debug
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${API_URL}/api/auth/resend-otp`,
          { email: originalEmail, pendingEmail: email },
          { withCredentials: true }
        );
        setSuccess(response.data.message);
        setError('');
        setTimer(30);
        setIsResendDisabled(true);
      } catch (err) {
        console.error('Resend OTP error:', err);
        setError(err.response?.data?.error || 'Failed to resend OTP');
        setSuccess('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setSuccess('');
      return;
    }
    try {
      console.log('Submitting OTP:', { originalEmail, pendingEmail: email, otp: otpValue }); // Debug
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { email, originalEmail, otp: otpValue },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setError('');
      const redirectPath = response.data.isAdmin ? '/login/admin' : '/login';
      console.log('Redirecting to:', redirectPath); // Debug
      setTimeout(
        () =>
          navigate(redirectPath, {
            state: { message: 'Email verified successfully!' },
          }),
        1000
      );
    } catch (err) {
      console.error('OTP verification error:', err.response?.data || err);
      setError(err.response?.data?.error || 'OTP verification failed');
      setSuccess('');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="info">
            <span className="title">OTP Verification</span>
            <p className="description">
              Please enter the 6-digit code sent to {email || 'your email'}.
            </p>
          </div>
          <div className="inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
            <input type="hidden" name="otp" value={otp.join('')} />
          </div>
          <button className="validate" type="submit">
            Verify
          </button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <p className="resend">
            Didn't receive the OTP? <br />
            {isResendDisabled ? (
              <span>Resend OTP in {timer}s</span>
            ) : (
              <a className="resend-action" href="#" onClick={handleResend}>
                Resend OTP
              </a>
            )}
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

// Styled-components remain unchanged
const StyledWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #679ef8;

  @media (max-width: 400px) {
    height: 150vh;
    width: 150vw;
  }
  @media (min-width: 0px) and (max-width: 270px) {
    height: 400vh;
    width: 400vw;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 20px;
    background: white;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid black;
    max-width: 500px;
    width: 100%;
    border-radius: 15px;
  }

  .info {
    margin-bottom: 15px;
  }

  .title {
    color: black;
    font-size: 1.5rem;
    line-height: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.025em;
  }

  .description {
    color: black;
    margin-top: 10px;
    font-size: 15px;
    text-align: center;
  }

  .inputs {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-bottom: 15px;
  }

  .inputs input {
    height: 2.8em;
    width: 2.8em;
    outline: none;
    text-align: center;
    font-size: 1.5em;
    color: black;
    border-radius: 0.3em;
    border: 1px solid rgba(15, 14, 14, 0.91);
    background-color: rgb(255 255 255 / 0.05);
  }

  .resend {
    color: black;
    margin-top: 10px;
    font-size: 15px;
    text-align: center;
  }

  .resend-action {
    text-decoration: none;
    cursor: pointer;
    margin-left: 6px;
    color: black;
    font-weight: 600;
  }

  .resend-action:hover {
    text-decoration: 1.5px underline black;
    color: black;
  }

  .validate {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: black;
    border: 1.5px solid white;
    padding: 10px 20px;
    margin: 8px 0 0 0;
    font-size: 13px;
    font-weight: 600;
    border-radius: 10px;
    transition: .3s ease;
    color: white;
    width: 100%;
    cursor: pointer;
  }

  .validate:hover {
    transform: scale(1.05);
    color: white;
  }

  .error {
    color: red;
    margin-top: 10px;
    font-size: 14px;
  }

  .success {
    color: green;
    margin-top: 10px;
    font-size: 14px;
  }
`;