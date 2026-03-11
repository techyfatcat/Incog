export default function ToolLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] text-slate-700 dark:text-slate-300 transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {children}
            </div>
        </div>
    );
}