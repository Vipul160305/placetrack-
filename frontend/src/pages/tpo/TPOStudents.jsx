import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import { PageHeader, EmptyState, Spinner } from '../../components/ui/UI';
import { Users, Search, CheckCircle, XCircle } from 'lucide-react';

export default function TPOStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterBranch, setFilterBranch] = useState('');
    const [filterPlaced, setFilterPlaced] = useState('');

    useEffect(() => {
        userAPI.getAll({ role: 'student' })
            .then(res => setStudents(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const branches = [...new Set(students.map(s => s.branch))].sort();

    const filtered = students.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
        const matchBranch = !filterBranch || s.branch === filterBranch;
        const matchPlaced = filterPlaced === '' ? true : s.isPlaced === (filterPlaced === 'true');
        return matchSearch && matchBranch && matchPlaced;
    });

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader title="Students" subtitle={`${filtered.length} of ${students.length} students`} />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                </div>
                <select
                    value={filterBranch}
                    onChange={e => setFilterBranch(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                >
                    <option value="">All Branches</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select
                    value={filterPlaced}
                    onChange={e => setFilterPlaced(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                >
                    <option value="">All Status</option>
                    <option value="true">Placed</option>
                    <option value="false">Not Placed</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={Users} title="No students found" subtitle="Try adjusting your search or filters" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    {['Name', 'Email', 'Branch', 'CGPA', 'Skills', 'Placement'].map(h => (
                                        <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filtered.map(s => (
                                    <tr key={s._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-violet-500/30 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {s.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{s.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-md border border-blue-500/20">{s.branch}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-bold ${s.cgpa >= 8 ? 'text-emerald-400' : s.cgpa >= 6.5 ? 'text-amber-400' : 'text-rose-400'}`}>{s.cgpa}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {s.skills?.slice(0, 3).map(sk => (
                                                    <span key={sk} className="bg-slate-800 text-slate-400 text-xs px-1.5 py-0.5 rounded">{sk}</span>
                                                ))}
                                                {s.skills?.length > 3 && <span className="text-slate-500 text-xs">+{s.skills.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {s.isPlaced ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                                    <CheckCircle size={13} /> Placed
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500 text-xs">
                                                    <XCircle size={13} /> Seeking
                                                </span>
                                            )}
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
