"use client";

import React, { useState } from "react";
import { Tabs as RadixTabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  title: string;
  value: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);

  return (
    <RadixTabs 
      defaultValue={tabs[0]?.value} 
      className="w-full h-full flex flex-col"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-4 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="relative w-full flex-1">
        {tabs.map((tab, index) => (
          <AnimatePresence key={tab.value} mode="wait">
            <motion.div
              initial={{ 
                scale: 0.9, 
                opacity: 0.5,
                rotateX: "10deg",
                y: 40,
                zIndex: 10 - index
              }}
              animate={{ 
                scale: tab.value === activeTab ? 1 : 0.95 - (index * 0.05),
                opacity: tab.value === activeTab ? 1 : 0.7 - (index * 0.1),
                rotateX: tab.value === activeTab ? "0deg" : "10deg",
                y: tab.value === activeTab ? 0 : 40 + (index * 10),
                zIndex: tab.value === activeTab ? 20 : 10 - index
              }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 100 
              }}
              className="absolute inset-0 overflow-hidden"
              style={{
                transformOrigin: "bottom center",
                filter: tab.value === activeTab ? "none" : "brightness(0.9)"
              }}
            >
              <TabsContent 
                value={tab.value} 
                forceMount
                className="w-full h-full overflow-hidden"
              >
                {tab.content}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </RadixTabs>
  );
} 