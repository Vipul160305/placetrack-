import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { PageHeader, Button, FormField, Input, Select, Spinner } from '../../components/ui/UI';
import toast from 'react-hot-toast';
import { User, Save, Upload, X, Plus } from 'lucide-react';

const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];

export default function StudentProfile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: '', branch: 'CSE', cgpa: '', skills: [] });
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                branch: user.branch || 'CSE',
                cgpa: user.cgpa || '',
                skills: user.skills || [],
            });
        }
    }, [user]);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !form.skills.includes(s)) {
            setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name) return toast.error('Name is required');
        if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) return toast.error('CGPA must be 0-10');
        setLoading(true);
        try {
            const payload = { name: form.name, branch: form.branch, cgpa: parseFloat(form.cgpa) || 0, skills: form.skills };
            const { data } = await userAPI.updateMe(payload);
            updateUser(data);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return toast.error('Please select a file');
        setUploading(true);
        const fd = new FormData();
        fd.append('resume', resumeFile);
        try {
            const { data } = await userAPI.uploadResume(fd);
            updateUser(data);
            setResumeFile(null);
            toast.success('Resume uploaded!');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <PageHeader title="My Profile" subtitle="Update your academic and professional information" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-white font-semibold text-lg">{user?.name}</p>
                    <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                    <span className="mt-2 bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30 font-medium">
                        {user?.branch} • CGPA {user?.cgpa}
                    </span>
                    <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${user?.isPlaced ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${user?.isPlaced ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                        {user?.isPlaced ? 'Placed' : 'Seeking Placement'}
                    </div>

                    {/* Resume */}
                    <div className="w-full mt-6 pt-6 border-t border-slate-800">
                        <p className="text-slate-400 text-sm font-medium mb-3">Resume</p>
                        {user?.resume ? (
                            <a
                                href={`/uploads/${user.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 text-sm hover:text-blue-300 underline block mb-3"
                            >
                                View Current Resume
                            </a>
                        ) : (
                            <p className="text-slate-500 text-xs mb-3">No resume uploaded</p>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="resume-upload"
                            className="hidden"
                            onChange={e => setResumeFile(e.target.files[0])}
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg transition-all border border-slate-700">
                            <Upload size={14} /> Choose File
                        </label>
                        {resumeFile && (
                            <div className="mt-2">
                                <p className="text-slate-400 text-xs truncate">{resumeFile.name}</p>
                                <Button size="sm" className="w-full mt-2" onClick={handleResumeUpload} disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Upload Resume'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-300 font-semibold mb-6">Edit Information</h3>
                    <form onSubmit={handleSave} className="space-y-5">
                        <FormField label="Full Name" required>
                            <Input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Your full name"
                            />
                        </FormField>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-1.5">Email Address</label>
                            <Input value={user?.email || ''} disabled className="opacity-50 cursor-not-allowed" />
                            <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Branch">
                                <Select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </Select>
                            </FormField>
                            <FormField label="CGPA">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    value={form.cgpa}
                                    onChange={e => setForm({ ...form, cgpa: e.target.value })}
                                    placeholder="8.5"
                                />
                            </FormField>
                        </div>

                        <FormField label="Skills">
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="Add a skill and press Enter"
                                />
                                <Button type="button" variant="ghost" size="md" onClick={addSkill}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                            {form.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/20">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="text-blue-400/60 hover:text-blue-300 transition-colors">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </FormField>

                        <div className="pt-2">
                            <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={16} />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
