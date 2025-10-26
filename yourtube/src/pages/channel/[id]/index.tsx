import ChannelHeader from '@/components/ChannelHeader';
import Channeltabs from '@/components/Channeltabs';
import ChannelVideo from '@/components/ChannelVideo';
import VideoUploader from '@/components/videoUploader';
import { useUser } from '@/lib/AuthContext';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react'

const index = () => {
    const router = useRouter()
    const { id } = router.query;
    const {user}=useUser();
    // const user: any = {
    //     id: "1",
    //     name: "John Doe",
    //     email: "john@example.com",
    //     image: "https://github.com/shadcn.png?height-34&width-32",
    // };
    try {
        let channel=user;
        const videos = [
            {
                _id: "1",
                videotitle: "Amazing Nature Documentary",
                filename: "nature-doc.mp4",
                filetype: "video/mp4",
                filepath: "/videos/nature-doc.mp4",
                filesize: "500MB",
                videochannel: "Nature Channel",
                Like: 1250,
                views: 45000,
                uploader: "nature_lover",
                createdAt: new Date().toISOString(),
            },
            {
                _id: "2",
                videotitle: "Cooking Tutorial: Perfect Pasta",
                filename: "pasta-tutorial.mp4",
                filetype: "video/mp4",
                filepath: "/videos/pasta-tutorial.mp4",
                filesize: "300MB",
                videochannel: "Chef's Kitchen",
                Like: 890,
                views: 23000,
                uploader: "chef_master",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
        ];
        return (
            <div className='flex-1 min-h-screen bg-white  text-black dark:bg-gray-900 dark:text-white transition-colors duration-300'>
                <div className='max-w-full mx-auto'>
                    <ChannelHeader channel={channel} user={user} />
                    <Channeltabs />
                    <div className='px-4 pb-8'>
                        <VideoUploader channelId={id} channelName={channel.channelname} />
                    </div>
                    <div className="px-4 pb-8">
                        <ChannelVideo videos={videos}/>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.log("error fetching channel data:", error);
        
    }
};

export default index;