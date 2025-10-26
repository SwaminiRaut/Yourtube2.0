"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function VideoCard({ video }: any) {
  if (!video) return null;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // fallback to empty string
  const videoPath = video.filepath ? video.filepath.replace(/\\/g, "/") : "";
  const videoURL = backend && videoPath ? `${backend}/${videoPath}` : "";

  const [duration, setDuration] = useState<string>("0:00");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load video metadata to get duration
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      const handleLoadedMetadata = () => {
        const mins = Math.floor(vid.duration / 60);
        const secs = Math.floor(vid.duration % 60)
          .toString()
          .padStart(2, "0");
        setDuration(`${mins}:${secs}`);
      };
      vid.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  console.log("VideoCard:", { backend, videoPath, videoURL });
  const thumbnailPath = video.thumbnail ? video.thumbnail.replace(/\\/g, "/") : "";
  const thumbnailURL = backend && thumbnailPath ? `${backend}/${thumbnailPath}` : "";


  return (
    <Link href={`/watch/${video._id}`} className="group">
      <div className="space-y-3 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        {/* Video Thumbnail */}

        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          {thumbnailURL ? (
            <img
              src={`${backend}${video.thumbnail}`}
              alt={video.videotitle}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
              No Thumbnail
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            {duration}
          </div>
        </div>


        {/* Video Info */}
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback>{video.videochannel?.[0] || "?"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {video.videotitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {video.videochannel || "Unknown Channel"}
            </p>
            <p className="text-sm text-gray-600">
              {video.views?.toLocaleString() || 0} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
