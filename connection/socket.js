import { Server } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();

export default function socketIo(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log("Connected " + socket.id);
        socket.on("join_room", (userId) => {
            socket.join(userId);
            socket.emit("joined", `${userId} room joined successfully`)
        });

        socket.on("new_message", (messageContent) => {
            console.log("check");
            io.to(messageContent.receiver).emit("receive_message", messageContent);
        });

        socket.on("disconnect", () => {
            console.log("user with id " + socket.id + " disconnected.");
        });
    });
}
