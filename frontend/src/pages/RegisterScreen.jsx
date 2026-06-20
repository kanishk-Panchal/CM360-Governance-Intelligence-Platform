import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle,Phone } from 'lucide-react';
import API from '../services/api';

export default function RegisterScreen() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      
      const payload = {
        name: formData.name,
        email: formData.email,
          phone: formData.phone,
        password: formData.password,
        role: 'Citizen' 
      };

      const response = await API.post('/auth/register', payload);
      const userData = response.data;

      setSuccess(true);
      sessionStorage.setItem('cm360_token', userData.token);

      setTimeout(() => {
        setUser({
          id: userData._id,
          name: userData.name,
          role: userData.role,
          token: userData.token
        });
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center items-center px-5 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
            <UserPlus className="text-blue-600" size={24} /> CM360 Citizen Portal
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Register to submit, track and verify grievance resolutions.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-xs font-medium rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" /><span>Account created! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Kanishk Panchal" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
            </div>
          </div>



      {/* ***************************************************** */}

<div>
  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
    Mobile Number
  </label>

  <div className="relative mt-1">
    <Phone
      className="absolute left-3 top-3.5 text-gray-400"
      size={18}
    />

    <input
      type="tel"
      required
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="9876543210"
      maxLength={10}
      pattern="[0-9]{10}"
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
    />
  </div>

  <p className="text-[10px] text-gray-400 mt-1">
    Used for grievance updates, OTP verification and resolution alerts.
  </p>
</div>
      {/* ************************************************************* */}



          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="name@domain.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
            </div>
          </div>

        


          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secure Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="password" required name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2 text-sm">
            {isSubmitting ? 'Registering...' : 'Create Citizen Account'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center font-medium">
          Already registered? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
        <p className="mt-4 text-[10px] text-gray-400 text-center">
For security reasons, government staff accounts are managed centrally by the CM360 Administration System.  </p>
      </div>
    </div>
  );
}