import crypto from "crypto";

export function hashSeed(seed) {
    return crypto.createHash("sha256").update(seed).digest("hex");
}

export function pick(hash, mod) {
    return parseInt(hash.substring(0, 8), 16) % mod;
}