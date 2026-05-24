// client/src/pages/InterviewRoom.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";

// ─── Speech helpers ──────────────────────────────────────────────────────────
function useSpeech() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef(null);

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.95;
        utt.pitch = 1;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
    }, []);

    const startListening = useCallback((onResult) => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return alert("Speech recognition not supported in this browser.");
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = false;
        rec.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            onResult(transcript);
        };
        rec.onend = () => setIsListening(false);
        rec.onerror = () => setIsListening(false);
        recognitionRef.current = rec;
        rec.start();
        setIsListening(true);
    }, []);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    return { speak, startListening, stopListening, isListening, isSpeaking };
}

// ─── Confidence Meter ─────────────────────────────────────────────────────────
function ConfidenceMeter({ label, value }) {
    const color = value >= 75 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
    const icon = value >= 75 ? "🟢" : value >= 50 ? "🟡" : "🔴";
    return (
        <div className="ir-meter">
            <div className="ir-meter-header">
                <span className="ir-meter-label">{icon} {label}</span>
                <span className="ir-meter-val" style={{ color }}>{value}%</span>
            </div>
            <div className="ir-meter-track">
                <div className="ir-meter-fill" style={{ width: `${value}%`, background: color }} />
            </div>
        </div>
    );
}

// ─── Timer ────────────────────────────────────────────────────────────────────
function Timer({ duration, onExpire }) {
    const [seconds, setSeconds] = useState(duration * 60);

    useEffect(() => {
        const id = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) { clearInterval(id); onExpire(); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    const pct = seconds / (duration * 60);
    const color = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#f59e0b" : "#ef4444";

    return (
        <div className="ir-timer">
            <svg viewBox="0 0 36 36" className="ir-timer-ring">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#1e1e2e" strokeWidth="2" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={color} strokeWidth="2"
                    strokeDasharray={`${pct * 100}, 100`} strokeLinecap="round" />
            </svg>
            <span className="ir-timer-text" style={{ color }}>{m}:{s}</span>
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
    const isAi = msg.role === "ai";
    return (
        <div className={`ir-bubble ${isAi ? "ir-bubble--ai" : "ir-bubble--user"}`}>
            {isAi && <div className="ir-avatar">🤖</div>}
            <div className={`ir-bubble-body ${isAi ? "ir-bubble-body--ai" : "ir-bubble-body--user"}`}>
                {msg.content}
                <span className="ir-bubble-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </div>
    );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="ir-bubble ir-bubble--ai">
            <div className="ir-avatar">🤖</div>
            <div className="ir-bubble-body ir-bubble-body--ai ir-typing">
                <span /><span /><span />
            </div>
        </div>
    );
}

// ─── Notes Panel ──────────────────────────────────────────────────────────────
function NotesPanel({ visible, onClose }) {
    const [notes, setNotes] = useState("");
    if (!visible) return null;
    return (
        <div className="ir-notes-overlay" onClick={onClose}>
            <div className="ir-notes-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ir-notes-header">
                    <span>📝 Notes</span>
                    <button onClick={onClose} className="ir-close-btn">✕</button>
                </div>
                <textarea
                    className="ir-notes-area"
                    placeholder="Jot down key points, questions to ask, or things to remember..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InterviewRoom() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const config = state?.config;

    const {
        messages, isAiTyping, isFinished, liveScores, error,
        startInterview, sendMessage, endInterview, generateReport, isGeneratingReport, report,
    } = useInterview(config);

    const { speak, startListening, stopListening, isListening, isSpeaking } = useSpeech();

    const [input, setInput] = useState("");
    const [voiceMode, setVoiceMode] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [sidePanel, setSidePanel] = useState("scores"); // scores | tips
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [started, setStarted] = useState(false);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    // Start interview on mount
    useEffect(() => {
        if (!config) { navigate("/mock-interview"); return; }
        startInterview().then(() => setStarted(true));
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isAiTyping]);

    // Speak AI messages if voice mode
    useEffect(() => {
        if (voiceMode && messages.length > 0) {
            const last = messages[messages.length - 1];
            if (last.role === "ai") speak(last.content);
        }
    }, [messages, voiceMode]);

    // Navigate to report when ready
    useEffect(() => {
        if (report) {
            navigate("/mock-interview/report", { state: { report, config } });
        }
    }, [report]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const handleVoiceSend = () => {
        if (isListening) { stopListening(); return; }
        startListening((transcript) => {
            setInput(transcript);
            setTimeout(() => {
                sendMessage(transcript);
                setInput("");
            }, 300);
        });
    };

    const handleEndInterview = async () => {
        endInterview();
        setIsGeneratingReportLocal(true);
        await generateReport();
    };

    const [isGeneratingReportLocal, setIsGeneratingReportLocal] = useState(false);

    const TIPS = [
        "Structure answers with Situation → Task → Action → Result (STAR).",
        "Pause before answering — it shows you're thinking, not anxious.",
        "Use concrete numbers: 'Improved performance by 40%' > 'Made it faster'.",
        "Ask clarifying questions before diving into system design problems.",
        "When stuck on DSA, talk through brute force first, then optimize.",
        "Maintain eye contact. Nod to acknowledge the interviewer.",
        "End with confident questions: 'What does success look like in 90 days?'",
    ];

    if (!config) return null;

    const roundLabel = {
        hr: "HR Round", technical: "Technical", dsa: "DSA / Coding",
        "system-design": "System Design", behavioral: "Behavioral"
    }[config.round] || config.round;

    return (
        <div className="ir-root">
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ir-root {
          display: flex;
          height: 100vh;
          background: #080810;
          color: #e8e8f0;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          overflow: hidden;
        }

        /* ── Left Sidebar ── */
        .ir-left {
          width: 80px;
          background: #0d0d1a;
          border-right: 1px solid #1a1a2e;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          gap: 20px;
          flex-shrink: 0;
        }
        .ir-left-logo {
          font-size: 1.2rem;
          font-weight: 900;
          color: #6366f1;
        }
        .ir-timer {
          position: relative;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ir-timer-ring {
          position: absolute;
          inset: 0;
          transform: rotate(-90deg);
        }
        .ir-timer-text {
          font-size: 0.65rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .ir-left-divider { width: 40px; height: 1px; background: #1a1a2e; }
        .ir-icon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          font-size: 1.2rem;
          transition: all 0.2s;
        }
        .ir-icon-btn span { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .ir-icon-btn:hover { color: #e8e8f0; background: #1a1a2e; }
        .ir-icon-btn--danger:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
        .ir-round-badge {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6366f1;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          padding: 10px 6px;
          border-radius: 6px;
          margin-top: auto;
        }

        /* ── Center Chat ── */
        .ir-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .ir-chat-header {
          padding: 14px 24px;
          border-bottom: 1px solid #1a1a2e;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0d0d1a;
        }
        .ir-interviewer-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .ir-interviewer-info {}
        .ir-interviewer-name { font-weight: 700; font-size: 0.95rem; }
        .ir-interviewer-status { font-size: 0.75rem; color: #22c55e; display: flex; align-items: center; gap: 4px; }
        .ir-status-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ir-header-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .ir-mode-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 8px;
          padding: 6px 12px;
          color: #6b7280;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ir-mode-toggle--active { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.1); }

        /* Messages */
        .ir-chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }
        .ir-chat-body::-webkit-scrollbar { width: 4px; }
        .ir-chat-body::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 2px; }
        .ir-bubble { display: flex; align-items: flex-end; gap: 10px; }
        .ir-bubble--user { flex-direction: row-reverse; }
        .ir-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .ir-bubble-body {
          max-width: 65%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 0.92rem;
          line-height: 1.6;
          position: relative;
        }
        .ir-bubble-body--ai {
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-bottom-left-radius: 4px;
          color: #e8e8f0;
        }
        .ir-bubble-body--user {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border-bottom-right-radius: 4px;
          color: white;
        }
        .ir-bubble-time { display: block; font-size: 0.65rem; opacity: 0.5; margin-top: 6px; }
        .ir-typing { display: flex; gap: 4px; align-items: center; padding: 14px 18px; }
        .ir-typing span {
          width: 7px; height: 7px; background: #6366f1; border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .ir-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ir-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }

        /* Input */
        .ir-input-area {
          padding: 16px 24px;
          border-top: 1px solid #1a1a2e;
          background: #0d0d1a;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        .ir-textarea {
          flex: 1;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          color: #e8e8f0;
          font-size: 0.92rem;
          padding: 12px 16px;
          resize: none;
          min-height: 46px;
          max-height: 140px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          line-height: 1.5;
        }
        .ir-textarea:focus { border-color: #6366f1; }
        .ir-textarea::placeholder { color: #374151; }
        .ir-send-btn {
          width: 46px; height: 46px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .ir-send-btn:hover { transform: scale(1.05); }
        .ir-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .ir-voice-btn {
          width: 46px; height: 46px;
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          color: #6b7280;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .ir-voice-btn:hover { border-color: #6366f1; color: #818cf8; }
        .ir-voice-btn--active { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #ef4444; animation: ir-pulse 1.5s infinite; }
        @keyframes ir-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }

        /* ── Right Sidebar ── */
        .ir-right {
          width: 260px;
          background: #0d0d1a;
          border-left: 1px solid #1a1a2e;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow-y: auto;
        }
        .ir-right::-webkit-scrollbar { width: 0; }
        .ir-panel-tabs {
          display: flex;
          border-bottom: 1px solid #1a1a2e;
        }
        .ir-panel-tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .ir-panel-tab--active { color: #818cf8; border-bottom-color: #6366f1; }
        .ir-panel-body { padding: 16px; flex: 1; }
        .ir-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4b5563;
          margin-bottom: 12px;
        }
        .ir-meter { margin-bottom: 14px; }
        .ir-meter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .ir-meter-label { font-size: 0.78rem; color: #9ca3af; }
        .ir-meter-val { font-size: 0.82rem; font-weight: 700; }
        .ir-meter-track { height: 5px; background: #1e1e2e; border-radius: 3px; overflow: hidden; }
        .ir-meter-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease, background 0.4s; }

        .ir-tips { display: flex; flex-direction: column; gap: 10px; }
        .ir-tip {
          background: #13131f;
          border: 1px solid #1e1e2e;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.78rem;
          color: #9ca3af;
          line-height: 1.5;
          border-left: 3px solid #6366f1;
        }

        /* Notes */
        .ir-notes-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          z-index: 50; display: flex; align-items: center; justify-content: center;
        }
        .ir-notes-modal {
          background: #13131f; border: 1px solid #1e1e2e;
          border-radius: 16px; width: 500px; max-width: 95vw; padding: 20px;
        }
        .ir-notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 700; }
        .ir-close-btn { background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.1rem; }
        .ir-notes-area {
          width: 100%; height: 280px; background: #080810;
          border: 1px solid #1e1e2e; border-radius: 10px;
          color: #e8e8f0; font-family: inherit; font-size: 0.9rem;
          padding: 14px; resize: none; outline: none;
        }

        /* Finished overlay */
        .ir-finished {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          z-index: 40; display: flex; align-items: center; justify-content: center;
        }
        .ir-finished-card {
          background: #13131f; border: 1px solid #1e1e2e;
          border-radius: 20px; padding: 40px; text-align: center; max-width: 400px;
        }
        .ir-finished-icon { font-size: 3rem; margin-bottom: 16px; }
        .ir-finished-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; }
        .ir-finished-sub { color: #6b7280; font-size: 0.9rem; margin-bottom: 28px; }
        .ir-finished-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border: none; border-radius: 12px;
          color: white; font-weight: 700; font-size: 1rem;
          cursor: pointer; transition: all 0.2s;
        }
        .ir-finished-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .ir-finished-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Error */
        .ir-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin: 0 24px 12px;
        }

        /* Speaking indicator */
        .ir-speaking { color: #6366f1; font-size: 0.75rem; display: flex; align-items: center; gap: 4px; }

        @media (max-width: 768px) {
          .ir-right { display: none; }
          .ir-left { width: 60px; }
          .ir-bubble-body { max-width: 85%; }
        }
      `}</style>

            {/* Left Sidebar */}
            <aside className="ir-left">
                <div className="ir-left-logo">I</div>
                <Timer duration={config.duration} onExpire={endInterview} />
                <div className="ir-left-divider" />
                <button className="ir-icon-btn" onClick={() => setShowNotes(true)} title="Notes">
                    📝<span>Notes</span>
                </button>
                <button
                    className="ir-icon-btn ir-icon-btn--danger"
                    onClick={() => setShowEndConfirm(true)}
                    title="End Interview"
                >
                    ⏹<span>End</span>
                </button>
                <div className="ir-round-badge">{roundLabel}</div>
            </aside>

            {/* Center Chat */}
            <main className="ir-center">
                <div className="ir-chat-header">
                    <div className="ir-interviewer-avatar">🤖</div>
                    <div className="ir-interviewer-info">
                        <div className="ir-interviewer-name">AI Interviewer</div>
                        <div className="ir-interviewer-status">
                            <span className="ir-status-dot" />
                            {isAiTyping ? "Typing..." : isSpeaking ? "Speaking..." : "Active"}
                        </div>
                    </div>
                    <div className="ir-header-right">
                        <button
                            className={`ir-mode-toggle ${voiceMode ? "ir-mode-toggle--active" : ""}`}
                            onClick={() => setVoiceMode((v) => !v)}
                        >
                            🎙️ {voiceMode ? "Voice ON" : "Voice OFF"}
                        </button>
                    </div>
                </div>

                <div className="ir-chat-body" ref={chatRef}>
                    {!started && (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#4b5563" }}>
                            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎙️</div>
                            Connecting to your interviewer...
                        </div>
                    )}
                    {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
                    {isAiTyping && <TypingIndicator />}
                </div>

                {error && <div className="ir-error">⚠️ {error}</div>}

                <div className="ir-input-area">
                    <textarea
                        ref={inputRef}
                        className="ir-textarea"
                        rows={1}
                        placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isAiTyping || isFinished}
                    />
                    <button
                        className={`ir-voice-btn ${isListening ? "ir-voice-btn--active" : ""}`}
                        onClick={handleVoiceSend}
                        title={isListening ? "Stop recording" : "Voice input"}
                        disabled={isAiTyping || isFinished}
                    >
                        {isListening ? "🔴" : "🎙️"}
                    </button>
                    <button
                        className="ir-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isAiTyping || isFinished}
                        title="Send"
                    >
                        ➤
                    </button>
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="ir-right">
                <div className="ir-panel-tabs">
                    <button
                        className={`ir-panel-tab ${sidePanel === "scores" ? "ir-panel-tab--active" : ""}`}
                        onClick={() => setSidePanel("scores")}
                    >
                        Live Score
                    </button>
                    <button
                        className={`ir-panel-tab ${sidePanel === "tips" ? "ir-panel-tab--active" : ""}`}
                        onClick={() => setSidePanel("tips")}
                    >
                        Tips
                    </button>
                </div>
                <div className="ir-panel-body">
                    {sidePanel === "scores" ? (
                        <>
                            <div className="ir-section-title">Live Performance</div>
                            <ConfidenceMeter label="Confidence" value={liveScores.confidence} />
                            <ConfidenceMeter label="Communication" value={liveScores.communication} />
                            <ConfidenceMeter label="Technical Depth" value={liveScores.technicalDepth} />
                            <ConfidenceMeter label="Clarity" value={liveScores.clarity} />
                            <div style={{ marginTop: 20, padding: "12px", background: "#13131f", borderRadius: 10, border: "1px solid #1e1e2e" }}>
                                <div className="ir-section-title">Session Info</div>
                                <div style={{ fontSize: "0.8rem", color: "#9ca3af", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <span>🎯 {config.role}</span>
                                    <span>🏢 {config.companyType}</span>
                                    <span>🔄 {roundLabel}</span>
                                    <span>⚡ {config.difficulty}</span>
                                    <span>💬 {messages.length} messages</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="ir-section-title">Interview Tips</div>
                            <div className="ir-tips">
                                {TIPS.map((tip, i) => (
                                    <div key={i} className="ir-tip">{tip}</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </aside>

            {/* Notes Modal */}
            <NotesPanel visible={showNotes} onClose={() => setShowNotes(false)} />

            {/* End Confirm */}
            {showEndConfirm && (
                <div className="ir-finished">
                    <div className="ir-finished-card">
                        <div className="ir-finished-icon">⏹️</div>
                        <div className="ir-finished-title">End Interview?</div>
                        <div className="ir-finished-sub">Your session will be saved and a performance report will be generated.</div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                style={{ flex: 1, padding: "12px", background: "#13131f", border: "1px solid #1e1e2e", borderRadius: 12, color: "#9ca3af", cursor: "pointer" }}
                                onClick={() => setShowEndConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ir-finished-btn"
                                onClick={handleEndInterview}
                                disabled={isGeneratingReport}
                            >
                                {isGeneratingReport ? "Generating..." : "End & Get Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auto-finish overlay */}
            {isFinished && !showEndConfirm && (
                <div className="ir-finished">
                    <div className="ir-finished-card">
                        <div className="ir-finished-icon">🎉</div>
                        <div className="ir-finished-title">Interview Complete!</div>
                        <div className="ir-finished-sub">Great job! Your AI interviewer has finished. Let's see how you did.</div>
                        <button
                            className="ir-finished-btn"
                            onClick={handleEndInterview}
                            disabled={isGeneratingReport || isGeneratingReportLocal}
                        >
                            {isGeneratingReport || isGeneratingReportLocal ? "⏳ Generating Report..." : "📊 View My Report"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}