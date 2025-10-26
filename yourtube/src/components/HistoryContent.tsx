// import { formatDistanceToNow } from 'date-fns';
// import { Clock, MoreVertical, X } from 'lucide-react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { Button } from './ui/button';
// import axiosInstance from '@/lib/axiosInstance';
// import { useUser } from '@/lib/AuthContext';
// interface HistoryItem {
//     _id: string;
//     videoId: {
//         views: any;
//         _id: string;
//         videotitle: string;
//         videochannel: string;
//         viewer: number;
//         createdAt: string;
//     };
//     viewer: string;
//     watchedon: string;

// };
// export default function HistoryContent() {
//     const [history, setHistory] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { user } = useUser();
//     useEffect(() => {
//         if (user) {
//             loadHistory();
//         }
//     }, [user]);

//     const loadHistory = async () => {
//         if (!user) return;
//         try {
//             const historyData = await axiosInstance.get(`/history/${user?._id}`);
//             setHistory(historyData.data);
//         } catch (error) {
//             console.error("Error loading history:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleRemoveHistory = async (historyId: string) => {
//         try {
//             console.log("Removing history item with ID:", historyId);
//             setHistory((prevHistory => prevHistory.filter(item => item._id !== historyId)));
//         } catch (error) {
//             console.error("Error removing history items:", error);
//         }
//     }
//     if (!user) {
//         return (
//             <div className="text-center py-12">
//                 <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4"></Clock>
//                 <h2 className="text-xl font-semibold mb-2">Keep tract of what you watch</h2>
//                 <p className="text-gray-600">Watch history isnt viewable when signed out.</p>
//             </div>
//         );
//     }
//     if (loading) {
//         return <div>Loading...</div>;
//     }
//     if (history.length === 0) {
//         return (
//             <div className="text-center py-12">
//                 <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//                 <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
//                 <p className="text-gray-600">Videos you watch will appear here</p>
//             </div>
//         );
//     }
//     const videos = "/video/vdo.mp4";

//     return (
//         <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//             <div className="flex justify-between items-center">
//                 <p className="text-sm text-gray-600">{history.length} videos</p>
//             </div>
//             <div className="space-y-4">
//                 {history.map((item) => (
//                     <div key={item._id} className="flex gap-4 group">
//                         <Link href={`/history/${item.videoid._id}`} className="flex-shrink-0">
//                             <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
//                                 <video src={videos} className='object-cover group-hover:scale-105 transition-transform duration-200' />
//                             </div>
//                         </Link>
//                         <div className="flex-1 min-w-0">
//                             <Link href={`/history/${item.videoid._id}`}>
//                                 <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">{item.videoid.videotitle}</h3>
//                                 <p className="text-sm text-gray-600">{item.videoid.views.toLocaleString()} views {formatDistanceToNow(new Date(item.videoid.createdAt))} ago</p>
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
//                                 <DropdownMenuItem onClick={() => handleRemoveHistory(item._id)}>
//                                     <X className="w-4 h-4 mr-2" />
//                                     Remove from watch history
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
import { Clock, MoreVertical, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/lib/AuthContext';

interface HistoryItem {
    _id: string;
    videoid: {
        views: any;
        _id: string;
        videotitle: string;
        videochannel: string;
        viewer: number;
        createdAt: string;
        filepath:string;
    } | null;
    viewer: string;
    watchedon: string;
}

export default function HistoryContent() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) loadHistory();
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;
        try {
            const historyData = await axiosInstance.get(`/history/${user._id}`);
            setHistory(historyData.data);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveHistory = async (historyId: string) => {
        setHistory(prev => prev.filter(item => item._id !== historyId));
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Keep track of what you watch</h2>
                <p className="text-gray-600">Watch history isn't viewable when signed out.</p>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    if (history.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
                <p className="text-gray-600">Videos you watch will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{history.length} videos</p>
            </div>
            <div className="space-y-4">
                {history.map((item) => {
                    if (!item.videoid) return null; // skip deleted videos
                    const video = item.videoid;

                    return (
                        <div key={item._id} className="flex gap-4 group">
                            <Link href={`/history/${video._id}`} className="flex-shrink-0">
                                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                                    {/* <video src="/video/vdo.mp4" className='object-cover group-hover:scale-105 transition-transform duration-200' /> */}
                                    <video
                                        src={video.filepath} // actual uploaded video
                                        controls
                                        className='object-cover group-hover:scale-105 transition-transform duration-200'
                                    />

                                </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link href={`/history/${video._id}`}>
                                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">{video.videotitle}</h3>
                                    <p className="text-sm text-gray-600">{video.views?.toLocaleString() || 0} views • {formatDistanceToNow(new Date(video.createdAt))} ago</p>
                                </Link>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleRemoveHistory(item._id)}>
                                        <X className="w-4 h-4 mr-2" />
                                        Remove from watch history
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
