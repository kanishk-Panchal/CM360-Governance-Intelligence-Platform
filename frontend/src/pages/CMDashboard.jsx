import DistrictMap from '../components/DistrictMap';
// **********************************************
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  AlertOctagon, TrendingDown, Users, CheckCircle,
  ShieldAlert, Award, Bell, Activity, Moon, Sun, LogOut
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

export default function CMDashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Create a state to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // 2. Create a timer that updates that state every 1000 milliseconds (1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // This cleanup function stops the timer if the user navigates away from the dashboard
    return () => clearInterval(timer);
  }, []);


  // Fetch Live MongoDB Data (BULLETPROOFED)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/complaints');
        
        // Safely extract the array, no matter how Axios wraps it
        const fetchedData = response.data.data || response.data || [];
        setComplaints(fetchedData);
        
      } catch (error) {
        console.error("Failed to fetch live data:", error);
        
        // If the backend rejects the old token, force a fresh sync!
        if (error.response?.status === 401) {
          alert("Security Sync: Database structure changed. Please log in again to sync your token.");
          localStorage.removeItem('cm360_token');
          localStorage.removeItem('cm360_user');
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem('cm360_token');
    localStorage.removeItem('cm360_user');
    setUser(null);
    navigate('/login');
  };

  // UI Calculations
  const totalComplaints = complaints.length;
  const pendingIssues = complaints.filter(c => ['Open', 'Assigned', 'In Progress'].includes(c.status)).length;
  const criticalAlerts = complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'Closed').length;
  const verifiedResolutions = complaints.filter(c => c.status === 'Closed' && c.citizenVerified).length;
  const reopenedIssues = complaints.filter(c => c.status === 'Reopened').length;

  const effectiveResolutions = verifiedResolutions > 0 ? verifiedResolutions : complaints.filter(c => c.status === 'Closed').length;
  const verifiedRate = totalComplaints ? ((effectiveResolutions / totalComplaints) * 100).toFixed(1) : 0;
  const falseClosureRate = totalComplaints ? ((reopenedIssues / totalComplaints) * 100).toFixed(1) : 0;

  // District Heatmap processing (Restored Stacked Details)
  const processDistrictData = () => {
    const districtMap = {};
    complaints.forEach(c => {
      const dist = c.location?.district || "Unknown";
      if (!districtMap[dist]) {
        districtMap[dist] = { name: dist, critical: 0, pending: 0, resolved: 0 };
      }
      if (c.status === 'Closed') districtMap[dist].resolved += 1;
      else if (c.priority === 'CRITICAL') districtMap[dist].critical += 1;
      else districtMap[dist].pending += 1;
    });
    return Object.values(districtMap);
  };
  const liveDistrictData = processDistrictData();

  // Live Critical Alerts
  const liveAlertsFeed = complaints
    .filter(c => c.priority === 'CRITICAL' || c.priority === 'High')
    .filter(c => c.status !== 'Closed')
    .slice(0, 4);

  // Department Accountability processing
  const processDepartmentScores = () => {
    const deptMap = {
      'Roads & Traffic': { name: 'Public Works (PWD)', total: 0, resolved: 0 },
      'Water & Sanitation': { name: 'Water Board (DJB)', total: 0, resolved: 0 },
      'Electricity': { name: 'Electricity (BSES)', total: 0, resolved: 0 },
      'Garbage & Sanitation': { name: 'Sanitation (MCD)', total: 0, resolved: 0 },
      'Public Safety': { name: 'Home Dept (Police)', total: 0, resolved: 0 }
    };

    complaints.forEach(c => {
      const targetDept = deptMap[c.category];
      if (targetDept) {
        targetDept.total += 1;
        if (c.status === 'Closed') {
          targetDept.resolved += 1;
        }
      }
    });

    return Object.values(deptMap)
      .filter(dept => dept.total > 0)
      .map(dept => {
        const score = Math.round((dept.resolved / dept.total) * 100);
        let status = 'Needs Review';
        if (score >= 90) status = 'Excellent';
        else if (score >= 80) status = 'Good';

        return { dept: dept.name, score: score, status: status };
      })
      .sort((a, b) => b.score - a.score);
  };

  const liveDepartmentScores = processDepartmentScores();

  const getScoreColor = (score) => score >= 90 ? '#16a34a' : score >= 80 ? '#2563eb' : '#dc2626';
  const getScoreBarColor = (score) => score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-blue-500' : 'bg-red-500';
  const getStatusBadge = (score) => {
    if (score >= 90) return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 80) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-gray-900 transition-colors duration-300 p-6 pb-20 font-sans text-gray-900 dark:text-gray-100">

{/* ****************************************************************** */}

        {/* Header Block */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-8">
          
          {/* Left Side: Text */}
          <div className="w-full md:w-auto">
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Governance Intelligence Platform
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              CM360 Command Center
            </h1>
            <p className="hidden md:block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 mt-1">
              Real-Time Governance & Accountability Monitoring
            </p>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.name} · Live data as of {currentTime ? currentTime.toLocaleTimeString() : new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-start md:justify-end border-t border-gray-200 dark:border-gray-800 md:border-0 pt-4 md:pt-0">
            
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            <div className="relative shrink-0">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Bell size={16} />
              </button>
              {criticalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {criticalAlerts}
                </span>
              )}
            </div>

            {/* Avatar Token */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shrink-0">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-none">{user?.name}</span>
            </div>

            {/* Logout Utility */}
            <button 
              onClick={handleLogout}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors ml-auto md:ml-0"
            >
              <LogOut size={16} />
            </button>

          </div>
        </header>

{/* ****************************************************************** */}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Status Briefing Banner */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center">
                  <Activity className="text-indigo-600 dark:text-indigo-400" size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                    Live Status Briefing
                  </p>
                  <p className="text-sm font-medium">
                    {criticalAlerts} critical alerts · {totalComplaints} total records scanned · {verifiedRate}% verified resolution rate
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Summary Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Active Complaints"
                value={pendingIssues}
                delta="Live Sync Active"
                deltaType="neutral"
                icon={<Users size={18} />}
                iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              />
              <MetricCard
                title="Critical Alerts"
                value={criticalAlerts}
                delta={`${criticalAlerts} immediate actions`}
                deltaType="danger"
                icon={<AlertOctagon size={18} />}
                iconBg="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                isAlert={criticalAlerts > 0}
              />
              <MetricCard
                title="Citizen Trust Index"
                value={`${verifiedRate}%`}
                delta="Citizen confirmed"
                deltaType="success"
                icon={<CheckCircle size={18} />}
                iconBg="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              />
              <MetricCard
                title="Reopened Complaints"
                value={`${falseClosureRate}%`}
                delta="Reopened tickets"
                deltaType="danger"
                icon={<TrendingDown size={18} />}
                iconBg="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              />
            </div>

            {/* Advanced Analytical Visualization Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* District Hotspot (Restored Stacked Layout and Legends) */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold">District Hotspot Analysis</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Live distribution of grievances across Delhi districts
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Live Sync
                  </span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={liveDistrictData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#F1F5F9'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 500 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                      <Tooltip
                        cursor={{ fill: isDark ? '#1F2937' : '#F8FAFC' }}
                        contentStyle={{
                          borderRadius: '10px',
                          border: isDark ? '1px solid #374151' : '1px solid #E2E8F0',
                          backgroundColor: isDark ? '#111827' : '#FFFFFF',
                          color: isDark ? '#F3F4F6' : '#111827',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          fontSize: '13px',
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#64748B' }} />
                      <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Critical" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="pending" stackId="a" fill="#6366F1" name="Pending" />
                      <Bar dataKey="resolved" stackId="a" fill="#22C55E" name="Resolved" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

{/* ************************************************************************ */}

              <div className="h-[400px] w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 p-2 relative">
                {/* The Map Component */}
                <DistrictMap liveData={liveDistrictData} />
                
                {/* Floating Legend */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-sm flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Alert Severity</p>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span> Critical (20+)
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="w-3 h-3 rounded-sm bg-[#f59e0b]"></span> Elevated (10+)
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="w-3 h-3 rounded-sm bg-[#10b981]"></span> Safe (0-9)
                  </div>
                </div>
              </div>

{/* ********************************************************************************* */}

              {/* Action Streams & Scores Right Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:col-span-3">

                {/* Immediate Actions Feed Container */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <ShieldAlert size={16} className="text-red-500" />
                      Immediate Action
                    </h2>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 px-2 py-0.5 rounded-full">
                      {criticalAlerts} open
                    </span>
                  </div>
                  <div className="space-y-3">
                    {liveAlertsFeed.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No critical alerts right now.</p>
                    ) : (
                      liveAlertsFeed.map((alert) => (
                        <AlertItem
                          key={alert._id}
                          title={alert.title}
                          location={alert.location?.district || "Unknown District"}
                          status={alert.status}
                          time="Live"
                          severity={alert.priority === 'CRITICAL' ? 'critical' : 'high'}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Restored Complete Department Score Tracker */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={16} className="text-amber-500" />
                    <h2 className="text-sm font-bold">Accountability Score</h2>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Based on verified closures</p>
                  <div className="space-y-4">
                    {liveDepartmentScores.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">Awaiting complaint data...</p>
                    ) : (
                      liveDepartmentScores.map((dept, i) => (
                        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold truncate max-w-[65%]">{dept.dept}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(dept.score)}`}>
                                {dept.status}
                              </span>
                              <span className="text-xs font-black" style={{ color: getScoreColor(dept.score) }}>{dept.score}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all duration-1000 ${getScoreBarColor(dept.score)}`} style={{ width: `${dept.score}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Global Reusable Layout Templates
const MetricCard = ({ title, value, delta, deltaType, icon, iconBg, isAlert }) => {
  const deltaColors = {
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-500 dark:text-red-400',
    neutral: 'text-gray-400 dark:text-gray-500',
  };
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border transition-colors ${isAlert ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-tight max-w-[70%]">
          {title}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black tracking-tight mb-1">{value}</p>
      <p className={`text-xs font-medium ${deltaColors[deltaType]}`}>{delta}</p>
    </div>
  );
};

const AlertItem = ({ title, location, status, time, severity }) => {
  const styles = {
    critical: {
      wrapper: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30',
      title: 'text-red-900 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
      dot: 'bg-red-500',
    },
    high: {
      wrapper: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30',
      title: 'text-orange-900 dark:text-orange-400',
      badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
      dot: 'bg-orange-500',
    },
  };
  const s = styles[severity] || styles.high;
  return (
    <div className={`p-3 rounded-xl border cursor-pointer hover:brightness-95 transition-all ${s.wrapper}`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 ${s.dot}`} />
          <p className={`text-xs font-bold ${s.title}`}>{title}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{time}</span>
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 pl-3.5">{location} · {status}</p>
    </div>
  );
};