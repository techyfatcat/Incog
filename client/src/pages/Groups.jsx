import { useEffect, useState } from "react";
import { createGroup, getGroups, joinGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Search, Link as LinkIcon, Check } from "lucide-react";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            const res = await getGroups();
            setGroups(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchGroups(); }, []);

    const handleCreate = async () => {
        if (!groupName.trim()) return;
        try {
            await createGroup({ name: groupName });
            setGroupName("");
            setShowModal(false);
            fetchGroups();
        } catch (err) { console.error(err); }
    };

    const handleCopy = (e, groupId) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/join/${groupId}`);
        setCopiedId(groupId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filtered = groups.filter(g =>
        g.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] pt-24 pb-10 transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4">

                {/* TOP BAR */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search groups…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/[0.06] rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        New Group
                    </button>
                </div>

                {/* GROUP LIST */}
                <div className="flex flex-col gap-2">
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-400 dark:text-gray-600 text-sm">
                            No groups found
                        </div>
                    )}
                    {filtered.map(group => (
                        <div
                            key={group._id}
                            onClick={() => navigate(`/chat/${group._id}`)}
                            className="group flex items-center gap-4 px-5 py-4 bg-white dark:bg-[#0A0C14] border border-gray-100 dark:border-white/[0.05] hover:border-blue-500/40 dark:hover:border-blue-500/30 rounded-2xl cursor-pointer transition-all"
                        >
                            {/* Icon */}
                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Users size={20} className="text-blue-500" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                                    {group.name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {group.members?.length || 0} members
                                </p>
                            </div>

                            {/* Copy link button */}
                            <button
                                onClick={e => handleCopy(e, group._id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex-shrink-0
                                    ${copiedId === group._id
                                        ? "bg-green-500/10 border-green-500/30 text-green-500"
                                        : "bg-gray-100 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 hover:border-blue-500/40 hover:text-blue-500"
                                    }`}
                            >
                                {copiedId === group._id
                                    ? <><Check size={13} /> Copied!</>
                                    : <><LinkIcon size={13} /> Copy link</>
                                }
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CREATE MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
                >
                    <div className="bg-white dark:bg-[#0A0C14] w-full max-w-sm rounded-[28px] p-7 border border-gray-100 dark:border-white/[0.07] shadow-2xl">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">Create a group</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                            Members can join via an invite link.
                        </p>
                        <input
                            type="text"
                            placeholder="e.g. Engineering squad"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            autoFocus
                            className="w-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-blue-500 transition-colors mb-5"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreate}
                                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.07] text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-all border border-gray-200 dark:border-white/[0.06]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;