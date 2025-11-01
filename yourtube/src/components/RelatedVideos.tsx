import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

const RelatedVideos = ({ videos }: any) => {
  const getVideoURL = (video: any) => {
    if (!video?.filepath) return null;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${video.filepath.replace(/\\/g, "/")}`;
  };
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log("Backend URL:", backendURL);


  return (
    <div>
      {videos.map((video: any) => (
        <Link key={video._id} href={`/watch/${video._id}`} className="flex gap-2 group">
          <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0 mb-2">
            <video
              src={getVideoURL(video) || ""}
              muted
              playsInline
              preload="metadata"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {video.videotitle}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{video.videoChannel}</p>
            <p className="text-xs text-gray-600">
              {video.views?.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedVideos;

