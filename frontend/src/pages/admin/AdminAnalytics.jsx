import { useEffect, useState } from 'react';
import { analyticsAPI, userAPI } from '../../services/api';
import { PageHeader, StatCard, Spinner } from '../../components/ui/UI';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    ArcElement, PointElement, LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Users, CheckCircle, TrendingUp, DollarSign, Building2, BarChart3,
    FileText, Shield, Activity, PieChart,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const chartDefaults = {
    plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
    scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
    },
};

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            analyticsAPI.get(),
            userAPI.getAll(),
        ])
            .then(([analyticsRes, usersRes]) => {
                setStats(analyticsRes.data);
                setUsers(usersRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!stats) return <p className="text-slate-400">Failed to load analytics.</p>;

    // Derived data
    const studentCount = users.filter(u => u.role === 'student').length;
    const tpoCount = users.filter(u => u.role === 'tpo').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    // --- Chart Data ---

    // 1. User Role Distribution (Doughnut)
    const roleDistributionData = {
        labels: ['Students', 'TPO', 'Admin'],
        datasets: [{
            data: [studentCount, tpoCount, adminCount],
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
        }],
    };

    // 2. Placement Overview (Doughnut)
    const placementPieData = {
        labels: ['Placed', 'Not Placed'],
        datasets: [{
            data: [stats.placedStudents, stats.totalStudents - stats.placedStudents],
            backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(71, 85, 105, 0.7)'],
            borderColor: ['rgba(34, 197, 94, 1)', 'rgba(71, 85, 105, 1)'],
            borderWidth: 2,
        }],
    };

    // 3. Application Status (Doughnut)
    const statusData = {
        labels: Object.keys(stats.applicationsByStatus || {}),
        datasets: [{
            label: 'Applications',
            data: Object.values(stats.applicationsByStatus || {}),
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(6, 182, 212, 0.7)',
                'rgba(34, 197, 94, 0.7)',
                'rgba(239, 68, 68, 0.7)',
            ],
            borderWidth: 0,
        }],
    };

    // 4. Branch-wise Bar Chart
    const branchLabels = stats.branchWise?.map(b => b._id) || [];
    const branchTotals = stats.branchWise?.map(b => b.total) || [];
    const branchPlaced = stats.branchWise?.map(b => b.placed) || [];

    const branchBarData = {
        labels: branchLabels,
        datasets: [
            {
                label: 'Total Students',
                data: branchTotals,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: 'Placed',
                data: branchPlaced,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    return (
        <div>
            <PageHeader title="System Analytics" subtitle="Complete system-wide analytics and performance metrics" />

            {/* Key Metrics Row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <StatCard title="Total Users" value={users.length} icon={Users} color="blue" />
                <StatCard title="Students" value={studentCount} icon={Users} color="violet" />
                <StatCard title="Placed" value={stats.placedStudents} icon={CheckCircle} color="green" />
                <StatCard title="Placement %" value={`${stats.placementPercentage}%`} icon={TrendingUp} color="amber" />
                <StatCard title="Companies" value={stats.totalCompanies} icon={Building2} color="blue" />
                <StatCard title="Applications" value={stats.totalApplications} icon={FileText} color="rose" />
            </div>

            {/* Key Metrics Row 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Avg Package" value={`${stats.averagePackage} LPA`} icon={DollarSign} color="violet" />
                <StatCard title="Highest Package" value={`${stats.highestPackage} LPA`} icon={TrendingUp} color="rose" />
                <StatCard title="TPO Officers" value={tpoCount} icon={Shield} color="violet" />
                <StatCard title="System Admins" value={adminCount} icon={Shield} color="rose" />
            </div>

            {/* Charts Row 1: Branch-wise + User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Branch-wise Bar Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 size={16} /> Branch-wise Placement
                    </h3>
                    {branchLabels.length > 0 ? (
                        <Bar data={branchBarData} options={{
                            ...chartDefaults,
                            responsive: true,
                            plugins: { ...chartDefaults.plugins, title: { display: false } },
                        }} />
                    ) : (
                        <p className="text-slate-500 text-center py-8">No branch data available</p>
                    )}
                </div>

                {/* User Role Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                        <PieChart size={16} /> User Distribution
                    </h3>
                    <div className="flex items-center justify-center">
                        <div style={{ maxHeight: '200px', width: '200px' }}>
                            <Doughnut
                                data={roleDistributionData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16 } },
                                    },
                                    cutout: '65%',
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xl font-bold text-blue-400">{studentCount}</p>
                            <p className="text-slate-500 text-xs">Students</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-violet-400">{tpoCount}</p>
                            <p className="text-slate-500 text-xs">TPO</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-rose-400">{adminCount}</p>
                            <p className="text-slate-500 text-xs">Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Placement Overview + Application Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Placement Overview Doughnut */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                        <Activity size={16} /> Placement Overview
                    </h3>
                    <div className="flex items-center justify-center">
                        <div style={{ maxHeight: '200px', width: '200px' }}>
                            <Doughnut
                                data={placementPieData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16 } },
                                    },
                                    cutout: '65%',
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-4xl font-bold text-emerald-400">{stats.placementPercentage}%</p>
                        <p className="text-slate-400 text-sm">Overall Placement Rate</p>
                    </div>
                </div>

                {/* Application Status Breakdown */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                        <FileText size={16} /> Application Pipeline
                    </h3>
                    {Object.keys(stats.applicationsByStatus || {}).length > 0 ? (
                        <Doughnut
                            data={statusData}
                            options={{
                                responsive: true,
                                plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 12 } } },
                            }}
                        />
                    ) : (
                        <p className="text-slate-500 text-center py-8">No application data</p>
                    )}
                </div>
            </div>

            {/* Branch Performance Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 size={16} /> Branch Performance
                </h3>
                <div className="space-y-3">
                    {stats.branchWise?.map(row => {
                        const pct = row.total > 0 ? Math.round((row.placed / row.total) * 100) : 0;
                        return (
                            <div key={row._id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300 font-medium">{row._id}</span>
                                    <span className="text-slate-400">
                                        {row.placed}/{row.total} •{' '}
                                        <span className={`font-bold ${pct >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {pct}%
                                        </span>
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${pct >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
