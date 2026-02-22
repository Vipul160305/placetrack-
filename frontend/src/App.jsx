import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages - Auth
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages - Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCompanies from './pages/student/StudentCompanies';
import StudentApplications from './pages/student/StudentApplications';
import StudentProfile from './pages/student/StudentProfile';

// Pages - TPO
import TPODashboard from './pages/tpo/TPODashboard';
import TPOCompanies from './pages/tpo/TPOCompanies';
import TPOApplicants from './pages/tpo/TPOApplicants';
import TPOStudents from './pages/tpo/TPOStudents';
import TPOAnalytics from './pages/tpo/TPOAnalytics';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-900"><div className="text-blue-400 text-xl">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={`/${user.role}/dashboard`} replace />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="companies" element={<StudentCompanies />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* TPO Routes */}
      <Route path="/tpo" element={<ProtectedRoute roles={['tpo']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<TPODashboard />} />
        <Route path="companies" element={<TPOCompanies />} />
        <Route path="applicants" element={<TPOApplicants />} />
        <Route path="students" element={<TPOStudents />} />
        <Route path="analytics" element={<TPOAnalytics />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen bg-slate-900 text-white"><div className="text-center"><h1 className="text-4xl font-bold text-red-400 mb-4">403</h1><p className="text-slate-400">You are not authorized to access this page.</p></div></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
