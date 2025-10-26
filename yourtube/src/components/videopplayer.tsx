// "use client";

// import { useRef, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { timeStamp } from "console";
// import { now } from "mongoose";

// interface VideoPlayerProps {
//   video: {
//     _id: string;
//     videotitle: string;
//     filename: string;
//     filepath: string;
//   };
//   userPlan: string; // plan from backend
//   onNextVideo: () => void;
//   onBack:()=>void;
// }

// export default function VideoPlayer({ video, userPlan, onBack, onNextVideo }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const maxTimeRef = useRef<number>(0); // will store dynamic maxTime
//   const [videoExists, setVideoExists] = useState(true);
//   const [limitReached, setLimitReached] = useState(false);
//   const [showComments, setShowComments] = useState(false)

//   const router = useRouter();

//   const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";

//   const normalizedPath = video.filepath.replace(/\\/g, "/");
//   const fullPath = normalizedPath.startsWith("/uploads")
//     ? normalizedPath
//     : `/uploads/${normalizedPath}`;
//   const videoURL = backend ? `${backend}${fullPath}` : "";

//   // Normalize plan and compute maxTime
//   const plan = (userPlan || "free").toLowerCase();
//   const computeMaxTime = () => {
//     switch (plan) {
//       case "free":
//         return 300; // 5 min
//       case "bronze":
//         return 420; // 7 min
//       case "silver":
//         return 600; // 10 min
//       default:
//         return Infinity; // gold/unlimited
//     }
//   };
//   const maxTime = Number(computeMaxTime());

//   // Keep maxTimeRef updated dynamically
//   useEffect(() => {
//     maxTimeRef.current = maxTime;
//   }, [maxTime]);

//   console.log("💡 VideoPlayer Render:", { userPlan, plan, maxTime });

//   // Reset limitReached and re-enable controls after plan upgrade
//   useEffect(() => {
//     setLimitReached(false);
//     if (videoRef.current) videoRef.current.controls = true;
//   }, [plan]);

//   // Enforce watch limit
//   useEffect(() => {
//     const videoEl = videoRef.current;
//     if (!videoEl || maxTimeRef.current === Infinity) return;

//     const enforceLimit = () => {
//       if (videoEl.currentTime >= maxTimeRef.current && !limitReached) {
//         console.log("Limit reached at:", videoEl.currentTime);

//         videoEl.pause();
//         videoEl.currentTime = maxTimeRef.current;
//         videoEl.controls = false; // prevent seeking
//         setLimitReached(true);
//       }
//     };

//     const handleSeeking = () => {
//       if (videoEl.currentTime > maxTimeRef.current) {
//         videoEl.currentTime = maxTimeRef.current;
//         videoEl.pause();
//       }
//     };

//     videoEl.addEventListener("timeupdate", enforceLimit);
//     videoEl.addEventListener("seeking", handleSeeking);
//     videoEl.addEventListener("seeked", enforceLimit);

//     return () => {
//       videoEl.removeEventListener("timeupdate", enforceLimit);
//       videoEl.removeEventListener("seeking", handleSeeking);
//       videoEl.removeEventListener("seeked", enforceLimit);
//     };
//   }, [limitReached, maxTime]); // only depends on limitReached

//   // Redirect to upgrade page when limit reached
//   useEffect(() => {
//     if (limitReached) {
//       setTimeout(() => router.push("/upgrade"), 800);
//     }
//   }, [limitReached, router]);

//   let lasttaptime = 0;
//   let tapcount = 0;
//   let taptimer: any = null;
//   const yourtaphandler = (overlay: 'left' | 'center' | 'right') => {
//     const currenttaptime = Date.now();
//     const threshold = 300;
//     const timedifference = currenttaptime - lasttaptime;
//     if (timedifference <= threshold) {
//       tapcount = tapcount + 1;
//     } else {
//       tapcount = 1;
//     }
//     lasttaptime = currenttaptime;
//     if (taptimer != null) {
//       clearTimeout(taptimer)
//       taptimer = null;
//     }
//     taptimer = setTimeout(() => {
//       if (overlay == "left") {
//         if (tapcount == 2) {
//           if (videoRef.current) {
//             videoRef.current.currentTime -= 10;
//           }
//         }
//         if(tapcount==3){
//           setShowComments(true);
//         }
//       }
//       tapcount = 0;
//       taptimer = null;
//       if (overlay == "center") {
//         if (tapcount == 1) {
//           if (videoRef.current) {
//             if(videoRef.current.paused){
//               videoRef.current.play();
//             }
//             else{
//               videoRef.current.pause();
//             }
//           }
//         }
//         if(tapcount==3){
//           onNextVideo();
//         }
//       }
//       tapcount = 0;
//       taptimer = null;
//       if (overlay == "right") {
//         if (tapcount == 2) {
//           if (videoRef.current) {
//               videoRef.current.currentTime+=10;
//           }
//         }
//         if(tapcount==3){
//           window.location.href = "/";;
//         }
//       }
//       tapcount = 0;
//       taptimer = null;
//     }, 400);
//   }

//   return (
//     <div className="relative aspect-video bg-black rounded-lg overflow-hidden text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//       {videoURL && videoExists ? (
//         <div className="relative w-full h-full">
//           <video
//             key={plan}
//             ref={videoRef}
//             className="w-full h-full object-cover"
//             controls={true}
//             poster="/placeholder.svg"
//             src={videoURL}
//             onError={() => setVideoExists(false)}
//           />
//           <div className="absolute top-0 left-0 w-1/3 h-full bg-transparent pointer-events-auto" onClick={()=>yourtaphandler('left')} />
//           <div className="absolute top-0 left-1/3 w-1/3 h-full bg-transparent pointer-events-auto" onClick={()=>yourtaphandler('center')} />
//           <div className="absolute top-0 left-2/3 w-1/3 h-full bg-transparent pointer-events-auto" onClick={()=>yourtaphandler('right')} />
//         </div>
//       ) : (
//         <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
//           <img
//             src="/placeholder.svg"
//             alt="placeholder"
//             className="mb-4 w-32 h-32"
//           />
//           <p>Video not available</p>
//         </div>
//       )
//       }

//       {
//         limitReached && (
//           <div className="absolute inset-0 bg-black bg-opacity-80 z-10 flex items-center justify-center text-white text-lg font-bold pointer-events-auto">
//             Upgrade your plan to watch the full video!
//           </div>
//         )
//       }
//     </div >
//   );
// }



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

  // Plan-based watch limit
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

  // Reset limit after plan change
  useEffect(() => {
    setLimitReached(false);
    if (videoRef.current) videoRef.current.controls = true;
  }, [plan]);

  // Watch limit enforcement
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

  // Redirect on limit reached
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

    // Timer to detect gesture type
    tapTimer = setTimeout(() => {
      if (overlay === 'left') {
        if (tapCount === 2 && videoRef.current) videoRef.current.currentTime -= 10;
        if (tapCount === 3) setShowComments(true);
      }
      if (overlay === 'center' && videoRef.current) {
        if (tapCount === 1) {
          // First tap → toggle play
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
            controls={true} // ✅ always allow controls initially
            poster={
              video.thumbnail
            }
            src={videoURL}
            onError={() => setVideoExists(false)}
          />
          {/* Overlay divs */}
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
          {/* Your comment UI here */}
          Comments section
        </div>
      )}
    </div>
  );
}
