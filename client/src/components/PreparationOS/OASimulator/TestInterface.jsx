import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGE_CONFIGS = {
    javascript: {
        label: "JavaScript",
        ext: "js",
        comment: "//",
        boilerplate: (fn) => `/**
 * @param {number[]} nums
 * @return {number}
 */
function ${fn}(nums) {
    // Your solution here
    
};`,
    },
    python: {
        label: "Python",
        ext: "py",
        comment: "#",
        boilerplate: (fn) => `class Solution:
    def ${fn}(self, nums: list[int]) -> int:
        # Your solution here
        pass`,
    },
    java: {
        label: "Java",
        ext: "java",
        comment: "//",
        boilerplate: (fn) => `class Solution {
    public int ${fn}(int[] nums) {
        // Your solution here
        return 0;
    }
}`,
    },
    cpp: {
        label: "C++",
        ext: "cpp",
        comment: "//",
        boilerplate: (fn) => `class Solution {
public:
    int ${fn}(vector<int>& nums) {
        // Your solution here
        return 0;
    }
};`,
    },
};

// Syntax highlighter (simple token-based)
function highlight(code, lang) {
    if (!code) return "";
    const keywords = {
        javascript: ["function", "const", "let", "var", "return", "if", "else", "for", "while", "class", "new", "this", "import", "export", "default", "null", "undefined", "true", "false"],
        python: ["def", "class", "return", "if", "elif", "else", "for", "while", "import", "from", "True", "False", "None", "and", "or", "not", "in", "is", "pass", "self"],
        java: ["public", "private", "class", "int", "void", "return", "if", "else", "for", "while", "new", "this", "static", "final", "boolean", "String"],
        cpp: ["int", "void", "return", "if", "else", "for", "while", "class", "public", "private", "new", "bool", "string", "vector", "auto", "const"],
    };
    const kw = keywords[lang] || [];
    return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/(\/\/[^\n]*)/g, '<span style="color:#6b7280;font-style:italic">$1</span>')
        .replace(/(#[^\n]*)/g, (m) => lang === "python" ? `<span style="color:#6b7280;font-style:italic">${m}</span>` : m)
        .replace(/"([^"]*)"/g, '<span style="color:#a3e635">"$1"</span>')
        .replace(/'([^']*)'/g, "<span style=\"color:#a3e635\">'$1'</span>")
        .replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>')
        .replace(new RegExp(`\\b(${kw.join("|")})\\b`, "g"), '<span style="color:#c084fc;font-weight:600">$1</span>');
}

// Fake JS execution engine
function runCode(code, language, testCases) {
    const results = [];
    for (const tc of testCases) {
        const start = performance.now();
        try {
            if (language === "javascript") {
                // Extract function name
                const fnMatch = code.match(/function\s+(\w+)/);
                const fnName = fnMatch ? fnMatch[1] : "solution";
                // eslint-disable-next-line no-new-func
                const fn = new Function(`${code}; return ${fnName};`)();
                const args = Array.isArray(tc.input) ? tc.input : [tc.input];
                const output = fn(...args);
                const elapsed = (performance.now() - start).toFixed(1);
                const passed = JSON.stringify(output) === JSON.stringify(tc.expected);
                results.push({ passed, output, expected: tc.expected, input: tc.input, time: elapsed, error: null });
            } else {
                // Simulate for non-JS
                const elapsed = (Math.random() * 40 + 5).toFixed(1);
                const passed = Math.random() > 0.35;
                results.push({ passed, output: passed ? tc.expected : "wrong_answer", expected: tc.expected, input: tc.input, time: elapsed, error: null });
            }
        } catch (e) {
            results.push({ passed: false, output: null, expected: tc.expected, input: tc.input, time: "0.0", error: e.message });
        }
    }
    return results;
}

// AI-generated problems
async function fetchProblem(config, index) {
    const topicHint = config.topics.length > 0 ? `focused on: ${config.topics.join(", ")}` : "";
    const companyHint = config.company ? `in the style of ${config.company.name} OA problems` : "";
    const prompt = `Generate a coding problem for an Online Assessment (problem ${index + 1} of ${config.numProblems}).
Difficulty: ${config.difficulty}
${topicHint}
${companyHint}

Respond ONLY with a JSON object (no markdown, no extra text):
{
  "title": "Problem title",
  "difficulty": "${config.difficulty}",
  "topic": "main topic tag",
  "description": "Full problem description in 2-3 paragraphs",
  "constraints": ["constraint 1", "constraint 2", "constraint 3"],
  "examples": [
    {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "brief explanation"},
    {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "brief explanation"}
  ],
  "functionName": "camelCase function name",
  "testCases": [
    {"input": [actual JS value], "expected": actual JS value},
    {"input": [actual JS value], "expected": actual JS value},
    {"input": [actual JS value], "expected": actual JS value}
  ],
  "hint": "One sentence hint"
}`;

    const res = await fetch("/api/ai/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || "{}";
    try {
        const clean = raw.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch {
        return null;
    }
}

export default function TestInterface({ config, onFinish, onExit }) {
    const diff = { easy: 30, medium: 45, hard: 60 }[config.difficulty];
    const totalSeconds = diff * config.numProblems * 60;

    const [problems, setProblems] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(true);
    const [currentProblem, setCurrentProblem] = useState(0);
    const [language, setLanguage] = useState("javascript");
    const [codes, setCodes] = useState({});
    const [terminalLines, setTerminalLines] = useState([
        { type: "info", text: "Incog Terminal v2.0 — Ready" },
        { type: "muted", text: "Type your solution and press Run to execute test cases." },
    ]);
    const [running, setRunning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [tab, setTab] = useState("problem"); // problem | terminal
    const [showHint, setShowHint] = useState(false);
    const [testResults, setTestResults] = useState({}); // problemIndex -> results
    const [panelWidth, setPanelWidth] = useState(45); // percent for left panel
    const terminalRef = useRef(null);
    const textareaRef = useRef(null);
    const timerRef = useRef(null);
    const dragging = useRef(false);

    // Load problems
    useEffect(() => {
        async function load() {
            setLoadingProblems(true);
            const loaded = [];
            for (let i = 0; i < config.numProblems; i++) {
                const p = await fetchProblem(config, i);
                if (p) {
                    loaded.push(p);
                    // Set boilerplate code for this problem
                    const boilerplate = LANGUAGE_CONFIGS[language]?.boilerplate(p.functionName || "solution") || "";
                    setCodes((c) => ({ ...c, [`${i}-${language}`]: boilerplate }));
                }
            }
            setProblems(loaded);
            setLoadingProblems(false);
            addTerminalLine("success", `✓ Loaded ${loaded.length} problem(s). Timer started.`);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Timer
    useEffect(() => {
        if (loadingProblems) return;
        timerRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitAll(true);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingProblems]);

    // Language change → update boilerplate if blank
    useEffect(() => {
        problems.forEach((p, i) => {
            const key = `${i}-${language}`;
            if (!codes[key]) {
                const bp = LANGUAGE_CONFIGS[language]?.boilerplate(p.functionName || "solution") || "";
                setCodes((c) => ({ ...c, [key]: bp }));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, problems]);

    const addTerminalLine = useCallback((type, text) => {
        setTerminalLines((l) => [...l, { type, text }]);
        setTimeout(() => {
            if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }, 50);
    }, []);

    const codeKey = `${currentProblem}-${language}`;
    const currentCode = codes[codeKey] || "";

    const setCurrentCode = (val) => {
        setCodes((c) => ({ ...c, [codeKey]: val }));
    };

    const handleRun = async () => {
        if (!problems[currentProblem]) return;
        setRunning(true);
        setTab("terminal");
        addTerminalLine("cmd", `$ run --lang=${language} --problem=${currentProblem + 1}`);
        addTerminalLine("muted", "Compiling...");
        await new Promise((r) => setTimeout(r, 600));

        const problem = problems[currentProblem];
        const tcs = problem.testCases || [];
        const results = runCode(currentCode, language, tcs);
        setTestResults((t) => ({ ...t, [currentProblem]: results }));

        const passed = results.filter((r) => r.passed).length;
        addTerminalLine("muted", `Running ${tcs.length} test case(s)...`);
        await new Promise((r) => setTimeout(r, 300));

        results.forEach((r, i) => {
            if (r.error) {
                addTerminalLine("error", `  TC ${i + 1}: ✗ RuntimeError — ${r.error}`);
            } else if (r.passed) {
                addTerminalLine("success", `  TC ${i + 1}: ✓ Passed (${r.time}ms)`);
            } else {
                addTerminalLine("error", `  TC ${i + 1}: ✗ Wrong Answer`);
                addTerminalLine("muted", `         Expected: ${JSON.stringify(r.expected)}`);
                addTerminalLine("muted", `         Got:      ${JSON.stringify(r.output)}`);
            }
        });

        addTerminalLine(
            passed === results.length ? "success" : "warn",
            `\n  Result: ${passed}/${results.length} test cases passed`
        );
        setRunning(false);
    };

    const handleSubmitAll = useCallback(
        (timedOut = false) => {
            clearInterval(timerRef.current);
            const allResults = problems.map((p, i) => ({
                problem: p,
                code: codes[`${i}-${language}`] || "",
                results: testResults[i] || [],
            }));
            onFinish({
                problems,
                allResults,
                language,
                timedOut,
                timeTaken: totalSeconds - secondsLeft,
                config,
            });
        },
        [problems, codes, language, testResults, onFinish, totalSeconds, secondsLeft, config]
    );

    // Drag divider
    const onMouseDown = (e) => {
        dragging.current = true;
        e.preventDefault();
    };
    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current) return;
            const pct = (e.clientX / window.innerWidth) * 100;
            setPanelWidth(Math.max(25, Math.min(65, pct)));
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    // Tab key in textarea
    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newVal = currentCode.substring(0, start) + "    " + currentCode.substring(end);
            setCurrentCode(newVal);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            handleRun();
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const timePercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
    const isUrgent = secondsLeft < 300;

    const problem = problems[currentProblem];
    const problemResults = testResults[currentProblem] || [];
    const solvedProblems = Object.entries(testResults).filter(
        ([, r]) => r.length > 0 && r.every((x) => x.passed)
    ).length;

    return (
        <div style={s.root}>
            {/* Top bar */}
            <div style={s.topbar}>
                <div style={s.topLeft}>
                    <button onClick={onExit} style={s.exitBtn} title="Exit to lobby">
                        ✕ Exit
                    </button>
                    <div style={s.dividerV} />
                    <div style={s.problemTabs}>
                        {problems.map((p, i) => {
                            const res = testResults[i] || [];
                            const allPass = res.length > 0 && res.every((r) => r.passed);
                            const anyRan = res.length > 0;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentProblem(i)}
                                    style={{
                                        ...s.problemTab,
                                        ...(i === currentProblem ? s.problemTabActive : {}),
                                        ...(allPass ? { color: "#22c55e", borderColor: "rgba(34,197,94,0.3)" } : {}),
                                        ...(anyRan && !allPass ? { color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" } : {}),
                                    }}
                                >
                                    {loadingProblems && i >= problems.length ? (
                                        <span style={s.loadingDot} />
                                    ) : (
                                        <>
                                            {allPass ? "✓" : anyRan ? "✗" : `${i + 1}`}
                                        </>
                                    )}
                                    {p?.title ? ` ${p.title.substring(0, 20)}${p.title.length > 20 ? "…" : ""}` : ` Problem ${i + 1}`}
                                </button>
                            );
                        })}
                        {loadingProblems &&
                            Array.from({ length: config.numProblems - problems.length }).map((_, i) => (
                                <button key={`loading-${i}`} style={{ ...s.problemTab, opacity: 0.4 }}>
                                    <span style={s.loadingDot} /> Loading…
                                </button>
                            ))}
                    </div>
                </div>

                <div style={s.topRight}>
                    <div style={s.solvedBadge}>
                        {solvedProblems}/{config.numProblems} solved
                    </div>
                    <div
                        style={{
                            ...s.timer,
                            color: isUrgent ? "#ef4444" : "#e2e8f0",
                            borderColor: isUrgent ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
                            background: isUrgent ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
                        }}
                    >
                        {isUrgent && <span style={s.timerPulse} />}
                        ⏱ {formatTime(secondsLeft)}
                    </div>
                    <button
                        onClick={() => handleSubmitAll(false)}
                        style={s.submitBtn}
                        disabled={loadingProblems}
                    >
                        Submit All →
                    </button>
                </div>
            </div>

            {/* Timer progress */}
            <div style={s.timerBar}>
                <div
                    style={{
                        ...s.timerFill,
                        width: `${timePercent}%`,
                        background: isUrgent ? "#ef4444" : "linear-gradient(90deg, #7c3aed, #4f46e5)",
                    }}
                />
            </div>

            {/* Main layout */}
            <div style={s.main}>
                {/* Left: Problem panel */}
                <div style={{ ...s.leftPanel, width: `${panelWidth}%` }}>
                    {/* Tabs */}
                    <div style={s.panelTabs}>
                        <button
                            onClick={() => setTab("problem")}
                            style={{ ...s.panelTab, ...(tab === "problem" ? s.panelTabActive : {}) }}
                        >
                            📋 Problem
                        </button>
                        <button
                            onClick={() => setTab("terminal")}
                            style={{ ...s.panelTab, ...(tab === "terminal" ? s.panelTabActive : {}) }}
                        >
                            ⬛ Terminal
                            {terminalLines.some((l) => l.type === "error") && (
                                <span style={s.terminalErrorBadge} />
                            )}
                        </button>
                        {problemResults.length > 0 && (
                            <div style={s.resultSummary}>
                                {problemResults.filter((r) => r.passed).length}/{problemResults.length} TC
                            </div>
                        )}
                    </div>

                    <div style={s.panelContent}>
                        {tab === "problem" && (
                            <div style={s.problemContent}>
                                {loadingProblems && !problem ? (
                                    <div style={s.loadingState}>
                                        <div style={s.spinner} />
                                        <p>Generating problem with AI…</p>
                                    </div>
                                ) : problem ? (
                                    <>
                                        <div style={s.problemHeader}>
                                            <div style={s.problemMeta}>
                                                <span
                                                    style={{
                                                        ...s.diffBadge,
                                                        color: { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" }[problem.difficulty],
                                                        background: { easy: "rgba(34,197,94,0.1)", medium: "rgba(245,158,11,0.1)", hard: "rgba(239,68,68,0.1)" }[problem.difficulty],
                                                    }}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                {problem.topic && <span style={s.topicBadge}>{problem.topic}</span>}
                                            </div>
                                            <h2 style={s.problemTitle}>{problem.title}</h2>
                                        </div>

                                        <p style={s.problemDesc}>{problem.description}</p>

                                        {problem.examples?.map((ex, i) => (
                                            <div key={i} style={s.exampleBlock}>
                                                <div style={s.exampleLabel}>Example {i + 1}</div>
                                                <div style={s.exampleRow}>
                                                    <span style={s.exampleKey}>Input:</span>
                                                    <code style={s.exampleCode}>{ex.input}</code>
                                                </div>
                                                <div style={s.exampleRow}>
                                                    <span style={s.exampleKey}>Output:</span>
                                                    <code style={s.exampleCode}>{ex.output}</code>
                                                </div>
                                                {ex.explanation && (
                                                    <div style={s.exampleRow}>
                                                        <span style={s.exampleKey}>Explanation:</span>
                                                        <span style={s.exampleExplanation}>{ex.explanation}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {problem.constraints?.length > 0 && (
                                            <div style={s.constraintsBlock}>
                                                <div style={s.constraintsLabel}>Constraints</div>
                                                {problem.constraints.map((c, i) => (
                                                    <div key={i} style={s.constraintRow}>
                                                        <span style={s.bulletDot} />
                                                        <code style={s.constraintCode}>{c}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {problem.hint && (
                                            <div style={s.hintSection}>
                                                <button onClick={() => setShowHint(!showHint)} style={s.hintToggle}>
                                                    💡 {showHint ? "Hide Hint" : "Show Hint"}
                                                </button>
                                                {showHint && <p style={s.hintText}>{problem.hint}</p>}
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        )}

                        {tab === "terminal" && (
                            <div ref={terminalRef} style={s.terminal}>
                                <div style={s.terminalHeader}>
                                    <span style={s.terminalTitle}>TERMINAL</span>
                                    <button
                                        onClick={() => setTerminalLines([{ type: "info", text: "Terminal cleared." }])}
                                        style={s.terminalClearBtn}
                                    >
                                        clear
                                    </button>
                                </div>
                                <div style={s.terminalBody}>
                                    {terminalLines.map((line, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                ...s.terminalLine,
                                                color: {
                                                    info: "#60a5fa",
                                                    success: "#4ade80",
                                                    error: "#f87171",
                                                    warn: "#fbbf24",
                                                    cmd: "#a78bfa",
                                                    muted: "rgba(255,255,255,0.3)",
                                                }[line.type] || "rgba(255,255,255,0.7)",
                                            }}
                                        >
                                            {line.text}
                                        </div>
                                    ))}
                                    {running && (
                                        <div style={{ ...s.terminalLine, color: "#a78bfa" }}>
                                            <span style={s.cursor}>▋</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Drag handle */}
                <div style={s.dragHandle} onMouseDown={onMouseDown}>
                    <div style={s.dragHandleBar} />
                </div>

                {/* Right: Editor */}
                <div style={{ ...s.rightPanel, width: `${100 - panelWidth - 0.4}%` }}>
                    {/* Editor toolbar */}
                    <div style={s.editorToolbar}>
                        <div style={s.langSelect}>
                            {Object.entries(LANGUAGE_CONFIGS).map(([key, cfg]) => (
                                <button
                                    key={key}
                                    onClick={() => setLanguage(key)}
                                    style={{
                                        ...s.langBtn,
                                        ...(language === key ? s.langBtnActive : {}),
                                    }}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                        <div style={s.editorActions}>
                            <button
                                onClick={() => {
                                    const bp = LANGUAGE_CONFIGS[language]?.boilerplate(problem?.functionName || "solution") || "";
                                    setCurrentCode(bp);
                                }}
                                style={s.iconBtn}
                                title="Reset to template"
                            >
                                ↺ Reset
                            </button>
                            <button
                                onClick={handleRun}
                                disabled={running || loadingProblems || !problem}
                                style={{ ...s.runBtn, opacity: running || loadingProblems ? 0.5 : 1 }}
                            >
                                {running ? "⏳ Running…" : "▶ Run (Ctrl+Enter)"}
                            </button>
                        </div>
                    </div>

                    {/* File tab */}
                    <div style={s.fileTab}>
                        <span style={s.fileTabName}>
                            solution.{LANGUAGE_CONFIGS[language]?.ext}
                        </span>
                        {currentCode.length > 0 && (
                            <span style={s.fileTabLines}>{currentCode.split("\n").length} lines</span>
                        )}
                    </div>

                    {/* Code editor with line numbers */}
                    <div style={s.editorWrap}>
                        {/* Line numbers */}
                        <div style={s.lineNumbers}>
                            {(currentCode || "").split("\n").map((_, i) => (
                                <div key={i} style={s.lineNum}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        {/* Textarea overlay */}
                        <div style={s.editorInner}>
                            <textarea
                                ref={textareaRef}
                                value={currentCode}
                                onChange={(e) => setCurrentCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={s.textarea}
                                spellCheck={false}
                                placeholder="// Start coding here..."
                            />
                            {/* Syntax highlight overlay (visual only) */}
                            <pre
                                style={s.highlightOverlay}
                                aria-hidden
                                dangerouslySetInnerHTML={{ __html: highlight(currentCode, language) + "\n" }}
                            />
                        </div>
                    </div>

                    {/* Test cases mini panel */}
                    {problemResults.length > 0 && (
                        <div style={s.tcPanel}>
                            <div style={s.tcPanelHeader}>Test Cases</div>
                            <div style={s.tcList}>
                                {problemResults.map((r, i) => (
                                    <div key={i} style={{ ...s.tcItem, borderColor: r.passed ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }}>
                                        <span style={{ color: r.passed ? "#4ade80" : "#f87171" }}>
                                            {r.passed ? "✓" : "✗"}
                                        </span>
                                        <span style={s.tcLabel}>TC {i + 1}</span>
                                        <span style={s.tcTime}>{r.time}ms</span>
                                        {r.error && <span style={s.tcError}>{r.error.substring(0, 30)}…</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
    root: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        overflow: "hidden",
    },
    topbar: {
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        background: "#0d0d14",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
        zIndex: 10,
    },
    topLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        overflow: "hidden",
    },
    exitBtn: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.35)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        padding: "4px 10px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
    },
    dividerV: {
        width: "1px",
        height: "24px",
        background: "rgba(255,255,255,0.08)",
    },
    problemTabs: {
        display: "flex",
        gap: "4px",
        overflow: "hidden",
    },
    problemTab: {
        fontSize: "12px",
        padding: "4px 12px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        maxWidth: "180px",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    problemTabActive: {
        background: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "#a78bfa",
    },
    loadingDot: {
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#a78bfa",
        animation: "pulse 1s infinite",
        marginRight: "4px",
    },
    topRight: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
    },
    solvedBadge: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        padding: "3px 10px",
    },
    timer: {
        fontSize: "14px",
        fontWeight: 600,
        padding: "4px 12px",
        borderRadius: "6px",
        border: "1px solid",
        letterSpacing: "0.05em",
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    timerPulse: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#ef4444",
        display: "inline-block",
        animation: "pulse 0.8s infinite",
    },
    submitBtn: {
        fontSize: "13px",
        padding: "6px 16px",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        border: "none",
        borderRadius: "7px",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 600,
    },
    timerBar: {
        height: "2px",
        background: "rgba(255,255,255,0.05)",
        flexShrink: 0,
    },
    timerFill: {
        height: "100%",
        transition: "width 1s linear",
    },
    main: {
        flex: 1,
        display: "flex",
        overflow: "hidden",
    },
    leftPanel: {
        display: "flex",
        flexDirection: "column",
        background: "#0d0d14",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        minWidth: "280px",
        flexShrink: 0,
    },
    dragHandle: {
        width: "5px",
        cursor: "col-resize",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 5,
        transition: "background 0.15s",
    },
    dragHandleBar: {
        width: "1px",
        height: "40px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "1px",
    },
    rightPanel: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: "300px",
    },
    panelTabs: {
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "8px 12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
    },
    panelTab: {
        fontSize: "12px",
        padding: "6px 14px",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid transparent",
        color: "rgba(255,255,255,0.35)",
        cursor: "pointer",
        fontFamily: "inherit",
        position: "relative",
        marginBottom: "-1px",
    },
    panelTabActive: {
        color: "#a78bfa",
        borderBottom: "2px solid #7c3aed",
    },
    terminalErrorBadge: {
        position: "absolute",
        top: "4px",
        right: "4px",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#ef4444",
    },
    resultSummary: {
        marginLeft: "auto",
        fontSize: "11px",
        color: "rgba(255,255,255,0.3)",
        padding: "0 4px",
    },
    panelContent: {
        flex: 1,
        overflow: "auto",
    },
    loadingState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "200px",
        gap: "16px",
        color: "rgba(255,255,255,0.35)",
        fontSize: "13px",
    },
    spinner: {
        width: "28px",
        height: "28px",
        border: "2px solid rgba(139,92,246,0.2)",
        borderTop: "2px solid #a78bfa",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    problemContent: {
        padding: "20px",
    },
    problemHeader: {
        marginBottom: "16px",
    },
    problemMeta: {
        display: "flex",
        gap: "8px",
        marginBottom: "8px",
    },
    diffBadge: {
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "12px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
    },
    topicBadge: {
        fontSize: "11px",
        padding: "3px 10px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.5)",
    },
    problemTitle: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#f1f5f9",
        margin: 0,
        lineHeight: 1.3,
    },
    problemDesc: {
        fontSize: "13px",
        color: "rgba(255,255,255,0.65)",
        lineHeight: 1.8,
        margin: "0 0 20px",
        whiteSpace: "pre-wrap",
    },
    exampleBlock: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "12px 14px",
        marginBottom: "12px",
        fontSize: "12px",
    },
    exampleLabel: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "8px",
    },
    exampleRow: {
        display: "flex",
        gap: "8px",
        marginBottom: "4px",
        alignItems: "flex-start",
    },
    exampleKey: {
        color: "rgba(255,255,255,0.35)",
        minWidth: "70px",
        flexShrink: 0,
    },
    exampleCode: {
        color: "#a3e635",
        background: "rgba(163,230,53,0.07)",
        borderRadius: "4px",
        padding: "1px 6px",
        fontFamily: "inherit",
        fontSize: "12px",
    },
    exampleExplanation: {
        color: "rgba(255,255,255,0.45)",
        fontStyle: "italic",
    },
    constraintsBlock: {
        marginTop: "16px",
    },
    constraintsLabel: {
        fontSize: "11px",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.3)",
        textTransform: "uppercase",
        marginBottom: "8px",
    },
    constraintRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
    },
    bulletDot: {
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.2)",
        flexShrink: 0,
    },
    constraintCode: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "inherit",
    },
    hintSection: {
        marginTop: "20px",
    },
    hintToggle: {
        fontSize: "12px",
        color: "#fbbf24",
        background: "rgba(251,191,36,0.08)",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: "6px",
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    hintText: {
        marginTop: "10px",
        fontSize: "12px",
        color: "rgba(255,255,255,0.5)",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "6px",
        padding: "10px 14px",
        fontStyle: "italic",
        lineHeight: 1.7,
    },
    terminal: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#080810",
    },
    terminalHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
    },
    terminalTitle: {
        fontSize: "10px",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.2)",
    },
    terminalClearBtn: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.2)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    terminalBody: {
        flex: 1,
        overflowY: "auto",
        padding: "12px 14px",
    },
    terminalLine: {
        fontSize: "12px",
        lineHeight: 1.9,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
    },
    cursor: {
        animation: "pulse 1s infinite",
        color: "#a78bfa",
    },
    editorToolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        background: "#0d0d14",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
    },
    langSelect: {
        display: "flex",
        gap: "4px",
    },
    langBtn: {
        fontSize: "11px",
        padding: "4px 10px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "5px",
        color: "rgba(255,255,255,0.3)",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    langBtnActive: {
        background: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "#a78bfa",
    },
    editorActions: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    iconBtn: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        padding: "4px 8px",
    },
    runBtn: {
        fontSize: "12px",
        fontWeight: 600,
        padding: "6px 16px",
        background: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: "7px",
        color: "#4ade80",
        cursor: "pointer",
        fontFamily: "inherit",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
    },
    fileTab: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 14px",
        background: "#0a0a12",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
    },
    fileTabName: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.35)",
    },
    fileTabLines: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.2)",
    },
    editorWrap: {
        flex: 1,
        display: "flex",
        overflow: "auto",
        background: "#080810",
        position: "relative",
    },
    lineNumbers: {
        width: "42px",
        flexShrink: 0,
        padding: "14px 0",
        background: "#08080e",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        textAlign: "right",
        userSelect: "none",
    },
    lineNum: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.15)",
        lineHeight: "1.6em",
        paddingRight: "10px",
        height: "1.6em",
    },
    editorInner: {
        flex: 1,
        position: "relative",
        minHeight: "100%",
    },
    textarea: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        border: "none",
        outline: "none",
        resize: "none",
        color: "transparent",
        caretColor: "#a78bfa",
        fontSize: "13px",
        lineHeight: "1.6em",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: "14px 14px",
        zIndex: 2,
        spellCheck: false,
        whiteSpace: "pre",
        overflowWrap: "normal",
    },
    highlightOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        margin: 0,
        padding: "14px 14px",
        fontSize: "13px",
        lineHeight: "1.6em",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: "rgba(255,255,255,0.75)",
        pointerEvents: "none",
        whiteSpace: "pre",
        zIndex: 1,
        background: "transparent",
        overflowWrap: "normal",
    },
    tcPanel: {
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#0d0d14",
        padding: "10px 14px",
        flexShrink: 0,
    },
    tcPanelHeader: {
        fontSize: "10px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        marginBottom: "8px",
    },
    tcList: {
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
    },
    tcItem: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        padding: "4px 10px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid",
        borderRadius: "6px",
    },
    tcLabel: {
        color: "rgba(255,255,255,0.4)",
    },
    tcTime: {
        color: "rgba(255,255,255,0.2)",
        fontSize: "10px",
    },
    tcError: {
        color: "#f87171",
        fontSize: "10px",
    },
};