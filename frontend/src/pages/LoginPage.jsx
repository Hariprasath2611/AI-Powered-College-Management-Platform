import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import api from '../services/api';
import { Shield, Mail, Lock, LogIn, Chrome, HelpCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    dispatch(loginStart());
    try {
      // For real implementation: authenticate email with Firebase SDK first to get ID Token:
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const idToken = await userCredential.user.getIdToken();
      //
      // In development / mock mode, we simulate Firebase by sending a mock token
      const mockToken = email.includes('admin') 
        ? 'mock-token-admin' 
        : email.includes('faculty') 
          ? 'mock-token-faculty' 
          : 'mock-token-student';

      const response = await api.post('/auth/login', { token: mockToken });
      const { token, user } = response.data;
      
      dispatch(loginSuccess({ token, user }));
      redirectToDashboard(user.role);
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.error || err.message));
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  const handleQuickLogin = async (role) => {
    dispatch(loginStart());
    try {
      const mockToken = `mock-token-${role.toLowerCase()}`;
      const response = await api.post('/auth/login', { token: mockToken });
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));
      redirectToDashboard(user.role);
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.error || err.message));
      setErrorMessage(err.response?.data?.error || err.message);
    }
  };

  const redirectToDashboard = (role) => {
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'FACULTY') navigate('/faculty');
    else navigate('/student');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-950 px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 dark:bg-slate-950/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/80 p-8 rounded-3xl shadow-2xl z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-3">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            AEGIS ACADEMIA
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            AI-Powered College Management Platform
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-primary-400 hover:text-primary-300 hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <LogIn className="h-4.5 w-4.5" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs font-medium text-slate-500">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          onClick={() => handleQuickLogin('student')}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 mb-6 transition-all"
        >
          <Chrome className="h-4.5 w-4.5 text-primary-500" />
          Google Login
        </button>

        {/* Developer Quick Bypass Panel */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Quick Test Bypass Accounts
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold uppercase transition-all"
            >
              Student
            </button>
            <button
              onClick={() => handleQuickLogin('faculty')}
              className="py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-amber-400 text-[10px] font-bold uppercase transition-all"
            >
              Faculty
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold uppercase transition-all"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
