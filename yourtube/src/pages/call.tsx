import VideoCall from "@/components/videoCall";

export default function CallPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <VideoCall currentUserId="user1" targetUserId="user2" />
    </div>
  );
}
