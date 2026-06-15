import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { logout } from '../../store/slices/authSlice';
import { Sun, Moon, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'FACULTY': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'STUDENT': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="h-6 w-6 text-primary-600 dark:text-primary-500" />
          <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
            AEGIS ACADEMIA
          </span>
        </div>

        {/* Right Side: Options & Profile */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                {user.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
