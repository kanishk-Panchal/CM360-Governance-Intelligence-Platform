import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// 1. Make sure all pages are imported!
import CitizenPortal from './pages/CitizenPortal';
import OfficerApp from './pages/OfficerApp';
import LoginScreen from './pages/LoginScreen';
import DashboardRouter from './pages/DashboardRouter';
import RegisterScreen from "./pages/RegisterScreen";
import AdminPortal from './pages/AdminPortal'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Protected Role-Based Routes */}
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/officer" element={<OfficerApp />} />
          <Route path="/admin" element={<AdminPortal />} />
          
          {/* CM Command Center (Or Dynamic Router) */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          {/* Catch-all: If URL doesn't match above, go to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;