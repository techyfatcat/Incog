// client/src/pages/MockInterview.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
    { id: "frontend", label: "Frontend Dev", icon: "⚡" },
    { id: "backend", label: "Backend Dev", icon: "⚙️" },
    { id: "fullstack", label: "Full Stack", icon: "🔥" },
    { id: "sde", label: "SDE", icon: "💻" },
    { id: "data-science", label: "Data Science", icon: "📊" },
    { id: "ml-engineer", label: "ML Engineer", icon: "🤖" },
    { id: "devops", label: "DevOps", icon: "🛠️" },
    { id: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
    { id: "product-manager", label: "Product Manager", icon: "🎯" },
    { id: "hr", label: "HR", icon: "🤝" },
    { id: "marketing", label: "Marketing", icon: "📣" },
    { id: "analyst", label: "Business Analyst", icon: "📈" },
];

const COMPANY_TYPES = [
    { id: "faang", label: "FAANG / Big Tech", sub: "Google, Meta, Amazon...", icon: "🏆" },
    { id: "startup", label: "Startup", sub: "Fast-paced, ownership-driven", icon: "🚀" },
    { id: "product", label: "Product-Based", sub: "Flipkart, Paytm, Swiggy...", icon: "📦" },
    { id: "service", label: "Service-Based", sub: "TCS, Infosys, Wipro...", icon: "🏢" },
];

const ROUNDS = [
    { id: "hr", label: "HR Round", icon: "💬" },
    { id: "technical", label: "Technical", icon: "🔧" },
    { id: "dsa", label: "DSA / Coding", icon: "{ }" },
    { id: "system-design", label: "System Design", icon: "🗂️" },
    { id: "behavioral", label: "Behavioral", icon: "🌟" },
];

const DIFFICULTIES = [
    { id: "easy", label: "Easy", color: "#22c55e", desc: "Fundamentals, entry-level" },
    { id: "medium", label: "Medium", color: "#f59e0b", desc: "Intermediate, 1-3 yrs exp" },
    { id: "hard", label: "Hard", color: "#ef4444", desc: "Senior, deep expertise" },
];

const DURATIONS = [
    { id: 15, label: "15 min", sub: "Quick warmup" },
    { id: 30, label: "30 min", sub: "Standard" },
    { id: 45, label: "45 min", sub: "Full interview" },
    { id: 60, label: "60 min", sub: "Deep dive" },
];

const LANGUAGES = ["English", "Hindi", "Hinglish", "Tamil", "Telugu"];

export default function MockInterview() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [config, setConfig] = useState({
        role: "",
        companyType: "",
        round: "",
        difficulty: "medium",
        duration: 30,
        language: "English",
    });

    const set = (key, val) => setConfig((p) => ({ ...p, [key]: val }));

    const canProceed = [
        config.role,
        config.companyType,
        config.round,
        config.difficulty,
    ][step] || step === 3;

    const steps = [
        {
            title: "What role are you interviewing for?",
            sub: "Pick the position that matches your goal",
            content: (
                <div className="mi-grid mi-grid-4">
                    {ROLES.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => set("role", r.id)}
                            className={`mi-chip ${config.role === r.id ? "mi-chip--active" : ""}`}
                        >
                            <span className="mi-chip-icon">{r.icon}</span>
                            <span>{r.label}</span>
                        </button>
                    ))}
                </div>
            ),
        },
        {
            title: "Which company type?",
            sub: "This shapes the interview style and expectations",
            content: (
                <div className="mi-grid mi-grid-2">
                    {COMPANY_TYPES.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => set("companyType", c.id)}
                            className={`mi-card-btn ${config.companyType === c.id ? "mi-card-btn--active" : ""}`}
                        >
                            <span className="mi-card-icon">{c.icon}</span>
                            <div>
                                <div className="mi-card-label">{c.label}</div>
                                <div className="mi-card-sub">{c.sub}</div>
                            </div>
                        </button>
                    ))}
                </div>
            ),
        },
        {
            title: "Select interview round",
            sub: "Each round has a distinct AI interviewer persona",
            content: (
                <div className="mi-grid mi-grid-3">
                    {ROUNDS.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => set("round", r.id)}
                            className={`mi-chip mi-chip--lg ${config.round === r.id ? "mi-chip--active" : ""}`}
                        >
                            <span className="mi-chip-icon">{r.icon}</span>
                            <span>{r.label}</span>
                        </button>
                    ))}
                </div>
            ),
        },
        {
            title: "Customize your session",
            sub: "Set difficulty, duration and language",
            content: (
                <div className="mi-custom">
                    <div className="mi-section">
                        <label className="mi-label">Difficulty</label>
                        <div className="mi-grid mi-grid-3">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => set("difficulty", d.id)}
                                    className={`mi-diff-btn ${config.difficulty === d.id ? "mi-diff-btn--active" : ""}`}
                                    style={{ "--diff-color": d.color }}
                                >
                                    <span className="mi-diff-label">{d.label}</span>
                                    <span className="mi-diff-desc">{d.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mi-section">
                        <label className="mi-label">Duration</label>
                        <div className="mi-grid mi-grid-4">
                            {DURATIONS.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => set("duration", d.id)}
                                    className={`mi-chip ${config.duration === d.id ? "mi-chip--active" : ""}`}
                                >
                                    <span style={{ fontWeight: 700 }}>{d.label}</span>
                                    <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{d.sub}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mi-section">
                        <label className="mi-label">Language</label>
                        <div className="mi-grid mi-grid-5">
                            {LANGUAGES.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => set("language", l)}
                                    className={`mi-chip ${config.language === l ? "mi-chip--active" : ""}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const handleStart = () => {
        navigate("/mock-interview/room", { state: { config } });
    };

    return (
        <div className="mi-page">
            <style>{`
        .mi-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e8f0;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px 80px;
        }
        .mi-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .mi-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          padding: 4px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .mi-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #e8e8f0 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin: 0 0 12px;
        }
        .mi-sub {
          color: #6b7280;
          font-size: 1rem;
        }
        .mi-stepper-wrap {
          width: 100%;
          max-width: 720px;
        }
        .mi-progress-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 40px;
        }
        .mi-progress-seg {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: #1e1e2e;
          overflow: hidden;
        }
        .mi-progress-seg-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transition: width 0.4s ease;
        }
        .mi-step-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 6px;
        }
        .mi-step-sub {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 28px;
        }
        .mi-grid { display: grid; gap: 10px; }
        .mi-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .mi-grid-3 { grid-template-columns: repeat(3, 1fr); }
        .mi-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .mi-grid-5 { grid-template-columns: repeat(5, 1fr); }
        @media(max-width: 600px) {
          .mi-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .mi-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .mi-grid-5 { grid-template-columns: repeat(3, 1fr); }
        }
        .mi-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 10px;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          color: #9ca3af;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .mi-chip:hover { border-color: #6366f1; color: #e8e8f0; transform: translateY(-2px); }
        .mi-chip--active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #818cf8; }
        .mi-chip--lg { padding: 18px 12px; font-size: 0.9rem; }
        .mi-chip-icon { font-size: 1.4rem; }
        .mi-card-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 14px;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .mi-card-btn:hover { border-color: #6366f1; color: #e8e8f0; transform: translateY(-2px); }
        .mi-card-btn--active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #e8e8f0; }
        .mi-card-icon { font-size: 2rem; flex-shrink: 0; }
        .mi-card-label { font-weight: 700; font-size: 1rem; color: inherit; }
        .mi-card-sub { font-size: 0.8rem; opacity: 0.6; margin-top: 2px; }
        .mi-custom { display: flex; flex-direction: column; gap: 28px; }
        .mi-section {}
        .mi-label { display: block; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; }
        .mi-diff-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mi-diff-btn:hover { border-color: var(--diff-color); transform: translateY(-2px); }
        .mi-diff-btn--active { background: color-mix(in srgb, var(--diff-color) 12%, transparent); border-color: var(--diff-color); }
        .mi-diff-label { font-weight: 700; font-size: 1rem; color: var(--diff-color); }
        .mi-diff-desc { font-size: 0.72rem; color: #6b7280; text-align: center; }
        .mi-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 36px;
        }
        .mi-btn {
          padding: 12px 28px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .mi-btn-ghost { background: #13131f; border: 1px solid #1e1e2e; color: #6b7280; }
        .mi-btn-ghost:hover { color: #e8e8f0; border-color: #6b7280; }
        .mi-btn-primary {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: white;
        }
        .mi-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .mi-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
        .mi-btn-start {
          width: 100%;
          padding: 16px;
          font-size: 1.1rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: white;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 36px;
        }
        .mi-btn-start:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.45); }
        .mi-step-count { color: #6b7280; font-size: 0.85rem; }
        .mi-summary {
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .mi-summary-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.82rem;
          color: #818cf8;
        }
      `}</style>

            <div className="mi-header">
                <div className="mi-badge">🎙️ AI Interviewer</div>
                <h1 className="mi-title">Mock Interview</h1>
                <p className="mi-sub">Practice with a real AI interviewer. Get instant feedback.</p>
            </div>

            <div className="mi-stepper-wrap">
                {/* Progress */}
                <div className="mi-progress-bar">
                    {steps.map((_, i) => (
                        <div key={i} className="mi-progress-seg">
                            <div
                                className="mi-progress-seg-fill"
                                style={{ width: i <= step ? "100%" : "0%" }}
                            />
                        </div>
                    ))}
                </div>

                {/* Step content */}
                <div className="mi-step-title">{steps[step].title}</div>
                <div className="mi-step-sub">{steps[step].sub}</div>
                {steps[step].content}

                {/* Summary tags on last step */}
                {step === steps.length - 1 && (
                    <div className="mi-summary">
                        {config.role && <span className="mi-summary-tag">💼 {ROLES.find(r => r.id === config.role)?.label}</span>}
                        {config.companyType && <span className="mi-summary-tag">🏢 {COMPANY_TYPES.find(c => c.id === config.companyType)?.label}</span>}
                        {config.round && <span className="mi-summary-tag">🎯 {ROUNDS.find(r => r.id === config.round)?.label}</span>}
                        <span className="mi-summary-tag">⚡ {config.difficulty}</span>
                        <span className="mi-summary-tag">⏱ {config.duration} min</span>
                        <span className="mi-summary-tag">🌐 {config.language}</span>
                    </div>
                )}

                {/* Navigation */}
                {step < steps.length - 1 ? (
                    <div className="mi-nav">
                        <button
                            className="mi-btn mi-btn-ghost"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                        >
                            ← Back
                        </button>
                        <span className="mi-step-count">Step {step + 1} of {steps.length}</span>
                        <button
                            className="mi-btn mi-btn-primary"
                            onClick={() => setStep((s) => s + 1)}
                            disabled={!canProceed}
                        >
                            Next →
                        </button>
                    </div>
                ) : (
                    <button className="mi-btn-start" onClick={handleStart}>
                        🚀 Start Interview
                    </button>
                )}
            </div>
        </div>
    );
}