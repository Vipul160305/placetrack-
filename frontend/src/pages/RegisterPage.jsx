import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, User, BookOpen, Star, ChevronDown } from 'lucide-react';

const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', branch: 'CSE', cgpa: '', skills: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) return toast.error('CGPA must be between 0 and 10');

        setLoading(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                branch: form.branch,
                cgpa: form.cgpa ? parseFloat(form.cgpa) : 0,
                skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            };
            const { data } = await authAPI.register(payload);
            login({ _id: data._id, name: data.name, email: data.email, role: data.role, branch: data.branch, cgpa: data.cgpa, skills: data.skills, isPlaced: data.isPlaced }, data.token);
            toast.success('Account created successfully!');
            navigate('/student/dashboard');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">PlaceTrack</h1>
                    <p className="text-slate-400 mt-1">Student Registration</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Full Name <span className="text-rose-400">*</span></label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="John Doe" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Email Address <span className="text-rose-400">*</span></label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="you@college.edu" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Password <span className="text-rose-400">*</span></label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="Min. 6 characters" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-1.5">Branch</label>
                                <div className="relative">
                                    <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-1.5">CGPA</label>
                                <div className="relative">
                                    <Star size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        placeholder="8.5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Skills <span className="text-slate-600 text-xs">(comma separated)</span></label>
                            <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="React, Node.js, Python..." />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20">
                            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-slate-500 text-sm text-center mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
