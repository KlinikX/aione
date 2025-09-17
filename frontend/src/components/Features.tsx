'use client';

import EcosystemIcon from "../assets/icons/ecosystem.svg";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  size: string;
  position: string;
  effect: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    title: "Integration Ecosystem",
    description:
      "Enhance your productivity by connecting with your tools, keeping your essentials in one place.",
    icon: <EcosystemIcon />,
    image: "/images/features/integration.jpg",
    size: "col-span-4 md:col-span-3 md:row-span-2",   //  full width on mobile
    position: "left",
    effect: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
  },
  {
    title: "Goal Setting and Tracking",
    description:
      "Define and track your goals, breaking down objectives into achievable tasks to keep your reach in sight.",
    icon: <EcosystemIcon />,
    image: "/images/features/goals.jpg",
    size: "col-span-4 md:col-span-2 md:row-span-2",   //  full width on mobile
    position: "center",
    effect: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
  },
  {
    title: "Secure Data Encryption",
    description:
      "With end-to-end encryption, your data is securely stored and protected from unauthorized access.",
    icon: <EcosystemIcon />,
    image: "/images/features/security.jpg",
    size: "col-span-4 md:col-span-2 md:row-span-2",   //  full width on mobile
    position: "center",
    effect: "hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
  },
  {
    title: "AI-Powered Analytics",
    description:
      "Gain deep insights into your LinkedIn performance with our advanced AI-powered analytics dashboard.",
    icon: <EcosystemIcon />,
    image: "/images/features/analytics.jpg",
    size: "col-span-4 md:col-span-4 md:row-span-2",   //  full width on mobile
    position: "left",
    effect: "hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]"
  },
  {
    title: "Content Scheduling",
    description:
      "Plan and schedule your posts for optimal engagement times with our intelligent scheduling system.",
    icon: <EcosystemIcon />,
    image: "/images/features/scheduling.jpg",
    size: "col-span-4 md:col-span-2 md:row-span-2",   //  full width on mobile
    position: "left",
    effect: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
  },
  {
    title: "Engagement Automation",
    description:
      "Automate your engagement strategy with smart responses and targeted network growth for effective professional networking.",
    icon: <EcosystemIcon />,
    image: "/images/features/automation.jpg",
    size: "col-span-4 md:col-span-7 md:row-span-2",   //  full width on mobile
    position: "center",
    effect: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    highlight: true
  }
];

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

// Feature card component to avoid hooks in map callback
const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`
        bg-[#0a0b17] 
        border border-[#1e1f2e]/60 
        h-72
        rounded-3xl 
        overflow-hidden 
        relative 
        ${feature.size} 
        ${feature.effect}
        transition-all duration-300 ease-in-out
        ${feature.highlight ? 'ring-1 ring-green-500/30' : ''}
      `}
    >
      {feature.image && (
        <div className="absolute inset-0 opacity-40 transition-opacity duration-500 hover:opacity-60">
          <Image
            src={feature.image}
            alt={feature.title || "Feature"}
            fill
            className="object-cover"
            priority={index < 3}
          />
        </div>
      )}

      {/* Animated Gradient Overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${index % 5 === 0
          ? 'from-blue-900/30 to-[#0a0b17]/70'
          : index % 5 === 1
            ? 'from-purple-900/30 to-[#0a0b17]/70'
            : index % 5 === 2
              ? 'from-red-900/30 to-[#0a0b17]/70'
              : index % 5 === 3
                ? 'from-amber-900/30 to-[#0a0b17]/70'
                : 'from-teal-900/30 to-[#0a0b17]/70'
          }`}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      ></motion.div>

      <div className={`absolute inset-0 bg-gradient-to-br ${index % 5 === 0 ? 'from-blue-900/30 to-[#0a0b17]/70' :
        index % 5 === 1 ? 'from-purple-900/30 to-[#0a0b17]/70' :
          index % 5 === 2 ? 'from-red-900/30 to-[#0a0b17]/70' :
            index % 5 === 3 ? 'from-amber-900/30 to-[#0a0b17]/70' :
              'from-teal-900/30 to-[#0a0b17]/70'
        }`}></div>

      <div className={`relative z-10 h-full p-8 flex flex-col ${feature.position === 'center' ? 'justify-center items-center text-center' :
        'justify-between items-start text-left'
        }`}>
        <motion.div
          className={`inline-flex h-14 w-14 bg-black/40 backdrop-blur-sm text-white justify-center items-center rounded-xl mb-4 ${feature.highlight ? "ring-1 ring-green-400" : ""
            }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {feature.icon}
        </motion.div>

        <div>
          <h3 className={`font-bold text-2xl mb-2 ${feature.highlight ? 'text-green-400' : ''}`}>
            {feature.title}
          </h3>
          <p className="text-white/70 text-sm">{feature.description}</p>

          {feature.highlight && (
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-green-400/10 px-2.5 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/30">
                Featured
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Features = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: false, amount: 0.5 });

  return (
    <div className="relative bg-[#0a0b17] text-white py-[72px] sm:py-36 overflow-hidden">
      <div className="container px-4 mx-auto relative z-[20]">
        <motion.div
  ref={titleRef}
  initial={{ opacity: 0, y: 50 }}
  animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-center mb-16 relative z-[9999]"
>
  <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter relative z-[9999]" style={{ zIndex: 9999 }}>
    The first human-quality{" "}
    <span className="border-b-[0.3rem] border-blue-500">LinkedIn</span> tool
  </h2>
  <div className="max-w-2xl mx-auto relative z-[9999]">
    <div className="bg-[#0a0b17]/30 backdrop-blur-sm rounded-lg p-4 mt-6 sm:mt-8 md:mt-10">
      <p className="text-base sm:text-lg md:text-xl text-white/70 relative z-[9999]" style={{ zIndex: 9999 }}>
        LinkedAI simplifies strategy and content creation for LinkedIn by
        turning unstructured voice, video and text inputs into personalized
        social posts with human-level quality.
      </p>
    </div>
  </div>
</motion.div>


  <div className="grid grid-cols-4 md:grid-cols-7 gap-4 md:gap-6 max-w-7xl mx-auto relative z-[20]">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title || `feature-${index}`}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
