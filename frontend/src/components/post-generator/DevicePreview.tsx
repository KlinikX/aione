"use client";

import { Monitor, Smartphone } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface DevicePreviewProps {
  currentDevice: "desktop" | "mobile";
  onChange: (device: "desktop" | "mobile") => void;
}

export default function DevicePreview({ currentDevice, onChange }: DevicePreviewProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <div className="device-preview-toggle">
      <ToggleGroup type="single" value={currentDevice} onValueChange={(value) => onChange(value as "desktop" | "mobile")}>
        <ToggleGroupItem value="desktop" aria-label="Desktop view">
          <Monitor size={16} className="mr-1" />
          <span className="text-xs">Desktop</span>
          {currentDevice === "desktop" && (
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-white' : 'bg-black'}`}
              layoutId="device-indicator"
            />
          )}
        </ToggleGroupItem>
        <ToggleGroupItem value="mobile" aria-label="Mobile view">
          <Smartphone size={16} className="mr-1" />
          <span className="text-xs">Mobile</span>
          {currentDevice === "mobile" && (
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-white' : 'bg-black'}`}
              layoutId="device-indicator"
            />
          )}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}