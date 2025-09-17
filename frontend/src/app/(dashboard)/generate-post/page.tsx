"use client";

import { TemplateSelect } from "@/components/TemplateSelect";
import VoicePromptEmptyState from "@/components/VoicePromptEmptyState";
import { Ripple } from "@/components/magicui/Ripple";
import PostEditor, { Post } from "@/components/post-generator/PostEditor";
import SpeechInput from "@/components/post-generator/SpeechInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  baseURL,
  generateHooks,
  generatePostStream,
  saveDraftPost,
  selectHook,
} from "@/constant/endpoint";
import { savedPosts } from "@/constant/routes";
import { User } from "@/context/User";
import { useUser } from "@/context/UserProvider";
import { cn } from "@/lib/utils";
import { apiInstance } from "@/services";
import { getToken } from "@/utils/cookies";
import { formatTextToHtml } from "@/utils/formatTextToHtml";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Loader2, Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X } from 'lucide-react';
interface Hook {
  number: number;
  hook: string;
}

interface Message {
  type: "user" | "assistant";
  content: string;
  hooks?: Hook[];
  isLoading?: boolean;
  isGeneratingHooks?: boolean;
}

export default function GeneratePostPage() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const router = useRouter();

  const [isTemplateSelected, setIsTemplateSelected] = useState<boolean>(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);
  const [realtimeTranscript, setRealtimeTranscript] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const { userState }: { userState: User | null } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Raw PCM Audio and WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Add recording state ref to avoid timing issues
  const isRecordingRef = useRef<boolean>(false);
  // Timeout ref for hooks generation debouncing
  const hooksTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Chunking for 1s segments for smoother transcript handling
  const pendingChunksRef = useRef<Int16Array[]>([]);
  const pendingLengthRef = useRef<number>(0);
  const samplesPerChunkRef = useRef<number>(16000 * 2); // 2 seconds at 16kHz
  
  // WebSocket connection states (only when recording)
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Handle transcript updates from WebSocket - optimized for smooth real-time display
  const handleTranscript = useCallback((text: string) => {
    if (!text || !text.trim()) {
      return; // Skip empty transcripts silently
    }
    
    const cleanText = text.trim();
    
    // Always update realtime transcript for smooth display
    setRealtimeTranscript(cleanText);
    
    // Smart logic for longer paragraphs - only update userInput when text seems complete
    // This prevents premature hooks generation for long content
    const isCompleteThought = cleanText.length > 50 && 
      (cleanText.endsWith('.') || cleanText.endsWith('!') || cleanText.endsWith('?') || 
       cleanText.includes('. ') || cleanText.includes('! ') || cleanText.includes('? '));
    
    const isShortComplete = cleanText.length <= 50 && cleanText.length > 10 && 
      (cleanText.endsWith('.') || cleanText.endsWith('!') || cleanText.endsWith('?'));
    
    // Only update userInput for complete thoughts to avoid interrupting long paragraphs
    if (isCompleteThought || isShortComplete) {
      setUserInput(cleanText);
      console.log('📝 Complete thought detected, updating userInput:', cleanText.substring(0, 50) + '...');
    } else {
      console.log('📝 Partial transcript (realtime only):', cleanText.substring(0, 50) + '...');
    }
  }, []);

  // Optimized debugging - reduced logging for better performance
  useEffect(() => {
    if (realtimeTranscript) {
      console.log('🔍 Transcript update:', realtimeTranscript.substring(0, 30) + (realtimeTranscript.length > 30 ? '...' : ''));
    }
  }, [realtimeTranscript]);

  const handleGenerateHooks = useCallback(async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setPost(null);

    // Add user message and a loading message for hooks
    setMessages((prev) => [
      ...prev,
      { type: "user", content: userInput },
      {
        type: "assistant",
        content: "Generating hooks...",
        isLoading: true,
        isGeneratingHooks: true,
      },
    ]);

    try {
      const response = await apiInstance.post(
        generateHooks,
        { user_input: userInput },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data as { hooks?: string[] };
      console.log('🔗 Hooks API response:', data);
      console.log('🔗 Raw hooks data:', data?.hooks);
      console.log('🔗 Hooks type:', typeof data?.hooks);
      console.log('🔗 Is hooks array?', Array.isArray(data?.hooks));
      
      // Ensure hooks is an array of strings and map to Hook objects
      const hooksArray = Array.isArray(data?.hooks) ? data.hooks : [];
      console.log('🔗 Hooks array before processing:', hooksArray);
      
      const hooks: Hook[] = hooksArray.map((hookText: any, i: number) => {
        console.log(`🔗 Processing hook ${i + 1}:`, hookText, 'Type:', typeof hookText);
        
        // Handle different possible formats
        let processedHook = '';
        if (typeof hookText === 'string') {
          processedHook = hookText;
        } else if (typeof hookText === 'object' && hookText !== null) {
          // If it's an object, try to extract the hook text
          processedHook = hookText.hook || hookText.text || hookText.content || JSON.stringify(hookText);
        } else {
          processedHook = String(hookText);
        }
        
        console.log(`🔗 Processed hook ${i + 1}:`, processedHook);
        return { 
          number: i + 1, 
          hook: processedHook
        };
      });

      console.log('🔗 Final processed hooks:', hooks);

      // Replace loading message with hooks
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isGeneratingHooks),
        {
          type: "assistant",
          content: "Here are some hooks. Click one to generate a post.",
          hooks,
        },
      ]);
    } catch (error) {
      console.error("Hooks generation error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isGeneratingHooks),
        { type: "assistant", content: "Sorry, I couldn't generate hooks. Please try again." },
      ]);
      toast({ title: "Error", description: "Failed to generate hooks", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, toast]);

  // Connect WebSocket only when recording starts with retry logic
  const connectWebSocketForRecording = useCallback(async () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setWsStatus('connecting');

    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptConnection = async (): Promise<void> => {
      try {
        const WS_URL = 'wss://aione.klinik-x.de/backend/ws/audio';
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        return new Promise((resolve, reject) => {
          ws.onopen = () => {
            console.log('🔌 WebSocket connected successfully');
            setWsStatus('connected');
            // Identify stream format and user (optional)
            const hello = {
              type: 'start',
              format: 'raw_pcm_16bit',
              sample_rate: 16000,
              channels: 1,
              email: userState?.email || undefined,
            };
            ws.send(JSON.stringify(hello));
            resolve();
          };

          ws.onerror = (err) => {
            console.error('⚠️ WebSocket error:', err);
            setWsStatus('error');
            reject(err);
          };

          ws.onclose = (event) => {
            console.log('🔌 WebSocket closed:', event.code, event.reason);
            setWsStatus('disconnected');
            if (event.code !== 1000) { // Not a normal closure
              reject(new Error(`WebSocket closed with code ${event.code}: ${event.reason}`));
            }
          };

          ws.onmessage = async (event) => {
            const ts = new Date().toISOString();
            try {
              let rawText: string | null = null;

              if (typeof event.data === 'string') {
                rawText = event.data;
              } else if (event.data instanceof Blob) {
                rawText = await event.data.text();
              } else if (event.data instanceof ArrayBuffer) {
                rawText = new TextDecoder().decode(event.data);
              }

              if (rawText != null) {
                const trimmed = rawText.trim();
                
                // Reduced logging for performance
                if (trimmed !== 'ping' && !trimmed.includes('pong')) {
                  console.log('📨 WS message:', trimmed.substring(0, 100) + (trimmed.length > 100 ? '...' : ''));
                }

                // Handle ping messages
                if (trimmed === 'ping') {
                  ws.send(JSON.stringify({ message: 'pong' }));
                  return;
                }

                // Try JSON parsing
                try {
                  const data = JSON.parse(trimmed);

                  if (data?.message === 'ping') {
                    ws.send(JSON.stringify({ message: 'pong' }));
                    return;
                  }

                  // Handle various transcript formats with priority order for speed
                  const transcriptFields = ['transcription', 'transcript', 'text', 'result', 'partial', 'streaming'];
                  for (const field of transcriptFields) {
                    if (typeof data?.[field] === 'string' && data[field].trim()) {
                      handleTranscript(data[field]);
                      return;
                    }
                  }

                  // Handle "Transcriptions Generated" message
                  if (data?.message === 'Transcriptions Generated' && data?.transcription) {
                    handleTranscript(data.transcription);
                    return;
                  }

                } catch {
                  // Silently handle non-JSON messages for performance
                }
              }
            } catch (err) {
              console.error('⚠️ Error handling WS message:', err);
            }
          };
        });
      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        throw error;
      }
    };

    // Retry logic
    while (retryCount <= maxRetries) {
      try {
        await attemptConnection();
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ WebSocket connection attempt ${retryCount} failed:`, error);
        
        if (retryCount <= maxRetries) {
          console.log(`🔄 Retrying WebSocket connection in ${retryCount} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
        } else {
          setWsStatus('error');
          throw new Error(`Failed to connect to WebSocket after ${maxRetries} attempts`);
        }
      }
    }
  }, [handleTranscript, userState?.email]);

  // Close WebSocket connection when recording stops
  const closeWebSocketConnection = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔌 Closing WebSocket connection...');
      wsRef.current.close(1000, 'Recording finished');
      wsRef.current = null;
      setWsStatus('disconnected');
    }
  }, []);

  // Note: Real-time PCM streaming replaces batch audio sending

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup Raw PCM Audio and WebSocket on unmount
  useEffect(() => {
    return () => {
      // Stop PCM recording if active
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close WebSocket connection
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      console.log('🧹 Cleanup completed');
    };
  }, []);

  // Note: WebSocket connection now only happens when recording starts
  // No more auto-connect on page load

  // Start Raw PCM Recording - Connect WebSocket only when recording
  const handleStartRecording = useCallback(async () => {
    try {
      console.log('🎤 Starting raw PCM recording...');
      
      // Clear both transcripts when starting new recording
      setRealtimeTranscript('');
      setUserInput('');
      
      // Connect WebSocket only when recording starts
      await connectWebSocketForRecording();
      
      // Wait for WebSocket to connect
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 5000);
        
        const checkConnection = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            clearTimeout(timeout);
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
      
      console.log('✅ WebSocket connected for PCM recording');

      // Get microphone access with optimal settings for speech
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: 16000, min: 8000, max: 48000 },
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleSize: 16,
          // Additional constraints for better recording
          gooEchoCancellation: true,
          googAutoGainControl: true,
          googNoiseSuppression: true,
          googHighpassFilter: true,
          googTypingNoiseDetection: true,
          latency: { ideal: 0.01 },
        }
      });
      
      streamRef.current = stream;
      console.log('🎵 Got microphone access');
      
      // Add better audio level monitoring for microphone efficiency
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Enhanced audio level monitoring with feedback
      const checkAudioLevel = () => {
        if (!isRecording) return;
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const peak = Math.max(...dataArray);
        
        if (average < 5) {
          console.log('⚠️ Very low audio level detected - check microphone or speak louder');
        } else if (average > 5 && average < 15) {
          console.log('⚠️ Low audio level detected - speak closer to microphone');
        } else if (average >= 15 && average < 80) {
          console.log('✅ Good audio level detected:', { average, peak });
        } else if (average >= 80) {
          console.log('⚠️ Audio level too high - may cause distortion:', { average, peak });
        }
        
        requestAnimationFrame(checkAudioLevel);
      };
      
      requestAnimationFrame(checkAudioLevel);
      
      // Create raw PCM processing chain (16kHz mono) with better audio context
      const audioContextOptions: AudioContextOptions = {
        sampleRate: 16000,
        latencyHint: 'interactive' as AudioContextLatencyCategory,
      };
      
      audioContextRef.current = new AudioContext(audioContextOptions);
      
      // Wait for audio context to be ready
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Use optimized buffer size for 1-second chunking
      processorRef.current = audioContextRef.current.createScriptProcessor(2048, 1, 1);
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      console.log('🎵 PCM AudioContext ready - sampleRate:', audioContextRef.current.sampleRate);

      // Clear any existing audio chunks
      pendingChunksRef.current = [];
      pendingLengthRef.current = 0;
      console.log('🔄 Audio buffers cleared for new recording session');

      // Helpers
      const encodeAndSend = (samples: Int16Array) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const u8 = new Uint8Array(samples.buffer);
        let binary = '';
        for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]);
        const base64 = btoa(binary);
        const message = {
          // Aligning with backend test button schema
          stream_bytes: base64,
          format: 'raw_pcm_16bit',
          sample_rate: 16000,
          channels: 1,
          // Optional: marker to indicate a logical chunk boundary
          chunk_seconds: 2, // 2 second chunks for smoother processing
        };
        console.log('📤 Sent 2s PCM chunk:', { 
          samples: samples.length, 
          bytes: u8.length, 
          base64Length: base64.length,
          sampleRate: 16000,
          timestamp: new Date().toISOString(),
          chunkNumber: Math.floor(Date.now() / 1000) % 1000 // 1-second chunk counter
        });
        wsRef.current.send(JSON.stringify(message));
        
        // Also send a simpler format in case backend expects different schema
        const alternativeMessage = {
          audio_data: base64,
          format: 'pcm',
          sample_rate: 16000,
          channels: 1,
          samples: samples.length
        };
        // Send alternative format immediately without delay
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log('📤 Sent alternative PCM format');
          wsRef.current.send(JSON.stringify(alternativeMessage));
        }
      };

      const drainExactly = (count: number): Int16Array => {
        const out = new Int16Array(count);
        let filled = 0;
        while (filled < count && pendingChunksRef.current.length) {
          const first = pendingChunksRef.current[0];
          const need = count - filled;
          if (first.length <= need) {
            out.set(first, filled);
            filled += first.length;
            pendingChunksRef.current.shift();
          } else {
            out.set(first.subarray(0, need), filled);
            // keep the leftover in place
            pendingChunksRef.current[0] = first.subarray(need);
            filled += need;
          }
        }
        pendingLengthRef.current -= count;
        return out;
      };

      // Stream PCM frames over WebSocket in 0.5s chunks with improved error handling
      processorRef.current.onaudioprocess = (ev) => {
        // Use ref for more reliable recording state check
        const recordingActive = isRecordingRef.current;
        const wsReady = wsRef.current?.readyState === WebSocket.OPEN;
        
        if (!recordingActive || !wsReady) {
          return; // Skip logging for performance
        }

        const input = ev.inputBuffer.getChannelData(0); // Float32 [-1, 1]
        
        // Check for valid audio input with lower threshold for faster response
        const hasAudio = input.some(sample => Math.abs(sample) > 0.0005);
        if (!hasAudio) {
          return; // Skip silent frames without logging
        }

        // Convert Float32 -> 16-bit PCM with optimized processing
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          let s = input[i];
          // Apply gentle compression to improve dynamic range
          s = Math.sign(s) * Math.pow(Math.abs(s), 0.8);
          s = Math.max(-1, Math.min(1, s));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Accumulate into 1s buffers for smoother transcript flow
        pendingChunksRef.current.push(pcm);
        pendingLengthRef.current += pcm.length;

        // Send chunks as soon as they're ready for 1-second processing
        while (pendingLengthRef.current >= samplesPerChunkRef.current) {
          const chunk = drainExactly(samplesPerChunkRef.current);
          encodeAndSend(chunk);
        }
      };

      // Wire up the nodes
      microphoneRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      // Set recording state - both state and ref for reliable checking
      setIsRecording(true);
      isRecordingRef.current = true;
      
      console.log('🔗 Audio nodes connected and recording started');
  console.log('📊 Expected chunk size:', samplesPerChunkRef.current, 'samples (2 seconds)');
      console.log('🎯 Recording state set - state:', true, 'ref:', isRecordingRef.current);
      
    } catch (error) {
      console.error('❌ Error starting PCM recording:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
      closeWebSocketConnection();
      
      // Provide more specific error messages
      let errorMessage = 'Failed to start microphone recording';
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError') || error.message.includes('Permission denied')) {
          errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
        } else if (error.message.includes('NotFoundError') || error.message.includes('No audio input')) {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.message.includes('WebSocket')) {
          errorMessage = 'Failed to connect to transcription service. Please check your internet connection.';
        }
      }
      
      toast({
        title: 'Recording Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [connectWebSocketForRecording, isRecording, closeWebSocketConnection, toast]);

  // Stop Recording
  // Stop PCM Recording and close WebSocket
  const handleStopRecording = useCallback(() => {
    console.log('⏹️ Stopping PCM recording...');
    
    // Stop raw PCM processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Flush any remaining audio as a final (short) chunk
    if (pendingLengthRef.current > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 Flushing final audio chunk:', pendingLengthRef.current, 'samples');
      const leftover = ((): Int16Array => {
        const out = new Int16Array(pendingLengthRef.current);
        let filled = 0;
        while (pendingChunksRef.current.length) {
          const buf = pendingChunksRef.current.shift()!;
          out.set(buf, filled);
          filled += buf.length;
        }
        pendingLengthRef.current = 0;
        return out;
      })();
      // Reuse same encoding path
      const u8 = new Uint8Array(leftover.buffer);
      let binary = '';
      for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]);
      const base64 = btoa(binary);
      wsRef.current.send(JSON.stringify({ 
        stream_bytes: base64, 
        format: 'raw_pcm_16bit', 
        sample_rate: 16000, 
        channels: 1,
        is_final: true 
      }));
      // Optional: signal end of stream
      wsRef.current.send(JSON.stringify({ type: 'stop' }));
      console.log('✅ Final chunk and stop signal sent');
    } else {
      console.log('⚠️ No pending audio to flush or WebSocket not open');
    }

    setIsRecording(false);
    isRecordingRef.current = false;
    
    // Close WebSocket connection when recording stops
    closeWebSocketConnection();
    
    console.log('✅ PCM recording stopped and WebSocket closed');
    
    // Keep the final merged transcript from backend
    console.log('✅ Final transcript preserved:', userInput.trim());
    
    // Clear real-time display after recording stops
    setTimeout(() => {
      setRealtimeTranscript('');
    }, 500); // Clear state quickly
    
    // Clear any pending hooks generation
    if (hooksTimeoutRef.current) {
      clearTimeout(hooksTimeoutRef.current);
    }
    
    // Auto-generate hooks only for complete thoughts to avoid interrupting long paragraphs
    if (userInput.trim() && userInput.length > 15) {
      console.log('🔗 Auto-generating hooks with complete transcript:', userInput.trim().substring(0, 50) + '...');
      hooksTimeoutRef.current = setTimeout(() => {
        handleGenerateHooks();
      }, 1500); // Longer delay to allow for complete paragraphs
    } else {
      console.log('⚠️ Waiting for more complete transcription before hooks generation');
    }
  }, [userInput, closeWebSocketConnection, handleGenerateHooks]);

  // Cancel PCM Recording
  const handleCancelRecording = useCallback(() => {
    console.log('❌ Cancelling PCM recording...');
    
    // Stop PCM processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear transcript and pending audio chunks
    setUserInput('');
    setRealtimeTranscript('');
    pendingChunksRef.current = [];
    pendingLengthRef.current = 0;
    
    setIsRecording(false);
    isRecordingRef.current = false;
    
    // Close WebSocket connection
    closeWebSocketConnection();
    
    console.log('✅ PCM recording cancelled and WebSocket closed');
  }, [closeWebSocketConnection]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      await handleGenerateHooks();
    }
  };

  const handleHookSelect = async (hookNumber: number) => {
    try {
      // Add loading message
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Generating post...",
          isLoading: true,
        },
      ]);

      // Notify backend about the hook selection
      await apiInstance.post(selectHook, null, {
        headers: { "Content-Type": "application/json" },
        params: { hook_number: hookNumber },
      });

      // Generate post content based on selected hook
      await fetchStreamContent();

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
    } catch (error) {
      console.error("Hook selection error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, I couldn't generate the post. Please try again.",
        },
      ]);
      toast({
        title: "Error",
        description: "Failed to generate post",
        variant: "destructive",
      });
    }
  };

  const fetchStreamContent = async () => {
    setIsLoading(true);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(baseURL + generatePostStream, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream available.");

      const decoder = new TextDecoder("utf-8");

      let partialText = "";
      let buffer = ""; // Buffer to collect more complete pieces of text

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the current chunk
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Add to our accumulating text
        partialText += chunk;

        // Only update the UI when we have complete sentences or paragraphs
        // This makes for a more natural reading experience
        if (buffer.match(/[.!?](\s|$)/) || buffer.includes("\n")) {
          buffer = "";
        }
      }

      // Convert the formatted text to HTML
      const formattedHtml = formatTextToHtml(partialText);

      setPost({
        id: Date.now().toString(),
        title: userInput,
        content: formattedHtml,
        type: "Standard",
        author: {
          name: userState?.name || "Your Name",
          position: "Content Writer",
          profilePicture: userState?.profilePicture || "",
        },
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Stream error:", error);
        toast({
          title: "Error",
          description: "Failed to stream content",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSave = async (updatedPost: any) => {
    try {
      // Save the post to the backend
      const response = await apiInstance.post(saveDraftPost, updatedPost);

      toast({
        title: "Success",
        description: "Post saved successfully",
      });

      // Here you would typically redirect to saved posts or clear the current post
      setPost(null);
    } catch (error) {
      console.error("Failed to save post:", error);
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    }
  };

  const handlePostCancel = () => {
    setPost(null);
  };

  // Function to navigate to saved posts
  const handleViewSavedPosts = () => {
    router.push(savedPosts);
  };

  return (
    <>
      {!isTemplateSelected ? (
        <TemplateSelect setIsTemplateSelected={setIsTemplateSelected} />
      ) : (
        <div
          className={cn(
            "min-h-screen flex flex-col",
            theme === "dark"
              ? "bg-[#18181b] text-gray-100"
              : "bg-gray-50 text-gray-900"
          )}
        >
          {post ? (
            <div className="max-w-5xl mx-auto p-6">
              <PostEditor
                post={post}
                onSave={handlePostSave}
                onCancel={handlePostCancel}
              />
            </div>
          ) : (
            <div className="flex-1 container max-w-4xl mx-auto p-4 flex flex-col">
              {/* If no messages, show only centered mic button */}
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center -mt-6 sm:-mt-10 pb-16">
                  <VoicePromptEmptyState
                    title="Start with your voice"
                    description="Tap the mic and speak your healthcare topic. LinkedIn AI will generate a tailored post for you!"
                    isRecording={isRecording}
                    transcript={isRecording ? realtimeTranscript : userInput}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="h-[180px] w-[180px] sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px] lg:h-[260px] lg:w-[260px] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-300 to-indigo-600 opacity-80 shadow-lg">
                        <SpeechInput
                          transcript={userInput}
                          onTranscript={handleTranscript}
                          handleGenerateHooks={handleGenerateHooks}
                          className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 z-20 bg-indigo-400 hover:bg-indigo-500 shadow-xl border-2 border-white/20"
                          iconSize={36}
                          isRecording={isRecording}
                          onStartRecording={handleStartRecording}
                          onStopRecording={handleStopRecording}
                          onCancelRecording={handleCancelRecording}
                          userEmail={userState?.email}
                          wsStatus={wsStatus}
                        />
                        {isRecording && (
                          <Ripple
                            className="z-10"
                            mainCircleSize={80}
                            mainCircleOpacity={0.4}
                            numCircles={5}
                            animationSpeed={1.5}
                            color="rgba(255, 255, 255, 0.15)"
                          />
                        )}
                      </div>

                      {/* Add the buttons here */}
                      {isRecording && (
                        <motion.div
                          className="flex gap-8 mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.button
                            className="flex items-center gap-2 px-8 py-3 bg-[#F4F4F5] text-black rounded-full shadow-md hover:bg-[#e0e2e4] transition-colors"
                            onClick={() => {
                              handleStopRecording();
                              // Hooks will be auto-generated after stopping
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check size={16} />
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-2 px-8 py-3 bg-[#F4F4F5] text-black rounded-full shadow-md hover:bg-[#e0e2e4] transition-colors"
                            onClick={handleCancelRecording}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={16} />
                          </motion.button>
                        </motion.div>
                      )}
                      
                      {/* Remove the manual generate hooks button since it's now automatic */}
                    </div>
                  </VoicePromptEmptyState>
                </div>
              ) : (
                <>
                  {/* Messages Area with header */}
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Generate Post</h1>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleViewSavedPosts}
                    >
                      <Bookmark size={16} />
                      Saved Posts
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "flex gap-3",
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          {message.type === "assistant" && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                              AI
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.type === "user"
                                ? theme === "dark"
                                  ? "bg-blue-900/40 text-blue-200"
                                  : "bg-primary text-primary-foreground"
                                : theme === "dark"
                                  ? "bg-[#232326] text-gray-100"
                                  : "bg-muted"
                            )}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">
                                  {message.isGeneratingHooks
                                    ? "Generating hooks..."
                                    : "Generating post..."}
                                </span>
                              </div>
                            ) : message.hooks && Array.isArray(message.hooks) ? (
                              <div className="space-y-3">
                                <p className="text-sm sm:text-base">
                                  {message.content}
                                </p>
                                <div className="grid gap-2">
                                  {message.hooks.map((hook) => (
                                    <Card
                                      key={`hook-${hook.number}`}
                                      onClick={() =>
                                        handleHookSelect(hook.number)
                                      }
                                      className={cn(
                                        "p-3 transition-all cursor-pointer group mb-2",
                                        theme === "dark"
                                          ? "bg-[#232326] text-gray-100 border border-gray-700 shadow-sm hover:bg-[#2d2d32] hover:border-blue-700"
                                          : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                                      )}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                          <div className="font-small text-sm">
                                            {typeof hook.hook === 'string' ? hook.hook : JSON.stringify(hook.hook)}
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="font-small text-sm">
                                {message.content}
                              </p>
                            )}
                          </div>
                          {message.type === "user" && (
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                              {userState?.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                  {/* Input Area at the Bottom */}
                  <div className="rounded-full border sticky bottom-3">
                    <form
                      onSubmit={handleInputSubmit}
                      className="container max-w-4xl mx-auto p-2 sm:p-3"
                    >
                      <div className="flex items-center gap-2">
                        <SpeechInput
                          transcript={userInput}
                          onTranscript={handleTranscript}
                          handleGenerateHooks={handleGenerateHooks}
                          className="h-11 w-11 bg-indigo-600 hover:bg-indigo-700"
                          isRecording={isRecording}
                          onStartRecording={handleStartRecording}
                          onStopRecording={handleStopRecording}
                          onCancelRecording={handleCancelRecording}
                          userEmail={userState?.email}
                          wsStatus={wsStatus}
                        />
                        <Input
                          type="text"
                          placeholder={isRecording && realtimeTranscript ? 
                            `🎤 ${realtimeTranscript}` : 
                            "Type your topic here..."}
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className={cn(
                            "flex-1 px-3 transition-all duration-300 rounded-full text-sm",
                            messages.length > 0
                              ? "h-10 sm:h-12 sm:text-base"
                              : "h-9 sm:h-10",
                            theme === "dark"
                              ? "bg-[#232326] border border-gray-700 text-gray-100 placeholder:text-white focus:border-blue-700 focus:ring-blue-700"
                              : "bg-white border-gray-200"
                          )}
                          disabled={isLoading}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className={cn(
                            "ml-1 rounded-full bg-indigo-600 hover:bg-indigo-700 h-11 w-11 sm:h-10 sm:w-10"
                          )}
                          disabled={isLoading || !userInput.trim()}
                        >
                          <Send size={16} className="sm:size-6" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
