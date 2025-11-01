import {
  sendOffer,
  sendAnswer,
  sendCandidate,
} from "./signalling";

let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let isCallActive = false;
let targetedUserId: string | null = null;

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export async function initLocalMedia(selectedDeviceId?: string): Promise<MediaStream> {
  if (localStream) return localStream;

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("getUserMedia not supported in this browser");
  }

  try {
    const constraints: MediaStreamConstraints = {
      video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStream = stream;
    if (!remoteStream) remoteStream = new MediaStream();
    return stream;
  } catch (err: any) {
    console.error("Error initializing media:", err);
    if (err.name === "NotAllowedError") {
      throw new Error("Please allow camera and microphone access.");
    }
    throw new Error("Failed to get local media: " + err.message);
  }
}

export function attachLocalStreamToVideo(videoEl: HTMLVideoElement | null, stream: MediaStream | null, mute = true) {
  if (!videoEl) return;
  videoEl.srcObject = stream || null;
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.muted = mute;

  videoEl.play().catch((e) => console.warn("Video play() failed:", e));
}

export function stopLocalMedia() {
  if (!localStream) return;
  localStream.getTracks().forEach((t) => t.stop());
  localStream = null;
}

export function createEmptyRemoteStreamIfMissing() {
  if (!remoteStream) remoteStream = new MediaStream();
}
export function getLocalStream() {
  return localStream;
}
export function getRemoteStream() {
  return remoteStream;
}

export async function startCall(targetId: string) {
  if (peerConnection) return;

  peerConnection = new RTCPeerConnection(configuration);
  isCallActive = true;
  targetedUserId = targetId;

  const local = getLocalStream();
  if (local) {
    local.getTracks().forEach((track) => peerConnection!.addTrack(track, local));
  } else {
    console.warn("No local stream found while starting call");
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) sendCandidate(targetId, event.candidate);
  };

  const remote = new MediaStream();
  remoteStream = remote;

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remote.addTrack(track));
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  sendOffer(targetId, offer);
}

export async function handleIncomingOffer(fromId: string, offer: RTCSessionDescriptionInit) {
  peerConnection = new RTCPeerConnection(configuration);
  targetedUserId = fromId;

  const local = getLocalStream();
  if (local) {
    local.getTracks().forEach((track) => peerConnection!.addTrack(track, local));
  } else {
    console.warn("No local stream found while handling offer");
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) sendCandidate(fromId, event.candidate);
  };

  const remote = new MediaStream();
  remoteStream = remote;

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remote.addTrack(track));
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  sendAnswer(fromId, answer);
}

export async function handleIncomingAnswer(answer: RTCSessionDescriptionInit) {
  if (!peerConnection) return;
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

export async function handleIncomingCandidate(candidate: RTCIceCandidateInit) {
  if (!peerConnection) return;
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

export async function startScreenShare() {
  if (!peerConnection) return;
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const screenTrack = screenStream.getTracks()[0];
  const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video");
  sender?.replaceTrack(screenTrack);

  screenTrack.onended = async () => {
    const local = getLocalStream();
    const videoTrack = local?.getVideoTracks()[0];
    if (videoTrack && sender) sender.replaceTrack(videoTrack);
  };
}

export async function startRecording(): Promise<MediaRecorder> {
  if (!localStream) throw new Error("Local stream not available");
  const recorder = new MediaRecorder(localStream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  };

  return recorder;
}

export async function stopRecording(recorder: MediaRecorder): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    recorder.stop();
  });
}

export function closePeerConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  isCallActive = false;
  targetedUserId = null;
}
