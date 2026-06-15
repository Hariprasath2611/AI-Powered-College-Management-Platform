import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Calendar, FileText, Award, Briefcase, Cpu, ArrowRight,
  TrendingUp, CircleDot, AlertTriangle
} from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/student/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
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

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error || 'No stats data available'}
      </div>
    );
  }

  const { attendancePercentage, pendingAssignments, submittedAssignments, appliedCompaniesCount, gpa, upcomingEvents, student } = stats;

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-primary-500/10">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-black">Welcome back, {student.name}!</h1>
          <p className="text-primary-100 text-sm max-w-xl">
            Here is your academic overview for Semester {student.currentSemester}. Keep track of your attendances, marks, and placement activities.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-primary-200">
            <span>Roll Number: {student.rollNumber}</span>
            <span>•</span>
            <span>Department: {student.department.code}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <div 
          onClick={() => navigate('/student/attendance')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-all">
              <CircleDot className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black">{attendancePercentage}%</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {attendancePercentage < 75 ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Below threshold (75%)
                </span>
              ) : 'Good attendance status'}
            </p>
          </div>
        </div>

        {/* Assignments Card */}
        <div 
          onClick={() => navigate('/student/assignments')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-all">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black">{pendingAssignments}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {submittedAssignments} assignments completed
            </p>
          </div>
        </div>

        {/* GPA Card */}
        <div 
          onClick={() => navigate('/student/marks')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CGPA Score</span>
            <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-105 transition-all">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black">{gpa} / 10</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" /> Academic performance level
            </p>
          </div>
        </div>

        {/* Placement Drives Card */}
        <div 
          onClick={() => navigate('/student/placement')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Drives</span>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-all">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black">{appliedCompaniesCount}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Applied jobs tracker
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Events & AI Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Events Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" /> Upcoming Campus Events
          </h2>
          
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-slate-500 text-sm">No scheduled events found.</p>
            ) : (
              upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:border-primary-500/30 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex flex-col items-center justify-center font-bold">
                    <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg leading-tight">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate text-slate-800 dark:text-slate-200">{event.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">{event.description}</p>
                    <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
                      <span>Venue: {event.venue}</span>
                      <span>•</span>
                      <span>Time: {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Portal Prompt Column */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black tracking-wide">Aegis AI Assistant</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Supercharge your career prep! Analyze your resume ATS compatibility score, start an interactive technical mock interview, or generate personal learning roadmaps.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/ai')}
            className="w-full mt-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all"
          >
            Enter AI Center
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
