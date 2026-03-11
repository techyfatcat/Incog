import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, Shield, ArrowLeft } from 'lucide-react';

import TestInterface from './TestInterface';
import TestResult from './TestResult';

const OASimulator = ({ onBack }) => {
    const [view, setView] = useState('dashboard');
    const [activeTest, setActiveTest] = useState(null);
    const [testResults, setTestResults] = useState(null);

    // ✅ Scroll to top whenever view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const handleStart = (test) => {
        setActiveTest(test);
        setView('test');
    };

    const handleFinish = (results) => {
        setTestResults(results);
        setView('result');
    };

    // DASHBOARD VIEW
    if (view === 'dashboard') {

        const tests = [
            { id: 1, company: "Amazon", title: "SDE-1 Mock OA", time: 90, format: "2 Coding + 20 MCQ", difficulty: "Medium" },
            { id: 2, company: "Microsoft", title: "New Grad Assessment", time: 70, format: "3 Coding", difficulty: "Hard" },
            { id: 3, company: "Generic", title: "DSA Speed Training", time: 45, format: "15 MCQ + 1 Coding", difficulty: "Easy" },
        ];

        return (
            <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] text-slate-900 dark:text-white p-8">

                <div className="max-w-6xl mx-auto">

                    <header className="mb-12">

                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Resources
                        </button>

                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black tracking-tighter mb-2"
                        >
                            OA <span className="text-indigo-500">SIMULATOR</span>
                        </motion.h1>

                        <p className="text-slate-600 dark:text-slate-400">
                            Sharpen your blades in a realistic company assessment environment.
                        </p>

                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* TEST CARDS */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">

                            {tests.map(test => (

                                <motion.div
                                    key={test.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-[#111827] border border-black/5 dark:border-white/5 p-6 rounded-[2rem] group relative overflow-hidden"
                                >

                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30">
                                        <Code2 size={60} />
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">

                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                            {test.company}
                                        </span>

                                        <span
                                            className={`text-[10px] font-bold ${test.difficulty === 'Hard'
                                                    ? 'text-red-500'
                                                    : 'text-amber-500'
                                                }`}
                                        >
                                            {test.difficulty}
                                        </span>

                                    </div>

                                    <h3 className="text-xl font-bold mb-2">
                                        {test.title}
                                    </h3>

                                    <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                                        <div>{test.time} Minutes</div>
                                        <div>{test.format}</div>
                                    </div>

                                    <button
                                        onClick={() => handleStart(test)}
                                        className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all"
                                    >
                                        <Play size={16} className="inline mr-2" />
                                        START MISSION
                                    </button>

                                </motion.div>

                            ))}

                        </div>

                        {/* SECURITY PANEL */}
                        <div className="lg:col-span-4 space-y-6">

                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2rem]">

                                <h4 className="text-indigo-500 font-black text-sm mb-4 uppercase">
                                    <Shield size={16} className="inline mr-2" />
                                    Security Protocol
                                </h4>

                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                    <li>• Tab switching detection active.</li>
                                    <li>• Copy-Paste disabled.</li>
                                </ul>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // TEST VIEW
    if (view === 'test') {
        return (
            <TestInterface
                test={activeTest}
                onFinish={handleFinish}
                onExit={() => setView('dashboard')}
            />
        );
    }

    // RESULT VIEW
    if (view === 'result') {
        return (
            <TestResult
                {...testResults}
                testTitle={activeTest.title}
                onRetry={() => setView('dashboard')}
                onExit={() => setView('dashboard')}
            />
        );
    }
};

export default OASimulator;

