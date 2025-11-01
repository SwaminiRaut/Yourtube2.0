import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`${userId} registered as ${socket.id}`);
  });

  socket.on("offer", ({ targetUserId, offer }) => {
    const targetSocket = connectedUsers.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit("offer", { from: socket.id, offer });
      console.log(`Offer sent to ${targetUserId}`);
    }
  });

  socket.on("answer", ({ targetUserId, answer }) => {
    const targetSocket = connectedUsers.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit("answer", { from: socket.id, answer });
      console.log(`Answer sent to ${targetUserId}`);
    }
  });

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const targetSocket = connectedUsers.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { from: socket.id, candidate });
      console.log(`ICE candidate sent to ${targetUserId}`);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(userId);
        console.log(`${userId} disconnected`);
        io.emit("user-disconnected", userId);
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Signaling server is running!");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Signaling server running on port ${PORT}`);
});
