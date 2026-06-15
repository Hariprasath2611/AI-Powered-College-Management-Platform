import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Shield, Sparkles, Cpu, Award, Calendar, ArrowRight, Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors text-slate-800 dark:text-slate-100 relative overflow-hidden">
      
      {/* Decorative background vectors */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600 dark:text-primary-500" />
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              AEGIS ACADEMIA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full mb-6 border border-primary-200/35">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Generation Academic ERP
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Empowering Higher Education with{' '}
          <span className="bg-gradient-to-r from-primary-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Artificial Intelligence
          </span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A sleek, SaaS-level college ERP that automates attendance records, grades management, placement trackers, and includes AI career mentors, resume parsers, and mock interview helpers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-base rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all"
          >
            Explore Platform Dashboard
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dashboard Grid Mockup preview */}
        <div className="max-w-5xl mx-auto p-4 bg-white/30 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl backdrop-blur shadow-2xl">
          <div className="h-6 w-full flex items-center gap-1.5 px-2 mb-3">
            <span className="h-3 w-3 bg-red-400 rounded-full" />
            <span className="h-3 w-3 bg-yellow-400 rounded-full" />
            <span className="h-3 w-3 bg-green-400 rounded-full" />
            <span className="text-slate-400 text-[10px] ml-2 font-mono uppercase tracking-wider">Aegis Academia Web Shell</span>
          </div>
          <div className="grid grid-cols-3 gap-4 h-64 sm:h-[400px]">
            <div className="col-span-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 flex flex-col gap-4 text-left">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-5/6" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-2/3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-3/4" />
            </div>
            <div className="col-span-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
                  <div className="h-28 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
                </div>
              </div>
              <div className="h-12 bg-primary-100 dark:bg-primary-950/40 border border-primary-200/35 rounded-xl flex items-center justify-between px-4">
                <div className="h-4 bg-primary-400 rounded-lg w-1/3" />
                <div className="h-6 bg-primary-600 rounded-lg w-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60 dark:border-slate-800/60">
        <h2 className="text-3xl font-extrabold text-center mb-16 tracking-tight">
          Supercharge Student Success with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
            AI Integrations
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl transition-all">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Resume Analyzer</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Upload resumes directly for instant ATS score analysis, skill gap tracking, and tailored feedback recommendations for improvement.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Interview Preparation</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Experience dynamic mock interviews with realistic technical and HR questions. Receive grading scores for communication and confidence.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl hover:shadow-xl transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Career Advisor</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Get targeted learning roadmaps and tech stack recommendations compiled by analyzing subject marks and personal coding preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Summary */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">One Platform, Three Role Portals</h2>
        <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto mb-16">
          Tailored interfaces and dashboards that address specific workflows for Students, Faculty, and Admin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl text-left border border-slate-200/30 dark:border-slate-800/30">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-2">Portal 01</span>
            <h4 className="text-lg font-bold mb-2">Student Module</h4>
            <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <li>• Attendance breakdowns & charts</li>
              <li>• Submit assignments & download materials</li>
              <li>• Review marks sheets & SGPA logs</li>
              <li>• Access placement job boards</li>
            </ul>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl text-left border border-slate-200/30 dark:border-slate-800/30">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-2">Portal 02</span>
            <h4 className="text-lg font-bold mb-2">Faculty Module</h4>
            <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <li>• Mark session attendances</li>
              <li>• Create assignments & side-by-side grading</li>
              <li>• Log internal marks</li>
              <li>• low-attendance alerts tracker</li>
            </ul>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl text-left border border-slate-200/30 dark:border-slate-800/30">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">Portal 03</span>
            <h4 className="text-lg font-bold mb-2">Admin Module</h4>
            <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <li>• Manage Students & Faculty CRUD directories</li>
              <li>• Configure departments, subjects, sections</li>
              <li>• Create drives and log recruiters</li>
              <li>• Publish events and compile QR scans</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Aegis Academia. Designed with clean Tailwind and AI services integrations.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
