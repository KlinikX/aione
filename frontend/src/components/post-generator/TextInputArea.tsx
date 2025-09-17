"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export default function TextInputArea({ value, onChange, onSubmit, isLoading }: TextInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleMicClick = () => {
    toast.info("Voice input is not available yet");
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div 
      className="rounded-xl bg-white border shadow-sm overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your content idea or topic here..."
        className="resize-none p-4 border-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[200px] text-base"
      />
      
      <div className="flex items-center justify-between bg-gray-50 p-3 border-t">
        <div className="text-xs text-gray-500">
          Press Ctrl+Enter to generate
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleMicClick}
          >
            <Mic size={18} />
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating
              </>
            ) : (
              <>
                <Send size={16} className="mr-1" />
                Generate Posts
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}