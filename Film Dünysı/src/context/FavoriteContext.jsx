import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load favorites whenever user logs in or out
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      try {
        const userKey = `movie_explorer_favorites_${user.email.toLowerCase()}`;
        const saved = localStorage.getItem(userKey);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error('Failed to load favorites for user', e);
        setFavorites([]);
      }
    } else {
      // Reset favorites state when logged out
      setFavorites([]);
    }
  }, [isLoggedIn, user]);

  // Save favorites to user-specific LocalStorage key whenever favorites change
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const userKey = `movie_explorer_favorites_${user.email.toLowerCase()}`;
      localStorage.setItem(userKey, JSON.stringify(favorites));
    }
  }, [favorites, isLoggedIn, user]);

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === Number(movieId));
  };

  const addToFavorites = (movie) => {
    if (!isLoggedIn || !movie || !movie.id) return false;
    
    // Check if already in favorites
    if (isFavorite(movie.id)) return false;

    setFavorites((prev) => [...prev, movie]);
    return true;
  };

  const removeFromFavorites = (movieId) => {
    if (!isLoggedIn) return false;
    setFavorites((prev) => prev.filter(movie => movie.id !== Number(movieId)));
    return true;
  };

  return (
    <FavoriteContext.Provider value={{ favorites, isFavorite, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
export default FavoriteContext;
