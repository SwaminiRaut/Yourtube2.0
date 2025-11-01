"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Videopplayer from "@/components/videopplayer";
import VideoInfo from "@/components/videoInfo";
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import axiosInstance from "@/lib/axiosInstance";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>("free");

  useEffect(() => {
    const storedPlan = localStorage.getItem("userPlan") || "free";
    setUserPlan(storedPlan.toLowerCase());
  }, []);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        const videosData = res.data;
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

  const handleNextVideo = () => {
    const currentIndex = allVideos.findIndex((v) => v._id === id);
    if (currentIndex === -1 || currentIndex === allVideos.length - 1) return false;
    const nextVideo = allVideos[currentIndex + 1];
    router.push(`/watch/${nextVideo._id}`);
    return true;
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer
              video={video}
              userPlan={userPlan}
              onNextVideo={handleNextVideo}
              onBack={() => router.back()}
            />
            <VideoInfo video={video} />
            <Comments videoId={String(id)} />
          </div>
          <div className="space-y-4">
            <RelatedVideos videos={allVideos.filter((v) => v._id !== id)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
