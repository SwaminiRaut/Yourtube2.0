import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { Globe, ThumbsDown, ThumbsUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
];

interface Comment {
  _id: string;
  videoid: string;
  userid: {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    city?: string;
  };
  commentbody: string;
  usercommented: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  city: string;
}

const Comments = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCityFromIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return data.city || "Unknown";
    } catch (err) {
      console.error("Failed to fetch city from IP:", err);
      return "Unknown";
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const city = await getCityFromIP(); // ✅ fetch live city
      const res = await axiosInstance.post(`/comment/postcomment`, {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
        city,
      });

      if (res.data?.success) {
        const newCommentWithUser = {
          ...res.data.newComment,
          userid: { _id: user._id, name: user.name, image: user.image },
          city,
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => [newCommentWithUser, ...prev]);
      }
      setNewComment("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingCommentId) return;
    try {
      const res = await axiosInstance.patch(`/comment/editcomment/${editingCommentId}`, {
        commentbody: editText,
      });
      if (res.status === 200) {
        setComments((prev) =>
          prev.map((c) => (c._id === editingCommentId ? res.data : c))
        );
        setEditingCommentId(null);
        setEditText("");
      }
    } catch (err: any) {
      console.error("Error updating comment:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data?.success) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const likedComment = async (id: string) => {
    try {
      const res = await axiosInstance.put(`/comment/${id}/like`);
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, likes: res.data.likes } : c))
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const dislikedComment = async (id: string) => {
    try {
      const res = await axiosInstance.put(`/comment/${id}/dislike`);
      if (res.data.message === "Comment removed due to dislikes") {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, dislikes: res.data.dislikes } : c))
        );
      }
    } catch (err) {
      console.error("Dislike failed", err);
    }
  };

  const translateComment = async (comment: Comment, lang: string) => {
    // Store original text in case of failure
    const originalText = comment.commentbody;

    // Show "Translating..." optimistically
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, commentbody: "Translating..." } : c
      )
    );

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: originalText, target: lang }),
      });

      const data = await res.json();
      console.log("🔄 Translation API Response:", data);

      if (res.ok && data.translatedText) {
        // ✅ Update with translated text
        setComments((prev) =>
          prev.map((c) =>
            c._id === comment._id
              ? { ...c, commentbody: data.translatedText }
              : c
          )
        );
      } else {
        console.error("⚠️ Translation failed:", data);
        // Revert to original text
        setComments((prev) =>
          prev.map((c) =>
            c._id === comment._id ? { ...c, commentbody: originalText } : c
          )
        );
      }
    } catch (err) {
      console.error("Translation request error:", err);
      // Revert to original text
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id ? { ...c, commentbody: originalText } : c
        )
      );
    }
  };




  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{comments.length} Comments</h2>

      {user && (
        <div className="flex gap-4 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{comment.usercommented?.[0]?.toUpperCase() ||
                  comment.userid?.name?.[0]?.toUpperCase() ||
                  "?"}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.usercommented}</span>
                  <span className="text-xs text-gray-600">{comment.city || "unknown"}</span>
                  <span className="text-xs text-gray-600">
                    {comment.createdAt
                      ? formatDistanceToNow(new Date(comment.createdAt)) + " ago"
                      : "just now"}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleUpdateComment}>Save</Button>
                      <Button variant="ghost" onClick={() => { setEditingCommentId(null); setEditText(""); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.commentbody}</p>
                    <div className="flex gap-3 mt-2 text-sm text-gray-500 items-center">
                      {translations[comment._id] && (
                        <p className="text-sm italic text-gray-600">
                          {translations[comment._id]}
                        </p>
                      )}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => likedComment(comment._id)}>
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs">{comment.likes || 0}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => dislikedComment(comment._id)}>
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                        <span className="text-xs">{comment.dislikes || 0}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Globe className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {languages.map((lang) => (
                            <DropdownMenuItem key={lang.code} onClick={() => translateComment(comment, lang.code)}>
                              {lang.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {comment.userid?._id === user?._id && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(comment)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id)}>Delete</Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;

