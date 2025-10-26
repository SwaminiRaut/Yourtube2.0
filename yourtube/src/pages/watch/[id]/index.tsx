"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";


import Videopplayer from "@/components/videopplayer";
import VideoInfo from "@/components/videoInfo";
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import axiosInstance from "@/lib/axiosInstance";

const index = () => {
  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<any>(null); // Current video
  const [allVideos, setAllVideos] = useState<any[]>([]); // Related videos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchVideos = async () => {
      try {
        // Note the correct URL
        const res = await axiosInstance.get("/video/getall");
        const videosData = res.data;

        // Find the video by id
        const selectedVideo = videosData.find((v: any) => v._id === id);
        setVideo(selectedVideo || null);
        setAllVideos(videosData);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="min-h-screen bg-white  text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video */}
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer video={video} />
            <VideoInfo video={video} />
            <Comments videoId={id} />
          </div>

          {/* Related Videos */}
          <div className="space-y-4">
            <RelatedVideos videos={allVideos.filter((v) => v._id !== id)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;

