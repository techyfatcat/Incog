import { useState, useEffect } from "react";

async function getAIFeedback(problem, code, results) {
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const prompt = `You are a senior engineer reviewing a coding OA submission.

Problem: ${problem.title}
Difficulty: ${problem.difficulty}
Topic: ${problem.topic}

Code submitted:
\`\`\`
${code}
\`\`\`

Test results: ${passed}/${total} test cases passed.

Give a concise review (3-4 sentences max) covering:
1. Time/space complexity of the submitted solution (or likely approach)
2. One specific strength or good practice
3. One concrete suggestion to improve

Be direct and technical. No preamble. Start with complexity analysis.`;

    const res = await fetch("/api/ai/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "No feedback available.";
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
}

function ScoreRing({ score }) {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={`${fill} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
            />
            <text x="70" y="64" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                {score}
            </text>
            <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="'JetBrains Mono', monospace">
                / 100
            </text>
        </svg>
    );
}

export default function TestResult({ result, config, onRetry, onHome }) {
    const [feedbacks, setFeedbacks] = useState({});
    const [loadingFeedback, setLoadingFeedback] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const { problems, allResults, language, timedOut, timeTaken } = result;

    // Compute overall score
    const totalTC = allResults.reduce((a, r) => a + r.results.length, 0);
    const passedTC = allResults.reduce((a, r) => a + r.results.filter((x) => x.passed).length, 0);
    const score = totalTC > 0 ? Math.round((passedTC / totalTC) * 100) : 0;
    const fullyPassed = allResults.filter((r) => r.results.length > 0 && r.results.every((x) => x.passed)).length;

    const scoreLabel =
        score >= 90 ? "Exceptional" :
            score >= 75 ? "Strong Pass" :
                score >= 50 ? "Partial Pass" :
                    score >= 25 ? "Needs Work" :
                        "Keep Practicing";

    const scoreColor =
        score >= 75 ? "#22c55e" :
            score >= 50 ? "#f59e0b" :
                "#ef4444";

    // Load feedback for active tab automatically
    useEffect(() => {
        const idx = activeTab;
        const r = allResults[idx];
        if (r && r.code && !feedbacks[idx] && !loadingFeedback[idx]) {
            setLoadingFeedback((l) => ({ ...l, [idx]: true }));
            getAIFeedback(r.problem, r.code, r.results).then((fb) => {
                setFeedbacks((f) => ({ ...f, [idx]: fb }));
                setLoadingFeedback((l) => ({ ...l, [idx]: false }));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, allResults]);

    return (
        <div style={r.root}>
            <div style={r.ambientTop} />

            {/* Header */}
            <div style={r.header}>
                <div style={r.headerLeft}>
                    <div style={r.terminalDots}>
                        <span style={{ ...r.dot, background: "#ff5f57" }} />
                        <span style={{ ...r.dot, background: "#febc2e" }} />
                        <span style={{ ...r.dot, background: "#28c840" }} />
                    </div>
                    <span style={r.headerTitle}>incog://oa-simulator/results</span>
                </div>
                <div style={r.headerRight}>
                    <button onClick={onHome} style={r.navBtn}>← Back to Lobby</button>
                    <button onClick={onRetry} style={r.retryBtn}>↺ Retry</button>
                </div>
            </div>

            <div style={r.body}>
                {/* Score section */}
                <div style={r.scoreSection}>
                    <div style={r.scoreLeft}>
                        <div style={r.assessmentTag}>
                            {timedOut ? "⏰ Time's Up" : "✓ Assessment Complete"}
                        </div>
                        <h1 style={r.scoreTitle}>{scoreLabel}</h1>
                        <p style={r.scoreSubtitle}>
                            You solved {fullyPassed} of {problems.length} problem(s) with{" "}
                            <span style={{ color: scoreColor }}>{passedTC}/{totalTC}</span> test cases passing.
                        </p>
                        <div style={r.statRow}>
                            <div style={r.stat}>
                                <div style={r.statValue}>{formatTime(timeTaken)}</div>
                                <div style={r.statLabel}>Time Used</div>
                            </div>
                            <div style={r.stat}>
                                <div style={{ ...r.statValue, color: scoreColor }}>{score}%</div>
                                <div style={r.statLabel}>Score</div>
                            </div>
                            <div style={r.stat}>
                                <div style={r.statValue}>{language}</div>
                                <div style={r.statLabel}>Language</div>
                            </div>
                            <div style={r.stat}>
                                <div style={r.statValue}>{config.difficulty}</div>
                                <div style={r.statLabel}>Difficulty</div>
                            </div>
                        </div>
                    </div>
                    <div style={r.scoreRingWrap}>
                        <ScoreRing score={score} />
                        <div style={r.scoreGrade}>
                            {score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "F"}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={r.progressBar}>
                    <div style={{ ...r.progressFill, width: `${score}%`, background: scoreColor }} />
                </div>

                {/* Problem breakdown */}
                <div style={r.sectionLabel}>Problem Breakdown</div>

                {/* Problem tabs */}
                <div style={r.problemTabs}>
                    {allResults.map((ar, i) => {
                        const passed = ar.results.filter((x) => x.passed).length;
                        const total = ar.results.length;
                        const all = total > 0 && passed === total;
                        const any = total > 0;
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                style={{
                                    ...r.problemTab,
                                    ...(activeTab === i ? r.problemTabActive : {}),
                                    ...(all ? { borderColor: "rgba(34,197,94,0.3)", color: activeTab === i ? "#4ade80" : "rgba(74,222,128,0.6)" } : {}),
                                    ...(any && !all ? { borderColor: "rgba(239,68,68,0.3)", color: activeTab === i ? "#f87171" : "rgba(248,113,113,0.6)" } : {}),
                                }}
                            >
                                {all ? "✓ " : any ? "✗ " : ""}{ar.problem?.title || `Problem ${i + 1}`}
                                <span style={r.tcMini}>{passed}/{total}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active problem detail */}
                {allResults[activeTab] && (
                    <div style={r.problemDetail}>
                        <div style={r.detailGrid}>
                            {/* Left: code */}
                            <div style={r.codePanel}>
                                <div style={r.codePanelHeader}>
                                    <span style={r.codePanelTitle}>Your Solution</span>
                                    <span style={r.codeLang}>{language}</span>
                                </div>
                                <pre style={r.codeBlock}>
                                    {allResults[activeTab].code || "// No code submitted"}
                                </pre>
                            </div>

                            {/* Right: TC results + AI feedback */}
                            <div style={r.rightCol}>
                                {/* Test case results */}
                                <div style={r.tcCard}>
                                    <div style={r.tcCardHeader}>Test Cases</div>
                                    {allResults[activeTab].results.length === 0 ? (
                                        <div style={r.noTC}>No test cases run</div>
                                    ) : (
                                        allResults[activeTab].results.map((tc, i) => (
                                            <div key={i} style={{ ...r.tcRow, borderColor: tc.passed ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)" }}>
                                                <div style={r.tcTop}>
                                                    <span style={{ ...r.tcStatus, color: tc.passed ? "#4ade80" : "#f87171" }}>
                                                        {tc.passed ? "✓" : "✗"} TC {i + 1}
                                                    </span>
                                                    <span style={r.tcTimeSmall}>{tc.time}ms</span>
                                                </div>
                                                {!tc.passed && tc.error ? (
                                                    <div style={r.tcErrorMsg}>RuntimeError: {tc.error}</div>
                                                ) : !tc.passed ? (
                                                    <div style={r.tcDiff}>
                                                        <div style={r.tcDiffRow}>
                                                            <span style={r.tcDiffKey}>Expected</span>
                                                            <code style={r.tcDiffVal}>{JSON.stringify(tc.expected)}</code>
                                                        </div>
                                                        <div style={r.tcDiffRow}>
                                                            <span style={r.tcDiffKey}>Got</span>
                                                            <code style={{ ...r.tcDiffVal, color: "#f87171" }}>{JSON.stringify(tc.output)}</code>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* AI Feedback */}
                                <div style={r.feedbackCard}>
                                    <div style={r.feedbackHeader}>
                                        <span style={r.feedbackIcon}>✦</span>
                                        <span style={r.feedbackTitle}>AI Code Review</span>
                                    </div>
                                    {loadingFeedback[activeTab] ? (
                                        <div style={r.feedbackLoading}>
                                            <div style={r.spinner} />
                                            <span>Analyzing your solution…</span>
                                        </div>
                                    ) : feedbacks[activeTab] ? (
                                        <p style={r.feedbackText}>{feedbacks[activeTab]}</p>
                                    ) : (
                                        <p style={r.feedbackMuted}>Run code during the assessment to receive AI feedback.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action row */}
                <div style={r.actions}>
                    <button onClick={onHome} style={r.secondaryBtn}>← Back to Lobby</button>
                    <button onClick={onRetry} style={r.primaryBtn}>↺ Try Again with Same Config</button>
                </div>
            </div>
        </div>
    );
}

const r = {
    root: {
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        position: "relative",
        overflow: "hidden",
    },
    ambientTop: {
        position: "fixed",
        top: "-200px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "800px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        position: "relative",
        zIndex: 1,
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    terminalDots: { display: "flex", gap: "6px" },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        display: "inline-block",
    },
    headerTitle: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.05em",
    },
    headerRight: {
        display: "flex",
        gap: "8px",
    },
    navBtn: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.35)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    retryBtn: {
        fontSize: "12px",
        color: "#a78bfa",
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: "6px",
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    body: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 24px 60px",
        position: "relative",
        zIndex: 1,
    },
    scoreSection: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "28px",
        gap: "24px",
    },
    scoreLeft: {
        flex: 1,
    },
    assessmentTag: {
        display: "inline-block",
        fontSize: "11px",
        letterSpacing: "0.1em",
        color: "#a78bfa",
        background: "rgba(139,92,246,0.1)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "4px",
        padding: "4px 10px",
        marginBottom: "14px",
        textTransform: "uppercase",
    },
    scoreTitle: {
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 700,
        color: "#f1f5f9",
        margin: "0 0 10px",
        letterSpacing: "-0.02em",
    },
    scoreSubtitle: {
        fontSize: "14px",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.7,
        margin: "0 0 24px",
    },
    statRow: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
    },
    stat: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        padding: "10px 18px",
        minWidth: "80px",
    },
    statValue: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#f1f5f9",
        marginBottom: "2px",
    },
    statLabel: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
    },
    scoreRingWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        flexShrink: 0,
    },
    scoreGrade: {
        fontSize: "28px",
        fontWeight: 700,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.05em",
    },
    progressBar: {
        height: "3px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "2px",
        marginBottom: "40px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: "2px",
        transition: "width 1s ease",
    },
    sectionLabel: {
        fontSize: "11px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        marginBottom: "14px",
    },
    problemTabs: {
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        flexWrap: "wrap",
    },
    problemTab: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        padding: "8px 16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
    },
    problemTabActive: {
        background: "rgba(139,92,246,0.1)",
        border: "1px solid rgba(139,92,246,0.25)",
        color: "#c4b5fd",
    },
    tcMini: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "10px",
        padding: "1px 7px",
    },
    problemDetail: {
        marginBottom: "36px",
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: "16px",
    },
    codePanel: {
        background: "#080810",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        overflow: "hidden",
    },
    codePanelHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#0d0d14",
    },
    codePanelTitle: {
        fontSize: "11px",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.3)",
        textTransform: "uppercase",
    },
    codeLang: {
        fontSize: "11px",
        color: "#a78bfa",
        background: "rgba(139,92,246,0.1)",
        borderRadius: "4px",
        padding: "2px 8px",
    },
    codeBlock: {
        margin: 0,
        padding: "16px",
        fontSize: "12px",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.6)",
        overflowX: "auto",
        maxHeight: "420px",
        overflowY: "auto",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: "pre",
    },
    rightCol: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    tcCard: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "10px",
        overflow: "hidden",
    },
    tcCardHeader: {
        fontSize: "10px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        padding: "10px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.02)",
    },
    noTC: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.2)",
        padding: "14px",
        fontStyle: "italic",
    },
    tcRow: {
        padding: "10px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        borderLeft: "2px solid",
    },
    tcTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
    },
    tcStatus: {
        fontSize: "12px",
        fontWeight: 600,
    },
    tcTimeSmall: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.2)",
    },
    tcErrorMsg: {
        fontSize: "11px",
        color: "#f87171",
        fontStyle: "italic",
        marginTop: "4px",
    },
    tcDiff: {
        marginTop: "4px",
    },
    tcDiffRow: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginBottom: "3px",
    },
    tcDiffKey: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.2)",
        minWidth: "55px",
        letterSpacing: "0.05em",
    },
    tcDiffVal: {
        fontSize: "11px",
        color: "#a3e635",
        fontFamily: "inherit",
    },
    feedbackCard: {
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: "10px",
        padding: "14px",
        flex: 1,
    },
    feedbackHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
    },
    feedbackIcon: {
        fontSize: "14px",
        color: "#a78bfa",
    },
    feedbackTitle: {
        fontSize: "11px",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
    },
    feedbackLoading: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
    },
    spinner: {
        width: "16px",
        height: "16px",
        border: "2px solid rgba(139,92,246,0.2)",
        borderTop: "2px solid #a78bfa",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        flexShrink: 0,
    },
    feedbackText: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.6)",
        lineHeight: 1.8,
        margin: 0,
        whiteSpace: "pre-wrap",
    },
    feedbackMuted: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.2)",
        fontStyle: "italic",
        margin: 0,
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginTop: "16px",
    },
    secondaryBtn: {
        fontSize: "13px",
        padding: "10px 24px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        fontFamily: "inherit",
    },
    primaryBtn: {
        fontSize: "13px",
        fontWeight: 600,
        padding: "10px 28px",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: "0 0 24px rgba(139,92,246,0.2)",
    },
};