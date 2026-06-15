import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LayoutDashboard, BookOpen, AlertTriangle, CheckSquare, Sparkles, ChevronRight } from 'lucide-react';

const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/faculty/dashboard');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch faculty dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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
        {error || 'No stats data available'}
      </div>
    );
  }

  const { assignedClassesCount, pendingSubmissionsCount, attendanceMarkedCount, assignedClasses } = data;

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-lg shadow-amber-500/10">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-black">Welcome back, Professor!</h1>
          <p className="text-amber-500/10 bg-transparent text-sm max-w-xl text-amber-50">
            Log student attendances, create exam/assignment sheets, and track class warning sheets.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Assigned Courses</span>
          <strong className="text-3xl font-black">{assignedClassesCount} Classes</strong>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/faculty/assignments')}>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Grading Queue</span>
          <strong className="text-3xl font-black text-amber-500">{pendingSubmissionsCount} Submissions</strong>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Sessions Marked</span>
          <strong className="text-3xl font-black text-green-500">{attendanceMarkedCount} marked</strong>
        </div>
      </div>

      {/* Assigned Subjects Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
        <h3 className="text-base font-extrabold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-500" /> Assigned Curriculum Subjects
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedClasses.length === 0 ? (
            <p className="text-slate-500 text-sm">No classes allocated to your teaching record.</p>
          ) : (
            assignedClasses.map((item) => (
              <div 
                key={item.id}
                className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold rounded uppercase tracking-wider">
                    Section {item.section}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-2 truncate">{item.subject.name}</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Subject Code: {item.subject.code}</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => navigate(`/faculty/attendance?subjectId=${item.subjectId}&section=${item.section}`)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <CheckSquare className="h-4 w-4" /> Attendance
                  </button>
                  <button
                    onClick={() => navigate(`/faculty/marks?subjectId=${item.subjectId}&section=${item.section}`)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <Sparkles className="h-4 w-4" /> Enter Marks
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
