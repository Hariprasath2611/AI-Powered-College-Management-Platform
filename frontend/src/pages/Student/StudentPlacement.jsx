import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Briefcase, Landmark, Calendar, Award, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';

const StudentPlacement = () => {
  const [drives, setDrives] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      const drivesResponse = await api.get('/placement/drives');
      const statsResponse = await api.get('/placement/stats');
      setDrives(drivesResponse.data.drives);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load placement drives.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    try {
      await api.post(`/placement/drives/${driveId}/apply`);
      alert('Application submitted successfully!');
      fetchPlacementData(); // Refresh list
    } catch (err) {
      alert('Application failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setApplyingId(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'OFFERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'SHORTLISTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'INTERVIEWING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Placement Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Explore hiring opportunities, view scheduled placement drives, and track your interview stages.</p>
      </div>

      {/* Stats Summary Panel */}
      {stats && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
            <BarChart3 className="h-4.5 w-4.5 text-primary-500" /> General Placement Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Recruiters</span>
              <strong className="text-2xl font-black">{stats.totalDrives} Companies</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Applications</span>
              <strong className="text-2xl font-black">{stats.totalApplications} Submissions</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Shortlisted Candidates</span>
              <strong className="text-2xl font-black text-blue-500">{stats.shortlisted} profiles</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Offers Issued</span>
              <strong className="text-2xl font-black text-green-500">{stats.offers} Selected</strong>
            </div>
          </div>
        </div>
      )}

      {/* Drives list */}
      <div className="space-y-6">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Active Placement Drives</h3>
        
        {drives.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border rounded-3xl text-slate-500">
            No active drives scheduled at the moment.
          </div>
        ) : (
          drives.map((drive) => (
            <div 
              key={drive.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all"
            >
              {/* Left Details */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl flex items-center gap-1">
                    <Landmark className="h-3.5 w-3.5" />
                    {drive.company.name}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">{drive.salaryPackage} package</span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">{drive.jobTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-2xl">{drive.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date: {new Date(drive.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Criteria: {drive.eligibilityCriteria}</span>
                </div>
              </div>

              {/* Right Action / Status */}
              <div className="flex-shrink-0 w-full md:w-auto text-right">
                {drive.applied ? (
                  <div className="inline-flex flex-col items-end gap-1.5">
                    <span className={`px-3 py-1.5 border text-xs font-bold rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${getStatusBadgeColor(drive.applicationStatus)}`}>
                      <CheckCircle2 className="h-4 w-4" />
                      Status: {drive.applicationStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">Application Registered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(drive.id)}
                    disabled={applyingId === drive.id}
                    className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Apply Now
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPlacement;
