import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import { PageHeader, EmptyState, Spinner, Button } from '../../components/ui/UI';
import { Users, Search, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const roleBadge = {
    student: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tpo: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    admin: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchUsers = () => {
        userAPI.getAll()
            .then(res => setUsers(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(fetchUsers, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
        setDeleting(id);
        try {
            await userAPI.delete(id);
            toast.success(`User "${name}" deleted`);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = !filterRole || u.role === filterRole;
        return matchSearch && matchRole;
    });

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader
                title="Manage Users"
                subtitle={`${filtered.length} of ${users.length} users`}
            />

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
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                >
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="tpo">TPO</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {['student', 'tpo', 'admin'].map(role => (
                    <div key={role} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Shield size={16} className={role === 'student' ? 'text-blue-400' : role === 'tpo' ? 'text-violet-400' : 'text-rose-400'} />
                        <div>
                            <p className="text-2xl font-bold text-white">{users.filter(u => u.role === role).length}</p>
                            <p className="text-slate-400 text-xs capitalize">{role}s</p>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={Users} title="No users found" subtitle="Try adjusting your search" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    {['User', 'Role', 'Branch', 'CGPA', 'Skills', 'Placed', 'Actions'].map(h => (
                                        <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filtered.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-violet-500/30 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{u.name}</p>
                                                    <p className="text-slate-500 text-xs">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${roleBadge[u.role]}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{u.branch || '—'}</td>
                                        <td className="px-4 py-3">
                                            {u.role === 'student'
                                                ? <span className={`font-bold ${u.cgpa >= 8 ? 'text-emerald-400' : u.cgpa >= 6.5 ? 'text-amber-400' : 'text-slate-400'}`}>{u.cgpa}</span>
                                                : <span className="text-slate-600">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                                                {u.skills?.slice(0, 2).map(s => (
                                                    <span key={s} className="bg-slate-800 text-slate-400 text-xs px-1.5 py-0.5 rounded">{s}</span>
                                                ))}
                                                {u.skills?.length > 2 && <span className="text-slate-500 text-xs">+{u.skills.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {u.role === 'student' ? (
                                                u.isPlaced
                                                    ? <span className="text-emerald-400 flex items-center gap-1 text-xs"><CheckCircle size={12} /> Yes</span>
                                                    : <span className="text-slate-500 flex items-center gap-1 text-xs"><XCircle size={12} /> No</span>
                                            ) : <span className="text-slate-600 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDelete(u._id, u.name)}
                                                disabled={deleting === u._id || u.role === 'admin'}
                                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                title={u.role === 'admin' ? 'Cannot delete admin accounts' : 'Delete user'}
                                            >
                                                {deleting === u._id
                                                    ? <span className="w-4 h-4 border border-rose-400/50 border-t-rose-400 rounded-full animate-spin inline-block" />
                                                    : <Trash2 size={14} />
                                                }
                                            </button>
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
