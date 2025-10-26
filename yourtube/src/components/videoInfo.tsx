// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback } from "./ui/avatar";
// import { Button } from "./ui/button";
// import {
//   Clock,
//   Download,
//   MoreHorizontal,
//   Share,
//   ThumbsDown,
//   ThumbsUp,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useUser } from "@/lib/AuthContext";
// import axiosInstance from "@/lib/axiosInstance";
// import { useRouter } from "next/router";

// // import {useNavigate} from "react-router-dom"


// const VideoInfo = ({ video }: any) => {
//   const [likes, setLikes] = useState<number>(video.Like?.length || 0);
//   const [dislikes, setDislikes] = useState<number>(video.Dislike?.length || 0);
//   const [isLiked, setIsLiked] = useState<boolean>(false);
//   const [isDisliked, setIsDisliked] = useState<boolean>(false);
//   const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
//   const { user } = useUser();
//   const [isWatchLater, setIsWatchLater] = useState<boolean>(false);
//   const [isDownload, setIsDownload] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     setLikes(video.Like || 0);
//     setDislikes(video.Dislike || 0);
//     setIsLiked(false);
//     setIsDisliked(false);
//   }, [video]);

//   useEffect(() => {
//     const handleViews = async () => {
//       try {
//         if (user) {
//           await axiosInstance.post(`/history/${video._id}`, {
//             userId: user?._id,
//           });
//         } else {
//           await axiosInstance.post(`/history/views/${video?._id}`);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     handleViews();
//   }, [user, video._id]);

//   // const handleLike = async () => {
//   //   if (!user) return;
//   //   try {
//   //     const res = await axiosInstance.post(`/like/${video._id}`, {
//   //       userId: user?._id,
//   //     });
//   //     if (res.data.liked) {
//   //       if (isLiked) {
//   //         setLikes((prev) => prev - 1);
//   //         setIsLiked(false);
//   //       } else {
//   //         setLikes((prev) => prev + 1);
//   //         setIsLiked(true);
//   //         if (isDisliked) {
//   //           setDislikes((prev) => prev - 1);
//   //           setIsDisliked(false);
//   //         }
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const handleDislike = async () => {
//   //   if (!user) return;
//   //   try {
//   //     const res = await axiosInstance.post(`/dislike/${video._id}`, {
//   //       userId: user?._id,
//   //     });
//   //     if (res.data.disliked) {
//   //       if (isDisliked) {
//   //         setDislikes((prev) => prev - 1);
//   //         setIsDisliked(false);
//   //       } else {
//   //         setDislikes((prev) => prev + 1);
//   //         setIsDisliked(true);
//   //         if (isLiked) {
//   //           setLikes((prev) => prev - 1);
//   //           setIsLiked(false);
//   //         }
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };


//   const handleLike = async () => {
//   if (!user) return console.log("❌ User not logged in");

//   try {
//     const res = await axiosInstance.post(`/video/like/${video._id}`, {
//       userId: user._id,
//     });

//     setLikes(res.data.totalLikes);
//     setDislikes(res.data.totalDislikes);
//     setIsLiked(res.data.liked);
//     setIsDisliked(false);
//   } catch (err) {
//     console.error("❌ Like error:", err);
//   }
// };

// const handleDislike = async () => {
//   if (!user) return console.log("❌ User not logged in");

//   try {
//     const res = await axiosInstance.post(`/video/dislike/${video._id}`, {
//       userId: user._id,
//     });

//     setLikes(res.data.totalLikes);
//     setDislikes(res.data.totalDislikes);
//     setIsDisliked(res.data.disliked);
//     setIsLiked(false);
//   } catch (err) {
//     console.error("❌ Dislike error:", err);
//   }
// };


//   const handleWatchLater = async () => {
//     if (!user) return;
//     try {
//       const res = await axiosInstance.post(`/watch/${video._id}`, {
//         userId: user?._id,
//       });
//       if (res.data.watchlater) {
//         setIsWatchLater(!isWatchLater);
//       } else {
//         setIsWatchLater(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDownload = async (videoId: string) => {
//     // const navigate=useNavigate();
//     if (!user) return alert("Please sign in to download videos.");
//     try {
//       const res = await axiosInstance.post(`/download/${videoId}`, { userId: user._id });
//       if (res.data.downloaded) {
//         setIsDownload(true);
//         alert("Video added to Downloads!");
//       } else if (res.data.reason === "limit_reached") {
//         setIsDownload(false);
//         // navigate("/Premium");
//         router.push("/premium");
//       }
//     } catch (err: any) {
//       if (err.response && err.response.status === 400) {
//         alert(err.response.data.message);
//       } else {
//         alert("Something went wrong wgile downloading");
//         console.error("Download error:", err);
//       }
//     }
//   };



//   const handleSubscribe = async () => {
//     console.log("📺 Video object:", video); // already there
//     console.log("👤 Logged in user:", user);
//     console.log("Full video object:", video);
//     if (!user) {
//       alert("Please sign in to subscribe.");
//       return;
//     }

//     try {
//       console.log("🟢 Subscribe button clicked!");
//       console.log("📺 Channel:", video.videochannel);
//       console.log("👤 User:", user);
//       console.log("👤 Logged in user:", user);
//       console.log("Full video object:", video);

//       const res = await axiosInstance.post(`/channel/subscribe/${video.userId}`, {
//         userId: user._id,
//       });


//       console.log("✅ Subscribe response:", res.data);

//       if (res.data.success || res.data.message?.includes("Subscribed")) {
//         alert(`You have subscribed to ${video.videochannel}!`);
//       } else if (res.data.message?.includes("Unsubscribed")) {
//         alert(`You have unsubscribed from ${video.videochannel}.`);
//       } else {
//         console.warn("⚠️ Unexpected subscribe response:", res.data);
//       }
//     } catch (error) {
//       console.error("❌ Subscribe error:", error);
//       alert("Subscription failed. Check console for details.");
//     }
//   };


//   return (
//     <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//       <h1 className="text-xl font-semibold">{video.videotitle}</h1>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//           <Avatar className="w-10 h-10">
//             <AvatarFallback>{video.videochannel[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-medium">{video.videochannel}</h3>
//             <p className="text-sm text-gray-600">1.2M subscribers</p>
//           </div>
//           <Button
//             className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
//             onClick={handleSubscribe}
//           >
//             Subscribe
//           </Button>

//         </div>

//         <div className="flex items-center gap-2 bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//           <div className="flex items-center">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="rounded-l-full"
//               onClick={handleLike}
//             >
//               <ThumbsUp
//                 className={`w-5 h-5 mr-2 ${isLiked ? "fill-black text-black" : ""
//                   }`}
//               />
//               {likes.toLocaleString()}
//             </Button>
//             <div className="w-px h-6 bg-gray-300" />
//             <Button
//               variant="ghost"
//               size="sm"
//               className="rounded-r-full"
//               onClick={handleDislike}
//             >
//               <ThumbsDown
//                 className={`w-5 h-5 mr-2 ${isDisliked ? "fill-black text-black" : ""
//                   }`}
//               />
//               {dislikes.toLocaleString()}
//             </Button>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className={`bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 ${isWatchLater ? "text-primary" : ""
//               }`}
//             onClick={handleWatchLater}
//           >
//             <Clock className="w-5 h-5 mr-2" />
//             {isWatchLater ? "Saved" : "Watch Later"}
//           </Button>
//           <Button variant="ghost" size="sm" className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//             <Share className="w-5 h-5 mr-2" />
//             Share
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"
//             onClick={() => handleDownload(video._id)} // <-- move onClick here
//           >
//             <Download className="w-5 h-5 mr-2" />
//             {isDownload ? "Downloaded" : "Download"}
//           </Button>

//           <Button variant="ghost" size="icon" className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//             <MoreHorizontal className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       <div className="bg-gray-100 rounded-lg p-4  text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//         <div className="flex gap-4 text-sm font-medium mb-2">
//           <span>{video.views.toLocaleString()} views</span>
//           <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
//         </div>
//         <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
//           <p>{video.description || "No description available."}</p>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="mt-2 p-0 h-auto font-medium"
//           onClick={() => setShowFullDescription(!showFullDescription)}
//         >
//           {showFullDescription ? "Show less" : "Show more"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default VideoInfo;



import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/router";
import { toast } from "sonner";

const VideoInfo = ({ video }: any) => {
  const { user } = useUser();
  const router = useRouter();

  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [isWatchLater, setIsWatchLater] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);


  // Initialize likes/dislikes and user status from DB
  useEffect(() => {
    if (!video) return;

    setLikes(video.Like?.length || 0);
    setDislikes(video.Dislike?.length || 0);

    if (user) {
      setIsLiked(video.Like?.includes(user._id) || false);
      setIsDisliked(video.Dislike?.includes(user._id) || false);
    } else {
      setIsLiked(false);
      setIsDisliked(false);
    }
  }, [video, user]);

  // Increment views
  const hasCountedView = useRef(false);

  useEffect(() => {
    if (hasCountedView.current) return; // already counted
    hasCountedView.current = true;

    const handleViews = async () => {
      try {
        if (user) {
          await axiosInstance.post(`/history/${video._id}`, { userId: user._id });
        } else {
          await axiosInstance.post(`/history/views/${video._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleViews();
  }, [user, video._id]);


  // Like video
  const handleLike = async () => {
    if (!user) return alert("Please login to like videos");

    try {
      const res = await axiosInstance.post(`/video/like/${video._id}`, {
        userId: user._id,
      });

      setLikes(res.data.totalLikes);
      setDislikes(res.data.totalDislikes);
      setIsLiked(res.data.liked);
      setIsDisliked(false);
    } catch (err) {
      console.error("❌ Like error:", err);
    }
  };

  // Dislike video
  const handleDislike = async () => {
    if (!user) return alert("Please login to dislike videos");

    try {
      const res = await axiosInstance.post(`/video/dislike/${video._id}`, {
        userId: user._id,
      });

      setLikes(res.data.totalLikes);
      setDislikes(res.data.totalDislikes);
      setIsDisliked(res.data.disliked);
      setIsLiked(false);
    } catch (err) {
      console.error("❌ Dislike error:", err);
    }
  };

  // Watch later
  // const handleWatchLater = async () => {
  //   if (!user) return;
  //   try {
  //     const res = await axiosInstance.post(`/watch/${video._id}`, {
  //       userId: user._id,
  //     });
  //     setIsWatchLater(res.data.watchlater || false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  // Inside useEffect: initialize Watch Later status

  // Check if video is already in Watch Later when component mounts
  useEffect(() => {
    const checkWatchLater = async () => {
      if (!user) return;

      try {
        const res = await axiosInstance.get(`/watch/${user._id}`);
        const savedVideos = res.data as any[];
        const exists = savedVideos.some(
          (item) => item.videoid._id === video._id
        );
        setIsWatchLater(exists);
      } catch (err) {
        console.error("❌ Watch Later fetch error:", err);
      }
    };

    checkWatchLater();
  }, [user, video._id]);

  // Updated handleWatchLater
  const handleWatchLater = async () => {
    if (!user) return alert("Please sign in to save videos.");

    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, {
        userId: user._id,
      });

      setIsWatchLater(res.data.watchlater);
      if (res.data.watchlater) {
        alert("Video added to Watch Later!");
      } else {
        alert("Video removed from Watch Later.");
      }
    } catch (error) {
      console.error("❌ Watch Later error:", error);
      alert("Something went wrong while saving Watch Later.");
    }
  };


  // Download video
  // const handleDownload = async (videoId: string) => {
  //   if (!user) return alert("Please sign in to download videos.");
  //   try {
  //     const res = await axiosInstance.post(`/download/${videoId}`, { userId: user._id });
  //     if (res.data.downloaded) {
  //       setIsDownload(true);
  //       alert("Video added to Downloads!");
  //     } else if (res.data.reason === "limit_reached") {
  //       setIsDownload(false);
  //       router.push("/premium");
  //     }
  //   } catch (err: any) {
  //     if (err.response && err.response.status === 400) {
  //       alert(err.response.data.message);
  //     } else {
  //       alert("Something went wrong while downloading");
  //       console.error("Download error:", err);
  //     }
  //   }
  // };


  const handleDownload = async () => {
  if (!user) return toast.error("Please sign in to download videos.");

  try {
    const res = await axiosInstance.post(
      `/download/${video._id}`,
      { userId: user._id },
      { withCredentials: true } // make sure cookies/JWT are sent
    );

    if (res.data.downloaded) {
      setIsDownload(true);
      toast.success("Video downloaded successfully!");
    }
  } catch (error: any) {
    console.error("Download error:", error);

    if (error.response && error.response.status === 403) {
      const { redirectUrl, message } = error.response.data;
      toast.error(message || "Download limit reached!");

      if (redirectUrl) {
        // Redirect to premium with return URL
        const currentVideoUrl = window.location.pathname;
        router.push({
          pathname: redirectUrl,
          query: { redirect: currentVideoUrl, videoId: video._id },
        });
      }
    } else {
      toast.error("Something went wrong while downloading.");
    }
  }
};



    // Subscribe to channel
    const handleSubscribe = async () => {
      if (!user) {
        alert("Please sign in to subscribe.");
        return;
      }

      try {
        const res = await axiosInstance.post(`/channel/subscribe/${video.userId}`, {
          userId: user._id,
        });

        if (res.data.success || res.data.message?.includes("Subscribed")) {
          alert(`You have subscribed to ${video.videochannel}!`);
        } else if (res.data.message?.includes("Unsubscribed")) {
          alert(`You have unsubscribed from ${video.videochannel}.`);
        } else {
          console.warn("⚠️ Unexpected subscribe response:", res.data);
        }
      } catch (error) {
        console.error("❌ Subscribe error:", error);
        alert("Subscription failed. Check console for details.");
      }
    };

    // return (
    //   <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
    //     <h1 className="text-xl font-semibold">{video.videotitle}</h1>

    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-4">
    //         <Avatar className="w-10 h-10">
    //           <AvatarFallback>{video.videochannel[0]}</AvatarFallback>
    //         </Avatar>
    //         <div>
    //           <h3 className="font-medium">{video.videochannel}</h3>
    //           <p className="text-sm text-gray-600">1.2M subscribers</p>
    //         </div>
    //         <Button
    //           className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
    //           onClick={handleSubscribe}
    //         >
    //           Subscribe
    //         </Button>
    //       </div>

    //       <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
    //         <Button variant="ghost" size="sm" className="rounded-l-full" onClick={handleLike}>
    //           <ThumbsUp className={`w-5 h-5 mr-2 ${isLiked ? "fill-black text-black" : ""}`} />
    //           {likes.toLocaleString()}
    //         </Button>
    //         <div className="w-px h-6 bg-gray-300" />
    //         <Button variant="ghost" size="sm" className="rounded-r-full" onClick={handleDislike}>
    //           <ThumbsDown className={`w-5 h-5 mr-2 ${isDisliked ? "fill-black text-black" : ""}`} />
    //           {dislikes.toLocaleString()}
    //         </Button>
    //         <Button variant="ghost" size="sm" onClick={handleWatchLater}>
    //           <Clock className="w-5 h-5 mr-2" />
    //           {isWatchLater ? "Saved" : "Watch Later"}
    //         </Button>
    //         <Button variant="ghost" size="sm">
    //           <Share className="w-5 h-5 mr-2" />
    //           Share
    //         </Button>
    //         <Button variant="ghost" size="sm" onClick={() => handleDownload(video._id)}>
    //           <Download className="w-5 h-5 mr-2" />
    //           {isDownload ? "Downloaded" : "Download"}
    //         </Button>
    //         <Button variant="ghost" size="icon">
    //           <MoreHorizontal className="w-5 h-5" />
    //         </Button>
    //       </div>
    //     </div>

    //     <div className="bg-gray-100 rounded-lg p-4">
    //       <div className="flex gap-4 text-sm font-medium mb-2">
    //         <span>{video.views.toLocaleString()} views</span>
    //         <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
    //       </div>
    //       <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
    //         <p>{video.description || "No description available."}</p>
    //       </div>
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         className="mt-2 p-0 h-auto font-medium"
    //         onClick={() => setShowFullDescription(!showFullDescription)}
    //       >
    //         {showFullDescription ? "Show less" : "Show more"}
    //       </Button>
    //     </div>
    //   </div>
    // );

    return (
      <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <h1 className="text-xl font-semibold">{video.videotitle}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{video.videochannel[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{video.videochannel}</h3>
              <p className="text-sm text-gray-600">1.2M subscribers</p>
            </div>
            <Button
              className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>

          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-full"
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`w-5 h-5 mr-2 ${isLiked ? "fill-black text-black" : ""
                    }`}
                />
                {likes.toLocaleString()}
              </Button>
              <div className="w-px h-6 bg-gray-300" />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-r-full"
                onClick={handleDislike}
              >
                <ThumbsDown
                  className={`w-5 h-5 mr-2 ${isDisliked ? "fill-black text-black" : ""
                    }`}
                />
                {dislikes.toLocaleString()}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 ${isWatchLater ? "text-primary" : ""
                }`}
              onClick={handleWatchLater}
            >
              <Clock className="w-5 h-5 mr-2" />
              {isWatchLater ? "Saved" : "Watch Later"}
            </Button>
            <Button variant="ghost" size="sm" className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
              <Share className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"
              onClick={() => handleDownload()} // <-- move onClick here
            >
              <Download className="w-5 h-5 mr-2" />
              {isDownload ? "Downloaded" : "Download"}
            </Button>

            <Button variant="ghost" size="icon" className="bg-gray-100 rounded-full text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4  text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <div className="flex gap-4 text-sm font-medium mb-2">
            <span>{video.views.toLocaleString()} views</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
            <p>{video.description || "No description available."}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 p-0 h-auto font-medium"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Show less" : "Show more"}
          </Button>
        </div>
      </div>
    );
  };

  export default VideoInfo;
