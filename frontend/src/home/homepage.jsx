import './homepage.css';
import logo from '../assets/img/logo.png';
import img1 from '../assets/img/Cloud_Hosting_img.png';
import img2 from '../assets/img/Customer_Satisfaction_img.png';
import img3 from '../assets/img/Notification_System_img.png';
import {Footer_all} from './footer_all.jsx';
import {Header} from './header.jsx';
import {Show_Hide} from './show_hide.jsx';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const Homepage = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);

    const access = async () => {
        try {
            const response = await axios.get("/api/v1/user/hasAccess");
            if(response.data.statusCode === 200)
            navigate("/user-dashboard");
            else if(response.data.statusCode===401)
                setShow(true);
            else
                alert("not good error handling");
        } catch (error) {

            setShow(true); // Show error to the user

            alert("An error occurred. Please try again.",error);
        }
    };

    return (
        <>
            {show &&
          <div className="home-homepage">
          <Header />
          <div className="content">
            <div className="lineup">
              <img src={logo} alt="brand-image"/>
              <p>
                <b>Suvidha</b> is an innovative CRM (Customer Relationship Management) ticket system website designed to enhance customer support and streamline service management. This platform empowers businesses to efficiently manage customer queries, issues, and requests through a centralized system.
              </p>
            </div>
            <div className="img_box">
              <div className="home-card">
                <img className="image" src={img1} alt="Cloud Hosting" />
                <div className="card-body ltr">
                  <h5>Hosted on a secure and reliable cloud infrastructure. Ensures high availability and minimal downtime.</h5>
                </div>
              </div>
              <div className="home-card">
                <img className="image" src={img2} alt="Customer Satisfaction" />
                <div className="card-body ltr">
                  <h5>Collects feedback after ticket resolution. Improves service quality through customer insights.</h5>
                </div>
              </div>
              <div className="home-card">
                <img className="image" src={img3} alt="Notification System" />
                <div className="card-body ltr">
                  <h5>Keeps users informed with real-time emails. Ensures no ticket goes unnoticed or unresolved.</h5>
                </div>
              </div>
            </div>
            <Show_Hide />
          </div>
          <Footer_all />
        </div>
            }
        </>
    )
}
