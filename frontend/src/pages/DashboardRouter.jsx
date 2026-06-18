import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import CMDashboard from './CMDashboard';
import OfficerApp from './OfficerApp'; 
import CitizenPortal from './CitizenPortal';
import AdminPortal from './AdminPortal'; 


export default function DashboardRouter() {
  const { user } = useAuth();

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  switch (user.role) {
    case 'CM':
      return <CMDashboard />;
      
    case 'Admin': 
      return <AdminPortal />;
      
    case 'Officer':
      return <OfficerApp />;
      
    case 'Citizen':
      return <CitizenPortal />;
      
    default:
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-sm font-semibold text-red-500">Unauthorized: Access level unrecognized.</p>
        </div>
      );
  }
}