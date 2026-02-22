import { useEffect, useState } from 'react';
import { applicationAPI, companyAPI } from '../../services/api';
import { PageHeader, StatusBadge, Modal, Button, Select, FormField, EmptyState, Spinner } from '../../components/ui/UI';
import { FileText, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const statuses = ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected'];

export default function TPOApplicants() {
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCompany, setFilterCompany] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [updateModal, setUpdateModal] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchAll = async () => {
        try {
            const [appsRes, compRes] = await Promise.all([applicationAPI.getAll(), companyAPI.getAll()]);
            setApps(appsRes.data);
            setCompanies(compRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const openUpdate = (app) => {
        setUpdateModal(app);
        setNewStatus(app.status);
    };

    const handleUpdate = async () => {
        if (!newStatus) return;
        setUpdating(true);
        try {
            await applicationAPI.updateStatus(updateModal._id, { status: newStatus, currentRound: newStatus });
            toast.success('Status updated!');
            setUpdateModal(null);
            fetchAll();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update');
        } finally {
            setUpdating(false);
        }
    };

    const filtered = apps.filter(a => {
        if (filterCompany && a.companyId?._id !== filterCompany) return false;
        if (filterStatus && a.status !== filterStatus) return false;
        return true;
    });

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader title="Applicants" subtitle={`${filtered.length} of ${apps.length} applications`} />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400"><Filter size={14} /> <span className="text-sm font-medium">Filter:</span></div>
                <Select className="w-48" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                    <option value="">All Companies</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
                </Select>
                <Select className="w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                {(filterCompany || filterStatus) && (
                    <Button variant="ghost" size="sm" onClick={() => { setFilterCompany(''); setFilterStatus(''); }}>Clear</Button>
                )}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={FileText} title="No applications found" subtitle="Try adjusting your filters" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900">
                                    {['Student', 'Company', 'Role', 'Package', 'Status', 'Applied On', 'Action'].map(h => (
                                        <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filtered.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-white font-medium">{app.studentId?.name}</p>
                                            <p className="text-slate-500 text-xs">{app.studentId?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{app.companyId?.companyName}</td>
                                        <td className="px-4 py-3 text-slate-400">{app.companyId?.role}</td>
                                        <td className="px-4 py-3 text-emerald-400 font-medium">{app.companyId?.package} LPA</td>
                                        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                                        <td className="px-4 py-3 text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <Button size="sm" variant="ghost" onClick={() => openUpdate(app)}>Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            <Modal isOpen={!!updateModal} onClose={() => setUpdateModal(null)} title="Update Application Status">
                {updateModal && (
                    <div className="space-y-4">
                        <div className="bg-slate-800 rounded-lg p-4">
                            <p className="text-white font-medium">{updateModal.studentId?.name}</p>
                            <p className="text-slate-400 text-sm mt-0.5">{updateModal.companyId?.companyName} — {updateModal.companyId?.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-slate-500 text-xs">Current:</span>
                                <StatusBadge status={updateModal.status} />
                            </div>
                        </div>
                        <FormField label="New Status">
                            <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </FormField>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="flex-1" onClick={() => setUpdateModal(null)}>Cancel</Button>
                            <Button className="flex-1" onClick={handleUpdate} disabled={updating || newStatus === updateModal.status}>
                                {updating ? 'Updating...' : 'Update Status'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
