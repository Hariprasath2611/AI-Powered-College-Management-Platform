import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Cpu, AlertTriangle, User, Calendar, CheckSquare } from 'lucide-react';

const FacultyMonitoring = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/faculty/monitoring/alerts');
      setAlerts(response.data.alerts);
    } catch (err) {
      setError('Failed to load student warning metrics.');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Student Warning & Monitoring Console</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Track student performance metrics. Low attendance warnings are triggered automatically for rates below 75%.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
        <h3 className="text-base font-extrabold mb-6 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" /> Critical Attendance Warnings ({alerts.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Roll Number</th>
                <th className="pb-3.5">Student Name</th>
                <th className="pb-3.5">Course Code</th>
                <th className="pb-3.5">Course Title</th>
                <th className="pb-3.5">Section</th>
                <th className="pb-3.5">Attended ratio</th>
                <th className="pb-3.5 text-right pr-2">Attendance Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-505 text-slate-500">All student attendance rates are above the 75% compliance threshold.</td>
                </tr>
              ) : (
                alerts.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-red-500/5 dark:hover:bg-red-950/10 transition-colors">
                    <td className="py-3.5 pl-2">
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-mono font-bold">
                        {alert.rollNumber}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{alert.name}</td>
                    <td className="py-3.5 text-slate-550 dark:text-slate-400 font-mono text-xs">{alert.subjectCode}</td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-450">{alert.subjectName}</td>
                    <td className="py-3.5 text-slate-550 dark:text-slate-450">Sec {alert.section}</td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-450">{alert.presentSessions} / {alert.totalSessions} classes</td>
                    <td className="py-3.5 text-right pr-2 font-black text-red-500">
                      {alert.attendancePercentage}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyMonitoring;
