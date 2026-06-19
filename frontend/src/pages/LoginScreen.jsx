import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import API from '../services/api'; 

export default function LoginScreen() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await API.post('/auth/login', formData);
      const userData = response.data;

      // 1. Save the token for API requests
      sessionStorage.setItem('cm360_token', userData.token);

      // 2. Update Context (AuthContext will automatically save this to localStorage now!)
      setUser({
        id: userData._id,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        district: userData.district, // Make sure district comes through!
        token: userData.token
      });

      // 3. Route to the correct dashboard based on role
      if (userData.role === 'Admin' || userData.role === 'CM') {
        navigate('/dashboard');
      } else if (userData.role === 'Officer') {
        navigate('/officer');
      } else {
        navigate('/citizen'); // Assuming default is Citizen
      }

    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(error.response?.data?.message || 'Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center items-center px-5 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            CM360 <br />Governance Intelligence Platform
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">
             Chief Minister's Grievance Monitoring & Accountability System
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email" required name="email" value={formData.email} onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password" required name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Authenticating...
              </>
            ) : (
              'Secure Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-400 text-center font-medium">
          New to the system?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Request Access
          </Link>
        </p>

      </div>
    </div>
  );
}