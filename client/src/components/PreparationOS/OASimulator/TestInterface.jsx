
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function TestInterface({ test, onExit, onFinish }) {

    const totalTime = (test?.time || 0) * 60;

    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    const [code, setCode] = useState("// Write your code here");
    const [language, setLanguage] = useState("cpp");

    const [activeTab, setActiveTab] = useState("input");

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    // TIMER
    useEffect(() => {

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s} `;
    };

    const submitTest = () => {
        if (onFinish) {
            onFinish({
                score: Math.floor(Math.random() * 100),
                timeTaken: totalTime - timeLeft
            });
        }
    };

    const runCode = () => {

        setOutput("Running...");

        setTimeout(() => {
            setOutput("Example Output:\n2");
        }, 1000);

    };

    return (

        <div className="fixed inset-0 z-[200] flex flex-col bg-[#e5e5e5] dark:bg-[#080B16]">

            {/* HEADER */}

            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]">

                <div className="flex items-center gap-4">

                    <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                        {test?.company} Simulation
                    </span>

                    <span className="font-mono font-bold text-emerald-500">
                        {formatTime(timeLeft)}
                    </span>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={onExit}
                        className="px-4 py-1 text-xs font-bold text-slate-600 hover:text-black dark:text-slate-400"
                    >
                        Quit
                    </button>

                    <button
                        onClick={submitTest}
                        className="px-6 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg"
                    >
                        Submit
                    </button>

                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="flex flex-1 overflow-hidden">

                {/* PROBLEM PANEL */}

                <div className="w-1/3 border-r border-slate-200 dark:border-white/10 p-8 bg-white dark:bg-[#080B16] overflow-y-auto">

                    <span className="text-xs font-bold text-indigo-600 uppercase">
                        Question {currentQuestion}
                    </span>

                    <h2 className="text-2xl font-bold mt-3 mb-6 dark:text-white">
                        Minimum Swaps to Sort
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Given an array of integers, find the minimum number of swaps required
                        to sort the array in ascending order.
                    </p>

                    <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-black/30 text-xs font-mono">

                        Input:
                        <br />
                        [4,3,2,1]

                        <br /><br />

                        Output:
                        <br />
                        2

                    </div>

                </div>


                {/* EDITOR PANEL */}

                <div className="flex-1 flex flex-col bg-[#1E1E1E]">

                    {/* EDITOR HEADER */}

                    <div className="h-10 flex items-center justify-between px-4 bg-[#252526]">

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="text-xs bg-[#1e1e1e] text-white px-2 py-1 rounded"
                        >
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>

                        <button
                            onClick={runCode}
                            className="px-4 py-1 text-xs bg-indigo-600 text-white rounded-md"
                        >
                            Run Code
                        </button>

                    </div>


                    {/* MONACO EDITOR */}

                    <Editor
                        height="60%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                    />


                    {/* TERMINAL PANEL */}

                    <div className="flex flex-col border-t border-black bg-black text-green-400">

                        {/* TABS */}

                        <div className="flex text-xs border-b border-gray-800">

                            <button
                                onClick={() => setActiveTab("input")}
                                className={`px - 4 py - 2 ${activeTab === "input" ? "bg-gray-900" : ""} `}
                            >
                                Custom Input
                            </button>

                            <button
                                onClick={() => setActiveTab("output")}
                                className={`px - 4 py - 2 ${activeTab === "output" ? "bg-gray-900" : ""} `}
                            >
                                Output
                            </button>

                        </div>


                        {/* CONTENT */}

                        {activeTab === "input" && (

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter custom input here"
                                className="h-24 bg-black text-white text-xs p-3 outline-none"
                            />

                        )}

                        {activeTab === "output" && (

                            <div className="h-24 text-xs p-3 overflow-auto">
                                {output || "Program output will appear here"}
                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* QUESTION NAVIGATOR */}

            <div className="h-16 flex items-center px-6 gap-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]">

                {[1, 2, 3, 4, 5].map(q => (

                    <button
                        key={q}
                        onClick={() => setCurrentQuestion(q)}
                        className={`w - 10 h - 10 rounded - lg font - bold text - sm ${currentQuestion === q
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                            } `}
                    >
                        {q}
                    </button>

                ))}

            </div>

        </div>

    );
}

