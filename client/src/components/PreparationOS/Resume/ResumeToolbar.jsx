import React from 'react';
import { Type, Maximize, Bold, Italic, Download, Image as ImageIcon } from 'lucide-react';

export default function ResumeToolbar({ styles, setStyles, onDownload }) {
    return (
        <div className="flex flex-wrap items-center gap-3 bg-white/80 dark:bg-white/5 backdrop-blur-md p-2 rounded-[20px] border border-white dark:border-white/10 shadow-lg mb-8">
            <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-white/10">
                <Type size={16} className="text-slate-400" />
                <select
                    value={styles.fontFamily}
                    onChange={(e) => setStyles({ ...styles, fontFamily: e.target.value })}
                    className="bg-transparent text-xs font-bold outline-none dark:text-white"
                >
                    <option value="font-sans">Sans Serif</option>
                    <option value="font-serif">Elegant Serif</option>
                    <option value="font-mono">Technical Mono</option>
                </select>
            </div>

            <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-white/10">
                <Maximize size={16} className="text-slate-400" />
                <select
                    value={styles.fontSize}
                    onChange={(e) => setStyles({ ...styles, fontSize: e.target.value })}
                    className="bg-transparent text-xs font-bold outline-none dark:text-white"
                >
                    <option value="12px">Compact</option>
                    <option value="13px">Regular</option>
                    <option value="14px">Large</option>
                </select>
            </div>

            <div className="flex items-center gap-2 px-3">
                <input
                    type="color"
                    value={styles.accentColor}
                    onChange={(e) => setStyles({ ...styles, accentColor: e.target.value })}
                    className="w-6 h-6 rounded-full overflow-hidden cursor-pointer bg-transparent border-none"
                />
                <button onClick={() => onDownload('pdf')} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all">
                    <Download size={14} /> PDF
                </button>
            </div>
        </div>
    );
}