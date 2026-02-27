import React from 'react';

const Highlight = ({ text, query }) => {
    // 🛡️ Guard Clause: If text is missing, return nothing. 
    // If query is missing or just empty space, return the original text.
    if (!text) return null;
    if (!query || !query.trim()) return <span>{text}</span>;

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, "gi");
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                    ? <span key={i} className="text-blue-500 font-bold">{part}</span>
                    : part
            )}
        </span>
    );
};

export default Highlight;