import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroup } from "../services/groupService";

const JoinGroup = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const join = async () => {
            try {
                const res = await joinGroup(code);
                const group = res.data;

                // redirect to chat
                navigate(`/chat/${group._id}`);
            } catch (err) {
                console.error(err);
                navigate("/groups");
            }
        };

        join();
    }, [code]);

    return (
        <div className="h-screen flex items-center justify-center text-white bg-[#080B16]">
            Joining group...
        </div>
    );
};

export default JoinGroup;