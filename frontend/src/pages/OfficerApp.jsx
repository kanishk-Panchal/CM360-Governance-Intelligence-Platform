import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  MapPin, Camera, CheckCircle, AlertTriangle,
  Clock, ChevronRight, Filter, Wifi,
  FileText, CircleDot, ImagePlus, Navigation,
  UploadCloud, LogOut, Sun, Moon
} from 'lucide-react';

export default function OfficerApp() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  

  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [isDark, setIsDark] = useState(false); // Theme State
  
  
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [evidenceFiles, setEvidenceFiles] = useState({});
  const [resolvingId, setResolvingId] = useState(null);

  
  const handleLogout = () => {
    localStorage.removeItem('cm360_token');
    setUser(null);
    navigate('/login');
  };

  const toggleTheme = () => setIsDark(!isDark);

  // FETCH LIVE DATA
  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/complaints');
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching officer tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  
  const getSlaDetails = (createdAt, priority) => {
    const created = new Date(createdAt);
    const now = new Date();
    const elapsedHours = Math.max(0, (now - created) / (1000 * 60 * 60)).toFixed(1);

    
    let slaHours = 48; // Default Low
    if (priority === 'CRITICAL') slaHours = 4;
    else if (priority === 'High') slaHours = 12;
    else if (priority === 'Medium') slaHours = 24;

    return { elapsedHours, slaHours };
  };

  const getSlaPercent = (elapsed, total) => Math.min(Math.round((elapsed / total) * 100), 100);

  const getSlaColor = (pct) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 60) return 'bg-amber-400';
    return 'bg-green-500';
  };

  
  const handleResolve = async (id) => {
    const file = evidenceFiles[id];
    
    
    if (!file) {
      alert('ANTI-CORRUPTION ALERT: Photo evidence is strictly required to resolve this ticket. Please attach a photo.');
      return;
    }

    setResolvingId(id);
    try {
      const formData = new FormData();
      formData.append('status', 'Resolved_Pending_Verification');
      formData.append('image', file);

      await API.put(`/complaints/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      
      setEvidenceFiles(prev => ({ ...prev, [id]: null }));
      setExpandedId(null);
      fetchTickets();
    } catch (error) {
      console.error("Resolution failed:", error);
      alert(error.response?.data?.message || 'Failed to submit resolution. Please try again.');
    } finally {
      setResolvingId(null);
    }
  };

  
  const priorityConfig = {
    CRITICAL: { badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', dot: 'bg-red-500', accent: 'border-l-red-500' },
    High: { badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800', dot: 'bg-orange-500', accent: 'border-l-orange-500' },
    Medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-400', accent: 'border-l-amber-400' },
    Low: { badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', dot: 'bg-blue-400', accent: 'border-l-blue-400' },
  };

  const filters = ['All', 'CRITICAL', 'High', 'Medium', 'Low'];

  const filteredTickets = tickets.filter(t => {
    if (activeFilter !== 'All' && t.priority !== activeFilter) return false;
    return true; 
  });

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-24 font-sans">

        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm transition-colors">
          <div className="max-w-md mx-auto">
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                  Field Officer Portal
                </p>
                <h1 className="text-xl font-bold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {user.department || 'Government Official'}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
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
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-full shadow-sm mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Queue
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { label: 'Total', value: tickets.length, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
                { label: 'Critical', value: tickets.filter(t => t.priority === 'CRITICAL' && !['Closed', 'Resolved_Pending_Verification'].includes(t.status)).length, color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                { label: 'Pending Citizen', value: tickets.filter(t => t.status === 'Resolved_Pending_Verification').length, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
              ].map((p, i) => (
                <div key={i} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${p.color}`}>
                  <span className="text-sm font-black">{p.value}</span>
                  {p.label}
                </div>
              ))}
            </div>



            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeFilter === f
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 mt-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CheckCircle size={32} className="mx-auto mb-3 opacity-30 text-green-500" />
              <p className="text-sm font-medium">Queue is clear.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const p = priorityConfig[ticket.priority] || priorityConfig['Medium'];
              const { elapsedHours, slaHours } = getSlaDetails(ticket.createdAt, ticket.priority);
              const slaPct = getSlaPercent(elapsedHours, slaHours);
              const isExpanded = expandedId === ticket._id;
              const isResolved = ['Resolved_Pending_Verification', 'Closed'].includes(ticket.status);

              return (
                <div
                  key={ticket._id}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden border-l-4 ${p.accent} transition-all shadow-sm hover:shadow-md`}
                >
                  <button
                    className="w-full text-left px-5 py-4"
                    onClick={() => setExpandedId(isExpanded ? null : ticket._id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                            {ticket.priority}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-gray-400">
                            {ticket._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold truncate">
                          {ticket.title}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate">{ticket.location?.address}, {ticket.location?.district}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {isResolved ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} /> {ticket.status === 'Closed' ? 'Verified' : 'Done'}
                          </span>
                        ) : (
                          <ChevronRight
                            size={16}
                            className={`text-gray-300 dark:text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        )}
                      </div>
                    </div>

                    {!isResolved && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            SLA: {elapsedHours}h / {slaHours}h
                          </span>
                          <span className={slaPct >= 90 ? 'text-red-500 dark:text-red-400 font-bold' : ''}>
                            {slaPct}% elapsed
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${getSlaColor(slaPct)}`}
                            style={{ width: `${slaPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>

                  {isExpanded && !isResolved && (
                    <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-900/50 space-y-3 animate-in fade-in duration-200">

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Category', value: ticket.category },
                          { label: 'Reporter', value: ticket.reportedBy?.name || 'Citizen' },
                          { label: 'Status', value: ticket.status },
                          { label: 'Assignment', value: user.name },
                        ].map((item, i) => (
                          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
                              {item.label}
                            </p>
                            <p className="text-xs font-semibold truncate">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Description</p>
                          <p className="text-xs font-medium dark:text-gray-300">{ticket.description}</p>
                      </div>

                      <label className="w-full flex items-center justify-center gap-2 border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:scale-[0.98] transition-all cursor-pointer">
                        {evidenceFiles[ticket._id] ? (
                          <>
                            <CheckCircle size={15} className="text-green-500" />
                            <span className="text-green-700 dark:text-green-400 truncate max-w-[200px]">{evidenceFiles[ticket._id].name}</span>
                          </>
                        ) : (
                          <>
                            <ImagePlus size={15} />
                            Capture Resolution Proof *
                          </>
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => setEvidenceFiles(prev => ({ ...prev, [ticket._id]: e.target.files[0] }))}
                        />
                      </label>

                      <button
                        onClick={() => handleResolve(ticket._id)}
                        disabled={resolvingId === ticket._id}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                      >
                        {resolvingId === ticket._id ? (
                          <>
                             <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Uploading Proof...
                          </>
                        ) : (
                          <>
                            <UploadCloud size={15} />
                            Submit Evidence & Resolve
                          </>
                        )}
                      </button>

                      <p className="text-center text-[10px] text-gray-400 font-medium">
                        Mandatory photo upload for verification
                      </p>
                    </div>
                  )}

                  {isExpanded && ticket.status === 'Resolved_Pending_Verification' && (
                    <div className="border-t border-amber-100 dark:border-amber-900/30 px-5 py-4 bg-amber-50 dark:bg-amber-900/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <Clock size={14} className="text-amber-500" />
                        Resolution submitted. Awaiting citizen approval.
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}