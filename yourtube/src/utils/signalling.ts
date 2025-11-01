import { io, Socket } from "socket.io-client";

const SIGNAL_URL = process.env.NEXT_PUBLIC_SIGNAL_URL || "https://yourtube2-0-1-xtau.onrender.com";
let socket: Socket | null = null;
let isConnected = false;
let currentUserId: string | null = null;

export function initSocket() {
  if (socket && isConnected) return socket;

  socket = io(SIGNAL_URL);

  socket.on("connect", () => {
    isConnected = true;
    console.log("Connected to signaling server");
  });

  socket.on("disconnect", () => {
    isConnected = false;
    console.log("Disconnected from signaling server");
  });

  return socket;
}

export function registerUser(userId: string) {
  currentUserId = userId;
  if (!socket) initSocket();
  socket?.emit("register", userId);
}

export function sendOffer(targetUserId: string, offer: RTCSessionDescriptionInit) {
  socket?.emit("offer", { targetUserId, offer });
}

export function sendAnswer(targetUserId: string, answer: RTCSessionDescriptionInit) {
  socket?.emit("answer", { targetUserId, answer });
}

export function sendCandidate(targetUserId: string, candidate: RTCIceCandidateInit) {
  socket?.emit("ice-candidate", { targetUserId, candidate });
}

export function onOffer(callback: (fromId: string, offer: RTCSessionDescriptionInit) => void) {
  socket?.on("offer", (data: { fromId: string; offer: RTCSessionDescriptionInit }) => {
    callback(data.fromId, data.offer);
  });
}

export function onAnswer(callback: (answer: RTCSessionDescriptionInit) => void) {
  socket?.on("answer", (data: { answer: RTCSessionDescriptionInit }) => {
    callback(data.answer);
  });
}

export function onCandidate(callback: (candidate: RTCIceCandidateInit) => void) {
  socket?.on("ice-candidate", (data: { candidate: RTCIceCandidateInit }) => {
    callback(data.candidate);
  });
}

export function onUserDisconnected(callback: (userId: string) => void) {
  socket?.on("user-disconnected", (userId: string) => callback(userId));
}

export function disconnect() {
  socket?.disconnect();
  socket = null;
  isConnected = false;
  currentUserId = null;
}

export default {
  initSocket,
  registerUser,
  sendOffer,
  sendAnswer,
  sendCandidate,
  onOffer,
  onAnswer,
  onCandidate,
  onUserDisconnected,
  disconnect,
};
