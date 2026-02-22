import { useEffect, useState } from 'react';
import { companyAPI, applicationAPI } from '../../services/api';
import { PageHeader, EmptyState, Spinner, Button, Modal } from '../../components/ui/UI';
import { Building2, MapPin, DollarSign, Award, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [applied, setApplied] = useState(new Set());
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [compRes, appRes] = await Promise.all([companyAPI.getAll(), applicationAPI.getMine()]);
                setCompanies(compRes.data);
                setApplied(new Set(appRes.data.map(a => a.companyId?._id)));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleApply = async (companyId) => {
        setApplying(companyId);
        try {
            await applicationAPI.apply(companyId);
            setApplied(prev => new Set([...prev, companyId]));
            toast.success('Application submitted successfully!');
            setSelectedCompany(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader
                title="Eligible Companies"
                subtitle={`${companies.length} companies match your profile`}
            />

            {companies.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={Building2} title="No eligible companies" subtitle="Your profile doesn't match current company requirements. Update your CGPA or skills." />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {companies.map(company => {
                        const hasApplied = applied.has(company._id);
                        return (
                            <div key={company._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                                        {company.companyName?.charAt(0)}
                                    </div>
                                    {hasApplied && (
                                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                            <CheckCircle size={10} /> Applied
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-white font-semibold text-lg">{company.companyName}</h3>
                                <p className="text-slate-400 text-sm mb-3">{company.role}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign size={14} className="text-emerald-400" />
                                        <span className="text-emerald-400 font-semibold">{company.package} LPA</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Award size={14} className="text-amber-400" />
                                        <span className="text-slate-400">Min CGPA: <span className="text-amber-400 font-medium">{company.minCGPA}</span></span>
                                    </div>
                                    {company.location && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin size={14} className="text-slate-500" />
                                            <span className="text-slate-400">{company.location}</span>
                                        </div>
                                    )}
                                    {company.applicationDeadline && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={14} className="text-rose-400" />
                                            <span className="text-slate-400">Deadline: <span className="text-rose-400">{new Date(company.applicationDeadline).toLocaleDateString()}</span></span>
                                        </div>
                                    )}
                                </div>

                                {company.requiredSkills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {company.requiredSkills.slice(0, 4).map(s => (
                                            <span key={s} className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-md">{s}</span>
                                        ))}
                                        {company.requiredSkills.length > 4 && <span className="text-slate-500 text-xs">+{company.requiredSkills.length - 4}</span>}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedCompany(company)}>View Details</Button>
                                    {!hasApplied && (
                                        <Button size="sm" className="flex-1" onClick={() => handleApply(company._id)} disabled={applying === company._id}>
                                            {applying === company._id ? 'Applying...' : 'Apply Now'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Company Detail Modal */}
            <Modal isOpen={!!selectedCompany} onClose={() => setSelectedCompany(null)} title={selectedCompany?.companyName || ''}>
                {selectedCompany && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400 text-xs">Role</p>
                                <p className="text-white font-medium mt-0.5">{selectedCompany.role}</p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400 text-xs">Package</p>
                                <p className="text-emerald-400 font-bold mt-0.5">{selectedCompany.package} LPA</p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400 text-xs">Min CGPA</p>
                                <p className="text-amber-400 font-bold mt-0.5">{selectedCompany.minCGPA}</p>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                                <p className="text-slate-400 text-xs">Location</p>
                                <p className="text-white font-medium mt-0.5">{selectedCompany.location || '—'}</p>
                            </div>
                        </div>
                        {selectedCompany.description && (
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">Description</p>
                                <p className="text-slate-300 text-sm bg-slate-800 rounded-lg p-3">{selectedCompany.description}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-2">Eligible Branches</p>
                            <div className="flex flex-wrap gap-1">
                                {selectedCompany.eligibleBranches?.map(b => (
                                    <span key={b} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-md border border-blue-500/20">{b}</span>
                                ))}
                            </div>
                        </div>
                        {selectedCompany.requiredSkills?.length > 0 && (
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-2">Required Skills</p>
                                <div className="flex flex-wrap gap-1">
                                    {selectedCompany.requiredSkills?.map(s => (
                                        <span key={s} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedCompany.rounds?.length > 0 && (
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-2">Interview Rounds</p>
                                <div className="flex flex-col gap-2">
                                    {selectedCompany.rounds.map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                                            <span className="w-6 h-6 bg-slate-700 rounded-full text-xs text-slate-300 flex items-center justify-center font-bold">{i + 1}</span>
                                            <span className="text-slate-300 text-sm">{r.name || r.type}</span>
                                            <span className="ml-auto text-xs text-slate-500">{r.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!applied.has(selectedCompany._id) && (
                            <Button className="w-full" onClick={() => handleApply(selectedCompany._id)} disabled={applying === selectedCompany._id}>
                                {applying === selectedCompany._id ? 'Applying...' : 'Apply Now'}
                            </Button>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
