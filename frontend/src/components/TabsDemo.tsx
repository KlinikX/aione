"use client";

import Image from "next/image";
import { Tabs } from "@/components/Tabs";
import appScreen from "../assets/images/app-screen.png";
import Analytics from "../assets/images/Analytics.png";
import Calender from "../assets/images/Calender.png";
import Settings from "../assets/images/Settings.png";
import Generate from "../assets/images/Generate.png";

export function TabsDemo() {
  const tabs = [
    {
      title: "Dashboard",
      value: "Dashboard",
      content: (
        <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-800 to-purple-900">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Dashboard</h2>
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={Analytics}
                alt="Dashboard analytics"
                width="1000"
                height="1000"
                className="object-contain max-h-full w-auto mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Generate Post",
      value: "Post",
      content: (
        <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-700 to-indigo-900">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Generate</h2>
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={Generate}
                alt="Generate post"
                width="1000"
                height="1000"
                className="object-contain max-h-full w-auto mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Schedule",
      value: "calender",
      content: (
        <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-800 to-violet-900">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Schedule</h2>
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={Calender}
                alt="Schedule calendar"
                width="1000"
                height="1000"
                className="object-contain max-h-full w-auto mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      ),
    },
    
    {
      title: "Settings",
      value: "settings",
      content: (
        <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl text-white bg-gradient-to-br from-violet-700 to-purple-900">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Settings</h2>
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={Settings}
                alt="Settings screen"
                width="1000"
                height="1000"
                className="object-contain max-h-full w-auto mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[35rem] md:h-[45rem] [perspective:1200px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <Image
      src={appScreen}
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
