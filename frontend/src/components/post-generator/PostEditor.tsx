"use client";

import DevicePreview from "@/components/post-generator/DevicePreview";
import PostScheduler from "@/components/post-generator/PostScheduler";
import RichTextEditor from "@/components/post-generator/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fallbackText } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Save, Clock, ArrowDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Post {
  id: string;
  title: string;
  content: string;
  type: "Standard" | "Story" | "Facts" | "Professional";
  author: {
    name: string;
    position: string;
    profilePicture: string;
  };
  createdAt?: string;
}

interface PostEditorProps {
  post: Post;
  onSave: (post: any) => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [editedContent, setEditedContent] = useState(post?.content || "");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showScheduler, setShowScheduler] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Hide global sidebar hamburger while editing
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.add("hide-sidebar-trigger");
      return () => {
        document.body.classList.remove("hide-sidebar-trigger");
      };
    }
  }, []);

  // Save silently (no toast)
  const handleSave = () => {
    const updatedPost = {
      ...post,
      content: editedContent,
    };
    onSave(updatedPost);
  };

  // Save as draft with toast
  const handleSaveAsDraft = () => {
    handleSave();
    toast.success("Post saved as draft");
  };

  const handleSchedule = (date: Date) => {
    const updatedPost = {
      ...post,
      content: editedContent,
      scheduledDate: date,
    };
    onSave(updatedPost);
    toast.success(`Post scheduled for ${date.toLocaleString()}`);
    window.location.href = `/app/schedulePost?postId=${post.id}`;
  };

  if (showScheduler) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-lg mx-auto"
      >
        <Button variant="ghost" className="mb-4" onClick={() => setShowScheduler(false)}>
          <ArrowLeft size={16} className="mr-2" /> Back to Editor
        </Button>

        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-medium mb-6">Schedule Your Post</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose when you want your LinkedIn post to be published.
          </p>

          <PostScheduler onSchedule={handleSchedule} />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="post-editor-scope space-y-6 sm:space-y-8 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="gap-2 w-max" onClick={onCancel}>
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="text-sm font-medium text-muted-foreground order-3 sm:order-none">
          Editing {post.type} Post
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto order-2 sm:order-none">
          <DropdownMenu>
            <div className="flex w-full sm:w-auto gap-2 sm:gap-0 flex-wrap sm:flex-nowrap">
              {/* Save Post Button - silent save */}
              <Button onClick={handleSave} variant="secondary" className="flex items-center gap-2 rounded-md sm:rounded-r-none w-full sm:w-auto text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
                <Save size={16} />
                Save Post
              </Button>

              {/* Publish Now Button */}
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-md sm:rounded-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium w-full sm:w-auto text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <Send size={16} />
                Publish Now
              </Button>

              {/* Dropdown Trigger */}
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-md sm:rounded-l-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium w-full sm:w-auto text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
                  <ArrowDown size={16} />
                </Button>
              </DropdownMenuTrigger>
            </div>

            {/* Dropdown Items */}
            <DropdownMenuContent align="end" className="w-44 sm:w-48">
              <DropdownMenuItem onClick={handleSaveAsDraft} className="gap-2 cursor-pointer">
                <Save size={16} />
                Save as Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowScheduler(true)} className="gap-2 cursor-pointer">
                <Clock size={16} />
                Schedule Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-3">
          <h2 className="text-lg sm:text-xl font-medium">Edit Your Post</h2>
          <div className="w-full overflow-hidden">
            <RichTextEditor value={editedContent} onChange={setEditedContent} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-medium">Preview</h2>
            <DevicePreview currentDevice={previewDevice} onChange={setPreviewDevice} />
          </div>

          <div
            className={`linkedin-preview overflow-hidden w-full ${
              previewDevice === "mobile" ? "max-w-[360px]" : "max-w-full"
            } mx-auto border rounded-lg shadow-sm dark:border-neutral-700`}
          >
            <div className={`p-4 ${isDarkMode ? "bg-[#1B1F23] text-white" : "bg-white text-black"}`}>
              <div className="flex items-center mb-3">
                <Avatar
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    isDarkMode ? "bg-neutral-800 text-neutral-400" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <AvatarImage src={post?.author?.profilePicture} alt={post?.author?.name} />
                  <AvatarFallback className="text-black">{fallbackText(post?.author?.name || "")}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post?.author?.name || "Your Name"}</div>
                  <div className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>
                    {post?.author?.position || "Your Position"}
                  </div>
                </div>
              </div>

              <div className="post-content text-sm" dangerouslySetInnerHTML={{ __html: editedContent }} />
            </div>

            <div
              className={`border-t p-3 flex items-center justify-between ${
                isDarkMode ? "bg-neutral-900 border-neutral-800 text-neutral-400" : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <div className="flex gap-3 sm:gap-4 text-[11px] sm:text-xs">
                <div>Like</div>
                <div>Comment</div>
                <div>Share</div>
              </div>
              <div className="text-[11px] sm:text-xs">Send</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
  /* Hide sidebar hamburger triggers only while PostEditor is mounted */
  body.hide-sidebar-trigger .sidebar-trigger { display: none !important; }
        .post-content a {
          color: ${isDarkMode ? "#3b82f6" : "#0070f3"};
          text-decoration: underline;
          cursor: pointer;
        }

        .post-content a:hover {
          text-decoration: none;
        }
      `}</style>
    </motion.div>
  );
}
