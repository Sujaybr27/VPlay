import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
      // Decode user from token or fetch user data
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, isAdmin: payload.isAdmin });
      } catch (e) {
        console.error('Invalid token');
        logout();
      }
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, token, login, logout, loading } },
    children
  );
};
