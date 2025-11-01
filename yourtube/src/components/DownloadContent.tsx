import { formatDistanceToNow } from 'date-fns';
import { Clock, Download, MoreVertical, Play, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/lib/AuthContext';

interface DownloadItem {
  _id: string;
  viewer: string;
  downloadedon: string;
  video: {
    _id: string;
    videotitle: string;
    videourl: string;
    videochannel: string;
    views: number;
    createdAt: string;
  } | null;
}

export default function DownloadContent() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?._id) {
      loadDownloads();
    }
  }, [user?._id]);

  const loadDownloads = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching downloads for user:", user?._id);
      const response = await axiosInstance.get(`/download/${user?._id}`);
      const data: DownloadItem[] = response.data;
      // filter out downloads where video is null
      setDownloads(data.filter(d => d.video !== null));
    } catch (err: any) {
      console.error("Error loading downloads:", err.response?.data || err.message);
      setError("Failed to load downloads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (downloadId: string) => {
  try {
    await axiosInstance.delete(`/download/${downloadId}`);
    setDownloads(downloads.filter(d => d._id !== downloadId));
  } catch (err) {
    console.error("Error removing download:", err);
  }
};


  if (!user?._id) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Add the videos in download</h2>
        <p className="text-gray-600">Sign in to see your downloaded videos</p>
      </div>
    );
  }

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No downloaded videos yet</h2>
        <p className="text-gray-600">Videos you added to download will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{downloads.length} videos</p>
        <Button><Play className='w-4 h-4 mr-2' />Play all</Button>
      </div>
      <div className="space-y-4">
        {downloads.map(item => (
          <div key={item._id} className="flex gap-4 group">
            <Link href={`/watch/${item.video?._id}`}>
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                {item.video?.videourl ? (
                  <video
                    src={item.video.videourl}
                    controls
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Video not available</div>
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/watch/${item.video?._id}`}>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                  {item.video?.videotitle || "Unknown Video"}
                </h3>
                {item.video?.createdAt && (
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(item.video.createdAt))} ago
                  </p>
                )}
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRemove(item._id)}>
                  <X className="w-4 h-4 mr-2" />Remove from downloads
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
