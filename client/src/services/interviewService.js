// client/src/services/interviewService.js

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export function buildSystemPrompt({ role, companyType, difficulty, round, language }) {
    const difficultyMap = {
        easy: "beginner-friendly, focus on fundamentals",
        medium: "intermediate level, expect solid understanding",
        hard: "senior-level, deep technical probing, no hand-holding",
    };

    const companyMap = {
        startup: "a fast-moving startup that values scrappiness and ownership",
        faang: "a top-tier tech giant (FAANG-style) with bar-raising standards",
        product: "a product-based company focused on innovation and scalability",
        service: "a service-based IT company with process and delivery focus",
    };

    const roundInstructions = {
        hr: `You are an HR interviewer. Ask about background, motivation, culture fit, salary expectations, notice period. Use warm but professional tone.`,
        technical: `You are a senior technical interviewer. Ask conceptual and practical questions about ${role}. Probe deeper on weak answers. Ask about real projects.`,
        dsa: `You are a DSA interviewer. Give one coding problem at a time. Ask the candidate to explain their approach first, then code. Ask about time/space complexity. Move to next problem after each solution.`,
        "system-design": `You are a system design interviewer. Propose open-ended design problems. Listen to their approach, ask clarifying questions, probe on scalability, databases, APIs, trade-offs.`,
        behavioral: `You are a behavioral interviewer. Use the STAR method. Ask about past experiences, conflicts, leadership, failures. Probe for specifics.`,
    };

    return `You are a professional interviewer at ${companyMap[companyType] || "a tech company"}.
You are interviewing a candidate for a ${role} role.
Difficulty: ${difficultyMap[difficulty] || "medium"}.
Interview round: ${round.toUpperCase()}.
Language preference: ${language || "English"}.

${roundInstructions[round] || roundInstructions.technical}

RULES:
- Ask ONE question at a time. Never dump multiple questions.
- After the candidate answers, either ask a follow-up or move to the next question.
- If the answer is weak, probe gently: "Can you elaborate?" or "What about X aspect?"
- If the answer is strong, acknowledge briefly and move on.
- Keep responses concise — you are speaking, not writing an essay.
- After 8-12 exchanges, wrap up naturally: "That's all from my side. Do you have any questions for me?"
- Never reveal you are an AI. Stay in character as a human interviewer.
- Start by introducing yourself briefly and asking the first question.`;
}

export async function sendInterviewMessage({ history, userMessage, systemPrompt }) {
    // Gemini requires at least one content item — on the opening call,
    // seed with a "start" user turn so contents is never empty.
    const messages = [];

    history.forEach((msg) => {
        messages.push({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.content }],
        });
    });

    if (userMessage) {
        messages.push({
            role: "user",
            parts: [{ text: userMessage }],
        });
    }

    // Opening call: no history, no userMessage → seed with a trigger
    if (messages.length === 0) {
        messages.push({
            role: "user",
            parts: [{ text: "Please begin the interview now." }],
        });
    }

    const body = {
        system_instruction: {
            parts: [{ text: systemPrompt }],
        },
        contents: messages,
        generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 400,
            topP: 0.9,
        },
    };

    const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${res.status}`;
        console.error("Gemini error:", msg, err);
        throw new Error(msg);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        console.error("Gemini empty response:", data);
        throw new Error("Empty response from Gemini");
    }
    return text;
}

export async function generateInterviewReport({ config, conversationHistory }) {
    const transcript = conversationHistory
        .map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.content}`)
        .join("\n\n");

    const prompt = `You just conducted a ${config.round} interview for a ${config.role} position at ${config.companyType} level.

Here is the full transcript:
${transcript}

Generate a detailed interview evaluation report in STRICT JSON format (no markdown, no backticks):
{
  "overallScore": <number 0-100>,
  "verdict": "<Excellent|Strong|Average|Needs Improvement>",
  "summary": "<2-3 sentence overall summary>",
  "scores": {
    "communication": <0-100>,
    "technicalDepth": <0-100>,
    "confidence": <0-100>,
    "clarity": <0-100>,
    "problemSolving": <0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "questionsAsked": [
    {
      "question": "<exact question>",
      "candidateAnswer": "<summary of what candidate said>",
      "idealAnswer": "<what an ideal answer looks like>",
      "score": <0-10>
    }
  ],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "hiringRecommendation": "<Strong Hire|Hire|Maybe|No Hire>"
}`;

    const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Report generation error:", err);
        throw new Error("Failed to generate report");
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    try {
        const clean = raw.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch (e) {
        console.error("Failed to parse report JSON:", raw);
        return null;
    }
}