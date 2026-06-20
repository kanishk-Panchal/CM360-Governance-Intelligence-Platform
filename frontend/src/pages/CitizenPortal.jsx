import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  PlusCircle, MapPin, Camera, Clock,
  CheckCircle, AlertTriangle, ChevronRight,
  FileText, RotateCcw, LogOut, Sun, Moon
} from 'lucide-react';

// MASTER DISTRICT LIST - Guarantees perfect matching with the backend and map
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

export default function CitizenPortal() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('track');
  const [isDark, setIsDark] = useState(false); 
  
  // Live State Management
  const [myComplaints, setMyComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ 
    title: '', category: 'Roads & Traffic', description: '', district: '', address: '' 
  });
  const [evidenceFile, setEvidenceFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('cm360_token');
    setUser(null);
    navigate('/login');
  };

  const toggleTheme = () => setIsDark(!isDark);

  // FETCH LIVE DATA
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/complaints');
      setMyComplaints(response.data.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'track') {
      fetchComplaints();
    }
  }, [activeTab]);

  // SUBMIT NEW COMPLAINT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.district || !form.address) return alert("Please fill all required fields.");
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('description', form.description || 'Citizen submitted description');
      formData.append('district', form.district);
      formData.append('address', form.address);
      if (evidenceFile) formData.append('image', evidenceFile);

      await API.post('/complaints', formData) 
      //   {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      setForm({ title: '', category: 'Roads & Traffic', description: '', district: '', address: '' });
      setEvidenceFile(null);
      setActiveTab('track');
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit grievance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CITIZEN VERIFIES OR REJECTS RESOLUTION
  const handleVerify = async (id, confirmed) => {
    try {
      const newStatus = confirmed ? 'Closed' : 'Reopened';
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not verify the resolution at this time.");
    }
  };

  const statusConfig = {
    'Resolved_Pending_Verification': {
      label: 'Awaiting Verification',
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-400',
    },
    'In Progress': {
      label: 'In Progress',
      color: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-400',
    },
    'Open': {
      label: 'Submitted',
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      dot: 'bg-gray-400',
    },
    'Assigned': {
      label: 'Assigned',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      dot: 'bg-indigo-400',
    },
    'Closed': {
      label: 'Verified Closed',
      color: 'text-green-700 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      dot: 'bg-green-500',
    },
    'Reopened': {
      label: 'Reopened',
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500',
    },
  };

  const categoryIcons = {
    'Roads & Traffic': '🛣️', 'Water & Sanitation': '💧', 'Electricity': '⚡', 'Garbage & Sanitation': '🗑️', 'Public Safety': '🛡️'
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-24 font-sans">
        
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 pt-8 pb-5 transition-colors">
          <div className="max-w-md mx-auto">
            
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                  Delhi Resolve
                </p>
                <h1 className="text-xl font-bold tracking-tight">
                  Welcome, {user?.name || "Citizen"}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Summary Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <div className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Sync
              </div>
              {[
                { label: 'Total Filed', value: myComplaints.length, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
                { label: 'In Progress', value: myComplaints.filter(c => ['In Progress', 'Assigned'].includes(c.status)).length, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              ].map((pill, i) => (
                <div key={i} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${pill.color}`}>
                  <span className="text-base font-black">{pill.value}</span>
                  {pill.label}
                </div>
              ))}
            </div>
            
            <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 mt-4 rounded-xl">
              <button
                onClick={() => setActiveTab('report')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'report'
                    ? 'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Report Issue
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'track'
                    ? 'bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                My Complaints
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 mt-4">
          
          {activeTab === 'report' && (
            <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm transition-colors">
                <div className="flex items-center gap-2 mb-5">
                  <PlusCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold">New Grievance</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Issue Title *</label>
                    <input
                      type="text" required placeholder="e.g., Broken Streetlight on Main Road" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Category *</label>
                    <select
                      value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                    >
                      <option>Roads & Traffic</option><option>Water & Sanitation</option><option>Electricity</option><option>Garbage & Sanitation</option><option>Public Safety</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">District *</label>
                      {/* UPDATED DISTRICT DROPDOWN */}
                      <select
                        required
                        value={form.district}
                        onChange={e => setForm({ ...form, district: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                      >
                        <option value="" disabled>Select District</option>
                        {DELHI_DISTRICTS.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Exact Address *</label>
                      <input type="text" required placeholder="Sector 7 Block B" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors placeholder:text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                    <textarea
                      placeholder="Describe the issue in detail..." rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-colors placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  {/* Cloudinary Image Upload */}
                  <label className="w-full flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-sm font-medium group">
                    <Camera size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-xs text-center px-4">
                      {evidenceFile ? <span className="text-indigo-600 dark:text-indigo-400 font-bold">{evidenceFile.name}</span> : "Attach Photo Evidence (Required for faster routing)"}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setEvidenceFile(e.target.files[0])} />
                  </label>

                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <><svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Processing...</>
                ) : 'Submit Grievance'}
              </button>

              <p className="text-center text-[11px] text-gray-400 pb-2">You'll receive SMS & in-app updates on every status change</p>
            </form>
          )}

          {activeTab === 'track' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {isLoading ? (
                <div className="flex justify-center py-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : myComplaints.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors">
                  <FileText className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-bold">No active reports</p>
                  <p className="text-xs text-gray-500 mt-1">Grievances you file will appear here.</p>
                </div>
              ) : (
                myComplaints.map((complaint) => {
                  const s = statusConfig[complaint.status] || statusConfig['Open'];
                  return (
                    <div key={complaint._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="px-5 pt-4 pb-3">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{categoryIcons[complaint.category] || '📋'}</span>
                            <h3 className="text-sm font-bold leading-tight">{complaint.title}</h3>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap mt-0.5">{formatDate(complaint.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} />{complaint.location?.address}, {complaint.location?.district}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.color} ${s.bg} ${s.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-gray-400">ID: {complaint._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>

                      {complaint.status === 'Resolved_Pending_Verification' && (
                        <div className="mx-4 mb-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5">
                          <div className="flex items-start gap-2 mb-3">
                            <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-amber-900 dark:text-amber-400 mb-0.5">Your confirmation is needed</p>
                              <p className="text-[11px] text-amber-700 dark:text-amber-500/80 leading-relaxed">The department marked this issue as resolved. Did they fix it?</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleVerify(complaint._id, true)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-green-700 active:scale-[0.98] transition-all"><CheckCircle size={13} /> Yes, Fixed</button>
                            <button onClick={() => handleVerify(complaint._id, false)} className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all"><RotateCcw size={13} /> No, Reopen</button>
                          </div>
                        </div>
                      )}

                      {complaint.status !== 'Resolved_Pending_Verification' && (
                        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} className="text-gray-400" />
                            Last updated {formatDate(complaint.updatedAt)}
                          </div>
                          <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">
                            Details <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              <button onClick={() => setActiveTab('report')} className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-4 rounded-2xl text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm mt-4">
                <PlusCircle size={15} /> File a new complaint
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}