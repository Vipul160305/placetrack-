import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI, companyAPI } from '../../services/api';
import { StatCard, StatusBadge, PageHeader, EmptyState, Spinner } from '../../components/ui/UI';
import { FileText, Building2, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [appsRes, compRes] = await Promise.all([applicationAPI.getMine(), companyAPI.getAll()]);
                setApps(appsRes.data);
                setCompanies(compRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const selected = apps.filter(a => a.status === 'Selected').length;
    const active = apps.filter(a => !['Rejected', 'Selected'].includes(a.status)).length;

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader
                title={`Welcome, ${user?.name} 👋`}
                subtitle="Here's your placement journey overview"
            />

            {/* Placement Banner */}
            {user?.isPlaced && (
                <div className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                    <div>
                        <p className="text-emerald-400 font-semibold">🎉 Congratulations! You are placed!</p>
                        <p className="text-slate-400 text-sm">Your hard work has paid off. Keep going!</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Eligible Companies" value={companies.length} icon={Building2} color="blue" />
                <StatCard title="Applications" value={apps.length} icon={FileText} color="violet" />
                <StatCard title="Active Rounds" value={active} icon={TrendingUp} color="amber" />
                <StatCard title="Offers Received" value={selected} icon={CheckCircle} color="green" />
            </div>

            {/* Profile summary + Recent applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4">Your Profile</h3>
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Branch</span>
                            <span className="text-white font-medium">{user?.branch}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">CGPA</span>
                            <span className="text-emerald-400 font-bold">{user?.cgpa}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Status</span>
                            <span className={`font-medium ${user?.isPlaced ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {user?.isPlaced ? 'Placed ✓' : 'Seeking'}
                            </span>
                        </div>
                    </div>
                    {user?.skills?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800">
                            <p className="text-slate-400 text-xs mb-2">Skills</p>
                            <div className="flex flex-wrap gap-1">
                                {user.skills.map(s => (
                                    <span key={s} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-lg border border-blue-500/20">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Applications */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-300 font-semibold">Recent Applications</h3>
                        <Link to="/student/applications" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {apps.length === 0 ? (
                        <EmptyState icon={FileText} title="No applications yet" subtitle="Apply to companies to track your progress here" />
                    ) : (
                        <div className="space-y-3">
                            {apps.slice(0, 5).map(app => (
                                <div key={app._id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
                                    <div>
                                        <p className="text-white font-medium text-sm">{app.companyId?.companyName}</p>
                                        <p className="text-slate-400 text-xs">{app.companyId?.role} • {app.companyId?.package} LPA</p>
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
