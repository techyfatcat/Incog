
import React, { useState, useEffect } from "react";

export default function TestInterface({ test, onExit, onFinish }) {
    const totalTime = (test?.time || 0) * 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    // SECURITY + TIMER
    useEffect(() => {
        const preventAction = (e) => e.preventDefault();

        document.addEventListener("copy", preventAction);
        document.addEventListener("paste", preventAction);

        const handleVisibility = () => {
            if (document.hidden) {
                alert("⚠️ Tab switching detected.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            document.removeEventListener("copy", preventAction);
            document.removeEventListener("paste", preventAction);
            document.removeEventListener("visibilitychange", handleVisibility);
            clearInterval(timer);
        };
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const submitTest = () => {
        if (onFinish) {
            onFinish({
                score: Math.floor(Math.random() * 100),
                timeTaken: totalTime - timeLeft
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#0F172A] text-white flex flex-col select-none">

            {/* HEADER */}
            <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#111827]">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black tracking-widest text-indigo-500 uppercase">
                        {test?.company} Simulation
                    </span>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <span className={`font-mono font-bold ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-emerald-500"}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onExit}
                        className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        Quit
                    </button>

                    <button
                        onClick={submitTest}
                        className="px-6 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-lg shadow-lg shadow-indigo-500/20"
                    >
                        Submit Test
                    </button>
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex overflow-hidden">

                {/* QUESTION PANEL */}
                <div className="w-1/3 border-r border-white/5 overflow-y-auto p-8 bg-[#0F172A]">

                    <span className="text-[10px] font-black text-indigo-500 uppercase">
                        Question {currentQuestion}
                    </span>

                    <h2 className="text-2xl font-bold mt-2 mb-6">
                        Find Minimum Swaps
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        Given an array of n integers, find the minimum number of swaps
                        required to sort the array in ascending order.
                    </p>

                    <div className="bg-black/30 p-4 rounded-xl font-mono text-xs mt-4 border border-white/5">
                        Input: [4,3,2,1] <br />
                        Output: 2 <br />
                        Explanation: Swap (4,1) then (3,2)
                    </div>
                </div>

                {/* CODE EDITOR AREA */}
                <div className="flex-1 flex flex-col bg-[#1E1E1E]">

                    <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-white/5">
                        <select className="bg-transparent text-xs font-bold outline-none text-slate-300 cursor-pointer">
                            <option>C++ (GCC 11)</option>
                            <option>Java 17</option>
                            <option>Python 3.10</option>
                        </select>
                    </div>

                    <div className="flex-1 font-mono text-sm p-6 text-emerald-500/80">
                        // Write your code here...
                    </div>
                </div>
            </div>

            {/* QUESTION NAVIGATOR */}
            <div className="h-16 border-t border-white/5 px-6 flex items-center bg-[#111827]">

                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((q) => (
                        <button
                            key={q}
                            onClick={() => setCurrentQuestion(q)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentQuestion === q
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                                }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}

