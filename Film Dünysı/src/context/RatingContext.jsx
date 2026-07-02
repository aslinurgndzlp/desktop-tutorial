import React, { createContext, useState, useEffect, useContext } from 'react';

const RatingContext = createContext();

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_explorer_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to parse ratings from LocalStorage', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('movie_explorer_ratings', JSON.stringify(ratings));
  }, [ratings]);

  const getMovieRating = (movieId) => {
    return ratings[Number(movieId)] || 0;
  };

  const rateMovie = (movieId, score) => {
    if (!movieId) return;
    setRatings((prev) => ({
      ...prev,
      [Number(movieId)]: Number(score)
    }));
  };

  const removeRating = (movieId) => {
    setRatings((prev) => {
      const copy = { ...prev };
      delete copy[Number(movieId)];
      return copy;
    });
  };

  return (
    <RatingContext.Provider value={{ ratings, getMovieRating, rateMovie, removeRating }}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
};
export default RatingContext;
