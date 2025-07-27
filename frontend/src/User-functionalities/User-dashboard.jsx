import { Header_user_dashboard } from "./header.jsx";
import { Footer_all } from "../home/footer_all.jsx";
import { Ticket_table } from "./ticket_table.jsx";
import styled from 'styled-components';
import './ticket_table.css';
import { Profile } from "../User-functionalities/profile/profile.jsx";
import { Feedback } from "../User-functionalities/feedback/feedback.jsx";
import { Add_new_ticket } from "../User-functionalities/add_new_ticket/Add_new_ticket.jsx";
import { Chatuser } from "./chat/chatuser.jsx";
import { Routes, Route } from 'react-router-dom';

export const User_dashboard = () => {
  return (
    <StyledWrapper>
      <div className="homepage">
        <Header_user_dashboard />
        <div className="content-user">
          <Routes>
            <Route path="/" element={<Ticket_table />} />
            <Route path="/add_new_ticket" element={<Add_new_ticket />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/chat/:ticketId" element={<Chatuser />} />
            <Route path="*" element={<Ticket_table />} /> {/* Fallback to dashboard */}
          </Routes>
        </div>
        <Footer_all />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  @media (min-width: 0px) and (max-width: 90px) {
    .input-container-wrapper {
      display: none !important;
    }
  }
  @media (min-height: 0px) and (max-height: 90px) {
    .input-container-wrapper {
      display: none !important;
    }
  }
  @media (min-width: 90px) and (max-width: 330px) {
    .input-container-wrapper {
      width: 50vw !important;
      margin-left: 4vw !important;
    }
  }
  @media (min-width: 330px) and (max-width: 700px) {
    .input-container-wrapper {
      width: 35vw !important;
    }
  }
  @media (min-width: 330px) and (max-width: 1100px) {
    .input-container-wrapper {
      margin-left: 3.5vw !important;
    }
  }
  @media (min-width: 1100px) and (max-width: 1260px) {
    .input-container-wrapper {
      margin-left: 2.5vw !important;
    }
  }
  @media (max-width: 1300px) {
    .input-container-wrapper {
      margin-left: 1.7vw;
    }
  }
  .input-container-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35vh;
    width: 20vw;
  }
  .input-container {
    width: 220px;
    position: relative;
  }
  .icon {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
  }
  .input {
    width: 100%;
    height: 40px;
    padding: 10px;
    transition: 0.2s linear;
    border: 2.5px solid #679ef8;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .input::placeholder {
    color: black;
    font-weight: bold;
  }
  .input:focus {
    outline: none;
    border: 0.5px solid #679ef8;
    box-shadow: -5px -5px 0px #679ef8;
  }
  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }
  @keyframes anim {
    0%, 100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }
    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
`;