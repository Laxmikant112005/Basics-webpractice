import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    try {
      const savedUser = localStorage.getItem('dream_house_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to restore session:", e);
      localStorage.removeItem('dream_house_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await userService.login(email, password);
      if (userData) {
        setUser(userData);
        localStorage.setItem('dream_house_user', JSON.stringify(userData));
        return userData;
      }
      throw new Error("Login failed: No user data returned");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await userService.register(userData);
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('dream_house_user', JSON.stringify(newUser));
        return newUser;
      }
      throw new Error("Registration failed: No user data returned");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dream_house_user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
    localStorage.setItem('dream_house_user', JSON.stringify({
      ...user,
      ...updatedData
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
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
