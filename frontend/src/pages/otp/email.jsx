import react from 'react';
import styled from 'styled-components';
export const Email= () => {
    const otp=1234;
    return(
        <StyledWrapper>
            <div className="main">
<div className="email-container">
      <div className="email-card">
        <h2>Your OTP Code</h2>
        <p>Use the following OTP to complete your verification:</p>
        <h1 className="otp-code">{otp}</h1>
        <p className="note">This OTP is valid for 10 minutes.</p>
        <p className="note">If you did not request this, please ignore this email.</p>
        <div>
        <p className="footer_email"><br />© 2025 Suvidha - All Rights Reserved</p>
        </div>
      </div>
    </div>
    </div>
    </StyledWrapper>
)}

const StyledWrapper=styled.div`
.main{
display:flex;
justify-content:center;
align-items:center;
height:100vh;
width:100vw;
}
.email-container {
  font-family: Arial, sans-serif;
  background-color:white;
  padding: 20px;
  text-align: center;
}

.email-card {
  width: 400px;
  background-color:rgb(19, 13, 13);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

h2,p {
  color: white;
}

.otp-code {
  background-color: #007bff;
  color: white;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
}

.note {
  color: white;
}

hr {
  margin: 20px 0;
}

.footer_email {
border-top:1px solid white;
  font-size: 12px;
  color: white;
}
`;