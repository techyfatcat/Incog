import { useState } from "react";
import TestInterface from "./TestInterface";
import TestResult from "./TestResult";

const DIFFICULTY_CONFIG = {
    easy: {
        label: "Easy",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.3)",
        time: 30,
        desc: "Warm-up problems — arrays, strings, basic logic",
    },
    medium: {
        label: "Medium",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.1)",
        border: "rgba(245,158,11,0.3)",
        time: 45,
        desc: "Core DSA — trees, DP, sliding window",
    },
    hard: {
        label: "Hard",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.1)",
        border: "rgba(239,68,68,0.3)",
        time: 60,
        desc: "Advanced algorithms — graphs, segment trees",
    },
};

const COMPANY_PRESETS = [
    { name: "Google", logo: "G", color: "#4285F4", topics: ["Arrays", "DP", "Graphs"] },
    { name: "Meta", logo: "M", color: "#0866FF", topics: ["Trees", "Strings", "Recursion"] },
    { name: "Amazon", logo: "A", color: "#FF9900", topics: ["Arrays", "Queues", "Greedy"] },
    { name: "Microsoft", logo: "Ms", color: "#00A4EF", topics: ["DP", "Sorting", "Binary Search"] },
    { name: "Apple", logo: "Ap", color: "#A3AAAE", topics: ["Strings", "Trees", "Math"] },
    { name: "Stripe", logo: "St", color: "#635BFF", topics: ["Arrays", "Hash Maps", "Design"] },
];

const TOPICS = ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "DP", "Sorting", "Binary Search", "Recursion", "Greedy"];

export default function OASimulator() {
    const [phase, setPhase] = useState("lobby"); // lobby | test | result
    const [config, setConfig] = useState({
        difficulty: "medium",
        numProblems: 2,
        topics: [],
        company: null,
    });
    const [testResult, setTestResult] = useState(null);

    const toggleTopic = (topic) => {
        setConfig((c) => ({
            ...c,
            topics: c.topics.includes(topic) ? c.topics.filter((t) => t !== topic) : [...c.topics, topic],
        }));
    };

    const selectCompany = (company) => {
        setConfig((c) => ({
            ...c,
            company: c.company?.name === company.name ? null : company,
            topics: c.company?.name === company.name ? c.topics : company.topics,
        }));
    };

    if (phase === "test") {
        return (
            <TestInterface
                config={config}
                onFinish={(result) => {
                    setTestResult(result);
                    setPhase("result");
                }}
                onExit={() => setPhase("lobby")}
            />
        );
    }

    if (phase === "result") {
        return (
            <TestResult
                result={testResult}
                config={config}
                onRetry={() => setPhase("test")}
                onHome={() => {
                    setTestResult(null);
                    setPhase("lobby");
                }}
            />
        );
    }

    const diff = DIFFICULTY_CONFIG[config.difficulty];

    return (
        <div style={styles.root}>
            {/* Ambient glow */}
            <div style={styles.ambientLeft} />
            <div style={styles.ambientRight} />

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.terminalDots}>
                        <span style={{ ...styles.dot, background: "#ff5f57" }} />
                        <span style={{ ...styles.dot, background: "#febc2e" }} />
                        <span style={{ ...styles.dot, background: "#28c840" }} />
                    </div>
                    <span style={styles.headerTitle}>incog://oa-simulator</span>
                </div>
                <div style={styles.badge}>BETA</div>
            </div>

            <div style={styles.body}>
                {/* Hero */}
                <div style={styles.hero}>
                    <div style={styles.heroTag}>Online Assessment Simulator</div>
                    <h1 style={styles.heroTitle}>
                        Crack the <span style={styles.heroAccent}>OA</span> before the real thing
                    </h1>
                    <p style={styles.heroSub}>
                        Practice timed coding assessments exactly like top tech companies — with a real terminal, AI-powered test cases, and instant feedback.
                    </p>
                </div>

                {/* Config grid */}
                <div style={styles.configGrid}>
                    {/* Left column */}
                    <div style={styles.configCol}>
                        {/* Difficulty */}
                        <div style={styles.card}>
                            <div style={styles.cardLabel}>
                                <span style={styles.labelDot} />
                                Difficulty
                            </div>
                            <div style={styles.diffRow}>
                                {Object.entries(DIFFICULTY_CONFIG).map(([key, d]) => (
                                    <button
                                        key={key}
                                        onClick={() => setConfig((c) => ({ ...c, difficulty: key }))}
                                        style={{
                                            ...styles.diffBtn,
                                            ...(config.difficulty === key
                                                ? { background: d.bg, border: `1px solid ${d.border}`, color: d.color }
                                                : {}),
                                        }}
                                    >
                                        <span style={{ fontWeight: 600 }}>{d.label}</span>
                                        <span style={styles.diffTime}>{d.time}m</span>
                                    </button>
                                ))}
                            </div>
                            <p style={styles.diffDesc}>{diff.desc}</p>
                        </div>

                        {/* Problem count */}
                        <div style={styles.card}>
                            <div style={styles.cardLabel}>
                                <span style={styles.labelDot} />
                                Number of Problems
                            </div>
                            <div style={styles.countRow}>
                                {[1, 2, 3, 4].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setConfig((c) => ({ ...c, numProblems: n }))}
                                        style={{
                                            ...styles.countBtn,
                                            ...(config.numProblems === n
                                                ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa" }
                                                : {}),
                                        }}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topics */}
                        <div style={styles.card}>
                            <div style={styles.cardLabel}>
                                <span style={styles.labelDot} />
                                Topics{" "}
                                <span style={styles.optionalTag}>optional</span>
                            </div>
                            <div style={styles.topicsWrap}>
                                {TOPICS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => toggleTopic(t)}
                                        style={{
                                            ...styles.topicChip,
                                            ...(config.topics.includes(t)
                                                ? { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa" }
                                                : {}),
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={styles.configCol}>
                        {/* Company presets */}
                        <div style={styles.card}>
                            <div style={styles.cardLabel}>
                                <span style={styles.labelDot} />
                                Company Style{" "}
                                <span style={styles.optionalTag}>optional</span>
                            </div>
                            <div style={styles.companyGrid}>
                                {COMPANY_PRESETS.map((co) => (
                                    <button
                                        key={co.name}
                                        onClick={() => selectCompany(co)}
                                        style={{
                                            ...styles.companyBtn,
                                            ...(config.company?.name === co.name
                                                ? { background: `${co.color}18`, border: `1px solid ${co.color}55`, boxShadow: `0 0 12px ${co.color}22` }
                                                : {}),
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...styles.companyLogo,
                                                background: `${co.color}22`,
                                                color: co.color,
                                                border: `1px solid ${co.color}44`,
                                            }}
                                        >
                                            {co.logo}
                                        </div>
                                        <span style={styles.companyName}>{co.name}</span>
                                        <div style={styles.companyTopics}>
                                            {co.topics.map((t) => (
                                                <span key={t} style={styles.companyTopicTag}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Difficulty</span>
                                <span style={{ ...styles.summaryValue, color: diff.color }}>{diff.label}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Problems</span>
                                <span style={styles.summaryValue}>{config.numProblems}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Time Limit</span>
                                <span style={styles.summaryValue}>{diff.time * config.numProblems} min</span>
                            </div>
                            {config.company && (
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>Company Style</span>
                                    <span style={{ ...styles.summaryValue, color: config.company.color }}>{config.company.name}</span>
                                </div>
                            )}
                            {config.topics.length > 0 && (
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>Topics</span>
                                    <span style={styles.summaryValue}>{config.topics.join(", ")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Start button */}
                <div style={styles.startRow}>
                    <button onClick={() => setPhase("test")} style={styles.startBtn}>
                        <span style={styles.startIcon}>▶</span>
                        Start Assessment
                    </button>
                    <p style={styles.startHint}>
                        Your code runs in a sandboxed terminal — no setup needed
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    root: {
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        position: "relative",
        overflow: "hidden",
    },
    ambientLeft: {
        position: "fixed",
        top: "-200px",
        left: "-200px",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
    },
    ambientRight: {
        position: "fixed",
        bottom: "-200px",
        right: "-100px",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
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
    terminalDots: {
        display: "flex",
        gap: "6px",
    },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        display: "inline-block",
    },
    headerTitle: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.05em",
    },
    badge: {
        fontSize: "10px",
        letterSpacing: "0.12em",
        color: "#a78bfa",
        border: "1px solid rgba(139,92,246,0.3)",
        padding: "2px 8px",
        borderRadius: "4px",
        background: "rgba(139,92,246,0.08)",
    },
    body: {
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "48px 24px",
        position: "relative",
        zIndex: 1,
    },
    hero: {
        marginBottom: "48px",
    },
    heroTag: {
        display: "inline-block",
        fontSize: "11px",
        letterSpacing: "0.12em",
        color: "#a78bfa",
        background: "rgba(139,92,246,0.1)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "4px",
        padding: "4px 10px",
        marginBottom: "16px",
        textTransform: "uppercase",
    },
    heroTitle: {
        fontSize: "clamp(32px, 5vw, 52px)",
        fontWeight: 700,
        color: "#f1f5f9",
        lineHeight: 1.15,
        margin: "0 0 16px",
        letterSpacing: "-0.02em",
        fontFamily: "'JetBrains Mono', monospace",
    },
    heroAccent: {
        color: "#a78bfa",
        fontStyle: "italic",
    },
    heroSub: {
        fontSize: "15px",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.7,
        maxWidth: "560px",
        margin: 0,
    },
    configGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "36px",
    },
    configCol: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    card: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "20px",
    },
    cardLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        marginBottom: "14px",
    },
    labelDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#a78bfa",
        display: "inline-block",
    },
    optionalTag: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.2)",
        fontStyle: "italic",
        letterSpacing: "0.05em",
    },
    diffRow: {
        display: "flex",
        gap: "8px",
        marginBottom: "10px",
    },
    diffBtn: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "10px 8px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.5)",
        cursor: "pointer",
        fontSize: "13px",
        transition: "all 0.15s",
    },
    diffTime: {
        fontSize: "10px",
        opacity: 0.7,
        letterSpacing: "0.05em",
    },
    diffDesc: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
        margin: 0,
        fontStyle: "italic",
    },
    countRow: {
        display: "flex",
        gap: "8px",
    },
    countBtn: {
        width: "52px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.5)",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 600,
        transition: "all 0.15s",
    },
    topicsWrap: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    topicChip: {
        fontSize: "12px",
        padding: "5px 12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        color: "rgba(255,255,255,0.5)",
        cursor: "pointer",
        transition: "all 0.15s",
    },
    companyGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
    },
    companyBtn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "12px 8px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.15s",
    },
    companyLogo: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: 700,
    },
    companyName: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 500,
    },
    companyTopics: {
        display: "flex",
        flexWrap: "wrap",
        gap: "3px",
        justifyContent: "center",
    },
    companyTopicTag: {
        fontSize: "9px",
        color: "rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "3px",
        padding: "2px 5px",
    },
    summaryCard: {
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.15)",
        borderRadius: "12px",
        padding: "16px 20px",
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        fontSize: "13px",
    },
    summaryLabel: {
        color: "rgba(255,255,255,0.35)",
    },
    summaryValue: {
        color: "#e2e8f0",
        fontWeight: 500,
    },
    startRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
    },
    startBtn: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 48px",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        boxShadow: "0 0 40px rgba(139,92,246,0.25)",
        fontFamily: "inherit",
        transition: "all 0.2s",
    },
    startIcon: {
        fontSize: "12px",
    },
    startHint: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.25)",
        margin: 0,
    },
};