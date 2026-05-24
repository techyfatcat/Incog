// src/pages/Resources.jsx
// Updated to include fully functional Subjects tab + Mock Interview

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout, BookOpen, Building2, FileText,
    Map, Code2, TrendingUp, Briefcase, Mic
} from 'lucide-react';

// Preparation OS components
import ResumeBuilder from '../components/PreparationOS/ResumeBuilder';
import OASimulator from '../components/PreparationOS/OASimulator/OASimulator';
import SalaryLab from '../components/PreparationOS/Tools/SalaryLab';
import ToolLayout from "../components/PreparationOS/UI/ToolLayout";
import { ToolCard } from '../components/PreparationOS/UI/Cards';
import InternshipGrid from '../components/PreparationOS/Internships/InternshipGrid';
import CompanyGrid from '../components/PreparationOS/Companies/CompanyGrid';
import CompanyDetails from '../components/PreparationOS/Companies/CompanyDetails';

// Subjects system
import SubjectGrid from '../components/PreparationOS/Subjects/SubjectGrid';
import SubjectDetail from '../components/PreparationOS/Subjects/SubjectDetail';

export default function ResourcesPage() {
    const [view, setView] = useState('hub');
    const [activeTab, setActiveTab] = useState('tools');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const navigate = useNavigate();

    // --- Full-page views ---
    if (view === 'resume-builder') {
        return <ToolLayout><ResumeBuilder onBack={() => setView('hub')} /></ToolLayout>;
    }
    if (view === 'oa-simulator') {
        return <ToolLayout><OASimulator onBack={() => setView('hub')} /></ToolLayout>;
    }
    if (view === 'salary-lab') {
        return <ToolLayout><SalaryLab onBack={() => setView('hub')} /></ToolLayout>;
    }
    if (view === 'internships') {
        return (
            <ToolLayout>
                <div className="pt-10">
                    <button
                        onClick={() => setView('hub')}
                        className="mb-6 ml-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
                    >
                        ← Back to Hub
                    </button>
                    <InternshipGrid />
                </div>
            </ToolLayout>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-[#E5E5E5] dark:bg-[#080B16] transition-colors duration-500">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                {!selectedCompany && !selectedSubject && (
                    <div className="mb-12 text-left animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl font-black mb-4 dark:text-white">
                            Preparation <span className="text-indigo-600">OS</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            Structured prep, no noise.
                        </p>
                    </div>
                )}

                {selectedSubject && !selectedCompany && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl font-black dark:text-white">
                            Preparation <span className="text-indigo-600">OS</span>
                        </h1>
                    </div>
                )}

                {/* Tab Switcher */}
                {!selectedCompany && !selectedSubject && (
                    <div className="flex justify-center mb-16">
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white dark:border-white/10 shadow-xl flex gap-1">
                            {[
                                { id: 'tools', label: 'Tools', icon: <Layout size={18} /> },
                                { id: 'subjects', label: 'Subjects', icon: <BookOpen size={18} /> },
                                { id: 'companies', label: 'Companies', icon: <Building2 size={18} /> },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="transition-all duration-500">

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && !selectedCompany && !selectedSubject && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
                            <ToolCard
                                icon={<FileText size={28} />}
                                title="Resume Builder"
                                desc="Pro A4 Builder with Rich Text support and high-res export."
                                onClick={() => setView('resume-builder')}
                                active
                            />
                            <ToolCard
                                icon={<TrendingUp size={28} className="text-indigo-500" />}
                                title="Salary Trajectory Lab"
                                desc="Calculate in-hand salary (FY 25-26) and 5-year growth paths."
                                onClick={() => setView('salary-lab')}
                                active
                            />
                            <ToolCard
                                icon={<Map size={28} />}
                                title="Pathfinder"
                                desc="Interactive roadmaps for SDE, Data, & DevOps roles."
                            />

                            {/* ── Mock Interview — fully active, navigates to /mock-interview ── */}
                            <ToolCard
                                icon={<Mic size={28} className="text-violet-500" />}
                                title="Mock Interview"
                                desc="AI-powered interviews with live feedback, voice mode, and detailed performance reports."
                                onClick={() => navigate('/mock-interview')}
                                active
                            />

                            <ToolCard
                                icon={<Code2 size={28} className="text-indigo-500" />}
                                title="OA Simulator"
                                desc="Practice real company-style timed coding tests."
                                onClick={() => setView('oa-simulator')}
                                active
                            />
                            <ToolCard
                                icon={<Briefcase size={28} className="text-blue-500" />}
                                title="Internship Hub"
                                desc="Real-time aggregates from top tech companies and startups."
                                onClick={() => setView('internships')}
                                active
                            />
                        </div>
                    )}

                    {/* SUBJECTS TAB */}
                    {activeTab === 'subjects' && !selectedCompany && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            {selectedSubject ? (
                                <SubjectDetail
                                    subject={selectedSubject}
                                    onBack={() => setSelectedSubject(null)}
                                />
                            ) : (
                                <SubjectGrid onSelectSubject={setSelectedSubject} />
                            )}
                        </div>
                    )}

                    {/* COMPANIES TAB */}
                    {activeTab === 'companies' && (
                        <div className="transition-all duration-500">
                            {selectedCompany ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <CompanyDetails
                                        company={selectedCompany}
                                        onBack={() => setSelectedCompany(null)}
                                    />
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <CompanyGrid onSelectCompany={setSelectedCompany} />
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}