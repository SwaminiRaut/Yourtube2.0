import React, { useEffect, useState } from "react";
import Videocard from "./videocard";
import axiosInstance from "@/lib/axiosInstance";
import VideoPlayer from "./videopplayer";

console.log("🧠 Videogrid component loaded");

const Videogrid = () => {
  console.log("⚙️ Videogrid rendering...");
  const [videos, setvideo] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
    console.log("📡 Fetching videos...");
    const fetchvideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        console.log("✅ Response received:", res);
        console.log("🎬 Sample video:", res.data?.[0]);
        setvideo(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching videos:", error);
        setvideo([]);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  }, []);



  const handleNextVideo = () => {
  if (currentIndex == null || !videos.length) return false;

  const currentVideo = videos[currentIndex];

  // ✅ Find next video from the same channel
  const nextIndex = videos.findIndex(
    (v, i) => i > currentIndex && v.channelId === currentVideo.channelId
  );

  if (nextIndex !== -1) {
    setCurrentIndex(nextIndex);
    return true; // ✅ successfully switched
  } else {
    alert("No more videos from this channel 🎬");
    return false;
  }
};


  if(currentIndex!=null){
    return(
      <VideoPlayer
        video={videos[currentIndex]}
        userPlan={userPlan} 
        onNextVideo={handleNextVideo}
        onBack={() => setCurrentIndex(null)} // ✅ back to grid    
        />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {loading ? (
        <>Loading..</>
      ) : videos.length > 0 ? (
        videos.map((video: any, index:number) => (
          <Videocard key={video._id} video={video} onClick={() => setCurrentIndex(index)} />
        ))
      ) : (
        <p className="text-gray-500">No videos found.</p> // ✅ shows message if empty
      )}
    </div>
  );
};

export default Videogrid;
