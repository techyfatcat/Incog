import React from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { parseRichText } from './RichTextParser';

const Section = ({ title, content, accent, color }) => (
    <div className="mb-6">
        <h4 className="text-[11px] font-black mb-3 tracking-[0.15em] uppercase"
            style={{ color: accent ? color : '#000' }}>
            {title}
        </h4>
        <div
            className="text-slate-600 text-[11px] leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: parseRichText(content) }}
        />
    </div>
);

export const TemplateModern = ({ data, photo, styles }) => (
    <div className={`${styles.fontFamily} p-12 text-left h-full flex flex-col bg-white`}>
        <div className="flex justify-between items-start border-b-8 pb-8 mb-10" style={{ borderColor: styles.accentColor }}>
            <div className="max-w-[70%]">
                <h1 className="text-5xl font-black tracking-tighter mb-2 leading-none text-slate-900">{data.name}</h1>
                <p className="text-xl font-bold uppercase tracking-widest" style={{ color: styles.accentColor }}>{data.role}</p>
            </div>
            {photo && <img src={photo} className="w-28 h-28 rounded-2xl object-cover shadow-lg border-2 border-slate-100" />}
        </div>
        <div className="grid grid-cols-12 gap-10 flex-1">
            <div className="col-span-8">
                <Section title="Experience" content={data.experience} accent color={styles.accentColor} />
                <Section title="Education" content={data.education} accent color={styles.accentColor} />
            </div>
            <div className="col-span-4 border-l border-slate-100 pl-8">
                <h4 className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-4">Contact</h4>
                <div className="text-[10px] font-bold space-y-2 mb-8">
                    <p className="flex items-center gap-2"><Mail size={12} /> {data.email}</p>
                    {data.linkedin && <p className="flex items-center gap-2"><Linkedin size={12} /> {data.linkedin}</p>}
                </div>
                <Section title="Expertise" content={data.skills} accent color={styles.accentColor} />
            </div>
        </div>
    </div>
);

export const TemplateMinimal = ({ data, photo, styles }) => (
    <div className={`${styles.fontFamily} h-full text-left flex flex-col bg-white`}>
        <div className="p-12 pb-8 flex justify-between items-end">
            <div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">{data.name}</h1>
                <p className="text-xl font-bold uppercase tracking-[0.2em]" style={{ color: styles.accentColor }}>{data.role}</p>
            </div>
            <div className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <p>{data.email}</p>
                {data.linkedin && <p>{data.linkedin}</p>}
            </div>
        </div>
        <div className="flex-1 px-12 pb-12 flex gap-12">
            <div className="flex-[2] border-t-2 border-slate-100 pt-8">
                <Section title="Professional Profile" content={data.experience} color={styles.accentColor} />
                <Section title="Education" content={data.education} color={styles.accentColor} />
            </div>
            <div className="flex-1 border-t-2 border-slate-100 pt-8">
                <Section title="Skills" content={data.skills} color={styles.accentColor} />
                {photo && <img src={photo} className="w-full aspect-square rounded-2xl object-cover grayscale mt-4" />}
            </div>
        </div>
    </div>
);

export const TemplateProfessional = ({ data, photo, styles }) => (
    <div className={`flex h-full text-left ${styles.fontFamily} bg-white`}>
        <div className="w-[30%] bg-[#0F172A] text-white p-8 flex flex-col shrink-0">
            {photo && <img src={photo} className="w-full aspect-square rounded-xl object-cover mb-8 border border-white/10" />}
            <h4 className="text-[10px] font-bold tracking-[0.2em] mb-4 uppercase text-indigo-400">Contact</h4>
            <div className="space-y-2 text-[10px] mb-8 break-all"><p>{data.email}</p><p>{data.linkedin}</p></div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] mb-4 uppercase text-indigo-400">Skills</h4>
            <div className="text-[10px] leading-relaxed" dangerouslySetInnerHTML={{ __html: parseRichText(data.skills) }} />
        </div>
        <div className="flex-1 p-10 flex flex-col">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 mb-1">{data.name}</h1>
                <div className="h-1 w-20 mb-3" style={{ backgroundColor: styles.accentColor }}></div>
                <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">{data.role}</p>
            </div>
            <Section title="Experience" content={data.experience} color={styles.accentColor} />
            <Section title="Education" content={data.education} color={styles.accentColor} />
        </div>
    </div>
);