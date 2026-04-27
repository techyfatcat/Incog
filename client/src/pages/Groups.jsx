import { useEffect, useState } from "react";
import { createGroup, getGroups, joinGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Link as LinkIcon } from "lucide-react";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [inviteCode, setInviteCode] = useState("");

    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            const res = await getGroups();
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreate = async () => {
        if (!groupName.trim()) return;

        try {
            await createGroup({ name: groupName });
            setGroupName("");
            setShowModal(false);
            fetchGroups();
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoin = async () => {
        if (!inviteCode.trim()) return;

        try {
            const res = await joinGroup(inviteCode);
            navigate(`/chat/${res.data._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const copyInviteLink = (code) => {
        const link = `${window.location.origin}/join/${code}`;
        navigator.clipboard.writeText(link);
        alert("Invite link copied!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
                >
                    <Plus size={18} />
                    Create
                </button>
            </div>

            {/* JOIN SECTION */}
            <div className="mb-8 flex gap-3 max-w-md">
                <input
                    type="text"
                    placeholder="Enter invite code..."
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#1f1f1f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleJoin}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                >
                    Join
                </button>
            </div>

            {/* GROUP GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div
                        key={group._id}
                        className="p-5 rounded-2xl bg-[#1c1c1c] border border-gray-800 hover:border-blue-500 transition group"
                    >
                        {/* CLICKABLE AREA */}
                        <div
                            onClick={() => navigate(`/chat/${group._id}`)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Users className="text-blue-400" />
                                <span className="text-xs text-gray-400">
                                    {group.members.length} members
                                </span>
                            </div>

                            <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition">
                                {group.name}
                            </h2>
                        </div>

                        {/* INVITE SECTION */}
                        <div
                            onClick={() => copyInviteLink(group.inviteCode)}
                            className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-blue-400 mt-2"
                        >
                            <LinkIcon size={14} />
                            Copy Invite Link
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {groups.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    No groups yet. Create or join one 🚀
                </div>
            )}

            {/* CREATE MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md border border-gray-700">

                        <h2 className="text-xl font-semibold mb-4">Create Group</h2>

                        <input
                            type="text"
                            placeholder="Group name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-[#111] border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;