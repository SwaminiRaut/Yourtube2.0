// import { formatDistanceToNow } from 'date-fns';
// import { Clock, MoreVertical, Play, X } from 'lucide-react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { Button } from './ui/button';
// import axiosInstance from '@/lib/axiosInstance';
// import { useUser } from '@/lib/AuthContext';
// interface watchLaterItem {
//     _id: string;
//     videoId: string;
//     viewer: string;
//     watchedon: string;
//     video: {
//         views: any;
//         _id: string;
//         videotitle: string;
//         videochannel: string;
//         viewer: number;
//         createdAt: string;
//     };

// };

// export default function WatchLaterContent() {
//     const [WatchLater, setWatchLater] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { user } = useUser();
//     useEffect(() => {
//         if (user) {
//             loadWatchLater();
//         }
//     }, [user]);

//     const loadWatchLater = async () => {
//         if (!user) return;
//         try {
//             const watchLaterData = await axiosInstance.get(`/watch/${user?._id}`);
//             setWatchLater(watchLaterData.data);
//         } catch (error) {
//             console.error("Error loading history:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handlewatchlater = async (WatchlaterId: string) => {
//         try {
//             console.log("Removing history item with ID:", WatchlaterId);
//             setWatchLater(WatchLater.filter(item => item._id !== WatchlaterId));
//         } catch (error) {
//             console.error("Error removing history items:", error);
//         }
//     }
//     if (!user) {
//         return (
//             <div className="text-center py-12">
//                 <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4"></Clock>
//                 <h2 className="text-xl font-semibold mb-2">Add the videos in watch later</h2>
//                 <p className="text-gray-600">Sign in to see your watched later videos</p>
//             </div>
//         );
//     }
//     if (loading) {
//         return <div>Loading videos...</div>;
//     }
//     if (WatchLater.length === 0) {
//         return (
//             <div className="text-center py-12">
//                 <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//                 <h2 className="text-xl font-semibold mb-2">No liked videos yet</h2>
//                 <p className="text-gray-600">Videos you added to watch later will appear here</p>
//             </div>
//         );
//     }
//     const videos = "/video/vdo.mp4";
//     return (
//         <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//             <div className="flex justify-between items-center">
//                 <p className="text-sm text-gray-600">{history.length} videos</p>
//                 <Button><Play />Play all</Button>
//             </div>
//             <div className="space-y-4">
//                 {WatchLater.map((item) => (
//                     <div key={item._id} className="flex gap-4 group">
//                         <Link href={`/watch/${item.videoid._id}`} className="flex-shrink-0">
//                             <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
//                                 <video src={videos} className='object-cover group-hover:scale-105 transition-transform duration-200' />
//                             </div>
//                         </Link>
//                         <div className="flex-1 min-w-0">
//                             <Link href={`/watch/${item.videoid._id}`}>
//                                 <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">{item.videoid.videotitle}</h3>
//                                 <p className="text-sm text-gray-600">Added {formatDistanceToNow(new Date(item.videoid.createdAt))} ago</p>
//                             </Link>
//                         </div>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost"
//                                     size="icon"
//                                     className="opacity-0 group-hover:opacity-100">
//                                     <MoreVertical className="w-4 h-4" />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                                 <DropdownMenuItem onClick={() => handlewatchlater(item._id)}>
//                                     <X className="w-4 h-4 mr-2" />
//                                     Remove from watchlater videos
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

import { formatDistanceToNow } from 'date-fns';
import { Clock, MoreVertical, Play, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/lib/AuthContext';

interface WatchLaterItem {
  _id: string;
  user: string;
  videoid: {
    _id: string;
    videotitle: string;
    videochannel: string;
    createdAt: string;
    views: number;
    filetype: string;
    filepath: string;
    thumbnail:string,
  };
  createdAt: string; // when added to Watch Later
}

export default function WatchLaterContent() {
  const { user } = useUser();
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadWatchLater();
  }, [user]);

  const loadWatchLater = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(`/watch/${user._id}`);
      // Filter duplicates by videoid._id
      const uniqueVideos: WatchLaterItem[] = [];
      const seenIds = new Set<string>();

      res.data.forEach((item: WatchLaterItem) => {
        if (!seenIds.has(item.videoid._id)) {
          seenIds.add(item.videoid._id);
          uniqueVideos.push(item);
        }
      });

      setWatchLater(uniqueVideos);
    } catch (error) {
      console.error('Error loading Watch Later:', error);
    } finally {
      setLoading(false);
    }
  };


  const removeFromWatchLater = async (id: string) => {
    try {
      const item = watchLater.find((w) => w._id === id);
      if (!item || !user) return;
      await axiosInstance.post(`/watch/${item.videoid._id}`, { userId: user._id });
      setWatchLater((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error('Error removing Watch Later item:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Add videos to Watch Later</h2>
        <p className="text-gray-600">Sign in to see your Watch Later videos</p>
      </div>
    );
  }

  if (loading) return <div>Loading videos...</div>;

  if (watchLater.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No videos in Watch Later</h2>
        <p className="text-gray-600">Videos you add to Watch Later will appear here</p>
      </div>
    );
  }
  

  return (
    <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{watchLater.length} videos</p>
        <Button><Play /> Play all</Button>
      </div>
      <div className="space-y-4">
        {watchLater.map((item) => (
          <div key={item._id} className="flex gap-4 group">
            <Link href={`/watch/${item.videoid._id}`} className="flex-shrink-0">
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                {item.videoid.thumbnail ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.videoid.thumbnail}`}
                    alt={item.videoid.videotitle}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Thumbnail
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/watch/${item.videoid._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">{item.videoid.videotitle}</h3>
                <p className="text-sm text-gray-600">
                  Added {formatDistanceToNow(new Date(item.createdAt))} ago
                </p>
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => removeFromWatchLater(item._id)}>
                  <X className="w-4 h-4 mr-2" />
                  Remove from Watch Later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
