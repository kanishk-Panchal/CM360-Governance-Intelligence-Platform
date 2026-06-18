import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginScreen from './pages/LoginScreen';
import DashboardRouter from './pages/DashboardRouter';
import RegisterScreen from "./pages/RegisterScreen";
import AdminPortal from './pages/AdminPortal'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Protected Dynamic  */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          <Route path="/admin" element={<AdminPortal />} />
          {/* Catch-all  */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;