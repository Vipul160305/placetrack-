import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Building2, FileText, User, Users, BarChart3,
    LogOut, GraduationCap, ChevronRight, Bell, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = {
    student: [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/companies', icon: Building2, label: 'Companies' },
        { to: '/student/applications', icon: FileText, label: 'My Applications' },
        { to: '/student/profile', icon: User, label: 'Profile' },
    ],
    tpo: [
        { to: '/tpo/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/tpo/companies', icon: Building2, label: 'Companies' },
        { to: '/tpo/applicants', icon: FileText, label: 'Applicants' },
        { to: '/tpo/students', icon: Users, label: 'Students' },
        { to: '/tpo/analytics', icon: BarChart3, label: 'Analytics' },
    ],
    admin: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Manage Users' },
        { to: '/admin/analytics', icon: BarChart3, label: 'System Analytics' },
    ],
};

const roleBadge = { student: 'bg-blue-500/20 text-blue-400', tpo: 'bg-violet-500/20 text-violet-400', admin: 'bg-rose-500/20 text-rose-400' };

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const items = navItems[user?.role] || [];

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col`}>
                {/* Logo */}
                <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-sm leading-tight">PlaceTrack</p>
                            <p className="text-slate-500 text-xs">Placement System</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {items.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`
                            }
                        >
                            <Icon size={18} className="flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-3 border-t border-slate-800">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-slate-200 text-sm font-medium truncate">{user?.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[user?.role]}`}>
                                    {user?.role?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
                            <span className="text-slate-400 text-sm">Welcome,</span>
                            <span className="text-white text-sm font-medium">{user?.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
