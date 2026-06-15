import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Landmark, Briefcase, Calendar, BarChart3, GraduationCap } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch platform statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  const { totalStudents, totalFaculty, totalDepartments, totalSubjects, placementStats, attendanceAnalytics, eventStats } = stats;

  return (
    <div className="space-y-8 fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-red-500/10">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-black">Admin Management Panel</h1>
          <p className="text-red-100 text-sm max-w-xl">
            Configure campus directories, departments, courses curriculum, scheduled drives, and check event schedules.
          </p>
        </div>
      </div>

      {/* Numerical Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Enrolled Students</span>
            <strong className="text-2xl font-black text-slate-800 dark:text-white">{totalStudents}</strong>
          </div>
          <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Active Faculty</span>
            <strong className="text-2xl font-black text-slate-800 dark:text-white">{totalFaculty}</strong>
          </div>
          <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Departments</span>
            <strong className="text-2xl font-black text-slate-800 dark:text-white">{totalDepartments}</strong>
          </div>
          <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
            <Landmark className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Curriculum Subjects</span>
            <strong className="text-2xl font-black text-slate-800 dark:text-white">{totalSubjects}</strong>
          </div>
          <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Grid: Placements & Events Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Placements Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors space-y-4">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary-500" /> Placement Drive Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Placement Rate</span>
              <strong className="text-2xl font-black text-green-500">{placementStats.placementPercentage}%</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Job Offers Issued</span>
              <strong className="text-2xl font-black text-slate-800 dark:text-white">{placementStats.offersGranted}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex justify-between uppercase font-bold tracking-wider">
            <span>Drives Scheduled: {placementStats.totalDrives}</span>
            <span>Total applications: {placementStats.totalApplications}</span>
          </div>
        </div>

        {/* Events & Attendance Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors space-y-4">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" /> Attendance & Events Logs
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Daily Attendance</span>
              <strong className="text-2xl font-black text-primary-500">{attendanceAnalytics.avgAttendance}%</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Event Registrations</span>
              <strong className="text-2xl font-black text-slate-800 dark:text-white">{eventStats.totalRegistrations}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex justify-between uppercase font-bold tracking-wider">
            <span>Total Events Held: {eventStats.totalEvents}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
