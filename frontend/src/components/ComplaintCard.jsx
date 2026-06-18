import React, { useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  const [localStatus, setLocalStatus] = useState(complaint.status);

  // Mock functions 
  const handleVerify = () => setLocalStatus('Closed_Verified');
  const handleReopen = () => setLocalStatus('Reopened_Escalated');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 max-w-2xl">
    
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{complaint.title}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {complaint.location.district} - {complaint.location.address}
          </p>
        </div>
        {complaint.priority === 'CRITICAL' && (
          <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" /> CRITICAL
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-6">{complaint.description}</p>

      {/* Verification State */}
      {localStatus === 'Resolved_Pending_Verification' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 flex items-center mb-2">
            <CheckCircle className="w-4 h-4 mr-2" /> Officer marked this as resolved.
          </h4>
          <p className="text-xs text-blue-800 mb-4">
            Govt APIs require citizen verification to close this ticket permanently. Did the officer actually fix the issue?
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={handleVerify}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Yes, Issue Fixed
            </button>
            <button 
              onClick={handleReopen}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              No, Reopen Case
            </button>
          </div>
        </div>
      ) : (
        
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          Current Status: <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md">{localStatus.replace('_', ' ')}</span>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;