import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, ShieldCheck, PieChart, Coins } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(val);

const calculateTax = (annualCTC) => {
    const stdDeduction = 75000;
    const taxableIncome = Math.max(0, annualCTC - stdDeduction);
    if (taxableIncome <= 1200000) return 0;

    let tax = 0;
    const slabs = [
        { l: 400000, r: 0.00 },
        { l: 800000, r: 0.05 },
        { l: 1200000, r: 0.10 },
        { l: 1600000, r: 0.15 },
        { l: 2000000, r: 0.20 },
        { l: 2400000, r: 0.25 },
        { l: Infinity, r: 0.30 },
    ];

    let prevLimit = 0;
    for (let slab of slabs) {
        if (taxableIncome > slab.l) {
            tax += (slab.l - prevLimit) * slab.r;
            prevLimit = slab.l;
        } else {
            tax += (taxableIncome - prevLimit) * slab.r;
            break;
        }
    }
    return tax * 1.04;
};

export default function SalaryTrajectoryLab({ onBack }) {
    const [ctc, setCtc] = useState(0);
    const [hike, setHike] = useState(10); // Default hike to make the graph visible
    const [isMonthly, setIsMonthly] = useState(true);

    const stats = useMemo(() => {
        const annualBasic = ctc * 0.50;
        const annualPF = ctc > 0 ? Math.min(annualBasic * 0.12, 21600) : 0;
        const annualTax = calculateTax(ctc);
        const profTax = ctc > 0 ? 2500 : 0;
        const annualNet = Math.max(0, ctc - (annualPF + annualTax + profTax));

        let trajectory = [];
        let tempCTC = ctc || 0;
        for (let i = 0; i < 5; i++) {
            // We plot the Yearly Val on the graph for a better growth curve
            trajectory.push({
                year: `Year ${i + 1}`,
                val: Math.round(tempCTC)
            });
            tempCTC *= (1 + hike / 100);
        }

        return { annualBasic, annualPF, annualTax, annualNet, trajectory };
    }, [ctc, hike]);

    const displayVal = (val) => formatCurrency(isMonthly ? val / 12 : val);

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] text-slate-700 dark:text-slate-300 transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors mb-4">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Salary <span className="text-indigo-600">Lab</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">FY 2025-26 Tax Regime Insights</p>
                    </div>

                    <div className="flex bg-white/40 dark:bg-white/5 p-1 rounded-2xl border border-white/20 dark:border-white/10 backdrop-blur-md">
                        <button onClick={() => setIsMonthly(true)} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${isMonthly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}>Monthly</button>
                        <button onClick={() => setIsMonthly(false)} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${!isMonthly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}>Yearly</button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Input Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white/60 dark:bg-white/[0.03] border border-white/40 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-indigo-500/5">
                            <div className="flex items-center gap-2 mb-8">
                                <Coins className="text-indigo-600" size={18} />
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Parameters</label>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-3">Annual CTC</span>
                                    <input
                                        type="number"
                                        placeholder="Enter CTC"
                                        value={ctc === 0 ? "" : ctc}
                                        onChange={(e) => setCtc(Number(e.target.value))}
                                        className="w-full bg-transparent border-b-2 border-slate-300 dark:border-white/10 py-2 text-3xl font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition-colors"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Expected Hike</span>
                                        <span className="text-indigo-600 font-bold">{hike}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="50" value={hike}
                                        onChange={(e) => setHike(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-300 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-600/20 dark:border-indigo-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
                                <span className="font-bold text-slate-900 dark:text-white text-sm">Tax Optimizer</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                CTC under <span className="font-bold text-indigo-600">₹12.75L</span> is tax-free in the new regime (post-deduction).
                            </p>
                        </div>
                    </div>

                    {/* Right: Results Panel */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white/80 dark:bg-white/[0.03] border border-white dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
                            <div className="mb-12 text-center md:text-left">
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">{isMonthly ? 'Estimated Take-Home' : 'Annual Net Income'}</span>
                                <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white mt-4 tracking-tighter">
                                    {displayVal(stats.annualNet)}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 border-t border-slate-200 dark:border-white/5 pt-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <PieChart className="text-slate-400" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Breakdown</span>
                                    </div>
                                    <ul className="space-y-4">
                                        <BreakdownRow label="Basic Salary" value={displayVal(stats.annualBasic)} />
                                        <BreakdownRow label="Allowances" value={displayVal(Math.max(0, ctc - stats.annualBasic - stats.annualPF))} />
                                        <BreakdownRow label="Provident Fund" value={displayVal(stats.annualPF)} color="text-amber-600" isDeduction />
                                        <BreakdownRow label="Income Tax" value={displayVal(stats.annualTax)} color="text-rose-600" isDeduction />
                                    </ul>
                                </div>

                                {/* Recharts Area Chart */}
                                <div className="h-56 w-full space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="text-indigo-600" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">5-Year Growth Trajectory</span>
                                    </div>

                                    <div className="h-full w-full">
                                        <ResponsiveContainer width="100%" height="90%">
                                            <AreaChart data={stats.trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                                <defs>
                                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>

                                                {/* Visible X-Axis with Year mapping */}
                                                <XAxis
                                                    dataKey="year"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                                    dy={10}
                                                />

                                                <YAxis hide={true} domain={['dataMin - 100000', 'dataMax + 100000']} />

                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1e293b',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        color: '#fff',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                                                    formatter={(val) => [formatCurrency(val), "Projected CTC"]}
                                                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke="#6366f1"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorGrowth)"
                                                    animationDuration={1500}
                                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BreakdownRow({ label, value, color = "text-slate-900 dark:text-white", isDeduction = false }) {
    return (
        <li className="flex justify-between items-center group">
            <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">{label}</span>
            <span className={`text-sm font-bold font-mono ${color}`}>
                {isDeduction && "- "}{value}
            </span>
        </li>
    );
}