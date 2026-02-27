import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Plus, Linkedin, Mail, Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ResumeToolbar from './Resume/ResumeToolbar';
import { TemplateModern, TemplateMinimal, TemplateProfessional } from './Resume/ResumeTemplates';

export default function ResumeBuilder({ onBack }) {
    const [step, setStep] = useState('select-template');
    const [selectedTemplate, setSelectedTemplate] = useState(1);
    const [photo, setPhoto] = useState(null);
    const fileInputRef = useRef(null);
    const resumePreviewRef = useRef(null);

    const [resumeStyles, setResumeStyles] = useState({
        fontFamily: 'font-sans',
        accentColor: '#4f46e5',
        fontSize: '13px',
    });

    const [resumeData, setResumeData] = useState({
        name: "Your Name",
        role: "Software Engineer",
        email: "hello@example.com",
        linkedin: "linkedin.com/in/username",
        skills: "**React**, Tailwind, Node.js\n- System Design\n- AWS Cloud",
        experience: "**Senior Developer @ TechCorp** (2022-Present)\n- Led a team of 5 to rebuild the core API.\n- Reduced latency by 40% using Redis.\n\n**Junior Dev @ Startup** (2020-2022)\n- Shipped 10+ features.",
        education: "**B.Tech in Computer Science**\nUniversity of Technology (2016-2020)"
    });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const downloadResume = async (format = 'pdf') => {
        const element = resumePreviewRef.current;
        if (!element) return;

        try {
            // THE FIX: Capture the element at its actual A4 size (794px) 
            // regardless of how small it looks on your screen.
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: 794,
                height: 1123,
                windowWidth: 794 // Forces renderer to treat it as full size
            });

            const imgData = canvas.toDataURL("image/png");
            if (format === 'image') {
                const link = document.createElement('a');
                link.download = `Resume_${resumeData.name}.png`;
                link.href = imgData;
                link.click();
            } else {
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                pdf.save(`${resumeData.name}_Resume.pdf`);
            }
        } catch (error) {
            console.error("Export Error:", error);
            alert("Export failed. Try removing any high-res external images.");
        }
    };

    if (step === 'select-template') {
        return (
            <div className="min-h-screen py-20 px-6 bg-[#E5E5E5] dark:bg-[#080B16]">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-all">
                    <ArrowLeft size={20} /> Back to Hub
                </button>
                <h2 className="text-4xl font-black mb-12 text-center dark:text-white">Select a <span className="text-indigo-600">Template</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { id: 1, name: 'The Executive', color: 'bg-indigo-500' },
                        { id: 2, name: 'The Minimalist', color: 'bg-slate-900' },
                        { id: 3, name: 'The Professional', color: 'bg-blue-600' }
                    ].map(t => (
                        <div key={t.id} onClick={() => { setSelectedTemplate(t.id); setStep('edit'); }} className="bg-white dark:bg-white/5 p-4 rounded-[32px] cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all group">
                            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 flex items-center justify-center">
                                <span className="text-xs font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-all">Preview {t.name}</span>
                            </div>
                            <h3 className="font-bold text-center dark:text-white">{t.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6 bg-[#E5E5E5] dark:bg-[#05070A]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setStep('select-template')} className="flex items-center gap-2 text-slate-500 font-bold">
                        <ArrowLeft size={20} /> Change Template
                    </button>
                    <ResumeToolbar styles={resumeStyles} setStyles={setResumeStyles} onDownload={downloadResume} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: FORM */}
                    <div className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-[40px] border border-white dark:border-white/10 shadow-xl">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border-2 border-dashed border-indigo-500/30">
                                    {photo ? <img src={photo} className="w-full h-full object-cover" /> : <Camera className="text-indigo-500/50" />}
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={handlePhotoUpload} />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white">Profile Photo</h3>
                                <p className="text-xs text-slate-500">Professional headshot</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Name" value={resumeData.name} onChange={v => setResumeData({ ...resumeData, name: v })} />
                            <InputField label="Role" value={resumeData.role} onChange={v => setResumeData({ ...resumeData, role: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Email" value={resumeData.email} onChange={v => setResumeData({ ...resumeData, email: v })} />
                            <InputField label="LinkedIn" value={resumeData.linkedin} onChange={v => setResumeData({ ...resumeData, linkedin: v })} />
                        </div>
                        <TextField label="Skills (Use **bold** and - bullets)" value={resumeData.skills} onChange={v => setResumeData({ ...resumeData, skills: v })} />
                        <TextField label="Experience" value={resumeData.experience} onChange={v => setResumeData({ ...resumeData, experience: v })} />
                        <TextField label="Education" value={resumeData.education} onChange={v => setResumeData({ ...resumeData, education: v })} />
                    </div>

                    {/* RIGHT: A4 PREVIEW */}
                    <div className="sticky top-12 flex flex-col items-center">
                        <div className="bg-slate-400 dark:bg-slate-800 p-4 rounded-xl shadow-inner w-full flex justify-center overflow-hidden">
                            <div className="origin-top scale-[0.55] sm:scale-[0.65] md:scale-[0.75] lg:scale-[0.8]">
                                <div
                                    ref={resumePreviewRef}
                                    style={{ width: '794px', height: '1123px' }}
                                    className="bg-white shadow-2xl overflow-hidden"
                                >
                                    {selectedTemplate === 1 && <TemplateModern data={resumeData} photo={photo} styles={resumeStyles} />}
                                    {selectedTemplate === 2 && <TemplateMinimal data={resumeData} photo={photo} styles={resumeStyles} />}
                                    {selectedTemplate === 3 && <TemplateProfessional data={resumeData} photo={photo} styles={resumeStyles} />}
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">A4 Live Layout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, onChange }) {
    return (
        <div className="flex flex-col text-left gap-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{label}</label>
            <input value={value} onChange={e => onChange(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:ring-2 ring-indigo-500 transition-all" />
        </div>
    );
}

function TextField({ label, value, onChange }) {
    return (
        <div className="flex flex-col text-left gap-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{label}</label>
            <textarea rows="4" value={value} onChange={e => onChange(e.target.value)} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:ring-2 ring-indigo-500 transition-all resize-none" />
        </div>
    );
}