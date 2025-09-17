"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, FileText, BarChart2, Users, Zap, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { generatePost, schedulePost } from "@/constant/routes";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  // Add CSS animation for the marquee
  useEffect(() => {
    const marqueeAnimation = `
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      
      .animate-marquee {
        animation: marquee 40s linear infinite;
      }
    `;

    const style = document.createElement('style');
    style.innerHTML = marqueeAnimation;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);


  const chartsData: Record<string, { name: string; value: number }[]> = {
    "Posts Generated": [
      { name: "Week 1", value: 20 },
      { name: "Week 2", value: 15 },
      { name: "Week 3", value: 25 },
      { name: "Week 4", value: 25 },
    ],
    "Scheduled Posts": [
      { name: "Week 1", value: 4 },
      { name: "Week 2", value: 3 },
      { name: "Week 3", value: 2 },
      { name: "Week 4", value: 3 },
    ],
    "Engagement Rate": [
      { name: "Week 1", value: 4.2 },
      { name: "Week 2", value: 4.5 },
      { name: "Week 3", value: 5.0 },
      { name: "Week 4", value: 4.8 },
    ],
    "Post Views": [
      { name: "Week 1", value: 2500 },
      { name: "Week 2", value: 3000 },
      { name: "Week 3", value: 3500 },
      { name: "Week 4", value: 4500 },
    ],
  };

  // Mock data for demonstration
  const stats = [
    {
      title: "Posts Generated",
      value: "85",
      description: "this month",
      limit: "100",
      progress: 85,
    },
    {
      title: "Scheduled Posts",
      value: "12",
      description: "active schedules",
      limit: "20",
      progress: 60,
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      description: "30 day average",
      trend: "+0.6%",
    },
    {
      title: "Post Views",
      value: "12.5K",
      description: "30 day total",
      trend: "+22%",
    },
  ];

  const recentPosts = [
    {
      title: "Latest Research in Cardiovascular Health",
      date: "2 hours ago",
      status: "Published",
      engagement: "324 views",
    },
    {
      title: "Mental Health Awareness in Healthcare",
      date: "Yesterday",
      status: "Scheduled",
      scheduledFor: "Tomorrow, 9:00 AM",
    },
    {
      title: "Advancements in Telemedicine",
      date: "2 days ago",
      status: "Published",
      engagement: "1.2K views",
    },
  ];

  const upcomingSchedule = [
    {
      title: "Patient Care Best Practices",
      date: "May 6, 2024",
      time: "10:00 AM",
      type: "Healthcare Tips",
    },
    {
      title: "Medical Technology Trends 2024",
      date: "May 7, 2024",
      time: "2:30 PM",
      type: "Industry Insights",
    },
    {
      title: "Healthcare Leadership Spotlight",
      date: "May 8, 2024",
      time: "11:00 AM",
      type: "Professional Growth",
    },
  ];

  const [selectedStat, setSelectedStat] = useState(stats[0].title);

  return (
    <>
      <div className={`min-h-screen w-full flex flex-col gap-6 md:gap-8 p-4 md:p-8 ${darkMode ? 'bg-[#18181b] text-gray-100' : 'bg-white text-gray-900'}`}>
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h2>
            <p className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your LinkedIn content for healthcare professionals
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => router.push(generatePost)}
              className={`bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(schedulePost)}
              className={`${darkMode
                ? 'bg-[#232326] border border-gray-600 text-gray-200 hover:bg-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'} flex items-center w-full sm:w-auto`}
            >
              <Clock className="mr-2 h-4 w-4" />
              Schedule Posts
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card onClick={() => setSelectedStat(stat.title)} key={index} className={`${darkMode ? 'bg-[#232326] border-[#232326] hover:bg-[#232326]/90' : 'bg-white hover:bg-gray-50'} cursor-pointer transition-colors`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {stat.title}
                </CardTitle>
                {index === 0 && <FileText className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                {index === 1 && <Calendar className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                {index === 2 && <BarChart2 className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                {index === 3 && <Users className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                  {stat.limit && (
                    <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      of {stat.limit}
                    </div>
                  )}
                  {stat.trend && (
                    <div className={`text-xs md:text-sm ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className={`text-[11px] md:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  {stat.description}
                </p>
                {stat.progress && (
                  <Progress
                    value={stat.progress}
                    className={`mt-3 h-2 
      ${darkMode ? 'bg-gray-500 [&>div]:bg-gray-100' : 'bg-gray-200 [&>div]:bg-gray-500'}
    `}
                  />
                )}

              </CardContent>
            </Card>
          ))}
        </div>


        {/* Chart Area */}
        <div className={`p-3 md:p-4 rounded-lg ${darkMode ? "bg-[#232326]" : "bg-white"}`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {selectedStat} Overview
          </h3>
          <div className="h-[220px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartsData[selectedStat]}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
              <XAxis dataKey="name" stroke={darkMode ? "#aaa" : "#333"} />
              <YAxis stroke={darkMode ? "#aaa" : "#333"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff", // dark gray for dark mode, white for light mode
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: darkMode ? "#f9fafb" : "#111827", // light text in dark mode, dark text in light
                  fontWeight: 500,
                }}
                itemStyle={{
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={darkMode ? "#4ade80" : "#2563eb"}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Posts */}
          <Card className={`${darkMode ? 'bg-[#232326] border-[#232326]' : 'bg-white'}`}>
            <CardHeader>
        <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} text-base md:text-lg`}>Recent Posts</CardTitle>
        <CardDescription className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                Your latest LinkedIn content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 cursor-pointer">
                {recentPosts.map((post, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-0 pb-4 last:pb-0`}
                  >
                    <div className="space-y-1">
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-sm md:text-base`}>{post.title}</p>
          <div className={`flex items-center text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span className={post.status === "Published"
                          ? (darkMode ? 'text-green-400' : 'text-green-500')
                          : (darkMode ? 'text-blue-400' : 'text-blue-500')}>
                          {post.status}
                        </span>
                      </div>
          <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {post.engagement || post.scheduledFor}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${darkMode ? 'hover:bg-[#232326]/80' : 'hover:bg-gray-100'}`}
                    >
                      <ArrowRight className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card className={`${darkMode ? 'bg-[#232326] border-[#232326]' : 'bg-white'}`}>
            <CardHeader>
        <CardTitle className={`${darkMode ? 'text-white' : 'text-gray-900'} text-base md:text-lg`}>Upcoming Schedule</CardTitle>
        <CardDescription className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                Posts scheduled for publication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 cursor-pointer">
                {upcomingSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-0 pb-4 last:pb-0`}
                  >
                    <div className="space-y-1">
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-sm md:text-base`}>{schedule.title}</p>
            <div className={`flex items-center text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>{schedule.date}</span>
                        <span className="mx-2">•</span>
                        <Clock className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span>{schedule.time}</span>
                      </div>
            <div className={`text-xs md:text-sm ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                        {schedule.type}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${darkMode ? 'hover:bg-[#232326]/80' : 'hover:bg-gray-100'}`}
                    >
                      <ArrowRight className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Banner */}
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-1.5 md:py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee inline-block">
      <span className="text-white font-semibold mx-4 text-xs md:text-sm">🔍 PREVIEW MODE - This is a demonstration dashboard with sample data</span>
      <span className="text-white font-semibold mx-4 text-xs md:text-sm">🔍 PREVIEW MODE - Sample healthcare content for demonstration purposes only</span>
      <span className="text-white font-semibold mx-4 text-xs md:text-sm">🔍 PREVIEW MODE - Features and data shown are for illustration</span>
        </div>
      </div>
    </>
  );
}
