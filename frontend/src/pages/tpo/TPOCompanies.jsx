import { useEffect, useState } from 'react';
import { companyAPI } from '../../services/api';
import { PageHeader, Modal, Button, FormField, Input, Select, EmptyState, Spinner, StatusBadge } from '../../components/ui/UI';
import { Building2, Plus, Trash2, Edit2, Users, DollarSign, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];
const roundTypes = ['Aptitude', 'Technical', 'HR', 'Group Discussion', 'Coding'];

const defaultForm = {
    companyName: '', role: '', package: '', description: '', location: '',
    minCGPA: '', eligibleBranches: [], requiredSkills: '', rounds: [],
    applicationDeadline: '',
};

export default function TPOCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState(null);
    const [eligStudents, setEligStudents] = useState([]);
    const [eligModal, setEligModal] = useState(null);

    const fetchCompanies = () => {
        companyAPI.getAll()
            .then(res => setCompanies(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(fetchCompanies, []);

    const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
    const openEdit = (c) => {
        setForm({
            companyName: c.companyName, role: c.role, package: c.package,
            description: c.description || '', location: c.location || '',
            minCGPA: c.minCGPA,
            eligibleBranches: c.eligibleBranches || [],
            requiredSkills: (c.requiredSkills || []).join(', '),
            rounds: c.rounds || [],
            applicationDeadline: c.applicationDeadline ? c.applicationDeadline.split('T')[0] : '',
        });
        setEditId(c._id);
        setShowModal(true);
    };

    const toggleBranch = (b) => {
        setForm(prev => ({
            ...prev,
            eligibleBranches: prev.eligibleBranches.includes(b)
                ? prev.eligibleBranches.filter(x => x !== b)
                : [...prev.eligibleBranches, b],
        }));
    };

    const addRound = () => {
        setForm(prev => ({ ...prev, rounds: [...prev.rounds, { name: '', type: 'Technical' }] }));
    };

    const updateRound = (i, field, val) => {
        setForm(prev => {
            const rounds = [...prev.rounds];
            rounds[i] = { ...rounds[i], [field]: val };
            return { ...prev, rounds };
        });
    };

    const removeRound = (i) => {
        setForm(prev => ({ ...prev, rounds: prev.rounds.filter((_, idx) => idx !== i) }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.companyName || !form.role || !form.package || !form.minCGPA) {
            return toast.error('Company name, role, package and min CGPA are required');
        }
        setSaving(true);
        const payload = {
            ...form,
            package: parseFloat(form.package),
            minCGPA: parseFloat(form.minCGPA),
            requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        };
        try {
            if (editId) {
                await companyAPI.update(editId, payload);
                toast.success('Company updated!');
            } else {
                await companyAPI.create(payload);
                toast.success('Company added!');
            }
            setShowModal(false);
            fetchCompanies();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this company?')) return;
        try {
            await companyAPI.delete(id);
            toast.success('Company deleted');
            fetchCompanies();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const viewEligible = async (company) => {
        try {
            const { data } = await companyAPI.getEligibleStudents(company._id);
            setEligStudents(data);
            setEligModal(company);
        } catch (err) {
            toast.error('Failed to load eligible students');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader
                title="Companies"
                subtitle={`${companies.length} companies listed`}
                action={<Button onClick={openAdd}><Plus size={16} /> Add Company</Button>}
            />

            {companies.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={Building2} title="No companies yet" subtitle="Add companies to start the placement process" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {companies.map(company => (
                        <div key={company._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-slate-700 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                                    {company.companyName?.charAt(0)}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(company)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(company._id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-white font-semibold">{company.companyName}</h3>
                            <p className="text-slate-400 text-sm mb-3">{company.role}</p>

                            <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                                <span className="text-emerald-400 font-semibold flex items-center gap-1"><DollarSign size={12} />{company.package} LPA</span>
                                {company.location && <span className="text-slate-400 flex items-center gap-1"><MapPin size={12} />{company.location}</span>}
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {company.eligibleBranches?.map(b => (
                                    <span key={b} className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-md">{b}</span>
                                ))}
                            </div>

                            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-sm">
                                <span className="text-slate-500">Min CGPA: <span className="text-amber-400 font-medium">{company.minCGPA}</span></span>
                                <button onClick={() => viewEligible(company)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs">
                                    <Users size={12} /> Eligible Students
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Company' : 'Add New Company'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Company Name" required>
                            <Input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Google" />
                        </FormField>
                        <FormField label="Job Role" required>
                            <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Software Engineer" />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Package (LPA)" required>
                            <Input type="number" min="0" step="0.5" value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} placeholder="12" />
                        </FormField>
                        <FormField label="Min CGPA" required>
                            <Input type="number" min="0" max="10" step="0.1" value={form.minCGPA} onChange={e => setForm({ ...form, minCGPA: e.target.value })} placeholder="7.5" />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Location">
                            <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bangalore" />
                        </FormField>
                        <FormField label="Application Deadline">
                            <Input type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} />
                        </FormField>
                    </div>
                    <FormField label="Description">
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={2}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                            placeholder="Brief description..."
                        />
                    </FormField>
                    <FormField label="Required Skills (comma separated)">
                        <Input value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, Python" />
                    </FormField>

                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-2">Eligible Branches</p>
                        <div className="flex flex-wrap gap-2">
                            {branches.map(b => (
                                <button type="button" key={b} onClick={() => toggleBranch(b)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${form.eligibleBranches.includes(b) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-400 text-sm font-medium">Interview Rounds</p>
                            <button type="button" onClick={addRound} className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1">
                                <Plus size={12} /> Add Round
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.rounds.map((r, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <Input value={r.name} onChange={e => updateRound(i, 'name', e.target.value)} placeholder={`Round ${i + 1} name`} className="flex-1" />
                                    <Select value={r.type} onChange={e => updateRound(i, 'type', e.target.value)} className="w-36">
                                        {roundTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                                    </Select>
                                    <button type="button" onClick={() => removeRound(i)} className="text-rose-400 hover:text-rose-300 p-1"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={saving}>
                            {saving ? 'Saving...' : editId ? 'Update Company' : 'Add Company'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Eligible Students Modal */}
            <Modal isOpen={!!eligModal} onClose={() => setEligModal(null)} title={`Eligible Students — ${eligModal?.companyName}`}>
                {eligStudents.length === 0 ? (
                    <EmptyState icon={Users} title="No eligible students" subtitle="No students match the requirements" />
                ) : (
                    <div className="space-y-2">
                        {eligStudents.map(s => (
                            <div key={s._id} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                                <div>
                                    <p className="text-white font-medium text-sm">{s.name}</p>
                                    <p className="text-slate-400 text-xs">{s.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-400 text-sm font-bold">{s.cgpa} CGPA</p>
                                    <p className="text-slate-500 text-xs">{s.branch}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
