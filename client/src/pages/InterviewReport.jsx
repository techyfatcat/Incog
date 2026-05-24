// client/src/pages/InterviewReport.jsx
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ScoreRing({ score }) {
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const dash = (score / 100) * circ;
    const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
    const verdict = score >= 80 ? "Excellent" : score >= 65 ? "Strong" : score >= 50 ? "Average" : "Needs Work";

    return (
        <div className="rep-ring-wrap">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e1e2e" strokeWidth="10" />
                <circle
                    cx="70" cy="70" r={radius} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: "stroke-dasharray 1.5s ease" }}
                />
            </svg>
            <div className="rep-ring-inner">
                <span className="rep-ring-score" style={{ color }}>{score}</span>
                <span className="rep-ring-label">/ 100</span>
                <span className="rep-ring-verdict" style={{ color }}>{verdict}</span>
            </div>
        </div>
    );
}

function ScoreBar({ label, value }) {
    const color = value >= 75 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
    return (
        <div className="rep-bar">
            <div className="rep-bar-header">
                <span className="rep-bar-label">{label}</span>
                <span className="rep-bar-val" style={{ color }}>{value}%</span>
            </div>
            <div className="rep-bar-track">
                <div className="rep-bar-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
            </div>
        </div>
    );
}

function QAAccordion({ items }) {
    const [open, setOpen] = useState(null);
    return (
        <div className="rep-accordion">
            {items.map((item, i) => (
                <div key={i} className={`rep-acc-item ${open === i ? "rep-acc-item--open" : ""}`}>
                    <button className="rep-acc-trigger" onClick={() => setOpen(open === i ? null : i)}>
                        <span className="rep-acc-q">Q{i + 1}: {item.question}</span>
                        <span className="rep-acc-score" style={{ color: item.score >= 7 ? "#22c55e" : item.score >= 5 ? "#f59e0b" : "#ef4444" }}>
                            {item.score}/10 {open === i ? "▲" : "▼"}
                        </span>
                    </button>
                    {open === i && (
                        <div className="rep-acc-body">
                            <div className="rep-acc-section">
                                <div className="rep-acc-section-label">Your Answer</div>
                                <div className="rep-acc-text">{item.candidateAnswer}</div>
                            </div>
                            <div className="rep-acc-section">
                                <div className="rep-acc-section-label rep-acc-section-label--ideal">Ideal Answer</div>
                                <div className="rep-acc-text rep-acc-text--ideal">{item.idealAnswer}</div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function InterviewReport() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const report = state?.report;
    const config = state?.config;

    if (!report) {
        return (
            <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: "2rem" }}>😕</div>
                <div>No report found.</div>
                <button onClick={() => navigate("/mock-interview")} style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: 10, color: "white", cursor: "pointer" }}>
                    Start New Interview
                </button>
            </div>
        );
    }

    const hiringColors = {
        "Strong Hire": "#22c55e",
        "Hire": "#86efac",
        "Maybe": "#f59e0b",
        "No Hire": "#ef4444",
    };

    return (
        <div className="rep-page">
            <style>{`
        .rep-page {
          min-height: 100vh;
          background: #080810;
          color: #e8e8f0;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          padding: 40px 20px 80px;
        }
        .rep-container { max-width: 860px; margin: 0 auto; }
        .rep-header { text-align: center; margin-bottom: 48px; }
        .rep-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8; padding: 4px 14px; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .rep-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
          background: linear-gradient(135deg, #e8e8f0 0%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 8px;
        }
        .rep-meta { color: #6b7280; font-size: 0.88rem; }
        .rep-meta span { margin: 0 8px; }

        /* Ring */
        .rep-hero { display: flex; align-items: center; gap: 40px; background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 20px; padding: 36px; margin-bottom: 24px; }
        @media(max-width:600px){.rep-hero{flex-direction:column;}}
        .rep-ring-wrap { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
        .rep-ring-inner { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .rep-ring-score { font-size: 2.2rem; font-weight: 900; line-height: 1; }
        .rep-ring-label { font-size: 0.75rem; color: #6b7280; }
        .rep-ring-verdict { font-size: 0.78rem; font-weight: 700; margin-top: 2px; }
        .rep-hero-info { flex: 1; }
        .rep-summary { font-size: 1rem; color: #c4c4d4; line-height: 1.7; margin-bottom: 20px; }
        .rep-hiring {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 20px; border-radius: 999px; font-weight: 700; font-size: 0.9rem;
        }

        /* Grid cards */
        .rep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        @media(max-width:600px){.rep-grid{grid-template-columns:1fr;}}
        .rep-card { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 16px; padding: 24px; }
        .rep-card-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4b5563; margin-bottom: 16px; }
        .rep-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .rep-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.88rem; color: #c4c4d4; line-height: 1.5; }
        .rep-list-icon { flex-shrink: 0; margin-top: 1px; }

        /* Score bars */
        .rep-bars-card { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .rep-bar { margin-bottom: 16px; }
        .rep-bar:last-child { margin-bottom: 0; }
        .rep-bar-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .rep-bar-label { font-size: 0.82rem; color: #9ca3af; }
        .rep-bar-val { font-size: 0.85rem; font-weight: 700; }
        .rep-bar-track { height: 6px; background: #1e1e2e; border-radius: 3px; overflow: hidden; }
        .rep-bar-fill { height: 100%; border-radius: 3px; transition: width 1.2s ease; }

        /* Suggestions */
        .rep-suggestions { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .rep-suggestion { display: flex; gap: 12px; padding: 12px; background: #13131f; border-radius: 10px; border-left: 3px solid #6366f1; margin-bottom: 10px; font-size: 0.88rem; color: #c4c4d4; line-height: 1.5; }
        .rep-suggestion:last-child { margin-bottom: 0; }

        /* Q&A Accordion */
        .rep-qa { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .rep-accordion { display: flex; flex-direction: column; gap: 8px; }
        .rep-acc-item { background: #13131f; border: 1px solid #1e1e2e; border-radius: 12px; overflow: hidden; }
        .rep-acc-item--open { border-color: #6366f1; }
        .rep-acc-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: none; border: none; color: #e8e8f0; cursor: pointer; text-align: left; }
        .rep-acc-q { font-size: 0.87rem; font-weight: 600; flex: 1; }
        .rep-acc-score { font-size: 0.8rem; font-weight: 700; white-space: nowrap; }
        .rep-acc-body { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 12px; }
        .rep-acc-section {}
        .rep-acc-section-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; }
        .rep-acc-section-label--ideal { color: #6366f1; }
        .rep-acc-text { font-size: 0.85rem; color: #9ca3af; line-height: 1.6; }
        .rep-acc-text--ideal { color: #c4c4d4; }

        /* Actions */
        .rep-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .rep-btn {
          padding: 12px 24px; border-radius: 10px; font-weight: 600;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: none;
        }
        .rep-btn-primary { background: linear-gradient(135deg, #6366f1, #818cf8); color: white; }
        .rep-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .rep-btn-ghost { background: #13131f; border: 1px solid #1e1e2e; color: #9ca3af; }
        .rep-btn-ghost:hover { color: #e8e8f0; border-color: #6366f1; }
      `}</style>

            <div className="rep-container">
                {/* Header */}
                <div className="rep-header">
                    <div className="rep-badge">📊 Interview Report</div>
                    <h1 className="rep-title">Your Performance Report</h1>
                    <div className="rep-meta">
                        <span>💼 {config?.role}</span>
                        <span>•</span>
                        <span>🏢 {config?.companyType}</span>
                        <span>•</span>
                        <span>🎯 {config?.round}</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Hero Score */}
                <div className="rep-hero">
                    <ScoreRing score={report.overallScore || 0} />
                    <div className="rep-hero-info">
                        <p className="rep-summary">{report.summary}</p>
                        <div
                            className="rep-hiring"
                            style={{
                                background: `${hiringColors[report.hiringRecommendation] || "#6366f1"}20`,
                                border: `1px solid ${hiringColors[report.hiringRecommendation] || "#6366f1"}40`,
                                color: hiringColors[report.hiringRecommendation] || "#818cf8",
                            }}
                        >
                            {report.hiringRecommendation === "Strong Hire" ? "⭐" :
                                report.hiringRecommendation === "Hire" ? "✅" :
                                    report.hiringRecommendation === "Maybe" ? "🤔" : "❌"}
                            Recommendation: {report.hiringRecommendation}
                        </div>
                    </div>
                </div>

                {/* Score Breakdown */}
                {report.scores && (
                    <div className="rep-bars-card">
                        <div className="rep-card-title">Score Breakdown</div>
                        <ScoreBar label="Communication" value={report.scores.communication} />
                        <ScoreBar label="Technical Depth" value={report.scores.technicalDepth} />
                        <ScoreBar label="Confidence" value={report.scores.confidence} />
                        <ScoreBar label="Clarity" value={report.scores.clarity} />
                        <ScoreBar label="Problem Solving" value={report.scores.problemSolving} />
                    </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="rep-grid">
                    {report.strengths?.length > 0 && (
                        <div className="rep-card">
                            <div className="rep-card-title">💪 Strengths</div>
                            <ul className="rep-list">
                                {report.strengths.map((s, i) => (
                                    <li key={i}><span className="rep-list-icon">✅</span>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {report.weaknesses?.length > 0 && (
                        <div className="rep-card">
                            <div className="rep-card-title">🎯 Areas to Improve</div>
                            <ul className="rep-list">
                                {report.weaknesses.map((w, i) => (
                                    <li key={i}><span className="rep-list-icon">⚠️</span>{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Suggestions */}
                {report.suggestions?.length > 0 && (
                    <div className="rep-suggestions">
                        <div className="rep-card-title">💡 AI Suggestions</div>
                        {report.suggestions.map((s, i) => (
                            <div key={i} className="rep-suggestion">
                                <span>🔹</span>
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Q&A Review */}
                {report.questionsAsked?.length > 0 && (
                    <div className="rep-qa">
                        <div className="rep-card-title">📋 Questions Review ({report.questionsAsked.length} questions)</div>
                        <QAAccordion items={report.questionsAsked} />
                    </div>
                )}

                {/* Actions */}
                <div className="rep-actions">
                    <button className="rep-btn rep-btn-primary" onClick={() => navigate("/mock-interview")}>
                        🔄 Start New Interview
                    </button>
                    <button className="rep-btn rep-btn-ghost" onClick={() => window.print()}>
                        🖨️ Print Report
                    </button>
                    <button
                        className="rep-btn rep-btn-ghost"
                        onClick={() => {
                            const text = `🎙️ Mock Interview Score: ${report.overallScore}/100\n📊 Verdict: ${report.verdict}\n🏆 ${report.hiringRecommendation}\n\nPracticed on Incog 🚀`;
                            navigator.clipboard.writeText(text);
                            alert("Copied to clipboard! Share on LinkedIn 🎉");
                        }}
                    >
                        📤 Share Score
                    </button>
                </div>
            </div>
        </div>
    );
}