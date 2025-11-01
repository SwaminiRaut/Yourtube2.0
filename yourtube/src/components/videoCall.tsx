"use client";

import { useEffect, useRef, useState } from "react";
import {
  initLocalMedia,
  attachLocalStreamToVideo,
  getRemoteStream,
  getLocalStream,
  stopLocalMedia,
  createEmptyRemoteStreamIfMissing,
  startCall,
  handleIncomingOffer,
  handleIncomingAnswer,
  handleIncomingCandidate,
  startScreenShare,
  startRecording,
  stopRecording,
  closePeerConnection,
} from "@/utils/webrtc";
import {
  initSocket,
  registerUser,
  onOffer,
  onAnswer,
  onCandidate,
} from "@/utils/signalling";

export default function VideoCall({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === "videoinput");
      setVideoDevices(videoInputs);
      if (videoInputs[0]) setSelectedDeviceId(videoInputs[0].deviceId);
    }
    fetchDevices();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) return;
    (async () => {
      try {
        const stream = await initLocalMedia(selectedDeviceId);
        attachLocalStreamToVideo(localVideoRef.current, stream, true);
        createEmptyRemoteStreamIfMissing();
      } catch (err) {
        console.error("Camera initialization failed:", err);
      }
    })();
  }, [selectedDeviceId]);

  useEffect(() => {
    initSocket();
    registerUser(currentUserId);

    onOffer(async (fromId, offer) => {
      await handleIncomingOffer(fromId, offer);
      setIsCallActive(true);
    });

    onAnswer(async (answer) => {
      await handleIncomingAnswer(answer);
    });

    onCandidate(async (candidate) => {
      await handleIncomingCandidate(candidate);
    });

    return () => {
      stopLocalMedia();
      closePeerConnection();
    };
  }, [currentUserId]);

  const handleEnableCamera = async () => {
    try {
      const stream = await initLocalMedia(selectedDeviceId || undefined);
      attachLocalStreamToVideo(localVideoRef.current, stream, true);
      createEmptyRemoteStreamIfMissing();
    } catch (err) {
      console.error("Camera initialization failed:", err);
      alert((err as Error).message);
    }
  };

  const handleStartCall = async () => {
    await startCall(targetUserId);
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    closePeerConnection();
    stopLocalMedia();
    setIsCallActive(false);
  };

  const handleScreenShare = async () => {
    await startScreenShare();
  };

  const handleRecord = async () => {
    let stream = getLocalStream();
    if (!stream) {
      stream = await initLocalMedia(selectedDeviceId || undefined);
      attachLocalStreamToVideo(localVideoRef.current, stream, true);
    }

    if (recorder) {
      const url = await stopRecording(recorder);
      setRecorder(null);
      setRecordingUrl(url);
    } else {
      const rec = await startRecording();
      setRecorder(rec);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <select
        value={selectedDeviceId || ""}
        onChange={e => setSelectedDeviceId(e.target.value)}
        className="p-2 border rounded"
      >
        {videoDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <button
        onClick={handleEnableCamera}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
      >
        Enable Camera
      </button>

      <div className="flex gap-4">
        <video ref={localVideoRef} className="w-64 h-48 bg-black rounded-xl" muted playsInline autoPlay />
        <video ref={remoteVideoRef} className="w-64 h-48 bg-black rounded-xl" playsInline autoPlay />
      </div>

      <div className="flex gap-3 mt-4">
        {!isCallActive && (
          <button
            onClick={handleStartCall}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Start Call
          </button>
        )}
        {isCallActive && (
          <>
            <button
              onClick={handleScreenShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Share Screen
            </button>
            <button
              onClick={handleRecord}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              {recorder ? "Stop Recording" : "Record"}
            </button>
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Call
            </button>
          </>
        )}
      </div>

      {recordingUrl && (
        <div className="mt-4">
          <a href={recordingUrl} download="recording.webm" className="text-blue-600 underline">
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
}
