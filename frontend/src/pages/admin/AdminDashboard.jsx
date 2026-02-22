import { useEffect, useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { StatCard, PageHeader, Spinner } from '../../components/ui/UI';
import { Users, Building2, TrendingUp, DollarSign, CheckCircle, FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsAPI.get()
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader title="Admin Dashboard" subtitle="System-wide overview and statistics" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} color="blue" />
                <StatCard title="Total Companies" value={stats?.totalCompanies ?? 0} icon={Building2} color="violet" />
                <StatCard title="Placed Students" value={stats?.placedStudents ?? 0} icon={CheckCircle} color="green" />
                <StatCard title="Placement Rate" value={`${stats?.placementPercentage ?? 0}%`} icon={TrendingUp} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <StatCard title="Total Applications" value={stats?.totalApplications ?? 0} icon={FileText} color="blue" />
                <StatCard title="Avg Package" value={`${stats?.averagePackage ?? 0} LPA`} icon={DollarSign} color="violet" />
                <StatCard title="Highest Package" value={`${stats?.highestPackage ?? 0} LPA`} icon={TrendingUp} color="rose" />
            </div>

            {/* Admin Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Link to="/admin/users"
                    className="bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 rounded-xl p-5 hover:scale-[1.02] transition-all">
                    <Users size={24} className="text-blue-400 mb-3" />
                    <h3 className="text-white font-semibold">Manage Users</h3>
                    <p className="text-slate-400 text-sm mt-1">View, search, and delete user accounts</p>
                </Link>
                <div className="bg-gradient-to-br from-violet-500/20 to-rose-500/20 border border-slate-700 rounded-xl p-5">
                    <BarChart3 size={24} className="text-violet-400 mb-3" />
                    <h3 className="text-white font-semibold">System Statistics</h3>
                    <p className="text-slate-400 text-sm mt-1">
                        {stats?.totalStudents} students · {stats?.totalCompanies} companies · {stats?.totalApplications} applications
                    </p>
                </div>
            </div>

            {/* Application status breakdown */}
            {stats?.applicationsByStatus && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4">Application Status Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {Object.entries(stats.applicationsByStatus).map(([status, count]) => {
                            const colors = {
                                Applied: 'blue', Aptitude: 'amber', Technical: 'violet',
                                HR: 'rose', Selected: 'green', Rejected: 'rose',
                            };
                            return (
                                <div key={status} className="bg-slate-800 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-white">{count}</p>
                                    <p className="text-slate-400 text-xs mt-1">{status}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
