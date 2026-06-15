import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Calendar, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';

const StudentAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/student/attendance');
        setData(response.data);
      } catch (err) {
        setError('Failed to load attendance logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error || 'No attendance logs available.'}
      </div>
    );
  }

  const { attendanceSummary, recentLogs } = data;

  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return 'text-green-500 bg-green-500';
    if (percentage >= 75) return 'text-primary-500 bg-primary-500';
    return 'text-red-500 bg-red-500';
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Subject-wise Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Verify your session attendances and maintain above 75% to avoid warnings.</p>
        </div>
      </div>

      {/* Grid: Subject Cards with Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {attendanceSummary.map((subject) => {
          const colorClass = getPercentageColor(subject.percentage).split(' ');
          return (
            <div 
              key={subject.subjectId}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={subject.subjectName}>
                    {subject.subjectName}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{subject.subjectCode}</span>
                </div>
                <span className={`text-xl font-black ${colorClass[0]}`}>
                  {subject.percentage}%
                </span>
              </div>

              {/* Custom Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${colorClass[1]}`} 
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Classes Held: {subject.total}</span>
                <span className="font-semibold">Attended: {subject.present}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table: Recent Session Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary-500" /> Recent Attendance Sessions Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Date</th>
                <th className="pb-3.5">Period</th>
                <th className="pb-3.5">Subject Code</th>
                <th className="pb-3.5">Subject Title</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right pr-2">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">No session logs logged in yet.</td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2 font-medium">
                      {new Date(log.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5">Hour {log.period}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold">
                        {log.subject.code}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">{log.subject.name}</td>
                    <td className="py-3.5">
                      {log.status === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1 text-green-500 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-semibold">
                          <XCircle className="h-4 w-4" /> Absent
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right pr-2 text-slate-500 dark:text-slate-400">{log.markedByFaculty.name}</td>
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

export default StudentAttendance;
