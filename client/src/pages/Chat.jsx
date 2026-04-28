import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";
import { Send, ChevronLeft, Users, MoreVertical } from "lucide-react";

const Chat = () => {
    const { groupId } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const tempUserId = "123456789012345678901234";
    const tempUsername = "You";

    useEffect(() => {
        if (!groupId) return;
        socket.emit("joinGroup", groupId);
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => socket.off("receiveMessage");
    }, [groupId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        socket.emit("sendMessage", {
            groupId,
            text: message,
            userId: tempUserId,
            username: tempUsername,
        });
        setMessage("");
    };

    const formatTime = (ts) => {
        const d = ts ? new Date(ts) : new Date();
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Group consecutive messages from same sender
    const grouped = messages.reduce((acc, msg, i) => {
        const prev = messages[i - 1];
        const isMe = msg.sender === tempUserId || msg.userId === tempUserId;
        const sameSender = prev && (prev.sender === msg.sender || prev.userId === msg.userId);
        const sameBlock = sameSender;
        acc.push({ ...msg, isMe, sameBlock });
        return acc;
    }, []);

    // Avatar initials from username
    const getInitials = (name = "?") =>
        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    // Consistent color per user
    const avatarColors = [
        "bg-purple-500/20 text-purple-400",
        "bg-amber-500/20 text-amber-400",
        "bg-green-500/20 text-green-400",
        "bg-pink-500/20 text-pink-400",
        "bg-red-500/20 text-red-400",
        "bg-teal-500/20 text-teal-400",
    ];
    const colorCache = {};
    const getColor = (id) => {
        if (!colorCache[id]) {
            const keys = Object.keys(colorCache).length;
            colorCache[id] = avatarColors[keys % avatarColors.length];
        }
        return colorCache[id];
    };

    return (
        <div className="h-screen flex flex-col bg-[#e5e5e5] dark:bg-[#080B16] transition-colors duration-500">

            {/* ── HEADER ── */}
            <div className="flex-shrink-0 px-6 py-3 bg-white dark:bg-[#0A0C14] border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between mt-[72px]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Group avatar */}
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Users size={17} className="text-blue-500" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                            Engineering Squad
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                12 members online
                            </span>
                        </div>
                    </div>
                </div>

                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all">
                    <MoreVertical size={17} />
                </button>
            </div>

            {/* ── MESSAGE FEED ── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <div className="max-w-3xl mx-auto flex flex-col gap-0.5">

                    {grouped.map((msg, i) => {
                        const senderId = msg.sender || msg.userId;
                        const isMe = msg.isMe;
                        const showMeta = !msg.sameBlock;
                        const username = msg.username || (isMe ? "You" : "User");
                        const initials = getInitials(username);
                        const color = isMe ? null : getColor(senderId);

                        return (
                            <div
                                key={i}
                                className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} ${msg.sameBlock ? "mt-0.5" : "mt-4"}`}
                            >
                                {/* Avatar — only shown on first msg of a block, hidden for me */}
                                {!isMe ? (
                                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mb-0.5 ${showMeta ? color : "opacity-0"}`}>
                                        {initials}
                                    </div>
                                ) : (
                                    <div className="w-7 flex-shrink-0" />
                                )}

                                <div className={`flex flex-col gap-0.5 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                                    {/* Username + time — only on first of block */}
                                    {showMeta && (
                                        <div className={`flex items-baseline gap-2 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                            <span className={`text-[11px] font-semibold ${isMe ? "text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                                                {isMe ? "You" : username}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-600">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div className={`px-4 py-2.5 text-[13px] leading-relaxed font-medium break-words
                                        ${isMe
                                            ? "bg-blue-500 text-white rounded-2xl rounded-tr-sm"
                                            : "bg-white dark:bg-[#0A0C14] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/[0.05] rounded-2xl rounded-tl-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* Time under last bubble in block (mine only) */}
                                    {isMe && (i === grouped.length - 1 || !grouped[i + 1]?.sameBlock) && (
                                        <span className="text-[10px] text-gray-400 dark:text-gray-600 px-1">
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* ── INPUT BAR ── */}
            <div className="flex-shrink-0 px-4 pb-6 pt-3 bg-transparent">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Message…"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/[0.06] rounded-2xl py-3.5 px-5 pr-5 outline-none focus:border-blue-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        className="w-11 h-11 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl transition-all active:scale-90 shadow-lg shadow-blue-500/25 flex-shrink-0"
                    >
                        <Send size={17} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;