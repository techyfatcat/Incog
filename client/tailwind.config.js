/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    // 🔥 SAFELIST: Prevents Tailwind from "purging" our dynamic theme colors
    safelist: [
        'bg-indigo-500',
        'bg-rose-500',
        'bg-amber-500',
        'bg-emerald-500',
        'border-indigo-500',
        'border-rose-500',
        'border-amber-500',
        'border-emerald-500',
    ],
    theme: {
        extend: {
            // Optional: You can add custom Gen-Z animations here later
        },
    },
    plugins: [],
};