import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentAttendance from './pages/Student/StudentAttendance';
import StudentAssignments from './pages/Student/StudentAssignments';
import StudentMarks from './pages/Student/StudentMarks';
import StudentPlacement from './pages/Student/StudentPlacement';
import StudentAI from './pages/Student/StudentAI';
import StudentProfile from './pages/Student/StudentProfile';

// Faculty Pages
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import FacultyAttendance from './pages/Faculty/FacultyAttendance';
import FacultyAssignments from './pages/Faculty/FacultyAssignments';
import FacultyMarks from './pages/Faculty/FacultyMarks';
import FacultyMonitoring from './pages/Faculty/FacultyMonitoring';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminDepartments from './pages/Admin/AdminDepartments';
import AdminAcademics from './pages/Admin/AdminAcademics';
import AdminPlacements from './pages/Admin/AdminPlacements';
import AdminEvents from './pages/Admin/AdminEvents';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:pl-64 min-h-[calc(100vh-4rem)] p-6 bg-slate-50 dark:bg-slate-950/40 transition-colors">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'FACULTY' ? '/faculty' : '/student'} replace /> 
              : <LandingPage />
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'FACULTY' ? '/faculty' : '/student'} replace /> 
              : <LoginPage />
          } 
        />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<AppLayout><StudentDashboard /></AppLayout>} />
          <Route path="/student/attendance" element={<AppLayout><StudentAttendance /></AppLayout>} />
          <Route path="/student/assignments" element={<AppLayout><StudentAssignments /></AppLayout>} />
          <Route path="/student/marks" element={<AppLayout><StudentMarks /></AppLayout>} />
          <Route path="/student/placement" element={<AppLayout><StudentPlacement /></AppLayout>} />
          <Route path="/student/ai" element={<AppLayout><StudentAI /></AppLayout>} />
          <Route path="/student/profile" element={<AppLayout><StudentProfile /></AppLayout>} />
        </Route>

        {/* Protected Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
          <Route path="/faculty" element={<AppLayout><FacultyDashboard /></AppLayout>} />
          <Route path="/faculty/attendance" element={<AppLayout><FacultyAttendance /></AppLayout>} />
          <Route path="/faculty/assignments" element={<AppLayout><FacultyAssignments /></AppLayout>} />
          <Route path="/faculty/marks" element={<AppLayout><FacultyMarks /></AppLayout>} />
          <Route path="/faculty/monitoring" element={<AppLayout><FacultyMonitoring /></AppLayout>} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
          <Route path="/admin/users" element={<AppLayout><AdminUsers /></AppLayout>} />
          <Route path="/admin/departments" element={<AppLayout><AdminDepartments /></AppLayout>} />
          <Route path="/admin/academics" element={<AppLayout><AdminAcademics /></AppLayout>} />
          <Route path="/admin/placements" element={<AppLayout><AdminPlacements /></AppLayout>} />
          <Route path="/admin/events" element={<AppLayout><AdminEvents /></AppLayout>} />
        </Route>

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
