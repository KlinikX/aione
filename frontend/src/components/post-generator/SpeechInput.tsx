"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpeechInputProps {
  transcript: string;
  onTranscript: (text: string) => void;
  handleGenerateHooks: () => void;
  className?: string;
  iconSize?: number;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onCancelRecording?: () => void;
  userEmail?: string;
  wsStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export default function SpeechInput({
  transcript,
  onTranscript,
  handleGenerateHooks,
  className,
  iconSize = 24,
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  userEmail,
  wsStatus,
}: SpeechInputProps) {
  // Removed inactivity timer logic. Recording will only stop when user clicks stop.
  // No cleanup needed for inactivity timer.

  // Toggle recording using parent-provided functions
  const toggleRecording = () => {
    if (isRecording) {
      console.log('🔴 Stopping recording via SpeechInput button');
      if (onStopRecording) {
        onStopRecording();
      }
    } else {
      console.log('🟢 Starting recording via SpeechInput button');
      if (onStartRecording) {
        onStartRecording();
      }
    }
  };

  return (
    <motion.button
      className={cn(
        "flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-300",
        isRecording && "ring-4 ring-white/30",
        wsStatus === 'connecting' && !isRecording && "bg-indigo-500/90 cursor-wait shadow-xl ring-2 ring-indigo-300/50",
        className
      )}
      onClick={wsStatus === 'connecting' ? undefined : toggleRecording}
      whileHover={{ scale: wsStatus === 'connecting' ? 1 : 1.08 }}
      whileTap={{ scale: wsStatus === 'connecting' ? 1 : 0.96 }}
      type="button"
      aria-label={isRecording ? "Stop recording" : wsStatus === 'connecting' ? "Connecting mic" : "Start recording"}
      title={isRecording ? "Stop recording" : wsStatus === 'connecting' ? "Connecting mic..." : "Start voice recording"}
      disabled={wsStatus === 'connecting'}
    >
      {wsStatus === 'connecting' && !isRecording ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="flex items-center justify-center w-full h-full mb-0.5 mt-4">
            <Mic className="animate-bounce text-white opacity-80" style={{ width: iconSize, height: iconSize }} />
          </span>
          <span className="text-xs text-white/80 animate-pulse text-center w-full mt-1" style={{ marginLeft: '8px' }}>
            Connecting...
          </span>
        </div>
      ) : isRecording ? (
        <MicOff
          style={{ width: iconSize, height: iconSize }}
          className="text-white drop-shadow animate-pulse"
        />
      ) : (
        <Mic
          style={{ width: iconSize, height: iconSize }}
          className="text-white drop-shadow"
        />
      )}
    </motion.button>
  );
}
