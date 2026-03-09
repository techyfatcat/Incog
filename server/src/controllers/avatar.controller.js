import { hashSeed, pick } from "../utils/hash.js";

export const generateAvatar = (req, res) => {
    const seed = req.params.seed;
    const hash = hashSeed(seed);

    const bgColors = [
        "#FF6B6B", // Red-Pink
        "#4ECDC4", // Teal
        "#FFE66D", // Yellow
        "#9B5DE5", // Purple
        "#00BBF9", // Sky Blue
        "#F15BB5", // Hot Pink
        "#00F5D4", // Mint
    ];

    const bg = bgColors[pick(hash, bgColors.length)];
    const bgShape = pick(hash.slice(2), 2); // 0: Squircle, 1: Circle
    const faceType = pick(hash.slice(4), 3); // 0: Round, 1: Tall, 2: Wide

    // Head Path Definitions (Simplified & Bold)
    let headPath = "";
    if (faceType === 0) headPath = "M30 85 Q30 30 60 30 Q90 30 90 85 Z";
    else if (faceType === 1) headPath = "M35 90 L35 35 Q60 25 85 35 L85 90 Z";
    else headPath = "M25 85 Q25 20 60 20 Q95 20 95 85 Z";

    const svg = `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        ${bgShape === 0
            ? `<rect width="120" height="120" rx="32" fill="${bg}" />`
            : `<circle cx="60" cy="60" r="60" fill="${bg}" />`
        }

        <path d="${headPath}" fill="white" />

        <g transform="translate(0, 5)">
            ${pick(hash.slice(6), 2) === 0 ? `
                <circle cx="48" cy="55" r="4" fill="${bg}" />
                <circle cx="72" cy="55" r="4" fill="${bg}" />
                <circle cx="40" cy="62" r="3" fill="${bg}" opacity="0.3" />
                <circle cx="80" cy="62" r="3" fill="${bg}" opacity="0.3" />
            ` : `
                <rect x="42" y="53" width="10" height="3" rx="1.5" fill="${bg}" />
                <rect x="68" y="53" width="10" height="3" rx="1.5" fill="${bg}" />
            `}
            
            <path d="M56 72 Q60 75 64 72" stroke="${bg}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </g>

        <rect x="0" y="100" width="120" height="20" fill="white" opacity="0.1" />
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
};