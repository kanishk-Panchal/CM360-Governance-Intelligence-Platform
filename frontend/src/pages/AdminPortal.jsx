import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, CheckCircle, LogOut, Phone } from 'lucide-react'; 
import API from '../services/api';

// MASTER DISTRICT LIST - Guarantees perfect matching with the Citizen Portal
const DELHI_DISTRICTS = [
  "Central Delhi",
  "East Delhi",
  "New Delhi",
  "North Delhi",
  "North East Delhi",
  "North West Delhi",
  "Shahdara",
  "South Delhi",
  "South East Delhi",
  "South West Delhi",
  "West Delhi"
];

export default function AdminPortal() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  // Added 'district' to initial state
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', role: 'Officer', department: 'Public Works (PWD)', district: '' 
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await API.post('/auth/register', formData);
      setStatus('success');
      // Reset state, keeping defaults
      setFormData({ name: '', email: '', phone: '', password: '', role: 'Officer', department: 'Public Works (PWD)', district: '' });
      
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cm360_token');
    setUser(null);                          
    navigate('/login');                     
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="p-10 text-center text-red-600 font-bold text-xl mb-4">UNAUTHORIZED ACCESS: IT ADMINS ONLY</div>
        <button onClick={handleLogout} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 pb-20 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <header className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" /> Admin Provisioning Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">Authorized personnel only: Create official government accounts.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm shrink-0"
          >
            <LogOut size={16} />
            Secure Logout
          </button>
        </header>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <UserPlus size={18} /> Provision New Staff Member
          </h2>

          {status === 'success' && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl flex items-center gap-2">
              <CheckCircle size={16} /> Official account created successfully.
            </div>
          )}

          <form onSubmit={handleCreateStaff} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Official Email</label>
                <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input type="tel" required name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-indigo-400 focus:bg-white transition-colors">
                  <option value="Officer">Field Officer</option>
                  <option value="CM">Chief Minister / Executive</option>
                </select>
              </div>
            </div>

            {/* Conditionally render Department and District only for Officers */}
            {formData.role === 'Officer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 block">Department</label>
                 <select 
  name="department" 
  value={formData.department} 
  onChange={handleChange} 
  className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
>
  <option value="" disabled>Select Department</option>
  {/* The 'value' must be exact, but the text the admin reads can have the acronyms! */}
  <option value="Roads & Traffic">Roads & Traffic (PWD)</option>
  <option value="Water & Sanitation">Water & Sanitation (DJB)</option>
  <option value="Electricity">Electricity (BSES)</option>
  <option value="Garbage & Sanitation">Garbage & Sanitation (MCD)</option>
  <option value="Public Safety">Public Safety (Police)</option>
</select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 block">Assigned District</label>
                  <select 
                    name="district" 
                    required={formData.role === 'Officer'} 
                    value={formData.district} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
                  >
                    <option value="" disabled>Select Jurisdiction</option>
                    {DELHI_DISTRICTS.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
              
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Temporary Password</label>
                <input type="password" required name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm mt-4 text-sm active:scale-[0.99]">
              Create Official Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}