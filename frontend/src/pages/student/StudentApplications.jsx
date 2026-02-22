import { useEffect, useState } from 'react';
import { applicationAPI } from '../../services/api';
import { PageHeader, StatusBadge, EmptyState, Spinner, Table } from '../../components/ui/UI';
import { FileText } from 'lucide-react';

const roundOrder = ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected'];

function ProgressBar({ status }) {
    if (status === 'Rejected') return null;
    const idx = roundOrder.indexOf(status);
    const steps = ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected'];
    return (
        <div className="flex items-center gap-1 mt-2">
            {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${i <= steps.indexOf(status) ? 'bg-blue-500' : 'bg-slate-700'}`} />
                    {i < steps.length - 1 && <div className={`h-0.5 w-4 ${i < steps.indexOf(status) ? 'bg-blue-500' : 'bg-slate-700'}`} />}
                </div>
            ))}
        </div>
    );
}

export default function StudentApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        applicationAPI.getMine()
            .then(res => setApps(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div>
            <PageHeader title="My Applications" subtitle={`${apps.length} application${apps.length !== 1 ? 's' : ''} submitted`} />

            {apps.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <EmptyState icon={FileText} title="No applications yet" subtitle="Browse eligible companies and apply to track your progress here" />
                </div>
            ) : (
                <div className="space-y-4">
                    {apps.map(app => (
                        <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                                            {app.companyId?.companyName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{app.companyId?.companyName}</h3>
                                            <p className="text-slate-400 text-sm">{app.companyId?.role}</p>
                                        </div>
                                    </div>

                                    <div className="ml-12">
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-1">
                                            <span className="text-emerald-400 font-semibold">{app.companyId?.package} LPA</span>
                                            <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                        {app.status !== 'Rejected' && <ProgressBar status={app.status} />}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge status={app.status} />
                                    {app.currentRound && (
                                        <span className="text-slate-500 text-xs">Round: {app.currentRound}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
