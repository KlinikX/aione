"use client";

import { useState } from "react";
import { Calendar, Edit, User, Clock, ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface PostPreviewProps {
  post: {
    id: string;
    title: string;
    content: string;
    type: "Standard" | "Story" | "Facts" | "Professional";
    authorName?: string;
    authorPosition?: string;
  };
  onEdit: () => void;
  onSchedule: () => void;
}

export default function PostPreview({ post, onEdit, onSchedule }: PostPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const getCardColor = () => {
    if (isDarkMode) {
      return "bg-[#1B1F23] border-neutral-700 text-white";
    }
    
    switch (post.type) {
      case "Standard":
        return "bg-white border-gray-200 text-black";
      case "Story":
        return "bg-white border-gray-200 text-black";
      case "Facts":
        return "bg-white border-gray-200 text-black";
      case "Professional":
        return "bg-white border-gray-200 text-black";
      default:
        return "bg-white border-gray-200 text-black";
    }
  };

  const getBadgeColor = () => {
    if (isDarkMode) {
      switch (post.type) {
        case "Standard":
          return "bg-blue-900/70 text-blue-300";
        case "Story":
          return "bg-amber-900/70 text-amber-300";
        case "Facts":
          return "bg-emerald-900/70 text-emerald-300";
        case "Professional":
          return "bg-purple-900/70 text-purple-300";
        default:
          return "bg-neutral-800 text-neutral-300";
      }
    }
    
    switch (post.type) {
      case "Standard":
        return "bg-blue-100 text-blue-800";
      case "Story":
        return "bg-amber-100 text-amber-800";
      case "Facts":
        return "bg-emerald-100 text-emerald-800";
      case "Professional":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-lg border shadow-sm overflow-hidden relative",
        getCardColor()
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LinkedIn post header */}
      <div className="p-4">
        <div className="flex items-start">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mr-3",
            isDarkMode ? "bg-neutral-800 text-neutral-400" : "bg-gray-200 text-gray-500"
          )}>
            <User size={20} />
          </div>
          <div>
            <div className="font-semibold text-[14px]">{post.authorName || "Your Name"}</div>
            <div className={cn("text-xs", isDarkMode ? "text-neutral-400" : "text-gray-500")}>
              {post.authorPosition || "Your Position"}
            </div>
            <div className={cn("text-xs flex items-center mt-1", isDarkMode ? "text-neutral-400" : "text-gray-500")}>
              <Clock size={12} className="mr-1" />
              <span>Just now</span> • <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", getBadgeColor())}>
                {post.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn post content */}
      <div className="px-4 pb-3">
        <div 
          className="text-sm max-h-[200px] overflow-hidden relative" 
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className={cn(
          "absolute bottom-16 left-0 right-0 h-12 bg-gradient-to-t pointer-events-none",
          isDarkMode ? "from-[#1B1F23]" : "from-white"
        )}></div>
      </div>

      {/* LinkedIn interaction buttons */}
      <div className={cn(
        "border-t px-4 py-2 flex justify-between items-center",
        isDarkMode 
          ? "border-neutral-800 bg-neutral-900 text-neutral-400" 
          : "border-gray-100 bg-gray-50 text-gray-500"
      )}>
        <div className="flex gap-4">
          <div className={cn(
            "flex items-center text-xs cursor-pointer", 
            isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
          )}>
            <ThumbsUp size={14} className="mr-1" />
            <span>Like</span>
          </div>
          <div className={cn(
            "flex items-center text-xs cursor-pointer", 
            isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
          )}>
            <MessageSquare size={14} className="mr-1" />
            <span>Comment</span>
          </div>
          <div className={cn(
            "flex items-center text-xs cursor-pointer", 
            isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
          )}>
            <Share2 size={14} className="mr-1" />
            <span>Repost</span>
          </div>
        </div>
        <div className={cn(
          "flex items-center text-xs cursor-pointer", 
          isDarkMode ? "hover:text-blue-400" : "hover:text-blue-600"
        )}>
          <Send size={14} className="mr-1" />
          <span>Send</span>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button onClick={onEdit} variant="default" className="gap-2">
              <Edit size={16} />
              Edit
            </Button>
            <Button 
              onClick={onSchedule} 
              variant="outline" 
              className={isDarkMode ? "border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700" : "bg-white"}
            >
              <Calendar size={16} />
              Schedule
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}