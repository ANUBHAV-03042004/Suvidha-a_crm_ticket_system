import React from 'react';
import './rating.css';

export const Rating = ({ rating, setRating }) => {
  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  return (
    <div className="rating">
      {[5, 4, 3, 2, 1].map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rating"
            value={star}
            checked={rating == star}
            onChange={handleRatingChange}
          />
          <label htmlFor={`star${star}`}>
            <svg viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};