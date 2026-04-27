import Message from "./models/message.model.js";

export const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
        });

        socket.on("sendMessage", async ({ groupId, text, userId }) => {
            try {
                if (!userId || userId.length !== 24) return;

                const msg = await Message.create({
                    groupId,
                    sender: userId,
                    text,
                });

                io.to(groupId).emit("receiveMessage", msg);
            } catch (err) {
                console.error("Socket message error:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};