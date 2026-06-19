import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state directly from sessionStorage
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('cm360_user');
    return savedUser ? JSON.parse(savedUser) : null; 
  });

  // 2. THE MAGIC AUTO-SYNC: Whenever 'user' state changes, back it up to sessionStorage!
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('cm360_user', JSON.stringify(user));
      // Token is usually set in the login form, but we ensure user data is safely stored here
    } else {
      sessionStorage.removeItem('cm360_user');
      sessionStorage.removeItem('cm360_token');
    }
  }, [user]);

  // We only need user and setUser now. The useEffect does the heavy lifting.
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);