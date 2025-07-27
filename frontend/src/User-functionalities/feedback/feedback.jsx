import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header_user_dashboard } from '../header';
import { Footer_all } from '../../home/footer_all';
import { Show_Hide } from '../show_hide.jsx';
import { Rating } from './rating.jsx';
import './rating.css';
import trump from '../../assets/img/trump.png';
import { AuthContext } from '../../context/Authcontext';
import axios from 'axios';
import { Loader } from '../../home/Loader.jsx';

export const Feedback = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data if username or email is missing
  useEffect(() => {
    if (user && (!user.username || !user.email)) {
      const fetchUser = async () => {
        try {
          console.log('Fetching user data for Feedback'); // Debug
          const response = await axios.get('http://localhost:4000/api/users/me', {
            withCredentials: true,
          });
          console.log('Fetched user:', response.data); // Debug
          setUsername(response.data.username || '');
          setEmail(response.data.email || '');
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to load user data. Please try again.');
        }
      };
      fetchUser();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please provide a rating');
      return;
    }

    try {
      console.log('Submitting feedback:', { username, email, rating, comments });
      const response = await axios.post(
        'http://localhost:4000/api/feedback/submit',
        { username, email, rating: Number(rating), comments },
        { withCredentials: true }
      );
      console.log('Feedback response:', response.data); // Debug
      setSuccess('Feedback submitted successfully!');
      setRating(null);
      setComments('');
      setTimeout(() => navigate('/user-dashboard'), 2000);
    } catch (err) {
      console.error('Feedback error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to submit feedback');
    }
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="container-feedback">
      <div className="pro_img_container">
        <div className="feedback">
          <form onSubmit={handleSubmit}>
            <h2>Feedback Form</h2>
            <p>
              <b>Hi! Please provide feedback to help us improve our services.</b>
            </p>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className="data_container">
              <label htmlFor="username">
                <b>Username</b>
              </label>
              <input
                className="input-profile"
                type="text"
                name="username"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="data_container">
              <label htmlFor="email">
                <b>Email</b>
              </label>
              <input
                className="input-profile"
                type="email"
                name="email"
                placeholder="Enter Your Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="rate-us">
              <p>
                <b>Rate Us</b>
              </p>
              <Rating rating={rating} setRating={setRating} />
            </div>
            <p>
              <b>Feel free to add any other comments or suggestions:</b>
            </p>
            <textarea
              rows="5"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your comments..."
            ></textarea>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
        <img src={trump} id="trump" alt="trump_image" />
      </div>
      <div className="homepage">
        <Header_user_dashboard />
        <Footer_all />
        <Show_Hide />
      </div>
    </div>
  );
};