"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostSchedulerProps {
  onSchedule: (date: Date) => void;
}

export default function PostScheduler({ onSchedule }: PostSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [hour, setHour] = useState<string>(
    format(new Date().setMinutes(0), "HH")
  );
  const [minute, setMinute] = useState<string>("00");

  const handleSchedule = () => {
    if (!date) return;
    
    const scheduledDate = new Date(date);
    scheduledDate.setHours(parseInt(hour));
    scheduledDate.setMinutes(parseInt(minute));
    
    // Check if the scheduled date is in the past
    if (scheduledDate <= new Date()) {
      alert("Scheduled time must be in the future.");
      return;
    }
    
    onSchedule(scheduledDate);
  };

  // Generate hours options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  
  // Generate minutes options (00, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <span className="text-xl">:</span>
            
            <div className="flex-1">
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500 mb-4">
          {date ? (
            <>
              Your post will be published on{" "}
              <span className="font-medium">
                {format(date, "EEEE, MMMM d, yyyy")}
              </span>{" "}
              at{" "}
              <span className="font-medium">
                {hour}:{minute}
              </span>
            </>
          ) : (
            "Select a date and time to schedule your post"
          )}
        </p>
        
        <Button 
          className="w-full"
          onClick={handleSchedule}
          disabled={!date}
        >
          <Clock className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>
    </div>
  );
}