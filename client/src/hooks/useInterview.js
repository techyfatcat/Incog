// client/src/hooks/useInterview.js
import { useState, useRef, useCallback, useEffect } from "react";
import { sendInterviewMessage, buildSystemPrompt, generateInterviewReport } from "../services/interviewService";

export function useInterview(config) {
    const [messages, setMessages] = useState([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [report, setReport] = useState(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [liveScores, setLiveScores] = useState({
        confidence: 70,
        communication: 70,
        technicalDepth: 70,
        clarity: 70,
    });
    const [error, setError] = useState(null);

    const systemPromptRef = useRef(null);
    const messagesRef = useRef([]);

    // Keep messagesRef in sync
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Init system prompt and start interview
    const startInterview = useCallback(async () => {
        if (!config) return;
        systemPromptRef.current = buildSystemPrompt(config);
        setIsAiTyping(true);
        setError(null);

        try {
            const opening = await sendInterviewMessage({
                history: [],
                userMessage: null,
                systemPrompt: systemPromptRef.current,
            });

            const aiMsg = { id: Date.now(), role: "ai", content: opening, timestamp: new Date() };
            setMessages([aiMsg]);
        } catch (e) {
            setError("Failed to connect to AI interviewer. Check your Gemini API key.");
        } finally {
            setIsAiTyping(false);
        }
    }, [config]);

    // Send user message and get AI response
    const sendMessage = useCallback(async (userText) => {
        if (!userText.trim() || isAiTyping || isFinished) return;

        const userMsg = { id: Date.now(), role: "user", content: userText, timestamp: new Date() };
        const updatedHistory = [...messagesRef.current, userMsg];

        setMessages(updatedHistory);
        setIsAiTyping(true);
        setError(null);

        // Simulate live score fluctuation based on response length/quality heuristic
        updateLiveScores(userText);

        try {
            const aiText = await sendInterviewMessage({
                history: messagesRef.current,
                userMessage: userText,
                systemPrompt: systemPromptRef.current,
            });

            const aiMsg = { id: Date.now() + 1, role: "ai", content: aiText, timestamp: new Date() };
            setMessages((prev) => [...prev, aiMsg]);

            // Check if interview is wrapping up
            const wrapPhrases = ["that's all from my side", "do you have any questions for me", "thank you for your time", "we'll be in touch"];
            if (wrapPhrases.some((p) => aiText.toLowerCase().includes(p))) {
                setTimeout(() => setIsFinished(true), 2000);
            }
        } catch (e) {
            setError("Connection error. Please try again.");
        } finally {
            setIsAiTyping(false);
        }
    }, [isAiTyping, isFinished]);

    // Heuristic live score update
    const updateLiveScores = (text) => {
        const wordCount = text.split(" ").length;
        const hasStructure = text.includes("first") || text.includes("because") || text.includes("for example");
        const isTooShort = wordCount < 10;

        setLiveScores((prev) => ({
            confidence: clamp(prev.confidence + (isTooShort ? -3 : wordCount > 50 ? 3 : 1), 20, 99),
            communication: clamp(prev.communication + (hasStructure ? 3 : -1), 20, 99),
            technicalDepth: clamp(prev.technicalDepth + (wordCount > 40 ? 2 : -2), 20, 99),
            clarity: clamp(prev.clarity + (isTooShort ? -2 : 2), 20, 99),
        }));
    };

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // End interview manually
    const endInterview = useCallback(() => {
        setIsFinished(true);
    }, []);

    // Generate final report
    const generateReport = useCallback(async () => {
        setIsGeneratingReport(true);
        try {
            const result = await generateInterviewReport({
                config,
                conversationHistory: messagesRef.current,
            });
            setReport(result);
        } catch (e) {
            setError("Failed to generate report.");
        } finally {
            setIsGeneratingReport(false);
        }
    }, [config]);

    return {
        messages,
        isAiTyping,
        isFinished,
        report,
        isGeneratingReport,
        liveScores,
        error,
        startInterview,
        sendMessage,
        endInterview,
        generateReport,
    };
}