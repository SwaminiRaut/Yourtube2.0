// import { Socket, io } from "socket.io-client";
// const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || "http://localhost:8080"
// let socket: Socket | null = null;
// let connected = false;
// let currentUserId: string | null = null;
// export const initSocket = () => {
//     if (socket) return socket;
//     socket=io(SIGNALING_URL, {
//         transports:["websocket"],
//         autoConnect:false,
//     });
//     socket.on("connect", ()=>{
//         connected=true;
//         console.log("Connected to signaling server", socket?.id);
//         if(currentUserId){
//             registerUser(currentUserId);
//         }
//     });
//     socket.on("disconnect", ()=>{
//         connected=false;
//         console.log("Disconnected");
//     })
//     socket.on("connection-error", (err)=>{
//         console.log("Connection error", err.message);
//     })
//     socket.connect();
//     return socket;
// }
// export const registerUser=(userId:string)=>{
//     if(!socket) initSocket();
//     currentUserId=userId;
//     socket?.emit("register", {userId});
//     console.log("registered user", userId);
// }
// export const sendOffer=(targetedUserId:string, offer:any)=>{
//     safeSend(targetedUserId, offer);
// }
// export const sendAnswer=(targetUserId:string, answer:any)=>{
//     safeSend(targetUserId, answer);
// }
// export const sendCandidate=(targetUserId:string, candidate:any)=>{
//     safeSend(targetUserId, candidate);
// }
// export const onOffer=(callback:(data:any)=>void)=>{
//     socket?.on("offer", callback);
//     return ()=>socket?.off("offer", callback);
// }
// export const onAnswer=(callback:(data:any)=>void)=>{
//     socket?.on("answer", callback);
//     return ()=>socket?.off("answer", callback);
// }
// export const onCandidate=(callback:(data:any)=>void)=>{
//     socket?.on("candidate", callback);
//     return ()=>socket?.off("candidate", callback);
// }
// export const onUserDisconnected=(callback:(data:any)=>void)=>{
//     socket?.on("user-disconnected", callback);
//     return ()=>socket?.off("user-disconnected", callback);
// }
// export const disconnect=()=>{
//     if(!socket) return;
//     socket.emit("unregister", {userId:currentUserId});
//     socket.disconnect();
//     console.log("Socket disconnected for user", currentUserId);
//     socket=null;
//     currentUserId=null;
//     connected=false;
// }
// const safeSend = (event: string, data: any) => {
//   if (!socket || !connected) {
//     console.warn(`Cannot send ${event}: socket not connected`);
//     return;
//   }
//   socket.emit(event, data);
// };
// export default {
//   initSocket,
//   registerUser,
//   sendOffer,
//   sendAnswer,
//   sendCandidate,
//   onOffer,
//   onAnswer,
//   onCandidate,
//   onUserDisconnected,
//   disconnect,
// };


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
