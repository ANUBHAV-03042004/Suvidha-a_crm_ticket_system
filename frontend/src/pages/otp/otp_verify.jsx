import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Loader } from '../../home/Loader';
import { useAuth } from '../../context/AuthContext';

export const Otp_Verify = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setAuthAfterLogin } = useAuth();
  const email = state?.email || '';
  const isAdmin = state?.isAdmin || false;
 const API_URL = import.meta.env.VITE_API_BASE_URL || `https://suvidha-backend-app.azurewebsites.net`;
  console.log('Otp_Verify state:', { email, isAdmin }); // Debug state

  useEffect(() => {
    if (!email) {
      console.log('No email provided, redirecting to:', isAdmin ? '/login/admin' : '/login');
      navigate(isAdmin ? '/login/admin' : '/login', { replace: true });
    }
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled, email, navigate, isAdmin]);

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
      setIsLoading(true);
      setError('');
      setSuccess('');
      console.log('Resending OTP for:', { email, isAdmin });
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/resend-otp`,
          { email },
          { withCredentials: true }
        );
        setSuccess(response.data.message);
        setTimer(30);
        setIsResendDisabled(true);
      } catch (err) {
        console.error('Resend OTP error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to resend OTP');
      } finally {
        setIsLoading(false);
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
    setIsLoading(true);
    setError('');
    setSuccess('');
    console.log('Submitting OTP:', { email, otp: otpValue, isAdmin });
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { email, otp: otpValue },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      const userData = { 
        email, 
        username: response.data.username || email, 
        isAdmin: response.data.isAdmin || isAdmin // Use backend isAdmin if available
      };
      console.log('Calling setAuthAfterLogin:', { redirect: isAdmin ? '/login/admin' : '/login', userData, isAdmin });
      await setAuthAfterLogin(isAdmin ? '/login/admin' : '/login', userData, isAdmin);
      console.log('Navigating to:', isAdmin ? '/login/admin' : '/login');
      navigate(isAdmin ? '/login/admin' : '/login', { replace: true });
    } catch (err) {
      console.error('OTP verification error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper $isAdmin={isAdmin}>
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
          <button className="validate" type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
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
        {isLoading && (
          <LoaderOverlay>
            <LoaderWrapper>
              <Loader/>
            </LoaderWrapper>
          </LoaderOverlay>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: ${({ $isAdmin }) => ($isAdmin ? '#b782d8 !important' : '#679ef8 !important')};
  }

  @media (max-width: 400px) {
    height: 150vh;
    width: 150vw;
  }
  @media (min-width: 0px) and (max-width: 270px) {
    height: 400vh;
    width: 400vw;
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
    transition: 0.3s ease;
    color: white;
    width: 100%;
    cursor: pointer;
  }

  .validate:hover {
    transform: scale(1.05);
    color: white;
  }

  .validate:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .error {
    color: #b00020;
    background-color: #ffdede;
    margin-top: 10px;
    font-size: 14px;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    text-align: center;
  }

  .success {
    color: #2e7d32;
    background-color: #dcf8c6;
    margin-top: 10px;
    font-size: 14px;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    text-align: center;
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

const LoaderWrapper = styled.div`
  .earth p {
    color: white !important;
  }
`;























