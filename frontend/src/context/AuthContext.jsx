import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cm360_user');
    return savedUser ? JSON.parse(savedUser) : null; 
  });

  const login = (userData, token) => {
    localStorage.setItem('cm360_token', token);
    localStorage.setItem('cm360_user', JSON.stringify(userData)); 
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cm360_token');
    localStorage.removeItem('cm360_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);