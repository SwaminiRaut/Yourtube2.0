"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filename: string;
    filepath: string;
    thumbnail?:string;
  };
  userPlan: string;
  onNextVideo: () => boolean;
  onBack: () => void;
}

export default function VideoPlayer({ video, userPlan, onNextVideo, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const maxTimeRef = useRef<number>(0);
  const [videoExists, setVideoExists] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const normalizedPath = video.filepath.replace(/\\/g, "/");
  const fullPath = normalizedPath.startsWith("/uploads") ? normalizedPath : `/uploads/${normalizedPath}`;
  const videoURL = backend ? `${backend}${fullPath}` : "";

  const plan = (userPlan || "free").toLowerCase();
  const computeMaxTime = () => {
    switch (plan) {
      case "free": return 300;
      case "bronze": return 420;
      case "silver": return 600;
      default: return Infinity;
    }
  };
  const maxTime = Number(computeMaxTime());
  useEffect(() => { maxTimeRef.current = maxTime }, [maxTime]);

  useEffect(() => {
    setLimitReached(false);
    if (videoRef.current) videoRef.current.controls = true;
  }, [plan]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || maxTimeRef.current === Infinity) return;

    const enforceLimit = () => {
      if (videoEl.currentTime >= maxTimeRef.current && !limitReached) {
        videoEl.pause();
        videoEl.currentTime = maxTimeRef.current;
        videoEl.controls = false;
        setLimitReached(true);
      }
    };

    const handleSeeking = () => {
      if (videoEl.currentTime > maxTimeRef.current) {
        videoEl.currentTime = maxTimeRef.current;
        videoEl.pause();
      }
    };

    videoEl.addEventListener("timeupdate", enforceLimit);
    videoEl.addEventListener("seeking", handleSeeking);
    videoEl.addEventListener("seeked", enforceLimit);

    return () => {
      videoEl.removeEventListener("timeupdate", enforceLimit);
      videoEl.removeEventListener("seeking", handleSeeking);
      videoEl.removeEventListener("seeked", enforceLimit);
    };
  }, [limitReached, maxTime]);
  useEffect(() => {
    if (limitReached) setTimeout(() => router.push("/upgrade"), 800);
  }, [limitReached, router]);

  // Gesture handling
  let lastTapTime = 0;
  let tapCount = 0;
  let tapTimer: any = null;

  const yourTapHandler = (overlay: 'left' | 'center' | 'right') => {
    const currentTapTime = Date.now();
    const threshold = 300;
    const diff = currentTapTime - lastTapTime;

    tapCount = diff <= threshold ? tapCount + 1 : 1;
    lastTapTime = currentTapTime;

    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
    }

    tapTimer = setTimeout(() => {
      if (overlay === 'left') {
        if (tapCount === 2 && videoRef.current) videoRef.current.currentTime -= 10;
        if (tapCount === 3) setShowComments(true);
      }
      if (overlay === 'center' && videoRef.current) {
        if (tapCount === 1) {
          videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        }
        if (tapCount === 3) {
          const playedNext = onNextVideo?.();
          if (!playedNext) {
            alert("No more videos from this channel 🎬");
          }
        }

      }
      if (overlay === 'right' && videoRef.current) {
        if (tapCount === 2) videoRef.current.currentTime += 10;
        if (tapCount === 3) window.location.href = "about:blank";
      }

      tapCount = 0;
      tapTimer = null;
    }, 400);
  };

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {videoURL && videoExists ? (
        <div className="relative w-full h-full">
          <video
            key={plan}
            ref={videoRef}
            className="w-full h-full object-cover"
            controls={true} 
            poster={
              video.thumbnail
            }
            src={videoURL}
            onError={() => setVideoExists(false)}
          />
          <div
            className="absolute top-0 left-0 w-1/3 h-[80%] bg-transparent"
            onClick={() => yourTapHandler('left')}
            onTouchEnd={() => yourTapHandler('left')}
          />
          <div
            className="absolute top-0 left-1/3 w-1/3 h-[80%] bg-transparent"
            onClick={() => yourTapHandler('center')}
            onTouchEnd={() => yourTapHandler('center')}
          />
          <div
            className="absolute top-0 left-2/3 w-1/3 h-[80%] bg-transparent"
            onClick={() => yourTapHandler('right')}
            onTouchEnd={() => yourTapHandler('right')}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
          <img src="/placeholder.svg" alt="placeholder" className="mb-4 w-32 h-32" />
          <p>Video not available</p>
        </div>
      )}

      {limitReached && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-10 flex items-center justify-center text-white text-lg font-bold pointer-events-auto">
          Upgrade your plan to watch the full video!
        </div>
      )}

      {showComments && (
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4">
          Comments section
        </div>
      )}
    </div>
  );
}
