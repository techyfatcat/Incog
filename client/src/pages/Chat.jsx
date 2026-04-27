import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";

const Chat = () => {
    const { groupId } = useParams();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const bottomRef = useRef(null);

    // 🔥 TEMP USER (for testing)
    const tempUserId = "123456789012345678901234"; // valid ObjectId format

    useEffect(() => {
        if (!groupId) return;

        // join room immediately (no user dependency)
        socket.emit("joinGroup", groupId);

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [groupId]);

    // auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;

        console.log("Sending message:", message);

        socket.emit("sendMessage", {
            groupId,
            text: message,
            userId: tempUserId, // 🔥 TEMP FIX
        });

        setMessage("");
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-[#080B16] text-white">

            {/* HEADER */}
            <div className="p-4 border-b border-white/10 text-lg font-semibold">
                Group Chat (Test Mode)
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                    const isMe = msg.sender === tempUserId || msg.userId === tempUserId;

                    return (
                        <div
                            key={i}
                            className={`max-w-xs px-4 py-2 rounded-xl text-sm ${isMe ? "ml-auto bg-blue-600" : "bg-white/10"
                                }`}
                        >
                            {msg.text}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;