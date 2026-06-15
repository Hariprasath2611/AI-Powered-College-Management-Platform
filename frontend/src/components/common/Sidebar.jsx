import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, Calendar, FileText, Award, Briefcase, 
  Cpu, User, Users, Landmark, BookOpen, CalendarPlus 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const getLinks = (role) => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
          { name: 'Attendance', path: '/student/attendance', icon: Calendar },
          { name: 'Assignments', path: '/student/assignments', icon: FileText },
          { name: 'Marks & GPA', path: '/student/marks', icon: Award },
          { name: 'Placements', path: '/student/placement', icon: Briefcase },
          { name: 'AI Center', path: '/student/ai', icon: Cpu },
          { name: 'My Profile', path: '/student/profile', icon: User },
        ];
      case 'FACULTY':
        return [
          { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
          { name: 'Mark Attendance', path: '/faculty/attendance', icon: Calendar },
          { name: 'Assignments', path: '/faculty/assignments', icon: FileText },
          { name: 'Grading & Marks', path: '/faculty/marks', icon: Award },
          { name: 'Monitoring Alerts', path: '/faculty/monitoring', icon: Cpu },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'User Directory', path: '/admin/users', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Landmark },
          { name: 'Academics', path: '/admin/academics', icon: BookOpen },
          { name: 'Placements Drive', path: '/admin/placements', icon: Briefcase },
          { name: 'Events Planner', path: '/admin/events', icon: CalendarPlus },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(user.role);

  return (
    <aside className="w-64 fixed left-0 bottom-0 top-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors hidden md:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/student' || link.path === '/faculty' || link.path === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
