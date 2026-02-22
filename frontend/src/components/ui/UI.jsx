// Stat Card
export function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
    const colors = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
        green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
        violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400',
        rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5 transition-all hover:scale-[1.02]`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                    {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
                </div>
                {Icon && <div className={`p-2.5 rounded-lg bg-slate-800/50`}><Icon size={20} className={colors[color].split(' ').pop()} /></div>}
            </div>
        </div>
    );
}

// Status Badge
const statusColors = {
    Applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Aptitude: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Technical: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    HR: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Selected: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};
export function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
            {status}
        </span>
    );
}

// Loading Spinner
export function Spinner({ size = 'md' }) {
    const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
    return (
        <div className={`${s} border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin`} />
    );
}

// Page Header
export function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-slate-400 mt-0.5 text-sm">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

// Empty State
export function EmptyState({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4"><Icon size={32} className="text-slate-500" /></div>}
            <h3 className="text-slate-300 font-semibold text-lg">{title}</h3>
            {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
    );
}

// Modal
export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// Table
export function Table({ headers, children, empty }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-900 border-b border-slate-800">
                        {headers.map(h => (
                            <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {children || (empty && <tr><td colSpan={headers.length} className="text-center text-slate-500 py-8">{empty}</td></tr>)}
                </tbody>
            </table>
        </div>
    );
}

// Input field helper
export function FormField({ label, required, children }) {
    return (
        <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">
                {label} {required && <span className="text-rose-400">*</span>}
            </label>
            {children}
        </div>
    );
}

export function Input({ className = '', ...props }) {
    return (
        <input
            className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${className}`}
            {...props}
        />
    );
}

export function Select({ className = '', children, ...props }) {
    return (
        <select
            className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20',
        danger: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30',
        ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-300',
        success: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30',
    };
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}
