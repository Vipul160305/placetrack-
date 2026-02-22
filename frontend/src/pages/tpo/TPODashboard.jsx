import { useEffect, useState } from 'react';
import { analyticsAPI, companyAPI, userAPI } from '../../services/api';
import { StatCard, PageHeader, Spinner } from '../../components/ui/UI';
import { Users, Building2, TrendingUp, DollarSign, CheckCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TPODashboard() {
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
            <PageHeader title="TPO Dashboard" subtitle="Placement overview and quick actions" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} color="blue" />
                <StatCard title="Placed Students" value={stats?.placedStudents ?? 0} icon={CheckCircle} color="green" />
                <StatCard title="Placement %" value={`${stats?.placementPercentage ?? 0}%`} icon={TrendingUp} color="violet" subtitle={`${stats?.placedStudents}/${stats?.totalStudents}`} />
                <StatCard title="Total Companies" value={stats?.totalCompanies ?? 0} icon={Building2} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <StatCard title="Avg Package" value={`${stats?.averagePackage ?? 0} LPA`} icon={DollarSign} color="blue" />
                <StatCard title="Highest Package" value={`${stats?.highestPackage ?? 0} LPA`} icon={TrendingUp} color="green" />
                <StatCard title="Total Applications" value={stats?.totalApplications ?? 0} icon={BarChart3} color="violet" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'Add Company', sub: 'Post a new job opening', to: '/tpo/companies', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
                    { title: 'View Applicants', sub: 'Manage application rounds', to: '/tpo/applicants', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30' },
                    { title: 'Analytics', sub: 'View branch-wise placement data', to: '/tpo/analytics', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
                ].map(item => (
                    <Link key={item.to} to={item.to} className={`bg-gradient-to-br ${item.color} border rounded-xl p-5 hover:scale-[1.02] transition-all`}>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{item.sub}</p>
                    </Link>
                ))}
            </div>

            {/* Branch-wise placed table */}
            {stats?.branchWise && stats.branchWise.length > 0 && (
                <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4">Branch-wise Placement Summary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800">
                                    <th className="text-left py-2 font-medium">Branch</th>
                                    <th className="text-center py-2 font-medium">Total</th>
                                    <th className="text-center py-2 font-medium">Placed</th>
                                    <th className="text-center py-2 font-medium">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats.branchWise.map(row => (
                                    <tr key={row._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-2.5 text-white font-medium">{row._id}</td>
                                        <td className="py-2.5 text-slate-400 text-center">{row.total}</td>
                                        <td className="py-2.5 text-emerald-400 text-center font-medium">{row.placed}</td>
                                        <td className="py-2.5 text-center">
                                            <span className={`text-xs font-semibold ${row.total > 0 && (row.placed / row.total) >= 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {row.total > 0 ? Math.round((row.placed / row.total) * 100) : 0}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
