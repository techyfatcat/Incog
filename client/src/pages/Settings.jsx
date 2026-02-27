import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Eye, Bell, ShieldCheck, Smartphone,
    Trash2, Mail, Globe, MessageSquare, ChevronRight,
    Clock, LogOut, ShieldAlert
} from 'lucide-react';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('security');

    const sections = [
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'privacy', label: 'Privacy', icon: <Eye size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'advanced', label: 'Advanced', icon: <ShieldAlert size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#E5E5E5] dark:bg-[#0B0F1A] text-slate-600 dark:text-slate-400 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- SIDEBAR NAVIGATION --- */}
                <aside className="lg:col-span-3 space-y-2">
                    <h2 className="px-4 mb-6 text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Settings</h2>
                    {sections.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeSection === item.id
                                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg shadow-indigo-500/10'
                                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* --- CONTENT AREA --- */}
                <main className="lg:col-span-9">
                    <div className="bg-white/60 dark:bg-[#161B2E]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
                        <AnimatePresence mode="wait">
                            {activeSection === 'security' && <SecuritySettings key="security" />}
                            {activeSection === 'privacy' && <PrivacySettings key="privacy" />}
                            {activeSection === 'notifications' && <NotificationSettings key="notifications" />}
                            {activeSection === 'advanced' && <AdvancedSettings key="advanced" />}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS (SECTIONS) ---

function SecuritySettings() {
    return (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
            <SettingHeader title="Security" description="Manage your credentials and session safety." />

            <div className="space-y-4">
                <ActionRow icon={<Lock />} label="Change Password" sub="Last changed 3 months ago" action="Update" />
                <ToggleRow icon={<ShieldCheck />} label="Two-Factor Authentication" sub="Add an extra layer of security" active={true} />
                <ActionRow icon={<Smartphone />} label="Device Sessions" sub="3 active devices" action="Manage" />
                <ActionRow icon={<Clock />} label="Login History" sub="Check for suspicious activity" action="View" />
            </div>
        </motion.div>
    );
}

function PrivacySettings() {
    return (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
            <SettingHeader title="Privacy" description="Control your visibility and interaction rules." />

            <div className="space-y-4">
                <SelectRow icon={<MessageSquare />} label="Who can DM you" options={['Everyone', 'Following', 'No one']} current="Following" />
                <ToggleRow icon={<Globe />} label="Profile Visibility" sub="Make your profile public to everyone" active={true} />
            </div>
        </motion.div>
    );
}

function NotificationSettings() {
    return (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
            <SettingHeader title="Notifications" description="Stay updated on what matters to you." />

            <div className="space-y-4">
                <ToggleRow icon={<Mail />} label="Email Alerts" sub="Daily digest of your activity" active={true} />
                <ToggleRow icon={<Bell />} label="Placement Pings" sub="Instant notification for new job leads" active={true} />
                <ToggleRow icon={<Clock />} label="Weekly Digest" sub="A summary of your weekly progress" active={false} />
                <ToggleRow icon={<Smartphone />} label="Push Notifications" sub="On your mobile devices" active={true} />
            </div>
        </motion.div>
    );
}

function AdvancedSettings() {
    return (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
            <SettingHeader title="Advanced" description="Configure high-level account behavior." />

            <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-3xl space-y-4">
                <div className="flex items-center gap-4 text-red-500">
                    <Trash2 size={20} />
                    <div>
                        <p className="font-black text-sm uppercase tracking-tighter">Danger Zone</p>
                        <p className="text-xs opacity-70 italic font-medium">Once you delete your account, there is no going back.</p>
                    </div>
                </div>
                <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20">
                    Delete Account
                </button>
            </div>
        </motion.div>
    );
}

// --- UI ATOMS ---

function SettingHeader({ title, description }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm font-medium text-slate-400">{description}</p>
        </div>
    );
}

function ActionRow({ icon, label, sub, action }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-4">
                <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">{icon}</div>
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                </div>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">{action}</button>
        </div>
    );
}

function ToggleRow({ icon, label, sub, active }) {
    const [isOn, setIsOn] = useState(active);
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
                <div className={isOn ? 'text-indigo-500' : 'text-slate-400'}>{icon}</div>
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                </div>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${isOn ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
                <motion.div
                    animate={{ x: isOn ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}

function SelectRow({ icon, label, options, current }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
                <div className="text-slate-400">{icon}</div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
            </div>
            <select className="bg-transparent text-sm font-bold text-indigo-600 outline-none border-none focus:ring-0 cursor-pointer">
                {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    );
}