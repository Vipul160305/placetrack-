import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.login(form);
            login({ _id: data._id, name: data.name, email: data.email, role: data.role, branch: data.branch, cgpa: data.cgpa, skills: data.skills, isPlaced: data.isPlaced, resume: data.resume }, data.token);
            toast.success(`Welcome back, ${data.name}!`);
            navigate(`/${data.role}/dashboard`);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const demoAccounts = [
        { label: 'Student', email: 'student@demo.com', pass: 'demo123', color: 'blue' },
        { label: 'TPO', email: 'tpo@demo.com', pass: 'demo123', color: 'violet' },
        { label: 'Admin', email: 'admin@demo.com', pass: 'demo123', color: 'rose' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* BG blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">PlaceTrack</h1>
                    <p className="text-slate-400 mt-1">College Placement Management System</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><span>Sign In</span><ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className="text-slate-500 text-sm text-center mt-4">
                        New student?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>

                {/* Demo accounts */}
                <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Demo Accounts</p>
                    <div className="grid grid-cols-3 gap-2">
                        {demoAccounts.map(acc => (
                            <button
                                key={acc.label}
                                onClick={() => setForm({ email: acc.email, password: acc.pass })}
                                className={`text-center py-2 px-3 rounded-lg border transition-all text-xs font-medium ${acc.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' :
                                        acc.color === 'violet' ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20' :
                                            'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                                    }`}
                            >
                                {acc.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-slate-600 text-xs text-center mt-2">Password: demo123</p>
                </div>
            </div>
        </div>
    );
}
