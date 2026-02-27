import React, { useState } from 'react';
import {
    Layout, BookOpen, Building2, FileText,
    Map, Globe, Code2, Database, TrendingUp
} from 'lucide-react';

// Resume Components
import ResumeBuilder from '../components/PreparationOS/ResumeBuilder';

// Salary Tool Component (Make sure to create this file next!)
import SalaryLab from '../components/PreparationOS/Tools/SalaryLab';

// UI Components
import { ToolCard, SubjectCard } from '../components/PreparationOS/UI/Cards';

// Company Intelligence Components
import CompanyGrid from '../components/PreparationOS/Companies/CompanyGrid';
import CompanyDetails from '../components/PreparationOS/Companies/CompanyDetails';

export default function ResourcesPage() {
    const [view, setView] = useState('hub');
    const [activeTab, setActiveTab] = useState('tools');
    const [selectedCompany, setSelectedCompany] = useState(null);

    // --- Navigation Handlers ---

    // 1. Resume Builder View
    if (view === 'resume-builder') {
        return <ResumeBuilder onBack={() => setView('hub')} />;
    }

    // 2. Salary Trajectory Lab View
    if (view === 'salary-lab') {
        return <SalaryLab onBack={() => setView('hub')} />;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-[#E5E5E5] dark:bg-[#080B16] transition-colors duration-500">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                {!selectedCompany && (
                    <div className="mb-12 text-left animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl font-black mb-4 dark:text-white">
                            Preparation <span className="text-indigo-600">OS</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            Ace your interviews with the ultimate structured intelligence toolkit.
                        </p>
                    </div>
                )}

                {/* Tabs Switcher */}
                {!selectedCompany && (
                    <div className="flex justify-center mb-16">
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white dark:border-white/10 shadow-xl flex gap-1">
                            {[
                                { id: 'tools', label: 'Tools', icon: <Layout size={18} /> },
                                { id: 'subjects', label: 'Subjects', icon: <BookOpen size={18} /> },
                                { id: 'companies', label: 'Companies', icon: <Building2 size={18} /> }
                            ].map((tab) => (
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

                {/* Main Content Area */}
                <div className="transition-all duration-500">

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && !selectedCompany && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
                            <ToolCard
                                icon={<FileText size={28} />}
                                title="Resume Builder"
                                desc="Pro A4 Builder with Rich Text support and high-res export."
                                onClick={() => setView('resume-builder')}
                                active
                            />

                            {/* New Salary Lab Card */}
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

                            <ToolCard
                                icon={<Globe size={28} />}
                                title="Mock Interviews"
                                desc="Practice live with anonymous peers in real-time."
                            />
                        </div>
                    )}

                    {/* SUBJECTS TAB */}
                    {activeTab === 'subjects' && !selectedCompany && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
                            <SubjectCard
                                title="DS & Algorithms"
                                icon={<Code2 className="text-blue-500" />}
                                topics={["Dynamic Programming", "Graph Theory", "Bitmasking", "Recursion"]}
                            />
                            <SubjectCard
                                title="DBMS & SQL"
                                icon={<Database className="text-emerald-500" />}
                                topics={["Indexing", "Normalization", "NoSQL", "Query Optimization"]}
                            />
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
                                    <CompanyGrid onSelect={(company) => setSelectedCompany(company)} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}