import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Default demo account
const DEFAULT_USERS = [
  { name: 'Demo Kullanıcı', email: 'demo@example.com', password: 'demo' }
];

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('movie_explorer_is_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('movie_explorer_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Load registered users list from LocalStorage, or initialize with demo user
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_explorer_registered_users');
      if (saved) {
        return JSON.parse(saved);
      } else {
        localStorage.setItem('movie_explorer_registered_users', JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const login = (email, password) => {
    if (!email || !password) return false;

    // Find user in the registered users list
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      setIsLoggedIn(true);
      setUser(userData);
      localStorage.setItem('movie_explorer_is_logged_in', 'true');
      localStorage.setItem('movie_explorer_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) return { success: false, message: 'Tüm alanlar gereklidir.' };

    // Check if email already exists
    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' };
    }

    const newUser = { name, email, password };
    const updatedUsers = [...registeredUsers, newUser];
    
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('movie_explorer_registered_users', JSON.stringify(updatedUsers));
    
    return { success: true, message: 'Kayıt başarıyla tamamlandı!' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('movie_explorer_is_logged_in');
    localStorage.removeItem('movie_explorer_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
