// 📁 /utils/webrtc.ts
import {
  sendOffer,
  sendAnswer,
  sendCandidate,
} from "./signalling";

let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let isCallActive = false;
let currentUserId: string | null = null;
let targetedUserId: string | null = null;

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// 🎥 Initialize camera + mic
// 🎥 Initialize camera + mic with optional device selection
export async function initLocalMedia(
  selectedDeviceId?: string
): Promise<MediaStream> {
  if (localStream) return localStream;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("getUserMedia is not supported by this browser");
  }

  try {
    const constraints: MediaStreamConstraints = {
      video: selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId } }
        : true,
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStream = stream;
    if (!remoteStream) remoteStream = new MediaStream();
    return stream;
  } catch (err: any) {
    if (err && err.name === "NotAllowedError") {
      throw new Error(
        "Permission denied. Please allow camera and microphone access"
      );
    }
    if (err && err.name === "NotFoundError") {
      throw new Error(
        "No camera or microphone found on this device. Use a virtual camera if needed."
      );
    }
    throw new Error("Failed to get local media: " + (err?.message || err));
  }
}


// 🔗 Attach stream to <video>
export function attachLocalStreamToVideo(
  videoEl: HTMLVideoElement | null,
  stream: MediaStream | null,
  mute = true
) {
  if (!videoEl) return;
  if (!stream) {
    videoEl.srcObject = null;
    return;
  }
  videoEl.srcObject = stream;
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.muted = mute;

  const playPromise = videoEl.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.catch((e) => {
      console.warn("Local video play() failed:", e);
    });
  }
}

// 🧹 Stop camera + mic
export function stopLocalMedia() {
  if (!localStream) return;
  localStream.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch (e) {
      console.warn("Error stopping track:", e);
    }
  });
  localStream = null;
}

// ⚙️ Accessor helpers
export function createEmptyRemoteStreamIfMissing() {
  if (!remoteStream) remoteStream = new MediaStream();
}

export function getLocalStream(): MediaStream | null {
  return localStream;
}

export function getRemoteStream(): MediaStream | null {
  return remoteStream;
}

// 📞 Start call
export async function startCall(targetId: string) {
  if (peerConnection) return;

  peerConnection = new RTCPeerConnection(configuration);
  isCallActive = true;
  targetedUserId = targetId;

  const local = getLocalStream();
  if (local) {
    local.getTracks().forEach((track) => peerConnection!.addTrack(track, local));
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendCandidate(targetId, event.candidate);
    }
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

// 📞 Handle incoming offer
export async function handleIncomingOffer(
  fromId: string,
  offer: RTCSessionDescriptionInit
) {
  peerConnection = new RTCPeerConnection(configuration);
  targetedUserId = fromId;

  const local = getLocalStream();
  if (local) {
    local.getTracks().forEach((track) => peerConnection!.addTrack(track, local));
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendCandidate(fromId, event.candidate);
    }
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

// 📞 Handle incoming answer
export async function handleIncomingAnswer(answer: RTCSessionDescriptionInit) {
  if (!peerConnection) return;
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// 🧊 Handle incoming ICE candidates
export async function handleIncomingCandidate(candidate: RTCIceCandidateInit) {
  if (!peerConnection) return;
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// 🖥️ Screen sharing
export async function startScreenShare() {
  if (!peerConnection) return;
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const screenTrack = screenStream.getTracks()[0];

  const sender = peerConnection
    .getSenders()
    .find((s) => s.track?.kind === "video");
  sender?.replaceTrack(screenTrack);

  screenTrack.onended = async () => {
    const local = getLocalStream();
    const videoTrack = local?.getVideoTracks()[0];
    if (videoTrack && sender) sender.replaceTrack(videoTrack);
  };
}

// 🔴 Recording
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

// ⏹ Stop recording
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

// ❌ End call
export function closePeerConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  isCallActive = false;
  targetedUserId = null;
}
