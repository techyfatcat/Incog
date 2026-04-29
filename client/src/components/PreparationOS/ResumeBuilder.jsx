import React, { useState, useRef, useCallback } from 'react';
import {
    ArrowLeft, Camera, Download, ChevronDown, ChevronUp,
    Palette, Type, Layout, Eye, EyeOff, Plus, Minus, Check
} from 'lucide-react';
import { TemplateExecutive, TemplateATS, TemplateCreative } from './Resume/ResumeTemplates';
import { exportResumeToPDF } from './Resume/exportPDF';

// ─── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATES = [
    {
        id: 'executive',
        name: 'Executive',
        tag: 'SDE / Senior Roles',
        desc: 'Dark sidebar, structured layout. Ideal for engineering and management.',
        preview: 'sidebar'
    },
    {
        id: 'ats',
        name: 'ATS Clean',
        tag: 'Max ATS Score',
        desc: 'Single-column, zero clutter. Passes every applicant tracking system.',
        preview: 'single'
    },
    {
        id: 'creative',
        name: 'Creative',
        tag: 'Product / Design',
        desc: 'Bold header band, two-column body. Stands out for creative roles.',
        preview: 'bold'
    },
];

const ACCENT_COLORS = [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Violet', value: '#7c3aed' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Slate', value: '#334155' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Emerald', value: '#059669' },
];

const FONT_OPTIONS = [
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Helvetica', value: 'Helvetica Neue, Arial, sans-serif' },
    { label: 'Garamond', value: 'Garamond, Times New Roman, serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Optima', value: 'Optima, Candara, sans-serif' },
];

const SECTIONS_META = [
    { key: 'summary', label: 'Professional Summary', placeholder: 'A brief 2-3 sentence overview of your professional background and goals.', type: 'text' },
    { key: 'experience', label: 'Experience', placeholder: '**Senior Developer @ TechCorp** (2022–Present)\n- Led team of 5 to rebuild core API.\n- Reduced latency by 40% using Redis.\n\n**Junior Dev @ Startup** (2020–2022)\n- Shipped 10+ features end-to-end.', type: 'textarea' },
    { key: 'education', label: 'Education', placeholder: '**B.Tech in Computer Science**\nUniversity of Technology (2016–2020)\nCGPA: 8.7/10', type: 'textarea' },
    { key: 'skills', label: 'Skills', placeholder: '**Languages:** JavaScript, Python, Go\n**Frameworks:** React, Node.js, FastAPI\n- System Design\n- AWS, Docker, Kubernetes', type: 'textarea' },
    { key: 'projects', label: 'Projects', placeholder: '**Incog Platform** — React, Node.js, MongoDB\n- Anonymous social network with 2k+ users.\n- Built real-time feed with Socket.IO.', type: 'textarea' },
    { key: 'certifications', label: 'Certifications', placeholder: '- AWS Solutions Architect Associate (2023)\n- Google Cloud Professional (2022)', type: 'textarea' },
    { key: 'languages', label: 'Languages', placeholder: 'English (Fluent)\nHindi (Native)\nGerman (Conversational)', type: 'textarea' },
];

const DEFAULT_DATA = {
    name: 'Your Name',
    role: 'Software Engineer',
    email: 'hello@example.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/username',
    website: 'yourportfolio.dev',
    location: 'Bengaluru, India',
    summary: '',
    experience: '**Senior Developer @ TechCorp** (2022–Present)\n- Led a team of 5 to rebuild the core API.\n- Reduced latency by 40% using Redis caching.\n\n**Junior Dev @ Startup** (2020–2022)\n- Shipped 10+ features end-to-end.',
    education: '**B.Tech in Computer Science**\nUniversity of Technology (2016–2020)',
    skills: '**Languages:** JavaScript, Python, Go\n**Frameworks:** React, Node.js\n- AWS Cloud\n- System Design',
    projects: '',
    certifications: '',
    languages: '',
};

const DEFAULT_STYLES = {
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    accentColor: '#4f46e5',
    sidebarColor: '#0F172A',
    fontSize: '13px',
};

// ─── Template Select Screen ─────────────────────────────────────────────────────
function TemplateSelectScreen({ onSelect }) {
    return (
        <div className="min-h-screen pt-20 pb-16 px-6 bg-[#E5E5E5] dark:bg-[#080B16]">
            <div className="max-w-5xl mx-auto">
                <div className="mb-14 text-center">
                    <p className="text-indigo-500 font-bold text-sm uppercase tracking-widest mb-3">Resume Builder</p>
                    <h2 className="text-4xl font-black dark:text-white mb-3">
                        Pick your <span className="text-indigo-600">Template</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base">Industry-standard layouts, fully customisable after selection.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => onSelect(t.id)}
                            className="group text-left bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-5 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 focus:outline-none"
                        >
                            {/* Preview illustration */}
                            <div className="aspect-[3/4] rounded-2xl mb-5 overflow-hidden bg-slate-50 dark:bg-white/5 relative">
                                <TemplateThumbnail type={t.preview} />
                            </div>

                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-black text-lg dark:text-white group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                                </div>
                                <span className="mt-0.5 px-2 py-1 text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0 ml-2">{t.tag}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TemplateThumbnail({ type }) {
    if (type === 'sidebar') return (
        <div className="flex h-full">
            <div className="w-[35%] bg-slate-800 h-full p-3">
                <div className="w-full aspect-square rounded-lg bg-white/10 mb-3" />
                {[70, 50, 80, 40, 65].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-white/20 mb-2" style={{ width: `${w}%` }} />
                ))}
            </div>
            <div className="flex-1 p-3">
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-white/10 rounded mb-2" />
                <div className="h-1.5 w-1/2 bg-indigo-400/40 rounded mb-4" />
                {[100, 80, 90, 60, 75, 85, 70].map((w, i) => (
                    <div key={i} className="h-1 rounded-full bg-slate-200 dark:bg-white/10 mb-1.5" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );

    if (type === 'single') return (
        <div className="p-5 h-full">
            <div className="h-4 w-2/3 bg-slate-800 dark:bg-white/20 rounded mb-2" />
            <div className="h-2 w-1/3 bg-indigo-400/50 rounded mb-4" />
            <div className="h-0.5 w-full bg-indigo-500/30 rounded mb-4" />
            {[90, 70, 85, 60, 80, 65, 75, 55, 70, 80].map((w, i) => (
                <div key={i} className="h-1 rounded-full bg-slate-200 dark:bg-white/10 mb-2" style={{ width: `${w}%` }} />
            ))}
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="bg-indigo-600/80 p-4">
                <div className="h-5 w-2/3 bg-white/30 rounded mb-2" />
                <div className="h-2 w-1/3 bg-white/20 rounded" />
            </div>
            <div className="bg-slate-800 px-4 py-1.5 flex gap-3">
                {[40, 30, 50].map((w, i) => (
                    <div key={i} className="h-1 rounded-full bg-white/20" style={{ width: `${w}%` }} />
                ))}
            </div>
            <div className="flex flex-1 p-3 gap-3">
                <div className="flex-[2] space-y-1.5">
                    {[100, 80, 90, 70, 85].map((w, i) => (
                        <div key={i} className="h-1 rounded-full bg-slate-200 dark:bg-white/10" style={{ width: `${w}%` }} />
                    ))}
                </div>
                <div className="flex-1 space-y-1.5">
                    {[100, 70, 85, 60].map((w, i) => (
                        <div key={i} className="h-1 rounded-full bg-slate-200 dark:bg-white/10" style={{ width: `${w}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}


// ─── Main Editor ───────────────────────────────────────────────────────────────
export default function ResumeBuilder({ onBack }) {
    const [step, setStep] = useState('select');
    const [template, setTemplate] = useState('executive');
    const [data, setData] = useState(DEFAULT_DATA);
    const [styles, setStyles] = useState(DEFAULT_STYLES);
    const [photo, setPhoto] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [activePanel, setActivePanel] = useState('content'); // 'content' | 'style'
    const [collapsedSections, setCollapsedSections] = useState({ projects: true, certifications: true, languages: true });
    const [hiddenSections, setHiddenSections] = useState({});

    const fileInputRef = useRef(null);
    const resumeRef = useRef(null);

    const setField = useCallback((key, val) => setData(d => ({ ...d, [key]: val })), []);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setPhoto(reader.result);
        reader.readAsDataURL(file);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportResumeToPDF(resumeRef.current, `${data.name}_Resume`);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setExporting(false), 2000);
        }
    };

    const toggleSection = (key) => setCollapsedSections(s => ({ ...s, [key]: !s[key] }));
    const toggleHide = (key) => setHiddenSections(s => ({ ...s, [key]: !s[key] }));

    if (step === 'select') {
        return (
            <div>
                <div className="px-6 pt-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-500 transition-colors text-sm">
                        <ArrowLeft size={16} /> Back to Hub
                    </button>
                </div>
                <TemplateSelectScreen onSelect={(id) => { setTemplate(id); setStep('edit'); }} />
            </div>
        );
    }

    const TemplateComponent = template === 'executive' ? TemplateExecutive
        : template === 'ats' ? TemplateATS
            : TemplateCreative;

    const visibleData = { ...data };
    Object.keys(hiddenSections).forEach(k => { if (hiddenSections[k]) visibleData[k] = ''; });

    return (
        <div className="min-h-screen bg-[#E5E5E5] dark:bg-[#05070A] pb-16">

            {/* Top bar */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#080B16]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 py-3 flex items-center justify-between">
                <button
                    onClick={() => setStep('select')}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-500 transition-colors text-sm"
                >
                    <ArrowLeft size={16} /> Change Template
                </button>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    {[
                        { id: 'content', icon: <Type size={14} />, label: 'Content' },
                        { id: 'style', icon: <Palette size={14} />, label: 'Style' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePanel(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePanel === tab.id
                                    ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                    <Download size={14} />
                    {exporting ? 'Preparing...' : 'Export PDF'}
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 pt-8 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">

                {/* ── LEFT PANEL ─────────────────────────────────────────── */}
                <div className="space-y-4">

                    {/* CONTENT PANEL */}
                    {activePanel === 'content' && (
                        <div className="space-y-4">
                            {/* Photo + basic info */}
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Basic Info</h3>

                                <div className="flex items-center gap-5 mb-6">
                                    <div
                                        className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-dashed border-indigo-500/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors relative group"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {photo
                                            ? <img src={photo} className="w-full h-full object-cover" alt="profile" />
                                            : <Camera size={22} className="text-indigo-400/50 group-hover:text-indigo-500 transition-colors" />
                                        }
                                        {photo && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Camera size={18} className="text-white" />
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">Profile Photo</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Optional · JPG or PNG</p>
                                        {photo && (
                                            <button onClick={() => setPhoto(null)} className="text-xs text-rose-500 font-bold mt-1 hover:underline">Remove</button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Full Name" value={data.name} onChange={v => setField('name', v)} />
                                    <Field label="Role / Title" value={data.role} onChange={v => setField('role', v)} />
                                    <Field label="Email" value={data.email} onChange={v => setField('email', v)} />
                                    <Field label="Phone" value={data.phone} onChange={v => setField('phone', v)} />
                                    <Field label="LinkedIn" value={data.linkedin} onChange={v => setField('linkedin', v)} />
                                    <Field label="Website" value={data.website} onChange={v => setField('website', v)} />
                                    <div className="col-span-2">
                                        <Field label="Location" value={data.location} onChange={v => setField('location', v)} />
                                    </div>
                                </div>
                            </div>

                            {/* Sections */}
                            {SECTIONS_META.map(sec => (
                                <SectionEditor
                                    key={sec.key}
                                    meta={sec}
                                    value={data[sec.key]}
                                    onChange={v => setField(sec.key, v)}
                                    collapsed={!!collapsedSections[sec.key]}
                                    hidden={!!hiddenSections[sec.key]}
                                    onToggleCollapse={() => toggleSection(sec.key)}
                                    onToggleHide={() => toggleHide(sec.key)}
                                />
                            ))}
                        </div>
                    )}

                    {/* STYLE PANEL */}
                    {activePanel === 'style' && (
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-7">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Appearance</h3>

                            {/* Accent color */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Accent Color</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {ACCENT_COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            title={c.label}
                                            onClick={() => setStyles(s => ({ ...s, accentColor: c.value }))}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                                            style={{ background: c.value, boxShadow: styles.accentColor === c.value ? `0 0 0 3px ${c.value}40, 0 0 0 5px white` : 'none' }}
                                        >
                                            {styles.accentColor === c.value && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </button>
                                    ))}
                                    <div className="flex items-center gap-2 ml-1">
                                        <input
                                            type="color"
                                            value={styles.accentColor}
                                            onChange={e => setStyles(s => ({ ...s, accentColor: e.target.value }))}
                                            className="w-8 h-8 rounded-xl cursor-pointer border-0 p-0.5 bg-transparent"
                                            title="Custom color"
                                        />
                                        <span className="text-[10px] text-slate-400 font-bold">Custom</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar color (Executive only) */}
                            {template === 'executive' && (
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Sidebar Color</label>
                                    <div className="flex gap-2.5">
                                        {['#0F172A', '#1e1b4b', '#111827', '#1a1a2e', '#0d1b2a'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setStyles(s => ({ ...s, sidebarColor: c }))}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                                                style={{ background: c, boxShadow: styles.sidebarColor === c ? `0 0 0 3px ${c}60, 0 0 0 5px white` : 'none' }}
                                            >
                                                {styles.sidebarColor === c && <Check size={12} className="text-white" strokeWidth={3} />}
                                            </button>
                                        ))}
                                        <input
                                            type="color"
                                            value={styles.sidebarColor || '#0F172A'}
                                            onChange={e => setStyles(s => ({ ...s, sidebarColor: e.target.value }))}
                                            className="w-8 h-8 rounded-xl cursor-pointer border-0 p-0.5 bg-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Font */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Font Family</label>
                                <div className="space-y-2">
                                    {FONT_OPTIONS.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => setStyles(s => ({ ...s, fontFamily: f.value }))}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${styles.fontFamily === f.value
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-slate-200 dark:border-white/10 dark:text-white hover:border-indigo-500/40'
                                                }`}
                                        >
                                            <span style={{ fontFamily: f.value }}>{f.label}</span>
                                            {styles.fontFamily === f.value && <Check size={14} className="text-indigo-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Template switcher shortcut */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Switch Template</label>
                                <div className="space-y-2">
                                    {TEMPLATES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTemplate(t.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${template === t.id
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-slate-200 dark:border-white/10 dark:text-white hover:border-indigo-500/40'
                                                }`}
                                        >
                                            <span>{t.name}</span>
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400">{t.tag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: A4 PREVIEW ───────────────────────────────────── */}
                <div className="xl:sticky xl:top-20 self-start">
                    <div className="flex flex-col items-center">
                        {/* Preview label */}
                        <div className="w-full flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live A4 Preview</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {TEMPLATES.find(t => t.id === template)?.name}
                            </span>
                        </div>

                        {/* Shadow tray */}
                        <div
                            className="w-full bg-slate-500 dark:bg-slate-900 rounded-2xl shadow-inner overflow-hidden flex justify-center items-start p-4"
                            style={{ minHeight: '580px' }}
                        >
                            {/* Scale wrapper — scales the 794px A4 to fit the container */}
                            <div
                                className="origin-top"
                                style={{
                                    transform: 'scale(var(--preview-scale, 0.65))',
                                    transformOrigin: 'top center',
                                    // Set the CSS variable via a style tag approach
                                }}
                            >
                                <PreviewScaler>
                                    <div
                                        ref={resumeRef}
                                        style={{ width: '794px', height: '1123px', background: '#fff', overflow: 'hidden' }}
                                        className="shadow-2xl"
                                    >
                                        <TemplateComponent data={visibleData} photo={photo} styles={styles} />
                                    </div>
                                </PreviewScaler>
                            </div>
                        </div>

                        <p className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            794 × 1123 px · A4 · PDF-ready
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Scales the preview to fit the available width
function PreviewScaler({ children }) {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.6);

    React.useEffect(() => {
        const obs = new ResizeObserver(entries => {
            for (const entry of entries) {
                const w = entry.contentRect.width;
                // 794px is the A4 width; leave some padding
                setScale(Math.min((w - 32) / 794, 0.85));
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full">
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                height: `${1123 * scale}px`,
                // The child is 794px wide — center it
                display: 'flex',
                justifyContent: 'center',
            }}>
                {children}
            </div>
        </div>
    );
}


// ─── Section editor card ────────────────────────────────────────────────────────
function SectionEditor({ meta, value, onChange, collapsed, hidden, onToggleCollapse, onToggleHide }) {
    return (
        <div className={`bg-white dark:bg-white/[0.03] border rounded-3xl overflow-hidden transition-all ${hidden ? 'border-slate-200 dark:border-white/5 opacity-50' : 'border-slate-200 dark:border-white/10'
            }`}>
            <div className="flex items-center justify-between px-5 py-4">
                <button
                    onClick={onToggleCollapse}
                    className="flex items-center gap-2 font-bold text-sm dark:text-white flex-1 text-left"
                >
                    {collapsed ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
                    {meta.label}
                </button>
                <button
                    onClick={onToggleHide}
                    title={hidden ? 'Show section' : 'Hide section'}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ml-2"
                >
                    {hidden
                        ? <EyeOff size={13} className="text-slate-400" />
                        : <Eye size={13} className="text-slate-400" />
                    }
                </button>
            </div>

            {!collapsed && !hidden && (
                <div className="px-5 pb-5">
                    {meta.type === 'text' ? (
                        <input
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={meta.placeholder}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-white/20"
                        />
                    ) : (
                        <textarea
                            rows={5}
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={meta.placeholder}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-white/20 font-mono leading-relaxed"
                        />
                    )}
                    <p className="mt-2 text-[10px] text-slate-400">
                        Use <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 rounded">**bold**</span> and{' '}
                        <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 rounded">- bullets</span>
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Simple input field ────────────────────────────────────────────────────────
function Field({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all"
            />
        </div>
    );
}